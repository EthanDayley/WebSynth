"use strict"

/*this is an input element that listens for input and then sends the
  fequency of the received note to all the elements in the property "outputs"
*/
class SimpleInput extends HTMLElement {
	//MIDI HANDLING METHODS
	getAddedSignals() {
		let s = 0;
		for (let i = 0; i < this.listNotes.length; i++) {
			s += this.listNotes[i].hertz;
		}
		return s;
	}
	/*sendSignal() {
		let hertz = this.getAddedSignals();
		console.log(hertz+" hz ");
		for (let i = 0; i < this.outputs.length; i++) {
			this.outputs[i].receiveSignal(hertz);
		}
	}*/
	sendSignal(note, isPressed) {
		for (let i = 0; i < this.outputs.length; i++) {
			this.outputs[i].receiveSignal(note, isPressed);
		}
	}
	getFrequency(note) {
		return 440 * Math.pow(2,(note-69)/12);
	}
	sendMIDI(event, me) {
		if (event.data[2] != 0) { //note was pressed
			//this.sendSignal(this.getFrequency(event.data[1]), true);
			//this.listNotes.push({note: event.data[1], hertz: this.getFrequency(event.data[1])});
			this.sendSignal(event.data[1], 1);
		}
		else {  //note was released
			//this.sendSignal(0, false);
			/*let index = 0;
			for (let i = 0; i < this.listNotes.length; i++) {
				if(this.listNotes[i] == event.data[1]) {
					index = i;
					break;
				}
			}
			this.listNotes.splice(index, 1);*/
			this.sendSignal(event.data[1], 0);
		}
	}
	//MIDI INITIALIZATION METHODS
	onMIDISuccess(midiAccess) {
		this.midi = midiAccess;
		let me = this;
		this.midi.inputs.forEach( function(entry) {entry.onmidimessage = function(event) {me.sendMIDI(event, me);}});
	}
	onMIDIFailure(msg) {
		let err = {source: this, msg: msg};
		throw err;
	}
	//BASE INITIALIZATION METHODS
	refresh() { //refresh element (especially the graphics)
		let style = this.style;
		style.width = this.width;
		style.height = this.height;
		style.background = this.background;
		style.position = "absolute";
	}
	connectedCallback() {
		let me = this; //for preserving the this keyword
		//set defaults
		this.outputs = []; //the devices to send output to
		this.width = 100;
		this.height = 100;
		this.background = "#333";
		this.refresh();
		//MIDI stuff
		this.listNotes = [];
		console.log("connected input");
		//start the MIDI listener
		navigator.requestMIDIAccess().then(function(midiAccess) {me.onMIDISuccess(midiAccess)}, function(msg) {me.onMIDIFailure(msg)});

	}
	constructor() {
		super();
	}
	//getters/setters
	get width() {
		return this.getAttribute("width");
	}
	set width(val) {
		this.setAttribute("width", val);
	}
	get height() {
		return this.getAttribute("height");
	}
	set height(val) {
		this.setAttribute("height", val);
	}
	get background() {
		return this.getAttribute("background");
	}
	set background(val) {
		this.setAttribute("background", val);
	}
};

customElements.define("simple-input", SimpleInput);
