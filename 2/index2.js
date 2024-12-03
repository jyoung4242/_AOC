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
// parse list
var list = [];
var fs = require("node:fs");
var DATASET = "./data.txt";
try {
    var data = fs.readFileSync(DATASET, "utf-8");
    // Process the data here
    var lines = data.split("\r\n");
    // Do something with each line
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
var results = [];
var content = "line number, overall, test 1 result, test 2 result, raw line data, ending line data, retry1, retry2 \n";
function test1(list, retries) {
    if (retries === void 0) { retries = 0; }
    //The levels are either all increasing or all decreasing.
    var tresult = { pass: false, retry: false, rawList: __spreadArray([], list, true), endList: [] };
    var endList = __spreadArray([], list, true);
    var direction = "increasing";
    var retry = false;
    console.log("list: ", list);
    for (var i = 0; i < endList.length; i++) {
        if (i == 0) {
            // test for decreasing
            if (endList[i] > endList[i + 1]) {
                direction = "decreasing";
            }
            console.log("setting diretion ", direction);
        }
        else {
            if (direction == "increasing") {
                if (endList[i] >= endList[i + 1]) {
                    //retest, remove problem index
                    console.log("failed check", endList[i], endList[i + 1]);
                    retry = true;
                    if (retries == 0) {
                        endList.splice(i + 1, 1);
                        //endList.splice(i, 1);
                        console.log("retrying", endList);
                        var retryResult = test1(endList, 1);
                        if (retryResult.pass == false) {
                            tresult = { pass: false, retry: retry, rawList: __spreadArray([], list, true), endList: endList };
                            return tresult;
                        }
                    }
                    else {
                        tresult = { pass: false, retry: retry, rawList: __spreadArray([], list, true), endList: endList };
                        return tresult;
                    }
                }
            }
            else {
                // test for decreasing
                if (endList[i] <= endList[i + 1]) {
                    console.log("failed check", endList[i], endList[i + 1]);
                    retry = true;
                    if (retries == 0) {
                        endList.splice(i + 1, 1);
                        //endList.splice(i, 1);
                        console.log("retrying", endList);
                        var retryResult = test1(endList, 1);
                        if (retryResult.pass == false) {
                            tresult = { pass: false, retry: retry, rawList: __spreadArray([], list, true), endList: endList };
                            return tresult;
                        }
                    }
                    else {
                        tresult = { pass: false, retry: retry, rawList: __spreadArray([], list, true), endList: endList };
                        return tresult;
                    }
                }
            }
        }
    }
    console.log("passed check", endList);
    tresult = { pass: true, retry: retry, rawList: __spreadArray([], list, true), endList: endList };
    return tresult;
}
function test2(list, retries) {
    if (retries === void 0) { retries = 0; }
    var tresult = { pass: null, retry: false, rawList: __spreadArray([], list, true), endList: [] };
    var endList = __spreadArray([], list, true);
    var retry = false;
    //console.log("list: ", list);
    if (retries == 1) {
        retry = true;
    }
    for (var i = 0; i < endList.length - 1; i++) {
        //gap is less than 3
        var gap = Math.abs(endList[i + 1] - endList[i]);
        console.log("gap: ", gap, " index: ", i);
        if (gap > 3 || gap == 0) {
            //console.log("failed gap");
            retry = true;
            if (retries == 0) {
                console.log("retry");
                var endListCopy = __spreadArray([], endList, true);
                endListCopy.splice(i, 1);
                console.log("endListcopy: ", endListCopy);
                var endListCopy2 = __spreadArray([], endList, true);
                endListCopy2.splice(i + 1, 1);
                console.log("endListcopy2: ", endListCopy2);
                var retryResult = test2(endListCopy, 1);
                if (retryResult.pass == false) {
                    retryResult = test2(endListCopy2, 1);
                    if (retryResult.pass == false) {
                        tresult = { pass: false, retry: retry, rawList: __spreadArray([], list, true), endList: endListCopy2 };
                        return tresult;
                    }
                    else
                        endList = __spreadArray([], endListCopy2, true);
                }
                else {
                    endList = __spreadArray([], endListCopy, true);
                }
            }
            else {
                //console.log("fail gap, out of retries");
                tresult = { pass: false, retry: retry, rawList: __spreadArray([], list, true), endList: endList };
                return tresult;
            }
        }
    }
    //console.log("passed gap check");
    tresult = { pass: true, retry: retry, rawList: __spreadArray([], list, true), endList: endList };
    return tresult;
}
var trueCount = 0;
for (var i = 0; i < list.length; i++) {
    var test1Result = test1(list[i]);
    var test2Result = { pass: null, retry: false, rawList: [], endList: [] };
    if (test1Result.pass) {
        if (test1Result.retry) {
            test2Result = test2(test1Result.endList, 1);
        }
        else
            test2Result = test2(test1Result.endList);
        if (test2Result.pass) {
            results.push(true);
        }
        else {
            results.push(false);
        }
    }
    else {
        results.push(false);
    }
    content += "".concat(i + 1, ",").concat(results[i], ",").concat(test1Result.pass, ",").concat(test2Result.pass, ",");
    list[i].forEach(function (number) { return (content += "".concat(number, " ")); });
    content += ",";
    test2Result.endList.forEach(function (number) { return (content += "".concat(number, " ")); });
    content += ",".concat(test1Result.retry, ", ").concat(test2Result.retry, " \n");
    if (results[i])
        trueCount++;
}
//count the trues
//write results to file
console.log("true count: ", trueCount);
fs.writeFile("./test.csv", content, function (err) {
    if (err) {
        console.error(err);
    }
    else {
        // file written successfully
    }
});
