// parse line
let list: string = "";
import * as fs from "node:fs";

const DATASET = "./data.txt";
let content = "line,mulstring1,mulstring2, val1, val2, multipliedval \r\n";
const reg = RegExp(/^mul\(\d+,\d+\)$/);

try {
  list = fs.readFileSync(DATASET, "utf-8");
} catch (err) {
  console.error("ERROR", err);
}

console.log("list\n", list);

let isParsingEnabled = true;
const mainParseString = "mul(";
const enableParseString = "do()";
const disableParseString = `don\'t()`;

let indexListOfEnableStrings: number[] = [];
let indexListOfDisableStrings: number[] = [];
let indexListofMainStrings: Array<{ text: string; index: number }> = [];

//load up indexes of enable and disable strings

let done = false;
let searchIndex = 0;
while (!done) {
  let foundIndex = list.indexOf(enableParseString, searchIndex);
  if (foundIndex > -1) {
    indexListOfEnableStrings.push(foundIndex);
    searchIndex = foundIndex + 1;
  } else {
    done = true;
  }
}

done = false;
searchIndex = 0;
while (!done) {
  let foundIndex = list.indexOf(disableParseString, searchIndex);
  if (foundIndex > -1) {
    indexListOfDisableStrings.push(foundIndex);
    searchIndex = foundIndex + 1;
  } else {
    done = true;
  }
}

console.log("indexListOfEnableStrings: ", indexListOfEnableStrings);
console.log("indexListOfDisableStrings: ", indexListOfDisableStrings);

done = false;
let loopIndex = 0;
searchIndex = 0;

while (!done) {
  //manage parsing enable/disable
  if (isParsingEnabled) {
    //look for the current loopindex in list of disable strings
    let foundIndex = indexListOfDisableStrings.find(index => index === loopIndex);
    //if this loopindex is a disabling index, disable parsing
    foundIndex ? (isParsingEnabled = false) : (isParsingEnabled = true);
  } else {
    //parsing is disabled, look for next enable string
    let foundIndex = indexListOfEnableStrings.find(index => index === loopIndex);

    //if this loopindex is an enable index, enable parsing
    foundIndex ? (isParsingEnabled = true) : (isParsingEnabled = false);
  }

  //manage parsing main strings
  if (isParsingEnabled) {
    let foundIndex = list.indexOf(mainParseString, loopIndex);
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

for (let i = 0; i < indexListofMainStrings.length; i++) {
  let currentIndex = indexListofMainStrings[i].index;
  //starting at currentindex, find the next ')
  let closingIndex = list.indexOf(")", currentIndex);

  //do regex test first
  if (reg.test(list.substring(currentIndex, closingIndex + 1))) {
    //pass test
    indexListofMainStrings[i].text = list.substring(currentIndex, closingIndex + 1);
    //content += `${i},${indexListofMainStrings[i].text}\n`;
  } else {
    //fails test
    indexListofMainStrings[i].text = "";
  }
}

const listOfMultipliedResults: number[] = [];

let lineIndex = 0;
for (let mainString of indexListofMainStrings) {
  console.log("mainString: ", mainString);
  if (mainString.text == "") {
    lineIndex++;
    continue;
  }
  const startofValues = 4;
  const endofValues = mainString.text.length - 1;
  const values = mainString.text.substring(startofValues, endofValues);
  const listOfValues = values.split(",");
  console.log("listOfValues: ", listOfValues);
  const listOfNumericValues = listOfValues.map(value => parseInt(value));
  console.log("listOfNumericValues: ", listOfNumericValues);
  const multipliedValue = listOfNumericValues[0] * listOfNumericValues[1];
  console.log("multipliedValue: ", multipliedValue);

  if (!isNaN(multipliedValue)) {
    listOfMultipliedResults.push(multipliedValue);
    content += `${lineIndex},${mainString.text},${listOfNumericValues[0]},${listOfNumericValues[1]},${multipliedValue}\n`;
  }
  lineIndex++;
}

//console.log("indexListofMainStrings: ", indexListofMainStrings);
//console.log("listOfMultipliedResults: ", listOfMultipliedResults);

//reduce listOfMultipliedResults
const rslt = listOfMultipliedResults.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
console.log("rslt: ", rslt);

writeCSVfile(content);
function writeCSVfile(content: string) {
  fs.writeFile("./test.csv", content, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
}
