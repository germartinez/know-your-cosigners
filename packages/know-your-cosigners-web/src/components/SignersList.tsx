import { isSameAddress } from '@/logic/statistics'
import { useStatistics } from '@/store'
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

  return (
    <ol>
      {safeOwners && safeOwners.map((owner, i) => {
        const signer = signersData?.filter(signer => isSameAddress(signer.address, owner))[0]

        return (
          <li className="signer" key={i} onClick={() => selectSigner(i)}>
            <div className={selectedSigner === i ? 'selected-main' : 'main'}>
              <div className="tag" style={{
                backgroundColor: `${getColor(i.toString())}`
              }}>{i + 1}</div>
              <pre>
                <a
                  href={`https://etherscan.io/address/${owner}`}
                  target="_blank"
                >{owner}</a>
              </pre>
            </div>
            {(
              <div className="info">

                <div className="line">
                  <div>Executed transactions</div>
                  <div className="bar-box">
                    <div className="bar-value" style={{
                      backgroundColor: getColor(i.toString()),
                      width: `${signer && signer.totalSafeTxExecuted && signer.totalTxExecuted
                        ? signer.totalSafeTxExecuted * 130 / signer.totalTxExecuted
                        : 0
                      }px`
                    }}></div>
                  </div>
                  <div>
                    {signer && signer.totalSafeTxExecuted && signer.totalTxExecuted
                      ? `${signer.totalSafeTxExecuted} / ${signer.totalTxExecuted}`
                      : 'Loading...'
                    }
                  </div>
                </div>

                <div className="line">
                  <div>Used gas</div>
                  <div className="bar-box">
                    <div className="bar-value" style={{
                      backgroundColor: getColor(i.toString()),
                      width: `${signer && signer.totalSafeGasUsed && signer.totalGasUsed
                        ? signer.totalSafeGasUsed * BigInt(130) / signer.totalGasUsed
                        : 0
                      }px`
                    }}></div>
                  </div>
                  {signer && signer.totalSafeGasUsed && signer.totalGasUsed
                    ? `${signer.totalSafeGasUsed} / ${signer.totalGasUsed}`
                    : 'Loading...'
                  }
                </div>

                <div className="line">
                  <div>Paid fees</div>
                  <div className="bar-box">
                    <div className="bar-value" style={{
                      backgroundColor: getColor(i.toString()),
                      width: `${signer && signer.totalSafeTxFees && signer.totalTxFees
                        ? signer.totalSafeTxFees * BigInt(130) / signer.totalTxFees
                        : 0
                      }`
                    }}></div>
                  </div>
                  <div>
                    {signer && signer.totalSafeTxFees && signer.totalTxFees
                      ? `${(+formatEther(signer.totalSafeTxFees)).toFixed(4)} / ${(+formatEther(signer.totalTxFees)).toFixed(4)} ETH`
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
