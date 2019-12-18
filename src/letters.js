
export const vowelDist = { 'A': 15, 'E': 21, 'I': 13, 'O': 13, 'U': 5, }
export const consonantDist = {
    'B': 2, 'C': 3, 'D': 6, 'F': 2, 'G': 3, 'H': 2, 'J': 1, 'K': 1, 'L': 5, 'M': 4, 'N': 8,
    'P': 4, 'Q': 1, 'R': 9, 'S': 9, 'T': 9, 'V': 1, 'W': 1, 'X': 1, 'Y': 1, 'Z': 1
}
const cSplit = 0.7;
const vSplit = 0.6;

export function stringContainsChars(string, chars) {
    var charArray = chars.split('').sort();
    var strArray = string.split('').sort();

    var currentIndex = 0;
    for (var i = 0; i < charArray.length; i++) {
        currentIndex = strArray.indexOf(charArray[i], currentIndex) + 1;
        if (currentIndex === 0) {
            return false;
        }
    }
    return true;
}

export function strOfParticularLength(string, length) {
    if (string.length === length) {
        return string;
    } else if (string.length > length) {
        return string.slice(0, length);
    } else {
        while (string.length < length) {
            string += " ";
        }
        return string;
    }
}

export function processResults(results) {
    const max = results.max;
    let subAnagrams = [];
    for (let i = max; i > 2; i--) {
        if (results.words[i].words) {
            subAnagrams = subAnagrams.concat(results.words[i].words)
        }
    }
    return subAnagrams;
}

export function letterDistribution(distMap) {
    let letterList = '';
    for (let key in distMap) {
        for (let i = 0; i < distMap[key]; i++) {
            letterList += key
        }
    }
    return letterList
}


export function randomLetterFromList(letterList) {
    return Math.floor(Math.random() * letterList.length)
}

export function chooseLetterType(vowelCount, consonantCount, gameSize) {
    console.log('vowelCount: ' + vowelCount + '; consonantCount: ' + consonantCount);
    if (vowelsAllowed(vowelCount, gameSize) && consonantsAllowed(consonantCount, gameSize)) {
        return Math.random() < cSplit;
    } else {
        return consonantsAllowed(consonantCount, gameSize);
    }
}

function letterLimit(split, gameSize) {
    return Math.floor(split * gameSize);
}

export function vowelsAllowed(vowelCount, gameSize) {
    return lettersAllowed(vSplit, vowelCount, gameSize)
}

export function consonantsAllowed(consonantCount, gameSize) {
    return lettersAllowed(cSplit, consonantCount, gameSize)
}

function lettersAllowed(split, letterCount, gameSize) {
    return letterCount < letterLimit(split, gameSize);
}
