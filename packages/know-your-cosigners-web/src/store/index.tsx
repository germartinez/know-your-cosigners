'use client'

import { getEnvioTransactions } from '@/logic/envio'
import { getOwners, getSafeTransactions } from '@/logic/safe'
import { getSignersStatistics } from '@/logic/statistics'
import { SafeTransaction, Signer, Transaction } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAddress } from 'viem'

type statisticsContextValue = {
  safeAddress?: string
  setSafeAddress: (safeAddress: string) => void
  safeOwners?: string[]
  safeTransactions?: Transaction[]
  signersData?: Signer[]
  safeTxServiceTransactions?: SafeTransaction[]
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
  const [safeTxServiceTransactions, setTxServiceTransactions] = useState<SafeTransaction[] | undefined>(undefined)
  const [signersData, setSignersData] = useState<Signer[] | undefined>(undefined)

  // Set Safe address
  const setSafeAddress = (safeAddress: string) => {
    setAddress(safeAddress)
  }

  // Reset
  useEffect(() => {
    setOwners(undefined)
    setTransactions(undefined)
    setTxServiceTransactions(undefined)
    setSignersData(undefined)
  }, [safeAddress])

  // Get Safe signers
  useEffect(() => {
    const setupSigners = async () => {
      if (safeAddress === '') {
        setOwners(undefined)
        return
      }
      const owners = await getOwners(safeAddress, 1)
      setOwners([...owners])
      console.log('setupSigners', owners)
    }
    setupSigners()
  }, [safeAddress])

  // Get Safe transactions from Envio
  useEffect(() => {
    const setupTransactions = async () => {
      if (safeAddress === '') {
        setTransactions(undefined)
        return
      }
      const transactions = await getEnvioTransactions({
        safeAddress,
        chainId: 1
      })
      setTransactions([...transactions])
      console.log('setupEnvioTransactions', transactions)
    }
    setupTransactions()
  }, [safeAddress])

  // Get Safe transactions from Safe Transaction Service
  useEffect(() => {
    const setupTransactions = async () => {
      if (safeAddress === '') {
        setTxServiceTransactions(undefined)
        return
      }
      const transactions = (await getSafeTransactions({
        safeAddress: getAddress(safeAddress),
        chainName: 'mainnet'
      })).filter(tx => tx.transactionHash !== null)
      setTxServiceTransactions([...transactions])
      console.log('setupSafeTransactions', transactions)
    }
    setupTransactions()
  }, [safeAddress])

  // Get Safe signers transactions
  useEffect(() => {
    const setupSignersData = async () => {
      if (!safeOwners || !safeTxServiceTransactions) {
        setSignersData(undefined)
        return
      }
      if (safeOwners.length === 0) {
        setSignersData([])
        return
      }
      let statistics = await Promise.all(safeOwners.map(async (owner) => {
        const transactions = await getEnvioTransactions({
          signerAddress: owner,
          chainId: 1
        })
        const signer: Signer = {
          address: owner,
          transactions,
          ...getSignersStatistics(safeAddress, owner, transactions, safeTxServiceTransactions)
        }
        return signer
      }))
      statistics = statistics.sort(
        (a, b) => a.totalSafeTxExecuted > b.totalSafeTxExecuted ? -1 : 1
      )
      setSignersData([...statistics])
      console.log('setSignersData', statistics)
    }
    setupSignersData()
  }, [safeOwners, safeTxServiceTransactions])

  const state = {
    safeAddress,
    setSafeAddress,
    safeOwners,
    safeTransactions,
    signersData,
    safeTxServiceTransactions
  }

  return (
    <StatisticsContext.Provider value={state}>
      {children}
    </StatisticsContext.Provider>
  )
}
