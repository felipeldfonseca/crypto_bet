use anchor_lang::prelude::*;

// Use the correct program ID from Anchor.toml
declare_id!("4Gd64thyhLeqyLxDz8Ae5Z98qXdqwJrcAYkS6g3Yzy5V");

// Constants for supported tokens
pub const SOL_MINT: Pubkey = Pubkey::new_from_array([0; 32]); // Native SOL (placeholder)
pub const USDC_MINT: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // USDC mainnet

#[program]
pub mod crypto_bet {
    use super::*;

    /// Initialize a new prediction market
    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        market_id: u64,
        title: String,
        description: String,
        category: String,
        resolution_time: i64,
        market_type: MarketType,
    ) -> Result<()> {
        require!(title.len() <= 100, CryptoBetError::TitleTooLong);
        require!(description.len() <= 500, CryptoBetError::DescriptionTooLong);
        require!(category.len() <= 50, CryptoBetError::CategoryTooLong);
        require!(resolution_time > Clock::get()?.unix_timestamp, CryptoBetError::InvalidResolutionTime);

        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.market_id = market_id;
        market.title = title;
        market.description = description;
        market.category = category;
        market.resolution_time = resolution_time;
        market.state = MarketState::Active;
        market.market_type = market_type;
        market.total_yes_amount = 0;
        market.total_no_amount = 0;
        market.total_volume = 0;
        market.resolved_outcome = None;
        market.created_at = Clock::get()?.unix_timestamp;
        market.bump = ctx.bumps.market;

        emit!(MarketCreated {
            market: market.key(),
            market_id,
            title: market.title.clone(),
            category: market.category.clone(),
            resolution_time,
            market_type,
        });

        Ok(())
    }

    /// Place a bet on a market (SOL only for now)
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        side: BetSide,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, CryptoBetError::InvalidAmount);
        require!(amount >= MIN_BET_AMOUNT, CryptoBetError::BetTooSmall);
        require!(amount <= MAX_BET_AMOUNT, CryptoBetError::BetTooLarge);

        {
            let market = &ctx.accounts.market;
        require!(market.state == MarketState::Active, CryptoBetError::MarketNotActive);
        require!(Clock::get()?.unix_timestamp < market.resolution_time, CryptoBetError::MarketExpired);
        }

        // SOL transfer
                let cpi_context = CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    anchor_lang::system_program::Transfer {
                        from: ctx.accounts.user.to_account_info(),
                        to: ctx.accounts.market.to_account_info(),
                    },
                );
                anchor_lang::system_program::transfer(cpi_context, amount)?;

        let market = &mut ctx.accounts.market;

        // Update market totals
        match side {
            BetSide::Yes => {
                market.total_yes_amount = market.total_yes_amount
                    .checked_add(amount)
                    .ok_or(CryptoBetError::MathOverflow)?;
            }
            BetSide::No => {
                market.total_no_amount = market.total_no_amount
                    .checked_add(amount)
                    .ok_or(CryptoBetError::MathOverflow)?;
            }
        }
        market.total_volume = market.total_volume
            .checked_add(amount)
            .ok_or(CryptoBetError::MathOverflow)?;

        // Initialize or update user position
        let position = &mut ctx.accounts.position;
        if position.user == Pubkey::default() {
            position.user = ctx.accounts.user.key();
            position.market = market.key();
            position.yes_shares = 0;
            position.no_shares = 0;
            position.total_invested = 0;
            position.bump = ctx.bumps.position;
        }

        // Update position
        match side {
            BetSide::Yes => {
                position.yes_shares = position.yes_shares
                    .checked_add(amount)
                    .ok_or(CryptoBetError::MathOverflow)?;
            }
            BetSide::No => {
                position.no_shares = position.no_shares
                    .checked_add(amount)
                    .ok_or(CryptoBetError::MathOverflow)?;
            }
        }
        position.total_invested = position.total_invested
            .checked_add(amount)
            .ok_or(CryptoBetError::MathOverflow)?;

        emit!(BetPlaced {
            market: market.key(),
            user: ctx.accounts.user.key(),
            side,
            amount,
            new_yes_total: market.total_yes_amount,
            new_no_total: market.total_no_amount,
            market_type: market.market_type,
        });

        Ok(())
    }

    /// Resolve a market with the final outcome
    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        outcome: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(market.state == MarketState::Active, CryptoBetError::MarketNotActive);
        require!(Clock::get()?.unix_timestamp >= market.resolution_time, CryptoBetError::MarketNotExpired);

        market.state = MarketState::Resolved;
        market.resolved_outcome = Some(outcome);

        emit!(MarketResolved {
            market: market.key(),
            outcome,
            total_volume: market.total_volume,
            market_type: market.market_type,
        });

        Ok(())
    }
}

// Context Structs

#[derive(Accounts)]
#[instruction(market_id: u64)]
pub struct InitializeMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Market::LEN,
        seeds = [b"market", market_id.to_string().as_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(
        mut,
        seeds = [b"market", market.market_id.to_string().as_bytes()],
        bump = market.bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Position::LEN,
        seeds = [b"position", market.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub position: Account<'info, Position>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(
        mut,
        seeds = [b"market", market.market_id.to_string().as_bytes()],
        bump = market.bump,
        has_one = authority
    )]
    pub market: Account<'info, Market>,
    
    pub authority: Signer<'info>,
}

// Account Structs

#[account]
pub struct Market {
    pub authority: Pubkey,          // 32
    pub market_id: u64,             // 8
    pub title: String,              // 4 + 100
    pub description: String,        // 4 + 500
    pub category: String,           // 4 + 50
    pub resolution_time: i64,       // 8
    pub state: MarketState,         // 1
    pub market_type: MarketType,    // 1
    pub total_yes_amount: u64,      // 8
    pub total_no_amount: u64,       // 8
    pub total_volume: u64,          // 8
    pub resolved_outcome: Option<bool>, // 1 + 1
    pub created_at: i64,            // 8
    pub bump: u8,                   // 1
}

impl Market {
    pub const LEN: usize = 32 + 8 + (4 + 100) + (4 + 500) + (4 + 50) + 8 + 1 + 1 + 8 + 8 + 8 + 2 + 8 + 1;
}

#[account]
pub struct Position {
    pub user: Pubkey,           // 32
    pub market: Pubkey,         // 32
    pub yes_shares: u64,        // 8
    pub no_shares: u64,         // 8
    pub total_invested: u64,    // 8
    pub bump: u8,               // 1
}

impl Position {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 1;
}

// Enums

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum MarketState {
    Active,
    Resolved,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Copy)]
pub enum MarketType {
    Degen,      // SOL betting
    Stable,     // USDC betting
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BetSide {
    Yes,
    No,
}

// Events

#[event]
pub struct MarketCreated {
    pub market: Pubkey,
    pub market_id: u64,
    pub title: String,
    pub category: String,
    pub resolution_time: i64,
    pub market_type: MarketType,
}

#[event]
pub struct BetPlaced {
    pub market: Pubkey,
    pub user: Pubkey,
    pub side: BetSide,
    pub amount: u64,
    pub new_yes_total: u64,
    pub new_no_total: u64,
    pub market_type: MarketType,
}

#[event]
pub struct MarketResolved {
    pub market: Pubkey,
    pub outcome: bool,
    pub total_volume: u64,
    pub market_type: MarketType,
}

// Errors

#[error_code]
pub enum CryptoBetError {
    #[msg("Title is too long (max 100 characters)")]
    TitleTooLong,
    #[msg("Description is too long (max 500 characters)")]
    DescriptionTooLong,
    #[msg("Category is too long (max 50 characters)")]
    CategoryTooLong,
    #[msg("Resolution time must be in the future")]
    InvalidResolutionTime,
    #[msg("Invalid bet amount")]
    InvalidAmount,
    #[msg("Bet amount is too small")]
    BetTooSmall,
    #[msg("Bet amount is too large")]
    BetTooLarge,
    #[msg("Market is not active")]
    MarketNotActive,
    #[msg("Market has expired")]
    MarketExpired,
    #[msg("Market has not expired yet")]
    MarketNotExpired,
    #[msg("Math overflow")]
    MathOverflow,
}

// Constants
pub const MIN_BET_AMOUNT: u64 = 1_000_000; // 0.001 SOL
pub const MAX_BET_AMOUNT: u64 = 1_000_000_000_000; // 1,000 SOL 