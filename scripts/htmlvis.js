console.clear();
// import framework
import Vis from '/modules/Vis.js';

// setup
const visEl = document.querySelector('#visual');
const binSize = 128;
const elAmount = Math.floor(binSize/3); // Returned frequncies is a third

// make elements
for (let i=0; i<elAmount; i++) {
	// create an element
	const el = document.createElement('i');
	// append it
	visEl.appendChild(el);
}
// get those elements
const allEls = visEl.querySelectorAll('i');

// create a new vis
// params: binSize = size of frequency array returned
// soundcloudID: if you want to use a track from soundcloud pass in an id (as a string) here, otherwise mic is used:
// new Vis(binSize, '433074246');
const vis = new Vis(binSize);

let btnOn = false;

navigator.requestMIDIAccess({ sysex: false })
  .then(function(access) {

     // Get lists of available MIDI controllers
     const inputs = Array.from(access.inputs.values());
     //const outputs = Array.from(access.outputs.values());

	 if(inputs.length) {
		inputs[0].onmidimessage = function (message) {
			const data = message.data; // this gives us our [command/channel, note, velocity] data.
			console.log('MIDI data in', data); // MIDI data [144, 63, 73]
			
			if(data[1] === 53) {
				if(data[0] === 144) {
					btnOn = true;
				}else if (data[0] === 128) {
					btnOn = false;
					console.log('up')
				}
			}
		 }
	 }
     
  })
  .catch((err) =>{
	  console.log('error connecting to midi', err);
  })

// setup our draw loop: THIS IS WHERE THE MAGIC HAPPENS!!
vis.draw( () => {

	// console.log(vis.frequencies);
	vis.frequencies.forEach((f, i) => {
		allEls[i].style.width = (f+10)+'px';
		allEls[i].style.backgroundColor = `hsla(${i*5}, 50%, 50%, 1)`;
	})
	if(btnOn) {
		visEl.style.backgroundColor = 'yellow';
	}else {
		visEl.style.backgroundColor = 'white';
	}
	
} )


// ===================== CONTROLS edit here if you want to start/stop multiple vis
const controls = document.querySelector('#controls');

controls.querySelector('[data-control="play"]').addEventListener('click', function(e) {

	if (this.dataset.on === 'false') {
		this.dataset.on = "true";
    vis.start();
	} else {
    this.dataset.on = "false";
    vis.stop();
	}
   
})
