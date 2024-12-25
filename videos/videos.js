function getVidId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('no');
}

const urls = ['eHYd4mg04OY']
const titles = ['Making Frybread']

function setupSubtitles() {

}

function loadVideo() {
    var vidId = getVidId();
    document.getElementById('mainVideo').setAttribute('src', 'https://www.youtube.com/embed/' + urls[vidId - 1])
    document.getElementById('title').innerHTML = titles[vidId - 1]
    fetch(vidId + ".txt")
    .then((res) => res.text())
    .then((text) => {
        alabama = []
        gl = []
        morphs = []
        en = []
        while(text.indexOf('AKZ: ') > -1) {
            alabama.push(text.split('AKZ: ')[1].split('\n')[0])
            text = text.slice(text.indexOf('AKZ: ') + 5);
            if (text.indexOf('GL: ') > -1 && text.indexOf('GL: ') < text.indexOf('EN: ')) {
                gl.push((text.split('GL: ')[1].split('\n')[0]))
                text = text.slice(text.indexOf('GL: ') + 4);
            }
            if (text.indexOf('MORPH: ') < text.indexOf('MORPH: ') && text.indexOf('MORPH: ') > -1) {
                morphs.push((text.split('MORPH: ')[1].split('\n')[0]))
                text = text.slice(text.indexOf('MORPH: ') + 7);
            }
            en.push((text.split('EN: ')[1].split('\n')[0]))
            text = text.slice(text.indexOf('EN: ') + 4);
        }
        var out = alabama.map((element, index) => {
            return `<span id="wd-` + index + `" class="phrase medium-text">` + element + `</span>`
        });
        document.getElementById('text-akz').innerHTML = out.join('');
        var out = en.map((element, index) => {
            return `<span id="wd-` + index + `" class="phrase medium-text">` + element + `</span>`
        });
        document.getElementById('text-en').innerHTML = out.join('');
    })
    .catch((e) => {
        console.error(e)
    });
}