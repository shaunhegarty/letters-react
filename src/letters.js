import axios from 'axios';

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
        // #  in Object.keys(results.words).sort().reverse()) {
        if(results.words[i].words) {
            subAnagrams = subAnagrams.concat(results.words[i].words)
        }
    }
    return subAnagrams;
}