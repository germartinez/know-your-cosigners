import { isSameAddress } from '@/logic/statistics'
import { useStatistics } from '@/store'
import { Signer } from '@/types'
import * as d3 from 'd3'
import { formatEther } from 'viem'
import TxsFrequencyChart from './TxsFrequencyChart'

export default function SignerList() {
  const { safeAddress, safeOwners, signersData, safeTxServiceTransactions } = useStatistics()

  const getColor = d3.scaleOrdinal(d3.schemeCategory10)

  const orderedSigners = signersData?.sort((a: Signer, b: Signer) => a.totalSafeTxExecuted > b.totalSafeTxExecuted ? -1 : 1)
    .map(signer => signer.address)

  const data = signersData
    ? orderedSigners
    : safeOwners

  return (
    <ol>
      {data && data.map((owner, i) => {
        const signer = signersData?.filter(signer => isSameAddress(signer.address, owner))[0]

        return (
          <div className="signer-block" key={i}>
            <li className="signer">
              <div className="main">
                <div className="dot" style={{
                  backgroundColor: `${getColor(i.toString())}`
                }} />
                <pre>
                  <a
                    href={`https://etherscan.io/address/${owner}`}
                    target="_blank"
                  >{owner}</a>
                </pre>
              </div>

              <div className="info">
                <div className="line">
                  <div>Executed transactions</div>
                  <div className="bar-box">
                    <div className="bar-value" style={{
                      backgroundColor: getColor(i.toString()),
                      width: `${signer && signer.totalTxExecuted > 0
                        ? (signer.totalSafeTxExecuted * 130) / signer.totalTxExecuted
                        : 0
                      }px`
                    }}></div>
                  </div>
                  <div>
                    {signer
                      ? signer.totalTxExecuted > 0
                        ? `${signer.totalSafeTxExecuted} / ${signer.totalTxExecuted} (${((signer.totalSafeTxExecuted * 100) / signer.totalTxExecuted).toFixed(2)}%)`
                        : '0 (0%)'
                      : 'Loading...'
                    }
                  </div>
                </div>         
                <div className="line">
                  <div>Signed transactions</div>
                  <div className="bar-box">
                    <div className="bar-value" style={{
                      backgroundColor: getColor(i.toString()),
                      width: `${signer && safeTxServiceTransactions
                        ? (signer.totalSafeTxSigned * 130) / safeTxServiceTransactions.length
                        : 0
                      }px`
                    }}></div>
                  </div>
                  <div>
                    {signer
                      ? safeTxServiceTransactions
                        ? `${signer.totalSafeTxSigned} / ${safeTxServiceTransactions.length} (${((signer.totalSafeTxSigned * 100) / safeTxServiceTransactions.length).toFixed(2)}%)`
                        : '0 (0%)'
                      : 'Loading...'
                    }
                  </div>
              
                </div>
              </div>

              <div className="info">
                <div className="line">
                  <div>Used gas</div>
                  <div className="bar-box">
                    <div className="bar-value" style={{
                      backgroundColor: getColor(i.toString()),
                      width: `${signer && signer.totalGasUsed > 0
                        ? (signer.totalSafeGasUsed * 130n) / signer.totalGasUsed
                        : 0
                      }px`
                    }}></div>
                  </div>
                  {signer
                    ? signer.totalGasUsed > 0
                      ? `${signer.totalSafeGasUsed} (${Number((signer.totalSafeGasUsed * 100n) / signer.totalGasUsed).toFixed(2)}%)`
                      : '0 (0%)'
                    : 'Loading...'
                  }
                </div>
                <div className="line">
                  <div>Paid fees</div>
                  <div className="bar-box">
                    <div className="bar-value" style={{
                      backgroundColor: getColor(i.toString()),
                      width: `${signer && signer.totalTxFees > 0
                        ? (signer.totalSafeTxFees * 130n) / signer.totalTxFees
                        : 0
                      }px`
                    }}></div>
                  </div>
                  <div>
                    {signer
                      ? signer.totalTxFees > 0
                        ? `${(+formatEther(signer.totalSafeTxFees)).toFixed(4)} ETH (${Number(((signer.totalSafeTxFees * 100n) / signer.totalTxFees)).toFixed(2)}%)`
                        : '0 ETH (0%)'
                      : 'Loading...'
                    }
                  </div>
                </div>
              </div>

              <div className="tags">
                {signersData && signer && (
                  <>
                    {(signer.totalSafeTxSigned > 0 && signersData.filter(s => signer.totalSafeTxSigned >= s.totalSafeTxSigned).length === signersData.length)
                      ? <div className="tag">Most popular signer</div>
                      : (signer.totalSafeTxSigned > 0)
                        ? <div className="tag">Occasional signer</div>
                        : (signer.totalSafeTxSigned === 0) && <div className="tag">No signing activity</div>
                    }
                    {(signer.totalSafeTxExecuted > 0 && signersData.filter(s => signer.totalSafeTxExecuted >= s.totalSafeTxExecuted).length === signersData.length)
                      ? <div className="tag">Most popular executor</div>
                      : (signer.totalSafeTxExecuted > 0)
                        ? <div className="tag">Occasional executor</div>
                        : (signer.totalSafeTxExecuted === 0) && <div className="tag">No execution activity</div>
                    }
                    {signer.totalSafeTxFees > 0 && signersData.filter(s => signer.totalSafeTxFees >= s.totalSafeTxFees).length === signersData.length && <div className="tag">Best sponsor</div>}
                    {signer.totalTxExecuted > 0 && signer.totalTxExecuted === signer.totalSafeTxExecuted && <div className="tag">100% committed</div>}
                  </>
                )}
              </div>
            </li>
            <TxsFrequencyChart
              transactions={signer?.transactions.filter(tx => tx.to && isSameAddress(tx.to, safeAddress!))}
              color={getColor(i.toString())}
              height={300}
            />
          </div>
        )
      })}
    </ol>
  )
}
