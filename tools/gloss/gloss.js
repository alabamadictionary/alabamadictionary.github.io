async function copyOutput() {
    const text = document.getElementById('output').innerHTML;
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function handleGloss(text) {
    const result = text.replace(
        /(?<=^|[\s.\-]|[0-9])([A-Z]+)(?=$|[\s.\-]|[0-9])/g,
        (match, caps) => `\\textsc{${caps.toLowerCase()}}`
    );
    return result;
}

function splitIntoGlossBlocks(text) {
    // Split into blocks wherever there's a blank line (one or more)
    const blocks = text
        .split(/\n\s*\n/)          // split on blank lines
        .map(block => block.trim())
        .filter(block => block.length > 0); // drop empty blocks (e.g. trailing newlines)

    // Split each block into its individual lines
    return blocks.map(block => block.split("\n").map(line => line.trim()));
}

function toLatex(text, mode,transliterated=false,explicitSubExamples=false) {
    var lines = splitIntoGlossBlocks(
        text
          .replace(/[#_]/g, (match) => '\\' + match)
          .replace(/!+(?!$)/g, (match) => '\{\\textbeltl\}'.repeat(match.length))
      );    var out = ''
    for (var b = 0; b < lines.length; b++) {
        var hasContext = lines[b][0].match(/^\[.*\]$/g);
        var lineToCheck = hasContext ? 1 : 0;
        var QA = lines[b][lineToCheck].match(/^[A-Z](\:|\.)/g);
        explicitSubExamples = lines[b][lineToCheck].match(/^[a-z](\.|\:)/g);
        if (mode == "gb4e") {
            out += '\\begin{exe}\n\\ex\n';
        
            if (hasContext) {
                out += lines[b][0] + '\n';
            }
        
            if (QA) {
                out += lines[b][lineToCheck][0] + ': \\gll ' + lines[b][lineToCheck].slice(2)
            }
            else {
                out += '\\gll ' + lines[b][lineToCheck]
            }
        
            if (lines[b].length >= 2) {
                out += ' \\\\\n     ' + handleGloss(lines[b][lineToCheck + 1]);
            }
        
            out += `\\\\\n\\trans \`` + lines[b][lineToCheck + 2] + `'`
        
            if (lines[b].length > 3) {
                for (var i = lineToCheck + 3; i < lines[b].length; i++) {
                    if (lines[b][i][0] == '%') {
                        out += '\n' + lines[b][i];
                    }
                    else if (lines[b][i].match(/^\(.*\)$/g)) {
                        out += '\n% ' + lines[b][i];
                    }
                    else if (lines[b][i].match(/^[a-z](\:|\.)/g)) {
                        out += '\n\\ex. \\gll' + lines[b][i].slice(2) + '\\\\\n' + handleGloss(lines[b][i + 1]) + '\\\\\n\\glt ' + lines[b][i+2];;
                        i += 2;
                    }
                    else {
                        out += '\\\\\n' + lines[b][i]
                    }
                }
            }
        
            out += '\n\\end{exe}\n'
        }
        else if (mode=="linguex") {
            out += !explicitSubExamples && lines[b].length > 2 && lines[b].length <= 5 && (!QA) && !hasContext ? '\\exg. ' :  '\\ex. '
            if (hasContext) {
                out += lines[b][0] + '\n';
            }
            if (explicitSubExamples) {
                out += '\\' + lines[b][lineToCheck][0] + `g. ` + lines[b][lineToCheck].slice(2);
            }
            else {
                if (QA) {
                    out += lines[b][lineToCheck][0] + ': \\gll ' + lines[b][lineToCheck].slice(2)
                }
                else{
                    out += (hasContext ? '\\gll ' : '') + lines[b][lineToCheck]
                }
            }
            if (lines[b].length > 2) {
                out += ' \\\\\n     ' + handleGloss(lines[b][lineToCheck + 1]);
            }
            else if (lines[b].length == 2) {
                return out + `\\\\\n\\glt ` + lines[b][1];
            }
            out += `\\\\\n\\glt ` + lines[b][lineToCheck+2]
            if (lines[b].length >3) {
                for (var i = lineToCheck + 3; i < lines[b].length; i++) {
                    if (lines[b][i][0] == '%'){
                        out += '\n' + lines[b][i];
                    } 
                    else if (lines[b][i].match(/^\(.*\)$/g)) {
                        out += '\n% '  + lines[b][i];
                    }
                    else if (lines[b][i].match(/^[a-z](\:|\.)/g)) {
                        out += '\n\\' + lines[b][i][0] + 'g. ' + lines[b][i].slice(2) + '\\\\\n' + handleGloss(lines[b][i + 1]) + '\\\\\n\\glt ' + lines[b][i+2];;
                        i += 2;
                    }
                    else {
                        out += '\\\\\n' + lines[b][i]
                    }
                }
            }
            out += '\n'
        }
        else{
            console.log(mode);
        }
        out += `\n`
    }
    return out;
}

function convertToTeX(id, mode) {
        document.getElementById('output').innerHTML = (toLatex(document.getElementById(id).value, mode));
    return;
}



// PSEUDOCODE
// FUNCTION stringToLatexGloss(originalText, morphemeGloss, translation):
    
// # Step 1: Tokenize original text and morpheme gloss into aligned word/morpheme units
// originalWords = split(originalText, by=" ")
// glossWords = split(morphemeGloss, by=" ")

// IF length(originalWords) != length(glossWords):
//     ERROR "Original and gloss word counts don't match"

// # Step 2: Escape LaTeX special characters in each token
// FOR each word in originalWords:
//     word = escapeLatexSpecialChars(word)  # handles &, %, $, #, _, {, }, ~, ^, \
// FOR each word in glossWords:
//     word = escapeLatexSpecialChars(word)

// # Step 3: Build the aligned gloss lines
// line1 = join(originalWords, separator=" \\ ")     # object language line
// line2 = join(glossWords, separator=" \\ ")        # gloss line, morpheme-aligned

// # Step 4: Wrap in gloss environment
// latexOutput = ""
// latexOutput += "\\begin{exe}\n"
// latexOutput += "\\ex\n"
// latexOutput += "\\gll " + line1 + " \\\\\n"
// latexOutput += "     " + line2 + " \\\\\n"
// latexOutput += "\\trans `" + escapeLatexSpecialChars(translation) + "'\n"
// latexOutput += "\\end{exe}\n"

// RETURN latexOutput


// FUNCTION escapeLatexSpecialChars(text):
// replacements = {
//     "&": "\\&", "%": "\\%", "$": "\\$", "#": "\\#",
//     "_": "\\_", "{": "\\{", "}": "\\}",
//     "~": "\\textasciitilde{}", "^": "\\textasciicircum{}",
//     "\\": "\\textbackslash{}"
// }
// FOR each (char, escaped) in replacements:
//     text = replaceAll(text, char, escaped)
// RETURN text