function fillPage() {
    var value = localStorage.getItem('word');
    if (value != null && value != NaN) {
        setUpWord(value);
    }
    clearVars();
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
                                <div style="margin-left:auto; margin-right:auto; position:relative"><p class=conjWord>`
                out += word + ` </p>
                                <div style="display: flex">
                                    <div class="dropdown small">
                                    <div class="dropdown-entry">He/She/It</div>
                                    </div>
                                    <div class="dropdown small">
                                        <div class=dropdown-entry>` + def + `</div>
                                        </div>
                                    </div>
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