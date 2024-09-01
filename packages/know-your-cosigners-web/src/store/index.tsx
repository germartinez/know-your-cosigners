'use client'

import { getEnvioTransactions } from '@/logic/envio'
import { getOwners } from '@/logic/safe'
import { getSignersStatistics } from '@/logic/statistics'
import { Signer, Transaction } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'

type statisticsContextValue = {
  safeAddress?: string
  setSafeAddress: (safeAddress: string) => void
  safeOwners?: string[]
  safeTransactions?: Transaction[]
  signersData?: Signer[]
}

const initialState = {
  setSafeAddress: () => {}
}

const StatisticsContext = createContext<statisticsContextValue>(initialState)

export const useStatistics = () => {
  const context = useContext(StatisticsContext)

  if (!context) {
    throw new Error('useStatistics should be used within a StatisticsProvider')
  }

  return context
}

export const StatisticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [safeAddress, setAddress] = useState<string>('')
  const [safeOwners, setOwners] = useState<string[] | undefined>(undefined)
  const [safeTransactions, setTransactions] = useState<Transaction[] | undefined>(undefined)
  const [signersData, setSignersData] = useState<Signer[] | undefined>(undefined)

  // Set Safe address
  const setSafeAddress = (safeAddress: string) => {
    setAddress(safeAddress)
  }

  // Reset
  useEffect(() => {
    setOwners(undefined)
    setTransactions(undefined)
    setSignersData(undefined)
  }, [safeAddress])

  // Get Safe signers
  useEffect(() => {
    const setupSigners = async () => {
      const owners = (safeAddress !== '')
        ? await getOwners(safeAddress, 1)
        : undefined
        setOwners(owners)
      console.log('setupSigners', owners)
    }
    setupSigners()
  }, [safeAddress])

  // Get Safe transactions
  useEffect(() => {
    const setupTransactions = async () => {
      const transactions = (safeAddress !== '')
        ? await getEnvioTransactions({
            safeAddress,
            chainId: 1
          })
        : undefined
      setTransactions(transactions)
      console.log('setupTransactions', transactions)
    }
    setupTransactions()
  }, [safeAddress])

  // Get Safe signers transactions
  useEffect(() => {
    const setupSignersData = async () => {
      let statistics: Signer[] | undefined = undefined
      if (safeOwners) {
        if (safeOwners.length > 0) {
          // Optimize with Promise.all
          const signers: Signer[] = []
          for (let i = 0; i < safeOwners.length; i++) {
            const transactions = await getEnvioTransactions({
              signerAddress: safeOwners[i],
              chainId: 1
            })
            const signer: Signer = {
              address: safeOwners[i],
              transactions,
              ...getSignersStatistics(safeAddress, safeOwners[i], transactions)
            }
            signers.push(signer)
          }
          statistics = signers.sort((a, b) => a.totalSafeTxExecuted > b.totalSafeTxExecuted ? -1 : 1)
        } else {
          statistics = []
        }
      }
      setSignersData(statistics)
      console.log('setSignersData', statistics)
    }
    setupSignersData()
  }, [safeOwners])

  // Order owners
  // useEffect(() => {
  // 
  // }, signersData)

  const state = {
    safeAddress,
    setSafeAddress,
    safeOwners,
    safeTransactions,
    signersData
  }

  return (
    <StatisticsContext.Provider value={state}>
      {children}
    </StatisticsContext.Provider>
  )
}
