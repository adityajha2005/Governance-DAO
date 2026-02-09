// Import ABIs from the contracts project
import GovernanceTokenABI from './abis/GovernanceToken.json';
import DAOGovernorABI from './abis/DAOGovernor.json';
import DAOTimelockABI from './abis/DAOTimelock.json';
import DAOTreasuryABI from './abis/DAOTreasury.json';

export const ABIS = {
  GovernanceToken: GovernanceTokenABI,
  DAOGovernor: DAOGovernorABI,
  DAOTimelock: DAOTimelockABI,
  DAOTreasury: DAOTreasuryABI,
} as const;

export type ContractName = keyof typeof ABIS;
