import { Control } from 'ol/control.js'

class Schools extends Control {

  constructor(opt_options) {
    const options = opt_options || {}
    const textarea = document.createElement('textarea')
    textarea.id = 'info-bar'
    textarea.className = 'info-bar ol-unselectable ol-control'
    textarea.readOnly = true
    textarea.hidden = true
    
    //Kilonpuiston koulu
    const points =[
        {name: "Helsingin Suomalainen Yhteiskoulu", lon: 383055.83913966065, lat: 6676887.037358707},
        {name: "Helsingin normaalilyseo", lon:385898.9042941348, lat: 6671315.395331932},
        {name: "Tapiolan koulu ja lukio", lon:378244.4184721705, lat: 6673383.2787356125},
        {name: "Helsingin Ranskalais-Suomalainen koulu", lon:381942.9666033166, lat: 6676441.702589864},
        {name: "Pakilan yläaste", lon:385200.6002099586, lat: 6680134.40545008},
        {name: "Espoon kristillinen koulu", lon:375398.0709046226, lat: 6677726.441983704},
        {name: "Espoon Steinerkoulu", lon:374256.66985838726, lat: 6673551.2471375475},
        {name: "Espoo International", lon:374663.4732624565, lat: 6674774.75613252},
        {name: "Mankkaan koulu", lon:376832.61608753994, lat: 6674977.95179876},
        {name: "Olarin koulu", lon:374487.7418147978, lat: 6673631.303075223},
        {name: "Englantilainen koulu", lon:383328.684311939, lat: 6674839.672061054},
        {name: "Kuitinmäen koulu", lon:373883.9407987226, lat: 6672310.622671242},
        {name: "Helsingin Rudolf Steiner -koulu", lon:383893.8796292022, lat: 6675114.987147779},
        {name: "Yhtenäiskoulu", lon:385917.8139307323, lat: 6677032.121821493},
        {name: "Vanttilan koulu", lon:367774.3716876282, lat: 6674252.721057027},
        {name: "Haukilahden koulu", lon:376016.14788106625, lat: 6672011.442125324},
        {name: "Oulunkylän yhteiskoulu", lon:387226.6330101506, lat: 6679421.211481528},
        {name: "Torpparinmäen peruskoulu", lon:386604.3376526938, lat: 6682528.286852444},
        {name: "Helsingin yliopiston Viikin normaalikoulu", lon:390893.8119019849, lat: 6678408.741231638},
        {name: "Pohjois-Haagan yhteiskoulu", lon:383549.7958802086, lat: 6678546.681801075},
        {name: "Munkkiniemen yhteiskoulu", lon:382392.26306727005, lat: 6675598.864773606},
        {name: "Kasavuoren koulu", lon:372764.78212055657, lat: 6677621.69393477},
        {name: "Ylästön koulu	", lon:384380.1241368776, lat: 6684685.953534492},
        {name: "Nöykkiön koulu", lon:370365.06564590416, lat: 6672451.218323476},
        {name: "Martinkallion koulu", lon:371025.45957956184, lat: 6671214.777736185},
        {name: "Kalajärven koulu", lon:374773.2374746335, lat: 6687831.21854776},
        {name: "Saunalahden koulu", lon:367701.8652343512, lat: 6672617.34567489},
        {name: "Aurinkolahden peruskoulu", lon:397189.68728406023, lat: 6675502.1147472095},
        {name: "Espoonlahden koulu", lon:370320.2211182238, lat: 6669798.764299106},
        {name: "Vantaan kansainvälinen koulu", lon:387129.87529626506, lat: 6684837.131285627},
        {name: "Meilahden yläaste", lon:383472.74583667645, lat: 6674883.4940382885},
    ];

    super({
      element: textarea,
      target: options.target,
    })
  }

}

export default Schools