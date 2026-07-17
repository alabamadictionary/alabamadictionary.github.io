function handleGloss(text) {
    const result = text.replace(
        /(^|[\s.\-])([A-Z]+)($|[\s.\-])/g,
        (match, sep, caps) => sep + `{\\sc ${caps.toLowerCase()}}`
      );
    return result
}

function toLatex(text = "You must enter text. Please try again", mode = "linguex",transliterated=false,explicitSubExamples=false,QA=false) {
    var lines = text.split("\n");
    var out = ''
    if (mode=="gb4e") {

    }
    else if (mode=="linguex") {
        out += explicitSubExamples == false && lines.length <= 4 ? '\\exg. ' :  '\\ex.'
        if (!QA) {
            out += lines[0]
            for (var i = 0; i < lines.length; i++) {
                handleGloss(lines[i]);
            }  
        } 
    }
}

function convertToTeX() {
    console.log(toLatex(mode = 'linguex', document.getElementById('Gloss').value));
    return;
}