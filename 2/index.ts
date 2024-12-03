// parse list
const list: number[][] = [];
import * as fs from "node:fs";

try {
  const data = fs.readFileSync("./data.txt", "utf-8");
  // Process the data here
  const lines = data.split("\r\n");
  // Do something with each line
  //console.log("lines: ", lines);

  lines.forEach(line => {
    const numbers = line.split(" ");
    const numberRow: number[] = [];
    numbers.forEach(number => numberRow.push(parseInt(number)));
    list.push(numberRow);
  });
} catch (err) {
  console.error("ERROR", err);
}

console.log("list: ", list);

const results: boolean[] = [];

/*
For each entry in list, run two tests
*/

function test1(list: number[]): boolean {
  //The levels are either all increasing or all decreasing.
  let direction: "increasing" | "decreasing" = "increasing";
  for (let i = 0; i < list.length; i++) {
    if (i == 0) {
      // test for decreasing
      if (list[i] > list[i + 1]) {
        direction = "decreasing";
      }
    } else {
      if (direction == "increasing") {
        if (list[i] >= list[i + 1]) return false;
      } else {
        if (list[i] <= list[i + 1]) return false;
      }
    }
  }

  return true;
}

function test2(list: number[]): boolean {
  for (let i = 0; i < list.length; i++) {
    //gap is less than 3
    const gap = Math.abs(list[i + 1] - list[i]);
    if (gap > 3 || gap == 0) return false;
  }
  return true;
}

for (let i = 0; i < list.length; i++) {
  if (test1(list[i]) && test2(list[i])) results.push(true);
  else results.push(false);
}

//console.log("results: ", results);
results.forEach((result, index) => {
  if (result == true) console.log(`row ${index} is ${list[index]}`);
});

//count the trues

let trueCount = 0;

results.forEach(result => {
  if (result) trueCount++;
});

console.log("true count: ", trueCount);
