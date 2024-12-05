"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//read in textdata as 2d array
var mfs = require("../Lib/file");
var fc = require("../Lib/control");
var DATASET = "./testdata.txt";
var list = mfs.readFileToStringList(DATASET);
//fc.test();
//console.log("List of strings", list);
var score = 0;
//csv.setupCSVFile("./test.csv", ["Line#", "entry"]);
//break the group into two data sets...
//first one is before the '' in the data
//second one is after the '' in the data
var STRrules = [];
var entries = [];
var STRentries = [];
var rules = [];
var parseFlag = false;
var lineIndex = 0;
for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
    var line = list_1[_i];
    if (line === "") {
        parseFlag = true;
        continue;
    }
    if (parseFlag)
        STRentries.push(line);
    else
        STRrules.push(line);
    lineIndex++;
}
//console.log("Rules", STRrules);
//console.log("Entries", STRentries);
//format rules
var ruleIndex = 0;
for (var _a = 0, STRrules_1 = STRrules; _a < STRrules_1.length; _a++) {
    var rule = STRrules_1[_a];
    rules.push([]);
    var splitRule = rule.split("|");
    splitRule.forEach(function (rule) { return rules[ruleIndex].push(parseInt(rule)); });
    ruleIndex++;
}
//console.log("Sanitized Rules", rules);
//format entries
var entryIndex = 0;
for (var _b = 0, STRentries_1 = STRentries; _b < STRentries_1.length; _b++) {
    var entry = STRentries_1[_b];
    entries.push([]);
    var splitEntry = entry.split(",");
    splitEntry.forEach(function (entry) { return entries[entryIndex].push(parseInt(entry)); });
    entryIndex++;
}
//console.log("Sanitized Entries", entries);
function ruleTest(startNumber, endNumber, entry) {
    var foundStartNumberIndex = -1;
    var foundEndNumberIndex = -1;
    //console.log("in ruletest", startNumber, endNumber, entry);
    foundStartNumberIndex = entry.findIndex(function (val) { return val === startNumber; });
    foundEndNumberIndex = entry.findIndex(function (val) { return val === endNumber; });
    if (foundEndNumberIndex === -1)
        return true;
    //console.log("found indexes", foundStartNumberIndex, foundEndNumberIndex);
    return foundEndNumberIndex > foundStartNumberIndex;
}
function fixEntry(startNumber, endNumber, entry) {
    var foundStartNumberIndex = -1;
    var foundEndNumberIndex = -1;
    console.log("------------------");
    console.log("Fix Entry", startNumber, endNumber, entry);
    foundStartNumberIndex = entry.findIndex(function (val) { return val === startNumber; });
    foundEndNumberIndex = entry.findIndex(function (val) { return val === endNumber; });
    console.log("Found Indexes", foundStartNumberIndex, foundEndNumberIndex);
    if (foundEndNumberIndex < foundStartNumberIndex) {
        //move start number to after end number index
        var removedStartNumber = entry.splice(foundStartNumberIndex, 1);
        console.log("Removed Start Number", removedStartNumber);
        entry.splice(foundEndNumberIndex, 0, removedStartNumber[0]);
        console.log("Entry", entry);
    }
    return entry;
}
var badEntries = [];
var _loop_1 = function (entry) {
    var test = rules.every(function (rule) { return ruleTest(rule[0], rule[1], entry); });
    if (!test) {
        badEntries.push(entry);
    }
};
for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
    var entry = entries_1[_c];
    _loop_1(entry);
}
console.log("Bad Entries", badEntries);
//loop through bad entries and fix them
entryIndex = 0;
for (var _d = 0, badEntries_1 = badEntries; _d < badEntries_1.length; _d++) {
    var entry = badEntries_1[_d];
    console.log("*****************");
    console.log("Bad Entry", entry);
    /* csv.resetCSVLine();
    csv.appendToCSVLine(entryIndex);
    csv.appendToCSVLine(entry.toString()); */
    //run through each test and on the test that fails, fix the entry
    //run through rules backwards
    for (var i = rules.length - 1; i >= 0; i--) {
        var rule = rules[i];
        if (!ruleTest(rule[0], rule[1], entry)) {
            //csv.appendToCSVLine("rule");
            //csv.appendToCSVLine(rule.toString());
            badEntries[entryIndex] = fixEntry(rule[0], rule[1], entry);
            //csv.appendToCSVLine("new badentry");
            //csv.appendToCSVLine(badEntries[entryIndex].toString());
            await fc.waitForKeypress();
        }
    }
    //csv.appendToCSVLine("\n");
    ////csv.appendCSVLineToCSVContent();
    entryIndex++;
}
console.log("Bad Entries", badEntries);
for (var _e = 0, badEntries_2 = badEntries; _e < badEntries_2.length; _e++) {
    var entry = badEntries_2[_e];
    var middleIndex = Math.floor(entry.length / 2);
    var middleValue = entry[middleIndex];
    score += middleValue;
}
//csv.writeCSVfile();
console.log("Score", score);
