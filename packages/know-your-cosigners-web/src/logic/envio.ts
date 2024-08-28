import { SafeTransaction } from "@/types"

const SERVICE_URL = process.env.NEXT_PUBLIC_SERVICE_URL!

export async function getSafeTransactions(
  safeAddress: string,
  chainId: number
): Promise<SafeTransaction[]> {
  try {
    let transactions: SafeTransaction[] = []
    let nextBlock = 0
    while (nextBlock !== undefined) {
      const request = await fetch(
        `${SERVICE_URL}/transactions?address=${safeAddress}&chainId=${chainId}&nextBlock=${nextBlock}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      const response = await request.json()
      transactions = transactions.concat(response.transactions)
      nextBlock = response.nextBlock
    }
    return transactions
  }
  catch(error: any) {
    return []
  }
}
