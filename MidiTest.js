function simHertz(hz, playseconds) {
	var audio = new Audio();
	var wave = new RIFFWAVE();
	var data = [];

	wave.header.sampleRate = 44100;

	var seconds = playseconds;
	//var seconds = 1;

	for (var i = 0; i < wave.header.sampleRate * seconds; i ++) {
	data[i] = Math.round(128 + 127 * Math.sin(i * 2 * Math.PI * hz / wave.header.sampleRate));
	}
	wave.Make(data);
	audio.src = wave.dataURI;
	return audio;
}
class MyNoteReflector extends HTMLElement{
	noteOn(noteNumber) {
		let activeNotes = this.activeNotes;
		let oscillator = this.oscillator;
		let portamento = this.portamento;
		let frequency = this.frequency;
		let envelope = this.envelope;
		let attack = this.attack;
		activeNotes.push( noteNumber );
		oscillator.frequency.cancelScheduledValues(0);
		oscillator.frequency.setTargetAtTime( this.getFrequency(noteNumber), 0, portamento );
		envelope.gain.cancelScheduledValues(0);
		envelope.gain.setTargetAtTime(1.0, 0, attack);
	}
	noteOff(noteNumber) {
		let activeNotes = this.activeNotes;
		let oscillator = this.oscillator;
		let portamento = this.portamento;
		let position = activeNotes.indexOf(noteNumber);
		let envelope = this.envelope;
		let attack = this.attack;
		let release = this.release;
		if (position!=-1) {
			activeNotes.splice(position,1);
		}
		if (activeNotes.length==0) {  // shut off the envelope
			envelope.gain.cancelScheduledValues(0);
			envelope.gain.setTargetAtTime(0.0, 0, release );
		} else {
			oscillator.frequency.cancelScheduledValues(0);
			oscillator.frequency.setTargetAtTime( this.getFrequency(activeNotes[activeNotes.length-1]), 0, portamento );
		}
	}
	getFrequency(note) {
		return 440 * Math.pow(2,(note-69)/12);
	}
	MIDILog(event, midi) {
		this.innerHTML = "Key number: "+event.data[1];
		if (event.data[2] != 0) {
			this.noteOn(event.data[1]);
		}
		else {
			this.noteOff(event.data[1]);
		}

	}
	//start logging the MIDI signals to a port
	startLoggingMIDIInput(port) {
		let me = this;
		this.midi.inputs.forEach( function(entry) {entry.onmidimessage = function(event) {me.MIDILog(event, me);}});
	}
	onMIDISuccess(midiAccess) {
		console.log("successfully connected MIDI");
		this.midi = midiAccess;
		this.startLoggingMIDIInput(0);
	}
	onMIDIFailure() {
		console.log("failed to connect to MIDI");
	}
	connectedCallback() {
		console.log("connected");
		//try to connect to the web MIDI interface
		let me = this;
		navigator.requestMIDIAccess().then(function(midiAccess) {me.onMIDISuccess(midiAccess)}, function(msg) {me.onMIDIFailure(msg)});
		//define style
		this.style.fontFamily = 'arial';
		this.style.fontSize = '150px';
	}
	constructor() {
		super();
		let context=null;   // the Web Audio "context" object
		let midiAccess=null;  // the MIDIAccess object.
		let envelope=null;    // the envelope for the single oscillator
		let attack=0.005;      // attack speed
		let release=0.0005;   // release speed
		let portamento=0.00005;  // portamento/glide speed
		let activeNotes = []; // the stack of actively-pressed k
		window.AudioContext=window.AudioContext||window.webkitAudioContext;
		context = new AudioContext();
		// set up the basic oscillator chain, muted to begin with.
		let oscillator = context.createOscillator();
		oscillator.frequency.setValueAtTime(110, 0);
		envelope = context.createGain();
		oscillator.connect(envelope);
		envelope.connect(context.destination);
		envelope.gain.value = 0.0;  // Mute the sound
		oscillator.start(0);  // Go ahead and start up the oscillator
		this.oscillator = oscillator;
		this.context = context;
		this.midiAccess = midiAccess;
		this.envelope = envelope;
		this.attack = attack;
		this.release = release;
		this.portamento = portamento;
		this.activeNotes = activeNotes;
		console.log("constructed");
	}
};

customElements.define('my-note-reflector', MyNoteReflector);

//now define the sound class

