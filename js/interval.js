function Interval(destId, ctx, baseFreq, duration, SourceNode1, SourceNode2) {
    gainNode1 = ctx.createGain();
    gainNode1.connect(ctx.destination);
    gainNode1.gain.value = 0;

    gainNode2 = ctx.createGain();
    gainNode2.connect(ctx.destination);
    gainNode2.gain.value = 0;

    sourceNode1 = SourceNode1;
    sourceNode1.connect(gainNode1);
    sourceNode1.start(ctx.currentTime);

    sourceNode2 = SourceNode2;
    sourceNode2.connect(gainNode2);
    sourceNode2.start(ctx.currentTime);

    dest = document.querySelector("#" + destId);

    let JIDiv = document.createElement("div"),
        jiet_names = ["JI", "ET"],
        el = null,
        ll = null,
        sl = null;

    for (let i of jiet_names) {
        el = document.createElement("input");
        el.setAttribute("type", "radio")
        el.setAttribute("id", i)
        el.setAttribute("name", "jiet")
        el.setAttribute("value", i)
        el.classList.add("jiet_"+destId)
        if (i == "ET") {
            el.checked = true;
        }

        ll = document.createElement("label")
        ll.setAttribute("htmlFor", i)
        ll.innerText = i;

        sl = document.createElement("span")
        sl.classList.add("jiet")
        sl.appendChild(el)
        sl.appendChild(ll)
        JIDiv.appendChild(sl)
    }

    let AscDiv = document.createElement("div"),
        ascdesc_names = ["Desc", "Asc", "Harmonic"];

    for (let i of ascdesc_names) {
        el = document.createElement("input");
        el.setAttribute("type", "radio")
        el.setAttribute("id", i)
        el.setAttribute("name", "ascdesc")
        el.setAttribute("value", i)
        el.classList.add("ascdesc_"+destId)
        if (i == "Asc") {
            el.checked = true;
        }

        ll = document.createElement("label")
        ll.setAttribute("htmlFor", i)
        ll.innerText = i;

        sl = document.createElement("span")
        sl.classList.add("ascdesc")
        sl.appendChild(el)
        sl.appendChild(ll)
        AscDiv.appendChild(sl)
    }

    let interval_names = ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "P8"],
        interval_ratios = [25/24, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8, 2],
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
        if (i == "P5") {
            el.checked = true;
        }

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

    playButton = document.createElement("button");
    playButton.setAttribute("type", "button");
    playButton.classList.add("play_pause");
    playButton.innerText = "Play"
    playButton.addEventListener("click", () => {
        playSample()
    });

    let dispDiv = document.createElement("div"),
        p1Div = document.createElement("span"),
        p2Div = document.createElement("span");

    dispDiv.appendChild(p1Div);
    dispDiv.appendChild(p2Div);
    p1Div.classList.add("disp");
    p2Div.classList.add("disp");

    playSample = function() {
        // check if context is in suspended state (autoplay policy)
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        let i2 = 2.0,
            t2 = 1.0,
            tsel = document.querySelector(".jiet_"+destId+":checked").value,
            asel = document.querySelector(".ascdesc_"+destId+":checked").value,
            isel = interval_names.indexOf(document.querySelector(".interval_"+destId+":checked").value),
            now;
        switch (tsel) {
            case "JI":
                i2 = interval_ratios[isel];
                break;
            case "ET":
                i2 = 2**((isel+1)/12);
                break;
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
        sourceNode1.SetFreq(baseFreq);
        sourceNode2.SetFreq(i2*baseFreq);
        gainNode1.gain.value = 0.1; // Without this the sound seems to begin abruptly
        now = ctx.currentTime;
        gainNode1.gain.linearRampToValueAtTime(1, now + 0.1*duration);
        gainNode1.gain.linearRampToValueAtTime(0, now + 1.0*duration);
        setTimeout(() => {
            gainNode2.gain.value = 0.1; // Without this the sound seems to begin abruptly
            now = ctx.currentTime;
            gainNode2.gain.linearRampToValueAtTime(1, now + 0.1*duration);
            gainNode2.gain.linearRampToValueAtTime(0, now + 1.0*duration);
        }, t2*1000*duration)
    }

    compareButton = document.createElement("button");
    compareButton.setAttribute("type", "button");
    compareButton.classList.add("compare");
    compareButton.innerText = "Compare"
    compareButton.addEventListener("click", () => {
        compareSample()
    });

    compareSample = function() {
        // check if context is in suspended state (autoplay policy)
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        sourceNode1.SetFreq(baseFreq);
        sourceNode2.SetFreq(baseFreq);
        let isel = interval_names.indexOf(document.querySelector(".interval_"+destId+":checked").value),
            i1 = interval_ratios[isel],
            i2 = 2**((isel+1)/12),
            now;
        p1Div.innerText = (i1*baseFreq).toFixed(1).toString() + "Hz";
        p2Div.innerText = (i2*baseFreq).toFixed(1).toString() + "Hz";

        sourceNode1.SetFreq(i1*baseFreq);
        gainNode1.gain.value = 0.1;
        now = ctx.currentTime;
        gainNode1.gain.linearRampToValueAtTime(1, now + 0.100*duration);
        gainNode1.gain.linearRampToValueAtTime(0, now + 1.000*duration);
        setTimeout(() => {
            gainNode2.gain.value = 0.0;
            sourceNode2.SetFreq(i2*baseFreq);
            now = ctx.currentTime;
            gainNode2.gain.linearRampToValueAtTime(1, now + 0.100*duration);
            gainNode2.gain.linearRampToValueAtTime(0, now + 1.000*duration);
        }, 1000*duration)
    }

    /* layout */
    let div1 = document.createElement("div"),
        div2 = document.createElement("div"),
        div3 = document.createElement("div"),
        div4 = document.createElement("div"),
        div5 = document.createElement("div"),
        div6 = document.createElement("div");
    dest.appendChild(div1);
    dest.appendChild(div2);
    dest.appendChild(div3);
    dest.appendChild(div4);
    dest.appendChild(div5);
    dest.appendChild(div6);
    div1.appendChild(JIDiv)
    div1.appendChild(AscDiv)
    div2.appendChild(major_intervals)
    div3.appendChild(perfect_intervals)
    div4.appendChild(minor_intervals)
    div5.appendChild(playButton);
    div6.appendChild(dispDiv);
    div5.appendChild(compareButton);
}
