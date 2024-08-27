import * as d3 from 'd3'

interface SignerListType {
  adresses: string[]
}

export default function SignerList(props: SignerListType) {
  const { adresses } = props

  const getColor = d3.scaleLinear(
    [0, adresses.length - 1],
    ['#00b460', '#ff5f72']
  )

  return (
    <>
      {adresses && adresses.length > 0 && (
        <>
          <h2>Signers {adresses && `(${adresses.length})`}</h2>
          <ol>
            {adresses.map((signerAddress, i) => (
              <li className="signer" key={i}>
                <pre>
                  {signerAddress}
                </pre>
                <div className="tag" style={{
                  border: `1px solid ${getColor(i)}`,
                  color: getColor(i)
                }}>#{i + 1}</div>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  )
}
