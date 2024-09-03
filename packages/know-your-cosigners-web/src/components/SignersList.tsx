import { isSameAddress } from '@/logic/statistics'
import { useStatistics } from '@/store'
import { Signer } from '@/types'
import * as d3 from 'd3'
import { useState } from 'react'
import { formatEther } from 'viem'

export default function SignerList() {
  const { safeOwners, signersData } = useStatistics()
  const [selectedSigner, setSelectedSigner] = useState<number | undefined>(undefined)

  const selectSigner = (signer: number) => {
    const newSigner = signer !== selectedSigner ? signer : undefined
    setSelectedSigner(newSigner)
  }

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
          <li className="signer" key={i} onClick={() => selectSigner(i)}>
            <div className={selectedSigner === i ? 'selected-main' : 'main'}>
              <pre>
                <a
                  href={`https://etherscan.io/address/${owner}`}
                  target="_blank"
                >{owner}</a>
              </pre>
              <div className="tag" style={{
                backgroundColor: `${getColor(i.toString())}`
              }}>{i + 1}</div>
            </div>
            {(
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
            )}
          </li>
        )

      })}
    </ol>
  )
}
