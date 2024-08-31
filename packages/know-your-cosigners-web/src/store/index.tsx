'use client'

import { getEnvioTransactions } from '@/logic/envio'
import { getOwners } from '@/logic/safe'
import { Signer, Transaction } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'

type statisticsContextValue = {
  safeAddress?: string
  setSafeAddress: (safeAddress: string) => void
  safeOwners?: string[]
  safeTransactions?: Transaction[]
  safeSignersTransactions?: Signer[]
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
  const [safeSignersTransactions, setSignersTransactions] = useState<Signer[] | undefined>(undefined)

  // Set Safe address
  const setSafeAddress = (safeAddress: string) => {
    setAddress(safeAddress)
  }

  // Reset
  useEffect(() => {
    setOwners(undefined)
    setTransactions(undefined)
    setSignersTransactions(undefined)
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
    const setupSignersTransactions = async () => {
      let transactions: Signer[] | undefined = undefined
      if (safeOwners) {
        if (safeOwners.length > 0) {





          // Optimize with Promise.all
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
          transactions = signersTransactions




          
        } else {
          transactions = []
        }
      }
      setSignersTransactions(transactions)
      console.log('setupSignersTransactions', transactions)
    }
    setupSignersTransactions()
  }, [safeOwners])

  const state = {
    safeAddress,
    setSafeAddress,
    safeOwners,
    safeTransactions,
    safeSignersTransactions
  }

  return (
    <StatisticsContext.Provider value={state}>
      {children}
    </StatisticsContext.Provider>
  )
}
