import * as d3 from 'd3'

import roundedRect from '../util/roundedRect.js'

export default function ({ width, height, margin, cell, fontSize2, cornerRadius: r }, data) {
  const svg = d3.select('svg')
  const legendEl = svg.append('g')
    .classed('legend', true)
    .style('transform', `translate(${ width - margin.right }px, ${ cell * 3 }px)`)

  const labels = legendEl
    .selectAll('g.label')
    .data(data)
    .join('g')
    .classed('label', true)
    .style('transform', (d, i) => `translate(0, ${ i * cell * 3 }px)`)

  labels
    .append('text')
    .attr('font-size', fontSize2)
    .text(d => d.name)

  labels
    .append('path')
    .attr('d', (d, i) => {
      const topR = i == 0 ? r : 0
      const bottomR = i == data.length - 1 ? r : 0
      return roundedRect(
        cell * 2,
        -cell * 2,
        cell * 3,
        cell * 3,
        [topR, topR, bottomR, bottomR],
      )
    })
    .attr('fill', d => d.color)
}