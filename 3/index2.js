"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// parse line
var list = "";
var fs = require("node:fs");
var DATASET = "./data.txt";
var content = "line,mulstring1,mulstring2, val1, val2, multipliedval \r\n";
var reg = RegExp(/^mul\(\d+,\d+\)$/);
try {
    list = fs.readFileSync(DATASET, "utf-8");
}
catch (err) {
    console.error("ERROR", err);
}
console.log("list\n", list);
var isParsingEnabled = true;
var mainParseString = "mul(";
var enableParseString = "do()";
var disableParseString = "don't()";
var indexListOfEnableStrings = [];
var indexListOfDisableStrings = [];
var indexListofMainStrings = [];
//load up indexes of enable and disable strings
var done = false;
var searchIndex = 0;
while (!done) {
    var foundIndex = list.indexOf(enableParseString, searchIndex);
    if (foundIndex > -1) {
        indexListOfEnableStrings.push(foundIndex);
        searchIndex = foundIndex + 1;
    }
    else {
        done = true;
    }
}
done = false;
searchIndex = 0;
while (!done) {
    var foundIndex = list.indexOf(disableParseString, searchIndex);
    if (foundIndex > -1) {
        indexListOfDisableStrings.push(foundIndex);
        searchIndex = foundIndex + 1;
    }
    else {
        done = true;
    }
}
console.log("indexListOfEnableStrings: ", indexListOfEnableStrings);
console.log("indexListOfDisableStrings: ", indexListOfDisableStrings);
done = false;
var loopIndex = 0;
searchIndex = 0;
while (!done) {
    //manage parsing enable/disable
    if (isParsingEnabled) {
        //look for the current loopindex in list of disable strings
        var foundIndex = indexListOfDisableStrings.find(function (index) { return index === loopIndex; });
        //if this loopindex is a disabling index, disable parsing
        foundIndex ? (isParsingEnabled = false) : (isParsingEnabled = true);
    }
    else {
        //parsing is disabled, look for next enable string
        var foundIndex = indexListOfEnableStrings.find(function (index) { return index === loopIndex; });
        //if this loopindex is an enable index, enable parsing
        foundIndex ? (isParsingEnabled = true) : (isParsingEnabled = false);
    }
    //manage parsing main strings
    if (isParsingEnabled) {
        var foundIndex = list.indexOf(mainParseString, loopIndex);
        if (foundIndex == loopIndex) {
            indexListofMainStrings.push({
                text: list.substring(foundIndex, foundIndex + mainParseString.length),
                index: foundIndex,
            });
        }
    }
    loopIndex++;
    if (loopIndex > list.length) {
        done = true;
        break;
    }
}
/*now loop through indexListofMainStrings, and get closing ), and reassign text property */
for (var i = 0; i < indexListofMainStrings.length; i++) {
    var currentIndex = indexListofMainStrings[i].index;
    //starting at currentindex, find the next ')
    var closingIndex = list.indexOf(")", currentIndex);
    //do regex test first
    if (reg.test(list.substring(currentIndex, closingIndex + 1))) {
        //pass test
        indexListofMainStrings[i].text = list.substring(currentIndex, closingIndex + 1);
        //content += `${i},${indexListofMainStrings[i].text}\n`;
    }
    else {
        //fails test
        indexListofMainStrings[i].text = "";
    }
}
var listOfMultipliedResults = [];
var lineIndex = 0;
for (var _i = 0, indexListofMainStrings_1 = indexListofMainStrings; _i < indexListofMainStrings_1.length; _i++) {
    var mainString = indexListofMainStrings_1[_i];
    console.log("mainString: ", mainString);
    if (mainString.text == "") {
        lineIndex++;
        continue;
    }
    var startofValues = 4;
    var endofValues = mainString.text.length - 1;
    var values = mainString.text.substring(startofValues, endofValues);
    var listOfValues = values.split(",");
    console.log("listOfValues: ", listOfValues);
    var listOfNumericValues = listOfValues.map(function (value) { return parseInt(value); });
    console.log("listOfNumericValues: ", listOfNumericValues);
    var multipliedValue = listOfNumericValues[0] * listOfNumericValues[1];
    console.log("multipliedValue: ", multipliedValue);
    if (!isNaN(multipliedValue)) {
        listOfMultipliedResults.push(multipliedValue);
        content += "".concat(lineIndex, ",").concat(mainString.text, ",").concat(listOfNumericValues[0], ",").concat(listOfNumericValues[1], ",").concat(multipliedValue, "\n");
    }
    lineIndex++;
}
//console.log("indexListofMainStrings: ", indexListofMainStrings);
//console.log("listOfMultipliedResults: ", listOfMultipliedResults);
//reduce listOfMultipliedResults
var rslt = listOfMultipliedResults.reduce(function (previousValue, currentValue) { return previousValue + currentValue; }, 0);
console.log("rslt: ", rslt);
writeCSVfile(content);
function writeCSVfile(content) {
    fs.writeFile("./test.csv", content, function (err) {
        if (err) {
            console.error(err);
        }
        else {
            // file written successfully
        }
    });
}
