import { Transaction } from '@/types'

const SERVICE_URL = process.env.NEXT_PUBLIC_SERVICE_URL!

type EnvioTransactionProps = {
  safeAddress?: string
  signerAddress?: string
  chainId: number
  setTransactions?: () => {}
}

export async function getEnvioTransactions({
  safeAddress,
  signerAddress,
  chainId
}: EnvioTransactionProps): Promise<Transaction[]> {
  try {
    let transactions: Transaction[] = []
    let nextBlock = 0
    while (nextBlock !== undefined) {
      const URL = signerAddress
        ? `${SERVICE_URL}/transactions?signer=${signerAddress}&chainId=${chainId}&nextBlock=${nextBlock}`
        : `${SERVICE_URL}/transactions?safe=${safeAddress}&chainId=${chainId}&nextBlock=${nextBlock}`
      const request = await fetch(URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const response = await request.json()
      transactions = transactions.concat(response.transactions)
      nextBlock = response.nextBlock
    }
    return transactions
  } catch (error: any) {
    return []
  }
}
