"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list1 = [];
var list2 = [];
var fs = require("node:fs");
try {
    var data = fs.readFileSync("./input.txt", "utf-8");
    // Process the data here
    var lines = data.split("\n");
    // Do something with each line
    lines.forEach(function (line) {
        var numbers = line.split("   ");
        list1.push(parseInt(numbers[0]));
        list2.push(parseInt(numbers[1]));
    });
}
catch (err) {
    console.error("ERROR", err);
}
function mySort(array) {
    var numLoops = 0;
    function swapValues(array, index, numSwaps) {
        var left = array[index];
        var right = array[index + 1];
        if (left > right) {
            array[index] = right;
            array[index + 1] = left;
            numSwaps++;
        }
        return numSwaps;
    }
    for (var j = 0; j < array.length; j++) {
        var swaps = 0;
        for (var i = 0; i < array.length; i++) {
            swaps = swapValues(array, i, swaps);
        }
        if (swaps === 0) {
            break;
        }
        numLoops++;
    }
    return array;
}
function getDifferences(list1, list2) {
    var result = [];
    for (var i = 0; i < list1.length; i++) {
        result.push(Math.abs(list1[i] - list2[i]));
    }
    return result;
}
var timestart = performance.now();
var sortedList1 = mySort(list1);
var sortedList2 = mySort(list2);
console.log("sorted lists: ", sortedList1, sortedList2);
var listOfDifferences = getDifferences(sortedList1, sortedList2);
var endResult = listOfDifferences.reduce(function (previousValue, currentValue) { return previousValue + currentValue; }, 0);
var timeend = performance.now();
console.log("end result: ", endResult);
console.log("total time: ", (timeend - timestart).toFixed(2), "ms");
