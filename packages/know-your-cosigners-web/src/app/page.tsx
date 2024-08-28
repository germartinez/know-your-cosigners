'use client'

import SignerList from '@/components/SignersList'
import { getSafeTransactions } from '@/logic/envio'
import { getOwners } from '@/logic/safe'
import { getSignersStats } from '@/logic/statistics'
import { SafeTransaction, Signer } from '@/types'
import { useEffect, useState } from 'react'

export default function Home() {
  const [safeAddress, setSafeAddress] = useState<string>('')
  const [signers, setSigners] = useState<Signer[]>([])
  const [safeTransactions, setSafeTransactions] = useState<SafeTransaction[]>([])

  useEffect(() => {
    const init = async() => {
      setSigners([])
      setSafeTransactions([])
      if (safeAddress === '') {
        return
      }

      const newTransactions = await getSafeTransactions(safeAddress, 1)
      const owners = await getOwners(safeAddress, 1)
      const newSigners: Signer[] = getSignersStats(newTransactions, owners)
      
      setSigners(newSigners)
      setSafeTransactions(newTransactions!)
    }
    init()
  }, [safeAddress])

  const updateSafeAddres = (e: any) => {
    setSafeAddress(e.target.value)
  }

  return (
    <main className={safeAddress === '' ? "main-empty" : "main-list"}>
      <h1 className={safeAddress === '' ? "h1-big" : "h1-small"}>
        <span style={{ color: '#333333' }}>K</span>NOW
        <br/>
        <span style={{ color: '#333333' }}>Y</span>OUR
        <br/>
        <span style={{ color: '#333333' }}>C</span>O-SIGNERS
      </h1>
      <input
        type="text"
        value={safeAddress}
        onChange={updateSafeAddres}
        maxLength={42}
        autoFocus
      />
      {signers.length > 0 && (
        <>
          <h2>Signers: {`${signers.length}`}</h2>
          <h2>Transactions: {safeTransactions.length}</h2>
          <SignerList signers={signers} />
        </>
      )}
    </main>
  )
}
