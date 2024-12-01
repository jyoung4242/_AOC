const list1: number[] = [];
const list2: number[] = [];

import * as fs from "node:fs";

try {
  const data = fs.readFileSync("./input.txt", "utf-8");
  // Process the data here
  const lines = data.split("\n");
  // Do something with each line
  lines.forEach(line => {
    const numbers = line.split("   ");
    list1.push(parseInt(numbers[0]));
    list2.push(parseInt(numbers[1]));
  });
} catch (err) {
  console.error("ERROR", err);
}

function mySort(array: number[]) {
  let numLoops = 0;
  function swapValues(array: number[], index: number, numSwaps: number): number {
    let left = array[index];
    let right = array[index + 1];
    if (left > right) {
      array[index] = right;
      array[index + 1] = left;
      numSwaps++;
    }

    return numSwaps;
  }

  for (let j = 0; j < array.length; j++) {
    let swaps = 0;
    for (let i = 0; i < array.length; i++) {
      swaps = swapValues(array, i, swaps);
    }
    if (swaps === 0) {
      break;
    }

    numLoops++;
  }

  return array;
}

function getDifferences(list1: number[], list2: number[]): number[] {
  let result: number[] = [];

  for (let i = 0; i < list1.length; i++) {
    result.push(Math.abs(list1[i] - list2[i]));
  }

  return result;
}

const timestart = performance.now();

const sortedList1 = mySort(list1);
const sortedList2 = mySort(list2);
console.log("sorted lists: ", sortedList1, sortedList2);

const listOfDifferences: number[] = getDifferences(sortedList1, sortedList2);
const endResult = listOfDifferences.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

const timeend = performance.now();

console.log("end result: ", endResult);
console.log("total time: ", (timeend - timestart).toFixed(2), "ms");
