import * as d3 from 'd3'

export default function ({ width, height, margin, cell, fontSize2, step }, d) {
  const data = d?.data
  const svg = d3.select('svg')
  svg.select('g.tooltip').remove()
  if (!data) return

  const container = svg.append('g')
    .classed('tooltip', true)
    .style('transform', `translate(${ width - margin.right - cell * 6 }px, ${ cell * 2 }px)`)

  container
    .append('text')
    .classed('speed', true)
    .attr('dx', -cell * 8)
    .attr('dy', cell * 2.5)
    .attr('font-size', fontSize2)
    .text(`${ data?.speed - step } - ${ data?.speed } km/h`)

  container
    .selectAll('text.time')
    .data([data.free, data.gate])
    .join('text')
    .classed('time', true)
    .attr('y', cell)
    .attr('dx', -cell)
    .attr('dy', (d, i) => `${ i * cell * 3 }`)
    .attr('font-size', fontSize2)
    .text(d => d)
}