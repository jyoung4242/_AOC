"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// parse list
var list1 = [];
var list2 = [];
var leftListCount = [];
var leftListMultiplied = [];
var node_console_1 = require("node:console");
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
function countNumTimes(numberToFind, array) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === numberToFind) {
            count++;
        }
    }
    return count;
}
function multiplyLeftList(array1, array2) {
    var result = [];
    for (var i = 0; i < array1.length; i++) {
        result.push(array1[i] * array2[i]);
    }
    return result;
}
for (var i = 0; i < list1.length; i++) {
    leftListCount.push(countNumTimes(list1[i], list2));
}
(0, node_console_1.log)("left list count: ", leftListCount);
leftListMultiplied = multiplyLeftList(list1, leftListCount);
(0, node_console_1.log)("left list multiplied: ", leftListMultiplied);
var endResult = leftListMultiplied.reduce(function (previousValue, currentValue) { return previousValue + currentValue; }, 0);
(0, node_console_1.log)("end result: ", endResult);
