function toPast(verb) {
    const irregularVerbs = {
        "go": "went",
        "be": "was",
        "have": "had",
        "do": "did",
        "see": "saw",
        "take": "took",
        "make": "made",
        "come": "came",
        "know": "knew",
        "get": "got",
        "give": "gave",
        "find": "found",
        "think": "thought",
        "tell": "told",
        "become": "became",
        "show": "showed",
        "leave": "left",
        "feel": "felt",
        "put": "put",
        "bring": "brought",
        "begin": "began",
        "keep": "kept",
        "hold": "held",
        "write": "wrote",
        "stand": "stood",
        "hear": "heard",
        "let": "let",
        "mean": "meant",
        "set": "set",
        "meet": "met",
        "pay": "paid",
        "sit": "sat",
        "speak": "spoke",
        "run": "ran",
        "read": "read"
    };

    // Check if the verb is irregular
    if (irregularVerbs[verb]) {
        return irregularVerbs[verb];
    }

    // Regular verb conjugation rules (simplistic)
    if (verb.endsWith("e")) {
        return verb + "d";  // like "love" → "loved"
    } else if (verb.match(/[^aeiou]y$/)) {
        return verb.slice(0, -1) + "ied"; // like "carry" → "carried"
    } else {
        return verb + "ed"; // like "walk" → "walked"
    }
}

