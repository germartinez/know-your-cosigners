'use client'

import SignerList from '@/components/SignersList'
import TxsFrequencyChart from '@/components/TxsFrequencyChart'
import { useStatistics } from '@/store'

export default function Home() {
  const { safeAddress, setSafeAddress, safeOwners, safeTransactions } = useStatistics()

  const updateSafeAddres = (e: any) => {
    setSafeAddress(e.target.value)
  }

  return (
    <>
      <header>
        <div className={safeAddress ? "header-small" : "header-big"}>
          <h1 className={safeAddress ? "title-small" : "title-big"}>KNOW YOUR CO-SIGNERS</h1>
          <div className={safeAddress ? "search-small" : "search-big"}>
            <input
              type="text"
              value={safeAddress}
              onChange={updateSafeAddres}
              autoFocus
            />
          </div>
        </div>
      </header>
      <main>
        {safeOwners && safeAddress?.length === 42 && (
          <>
            
            <div className="chart-box">
              <h2>Safe transactions {safeTransactions && `(${safeTransactions.length})`}</h2>
              <TxsFrequencyChart transactions={safeTransactions} color="black" height={300} />
            </div>
            
            <div className="signers-box">
              <h2>Signers {safeOwners && `(${safeOwners.length})`}</h2>
              <SignerList />
            </div>
          </>
        )}
      </main>
    </>
  )
}
