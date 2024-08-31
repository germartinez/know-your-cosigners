import { Transaction } from '@/types'

export function isSameAddress(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase()
}



/*
const signersTransactions: Signer[] = []
for (let i = 0; i < safeOwners.length; i++) {
  const signerTransactions: Signer = {
    address: safeOwners[i],
    transactions: await getEnvioTransactions({
      signerAddress: safeOwners[i],
      chainId: 1
    })
  }
  signersTransactions.push(signerTransactions)
}
return signersTransactions
*/



export function getSignersStats(safeTransactions: Transaction[], owners: string[]) {
  const signers = owners.map(signerAddress => {
    let transactions = []
    let gasUsedTotal = 0n
    let feesTotal = 0n

    for(let i = 0; i < safeTransactions.length; i++) {
      const tx = safeTransactions[i]
      if (!isSameAddress(signerAddress, tx.from)) {
        continue
      }
      transactions.push(tx)
      gasUsedTotal += BigInt(tx.gasUsed)
      feesTotal += BigInt(tx.gasUsed) * BigInt(tx.gasPrice)
    }

    const signer = {
      address: signerAddress,
      transactions,
      gasUsedTotal: gasUsedTotal,
      feesTotal: feesTotal
    }
    return signer
  }).sort((a, b) => a.transactions.length > b.transactions.length ? -1 : 1)

  return signers
}
