
export type Transaction = {
  blockNumber: number
  hash: string
  from: string
  to?: string
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
  totalSafeTxSigned: number
}

export type SafeTransaction = {
  safe: string
  transactionHash: string
  blockNumber?: number
  submissionDate: string
  executionDate: string
  proposer: string
  executor: string
  isExecuted: boolean
  isSuccessful?: boolean
  confirmationsRequired: number
  confirmations: [{
    owner: string
    submissionDate: string
    signature: string
  }]
  signatures?: string
}
