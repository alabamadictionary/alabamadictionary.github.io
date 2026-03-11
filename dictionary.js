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
    function stateMachineSort(a, b) {
        if (removeAccents(a.lemma.toLowerCase()) == string || arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el == (string)) || arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.slice(0, string.length) == string + ",") || arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes(', '+ string + ',')) || arrayElHasFeature(a.definition.map((el) => el.toLowerCase()), (el) => el.includes('; '+ string + ','))) { return -100000; }
        if (removeAccents(b.lemma.toLowerCase()) == string || arrayElHasFeature(b.definition.map((el) => el.toLowerCase()), (el) => el == (string)) || arrayElHasFeature(b.definition.map((el) => el.toLowerCase()), (el) => el.slice(0, string.length) == string + ",") || arrayElHasFeature(b.definition.map((el) => el.toLowerCase()), (el) => el.includes(', '+ string + ',')) || arrayElHasFeature(b.definition.map((el) => el.toLowerCase()), (el) => el.includes('; '+ string + ','))) { return 100000; }
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
            if (!a.lemma.toLowerCase().includes(string.toLowerCase()) && !b.lemma.toLowerCase().includes(string.toLowerCase()) && mode=='default') {
                return (removeAccents(a.definition[0].toLowerCase()).localeCompare(removeAccents(b.definition[0].toLowerCase())) - aShareDef + bShareDef);
            }
            return (removeAccents(a.lemma.toLowerCase()).localeCompare(removeAccents(b.lemma.toLowerCase())) - aShareLem + bShareLem);
        }
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
                divs += `<div class="left aligned center-container">
                        <div class="word">
                            <a style="color:black"` 
                if (!obj[el].definition[0].includes('Negative form of') 
                    && !obj[el].definition[0].includes('Var. of')
                    && obj[el].definition[0] != ('(')
                    ) {
                    divs += `href="entry/`
                    if (slice[el].definition[0].length >= 3 && slice[el].definition[0].slice(0,3) == 'to '){
                        divs += `verbentry`
                    } 
                    else if (slice[el].class == "affix") {
                        divs += `affix`
                    }
                    else {
                        divs += `nounentry`
                    }
                    divs += `.html?stem=` + slice[el].lemma + `">` + slice[el].lemma + `</a>
                            </div>`
                }
                else {
                    divs += `>` + slice[el].lemma + `</a></div>`
                }
                if (slice[el].derivation !='nan') {
                    divs += `<em>` + slice[el].derivation + `</em>`
                }
                divs += `<div class="definition">
                            <span>`
                if (slice[el].class != "nan") {
                    divs += "[" + slice[el].class + "]</br>"
                }
                if (slice[el].definition[0].includes('Var. of ')) {
                    var temp = slice[el].definition[0].split('Var. of ')[1].split(' <em>')[0];
                    slice[el].definition[0] = slice[el].definition[0].replace(temp, `<a style="text-decoration: underline; cursor: pointer" onclick=newSearch("` + temp + `")>` + temp + `</a>`)
                }
                else if (slice[el].definition[0].includes('Negative form of')) {
                    var temp = slice[el].definition[0].split('Negative form of ')[1].split(';')[0];
                    slice[el].definition[0] = slice[el].definition[0].replace(temp, `<a style="text-decoration: underline; cursor: pointer" onclick=newSearch("` + temp + `")>` + temp + `</a>`)
                }
                var counter = 1;
                (slice[el].definition).forEach((def) => {
                    divs += (slice[el].definition.length > 1 ? counter + `. ` : "") + (def) + `</br>`;
                    counter += 1;
                })                                
                divs += `</span>
                        </div>
                    </div>`
                if (obj[el].principalPart != "nan") {
                    var parts = ['second person singular', 'first person plural', 'second person plural']
                    for (var part in slice[el].principalPart.split(',')) {
                        divs += `<div class="principalPart">`
                        divs += `<span>` + parts[part] + `: </span>`
                        divs += `<em>` + slice[el].principalPart.split(',')[part] + `</em>`
                        divs += `</div>`
                    }

                }
                if ((el < slice.length - 1 && slice.length < 50) || (el < 49 && slice.length >= 50)) {
                    divs += `<div class="ui-divider"></div>`
                }
                
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
    if (x.className === ("navigation")) {
      x.className += " responsive";
    } 
    else {
      x.className = 'navigation';
    }
  }

  function createAudio(str) {
    var audio = new Audio(str);
    audio.volume = 1.0;
    audio.play();
}
function returnToSender() {
    window.location.href = '/';
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