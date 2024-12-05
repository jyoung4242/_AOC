"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForKeypress = exports.test = void 0;
var rL = require("node:readline");
var rLc = rL.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function test() {
    console.log("node readline", rL);
    console.log("readline interface", rLc);
}
exports.test = test;
function waitForKeypress() {
    return new Promise(function (resolve) {
        console.log("Press any key to continue...");
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on("data", function () {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            rLc.close();
            resolve();
        });
    });
}
exports.waitForKeypress = waitForKeypress;
