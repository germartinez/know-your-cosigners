import { Transaction } from '@/types'

export function isSameAddress(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase()
}

export function getSignersStatistics(
  safeAddress: string,
  signerAddress: string,
  signerTransactions: Transaction[]
) {
  let totalGasUsed = 0n
  let totalSafeGasUsed = 0n
  let totalTxFees = 0n
  let totalSafeTxFees = 0n
  let totalSafeTxExecuted = 0
  let totalTxExecuted = 0

  for(let i = 0; i < signerTransactions.length; i++) {
    const tx = signerTransactions[i]
    if (!isSameAddress(signerAddress, tx.from)) {
      continue
    }
    
    const isSafeTx = tx.to && isSameAddress(tx.to, safeAddress)
      && isSameAddress(tx.from, signerAddress)
      && tx.input.startsWith('0x6a761202')
    
    totalGasUsed += BigInt(tx.gasUsed)
    totalSafeGasUsed += isSafeTx ? BigInt(tx.gasUsed) : BigInt(0)
    totalTxFees += BigInt(tx.gasUsed) * BigInt(tx.gasPrice)
    totalSafeTxFees += isSafeTx ? BigInt(tx.gasUsed) * BigInt(tx.gasPrice) : BigInt(0)
    totalTxExecuted += 1
    totalSafeTxExecuted += isSafeTx ? 1 : 0
  }

  const signerStatistics = {
    totalGasUsed,
    totalSafeGasUsed,
    totalTxFees,
    totalSafeTxFees,
    totalTxExecuted,
    totalSafeTxExecuted
  }
  return signerStatistics
}
