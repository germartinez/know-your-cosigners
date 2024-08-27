'use client'

import SignerList from '@/components/SignersList'
import { getOwners } from '@/logic/safe'
import { useEffect, useState } from 'react'

export default function Home() {
  const [safeAddress, setSafeAddress] = useState<string>('')
  const [signerAddresses, setSignerAddresses] = useState<string[]>([])

  useEffect(() => {
    const getSigners = async() => {
      const owners = await getOwners(safeAddress, 1)
      setSignerAddresses(owners)
    }
    getSigners()
  }, [safeAddress])

  const updateSafeAddres = (e: any) => {
    setSafeAddress(e.target.value)
  }

  return (
    <main className={signerAddresses.length > 0 ? "main-list" : "main-empty"}>
      <h1 className={signerAddresses.length > 0 ? "h1-small" : "h1-big"}>
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
      <SignerList adresses={signerAddresses} />
    </main>
  )
}
