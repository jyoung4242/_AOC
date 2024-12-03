// parse line
const list: string[] = [];
import { log } from "node:console";
import * as fs from "node:fs";

const DATASET = "./data.txt";
let content = "line,string \r\n";
const reg = RegExp(/^mul\(\d+,\d+\)$/);

try {
  const data = fs.readFileSync(DATASET, "utf-8");
  // Process the data here
  //const lines = data.split("\r\n");
  // Do something with each line
  list.push(data);
} catch (err) {
  console.error("ERROR", err);
}

console.log("list", list);

//list of strings filled with text
//one long one in line[0]

const parseString = "mul(";
const arrayOfFoundIndexes: number[][] = [];
//parse for each key phrase

for (let parsingString of list) {
  let done = false;
  let searchIndex = 0;
  let tempListOfIndexes: number[] = [];
  while (!done) {
    const foundIndex = parsingString.indexOf(parseString, searchIndex);
    if (foundIndex == -1) {
      done = true;
    } else {
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
const sanitizedSubstrings: string[][] = [];
for (let j = 0; j < list.length; j++) {
  let parsingString = list[j];
  console.log("parsingString: ", parsingString, j);

  for (let i = 0; i < arrayOfFoundIndexes.length; i++) {
    const currentIndexes = arrayOfFoundIndexes[i];
    console.log("currentIndexes: ", currentIndexes);
    const listOfSanitizedSubstrings: string[] = [];

    for (let k = 0; k < currentIndexes.length; k++) {
      let currentIndex = currentIndexes[k];
      let nextIndex = currentIndexes[k + 1];
      if (!nextIndex) nextIndex = parsingString.length;
      console.log("currentIndex: ", currentIndex, " nextIndex: ", nextIndex);
      const substring = parsingString.substring(currentIndex, nextIndex);
      console.log("substring: ", substring);
      //search substring for ')'
      const closingIndex = substring.indexOf(")");
      const sanitizedSubstring = substring.substring(0, closingIndex + 1);
      if (!reg.test(sanitizedSubstring)) {
        continue;
      }
      //content += `${i + 1},${sanitizedSubstring}\n`;
      listOfSanitizedSubstrings.push(sanitizedSubstring);
    }

    sanitizedSubstrings.push(listOfSanitizedSubstrings);
  }
  console.log("sanitizedSubstring: ", sanitizedSubstrings);
}

const listOfMultipliedResults: number[][] = [];
sanitizedSubstrings.forEach((listOfSubstring, index) => {
  const arrayOfMultipliedResults: number[] = [];
  console.log("listOfSubstring: ", listOfSubstring);
  listOfSubstring.forEach(substring => {
    console.log("substring: ", substring);
    const startofValues = 4;
    const endofValues = substring.length - 1;
    const values = substring.substring(startofValues, endofValues);
    const listOfValues = values.split(",");
    console.log("listOfValues: ", listOfValues);
    const listOfNumericValues = listOfValues.map(value => parseInt(value));
    console.log("listOfNumericValues: ", listOfNumericValues);
    const multipliedValue = listOfNumericValues[0] * listOfNumericValues[1];
    console.log("multipliedValue: ", multipliedValue);

    if (!isNaN(multipliedValue)) {
      arrayOfMultipliedResults.push(multipliedValue);
    }
  });
  console.log("arrayOfMultipliedResults: ", arrayOfMultipliedResults);

  const rslt = arrayOfMultipliedResults.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  listOfMultipliedResults.push([rslt]);
});

console.log("listOfMultipliedResults: ", listOfMultipliedResults);

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
