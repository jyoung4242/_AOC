"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// parse line
var list = [];
var fs = require("node:fs");
var DATASET = "./data.txt";
try {
    var data = fs.readFileSync(DATASET, "utf-8");
    // Process the data here
    var lines = data.split("\r\n");
    // Do something with each line
    lines.forEach(function (line) {
        list.push(line);
    });
}
catch (err) {
    console.error("ERROR", err);
}
//list of strings filled with text
//one long one in line[0]
var parseString = "mul(";
var arrayOfFoundIndexes = [];
//parse for each key phrase
for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
    var parsingString = list_1[_i];
    var done = false;
    var searchIndex = 0;
    var tempListOfIndexes = [];
    while (!done) {
        var foundIndex = parsingString.indexOf(parseString, searchIndex);
        if (foundIndex == -1) {
            done = true;
        }
        else {
            tempListOfIndexes.push(foundIndex);
            searchIndex = foundIndex + 1;
        }
    }
    arrayOfFoundIndexes.push(tempListOfIndexes);
}
console.log("arrayOfFoundIndexes: ", arrayOfFoundIndexes);
// for each array of indexes, we search the string for the closing ')'
// and return the string between the two indexes, unless we hit the next
// index
//search between indexes for ')'
var sanitizedSubstrings = [];
for (var j = 0; j < list.length; j++) {
    var parsingString = list[j];
    console.log("parsingString: ", parsingString, j);
    for (var i = 0; i < arrayOfFoundIndexes.length; i++) {
        var currentIndexes = arrayOfFoundIndexes[i];
        console.log("currentIndexes: ", currentIndexes);
        var listOfSanitizedSubstrings = [];
        for (var k = 0; k < currentIndexes.length; k++) {
            var currentIndex = currentIndexes[k];
            var nextIndex = currentIndexes[k + 1];
            if (!nextIndex)
                nextIndex = parsingString.length;
            console.log("currentIndex: ", currentIndex, " nextIndex: ", nextIndex);
            var substring = parsingString.substring(currentIndex, nextIndex);
            console.log("substring: ", substring);
            //search substring for ')'
            var closingIndex = substring.indexOf(")");
            var sanitizedSubstring = substring.substring(0, closingIndex + 1);
            listOfSanitizedSubstrings.push(sanitizedSubstring);
        }
        sanitizedSubstrings.push(listOfSanitizedSubstrings);
    }
    console.log("sanitizedSubstring: ", sanitizedSubstrings);
}
var listOfMultipliedResults = [];
sanitizedSubstrings.forEach(function (listOfSubstring, index) {
    var arrayOfMultipliedResults = [];
    console.log("listOfSubstring: ", listOfSubstring);
    listOfSubstring.forEach(function (substring) {
        console.log("substring: ", substring);
        var startofValues = 4;
        var endofValues = substring.length - 1;
        var values = substring.substring(startofValues, endofValues);
        var listOfValues = values.split(",");
        console.log("listOfValues: ", listOfValues);
        var listOfNumericValues = listOfValues.map(function (value) { return parseInt(value); });
        console.log("listOfNumericValues: ", listOfNumericValues);
        var multipliedValue = listOfNumericValues[0] * listOfNumericValues[1];
        console.log("multipliedValue: ", multipliedValue);
        if (!isNaN(multipliedValue)) {
            arrayOfMultipliedResults.push(multipliedValue);
        }
    });
    console.log("arrayOfMultipliedResults: ", arrayOfMultipliedResults);
    var rslt = arrayOfMultipliedResults.reduce(function (previousValue, currentValue) { return previousValue + currentValue; }, 0);
    listOfMultipliedResults.push([rslt]);
});
console.log("listOfMultipliedResults: ", listOfMultipliedResults);
