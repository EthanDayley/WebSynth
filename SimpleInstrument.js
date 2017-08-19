"use strict"

class SimpleInstrument extends HTMLElement {
	//stuff for the graphics and controlling the instrument
	addWaveformInput() {
		let waveformInput = document.createElement("input");
		waveformInput.type = "text";
		waveformInput.contentEditable = "true";
		waveformInput.innerHTML = "test";
		console.log(this.shadow);
		this.shadow.appendChild(waveformInput);
	}
	//stuff for actually playing the notes
	getFrequency(note) {
		return 440 * Math.pow(2,(note-69)/12);
	}
	receiveSignal(note, isPressed) {
		if (isPressed) {
			let osc = this.ctx.createOscillator();
			this.notes[note] = osc;
			osc.frequency.value = this.getFrequency(note);
			console.log(osc);
			osc.type = "sawtooth";
			osc.connect(this.ctx.destination);
			osc.start();
		}
		else {
			this.notes[note].stop();
			delete this.notes[note];
		}
	}
	connectedCallback() {
		console.log("SimpleInstrument connected");
		//build the graphical representation of the instrument
		this.addWaveformInput();
	}
	constructor() {
		super();
		//create the audio context
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
		this.notes = {}; //an object containing all the currently pressed notes
		this.shadow = this.createShadowRoot();
	}
};

customElements.define("simple-instrument", SimpleInstrument);
