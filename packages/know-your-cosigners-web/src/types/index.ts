
export type SafeTransaction = {
  blockNumber: number
  hash: string
  from: string
  to: string
  value: string
  input: string
  gasPrice: string
  gasUsed: string
}

export type Signer = {
  address: string
  transactions: SafeTransaction[]
  gasUsedTotal: bigint
  feesTotal: bigint
}
