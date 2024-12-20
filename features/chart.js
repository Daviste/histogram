import _ from 'lodash'
import * as d3 from 'd3'

import roundedRect from '../util/roundedRect.js'
import { stepRoundBefore as curveStepRound } from '../util/curveStepRound'

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

export default function (c, data) {
  const breakpoints = _.map(c.breakpoints, (value, key) => ({ key, value }))
  const breakpoint = _.find(breakpoints, (b, i) => {
    const next = breakpoints[i + 1]
    if (c.width < b.value || (c.width > b.value && (!next || c.width < next.value))) return true
  }).key
  const height = c.width / c.aspectRatio
  const barWidth = (c.width - c.margin.left - c.margin.right) / data.length
  const xScale = d3.scaleBand(
    data.map(d => d.speed),
    [c.margin.left - barWidth * c.padding / 2, c.width - c.margin.right],
  ).padding(c.padding)


  const colorScale = d3.scaleOrdinal(
    c.categories,
    c.colors,
  )
  const xExtent = d3.extent(data, d => d.speed)
  const stepLeft = xExtent[0] - (xExtent[1] - xExtent[0]) / (data.length - 1)
  const xScaleBaseline = d3.scaleBand(
    [stepLeft, ...data.map(d => d.speed)],
    [c.margin.left - barWidth, c.width - c.margin.right - barWidth * c.padding / 2],
  )

  const xScaleAxis = d3.scaleLinear(
    d3.extent(data, d => d.speed),
    [c.margin.left, c.width - c.margin.right],
  )

  const yScale = d3.scaleLinear(
    [0, d3.max(data, d => (d.gate || 0) + (d.free || 0))],
    [height - c.margin.bottom, c.margin.top],
  )
  const maxY = yScale(0)

  const stack = d3.stack()
    .keys(c.categories)

  const series = stack(data)

  function baseArea () {
    const area = d3.area()
      .x(d => xScaleBaseline(d.speed) + barWidth)
      .y0(maxY)
      .y1(d => yScale(d.base))
      .curve(curveStepRound)
    svg.append('path')
      .classed('base-area', true)
      .datum([{ ...data[0], speed: stepLeft }, ...data])
      .attr('d', area)
  }

  // Main
  const groups = svg.selectAll('g.plot').data([null]).join('g')
    .classed('plot', true)
    .selectAll('g')
    .data(series)
    .join('g')
    .style('fill', d => colorScale(d.key))

  groups.selectAll('path')
    .data(d => d)
    .join('path')
    .transition()
    .duration(750)
    .attr('class', d => `speed-${ d.data.speed }`, true)
    .attr('d', d => {
      const isFlat = d[0] == 0 && d.data.free > 0 && d.data.gate > 0
      return roundedRect(
        xScale(d.data.speed),
        yScale(d[1]),
        xScale.bandwidth(),
        yScale(d[0]) - yScale(d[1]),
        [isFlat ? 0 : c.cornerRadius, isFlat ? 0 : c.cornerRadius, 0, 0],
      )
    })

  // X Axis
  const xAxis = d3.axisBottom(xScaleAxis)
    .ticks(c.ticks[breakpoint] + 1)

  const xAxisEl = svg.selectAll('g.x-axis').data([null]).join('g')
    .classed('axis', true)
    .classed('x-axis', true)
    .attr('transform', `translate(0,${ height - c.margin.bottom })`)
    .call(xAxis)

  // Y Axis
  const yAxis = d3.axisLeft(yScale)
    .ticks(c.ticks[breakpoint])
  const yAxisEl = (d3.select('g.y-axis').node() ? d3.select('g.y-axis') : svg.append('g'))
    .classed('axis', true)
    .classed('y-axis', true)
    .attr('transform', `translate(${ c.margin.left },0)`)
    .transition()
    .call(yAxis)
    .selection()

  xAxisEl.selectAll('text.label').data([null]).join('text')
    .classed('label', true)
    .attr('x', c.width - c.margin.right / 2)
    .attr('y', c.cell * 2.2)
    .attr('font-size', c.fontSize2)
    .text('km/h')

  xAxisEl.selectAll('line.axis').data([null]).join('line')
    .classed('axis', true)
    .attr('x1', c.margin.left)
    .attr('y1', 0)
    .attr('x2', c.width - c.cell)
    .attr('y2', 0)
    .attr('marker-end', 'url(#triangle)')

  yAxisEl.selectAll('line.axis').data([null]).join('line')
    .classed('axis', true)
    .attr('x1', 0)
    .attr('y1', maxY)
    .attr('x2', 0)
    .attr('y2', c.cell)
    .attr('marker-end', 'url(#triangle)')

  yAxisEl.selectAll('text.label').data([null]).join('text')
    .classed('label', true)
    .attr('x', c.cell + c.margin.left)
    .attr('y', c.cell)
    .attr('font-size', c.fontSize2)
    .text('seconds')

  svg.selectAll('.domain')
    .style('stroke-width', `${ c.cell / 4 }px`)
  svg.selectAll('.tick text')
    .style('font-size', `${ c.fontSize1 }px`)
}