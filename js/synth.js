/*
var soundOn = false,
    osc1 = null,
    osc2 = null,
    gainNode = null,
    hornTable = null,
    freqControl = document.querySelector('#frequency'),
    freqDisplay = document.querySelector('#freq'),
	playButton = document.querySelector("#play_pause"),
    real = new Float32Array([0,0.4,0.4,1,1,1,0.3,0.7,0.6,0.5,0.9,0.8]),
    imag = new Float32Array(real.length);


freqControl.addEventListener('input', function() {
    osc2.frequency.setValueAtTime(this.value, ctx.currentTime);
    freqDisplay.innerHTML = this.value;
}, false);

freqDisplay.innerHTML = "110.0";

gainNode = ctx.createGain();
gainNode.connect(ctx.destination);

function soundPP() {
    if (!osc1) {
        hornTable = ctx.createPeriodicWave(real, imag);
        osc1 = ctx.createOscillator();
        osc1.setPeriodicWave(hornTable);
        osc1.frequency.value = 110;
        osc1.connect(gainNode);
        osc1.start();
        osc2 = ctx.createOscillator();
        //osc2.type = "sine";
        osc2.setPeriodicWave(hornTable);
        osc2.frequency.value = 110;
        osc2.connect(gainNode);
        osc2.start();
    }
    if (soundOn) {
        soundOn = false;
        gainNode.gain.value = 0;
		playButton.innerHTML = "Play";
    } else {
        soundOn = true;
        gainNode.gain.value = 1;
		playButton.innerHTML = "Pause";
    }
}
*/

function SynthPlayer(destId, ctx, baseFreq) {
	this.IsPlaying = false;

	this.GainNode = ctx.createGain(),
    this.GainNode.connect(ctx.destination);
    this.GainNode.gain.value = 0;

	this.SourceNode = ctx.createOscillator();
    this.SourceNode.type = "sine";
    this.SourceNode.frequency.value = 110;
	this.SourceNode.connect(this.GainNode);
	this.SourceNode.start(ctx.currentTime);

    this.Dest = document.querySelector("#"+destId);

	this.PlayButton = document.createElement("button");
    this.PlayButton.setAttribute("type", "button");
    this.PlayButton.classList.add("play_pause");
    this.PlayButton.innerText = "Play"
    this.PlayButton.addEventListener("click", () => {this.PlaySample()});
	this.Dest.appendChild(this.PlayButton);

	dlNotes = document.createElement("datalist");
    dlNotes.id = "dlNotes";
    for (i=0; i<=24; i++) {
    	let option = document.createElement("option");
	    option.value = Math.round(baseFreq*2**((i-12)/12));
	    option.label = notes[i%12];
	    dlNotes.appendChild(option);
    }

    this.FreqControl = document.createElement("input");
    this.FreqControl.classList.add("frequency_range");
    this.FreqControl.setAttribute("type", "range");
    this.FreqControl.setAttribute("min", baseFreq/2);
    this.FreqControl.setAttribute("max", baseFreq*2);
    this.FreqControl.setAttribute("value", baseFreq);
    this.FreqControl.setAttribute("step", 0.1);
    this.FreqControl.appendChild(dlNotes);
    this.FreqControl.setAttribute("list", "dlNotes");
    this.FreqControl.addEventListener("input", () => {
        this.SourceNode.frequency.value = this.FreqControl.value;
        this.FreqDisplay.innerHTML = this.FreqControl.value;
    });
	this.Dest.appendChild(this.FreqControl);

    this.FreqDisplay = document.createElement("span");
    this.FreqDisplay.innerHTML = baseFreq;
	this.Dest.appendChild(this.FreqDisplay);

    this.PlaySample = function() {
        this.IsPlaying = !this.IsPlaying;
        // check if context is in suspended state (autoplay policy)
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        if (this.IsPlaying) {
            this.GainNode.gain.value = 0.8;
            this.PlayButton.innerHTML = "Pause";
        } else {
            this.GainNode.gain.value = 0;
            this.PlayButton.innerHTML = "Play";
        }
    }
}
