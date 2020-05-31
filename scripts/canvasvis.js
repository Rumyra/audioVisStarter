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

// soundcloudID: if you want to use a track from soundcloud pass in an id (as a string) here, otherwise mic is used:
const vis = new Vis(binSize, '433074246');

// setup our draw loop: THIS IS WHERE THE MAGIC HAPPENS!!
vis.draw( () => {

	ctx.clearRect(0, 0, screenDim.width, screenDim.height);
	// loop over our frequencies and draw a shape for each one
	vis.frequencies.forEach((f, i) => {
		ctx.translate( (i%8)*220, Math.floor(i/6)*200);
		let path = hexagon(f);
		ctx.lineWidth = 10.0;
		ctx.strokeStyle = `hsla(${i*8}, 50%, 50%, 1)`;
		ctx.stroke(path);
		ctx.resetTransform();
	})
	
} )

function degToRad(deg) {
	return (2*Math.PI)/deg;
}

function hexagon(sideLength = 60) {
	  // maths mother fucker
	  const moveX = Math.sin(degToRad(30))*sideLength;
	  const moveY = Math.cos(degToRad(30))*sideLength;

	  const hexPath = new Path2D();

	  // hexPath.moveTo(-sideLength/2, -moveY);
	  hexPath.moveTo(0, 0);
	  hexPath.lineTo(sideLength, 0);
	  hexPath.lineTo(sideLength+moveX, moveY);
	  hexPath.lineTo(sideLength, (moveY*2));
	  hexPath.lineTo(0, (moveY*2));
	  hexPath.lineTo(-moveX, moveY);
	  hexPath.lineTo(0, 0);

	  return hexPath;
}


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
