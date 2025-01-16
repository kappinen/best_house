import { Control } from 'ol/control.js'
import { Style, Fill, Stroke } from 'ol/style'

class QueryControl extends Control {
  vectorSource = undefined;
  
  constructor(opt_options, vectorSource) {
    const options = opt_options || {}

    const cookie = document.cookie
    .split(';')
    .filter(a=>a.trim().startsWith('query'))
    .map(a=> a.substring(a.indexOf('=') + 1))[0]

    const textarea = document.createElement('textarea')
    textarea.id = 'query-criteria'
    textarea.innerHTML = (cookie || options.query).replace('query=', '')
    textarea.className = 'query-bar ol-unselectable ol-control'

    textarea.onkeydown = (event) =>
      event.key === 'Enter' ? false : true


    super({
      element: textarea,
      target: options.target,
    })

    this.vectorSource = vectorSource
    textarea.addEventListener('keydown', this.queryCriteria.bind(this), false)
  }

  isVariableChar(c) {
    const n = (c || '').charCodeAt(0)
    return (n > 47 && n < 58) || (n > 64 && n < 91) || (n > 96 && n < 123) || n === 95
  }

  safe(value, defaultValue) {
    return (value == undefined || isNaN(value)) ? defaultValue : value
  }

  colorScale(perc) {
    var r, g = 0
    if (isNaN(perc)) {
      r = 0
      g = 0
    } else if (perc < 0.5) {
      r = 255
      g = 255 * perc
    } else {
      g = 255
      r = 255 * (1 - perc)
    }

    return new Style({
      fill: new Fill({
        color: `rgba(${r},${g},0,0.7)`
      }),
      stroke: new Stroke({
        color: 'rgba(0,0,0,1)',
        width: 1.25,
      })
    })
  }

  calculateMedian(data) {
    const sortedData = data.sort((a, b) => a - b);
    const middle = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      return (sortedData[middle - 1] + sortedData[middle]) / 2;
    } else {
      return sortedData[middle];
    }
  }

  calculateMAD(data, median) {
    return this.calculateMedian(
      data.map(x => Math.abs(x - median))
      );
  }
  
  scoreFeatures(criteria, name = 'score', updateColors = true) {

    const features = this.vectorSource.getFeatures()

    var min = undefined
    var max = undefined

    features.forEach(feature => {

      var startRecord = false
      var variableName = ''
      var fullQuery = ''

      criteria.split('').forEach(c => {
        if (c === '$') {
          startRecord = true
          variableName = ''
        } else if (startRecord && this.isVariableChar(c)) {
          variableName = variableName.concat(c)
        } else if (startRecord && !this.isVariableChar(c)) {
          fullQuery = fullQuery.concat(feature.get(variableName)).concat(c)
          startRecord = false
          variableName = ''
        } else {
          fullQuery = fullQuery.concat(c)
        }
      })

      if (variableName !== '') {
        fullQuery = fullQuery.concat(feature.get(variableName))
      }

      const score = Math.max(this.safe(eval(fullQuery), 0), 0)
      if (score > 0) {
        feature.set(name, score)

        min = Math.min(score, this.safe(min, score))
        max = Math.max(score, this.safe(max, score))
      } else {
        feature.set(name, undefined)
      }
    })

    const data = features.map(f=> {
      return f.get(name)
    })
  
    const median = this.calculateMedian(data)
    const MAD = this.calculateMAD(data, median)

    features.forEach(feature => {
      const normalizedName = `norm_${name}`
      const x = feature.get(name)
      const nscore = (x - min) / (max - min)
      const zscore = (x - median) / (Number(1.4826) * MAD)
      
      feature.set(normalizedName, nscore)
      feature.set(`zscore_${name}`, zscore)
      //console.log(`${zscore} from: ${median} to:${MAD}`)
      if (updateColors) {
        feature.setStyle(this.colorScale(nscore))
      }
    })
  }

  queryCriteria(event) {
    if (event.key === 'Enter') {
      const criteria = (document.getElementById('query-criteria').value || '')
      var startRecord = false
      var fullQuery = ''
      var subQuery = ''
      var paramCounter = 1

      criteria.split('').forEach(c => {
        if (c === '{') {
          startRecord = true
          subQuery = ''
        } else if (startRecord && c === '}') {
          startRecord = false
          this.scoreFeatures(subQuery, `sub_parameter${paramCounter}`, false)
          fullQuery = fullQuery.concat(`$norm_sub_parameter${paramCounter}`)
          paramCounter = paramCounter + 1
        } else if (startRecord) {
          subQuery = subQuery.concat(c)
        } else {
          fullQuery = fullQuery.concat(c)
        }
      })

      this.scoreFeatures(fullQuery)
      document.getElementById('query-criteria').classList.remove('invalid-bar')
      document.cookie = `query=${criteria}; path=/`
    }
  }
}



export default QueryControl