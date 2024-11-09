var consonants = ['b', 'c', 'd', 'f', 'h', 
                        'k', 'l', 'ɬ', 'm', 'n',
                        'p', 's', 't', 'w', 'y']
    var vowels = ['a', 'e', 'i', 'o', 'á', 'à', 'ó', 'ò', 'í', 'ì', 'é', 'è']
    function syllabify(string) {
        if (string.length <= 3) {return [string]}
        string = string.replace('ch','c');
        var sylls = [];
        var curr_syll = "";
        var len = string.length
        for (var i = 0; i < len; i++) {
            if (consonants.includes(string[i])) {
                if (curr_syll == "") {curr_syll = string[i]; }
                else if (i == len - 1) {curr_syll = curr_syll.concat(string[i]); }
                else if (vowels.includes(string[i + 1])){ sylls = sylls.concat(curr_syll); curr_syll = string[i]; }
                else if (consonants.includes(string[i + 1 ])) { curr_syll = curr_syll.concat(string[i]); sylls = sylls.concat(curr_syll); curr_syll = ""}
            }
            else if (vowels.includes(string[i])) {
                curr_syll = curr_syll.concat(string[i]);
            }
        }
        sylls = sylls.concat(curr_syll);
        return sylls.map((el) => el.replace('c','ch'));
    }
    function isCV(syll) {
        syll = syll.replace('ch','c')
        if (syll.length == 2 && consonants.includes(syll[0]) && vowels.includes(syll[1])) {
            return true;
        }
        return false
    }
    function isCVV(syll) {
        syll = syll.replace('ch','c')
        if (syll.length == 3 && consonants.includes(syll[0]) && vowels.includes(syll[1]) && vowels.includes(syll[2])) {
            return true;
        }
        if (syll.length == 2 && vowels.includes(syll[0]) && vowels.includes(syll[1])) {
            return true;
        }
        return false;
    }
    function coallesce(string) {
        var prev = 0
        for (var i = 0; i < string.length; i++) {
            if (vowels.includes(string[i]) && vowels.includes(string[prev]) && string[i] !== string[prev]) {
                string = string.slice(0,prev) + string.slice(prev + 1);
            }
            prev = i
        }
        return string
    }
    function isAlabamaFrame(string) {
        var syllables = syllabify(string).map((el) => el.replace('ch','c'));
        if (syllables.length < 2) { return false; }
        var reversed = syllables.reverse();
        if (reversed[0].length == 2 && reversed[1].length == 3) { return true; }
        else if (reversed[0].length == 2 && reversed[1].length == 2 && vowels.includes(reversed[1][0])) { return true; }
        else { return false; }
    }
    function conjugate(string, person, plurality) {
        if (person == 3) { if (plurality == 1) {return 'ho' + string} else {return string}}
        if (person == 2) {
            if (plurality == 0) { var plsuff = "" }
            else if (plurality == 1) {var plsuff = "ha" }
            var syllables = syllabify(string).reverse();
            if (syllables.length == 1 || (syllables.length == 2 && syllables[1].length == 1)) {
                    if (plurality == 0) { return "is" + syllables[0] }
                    else {return "has" + syllables[0]}
                }
            if (isAlabamaFrame(string)) {
                if (syllables[0] == "li" || syllables[0] == syllables[1][syllables[1].length - 1] + "i") {
                    return string.slice(0,string.length - 2) + plsuff + 'ci';
                }
                if (consonants.includes(syllables[0].slice(0,1)) && consonants.includes(syllables[1].slice(-1))) { syllables[1] = syllables[1].slice(0,-1) + plsuff + 'ci' + syllables[1].slice(-1)}
                else {syllables[1] = syllables[1].concat(plsuff + 's')}
                return(syllables.reverse().join(''))
            }
            else {
                if (syllables[0].length != 2) {
                    return string + plsuff + 'ci'
                }
                else {
                    syllables[0] = syllables[0].slice(0,1) + plsuff + 'ci'; 
                    return syllables.reverse().join('')
                }
            }
        }
        if (person == 1) {
            if (plurality == 0) { var plsuff = "" }
            else if (plurality == 1) {var plsuff = "hi" }
            if (plurality == 0) { return string + "li" }
            else {
                var syllables = syllabify(string).reverse();
                if (syllables.length == 1 || (syllables.length == 2 && syllables[1].length == 1)) {
                    return "il" + syllables[0]
                }
                else if (isAlabamaFrame(string)) {
                    if (syllables[0] == "li" || syllables[0] == syllables[1][syllables.length - 1] + 'i') {
                        return string.slice(0,string.length - 2) + plsuff + 'li';
                    }
                    if (consonants.includes(syllables[0].slice(0,1)) && consonants.includes(syllables[1].slice(-1))) { syllables[1] = syllables[1].slice(0,-1) + 'li' + syllables[1].slice(-1)}
                    else {syllables[1] = syllables[1].concat('l')}
                    return(syllables.reverse().join(''))
                }
                else {
                    if (syllables[0].length != 2) {
                        return string + plsuff + 'li'
                    }
                    else {syllables[0] = syllables[0].slice(0,1) + plsuff + 'li'; return syllables.reverse().join('')}
                }
            }
        }
        else {string}
    }

function dativeConjugate(string, person, plurality) {
    var m = 'm'
    if (string[0] + string[1] == 'im' || string[0] + string[1] == 'in') {
        string = string.slice(2);
    }
    if (string[0] + string[1] == 'in') {
        m = 'n'
    }
    if (person == 1 && plurality == 0) {
        return 'a' + m + string;
    }
    else if (person == 1 && plurality == 1) {
        return 'ko' + m + string;
    }
    else if (person == 2 && plurality == 0) {
        return 'ci' + m + string;
    }
    else if (person == 2 && plurality == 1) {
        return 'haci' + m + string;
    }
    else if (person == 3 && plurality == 0) {
        return 'i' + m + string;
    }
    else {return 'aati' + m + string;}
}

function patientConjugate(string, person, plurality) {
    if (person == 3) {
        return string;
    }
    if (string[0] == 'i') {
        string = string.slice(1);
    }
    if (consonants.includes(string[0])) {
        switch(person) {
            case 2:
                if (plurality == 1) {
                    return 'hachi' + string;
                }
                else {
                    return 'chi' + string;
                } 
            case 1:
                if (plurality == 0) {
                    return 'cha' + string;
                }
                else {
                    return 'po' + string;
                }
        }
    }
    else {
        if (string[0] == string[1]) {
            switch(person) {
                case 1:
                    if (plurality == 0) {
                        return 'ach' + string;
                    }
                    else {
                        return `apoo` + string.slice(2);
                    }
                case 2:
                    if (plurality == 0) {
                        return `achii` + string.slice(2);
                    }
                    else {
                        return 'ahachii' + string.slice(2);
                    }
                default:
                    return string;
            }
        }
        else {
            switch(person) {
                case 1:
                    if (plurality == 0) {
                        return 'ach' + string   ;
                    }
                    else {
                        return 'apo' + string.slice(1);
                    }
                case 2:
                    if (plurality == 0) {
                        return 'achi' + string.slice(1);
                    }
                    else {
                        return 'ahachi' + string.slice(1);
                    }
                default:
                    return string;
            }
        }
    }
}

function handleMixedMorphemes(string, person, plurality) {
    var syllablesRev = syllabify(string).reverse();
    var syllables = syllablesRev.reverse()
    deriv = "";
    fetch("dict.json") 
    .then((res) => {
    if (!res.ok) {
        throw new Error 
            (`HTTP error! Status: $(res.status)`);
    }
    return res.json();
    })
    .then((data) =>{
        var obj = data.words;
        obj = obj.filter((el) => { return (el.lemma == string)});
        var deriv = obj[0].derivation;
        if (deriv !== "") {
            const regex = new RegExp("\[[a-z, áóíìòà]+-.*\/[\(]*i[\)]*[a-z, áóíìòà]{2}\]");
            if (regex.test(deriv)) {
                return coallesce(syllables.slice(1).reverse().join('') + negateConjugate('i' + syllables[0], person, plurality));
            };
        }
        else { return ""; }
    })
    .catch((error) => console.error("Unable to fetch data:", error));
}
function negateConjugate(string, person, plurality) {
    var syllables = syllabify(string).reverse();
    if (syllables.length >= 2 && syllables[0] == 'chi' && syllables[1] == 'li') {
        var inflStem = negateConjugate(syllables.slice(1).reverse().join(''), person, plurality);
        if (inflStem.slice(-3,-1) == 'kk') {
            inflStem = inflStem.slice(0,-1)
        }
        return inflStem.slice(0,inflStem.length - 1) + 'ìicho'
    }
    else if (syllables[0] == 'chi' && isCV(syllables[1])) {
        string = string + 't';
        switch(person) {
            case 1:
                if (plurality == 0) {
                    return string += 'ákko'
                }
                else {
                    return string += 'kílko'
                }
            case 2:
                if (plurality == 0) {
                    return string += 'chíkko'
                }
                else {
                    return string += 'hachíkko'
                }
            case 3:
                return string += 'ko'
        }
    }
    // CV
    if (syllables.length === 1 || (syllables.length === 2 && syllables[1].length === 1)) {
        string = string.slice(1)
        if (person === 1 && plurality === 0) {
            return 'ák' + coallesce(string +'o');
        }
        else if (person === 2 && plurality === 0) {
            return 'chík' + coallesce(string + 'o')
        }
        else if (person === 3 && plurality === 0) {
            return 'ík' + coallesce(string + 'o')
        }
        else if (person === 1 && plurality === 1) {
            return 'kìl' + coallesce(string + 'o')
        }
        else if (person === 2 && plurality === 1) {
            return 'hachík' + coallesce(string + 'o')
        }
        else {
            return 'ohík' + coallesce(string + 'o')
        }
    }
    // CVVli CVCli CVCV
    else if ((isAlabamaFrame(string) && syllables[0] == "li") || (syllables.length >= 2 && isCV(syllables[0]) && isCV(syllables[1]))) {
        // var out = (handleMixedMorphemes((string), person, plurality));
        if (syllables[0] == 'li') {
            string = syllables.slice(1).reverse().join('')
        }
        else {
            string = string.slice(0,string.length - 1)
        }
        switch(person) {
            case 1:
                if (plurality == 0) {
                    return string + 'tákko'
                }
                else {
                    return string + 'kìlko'
                }
            case 2:
                // if (syllables[0] == 'chi') {
                //     return negateConjugate(syllables.slice(1).reverse().join(''),person, plurality) + 'cho'
                // }
                if (plurality == 0) {
                    return string + 'chíkko'
                }
                else {
                    return string + 'hachíkko'
                }
            case 3:
                var syl = syllabify(string);
                syl[syl.length - 1] = syl[syl.length - 1].replace('a','á')
                                                       .replace('o','ó')
                                                       .replace('i','í');
                string = syl.join('')
                return string + 'ko'
            default:
                return string;
        }
    }
    // kV
    else if (syllables[0][0] =='k') {
        switch (person) {
            case 1:
                if (plurality == 0) {
                    if (vowels.includes(syllables[1][syllables[1].length - 1])) {
                        return coallesce(syllables.slice(1).reverse().join('') + 'ákko')
                    }
                    else {
                        return syllables.slice(1).reverse().join('') + 'hákko'
                    }
                }
                else {
                    return syllables.slice(1).reverse().join('') + 'kìlko'
                }
            case 2:
                if (plurality == 0) {
                    return syllables.slice(1).reverse().join('') + 'chíkko'
                }
                else {
                    return syllables.slice(1).reverse().join('') + 'hachíkko'
                }
            case 3:
                if (vowels.includes(syllables[1][syllables[1].length - 1])) {
                    return coallesce(syllables.slice(1).reverse().join('') + 'íkko')
                }
                else {
                    return syllables.slice(1).reverse().join('') + 'híkko'
                }
            default:
                return string;
        }
    }
    // CVVCV and CVCCV
    else if (isAlabamaFrame(string)) {
        var infixes = ['kà', 'likì', 'chikì', 'hachikì', 'kì'];
        var syllLen = syllables[1].length - 1
            syllables[1] = syllables[1].replace('à', 'a').replace('á','a')
                                        .replace('ó', 'o').replace('ò', 'o')
                                        .replace('í', 'i').replace('ì', 'i');
        if (isCVV(syllables[1])) {
            for (var i in infixes) {
                infixes[i] = infixes[i] + infixes[i][infixes[i].length - 1];
            }
        }
        var sec2Last = syllables[1];
            switch(person) {
                case 1:
                    if (plurality == 0) {
                        syllables[1] = syllables[1].slice(0,syllLen) + infixes[0] + syllables[1][syllLen];
                    }
                    else {
                        syllables[1] = syllables[1].slice(0,syllLen) + infixes[1] + syllables[1][syllLen]
                    }
                    break;
                case 2:
                    if (plurality == 0) {
                        syllables[1] = syllables[1].slice(0,syllLen) + infixes[2] + syllables[1][syllLen]
                    }
                    else {
                        syllables[1] = syllables[1].slice(0,syllLen) + infixes[3] + syllables[1][syllLen]
                    }
                    break;
                case 3:
                    syllables[1] = syllables[1].slice(0,syllLen) + infixes[4] + syllables[1][syllLen]
            }
            if (isCVV(sec2Last)) {
                syllables[1] = syllables[1].slice(0,syllables[1].length - 1)
            }
            console.log(syllables);
            return coallesce(syllables.reverse().join('') + 'o');
    }
    else {return string;}
}

function findSiblings(string) {
    fetch("dict.json") 
    .then((res) => {
    if (!res.ok) {
        throw new Error 
            (`HTTP error! Status: $(res.status)`);
    }
    return res.json();
    })
    .then((data) =>{
        var obj = data.words;
        obj = obj.filter((el) => { return (el.lemma == string)});
        var rel = obj[0].relatedTerms;
        console.log(rel);
        var lemList = obj.filter((el) => { 
            var s1 = new Set(rel);
            var s2 = new Set(el.relatedTerms);
            var intersect = [...s1].filter((el) => s2.has(el));
            return intersect.length > 0; 
        })
        return lemList;
        
    })
    .catch((error) => console.error("Unable to fetch data:", error));
}