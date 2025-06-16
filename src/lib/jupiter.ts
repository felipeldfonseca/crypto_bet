import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// Jupiter API Configuration
const JUPITER_API_BASE_URL = 'https://quote-api.jup.ag/v6';

// Token addresses
export const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
} as const;

export type TokenType = keyof typeof TOKENS;

export interface SwapQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
}

export interface SwapRequest {
  fromToken: TokenType;
  toToken: TokenType;
  amount: number; // in base units (lamports for SOL, micro-USDC for USDC)
  slippageBps?: number; // basis points (default 50 = 0.5%)
  userPublicKey: string;
}

/**
 * Get a quote for token swap from Jupiter
 */
export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<SwapQuote> {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
  });

  const response = await fetch(`${JUPITER_API_BASE_URL}/quote?${params}`);
  
  if (!response.ok) {
    throw new Error(`Jupiter API error: ${response.status} ${response.statusText}`);
  }

  const quote = await response.json();
  return quote;
}

/**
 * Get swap transaction from Jupiter
 */
export async function getSwapTransaction(
  quote: SwapQuote,
  userPublicKey: string,
  wrapAndUnwrapSol: boolean = true
): Promise<string> {
  const response = await fetch(`${JUPITER_API_BASE_URL}/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey,
      wrapAndUnwrapSol,
    }),
  });

  if (!response.ok) {
    throw new Error(`Jupiter swap transaction error: ${response.status} ${response.statusText}`);
  }

  const { swapTransaction } = await response.json();
  return swapTransaction;
}

/**
 * Execute a token swap
 */
export async function executeSwap(
  connection: Connection,
  swapRequest: SwapRequest,
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>
): Promise<string> {
  try {
    // Get quote
    const inputMint = TOKENS[swapRequest.fromToken];
    const outputMint = TOKENS[swapRequest.toToken];
    
    const quote = await getSwapQuote(
      inputMint,
      outputMint,
      swapRequest.amount,
      swapRequest.slippageBps
    );

    // Get swap transaction
    const swapTransactionBase64 = await getSwapTransaction(
      quote,
      swapRequest.userPublicKey
    );

    // Deserialize transaction
    const swapTransactionBuf = Buffer.from(swapTransactionBase64, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Sign transaction
    const signedTransaction = await signTransaction(transaction);

    // Send transaction
    const signature = await connection.sendTransaction(signedTransaction as VersionedTransaction);
    
    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  } catch (error) {
    console.error('Swap execution failed:', error);
    throw new Error(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert SOL amount to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1e9);
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}

/**
 * Convert USDC amount to micro-USDC
 */
export function usdcToMicroUsdc(usdc: number): number {
  return Math.floor(usdc * 1e6);
}

/**
 * Convert micro-USDC to USDC
 */
export function microUsdcToUsdc(microUsdc: number): number {
  return microUsdc / 1e6;
}

/**
 * Format number for display
 */
export function formatTokenAmount(amount: number, decimals: number = 6): string {
  if (amount === 0) return '0';
  
  if (amount < 0.000001) {
    return amount.toExponential(2);
  }
  
  return amount.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Get token decimals
 */
export function getTokenDecimals(token: TokenType): number {
  switch (token) {
    case 'SOL':
      return 9;
    case 'USDC':
      return 6;
    default:
      return 6;
  }
}

/**
 * Calculate USD value from token amount
 */
export async function getTokenPrice(tokenMint: string): Promise<number> {
  try {
    const response = await fetch(`https://price.jup.ag/v4/price?ids=${tokenMint}`);
    const data = await response.json();
    return data.data[tokenMint]?.price || 0;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return 0;
  }
} 