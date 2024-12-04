"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCSVfile = exports.clearCSVContent = exports.editCSVdata = exports.appendCSVColumn = exports.appendToCSVLine = exports.getCSVContent = exports.setupCSVFile = void 0;
var fs = require("node:fs");
var CSVcontent = [];
var CSVHeaders = [];
var CSVFileName = "./test.csv";
function setupCSVFile(fileName, headers) {
    if (headers === void 0) { headers = []; }
    CSVFileName = fileName;
    CSVHeaders = __spreadArray([], headers, true);
}
exports.setupCSVFile = setupCSVFile;
function getCSVContent(showHeaders) {
    if (showHeaders === void 0) { showHeaders = false; }
    if (showHeaders) {
        return __spreadArray([CSVHeaders], CSVcontent, true);
    }
    else {
        return __spreadArray([], CSVcontent, true);
    }
}
exports.getCSVContent = getCSVContent;
function appendToCSVLine(content) {
    if (content === void 0) { content = []; }
    //get number of columns in CSVContent
    var numCols = content.length;
    var tempRow = [];
    for (var i = 0; i < numCols; i++) {
        if (!content[i]) {
            content[i] = "";
        }
        tempRow.push(content[i]);
    }
    CSVcontent.push(__spreadArray([], tempRow, true));
}
exports.appendToCSVLine = appendToCSVLine;
function appendCSVColumn(content) {
    if (content === void 0) { content = []; }
    var numRows = content.length;
    var numCSVcols = CSVcontent.length;
    console.log("numCSVcols: ", numCSVcols);
    console.log("numRows: ", numRows);
    console.log("CSVcontent: ", CSVcontent);
    for (var i = 0; i < numRows; i++) {
        if (!CSVcontent[numCSVcols]) {
            CSVcontent.push([]);
            console.log("CSVcontent[numCSVcols]: ", CSVcontent[numCSVcols]);
        }
        CSVcontent[numCSVcols].push(content[i]);
    }
}
exports.appendCSVColumn = appendCSVColumn;
function editCSVdata(row, column, content) {
    try {
        var currentContent = CSVcontent[column][row];
    }
    catch (error) {
        throw new Error("row or column does not exist");
    }
    CSVcontent[column][row] = content;
    return CSVcontent[column][row];
}
exports.editCSVdata = editCSVdata;
function clearCSVContent() {
    CSVcontent;
}
exports.clearCSVContent = clearCSVContent;
function writeCSVfile() {
    var contentstring = "";
    for (var i = 0; i < CSVHeaders.length; i++) {
        contentstring += "".concat(CSVHeaders[i], ",");
    }
    contentstring += "\n";
    for (var i = 0; i < CSVcontent.length; i++) {
        for (var j = 0; j < CSVcontent[i].length; j++) {
            contentstring += "".concat(CSVcontent[i][j], ",");
        }
        contentstring += "\n";
    }
    fs.writeFile(CSVFileName, contentstring, function (err) {
        if (err) {
            console.error(err);
        }
    });
}
exports.writeCSVfile = writeCSVfile;
