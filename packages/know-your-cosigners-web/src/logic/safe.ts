import safeAbi from '@/abi/safe.json'
import { createPublicClient, getContract, http } from 'viem'
import { mainnet } from 'viem/chains'

export async function getOwners(safeAddress: string, chainId: number): Promise<string[]> {
  if (chainId !== 1) {
    throw new Error('Network not supported.')
  }

  if (safeAddress === '') {
    return []
  }

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  })
  
  try {
    const safe = getContract({
      address: safeAddress as `0x${string}`,
      abi: safeAbi,
      client: publicClient
    })
    const owners = await safe.read.getOwners() as string[]
    return owners
  } catch(e) {
    return []
  }
}
