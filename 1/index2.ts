// parse list
const list1: number[] = [];
const list2: number[] = [];

const leftListCount: number[] = [];
let leftListMultiplied: number[] = [];

import { log } from "node:console";
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

function countNumTimes(numberToFind: number, array: number[]): number {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === numberToFind) {
      count++;
    }
  }
  return count;
}

function multiplyLeftList(array1: number[], array2: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < array1.length; i++) {
    result.push(array1[i] * array2[i]);
  }
  return result;
}

for (let i = 0; i < list1.length; i++) {
  leftListCount.push(countNumTimes(list1[i], list2));
}

log("left list count: ", leftListCount);

leftListMultiplied = multiplyLeftList(list1, leftListCount);

log("left list multiplied: ", leftListMultiplied);
const endResult = leftListMultiplied.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
log("end result: ", endResult);
