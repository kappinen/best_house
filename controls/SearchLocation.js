import { Control } from 'ol/control.js'
import * as proj from 'ol/proj'
import Point from 'ol/geom/Point';
import { Feature } from 'ol'

class SearchLocation extends Control {

    constructor(opt_options) {
        const options = opt_options || {}

        const button = document.createElement('button');
        button.innerHTML = '&#128269;';

        const input = document.createElement('input');
        input.id = 'search-input'
        input.style = 'margin-left:5px; opacity: 0.7;'
        input.hidden = true


        const div = document.createElement('div')
        div.id = 'search-div'
        div.style = 'top: 65px; left: .5em; display: flex;'
        div.className = 'ol-unselectable ol-control'

        div.appendChild(button)
        div.appendChild(input)

        super({
            element: div,
            target: options.target,
        })

        button.addEventListener('click', this.showSearch.bind(this), false)
        input.addEventListener('keydown', this.doSearch.bind(this, opt_options.source), false)
    }

    showSearch() {
        const input = document.getElementById('search-input')
        input.hidden = !input.hidden
        if (!input.hidden) {
            input.focus()
        }
    }

    doSearch(iconSource, event) {
        if (event.key === 'Enter') {
            const s = document.getElementById('search-input').value
            fetch(`http://nominatim.openstreetmap.org/search?q=${s}&countrycodes=FI&format=json&limit=3&addressdetails=1`)
                .then((response) => response.json())
                .then(function (json) {
                    const pos = json[0]

                    const point = proj.transform([pos.lon, pos.lat], 'EPSG:4326', 'EPSG:3067')
                    console.log(`{name: \"${s}\", lon:${point[0]}, lat: ${point[1]}}`)
                    console.log(`${JSON.stringify(pos)}`)
                    iconSource.addFeature(
                        new Feature({
                            geometry: new Point(point),
                            name: pos.display_name,
                        })
                    )
                    document.getElementById('search-input').hidden = true
                    document.getElementById('search-input').value = ''
                })
        }
    }

}

export default SearchLocation