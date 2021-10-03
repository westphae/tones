function SynthPlayer(destId, ctx, baseFreq) {
	this.IsPlaying = false;
    this.Volume = 1;

	this.GainNode = ctx.createGain();
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

    let dlNotes = document.createElement("datalist");
    dlNotes.id = "dlNotes";
    for (let i=0; i<=24; i++) {
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
        this.FreqDisplay.innerHTML = Number.parseFloat(this.FreqControl.value).toFixed(1);
    });
    this.FreqControl.addEventListener("mousedown", () => {
        if (this.IsPlaying && !this.SlideCheck.checked) {
            this.GainNode.gain.value = 0;
        }
    });
    this.FreqControl.addEventListener("mouseup", () => {
        if (this.IsPlaying && !this.SlideCheck.checked) {
            this.GainNode.gain.value = this.Volume;
        }
    });
	this.Dest.appendChild(this.FreqControl);

    this.FreqDisplay = document.createElement("span");
    this.FreqDisplay.classList.add("frequency_display");
    this.FreqDisplay.innerHTML = Number.parseFloat(baseFreq).toFixed(1);
	this.Dest.appendChild(this.FreqDisplay);

    this.SlideCheck = document.createElement("input");
    this.SlideCheck.setAttribute("type", "checkbox");
	this.Dest.appendChild(this.SlideCheck);

    this.VolumeControl = document.createElement("input");
    this.VolumeControl.classList.add("volume_range");
    this.VolumeControl.setAttribute("type", "range");
    this.VolumeControl.setAttribute("min", 0);
    this.VolumeControl.setAttribute("max", 4);
    this.VolumeControl.setAttribute("value", 1);
    this.VolumeControl.setAttribute("step", 0.1);
    this.VolumeControl.addEventListener("input", () => {
        this.Volume = this.VolumeControl.value;
        this.GainNode.gain.value = this.Volume;
    });
	this.Dest.appendChild(this.VolumeControl);

    this.PlaySample = function() {
        this.IsPlaying = !this.IsPlaying;
        // check if context is in suspended state (autoplay policy)
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        if (this.IsPlaying) {
            this.GainNode.gain.value = this.Volume;
            this.PlayButton.innerHTML = "Pause";
        } else {
            this.GainNode.gain.value = 0;
            this.PlayButton.innerHTML = "Play";
        }
    }
}
