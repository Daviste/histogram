import _ from 'lodash'
import * as d3 from 'd3'

import Chart from './features/chart.js'
import Legend from './features/legend'
import source from './data/first.json'
import './style.css'

let data = {}
_.each(source, d => {
  data[d.speed] = data[d.speed] || { speed: d.speed }
  data[d.speed][d.type] = d.time / 3
})
data = _.sortBy(_.toArray(data), 'speed')

const cell = 12
const height = cell * 13 * 4
const width = cell * 23 * 4
const margin = {
  top: cell * 7,
  right: cell * 6,
  bottom: cell * 6,
  left: cell * 6,
}

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
  cornerRadius: 6,
}

d3.select('svg')
  .attr('width', width)
  .attr('height', height)

Chart(config, data)

Legend(config, [{
  name: 'All DH Training Days',
  color: config.colors[2],
}, {
  name: 'Free Ski',
  color: config.colors[1],
}, {
  name: 'DH Gates',
  color: config.colors[0],
}])