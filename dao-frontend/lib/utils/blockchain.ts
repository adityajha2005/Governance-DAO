import { PublicClient, GetLogsParameters } from 'viem';

/**
 * Fetches logs in chunks to avoid RPC limits
 */
export async function getLogsInChunks(
  publicClient: PublicClient,
  params: GetLogsParameters & { chunkSize?: bigint }
) {
  const { fromBlock, toBlock, chunkSize = BigInt(50000), ...rest } = params;
  
  if (!fromBlock || !toBlock) {
    return await publicClient.getLogs(params);
  }

  const allLogs = [];
  let currentFrom = BigInt(fromBlock);
  const targetTo = BigInt(toBlock);

  if (targetTo - currentFrom <= BigInt(1000)) {
     return await publicClient.getLogs(params);
  }

  const actualChunkSize = BigInt(10000); 

  while (currentFrom <= targetTo) {
    let currentTo = currentFrom + actualChunkSize - BigInt(1);
    if (currentTo > targetTo) currentTo = targetTo;

    try {
      const logs = await publicClient.getLogs({
        ...rest,
        fromBlock: currentFrom,
        toBlock: currentTo,
      } as any);
      
      allLogs.push(...logs);
    } catch (error) {
      console.error(`Error fetching logs for block range ${currentFrom}-${currentTo}:`, error);
      throw error;
    }

    currentFrom = currentTo + BigInt(1);
  }

  return allLogs;
}
