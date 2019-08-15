console.clear();
// import framework
import Vis from '/modules/Vis.js';

// setup
const visEl = document.querySelector('#visual');
const binSize = 128;
const elAmount = Math.floor(binSize/3); // Returned frequncies is a third

// get those elements
const allPaths = visEl.querySelectorAll('path');

const buttonStates = {
	53: false,
	54: false,
	55: false,
	56: false,
	57: false,
	58: false,
	59: false,
	60: false,
};
let cc1 = 0;
let cc2 = 0;

navigator.requestMIDIAccess({ sysex: false })
  .then(function(access) {

     // Get lists of available MIDI controllers
     const inputs = Array.from(access.inputs.values());
     //const outputs = Array.from(access.outputs.values());

	 if(inputs.length) {
		inputs[0].onmidimessage = function (message) {
			const data = message.data; // this gives us our [command/channel, note, velocity] data.
			console.log('MIDI data in', data); // MIDI data [144, 63, 73]
			
			if(data[0] === 144) {
				buttonStates[data[1]] = true;
				console.log(data[1]);
			}else if (data[0] === 128) {
				buttonStates[data[1]] = false;
			}

			if(data[0] === 176) {
				if(data[1] === 1) {
					cc1 = data[2];
				}
				else if (data[1] === 2) {
					cc2 = data[2];
				}
			}
		 }
	 }
     
  })
  .catch((err) =>{
	  console.log('error connecting to midi', err);
  })

// create a new vis -> pass in bin size and if you're using soundcloud you can pass in a track id here
const vis = new Vis(binSize);

// setup our draw loop: THIS IS WHERE THE MAGIC HAPPENS!!
vis.draw( () => {

	// instead of looping over our frequencies - let's loop over our paths, but _use_ our frequency vals
	allPaths.forEach((p, i) => {
		p.style.opacity = 1-(vis.frequencies[i]/255);
		if(p.id && p.id.startsWith('back')) {
			if(buttonStates['53']) {
				p.style.fill = '#ff0';
			}
			else if(buttonStates['54']) {
				p.style.fill = '#f00';
			}
			else if(buttonStates['55']) {
				p.style.fill = '#888';
			}
			else if(buttonStates['56']) {
				p.style.fill = '#0f0';
			}
			else {
				p.style.fill = '#231f20';
			}
		}

		if(buttonStates['57']) {
			visEl.style.backgroundColor = '#0f0';
		}
		else if(buttonStates['58']) {
			visEl.style.backgroundColor = '#888';
		}
		else if(buttonStates['59']) {
			visEl.style.backgroundColor = '#dd0';
		}
		else if(buttonStates['60']) {
			visEl.style.backgroundColor = '#00f';
		}
		else {
			visEl.style.backgroundColor = '#fff';
		}
		// console.log(p.id);

		visEl.style.transform = `rotate(${cc1 * 2.9}deg)`;
		visEl.style.width = `${cc2 * 0.9}%`;
	})
	
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

// if toggle
// change audioData source
// controls.querySelector('[data-control="input"]').addEventListener('click', function(e) {

// 	if (this.dataset.toggle === 'mic') {
// 		this.dataset.toggle = "music";
// 	} else {
//     this.dataset.toggle = "mic";
// 	}
   
// })