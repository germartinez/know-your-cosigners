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
        setOwners(owners ? [...owners] : undefined)
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
      setTransactions(transactions ? [...transactions] : undefined)
      console.log('setupTransactions', transactions)
    }
    setupTransactions()
  }, [safeAddress])

  // Get Safe signers transactions
  useEffect(() => {
    const setupSignersData = async () => {
      let statistics: Signer[] | undefined = undefined
      if (safeOwners) {
        let signers: Signer[] = []
        if (safeOwners.length > 0) {
          // Optimize with Promise.all

          signers = await Promise.all(safeOwners.map(async (owner) => {
            const transactions = await getEnvioTransactions({
              signerAddress: owner,
              chainId: 1
            })
            const signer: Signer = {
              address: owner,
              transactions,
              ...getSignersStatistics(safeAddress, owner, transactions)
            }
            return signer
          }))

          statistics = signers.sort(
            (a, b) => a.totalSafeTxExecuted > b.totalSafeTxExecuted ? -1 : 1
          )
        } else {
          statistics = []
        }
      }

      setSignersData(statistics ? [...statistics] : undefined)
      console.log('setSignersData', statistics)
    }
    setupSignersData()
  }, [safeOwners])

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
