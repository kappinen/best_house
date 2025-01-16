import { Control } from 'ol/control.js'

class HelpDocument extends Control {
  constructor(opt_options) {
    const options = opt_options || {}

    const button = document.createElement('button');
    button.innerHTML = '?';
    button.className = 'help-button ol-unselectable ol-control';
    button.style = 'bottom: .5em; left: .5em;'

    super({
      element: button,
      target: options.target,
    })

    button.addEventListener('click', this.showHelp.bind(this), false)
  }

  showHelp() {
    const url = "https://www.stat.fi/static/media/uploads/tup/paavo/paavo2022_pitkakuvaus_fi.pdf"
    window.open(url, '_blank').focus();
  }
}

export default HelpDocument