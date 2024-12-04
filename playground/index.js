"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var myFS = require("../Lib/file");
var myCSV = require("../Lib/csv");
//let data = myFS.readFileToString("./data.txt");
//console.log("data: ", data);
var list = myFS.readFileToNumberList("./input.txt", 2, "   ");
//setup CSV headers
var headerstrings = ["Line#", "testA", "testB"];
myCSV.setupCSVFile("./test.csv", headerstrings);
list.forEach(function (element) {
    myCSV.appendCSVColumn(element);
});
//console.log(myCSV.getCSVContent());
myCSV.writeCSVfile();
console.log("done");
