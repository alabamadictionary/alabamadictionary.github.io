var mode = "default"; 
var search = ""; // Variable to store currently shown search results (for download function)
var limiting = false; 
var shown = 0;
var shownMax = 50;
var limitAudio = false; // Variable to store whether words are being limited by audio availability
function doLimitAudio(){
    limitAudio ^= 1;
    if (document.getElementById('searchBar').value != null && document.getElementById('searchBar').value != ''){
        dictSort();
    }
}
function pageOftheDay() {
    fetch ("dict.json")
         .then((res) => {
            if (!res.ok) {
                throw new Error 
                    (`HTTP error! Status: $(res.status)`);
            }
            return res.json();
         })
         .then((data) =>{
            var obj = data.words;
            var word = obj[Math.floor(Math.random() * obj.length)];
            var out = "entry/"
            if (word.definition[0].length >= 3 && word.definition[0].slice(0,3) == 'to '){
                        out += `verbentry`
                    } 
                    else if (word.class == "affix") {
                        out += `affix`
                    }
                    else {
                        out += `nounentry`
                    }
                    out += `.html?stem=` + word.lemma;
            window.location.href= out;
         });
}

function toggle(variable) {
    return variable ^ 1;
}

function doLimit(){
    if (limiting && document.getElementById('limitClass').value == "all") {
        document.getElementById('arg-structure').setAttribute('style', 'display: block');
    }
    else{
        document.getElementById('arg-structure').setAttribute('style', 'display: none');
    }
    if (document.getElementById('searchBar').value != null && document.getElementById('searchBar').value != ''){
        dictSort();
    }
}
var limitingArgStructure = 0;
function setArgStructure(){
    //This should be easily abstracted with the above function in the future
    if (document.getElementById('searchBar').value != null && document.getElementById('searchBar').value != ''){
        dictSort();
    }
}

function clearAndAdd(event, id) {
    clearInput(event);
    var input = document.getElementById(id).value;
    addToSearch(input);
}
function useRE() {
    if (mode == "default") {
        mode = "re";
        document.getElementById('re').setAttribute('style', 'cursor: pointer; border-radius: 10px; background: blue')
        reOpen("rePreset");
    }
    else {
        mode = "default"
        document.getElementById('re').setAttribute('style', 'cursor: pointer; border-radius: 10px; background: #fff')
        reClose("rePreset")
    }

}
function reClose(id) {
    document.getElementById(id).setAttribute('style', 'display: None')
}
function reOpen(id) {
    document.getElementById(id).setAttribute('style', 'display: block')
}
function clearInput(event) {
    event.preventDefault();
    document.getElementById('searchBar').value = "";
    document.getElementById('searchWords').innerHTML = "";
    shown = 0;
}
function addToSearch(char) {
    document.getElementById('searchBar').value = document.getElementById('searchBar').value + char;
}
function removeAccents(string) {
    string = string.replace(/à/g, 'a')
                   .replace(/á/g, 'a')
                   .replace(/ó/g, 'o')
                   .replace(/ò/g, 'o')
                   .replace(/í/g, 'i')
                   .replace(/ì/g, 'i');
    return string;
}
function hasAccents(string) {
    return string.includes('á') || string.includes('à') || string.includes('ó') || string.includes('ò') || string.includes('í') || string.includes('ì');
}
function initialShare(string, check) {
    var lem_shared = (removeAccents(check.lemma.toLowerCase()).indexOf(string.toLowerCase()))
    var def_shared = (removeAccents(check.definition[0].toLowerCase()).indexOf(string.toLowerCase()))
    return {'lem': lem_shared, 'def' : def_shared};
}
function arrayElHasFeature(arr, feature) {
    var hasFeature = false;
    for (el in arr) {
        hasFeature |= feature(arr[el]);
    }
    return hasFeature
}
function dictSort() {
    var divs = "";
    if (mode == 'default') {
        var string = removeAccents(document.getElementById('searchBar').value.toLowerCase()).replaceAll('!', 'ɬ');
    }
    else {
        var string = document.getElementById('searchBar').value;
    }
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Finds the best match for `string` within a single text, or null if none.
    function analyzeText(text, string) {
        if (text === string) {
            return { tier: 0, position: 0, semicolonDist: 0 };
        }
    
        // Tier 1: exact match as a full segment split on ; or :
        var segments = text.split(/[;:]/);
        var runningIndex = 0;
        for (var i = 0; i < segments.length; i++) {
            var seg = segments[i];
            var trimmed = seg.trim();
            if (trimmed === string) {
                var leadingSpace = seg.length - seg.trimStart().length;
                return { tier: 1, position: runningIndex + leadingSpace, semicolonDist: 0 };
            }
            runningIndex += seg.length + 1; // +1 for the delimiter we split on
        }
    
        // Tier 2: word-boundary (space-separated) match
        var wordRe = new RegExp('(^|\\s)' + escapeRegex(string) + '($|\\s|[,;:.])');
        var wordMatch = text.match(wordRe);
        if (wordMatch) {
            var position = wordMatch.index + (wordMatch[1] ? wordMatch[1].length : 0);
            var semicolonDist = distanceToDelimiter(text, position, string.length);
            return { tier: 2, position: position, semicolonDist: semicolonDist };
        }
    
        // Tier 3: plain substring match
        var idx = text.indexOf(string);
        if (idx >= 0) {
            return { tier: 3, position: idx, semicolonDist: 0 };
        }
    
        return null;
    }
    
    // Distance from the match to the nearest ; or : in the text (either direction)
    function distanceToDelimiter(text, position, length) {
        var before = text.slice(0, position).lastIndexOf(';');
        var beforeColon = text.slice(0, position).lastIndexOf(':');
        before = Math.max(before, beforeColon);
        var afterRel = text.slice(position + length).search(/[;:]/);
        var distBefore = before === -1 ? Infinity : position - before;
        var distAfter = afterRel === -1 ? Infinity : afterRel;
        return Math.min(distBefore, distAfter);
    }
    
    // Returns the best {tier, source, position, semicolonDist} match for `item`,
    // checking lemma and every definition entry. Null if string isn't found anywhere.
    function computeMatchInfo(item, string) {
        var best = null;
    
        var lemmaMatch = analyzeText(removeAccents(item.lemma.toLowerCase()), string);
        if (lemmaMatch) {
            best = Object.assign({ source: 'lemma' }, lemmaMatch);
        }
    
        item.definition.forEach(function (def) {
            var text = removeAccents(def.toLowerCase());
            var match = analyzeText(text, string);
            if (!match) return;
            var candidate = Object.assign({ source: 'definition' }, match);
            if (!best || isBetter(candidate, best)) {
                best = candidate;
            }
        });
    
        return best;
    }
    
    // True if candidate should be ranked ahead of current
    function isBetter(candidate, current) {
        if (candidate.tier !== current.tier) return candidate.tier < current.tier;
        if (candidate.source !== current.source) return candidate.source === 'lemma';
        if (candidate.position !== current.position) return candidate.position < current.position;
        return candidate.semicolonDist < current.semicolonDist;
    }
    
    function stateMachineSort(a, b) {
        var infoA = computeMatchInfo(a, string);
        var infoB = computeMatchInfo(b, string);
    
        if (!infoA && !infoB) return 0;
        if (!infoA) return 1;
        if (!infoB) return -1;
    
        if (infoA.tier !== infoB.tier) return infoA.tier - infoB.tier;
        if (infoA.source !== infoB.source) return infoA.source === 'lemma' ? -1 : 1;
        if (infoA.position !== infoB.position) return infoA.position - infoB.position;
        if (infoA.semicolonDist !== infoB.semicolonDist) return infoA.semicolonDist - infoB.semicolonDist;
    
        return removeAccents(a.lemma.toLowerCase()).localeCompare(removeAccents(b.lemma.toLowerCase()));
    }
    function reMatch(re, string) {
        re = re.replaceAll('C', '([bcdfhklɬmnpstwy]|ch)')
                .replaceAll('V', '[aeoiáóéíàòìè]')
        var regEx = new RegExp(re);
        return regEx.test(string);
    }
    fetch ("dict.json")
         .then((res) => {
            if (!res.ok) {
                throw new Error 
                    (`HTTP error! Status: $(res.status)`);
            }
            return res.json();
         })
         .then((data) =>{
            var obj = data.words;
            if (mode == "default") {
                obj = obj.filter((a) => {
                    return removeAccents(a.lemma.toLowerCase()).includes(string) || arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes(string));
                });
                }
            else {
                obj = obj.filter((a) =>
                    reMatch(string, a.lemma))
            }
            if (limiting) {
                var limitClass = document.getElementById('limitClass').value
                if (limitClass == "all"){
                    obj = obj.filter((a) => arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.length >= 3) && arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.slice(0,3) == 'to '));
                    // This can be abstracted soooooooo much.
                    if (limitingArgStructure) {
                                var argClass = document.getElementById('argStructureClass').value;
                                if (argClass ==  "CHA") {
                                    obj = obj.filter((a) => {
                                        return a.class == ("CHA-") && arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('to ')) && !arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('Var. of')) && !arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('Neg. of'));
                                    });
                                }
                                else if (argClass == "LI") {
                                    obj = obj.filter((a) => {
                                        return a.class == ("-LI") && arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('to ')) && !arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('Var. of')) && !arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('Neg. of'));
                                    });
                                }
                                else if (argClass == "AM") {
                                    obj = obj.filter((a) => {
                                        return (a.class == ('AM-') || a.class == ('3/AM-')) && arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('to ')) && !arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('Var. of')) && !arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('Neg. of'));
                                    });
                                }
                                else if (argClass == "Labile") {
                                    obj = obj.filter((a) => {
                                        return ((a.class.includes('|') || a.class.includes(';')) && !a.definition[0].includes('Var. of')&& !a.definition[0].includes('Neg. of'));
                                    });
                                }
                                else if (argClass.includes("/CHA-")) {
                                    obj = obj.filter((a) => {
                                        return ((a.class == argClass || a.class == argClass.replace('/CHA-', '/3')) && !a.definition[0].includes('Var. of')&& !a.definition[0].includes('Neg. of'));
                                    });
                                }
                                else if (argClass == "Ditransitive") {
                                    obj = obj.filter((a) => {
                                        var argnum = (a.class.match(/\//g) || []).length;
                                        return ((argnum >= 2) &&  !(argnum == 2 && a.class.includes('|')))
                                    });
                                }
                                else {
                                    obj = obj.filter((a) => {
                                        return a.class == argClass;
                                    });
                                }
                    }
                }
                else if (limitClass == "nouns") {
                    obj = obj.filter((a) => a.definition[0].length >= 3 && a.definition[0].slice(0,3) != 'to ' && !a.definition[0].includes('Negative form') && !a.lemma.includes('-'));
                }
                else if (limitClass == "root verbs") {
                    obj = obj.filter((a) => a.derivation.split('/').length - 1 <= 1 && (/^(?!.*-(?!li|ka|chi)).*/.test(a.derivation)) && a.definition[0].length >= 3 && a.definition[0].slice(0,3) == 'to ');
                }
                else if (limitClass == "root nouns") {
                    obj = obj.filter((a) => a.derivation.split('/').length - 1 <= 1 && !a.lemma.includes('&lt;') && (/^(?!.*-(?!li|ka|chi)).*/.test(a.derivation)) && a.definition[0].length >= 3 && a.definition[0].slice(0,3) != 'to ' && !a.definition[0].includes('Negative form') && !a.lemma.includes('-') & !a.definition[0].includes('Var. of') & !a.definition[0].includes('2') & !a.definition[0].includes('Var:') & !a.definition[0].includes('Neg. of') & !a.definition[0].includes('!'))    
                }
            }
            if (limitAudio) {
                obj = obj.filter((a) => {return a.hasOwnProperty("audio") && a.audio.length > 0});
            }
            search = obj.sort(stateMachineSort);
            var slice = obj.slice(shown, shown + 50);
            for (var el in slice) {
                divs += `<a `
                if (!obj[el].definition[0].includes('Negative form of')
                    && !obj[el].definition[0].includes('Var. of')
                    && obj[el].definition[0] != ('(')
                    ) {
                    divs += `href="entry/`
                    if (slice[el].definition[0].length >= 3 && slice[el].definition[0].slice(0,3) == 'to ' || slice[el].definition[0].match('(^|;|, )to [a-zA-Z]')) {
                        divs += `verbentry`
                    }
                    else if (slice[el].class == "affix") {
                        divs += `affix`
                    }
                    else {
                        divs += `nounentry`
                    }
                    divs += `.html?stem=` + slice[el].lemma + `"><div class="cell hover:bg-[#ebe0c8] transition-colors back-color">
                    <div class="left aligned center-container">
                    <div class="flex flex-row flex-1 justify-content">
                        <div class="word text-[22px] sm:text-[26px]">` + slice[el].lemma + `</div>
                    `
                }
                else {
                    divs += `><div class="cell hover:bg-[#ebe0c8] transition-colors back-color">
                    <div class="left aligned center-container">
                    <div class="flex flex-row flex-1 justify-content">
                        <div class="word text-[22px] sm:text-[26px]">` + slice[el].lemma + `</div>`
                }
                if (slice[el].hasOwnProperty("audio") && slice[el].audio.length >= 1) {
                    divs += `<button type="button" class="play-audio border-0 mx-4" data-audio-src="/audios/${slice[el].audio[0]}.wav" onclick="event.preventDefault(); event.stopPropagation(); createAudio(this.dataset.audioSrc);"><img id="audioWAV" src="../static/audio.png" class="audio w-[25px] h-[25px]"></button>`
                }
                divs += `</div>`
                if (slice[el].derivation !='nan') {
                    divs += `<em>` + slice[el].derivation + `</em>`
                }
                divs += `<div class="definition text-[18px] sm:text-[22px]">
                            <span>`
                if (slice[el].class != "nan") {
                    divs += "[" + slice[el].class + "]</br>"
                }
                if (slice[el].definition[0].includes('Var. of ')) {
                    var temp = slice[el].definition[0].split('Var. of ')[1].split(' <em>')[0];
                    slice[el].definition[0] = slice[el].definition[0].replace(temp, `<a style="text-decoration: underline; cursor: pointer" onclick="event.preventDefault(); event.stopPropagation(); newSearch('` + temp + `')">` + temp + `</a>`)
                }
                else if (slice[el].definition[0].includes('Negative form of')) {
                    var temp = slice[el].definition[0].split('Negative form of ')[1].split(';')[0];
                    slice[el].definition[0] = slice[el].definition[0].replace(temp, `<a style="text-decoration: underline; cursor: pointer" onclick="event.preventDefault(); event.stopPropagation(); newSearch('` + temp + `')">` + temp + `</a>`)
                }
                var counter = 1;
                (slice[el].definition).forEach((def) => {
                    divs += (slice[el].definition.length > 1 ? counter + `. ` : "") + (def) + `</br>`;
                    counter += 1;
                })
                divs += `</span>
                        </div>
                    </div></a>`
                if (obj[el].principalPart != "nan") {
                    var parts = ['second person singular', 'first person plural', 'second person plural']
                    for (var part in slice[el].principalPart.split(',')) {
                        divs += `<div class="principalPart">`
                        divs += `<span>` + parts[part] + `: </span>`
                        divs += `<em>` + slice[el].principalPart.split(',')[part] + `</em>`
                        divs += `</div>`
                    }
                }
                divs += `</div>`
            }
            document.getElementById('searchWords').innerHTML = divs;
            shownMax = obj.length
            document.getElementById('resultCount').innerHTML = shown + " - " + (parseInt(shown) + Math.min(50,shownMax - shown)) + " Results Shown out of " + obj.length;
            return 0;
         })
         .catch((error) => console.error("Unable to fetch data:", error));
    
}
function newSearch(lemma) {
    document.getElementById('searchBar').value = lemma;
    dictSort();
}
function updateResults(count) {
    if (shown + count < 0) {
        shown = 0;
        dictSort();
    }
    else if (shown + count > shownMax) {
        shown = shownMax;
        dictSort();
    }
    else {
        shown += count;
        dictSort();
    }
}
function strip(txt) {
    while (txt.includes('&lt;') || txt.includes('&rt;')) {
        if (txt.includes('&lt;')) {
            var index0 = txt.find('&lt;');
            var index1 = txt.find('&rt;')
            txt = txt.slice(0,index0) + txt.slice(index1+4)
        }
    }
}
function download() {
    var title = document.getElementById('searchBar').value;
    var content = search.map(function (el){ 
        return `'` + el['lemma'] + `'\t`+`'`+el['definition']+`'`
    }).join('\n');
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent("Query:" + title + "\n" + content));
    element.setAttribute('download', title + "-query.txt");

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
}

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (!x.className.includes("responsive")) {
      x.className += " responsive";
    } 
    else {
      x.className = 'flex-1 navigation';
    }
  }

  function createAudio(str) {
    var audio = new Audio(str);
    audio.volume = 1.0;
    audio.play();
}
function returnToSender() {
    window.location.href = '/?search=' + document.getElementById('entry').value;
}

// This Function takes in a source path, and returns a sorted object of that dictionary given some searchbar
function sortByDict(sourcePath, searchBarID) {
    var string = removeAccents(document.getElementById(searchBarID).value.toLowerCase()).replaceAll('!', 'ɬ');
    function stateMachineSort(a, b) {
        if (removeAccents(a.lemma.toLowerCase()) == string || a.definition[0].toLowerCase() == string || a.definition[0].toLowerCase().slice(0, string.length) == string + ",") { return -100000; }
        if (removeAccents(b.lemma.toLowerCase()) == string || b.definition[0].toLowerCase() == string || a.definition[0].toLowerCase().slice(0, string.length) == string + ",") { return 100000; }
        var aShareLem = initialShare(string, a)['lem'];
        var bShareLem = initialShare(string, b)['lem'];
        var aShareDef = initialShare(string, a)['def'][0];
        var bShareDef = initialShare(string, b)['def'][0];
        if (aShareLem == -1 && bShareLem >= 0) {
            return 1;
        }
        else if (aShareLem >= 0 && bShareLem == -1) {
            return -1;
        }
        else if (aShareLem == -1 && bShareLem == -1 && aShareDef != bShareDef) {
            if (aShareDef < bShareDef) { return -1; }
            else { return 1; }
        }
        else if (aShareLem >= 0 && bShareLem >= 0 && aShareLem != bShareLem) {
            if (aShareLem < bShareLem) {
                return -1;
            }
            else {
                return 1;
            }
        }
        else {
            if (!a.lemma.toLowerCase().includes(string.toLowerCase()) && !b.lemma.toLowerCase().includes(string.toLowerCase()) && mode == 'default') {
                console.log('sorting by def');
                return (removeAccents(a.definition[0].toLowerCase()).localeCompare(removeAccents(b.definition[0].toLowerCase())) - aShareDef + bShareDef);
            }
            return (removeAccents(a.lemma.toLowerCase()).localeCompare(removeAccents(b.lemma.toLowerCase())) - aShareLem + bShareLem);
        }
    }
    fetch (sourcePath)
         .then((res) => {
            if (!res.ok) {
                throw new Error 
                    (`HTTP error! Status: $(res.status)`);
            }
            return res.json();
         })
         .then((data) =>{
            var obj = data.words;
            obj = obj.filter((a) => 
                    removeAccents(a.lemma.toLowerCase()).includes(string) || a.definition[0].toLowerCase().includes(string));
            obj = obj.sort(stateMachineSort);
            search = obj;
            return search;
         })
         .catch((error) => console.error("Unable to fetch data:", error));
}