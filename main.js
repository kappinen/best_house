import './style.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import * as proj from 'ol/proj'
import * as olproj4 from 'ol/proj/proj4'
import proj4 from 'proj4'
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import { bbox as bboxStrategy } from 'ol/loadingstrategy.js'
import { defaults as defaultControls } from 'ol/control.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import { default as QueryControl } from "./controls/QueryControl.js";
import { default as InfoBar } from "./controls/InfoBar.js";
import { default as HelpDocument } from "./controls/HelpDocument.js";
import { default as SearchLocation } from "./controls/SearchLocation.js";


// lapsiperheet + omistus asunnot : {$te_laps / $te_taly} + {$te_omis_as / $te_taly}
proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
olproj4.register(proj4)

const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: function (extent) {
    return (
      'http://geo.stat.fi/geoserver/postialue/wfs?' +
      'request=GetFeature&service=WFS&version=2.0.0&typeName=postialue:pno_tilasto_2022&outputFormat=application/json&srsname=EPSG:3067&' +
      'bbox=' +
      extent.join(',') +
      ',EPSG:3067'
    )
  },
  strategy: bboxStrategy,
})

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: {
    'stroke-width': 0.95,
    'stroke-color': 'blue',
    'fill-color': 'rgba(100,100,100,0.5)',
  },
})

const locationSource = new VectorSource({
  features: [],
})

const map = new Map({
  controls: defaultControls().extend([
    new QueryControl({ query: '{Math.sqrt(($ko_yliop + $ko_yl_kork) / $ko_ika18y)} + 0.5 * {Math.sqrt($tr_mtu)}' }, vectorSource),
    new HelpDocument(),
    new InfoBar(),
    new SearchLocation({ source: locationSource })]),
  layers: [
    new TileLayer({
      crossOrigin: "anonymous",
      source: new OSM({
        crossOrigin: "anonymous"
      }),
    }),
    vectorLayer, new VectorLayer({
      source: locationSource,
    })
  ],
  target: 'map',
  view: new View({
    projection: proj.get('EPSG:3067'),
    center: [385308.7145491943, 6675872.437975463],
    zoom: 13
  })
})

map.on('loadend', function () {
  document.getElementById('query-criteria').dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter' }))
})

map.on('singleclick', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  const textarea = document.getElementById('info-bar')
  if (feature !== undefined) {
    const properties = Object.entries(feature.getProperties())
      .map(key => `${key[0]}=${key[1]}`)
      .join('\n')

    textarea.innerHTML = `score: ${feature.get('score')} normalized: ${feature.get('norm_score')} zscore:${feature.get('zscore_score')}\n\n${properties}`
    textarea.hidden = false
    textarea.focus()
  } else {
    textarea.hidden = true
  }
})

document.onkeyup = (event) => {
  if (event.key === 'Escape') {
    document.getElementById('info-bar').hidden = true
  } else if (event.ctrlKey && event.key === "i") {
    const textarea = document.getElementById('info-bar')

    textarea.innerHTML = vectorSource.getFeatures()
      .filter(a => a.get('zscore_score') !== undefined && !isNaN(a.get('zscore_score')))
      .sort((a, b) => b.get('zscore_score') - a.get('zscore_score'))
      .map((f, i) => `${i}: ${f.get("postinumeroalue")}, ${f.get("nimi")}, ${f.get('zscore_score')}`)
      .join('\n')

    textarea.hidden = false
    textarea.focus()
  }
}
