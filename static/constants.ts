// these are used as backups in case @ubiquity-dao/rpc-handler fails to fetch the fastest provider
export const providersUrl: { [key: string]: string } = {
  100: "https://rpc.gnosischain.com",
  1: "https://eth.llamarpc.com",
  137: "https://polygon.llamarpc.com",
  10: "https://optimism.llamarpc.com",
  42161: "https://arbitrum.llamarpc.com",
  8453: "https://base.llamarpc.com",
  56: "https://binance.llamarpc.com",
  81457: "https://blast.drpc.org",
  324: "https://mainnet.era.zksync.io",
  43114: "https://rpc.ankr.com/avalanche",
  480: "https://rpc.worldchain.network",
  31337: "http://127.0.0.1:8545",
};

export const explorersUrl: { [key: string]: string } = {
  100: "https://gnosisscan.io",
  1: "https://etherscan.io",
  137: "https://polygonscan.com",
  10: "https://optimistic.etherscan.io",
  42161: "https://arbiscan.io",
  8453: "https://basescan.org",
  56: "https://bscscan.com",
  81457: "https://blastscan.io",
  324: "https://explorer.zksync.io",
  43114: "https://snowtrace.io",
  480: "https://explorer.worldchain.network",
  31337: "http://127.0.0.1:8545",
};
