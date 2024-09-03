import { useStatistics } from '@/store'
import { Transaction } from '@/types'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

function usePrevious(value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  },[value])
  return ref.current
}

type TxFreqChartProps = {
  transactions?: Transaction[]
}

const margin = {
  top: 50,
  right: 50,
  bottom: 75,
  left: 100
}
const initialWidth = 700 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default function TxsFrequencyChart(props: TxFreqChartProps) {
  const { transactions } = props

  const { safeAddress } = useStatistics()
  const [width, setWidth] = useState(initialWidth)
  const prevWidth = usePrevious(initialWidth)

  const refSvg = useRef<any>()
  const refHistogram = useRef<any>()
  
  const handleWindowResize = () => {
    const newWidth =
      document.getElementById('histogram')!.offsetWidth! - margin.left - margin.right
    console.log({newWidth})
    if (!newWidth) return
    setWidth(newWidth)
  }

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  useEffect(() => {
    d3.selectAll('g').remove()
    d3.selectAll('rect').remove()
  }, [safeAddress])

  useEffect(() => {
    if (width !== prevWidth) {
      d3.selectAll('g').remove()
      d3.selectAll('rect').remove()
    }
    if (!transactions) {
      return
    }
    const tally = {} as any
    transactions.forEach((tx, i) => {
      const date = new Date(tx.timestamp * 1000)
      const dateString = date.getFullYear() + '/' + (date.getMonth() + 1) //+ '/' + date.getDay()
      tally[dateString] = (tally[dateString] || 0) + 1
    })

    var data = []
    for (var date in tally) {
      if (tally.hasOwnProperty(date)) {
        data.push({
          date,
          frequency: tally[date]
        })
      }
    }
    console.log(data)
    if (data.length === 0) {
      return
    }

    const svg = d3.select(refSvg.current!)

    const minDate = d3.min(data, (d) => new Date(d.date) as any)
    const maxDate = d3.max(data, (d) => new Date(d.date) as any)

    const diffDates = Math.abs(maxDate.getTime() - minDate.getTime())
    // const countXAxisPositions = Math.ceil(diffDates / (1000 * 3600 * 24 * 30 * 12)) // Years
    const countXAxisPositions = Math.ceil(diffDates / (1000 * 3600 * 24 * 30)) // Months
    // const countXAxisPositions = Math.ceil(diffDates / (1000 * 3600 * 24)) // Days
    const barPadding = 5
    const barWidth = width / countXAxisPositions - barPadding
    
    const xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([barWidth / 2, width])
      .nice()
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.frequency) as any)])
      .range([height, 0])
      .nice()

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => xScale(new Date(d.date)) - barWidth / 2)
        .attr('y', (d) => yScale(Number(d.frequency)))
        .attr('width', barWidth /*xScale.bandwidth()*/)
        .attr('height', (d) => height - yScale(Number(d.frequency)))
        .attr('transform', 'translate(75, 50)')
        .attr('fill', 'green')

      // Create x-axis
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%m/%Y') as any)
        //.ticks(d3.timeMonth)
        //.tickValues(data.map((d) => new Date(d.date)))

      if (data.length < 5) {
        xAxis.ticks(data.length)
      }
      
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(75, ${height + 50})`)
        .call(xAxis)
        .selectAll('text')
        .attr('transform', 'rotate(-90) translate(-30, -12)')

      // Create y-axis
      const yAxis = d3.axisLeft(yScale).ticks(8)
      svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(75, 50)')
        .call(yAxis)
  }, [transactions, width])

  return (
    <div id="histogram" className="histogram" ref={refHistogram}>
      <svg
        width="100%"
        height={height + margin.top + margin.bottom}
        ref={refSvg}
      />
    </div>
  )
}
