let a2 = 110.0,
    e3 = 164.81377845643496,
	notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

async function SetUpSampleLoop(ctx, filepath) {
	const response = await fetch(filepath);
	const arrayBuffer = await response.arrayBuffer();
	const sampleBuffer = await ctx.decodeAudioData(arrayBuffer);
    return sampleBuffer
}

function SamplePlayer(destId, ctx, SampleBuffer, baseFreq) {
	this.IsPlaying = false;

	this.GainNode = ctx.createGain(),
    this.GainNode.connect(ctx.destination);
    this.GainNode.gain.value = 0;

	this.SourceNode = ctx.createBufferSource();
	this.SourceNode.buffer = SampleBuffer;
    this.SourceNode.playbackRate.value = baseFreq/e3; // sample recorded is an e3
	this.SourceNode.loop = true;
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
        this.SourceNode.playbackRate.value = this.FreqControl.value/e3;
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
            this.GainNode.gain.value = 4;
            this.PlayButton.innerHTML = "Pause";
        } else {
            this.GainNode.gain.value = 0;
            this.PlayButton.innerHTML = "Play";
        }
    }
}
