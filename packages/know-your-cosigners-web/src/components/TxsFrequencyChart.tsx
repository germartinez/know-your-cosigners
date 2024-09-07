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
  color: string
  height: number
}

const margin = {
  top: 70,
  right: 50,
  bottom: 75,
  left: 100
}
const initialWidth = 700 - margin.left - margin.right

export default function TxsFrequencyChart(props: TxFreqChartProps) {
  const { transactions, color, height: heightChart } = props
  let height = heightChart - margin.top - margin.bottom

  const { safeAddress } = useStatistics()
  const [width, setWidth] = useState<number>(initialWidth)
  const [timePeriod, setTimePeriod] = useState('daily')
  const prevWidth = usePrevious(initialWidth)
  const [classId] = useState(`id${(Math.random() + 1).toString(36).substring(7)}chart`)

  const refSvg = useRef<any>()
  const refHistogram = useRef<any>()
  
  const handleWindowResize = () => {
    const newWidth =
      document.getElementById(classId)!.offsetWidth! - margin.left - margin.right
    if (!newWidth) {
      return
    }
    setWidth(newWidth)
  }

  const setBarGroups = (timePeriod: string) => {
    setTimePeriod(timePeriod)
  }

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  useEffect(() => {
    d3.selectAll(`.${classId}`).remove()
  }, [safeAddress])

  useEffect(() => {
    if (width !== prevWidth) {
      d3.selectAll(`.${classId}`).remove()
    }
    if (!transactions || transactions.length === 0) {
      return
    }
    const tally = {} as any
    transactions.forEach((tx, i) => {
      const date = new Date(tx.timestamp * 1000)
      const dateString = (timePeriod === 'daily')
        ? date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        : (timePeriod === 'monthly')
          ? date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
          : (timePeriod === 'yearly')
            ? date.getFullYear()
            : date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
      // + ('0' + date.getHours()).slice(-2) + ':00:00' // Hourly
      tally[dateString] = (tally[dateString] || 0) + 1
    })

    const data = []
    for (var date in tally) {
      if (tally.hasOwnProperty(date)) {
        data.push({
          date,
          value: tally[date],
          value2: 30,
          value3: 90
        })
      }
    }
    console.log({data})

    const svg = d3.select(refSvg.current!)

    const minDate = d3.min(data, (d) => new Date(d.date) as any)
    const maxDate = d3.max(data, (d) => new Date(d.date) as any)

    let countXAxisPositions
    const diffDates = Math.abs(maxDate.getTime() - minDate.getTime())
    if (timePeriod === 'yearly') {
      countXAxisPositions = Math.ceil(diffDates / (1000 * 3600 * 24 * 364))
    } else if (timePeriod === 'monthly') {
      countXAxisPositions = Math.ceil(diffDates / (1000 * 3600 * 24 * 30))
    } else if (timePeriod === 'daily') {
      countXAxisPositions = Math.ceil(diffDates / (1000 * 3600 * 24))
    } else {
      countXAxisPositions = Math.ceil(diffDates / (1000 * 3600 * 24)) // default
    }
    if (countXAxisPositions < 2) {
      countXAxisPositions = 2
    }

    const barPadding = 3
    let barWidth = width / (countXAxisPositions - 1) - barPadding
    barWidth = (barWidth < 5) ? 2 : barWidth - barPadding
    barWidth = (barWidth > 40) ? 40 : barWidth

    const xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([(barWidth / 2), width - (barWidth / 2)])
      //.range([0, width])
      .nice()
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.value) as any)])
      .range([height, 0])
      .nice()

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
        .attr('class', `bar ${classId}`)
        .attr('x', (d) => xScale(new Date(d.date)) - barWidth / 2)
        .attr('y', (d) => yScale(Number(d.value)))
        .attr('width', barWidth)
        .attr('height', (d) => height - yScale(Number(d.value)))
        .attr('transform', 'translate(75, 45)')
        .attr('fill', color)

    // Create x-axis
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat(
        (timePeriod === 'daily')
          ? '%d %b %Y'
          : (timePeriod === 'monthly')
            ? '%b %Y'
            : '%Y'
        ) as any)
      //.tickValues(xScale.ticks(10))
      //.tickValues(data.map((d) => new Date(d.date)))

    if (timePeriod === 'daily') {
      if (countXAxisPositions > 100) {
        xAxis.ticks(d3.timeMonth)
      } else if (countXAxisPositions > 100) {
        xAxis.ticks(d3.timeWeek)
      } else {
        xAxis.ticks(d3.timeWeek)
      }
    } else if (timePeriod === 'monthly') {
      xAxis.ticks(d3.timeMonth)
    } else if (timePeriod === 'yearly') {
      xAxis.ticks(d3.timeYear)
    }
    
    svg.append('g')
      .attr('class', `x-axis ${classId}`)
      .attr('transform', `translate(75, ${height + 45})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-90) translate(-40, -12)')

    // Create y-axis
    const yAxis = d3.axisLeft(yScale)
    svg.append('g')
      .attr('class', `y-axis ${classId}`)
      .attr('transform', 'translate(75, 45)')
      .call(yAxis)
  }, [transactions, width, timePeriod])

  return (
    <div id={classId} className="histogram" ref={refHistogram}>
      {transactions === undefined ? (
        <div className="empty-chart">Loading...</div>
      ) : transactions && transactions.length > 0 ? (
        <>
          <svg
            width="100%"
            height={height + margin.top + margin.bottom}
            ref={refSvg}
          />
          <div className="button-box">
            <button onClick={() => setBarGroups('daily')}>Daily</button>
            <button onClick={() => setBarGroups('monthly')}>Monthly</button>
            <button onClick={() => setBarGroups('yearly')}>Yearly</button>
          </div>
        </>
      ) : (
        <div className="empty-chart">No transactions</div>
      )}
    </div>
  )
}
