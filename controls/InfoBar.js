import { Control } from 'ol/control.js'

class InfoBar extends Control {

  constructor(opt_options) {
    const options = opt_options || {}
    const textarea = document.createElement('textarea')
    textarea.id = 'info-bar'
    textarea.className = 'info-bar ol-unselectable ol-control'
    textarea.readOnly = true
    textarea.hidden = true

    super({
      element: textarea,
      target: options.target,
    })
  }
}

export default InfoBar