import { Address } from 'viem';

export const CONTRACT_ADDRESSES = {
  GovernanceToken: '0x5D7Fa5513a42e1770cbd527d63753BF0D4cfE297' as Address,
  DAOTimelock: '0x189B1ae7b5b58Bbb55298ec030e3efaEcf445b01' as Address,
  DAOGovernor: '0xEE8824f41dfeCC37df2002312Ac5562ab048B0d2' as Address,
  DAOTreasury: '0xFb737ad5769E4a8C281339e257E5cfE552CDCB34' as Address,
} as const;

export const CHAIN_ID = 11155111; // Sepolia
export const NETWORK_NAME = 'sepolia';

// Contract deployment block (for efficient event queries)
export const DEPLOYMENT_BLOCK = BigInt(7359436); // Block where DAOGovernor was deployed

// Block explorer URLs
export const EXPLORER_URL = 'https://sepolia.etherscan.io';

export const getExplorerUrl = (hash: string, type: 'tx' | 'address' = 'tx') => {
  return `${EXPLORER_URL}/${type}/${hash}`;
};
