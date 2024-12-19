import _ from 'lodash'
import * as d3 from 'd3'
import '@fontsource/roboto'

import Chart from './features/chart.js'
import Legend from './features/legend'
import loadData from './util/loadData.js'
import './style.css'

const sets = _.range(1, 5)
const dataSelector = d3.select('.data-selector')
dataSelector.selectAll('button')
  .data(sets)
  .join('button')
  .attr('class', 'py-2 px-4 border uppercase', true)
  .classed('rounded-l', d => d === 1)
  .classed('rounded-r', d => d === sets.length)
  .text(d => `Data ${ d }`)
  .on('click', (e, d) => setData(d))

async function setData (i) {
  let data = {}
  const source = await loadData(`./data/d${ i }.json`)
  d3.selectAll('button')
    .classed('bg-primary', false)
    .classed('text-white', false)
  d3.select(`button:nth-of-type(${ i })`)
    .classed('text-white', true)
    .classed('bg-primary', true)

  _.each(source, d => {
    data[d.speed] = data[d.speed] || { speed: d.speed }
    data[d.speed][d.type] = d.time || 0.1 // min value is a fix for defective enter / exit
  })
  data = _.sortBy(_.toArray(data), 'speed')

  const xExtent = d3.extent(data, d => d.speed)
  const step = (xExtent[1] - xExtent[0]) / (data.length - 1)
  config.step = step
  config.barWidth = (width - margin.left - margin.right) / data.length

  d3.select('svg')
    .attr('width', width)
    .attr('height', height)

  Chart(config, data)
}

const cell = 12
const height = cell * 13 * 4
const width = cell * 23 * 4
const margin = {
  top: cell * 6,
  right: cell * 7,
  bottom: cell * 6,
  left: cell * 6,
}

const config = {
  colors: ['#1E1545', '#0079be'],
  cell,
  categories: ['gate', 'free'],
  width,
  height,
  padding: 0.3,
  margin,
  fontSize1: cell * 1.5,
  fontSize2: cell * 1.5 * 1.2,
  cornerRadius: 3,
}

Legend(config, [{
//   name: 'All DH Training Days',
//   color: config.colors[2],
// }, {
  name: 'Free Ski',
  color: config.colors[1],
}, {
  name: 'DH Gates',
  color: config.colors[0],
}])

setData(1)