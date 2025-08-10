/**
 * 1-Click API Supported Tokens Database
 * 
 * This file contains all 94 supported tokens across different blockchains
 * with their essential metadata: symbol, assetId, and decimals
 */

export interface Token {
  symbol: string;
  assetId: string;
  decimals: number;
  blockchain: string;
}

export const TOKENS_DATABASE: Token[] = [
  // ARB Chain
  { symbol: 'ARB', assetId: 'nep141:arb-0x912ce59144191c1204e64559fe8253a0e49e6548.omft.near', decimals: 18, blockchain: 'ARB' },
  { symbol: 'ETH', assetId: 'nep141:arb.omft.near', decimals: 18, blockchain: 'ARB' },
  { symbol: 'GMX', assetId: 'nep141:arb-0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a.omft.near', decimals: 18, blockchain: 'ARB' },
  { symbol: 'SWEAT', assetId: 'nep141:arb-0xca7dec8550f43a5e46e3dfb95801f64280e75b27.omft.near', decimals: 18, blockchain: 'ARB' },
  { symbol: 'USDC', assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near', decimals: 6, blockchain: 'ARB' },
  { symbol: 'USDT', assetId: 'nep141:arb-0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9.omft.near', decimals: 6, blockchain: 'ARB' },

  // AVAX Chain
  { symbol: 'AVAX', assetId: 'nep245:v2_1.omni.hot.tg:43114_11111111111111111111', decimals: 18, blockchain: 'AVAX' },
  { symbol: 'USDC', assetId: 'nep245:v2_1.omni.hot.tg:43114_3atVJH3r5c4GqiSYmg9fECvjc47o', decimals: 6, blockchain: 'AVAX' },
  { symbol: 'USDT', assetId: 'nep245:v2_1.omni.hot.tg:43114_372BeH7ENZieCaabwkbWkBiTTgXp', decimals: 6, blockchain: 'AVAX' },

  // BASE Chain
  { symbol: 'BRETT', assetId: 'nep141:base-0x532f27101965dd16442e59d40670faf5ebb142e4.omft.near', decimals: 18, blockchain: 'BASE' },
  { symbol: 'cbBTC', assetId: 'nep141:base-0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf.omft.near', decimals: 8, blockchain: 'BASE' },
  { symbol: 'ETH', assetId: 'nep141:base.omft.near', decimals: 18, blockchain: 'BASE' },
  { symbol: 'FMS', assetId: 'nep141:base-0xa5c67d8d37b88c2d88647814da5578128e2c93b2.omft.near', decimals: 18, blockchain: 'BASE' },
  { symbol: 'KAITO', assetId: 'nep141:base-0x98d0baa52b2d063e780de12f615f963fe8537553.omft.near', decimals: 18, blockchain: 'BASE' },
  { symbol: 'SWEAT', assetId: 'nep141:base-0x227d920e20ebac8a40e7d6431b7d724bb64d7245.omft.near', decimals: 18, blockchain: 'BASE' },
  { symbol: 'USDC', assetId: 'nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near', decimals: 6, blockchain: 'BASE' },

  // BERA Chain
  { symbol: 'BERA', assetId: 'nep141:bera.omft.near', decimals: 18, blockchain: 'BERA' },

  // BSC Chain
  { symbol: 'BNB', assetId: 'nep245:v2_1.omni.hot.tg:56_11111111111111111111', decimals: 18, blockchain: 'BSC' },
  { symbol: 'RHEA', assetId: 'nep245:v2_1.omni.hot.tg:56_24S22V8GMmQN8t6PbCdRb3mBewAd', decimals: 18, blockchain: 'BSC' },
  { symbol: 'SWEAT', assetId: 'nep245:v2_1.omni.hot.tg:56_28V9BijGeZDBFEEtkAcnJo4tPRH4', decimals: 18, blockchain: 'BSC' },
  { symbol: 'USDC', assetId: 'nep245:v2_1.omni.hot.tg:56_2w93GqMcEmQFDru84j3HZZWt557r', decimals: 6, blockchain: 'BSC' },
  { symbol: 'USDT', assetId: 'nep245:v2_1.omni.hot.tg:56_2CMMyVTGZkeyNZTSvS5sarzfir6g', decimals: 6, blockchain: 'BSC' },

  // BTC Chain
  { symbol: 'BTC', assetId: 'nep141:btc.omft.near', decimals: 8, blockchain: 'BTC' },

  // CARDANO Chain
  { symbol: 'ADA', assetId: 'nep141:cardano.omft.near', decimals: 6, blockchain: 'CARDANO' },

  // DOGE Chain
  { symbol: 'DOGE', assetId: 'nep141:doge.omft.near', decimals: 8, blockchain: 'DOGE' },

  // ETH Chain
  { symbol: 'AAVE', assetId: 'nep141:eth-0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'AURORA', assetId: 'nep141:eth-0xaaaaaa20d9e0e2461697782ef11675f668207961.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'cbBTC', assetId: 'nep141:eth-0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf.omft.near', decimals: 8, blockchain: 'ETH' },
  { symbol: 'DAI', assetId: 'nep141:eth-0x6b175474e89094c44da98b954eedeac495271d0f.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'ETH', assetId: 'nep141:eth.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'HAPI', assetId: 'nep141:eth-0xd9c2d319cd7e6177336b0a9c93c21cb48d84fb54.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'KNC', assetId: 'nep141:eth-0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'LINK', assetId: 'nep141:eth-0x514910771af9ca656af840dff83e8264ecf986ca.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'MOG', assetId: 'nep141:eth-0xaaee1a9723aadb7afa2810263653a34ba2c21c7a.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'PEPE', assetId: 'nep141:eth-0x6982508145454ce325ddbe47a25d4ec3d2311933.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'SHIB', assetId: 'nep141:eth-0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'SWEAT', assetId: 'nep141:eth-0xb4b9dc1c77bdbb135ea907fd5a08094d98883a35.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'TURBO', assetId: 'nep141:eth-0xa35923162c49cf95e6bf26623385eb431ad920d3.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'UNI', assetId: 'nep141:eth-0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'USD1', assetId: 'nep141:eth-0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'USDC', assetId: 'nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near', decimals: 6, blockchain: 'ETH' },
  { symbol: 'USDf', assetId: 'nep141:eth-0xfa2b947eec368f42195f24f36d2af29f7c24cec2.omft.near', decimals: 18, blockchain: 'ETH' },
  { symbol: 'USDT', assetId: 'nep141:eth-0xdac17f958d2ee523a2206206994597c13d831ec7.omft.near', decimals: 6, blockchain: 'ETH' },

  // GNOSIS Chain
  { symbol: 'COW', assetId: 'nep141:gnosis-0x177127622c4a00f3d409b75571e12cb3c8973d3c.omft.near', decimals: 18, blockchain: 'GNOSIS' },
  { symbol: 'GNO', assetId: 'nep141:gnosis-0x9c58bacc331c9aa871afd802db6379a98e80cedb.omft.near', decimals: 18, blockchain: 'GNOSIS' },
  { symbol: 'SAFE', assetId: 'nep141:gnosis-0x4d18815d14fe5c3304e87b3fa18318baa5c23820.omft.near', decimals: 18, blockchain: 'GNOSIS' },
  { symbol: 'USDC', assetId: 'nep141:gnosis-0x2a22f9c3b484c3629090feed35f17ff8f88f76f0.omft.near', decimals: 6, blockchain: 'GNOSIS' },
  { symbol: 'WETH', assetId: 'nep141:gnosis-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1.omft.near', decimals: 18, blockchain: 'GNOSIS' },
  { symbol: 'xDAI', assetId: 'nep141:gnosis.omft.near', decimals: 18, blockchain: 'GNOSIS' },

  // NEAR Chain
  { symbol: 'ABG', assetId: 'nep141:abg-966.meme-cooking.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'AURORA', assetId: 'nep141:aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'BLACKDRAGON', assetId: 'nep141:blackdragon.tkn.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'BTC', assetId: 'nep141:nbtc.bridge.near', decimals: 8, blockchain: 'NEAR' },
  { symbol: 'ETH', assetId: 'nep141:eth.bridge.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'FRAX', assetId: 'nep141:853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'GNEAR', assetId: 'nep141:gnear-229.meme-cooking.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'HAPI', assetId: 'nep141:d9c2d319cd7e6177336b0a9c93c21cb48d84fb54.factory.bridge.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'mpDAO', assetId: 'nep141:mpdao-token.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'NOEAR', assetId: 'nep141:noear-324.meme-cooking.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'PURGE', assetId: 'nep141:purge-558.meme-cooking.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'RHEA', assetId: 'nep141:token.rhealab.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'SHITZU', assetId: 'nep141:token.0xshitzu.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'SWEAT', assetId: 'nep141:token.sweat', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'TESTNEBULA', assetId: 'nep141:test-token.highdome3013.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'TURBO', assetId: 'nep141:a35923162c49cf95e6bf26623385eb431ad920d3.factory.bridge.near', decimals: 18, blockchain: 'NEAR' },
  { symbol: 'USDC', assetId: 'nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1', decimals: 6, blockchain: 'NEAR' },
  { symbol: 'USDT', assetId: 'nep141:usdt.tether-token.near', decimals: 6, blockchain: 'NEAR' },
  { symbol: 'wBTC', assetId: 'nep141:2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near', decimals: 8, blockchain: 'NEAR' },
  { symbol: 'wNEAR', assetId: 'nep141:wrap.near', decimals: 24, blockchain: 'NEAR' },

  // OP Chain
  { symbol: 'ETH', assetId: 'nep245:v2_1.omni.hot.tg:10_11111111111111111111', decimals: 18, blockchain: 'OP' },
  { symbol: 'OP', assetId: 'nep245:v2_1.omni.hot.tg:10_vLAiSt9KfUGKpw5cD3vsSyNYBo7', decimals: 18, blockchain: 'OP' },
  { symbol: 'USDC', assetId: 'nep245:v2_1.omni.hot.tg:10_A2ewyUyDp6qsue1jqZsGypkCxRJ', decimals: 6, blockchain: 'OP' },
  { symbol: 'USDT', assetId: 'nep245:v2_1.omni.hot.tg:10_359RPSJVdTxwTJT9TyGssr2rFoWo', decimals: 6, blockchain: 'OP' },

  // POL Chain
  { symbol: 'POL', assetId: 'nep245:v2_1.omni.hot.tg:137_11111111111111111111', decimals: 18, blockchain: 'POL' },
  { symbol: 'USDC', assetId: 'nep245:v2_1.omni.hot.tg:137_qiStmoQJDQPTebaPjgx5VBxZv6L', decimals: 6, blockchain: 'POL' },
  { symbol: 'USDT', assetId: 'nep245:v2_1.omni.hot.tg:137_3hpYoaLtt8MP1Z2GH1U473DMRKgr', decimals: 6, blockchain: 'POL' },

  // SOL Chain
  { symbol: '$WIF', assetId: 'nep141:sol-b9c68f94ec8fd160137af8cdfe5e61cd68e2afba.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'BOME', assetId: 'nep141:sol-57d087fd8c460f612f8701f5499ad8b2eec5ab68.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'LOUD', assetId: 'nep141:sol-bb27241c87aa401cc963c360c175dd7ca7035873.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'MELANIA', assetId: 'nep141:sol-d600e625449a4d9380eaf5e3265e54c90d34e260.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'SOL', assetId: 'nep141:sol.omft.near', decimals: 9, blockchain: 'SOL' },
  { symbol: 'TRUMP', assetId: 'nep141:sol-c58e6539c2f2e097c251f8edf11f9c03e581f8d4.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'TURBO', assetId: 'nep141:sol-df27d7abcc1c656d4ac3b1399bbfbba1994e6d8c.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'USDC', assetId: 'nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'USDT', assetId: 'nep141:sol-c800a4bd850783ccb82c2b2c7e84175443606352.omft.near', decimals: 6, blockchain: 'SOL' },
  { symbol: 'xBTC', assetId: 'nep141:sol-91914f13d3b54f8126a2824d71632d4b078d7403.omft.near', decimals: 6, blockchain: 'SOL' },

  // SUI Chain
  { symbol: 'SUI', assetId: 'nep141:sui.omft.near', decimals: 9, blockchain: 'SUI' },
  { symbol: 'USDC', assetId: 'nep141:sui-c1b81ecaf27933252d31a963bc5e9458f13c18ce.omft.near', decimals: 6, blockchain: 'SUI' },

  // TON Chain
  { symbol: 'TON', assetId: 'nep245:v2_1.omni.hot.tg:1117_', decimals: 9, blockchain: 'TON' },
  { symbol: 'USDT', assetId: 'nep245:v2_1.omni.hot.tg:1117_3tsdfyziyc7EJbP2aULWSKU4toBaAcN4FdTgfm5W1mC4ouR', decimals: 6, blockchain: 'TON' },

  // TRON Chain
  { symbol: 'TRX', assetId: 'nep141:tron.omft.near', decimals: 6, blockchain: 'TRON' },
  { symbol: 'USDT', assetId: 'nep141:tron-d28a265909efecdcee7c5028585214ea0b96f015.omft.near', decimals: 6, blockchain: 'TRON' },

  // XRP Chain
  { symbol: 'XRP', assetId: 'nep141:xrp.omft.near', decimals: 6, blockchain: 'XRP' },

  // ZEC Chain
  { symbol: 'ZEC', assetId: 'nep141:zec.omft.near', decimals: 8, blockchain: 'ZEC' }
];

// Helper functions for token lookup
export function findTokenBySymbol(symbol: string, blockchain?: string): Token[] {
  return TOKENS_DATABASE.filter(token => 
    token.symbol.toLowerCase() === symbol.toLowerCase() &&
    (!blockchain || token.blockchain.toLowerCase() === blockchain.toLowerCase())
  );
}

export function findTokenByAssetId(assetId: string): Token | undefined {
  return TOKENS_DATABASE.find(token => token.assetId === assetId);
}

export function getTokensByBlockchain(blockchain: string): Token[] {
  return TOKENS_DATABASE.filter(token => 
    token.blockchain.toLowerCase() === blockchain.toLowerCase()
  );
}

export function getAllBlockchains(): string[] {
  return [...new Set(TOKENS_DATABASE.map(token => token.blockchain))].sort();
}

export function getAllSymbols(): string[] {
  return [...new Set(TOKENS_DATABASE.map(token => token.symbol))].sort();
}

// Summary statistics
export const TOKENS_SUMMARY = {
  totalTokens: TOKENS_DATABASE.length,
  totalBlockchains: getAllBlockchains().length,
  uniqueSymbols: getAllSymbols().length,
  blockchains: getAllBlockchains()
};

console.log(`\n📊 Tokens Database Summary:`);
console.log(`Total Tokens: ${TOKENS_SUMMARY.totalTokens}`);
console.log(`Blockchains: ${TOKENS_SUMMARY.totalBlockchains}`);
console.log(`Unique Symbols: ${TOKENS_SUMMARY.uniqueSymbols}`);
console.log(`Supported Chains: ${TOKENS_SUMMARY.blockchains.join(', ')}\n`);