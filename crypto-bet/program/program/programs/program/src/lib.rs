use anchor_lang::prelude::*;

declare_id!("4Gd64thyhLeqyLxDz8Ae5Z98qXdqwJrcAYkS6g3Yzy5V");

#[program]
pub mod program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
