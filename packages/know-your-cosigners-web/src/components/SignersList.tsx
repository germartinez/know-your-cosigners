import { useStatistics } from '@/store'
import * as d3 from 'd3'
import { useState } from 'react'

export default function SignerList() {
  const { safeOwners, safeSignersTransactions } = useStatistics()
  const [selectedSigner, setSelectedSigner] = useState<number | undefined>(undefined)

  const selectSigner = (signer: number) => {
    const newSigner = signer !== selectedSigner ? signer : undefined
    setSelectedSigner(newSigner)
  }

  const getColor = d3.scaleOrdinal(d3.schemeCategory10)
  /*.scaleLinear(
    [0, signers.length - 1],
    ['#00b460', '#ff5f72']
  )*/

  return (
    <ol>
      {safeOwners && safeOwners.map((owner, i) => (
        <li className="signer" key={i} onClick={() => selectSigner(i)}>
          <div className={selectedSigner === i ? 'selected-main' : 'main'}>
            <div className="tag" style={{
              backgroundColor: `${getColor(i.toString())}`
            }}>{i + 1}</div>
            <pre>{owner}</pre>
          </div>
          {selectedSigner === i && (
            <div className="info">

              <div className="line">
                <div>Executed transactions</div>
                <div className="bar-box">
                  <div className="bar-value" style={{
                    backgroundColor: getColor(i.toString()),
                    //width: `${transactions && signer.transactions.length * 130 / safeTransactions.length}px`
                  }}></div>
                </div>
                <div>{safeSignersTransactions ? safeSignersTransactions[i]?.transactions.length : '-'}</div>
              </div>

              <div className="line">
                <div>Used gas</div>
                <div className="bar-box">
                  <div className="bar-value" style={{
                    backgroundColor: getColor(i.toString())
                  }}></div>
                </div>
                <div>-</div>
              </div>

              <div className="line">
                <div>Paid fees</div>
                <div className="bar-box">
                  <div className="bar-value" style={{
                    backgroundColor: getColor(i.toString())
                  }}></div>
                </div>
                <div>-</div>
                {/*<div>{(+formatEther(signer.feesTotal)).toFixed(4)} ETH</div>*/}
                
              </div>
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
