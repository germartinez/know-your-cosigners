import { SafeTransaction, Signer } from '@/types'
import * as d3 from 'd3'
import { useState } from 'react'
import { formatEther } from 'viem'

interface SignerListType {
  signers: Signer[]
  transactions: SafeTransaction[]
}

export default function SignerList(props: SignerListType) {
  const { signers, transactions } = props

  const [selectedSigner, setSelectedSigner] = useState<number | undefined>(undefined)

  const selectSigner = (signer: number) => {
    const newSigner = signer !== selectedSigner ? signer : undefined
    setSelectedSigner(newSigner)
  }

  const getColor = d3.scaleLinear(
    [0, signers.length - 1],
    ['#00b460', '#ff5f72']
  )

  return (
    <ol>
      {signers.map((signer, i) => (
        <li className="signer" key={i} onClick={() => selectSigner(i)}>
          <div className="main">
            <div className="tag" style={{
              backgroundColor: `${getColor(i)}`
            }}>#{i + 1}</div>
            <pre>{signer.address}</pre>
          </div>
          {selectedSigner === i && (
            <div className="info">
              <div className="line">
                <div>Executed transactions</div>
                <div className="bar-box">
                  <div className="bar-value" style={{
                    backgroundColor: getColor(i),
                    width: `${transactions && signer.transactions.length * 130 / transactions.length}px`
                  }}></div>
                </div>
                <div>{signer.transactions.length}</div>
              </div>
              <div className="line">
                <div>Used gas</div>
                <div className="bar-box">
                  <div className="bar-value" style={{
                    backgroundColor: getColor(i)
                  }}></div>
                </div>
                <div>{signer.gasUsedTotal}</div>
              </div>
              <div className="line">
                <div>Paid fees</div>
                <div className="bar-box">
                  <div className="bar-value" style={{
                    backgroundColor: getColor(i)
                  }}></div>
                </div>
                <div>{(+formatEther(signer.feesTotal)).toFixed(4)} ETH</div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
