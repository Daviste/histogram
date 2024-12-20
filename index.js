import _ from 'lodash'
import * as d3 from 'd3'
import '@fontsource/roboto'

import Chart from './features/chart.js'
import Legend from './features/legend'
import loadData from './util/loadData.js'
import './style.css'

let config = {}
let data = []

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
  const source = await loadData(`./data/d${ i }.json`)
  d3.selectAll('button')
    .classed('bg-primary', false)
    .classed('text-white', false)
  d3.select(`button:nth-of-type(${ i })`)
    .classed('text-white', true)
    .classed('bg-primary', true)

  const cache = {}
  _.each(source, (d, i) => {
    cache[d.speed] = cache[d.speed] || { speed: d.speed }
    cache[d.speed][d.type] = d.time || 0.1 // min value is a fix for defective enter / exit
  })
  data = _.sortBy(_.toArray(cache), 'speed')

  const xExtent = d3.extent(data, d => d.speed)
  const step = (xExtent[1] - xExtent[0]) / (data.length - 1)
  config.step = step

  render()
}

function render () {
  config.width = window.innerWidth

  const cell = config.width ** 0.38
  const margin = {
    top: cell * 6,
    right: cell * 7,
    bottom: cell * 6,
    left: cell * 5,
  }

  _.merge(config, {
    aspectRatio: 1.9,
    breakpoints: {
      xs: 480,
      sm: 768,
      lg: 1200
    },
    ticks: {
      xs: 2,
      sm: 3,
      lg: 5,
    },
    margin,
    colors: ['#1E1545', '#0079be'],
    cell,
    categories: ['gate', 'free'],
    padding: 0.3,
    fontSize1: cell * 1.5,
    fontSize2: cell * 1.5 * 1.2,
    cornerRadius: 3,
  })
  d3.select('svg')
    .attr('width', config.width)
    .attr('height', config.width / config.aspectRatio)

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
}

window.onresize = render
setData(1)