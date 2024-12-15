import * as d3 from 'd3'

import roundedRect from '../util/roundedRect.js'
import { stepRoundBefore as curveStepRound } from '../util/curveStepRound'
import getTranslateY from '../util/getTranslateY.js'

export default function ({ categories, width, height, margin, cell, fontSize1, fontSize2, cornerRadius, barWidth, padding, colors }, data) {
  const svg = d3.select('svg')
  svg.append('svg:defs').append('svg:marker')
    .attr('id', 'triangle')
    .attr('viewBox', '0 -5 10 10')
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('refX', 5)
    .attr('refY', 0)
    .attr('markerWidth', 12)
    .attr('markerHeight', 12)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .style('fill', '#808080')

  const colorScale = d3.scaleOrdinal(
    categories,
    ['#0C0237E8', '#2CAFE6E8'],
  )

  const xScale = d3.scaleBand(
    data.map(d => d.speed),
    [margin.left - barWidth * padding / 2, width - margin.right],
  ).padding(padding)

  const xExtent = d3.extent(data, d => d.speed)
  const stepLeft = xExtent[0] - (xExtent[1] - xExtent[0]) / (data.length - 1)
  const xScaleBaseline = d3.scaleBand(
    [stepLeft, ...data.map(d => d.speed)],
    [margin.left - barWidth, width - margin.right - barWidth * padding / 2],
  )

  const xScaleAxis = d3.scaleLinear(
    d3.extent(data, d => d.speed),
    [margin.left, width - margin.right],
  )

  const yScale = d3.scaleLinear(
    [0, d3.max(data, d => (d.gate || 0) + (d.free || 0) )],
    [height - margin.bottom, margin.top],
  )
  const maxY = yScale(0)

  const stack = d3.stack()
    .keys(categories)

  const series = stack(data)

  // Baseline
  const area = d3.area()
    .x(d => xScaleBaseline(d.speed) + barWidth)
    .y0(maxY)
    .y1(d => yScale(d.base))
    .curve(curveStepRound)
  svg.append('path')
    .classed('base-area', true)
    .datum([{ ...data[0], speed: stepLeft }, ...data])
    .attr('d', area)

  // Main
  const groups = svg.append('g')
    .classed('main', true)
    .selectAll('g')
    .data(series)
    .join('g')
    .style('fill', d => colorScale(d.key))

  groups.selectAll('path')
    .data(d => d)
    .join('path')
    .attr('d', d => {
      const isFlat = d[0] == 0 && d.data.free > 0 && d.data.gate > 0
      return roundedRect(
        xScale(d.data.speed),
        yScale(d[1]),
        xScale.bandwidth(),
        yScale(d[0]) - yScale(d[1]),
        [isFlat ? 0 : cornerRadius, isFlat ? 0 : cornerRadius, 0, 0],
      )
    })

  // X Axis
  const xAxis = d3.axisBottom(xScaleAxis)
    .ticks(10)

  const xAxisEl = svg.append('g')
    .classed('axis', true)
    .classed('x-axis', true)
    .attr('transform', `translate(0,${ height - margin.bottom })`)
    .call(xAxis)

  xAxisEl.append('line')
    .classed('line', true)
    .attr('x1', margin.left)
    .attr('y1', 0)
    .attr('x2', width - cell)
    .attr('y2', 0)
    .attr('marker-end', 'url(#triangle)')

  xAxisEl.append('text')
    .classed('label', true)
    .attr('x', width - margin.right / 2)
    .attr('y', cell * 2.2)
    .attr('font-size', fontSize2)
    .text('km/h')

  // Y Axis
  const yAxis = d3.axisLeft(yScale)
    .ticks(4)
  const yAxisEl = svg.append('g')
    .classed('axis', true)
    .classed('y-axis', true)
    .attr('transform', `translate(${ margin.left },0)`)
    .call(yAxis)

  yAxisEl.append('line')
    .classed('axis-line', true)
    .attr('x1', 0)
    .attr('y1', maxY)
    .attr('x2', 0)
    .attr('y2', cell)
    .attr('marker-end', 'url(#triangle)')

  yAxisEl.append('text')
    .classed('label', true)
    .attr('x', margin.left)
    .attr('y', cell)
    .attr('font-size', fontSize2)
    .text('seconds')

  svg.selectAll('.tick text')
    .style('font-size', `${ fontSize1 }px`)
  svg.selectAll('.domain')
    .style('stroke-width', `${ cell / 4 }px`)
}