import { formatUnits } from 'viem';

/**
 * Format a token amount with proper decimals
 */
export function formatTokenAmount(amount: bigint | undefined, decimals: number = 18, maxDecimals: number = 2): string {
  if (!amount) return '0';
  
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  
  if (num === 0) return '0';
  if (num < 0.01) return '< 0.01';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

/**
 * Format a USD amount
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Shorten an address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a block number to estimated time
 */
export function blocksToTime(blocks: bigint, blocksPerMinute: number = 5): string {
  const minutes = Number(blocks) / blocksPerMinute;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return `${Math.round(days)} day${Math.round(days) !== 1 ? 's' : ''}`;
  }
  if (hours >= 1) {
    return `${Math.round(hours)} hour${Math.round(hours) !== 1 ? 's' : ''}`;
  }
  return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? 's' : ''}`;
}

/**
 * Calculate percentage of total
 */
export function calculatePercentage(part: bigint, total: bigint): number {
  if (total === BigInt(0)) return 0;
  return Number((part * BigInt(10000)) / total) / 100;
}

/**
 * Format time ago
 */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Convert ETH price (mock - in production use a price oracle)
 */
export function ethToUSD(ethAmount: bigint, ethPrice: number = 2500): number {
  const ethValue = parseFloat(formatUnits(ethAmount, 18));
  return ethValue * ethPrice;
}
