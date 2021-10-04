function Interval(destId, ctx, baseFreq, duration, SourceNode1, SourceNode2) {
    this.GainNode1 = ctx.createGain();
    this.GainNode1.connect(ctx.destination);
    this.GainNode1.gain.value = 0;

    this.GainNode2 = ctx.createGain();
    this.GainNode2.connect(ctx.destination);
    this.GainNode2.gain.value = 0;

    this.SourceNode1 = SourceNode1;
    this.SourceNode1.connect(this.GainNode1);
    this.SourceNode1.start(ctx.currentTime);

    this.SourceNode2 = SourceNode2;
    this.SourceNode2.connect(this.GainNode2);
    this.SourceNode2.start(ctx.currentTime);

    this.Dest = document.querySelector("#" + destId);

    let JIDiv = document.createElement("div"),
        JILabel = document.createElement("label"),
        JISlider = document.createElement("label"),
        JISpan = document.createElement("span");
    this.JICheckbox = document.createElement("input");
    JIDiv.appendChild(JILabel)
    JIDiv.appendChild(JISlider)
    JISlider.appendChild(this.JICheckbox)
    JISlider.appendChild(JISpan)
    JILabel.setAttribute("for", "jislider")
    JILabel.innerText = "ET JI";
    JISlider.setAttribute("id", "jislider")
    JISlider.classList.add("switch");
    this.JICheckbox.setAttribute("type", "checkbox");
    this.JICheckbox.checked = false;
    JISpan.classList.add("slider");

    let AscDiv = document.createElement("div"),
        ascdesc_names = ["Desc", "Asc", "Harmonic"],
        el = null,
        ll = null,
        sl = null;

    for (let i of ascdesc_names) {
        el = document.createElement("input");
        el.setAttribute("type", "radio")
        el.setAttribute("id", i)
        el.setAttribute("name", "ascdesc")
        el.setAttribute("value", i)
        el.classList.add("ascdesc_"+destId)

        ll = document.createElement("label")
        ll.setAttribute("htmlFor", i)
        ll.innerText = i;

        sl = document.createElement("span")
        sl.classList.add("ascdesc")
        sl.appendChild(el)
        sl.appendChild(ll)
        AscDiv.appendChild(sl)
    }
    el.checked = true;

    let interval_names = ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "P8"],
        major_intervals = document.createElement("div"),
        minor_intervals = document.createElement("div"),
        perfect_intervals = document.createElement("div");

    for (let i of interval_names) {
        el = document.createElement("input");
        el.setAttribute("type", "radio")
        el.setAttribute("id", i)
        el.setAttribute("name", "interval")
        el.setAttribute("value", i)
        el.classList.add("interval_"+destId)

        ll = document.createElement("label")
        ll.setAttribute("htmlFor", i)
        ll.innerText = i;

        sl = document.createElement("span")
        sl.classList.add("interval")
        sl.appendChild(el)
        sl.appendChild(ll)
        switch (i.substring(0, 1)) {
            case "M":
                major_intervals.appendChild(sl)
                break;
            case "m":
                minor_intervals.appendChild(sl)
                break;
            default:
                perfect_intervals.appendChild(sl)
                break;
        }
    }
    el.checked = true;

    this.PlayButton = document.createElement("button");
    this.PlayButton.setAttribute("type", "button");
    this.PlayButton.classList.add("play_pause");
    this.PlayButton.innerText = "Play"
    this.PlayButton.addEventListener("click", () => {
        this.PlaySample()
    });

    let dispDiv = document.createElement("div"),
        p1Div = document.createElement("span"),
        p2Div = document.createElement("span");

    dispDiv.appendChild(p1Div);
    dispDiv.appendChild(p2Div);
    p1Div.classList.add("disp");
    p2Div.classList.add("disp");

    this.PlaySample = function() {
        // check if context is in suspended state (autoplay policy)
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        let i2 = 2.0,
            t2 = 1.0,
            isel = interval_names.indexOf(document.querySelector(".interval_"+destId+":checked").value),
            asel = document.querySelector(".ascdesc_"+destId+":checked").value,
            now;
        if (this.JICheckbox.checked) {
            for (let n=0; n%12!=(isel+1)%12; n+=7) {
                i2 *= 1.5;
                if (i2>2) {
                    i2 /= 2;
                }
            }
        } else {
            i2 = 2**((isel+1)/12);
        }
        switch (asel) {
            case "Asc":
                t2 = 1.0;
                break;
            case "Desc":
                i2 = 1/i2;
                t2 = 1.0;
                break;
            case "Harmonic":
                t2 = 0.0;
                break;
        }
        p1Div.innerText = baseFreq.toFixed(1).toString() + "Hz";
        p2Div.innerText = (i2*baseFreq).toFixed(1).toString() + "Hz";
        this.SourceNode1.SetFreq(baseFreq);
        this.SourceNode2.SetFreq(i2*baseFreq);
        this.GainNode1.gain.value = 0.1; // Without this the sound seems to begin abruptly
        now = ctx.currentTime;
        this.GainNode1.gain.linearRampToValueAtTime(1, now + 0.1*duration);
        this.GainNode1.gain.linearRampToValueAtTime(0, now + 1.0*duration);
        setTimeout(() => {
            this.GainNode2.gain.value = 0.1; // Without this the sound seems to begin abruptly
            now = ctx.currentTime;
            this.GainNode2.gain.linearRampToValueAtTime(1, now + 0.1*duration);
            this.GainNode2.gain.linearRampToValueAtTime(0, now + 1.0*duration);
        }, t2*1000*duration)
    }

    this.CompareButton = document.createElement("button");
    this.CompareButton.setAttribute("type", "button");
    this.CompareButton.classList.add("compare");
    this.CompareButton.innerText = "Compare"
    this.CompareButton.addEventListener("click", () => {
        this.CompareSample()
    });

    this.CompareSample = function() {
        // check if context is in suspended state (autoplay policy)
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        this.SourceNode1.SetFreq(baseFreq);
        this.SourceNode2.SetFreq(baseFreq);
        let isel = interval_names.indexOf(document.querySelector(".interval_"+destId+":checked").value),
            i1 = 2.0,
            i2 = 2**((isel+1)/12),
            now;
        for (let n=0; n%12!=(isel+1)%12; n+=7) {
            i1 *= 1.5;
            if (i1>2) {
                i1 /= 2;
            }
        }
        p1Div.innerText = (i1*baseFreq).toFixed(1).toString() + "Hz";
        p2Div.innerText = (i2*baseFreq).toFixed(1).toString() + "Hz";

        this.SourceNode1.SetFreq(i1*baseFreq);
        this.GainNode1.gain.value = 0.1;
        now = ctx.currentTime;
        this.GainNode1.gain.linearRampToValueAtTime(1, now + 0.100*duration);
        this.GainNode1.gain.linearRampToValueAtTime(0, now + 1.000*duration);
        setTimeout(() => {
            this.GainNode2.gain.value = 0.0;
            this.SourceNode2.SetFreq(i2*baseFreq);
            now = ctx.currentTime;
            this.GainNode2.gain.linearRampToValueAtTime(1, now + 0.100*duration);
            this.GainNode2.gain.linearRampToValueAtTime(0, now + 1.000*duration);
        }, 1000*duration)
    }

    /* layout */
    let div1 = document.createElement("div"),
        div2 = document.createElement("div"),
        div3 = document.createElement("div"),
        div4 = document.createElement("div"),
        div5 = document.createElement("div"),
        div6 = document.createElement("div");
    this.Dest.appendChild(div1);
    this.Dest.appendChild(div2);
    this.Dest.appendChild(div3);
    this.Dest.appendChild(div4);
    this.Dest.appendChild(div5);
    this.Dest.appendChild(div6);
    div1.appendChild(JIDiv)
    div1.appendChild(AscDiv)
    div2.appendChild(major_intervals)
    div3.appendChild(perfect_intervals)
    div4.appendChild(minor_intervals)
    div5.appendChild(this.PlayButton);
    div6.appendChild(dispDiv);
    div5.appendChild(this.CompareButton);
}
