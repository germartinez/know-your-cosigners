import safeAbi from '@/abi/safe.json'
import { SafeTransaction } from '@/types'
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

type SafeTransactionProps = {
  safeAddress: string
  chainName: string
}

export async function getSafeTransactions({
  safeAddress,
  chainName,
}: SafeTransactionProps): Promise<SafeTransaction[]> {
  try {
    let transactions: SafeTransaction[] = []
    let next = `https://safe-transaction-${chainName}.safe.global/api/v1/safes/${safeAddress}/multisig-transactions`
    while (next) {
      const request = await fetch(
        next,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      const response = await request.json()
      transactions = transactions.concat(response.results)
      next = response.next
      console.log(transactions.length, next)
    }
    return transactions
  }
  catch(error: any) {
    return []
  }
}
