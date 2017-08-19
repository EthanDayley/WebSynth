"use strict"

class SimpleInstrument extends HTMLElement {
	//stuff for the graphics and controlling the instrument
	addWaveformInput() {
		let select = document.createElement("select");
		this.waveformSelect = select;
		//select.contentEditable = "true";
		let sine = document.createElement("option");
		let square = document.createElement("option");
		let sawtooth = document.createElement("option");
		sine.innerHTML = "sine";
		square.innerHTML = "square";
		sawtooth.innerHTML = "sawtooth";
		select.appendChild(sine);
		select.appendChild(square);
		select.appendChild(sawtooth);
		this.shadow.appendChild(select);
		this.shadow.appendChild(document.createElement("br"));
	}
	addAttackSelect() {
		let attack = document.createElement("input");
		let attackReflector = document.createElement("div");
		let startValue = 0.5;
		attack.type = "range";
		attack.min = 0;
		attack.max = "10";
		attack.step = 0.01;
		attack.style.right = 0;
		attack.style.position = "absolute";
		attack.defaultValue = startValue;
		attackReflector.style.display = "inline-block";
		attackReflector.style.color = "white";
		attackReflector.innerHTML = "attack: "+startValue;
		this.shadow.appendChild(attackReflector);
		this.shadow.appendChild(attack);
		this.attackSelect = attack;
		this.attackSelectReflector = attackReflector;
		this.shadow.appendChild(document.createElement("br"));
		this.attack = startValue;
	}
	addDecaySelect() {
		let decay = document.createElement("input");
		let decayReflector = document.createElement("div");
		let startValue = 0.5;
		decay.type = "range";
		decay.min = 0;
		decay.max = "10";
		decay.step = 0.01;
		decay.style.right = 0;
		decay.style.position = "absolute";
		decay.defaultValue = startValue;
		decayReflector.style.display = "inline-block";
		decayReflector.style.color = "white";
		decayReflector.innerHTML = "decay: "+startValue;
		this.shadow.appendChild(decayReflector);
		this.shadow.appendChild(decay);
		this.decaySelect = decay;
		this.decaySelectReflector = decayReflector;
		this.shadow.appendChild(document.createElement("br"));
		this.decay = startValue;
	}
	addSustainSelect() {
		let sustain = document.createElement("input");
		let sustainReflector = document.createElement("div");
		let startValue = 0.5;
		sustain.type = "range";
		sustain.min = 0;
		sustain.max = "10";
		sustain.step = 0.01;
		sustain.style.right = 0;
		sustain.style.position = "absolute";
		sustain.defaultValue = startValue;
		sustainReflector.style.display = "inline-block";
		sustainReflector.style.color = "white";
		sustainReflector.innerHTML = "sustain: "+startValue;
		this.shadow.appendChild(sustainReflector);
		this.shadow.appendChild(sustain);
		this.sustainSelect = sustain;
		this.sustainSelectReflector = sustainReflector;
		this.shadow.appendChild(document.createElement("br"));
		this.sustain = startValue;
	}
	addReleaseSelect() {
		let release = document.createElement("input");
		let releaseReflector = document.createElement("div");
		let startValue = 0.5;
		release.type = "range";
		release.min = 0;
		release.max = "10";
		release.step = 0.01;
		release.style.right = 0;
		release.style.position = "absolute";
		release.defaultValue = startValue;
		releaseReflector.style.display = "inline-block";
		releaseReflector.style.color = "white";
		releaseReflector.innerHTML = "release: "+startValue;
		this.shadow.appendChild(releaseReflector);
		this.shadow.appendChild(release);
		this.releaseSelect = release;
		this.releaseSelectReflector = releaseReflector;
		this.shadow.appendChild(document.createElement("br"));
		this.release = startValue;
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
			osc.type = this.waveform;
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
		//NOTE: attack decay sustain and release are initialized in these functions
		this.addWaveformInput();
		this.addAttackSelect();
		this.addDecaySelect();
		this.addSustainSelect();
		this.addReleaseSelect();
		//add event listeners to inputs
		let me = this;
		this.waveformSelect.addEventListener("change", function() {me.waveform = me.waveformSelect.value;});
		this.attackSelect.addEventListener("input", function() {me.attackSelectReflector.innerHTML = "attack: "+me.attackSelect.value;});
		this.decaySelect.addEventListener("input", function() {me.decaySelectReflector.innerHTML = "decay: "+me.decaySelect.value;});
		this.sustainSelect.addEventListener("input", function() {me.sustainSelectReflector.innerHTML = "sustain: "+me.sustainSelect.value;});
		this.releaseSelect.addEventListener("input", function() {me.releaseSelectReflector.innerHTML = "release: "+me.releaseSelect.value;});
		this.style.position = "absolute";
		this.style.width = "250";
		this.style.height = "200";
		this.style.top = "300";
		this.style.left = "300";
		this.style.background = "#555";
	}
	constructor() {
		super();
		//create the audio context
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
		this.notes = {}; //an object containing all the currently pressed notes
		this.waveform = "sine";
		this.shadow = this.createShadowRoot();
	}
};

customElements.define("simple-instrument", SimpleInstrument);
