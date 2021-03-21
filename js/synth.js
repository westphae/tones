var soundOn = false,
    ctx = null,
    osc1 = null,
    osc2 = null,
    gainNode = null,
    hornTable = null,
    freqControl = document.querySelector('#frequency'),
    freqDisplay = document.querySelector('#freq'),
	playButton = document.querySelector("#play_pause"),
    real = new Float32Array([0,0.4,0.4,1,1,1,0.3,0.7,0.6,0.5,0.9,0.8]),
    imag = new Float32Array(real.length);

window.AudioContext = window.AudioContext || window.webkitAudioContext;

freqControl.addEventListener('input', function() {
    osc2.frequency.setValueAtTime(this.value, ctx.currentTime);
    freqDisplay.innerHTML = this.value;
}, false);

freqDisplay.innerHTML = "110.0";

ctx = new AudioContext();
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
