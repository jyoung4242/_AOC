//read in textdata as 2d array
import * as mfs from "../Lib/file";

const DATASET = "./data.txt";
let list = mfs.readFileToStringList(DATASET);

//console.log("List of strings", list);

let score = 0;

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

const goodEntries: number[][] = [];

for (let entry of entries) {
  const test = rules.every(rule => ruleTest(rule[0], rule[1], entry));
  if (test) {
    goodEntries.push(entry);
  }
}

console.log("Good Entries", goodEntries);

//loop through good entries and find middle index
for (let entry of goodEntries) {
  let middleIndex = Math.floor(entry.length / 2);
  let middleValue = entry[middleIndex];
  score += middleValue;
}

console.log("Score", score);
