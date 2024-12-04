"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileToString = exports.readFileToNumberList = exports.readFileToStringList = void 0;
var fs = require("node:fs");
var readFileToStringList = function (datafilepath) {
    var list = [];
    try {
        var data = fs.readFileSync(datafilepath, "utf-8");
        // Process the data here
        //const lines = data.split("\r\n");
        // Do something with each line
        list.push(data);
    }
    catch (err) {
        console.error("ERROR", err);
    }
    return list;
};
exports.readFileToStringList = readFileToStringList;
var readFileToNumberList = function (datafilepath, numLists, splitString) {
    if (splitString === void 0) { splitString = " "; }
    var lists = Array(numLists);
    for (var i = 0; i < numLists; i++) {
        lists[i] = [];
    }
    try {
        var data = fs.readFileSync(datafilepath, "utf-8");
        // Process the data here
        var lines = data.split("\r\n");
        // Do something with each line
        lines.forEach(function (line) {
            var numbers = line.split(splitString);
            if (numbers.length != numLists) {
                throw new Error("Number of coloums in file does not match number of lists submitted");
            }
            for (var i = 0; i < numLists; i++) {
                lists[i].push(parseInt(numbers[i]));
            }
        });
    }
    catch (err) {
        console.error("ERROR", err);
    }
    return lists;
};
exports.readFileToNumberList = readFileToNumberList;
var readFileToString = function (datafilepath) {
    var data = "";
    try {
        data = fs.readFileSync(datafilepath, "utf-8");
    }
    catch (err) {
        console.error("ERROR", err);
    }
    return data;
};
exports.readFileToString = readFileToString;
