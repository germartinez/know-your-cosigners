import { BlockField, HypersyncClient, Query, TransactionField } from '@envio-dev/hypersync-client'
import { Request, Response } from 'express'

export async function getSafeTransactions(req: Request, res: Response) {
  try {
    const { address, chainId, nextBlock = 0 } = req.query

    if (!address || !chainId) {
      res.status(400).send('400 Bad Request')
      return
    }

    const client = HypersyncClient.new({
      url: `https://${chainId}.hypersync.xyz`
    })
    
    const query: Query = {
      fromBlock: Number(nextBlock),
      transactions: [
        {
          to: [address as string], // Safe address
          sighash: ['0x6a761202'] // execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)	
        }
      ],
      fieldSelection: {
        block: [
          BlockField.Number,
          BlockField.Timestamp
        ],
        transaction: [
          TransactionField.BlockNumber,
          TransactionField.Hash,
          TransactionField.From,
          TransactionField.To,
          TransactionField.Value,
          TransactionField.Input,
          TransactionField.GasPrice,
          TransactionField.GasUsed
        ]
      }
    }
    
    const result = await client.get(query)
    
    const blocks = result.data.blocks
    const txs = result.data.transactions

    const transactions = txs.map((tx, i) => ({
      ...tx,
      value: tx.value?.toString(),
      gasUsed: tx.gasUsed?.toString(),
      gasPrice: tx.gasPrice?.toString(),
      timestamp: blocks.find(b => tx.blockNumber === b.number)?.timestamp
    }))
    const nextBlockNumber = result.nextBlock > result.archiveHeight!
      ? undefined
      : result.nextBlock

    res.status(200).send({
      transactions,
      nextBlock: nextBlockNumber
    })
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}
