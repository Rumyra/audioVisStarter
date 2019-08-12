console.clear();
// import framework
import Vis from '/modules/Vis.js';

// setup
const visEl = document.querySelector('#visual');
// setup 2D canvas plus resize
// set up dpr for  vis
const dpr = window.devicePixelRatio;
// get window dimensions & set canvas to fill window
function Dimensions() {
	this.width = (window.innerWidth)*dpr;
	this.height = (window.innerHeight)*dpr;
	this.centerX = this.width/2;
	this.centerY = this.height/2;
	
	this.setFullscreen = function(el) {
		el.width = this.width;
		el.height = this.height;
	}
	
	this.update = function() {
		this.width = (window.innerWidth)*dpr;
		this.height = (window.innerHeight)*dpr;
	}
}

let screenDim = new Dimensions();
screenDim.setFullscreen(visEl);
window.addEventListener("resize", function(e) {
	screenDim.update();
	screenDim.setFullscreen(visEl);
	init();
}, false);
const ctx = visEl.getContext('2d');
// set up canvas defaults
ctx.lineWidth = 0.0;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

const binSize = 128;
const elAmount = Math.floor(binSize/3); // Returned frequncies is a third

// create a new vis -> pass in bin size and if you're using soundcloud you can pass in a track id here
const vis = new Vis(binSize);

// setup our draw loop: THIS IS WHERE THE MAGIC HAPPENS!!
vis.draw( () => {

	ctx.clearRect(0, 0, screenDim.width, screenDim.height);
	// instead of looping over our frequencies - let's loop over our paths, but _use_ our frequency vals
	vis.frequencies.forEach((f, i) => {
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.arc(i*10, i*10, f, 0, 5);
		ctx.fill();
		ctx.closePath();
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
controls.querySelector('[data-control="input"]').addEventListener('click', function(e) {

	if (this.dataset.toggle === 'mic') {
		this.dataset.toggle = "music";
	} else {
    this.dataset.toggle = "mic";
	}
   
})