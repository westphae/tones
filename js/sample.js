let a2 = 110.0,
	notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
	sampleIsPlaying = false,
	sampleBuffer = null,
	sampleSource1 = null,
	sampleSource2 = null,
	sampleGainNode = ctx.createGain(),
    freqControlSamp = document.querySelector('#frequencySamp'),
    freqDisplaySamp = document.querySelector('#freqSamp'),
	playButtonSamp = document.querySelector("#play_pause_samp"),
	dlNotes = document.createElement("datalist");

dlNotes.id = "dlNotes";
for (i=0; i<=24; i++) {
	let option = document.createElement("option");
	option.value = Math.round(a2*2**((i-12)/12));
	option.label = notes[i%12];
	dlNotes.appendChild(option);
}
freqControlSamp.appendChild(dlNotes);
// document.querySelector("body").appendChild(dlNotes);
freqControlSamp.setAttribute("list", "dlNotes");

sampleGainNode.connect(ctx.destination);
sampleGainNode.gain.value = 0;

freqControlSamp.addEventListener('input', function() {
    sampleSource2.playbackRate.value = this.value / a2;
    freqDisplaySamp.innerHTML = this.value;
}, false);

freqDisplaySamp.innerHTML = a2;

async function setUpSampleLoop(filepath) {
	const response = await fetch(filepath);
	const arrayBuffer = await response.arrayBuffer();
	sampleBuffer = await ctx.decodeAudioData(arrayBuffer);
	sampleSource1 = ctx.createBufferSource();
	sampleSource1.buffer = sampleBuffer;
	sampleSource1.loop = true;
	sampleSource1.connect(sampleGainNode);
	sampleSource1.start(ctx.currentTime);
	sampleSource2 = ctx.createBufferSource();
	sampleSource2.buffer = sampleBuffer;
	sampleSource2.loop = true;
	sampleSource2.connect(sampleGainNode);
	sampleSource2.start(ctx.currentTime);
}

function playSamp() {
	sampleIsPlaying = !sampleIsPlaying;
	// check if context is in suspended state (autoplay policy)
	if (ctx.state === 'suspended') {
		ctx.resume();
	}

	if (sampleIsPlaying) {
		sampleGainNode.gain.value = 2;
		playButtonSamp.innerHTML = "Pause";
	} else {
		sampleGainNode.gain.value = 0;
		playButtonSamp.innerHTML = "Play";
	}
}

setUpSampleLoop("res/slide_whistle.wav");
