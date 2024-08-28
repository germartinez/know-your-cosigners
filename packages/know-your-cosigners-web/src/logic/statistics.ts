import { SafeTransaction } from "@/types"

export function compareAddresses(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase()
}

export function getSignerTransactions(
  safeTransactions: SafeTransaction[],
  signerAddress: string
) {
  const transactions = safeTransactions
    .filter((tx: SafeTransaction) => compareAddresses(tx.from, signerAddress))
  return transactions
}

export function getSignersStats(safeTransactions: SafeTransaction[], owners: string[]) {
  const signers = owners.map(ownerAddress => {
    const transactions = getSignerTransactions(safeTransactions, ownerAddress)
    const signer = {
      address: ownerAddress,
      transactions: transactions
    }
    return signer
  }).sort((a, b) => a.transactions.length > b.transactions.length ? -1 : 1)

  return signers
}
