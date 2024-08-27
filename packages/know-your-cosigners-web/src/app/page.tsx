'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [safeAddress, setSafeAddress] = useState<string>('')
  const [signerAddresses, setSignerAddresses] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      // getSigners(safeAddress)
      if (safeAddress === '') {
        setSignerAddresses([])
      } else {
        setSignerAddresses([
          '0x0000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000002',
          '0x0000000000000000000000000000000000000003',
          '0x0000000000000000000000000000000000000004',
          '0x0000000000000000000000000000000000000005'
        ])
      }
    }
    init()
  }, [safeAddress])

  const updateSafeAddres = (e: any) => {
    setSafeAddress(e.target.value)
  }

  return (
    <main className={signerAddresses.length > 0 ? "main-list" : "main-empty"}>
      <h1>KNOW YOUR CO-SIGNERS</h1>
      <input
        type="text"
        value={safeAddress}
        onChange={updateSafeAddres}
      />
      {signerAddresses.length > 0 && (
        <>
          <h2>Signers {signerAddresses && `(${signerAddresses.length})`}</h2>
          {signerAddresses.map(signerAddress => (
            <pre key={signerAddress}>{signerAddress}</pre>
          ))}
        </>
      )}
    </main>
  )
}
