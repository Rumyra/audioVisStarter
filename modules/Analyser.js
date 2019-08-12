// Creates analyser & has methods to get data, bass, beats etc... ideally
// TODO switch source method
class Analyser {
  
  constructor(dataSize = 512, trackID = '433074246') {
    this.audio_ctx = new AudioContext();

    this.useMic = false;
    this.source = this._getSource();
		
		this.dataSize = dataSize;
    this.data = new Uint8Array(this.dataSize);
		this.frequencies = [];
    
    

    this.track_id = trackID;
    this.track = new Audio('/beast.mp3');
    this.track.crossOrigin = 'anonymous';

    this.analyser_node = this._createAnalyserNode();


  }

  getFrequencies() {
		return this.data.slice(0, this.dataSize/3);
	}
  
  // TODO add if mic or if music
  _getSource() {
    // pipe in analysing to getUserMedia
    if (this.useMic) {
      return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => this.audio_ctx.createMediaStreamSource(stream))
        .then(source => {
          source.connect(this.analyser_node);
        });
    } else {
      
        // let source = this.audio_ctx.createMediaElementSource(this.track)
        console.log(this.track);
      return new Promise((resolve, reject) => {
        this.audio_ctx.createMediaElementSource(this.track);
      }).then(source => {
          source.connect(this.analyser_node);
      });
      
    } 
    
  }
  
  // create an analyser node
  _createAnalyserNode() {
    return new AnalyserNode(this.audio_ctx, {
      fftSize: this.dataSize*2,
      maxDecibels: -25,
      minDecibels: -60,
      smoothingTimeConstant: 0.5,
    })
  }
  
  getData() {
    this.analyser_node.getByteFrequencyData(this.data);
  }

  _createSoundcloudTrack() {
    this.client_id = 'z8LRYFPM4UK5MMLaBe9vixfph5kqNA25';
    this.track.src = `https://api.soundcloud.com/tracks/${this.track_id}/stream?client_id=${this.client_id}`;
    this.track.crossOrigin = 'anonymous';
  }

  _createLocalTrack() {
    this.track.src = '/beast.mp3';
    this.track.crossOrigin = 'anonymous';
  }

  // _createTrack() {
  //   this.audio = new Audio(this.source);
  //   this.audio.crossOrigin = "anonymous";
  //   return this.audio;
  // }
  
  run() {
		// check if context is in suspended state (autoplay policy)
		if (this.audio_ctx.state === 'suspended') {
			this.audio_ctx.resume();
		}
    if (!this.useMic) {
      this.track.play()
    }
    this.source.then(this.getData());
  }
  
  disconnect() {
    if (!this.useMic) {
      this.track.pause();
    }
    this.analyser_node.disconnect();
  }
}

export default Analyser;