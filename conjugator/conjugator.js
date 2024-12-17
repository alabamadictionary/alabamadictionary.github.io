function questionHoodSelect() {
    var questionhood = document.getElementById('questionHoodSelect').value;
    var tenseHead = document.getElementById('tense-head').innerHTML;
    var out = '';
    if (questionhood == '?') {
        if (tenseHead == 'ti') {
            document.getElementById('tense-head').innerHTML = 'cho'
            out = 'cho';
        }
        else if (tenseHead == 'kha') {
            document.getElementById('tense-head').innerHTML = 'toska'
            out = 'toska'
        }
        else if (tenseHead == 'choti') {
            document.getElementById('tense-head').innerHTML = 'chosso'
            out = 'chosso'
        }
        else if (tenseHead == 'o' || tenseHead == 'bi') {
            document.getElementById('tense-head').innerHTML = ''
            var stem = localStorage.getItem('stem');
            document.getElementById('root').innerHTML = stem;
        }
        document.getElementById('questionhood').innerHTML = '?'
    }
    else {
        if (tenseHead == 'cho') {
            document.getElementById('tense-head').innerHTML = 'ti'
            out = 'ti'
        }
        else if (tenseHead == 'toska') {
            document.getElementById('tense-head').innerHTML = 'kha'
            out = 'kha'
        }
        else if (tenseHead == 'chosso') {
            document.getElementById('tense-head').innerHTML = 'choti'
            out = 'choti'
        }
        else if (tenseHead == '') {
            var stem = localStorage.getItem('stem');
            stem[stem.length - 1] == 'o' ? document.getElementById('tense-head').innerHTML = 'bi' : document.getElementById('tense-head').innerHTML = 'o'
            out = 'o'
            if (['a', 'i'].includes(stem[stem.length - 1])){
                stem = stem.slice(0, stem.length - 1);
            } 
            else if (stem[stem.length - 1] == '>' && ['a', 'i'].includes(stem[stem.indexOf('</span>') - 1])) {
                stem = stem.slice(0, stem.indexOf('</span>') - 1) + '</span>'
            }
            document.getElementById('root').innerHTML = stem;
        }
        document.getElementById('questionhood').innerHTML = '.'
    }
    return out;
}

function fillPage() {
    var value = localStorage.getItem('word');
    if (value != null && value != NaN) {
        setUpWord(value);
    }
    else {
        document.getElementById('main-body').innerHTML = `<div style="display: flex;">
        <div style="margin-left:auto; margin-right:auto; position:relative">
            <p class="large">Select Word</p>
            <input id="searchBar" type="text" style="width: 15em" class="search-bar" autocomplete=off oninput="loadSearch()" placeholder="Search for a Verb">
            <div class="dropdown" style="display:none" id="dropdownMenu">
            </div>
        </div>
    </div>`
    }
}

function infToEnglish(definition) {
    var stem = definition.split('to ')[1];
    if (stem[0] == '(') {
        stem = stem.split(')')[1];
    }
    v = stem.split(' ')[0]
    var I;
    var H;
    var Y;
    if (v == 'be') {
        I = 'am'
        H = 'is'
        Y = 'are'
    }
    else {
        I = v;
        Y = v;
        if (v == 'have') {
            H = 'has';
        }
        else if (v[v.length - 1] == 's' || v[v.length - 1] == 'z' || v[v.length - 1] == 'o' || v[v.length - 1] == 'h' || v[v.length - 1 == 'e']) {
            H = v + 'es';
        }
        else if (v[v.length - 1] == 'y' && !v[v.length - 2].includes('u')) {
            H = v.slice(0, v.length - 1) + 'ies'
        }
        else {
            H = v + 's';
        }
    }
    var out = {'stem': v, '1sg': I, '2sg': Y, '3sg': H}
    return out;
}
function clearVars() {
    localStorage.removeItem('word');
    localStorage.removeItem('definition');
    localStorage.removeItem('stem');
}

function updateTense() {
    var tense = document.getElementById('tense-select').value;
    var stem = localStorage.getItem('stem');
    if (tense == 'o') {
        if (['a', 'i'].includes(stem[stem.length - 1])){
            stem = stem.slice(0, stem.length - 1);
        } 
        else if (stem[stem.length - 1] == '>' && ['a', 'i'].includes(stem[stem.indexOf('</span>') - 1])) {
            stem = stem.slice(0, stem.indexOf('</span>') - 1) + '</span>'
        }
        else if (stem[stem.length - 1] == 'o') {
            tense = 'bi'
        }
    }
    document.getElementById('root').innerHTML = stem;
    document.getElementById('tense-head').innerHTML = tense;
    questionHoodSelect()
}
function findDifferingIndices(str1, str2) {
    let prefixIndex = 0; // Index for matching prefix
    let suffixIndex1 = str1.length - 1; // Index for matching suffix in str1
    let suffixIndex2 = str2.length - 1; // Index for matching suffix in str2

    // Find the longest matching prefix
    while (prefixIndex < str1.length && str1[prefixIndex] === str2[prefixIndex]) {
        prefixIndex++;
    }

    // Find the longest matching suffix
    while (
        suffixIndex1 >= prefixIndex && 
        suffixIndex2 >= prefixIndex && 
        str1[suffixIndex1] === str2[suffixIndex2]
    ) {
        suffixIndex1--;
        suffixIndex2--;
    }

    return [prefixIndex, suffixIndex2];
}

function conjugateSelectedWord(word) {
    var stem = word;
    var person = document.getElementById('select').value;
    fetch ('../dict.json')
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: $(res.status)`);
            }
            return res.json();
        })
        .then((data) => {
            var obj = data.words;
            obj = obj.filter((a) => 
            removeAccents(a.lemma.toLowerCase()) == (removeAccents(stem.toLowerCase())));
            var out = stem;
            if (obj[0].principalPart != 'nan') {
                if (person == '1pl') {
                    out = obj[0].principalPart.split(',')[1].replace(' ','');
                }
                else if (person == '2sg') {
                    out = obj[0].principalPart.split(',')[0];
                }
                else if (person == '2pl') {
                    out = obj[0].principalPart.split(',')[2].replace(' ','');
                }
            }
            else {
                if (person == '1pl') {
                    out = conjugate(stem, 1, 1);
                }
                else if (person == '2sg') {
                    out = conjugate(stem, 2, 0);
                }
                else if (person == '2pl') {
                    out = conjugate(stem, 2, 1);
                }
            }
            if (person == '1sg') {
                out = word + `li`
            }
            else if (person == '3pl') {
                if (stem[0] == 'a' || stem[0] == 'o' || stem[0] == 'i') {
                    out = `oh` + word
                }
                else {
                    out = `ho` + word
                }
            }
            var lst = findDifferingIndices(word, out);
            out = (word == out) ? out : (out.slice(0, lst[0])) + `<span style="color: red">` + out.slice(lst[0], lst[1] + 1) + `</span>` + (out.slice(lst[1] + 1));
            localStorage.setItem('stem', out);
            document.getElementById('root').innerHTML = out
            updateTense()
            questionHoodSelect();
        })
        .catch((error) => console.error("Unable to fetch data:", error));
}
function setUpWord(word) {
    fetch ('../dict.json')
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
                    removeAccents(a.lemma.toLowerCase()) == (removeAccents(word.toLowerCase())));
                var def = obj.filter((a) => a.lemma == word)[0].definition;
                var persons = infToEnglish(def);
                def = persons[localStorage.getItem('person') ?? '3sg']
                var out = `<div class="ui">
                    <div class="row">
                        <div class="center aligned column">
                            <div style="display: flex;">
                                <div style="margin-left:auto; margin-right:auto; position:relative"><p id='`+ word +`' class=conjWord>`
                out += `<span id="root">` + word + `</span><span style="color: purple" id="tense-head"></span><span id="questionhood">.</span></p>
                                <div style="display: flex; position: relative">
                                    <select id="select" onchange="conjugateSelectedWord('` + word + `')" class="custom-select" style="color: red; font-weight: 400">
                                        <option value="3sg">He/She/It</option>
                                        <option value='1sg'>I</option>
                                        <option value='2sg'>You</option>
                                        <option value='1pl'>We</option>
                                        <option value='2pl'>Y'all</option>
                                        <option value='3pl'>They</option>
                                    </select>
                                    <div class="dropdown small">
                                        <div class=dropdown-entry>` + def + `</div>
                                    </div>
                                    <div style="position:relative" width="25px">
                                        <select id="tense-select" class="custom-select" style="color: purple; font-weight: 400" oninput="updateTense()">
                                            <option value='' disabled selected>&#43;</option>
                                            <option value='o'>Present</option>
                                            <option value='ti'>Past</option>
                                            <option value='la'>Future</option>
                                            <option value='lo'>Future2</option>
                                            <option value='hchi'>Continuous</option>
                                            <option value='choti'>Habitual</option>
                                            <option value='kha'>Remote Past</option>
                                        </select>
                                        <div class="hidden" style="width:15em">
                                            <div class="pop-up">
                                                Change to past tense
                                            </div>
                                        </div>
                                    </div>
                                    <select id="questionHoodSelect" oninput="questionHoodSelect()" class="custom-select">
                                        <option id="decl" value=".">.</option>
                                        <option id="interr" value="?">?</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
                document.getElementById("main-body").innerHTML = out
            })
            .catch((error) => console.error("Unable to fetch data:", error));
        }

function changeNoun(verb) {
    localStorage.setItem('word', verb);
    localStorage.setItem('stem', verb)
    fillPage();
}

function loadSearch() {
    var divs = "";
    var string = removeAccents(document.getElementById('searchBar').value.toLowerCase()).replaceAll('!', 'ɬ');
    if (string == "") {
        document.getElementById('dropdownMenu').setAttribute('style', 'display: None');
        return;
    }
    function stateMachineSort(a, b) {
        if (removeAccents(a.lemma.toLowerCase()) == string || a.definition.toLowerCase() == string || a.definition.toLowerCase().slice(0, string.length) == string + ",") { return -100000; }
        if (removeAccents(b.lemma.toLowerCase()) == string || b.definition.toLowerCase() == string || a.definition.toLowerCase().slice(0, string.length) == string + ",") { return 100000; }
        var aShareLem = initialShare(string, a)['lem'];
        var bShareLem = initialShare(string, b)['lem'];
        var aShareDef = initialShare(string, a)['def'];
        var bShareDef = initialShare(string, b)['def'];
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
            if (!a.lemma.toLowerCase().includes(string.toLowerCase()) && !b.lemma.toLowerCase().includes(string.toLowerCase())) {
                return (removeAccents(a.definition.toLowerCase()).localeCompare(removeAccents(b.definition.toLowerCase())) - aShareDef + bShareDef);
            }
            return (removeAccents(a.lemma.toLowerCase()).localeCompare(removeAccents(b.lemma.toLowerCase())) - aShareLem + bShareLem);
        }
    }
    fetch ("../dict.json")
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
                    removeAccents(a.lemma.toLowerCase()).includes(string) || a.definition.toLowerCase().includes(string));
            obj = obj.filter((a) => a.definition.length >= 3 && a.definition.slice(0,3) == 'to ')
            obj = obj.sort(stateMachineSort);
            search = obj;
            var slice = obj.slice(0, 10);
            if (slice.length == 0) {
                document.getElementById('dropdownMenu').setAttribute('style', 'display: None');
            }
            else {
                document.getElementById('dropdownMenu').setAttribute('style', 'display: Block; margin-top:5px')
            }
            for (var el in slice) {
                divs += `<div class="dropdown-item" onclick="changeNoun('`
                divs += slice[el].lemma + `')"><span class="lemma">` + slice[el].lemma + `</span>`
                divs += `<div class="definition" style="color:#666"><span>`
                divs += slice[el].definition.split(';')[0].split(',')[0] + `</span></div></div>`
                if ((el < slice.length - 1 && slice.length < 50) || (el < 49 && slice.length >= 50)) {
                    divs += `<div class="ui-divider"></div>`
                }
                
            }
            document.getElementById('dropdownMenu').innerHTML = divs;
            return 0;
         })
         .catch((error) => console.error("Unable to fetch data:", error));
}