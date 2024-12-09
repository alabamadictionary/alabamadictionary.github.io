function getTitle() {
    return new URLSearchParams(window.location.search).get('title')
}
function loadDialogue() {
    const title = getTitle();
    document.getElementById('title').innerHTML = title;
}

function checkTranslation(trans, correctArray) {
    trans = trans.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                 .toLowerCase();
    correctArray.array.forEach(element => {
        element = element.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                         .toLowerCase();
    });
    return correctArray.includes(trans);
}

function storyRun() {
    document.getElementById('start').setAttribute('style', 'display:none')
    document.getElementById('down-arrow').className = 'middle spaced hoverable';
    var input = document.getElementById('stage');
    input.value = parseInt(input.value) + 1;
    var title = getTitle();
    var mode = new URLSearchParams(window.location.search).get('mode');
    fetch ("dialogues.json")
         .then((res) => {
            if (!res.ok) {
                throw new Error 
                    (`HTTP error! Status: $(res.status)`);
            }
            return res.json();
         })
         .then((data) =>{
            var obj = data.dialogues;
            obj = obj.filter((el) => (el.title) == title)[0];
            var input = document.getElementById('max-stage');
            input.value = obj.strings.length;
            var out = ''
                for (var i = 0; i < obj.strings.length; i++) {
                    out += `<div style="display:flex">`
                    if (obj.strings[i].speaker == 0) {
                        if (i == 0) {
                            out += `<div class="speaker speaker-1" id=story`+i+`>`
                        }
                        else if (i > 0) {
                            out += `<div class="speaker speaker-1 hidden" id=story`+i+`>`
                        }
                        out += `<p class="alabama">` + obj.strings[i].alabama + `</p>
                        <img id="audioWAV" src="../static/audio.png" class="audio right-audio" style="width: 20px" onclick="createAudio('` + obj.path + obj.strings[i].wav +  `?raw=true')"></a>
                        <em class="english" id="english` + i + `">` + obj.strings[i].english + `</em>
                        <svg class="more" id="show` + i + `" onclick="show('english',` + i +`)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>                    </div>
                        </div>
                        `
                    }
                    else {
                        if (i == 0) {
                            out += `<div class="speaker speaker-2" id=story`+i+`>`
                        }
                        else if (i > 0) {
                            out += `<div class="speaker speaker-2 hidden" id=story`+i+`>`
                        }
                        out += `
                        <img id="audioWAV" src="../static/audio.png" class="audio left-audio" width="20" onclick="createAudio('` + obj.path + obj.strings[i].wav +  `?raw=true')"></img>
                        <p class="alabama">` + obj.strings[i].alabama + `</p>
                        <em class="english" id="english` + i + `">` + obj.strings[i].english + `</em>
                        <svg class="more" id="show` + i + `" onclick="show('english',` + i +`)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>                    </div>
                        </div>
                        </div>
                        `
                    }
                }
            document.getElementById('story').innerHTML += out;
         });
}

function show(className, id) {
    var el = document.getElementById(className + id);
    el.setAttribute('style', 'display: block')
    document.getElementById("show" + id).setAttribute('style', 'display: None')
}

function showNextLine() {
    var input = document.getElementById('stage');
    var max = document.getElementById('max-stage')
    document.getElementById("story" + input.value).setAttribute('style', 'display: block');
    input.value = parseInt(input.value) + 1;
    if (parseInt(input.value) >= parseInt(max.value)) {
        document.getElementById('down-arrow').className += ' hidden';
    }
}