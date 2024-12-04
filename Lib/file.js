"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileToString = exports.readFileToNumberList = exports.readFileToTileMap = exports.readFileToStringList = void 0;
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
var readFileToTileMap = function (datafilepath, endoffile) {
    if (endoffile === void 0) { endoffile = "\r\n"; }
    var list = [];
    try {
        var data = fs.readFileSync(datafilepath, "utf-8");
        // Process the data here
        //const lines = data.split("\r\n");
        // Do something with each line
        var splitdata = data.split(endoffile);
        for (var _i = 0, splitdata_1 = splitdata; _i < splitdata_1.length; _i++) {
            var line = splitdata_1[_i];
            var tempLine = [];
            for (var _a = 0, line_1 = line; _a < line_1.length; _a++) {
                var char = line_1[_a];
                tempLine.push(char);
            }
            list.push(tempLine);
        }
    }
    catch (err) {
        console.error("ERROR", err);
    }
    return { map: list, width: list[0].length };
};
exports.readFileToTileMap = readFileToTileMap;
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
