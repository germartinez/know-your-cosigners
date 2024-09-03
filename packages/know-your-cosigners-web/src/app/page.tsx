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
    <main className={safeAddress === '' ? "main-empty" : "main-list"}>
      <h1 className={safeAddress === '' ? "h1-big" : "h1-small"}>
        <span style={{ color: '#333333' }}>K</span>NOW
        {safeAddress === '' ? <br/> : ' '}
        <span style={{ color: '#333333' }}>Y</span>OUR
        {safeAddress === '' ? <br/> : ' '}
        <span style={{ color: '#333333' }}>C</span>O-SIGNERS
      </h1>
      <input
        type="text"
        value={safeAddress}
        onChange={updateSafeAddres}
        maxLength={42}
        autoFocus
      />
      {safeOwners && (
        <>
          <div className="content">
            <div className="signers-box">
              <h2>Signers {safeOwners && `(${safeOwners.length})`}</h2>
              <SignerList />
            </div>
            <div className="chart-box">
              <h2>Safe transactions {safeTransactions && `(${safeTransactions.length})`}</h2>
              <TxsFrequencyChart transactions={safeTransactions} />
            </div>
          </div>
        </>
      )}
    </main>
  )
}
