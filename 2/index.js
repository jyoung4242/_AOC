"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// parse list
var list = [];
var leftListCount = [];
var leftListMultiplied = [];
var fs = require("node:fs");
try {
    var data = fs.readFileSync("./data.txt", "utf-8");
    // Process the data here
    var lines = data.split("\r\n");
    // Do something with each line
    //console.log("lines: ", lines);
    lines.forEach(function (line) {
        var numbers = line.split(" ");
        var numberRow = [];
        numbers.forEach(function (number) { return numberRow.push(parseInt(number)); });
        list.push(numberRow);
    });
}
catch (err) {
    console.error("ERROR", err);
}
console.log("list: ", list);
var results = [];
/*
For each entry in list, run two tests
*/
function test1(list) {
    //The levels are either all increasing or all decreasing.
    var direction = "increasing";
    for (var i = 0; i < list.length; i++) {
        if (i == 0) {
            // test for decreasing
            if (list[i] > list[i + 1]) {
                direction = "decreasing";
            }
        }
        else {
            if (direction == "increasing") {
                if (list[i] >= list[i + 1])
                    return false;
            }
            else {
                if (list[i] <= list[i + 1])
                    return false;
            }
        }
    }
    return true;
}
function test2(list) {
    for (var i = 0; i < list.length; i++) {
        //gap is less than 3
        var gap = Math.abs(list[i + 1] - list[i]);
        if (gap > 3 || gap == 0)
            return false;
    }
    return true;
}
for (var i = 0; i < list.length; i++) {
    if (test1(list[i]) && test2(list[i]))
        results.push(true);
    else
        results.push(false);
}
//console.log("results: ", results);
results.forEach(function (result, index) {
    if (result == true)
        console.log("row ".concat(index, " is ").concat(list[index]));
});
//count the trues
var trueCount = 0;
results.forEach(function (result) {
    if (result)
        trueCount++;
});
console.log("true count: ", trueCount);
