import _ from 'lodash'
import * as d3 from 'd3'
import "@fontsource/roboto"

import Chart from './features/chart.js'
import Legend from './features/legend'
import loadData from './util/loadData.js'
import './style.css'

const source = await loadData('./data/d2.json')
// const r = await fetch('./data/sample.json')
// const source = await r.json()

let data = {}
_.each(source, d => {
  data[d.speed] = data[d.speed] || { speed: d.speed }
  data[d.speed][d.type] = d.time
})
data = _.sortBy(_.toArray(data), 'speed')

const cell = 12
const height = cell * 13 * 4
const width = cell * 23 * 4
const margin = {
  top: cell * 6,
  right: cell * 7,
  bottom: cell * 6,
  left: cell * 6,
}

const xExtent = d3.extent(data, d => d.speed)
const step = (xExtent[1] - xExtent[0]) / (data.length - 1)

const config = {
  colors: ['#1E1545', '#3BB3E5', '#D7D7D7'],
  cell,
  categories: ['gate', 'free'],
  width,
  height,
  padding: 0.3,
  margin,
  fontSize1: cell * 1.5,
  fontSize2: cell * 1.5 * 1.2,
  barWidth: (width - margin.left - margin.right) / data.length,
  cornerRadius: 3,
  step,
}

d3.select('svg')
  .attr('width', width)
  .attr('height', height)

Chart(config, data)

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