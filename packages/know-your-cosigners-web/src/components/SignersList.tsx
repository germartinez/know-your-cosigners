import { Signer } from '@/types'
import * as d3 from 'd3'

interface SignerListType {
  signers: Signer[]
}

export default function SignerList(props: SignerListType) {
  const { signers } = props

  const getColor = d3.scaleLinear(
    [0, signers.length - 1],
    ['#00b460', '#ff5f72']
  )

  return (
    <ol>
      {signers.map((signer, i) => (
        <li className="signer" key={i}>
          <pre>
            {signer.address}
          </pre>
          <div className="tag" style={{
            border: `1px solid ${getColor(i)}`,
            color: getColor(i)
          }}>{signer.transactions.length}</div>
        </li>
      ))}
    </ol>
  )
}
