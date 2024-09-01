
export type Transaction = {
  blockNumber: number
  hash: string
  from: string
  to: string
  value: string
  input: string
  gasPrice: string
  gasUsed: string
  timestamp: number
}

export type Signer = {
  address: string
  transactions: Transaction[]
  totalGasUsed: bigint
  totalSafeGasUsed: bigint
  totalTxFees: bigint
  totalSafeTxFees: bigint
  totalTxExecuted: number
  totalSafeTxExecuted: number
}
