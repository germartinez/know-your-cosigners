import { BlockField, HypersyncClient, Query, TransactionField, TransactionSelection } from '@envio-dev/hypersync-client'
import { Request, Response } from 'express'

export async function getTransactions(req: Request, res: Response) {
  try {
    const { safe, signer, chainId, nextBlock = 0 } = req.query

    if (!chainId) {
      res.status(400).send('400 Bad Request')
      return
    }
    
    let transactionQuery: TransactionSelection[] | undefined = undefined
    if (safe) {
      transactionQuery = [{
        to: [safe as string], // Safe address
        sighash: ['0x6a761202'] // execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)
      }]
    }

    if (signer) {
      transactionQuery = [{
        from: [signer as string], // Signer address
      }]
    }

    const client = HypersyncClient.new({
      url: `https://${chainId}.hypersync.xyz`
    })
    
    const query: Query = {
      fromBlock: Number(nextBlock),
      transactions: transactionQuery,
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

    console.log(`signer: ${signer}, safe: ${safe}, fromBlock: ${query.fromBlock}, transactions: ${transactions.length}`)
    
    res.status(200).send({
      transactions,
      nextBlock: nextBlockNumber
    })
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}
