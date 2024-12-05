//read in textdata as 2d array
import * as mfs from "../Lib/file";
import * as fc from "../Lib/control";

const DATASET = "./testdata.txt";
let list = mfs.readFileToStringList(DATASET);

//fc.test();
//console.log("List of strings", list);

let score = 0;
//csv.setupCSVFile("./test.csv", ["Line#", "entry"]);

//break the group into two data sets...
//first one is before the '' in the data
//second one is after the '' in the data

let STRrules: string[] = [];
let entries: number[][] = [];
let STRentries: string[] = [];
let rules: number[][] = [];
let parseFlag: boolean = false;

let lineIndex = 0;
for (let line of list) {
  if (line === "") {
    parseFlag = true;
    continue;
  }

  if (parseFlag) STRentries.push(line);
  else STRrules.push(line);

  lineIndex++;
}

//console.log("Rules", STRrules);
//console.log("Entries", STRentries);

//format rules
let ruleIndex = 0;
for (let rule of STRrules) {
  rules.push([]);
  let splitRule = rule.split("|");
  splitRule.forEach(rule => rules[ruleIndex].push(parseInt(rule)));
  ruleIndex++;
}
//console.log("Sanitized Rules", rules);

//format entries
let entryIndex = 0;
for (let entry of STRentries) {
  entries.push([]);
  let splitEntry = entry.split(",");
  splitEntry.forEach(entry => entries[entryIndex].push(parseInt(entry)));
  entryIndex++;
}
//console.log("Sanitized Entries", entries);

function ruleTest(startNumber: number, endNumber: number, entry: number[]): boolean {
  let foundStartNumberIndex = -1;
  let foundEndNumberIndex = -1;
  //console.log("in ruletest", startNumber, endNumber, entry);

  foundStartNumberIndex = entry.findIndex(val => val === startNumber);
  foundEndNumberIndex = entry.findIndex(val => val === endNumber);
  if (foundEndNumberIndex === -1) return true;

  //console.log("found indexes", foundStartNumberIndex, foundEndNumberIndex);

  return foundEndNumberIndex > foundStartNumberIndex;
}

function fixEntry(startNumber: number, endNumber: number, entry: number[]): number[] {
  let foundStartNumberIndex = -1;
  let foundEndNumberIndex = -1;
  console.log("------------------");
  console.log("Fix Entry", startNumber, endNumber, entry);

  foundStartNumberIndex = entry.findIndex(val => val === startNumber);
  foundEndNumberIndex = entry.findIndex(val => val === endNumber);

  console.log("Found Indexes", foundStartNumberIndex, foundEndNumberIndex);

  if (foundEndNumberIndex < foundStartNumberIndex) {
    //move start number to after end number index
    let removedStartNumber = entry.splice(foundStartNumberIndex, 1);
    console.log("Removed Start Number", removedStartNumber);
    entry.splice(foundEndNumberIndex, 0, removedStartNumber[0]);
    console.log("Entry", entry);
  }
  return entry;
}

const badEntries: number[][] = [];

for (let entry of entries) {
  const test = rules.every(rule => ruleTest(rule[0], rule[1], entry));
  if (!test) {
    badEntries.push(entry);
  }
}

console.log("Bad Entries", badEntries);

//loop through bad entries and fix them
entryIndex = 0;
for (let entry of badEntries) {
  console.log("*****************");
  console.log("Bad Entry", entry);

  /* csv.resetCSVLine();
  csv.appendToCSVLine(entryIndex);
  csv.appendToCSVLine(entry.toString()); */

  //run through each test and on the test that fails, fix the entry
  //run through rules backwards
  for (let i = rules.length - 1; i >= 0; i--) {
    let rule = rules[i];
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

for (let entry of badEntries) {
  let middleIndex = Math.floor(entry.length / 2);
  let middleValue = entry[middleIndex];
  score += middleValue;
}
//csv.writeCSVfile();
console.log("Score", score);
