"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//read in textdata as 2d array
var mfs = require("../Lib/file");
var DATASET = "./data.txt";
var list = mfs.readFileToTileMap(DATASET);
var tilemap = list.map;
var tilewidth = list.width;
var score = 0;
console.log(tilemap);
console.log(tilewidth);
//interate over each 'tile' of text looking for an 'x'
var directionVectors = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
];
var directions = ["UL", "DL", "UR", "DR"];
function findNeighbors(tilemap, tilewidth, tile) {
    var neighbors = [];
    for (var i = 0; i < directionVectors.length; i++) {
        var vector = directionVectors[i];
        var neighbor = [tile[0] + vector[0], tile[1] + vector[1]];
        if (neighbor[0] >= 0 && neighbor[0] < tilewidth && neighbor[1] >= 0 && neighbor[1] < tilemap[0].length) {
            neighbors.push(neighbor);
        }
        else {
            console.log("out of bounds");
            return [];
        }
    }
    return neighbors;
}
function checkForTwoMs(neighbors) {
    var neighborCount = 0;
    var mIndex = [];
    for (var i = 0; i < neighbors.length; i++) {
        if (tilemap[neighbors[i][0]][neighbors[i][1]] === "M") {
            neighborCount++;
            mIndex.push(neighbors[i]);
        }
    }
    if (neighborCount === 2)
        return { status: true, mIndex: mIndex };
    return { status: false, mIndex: [] };
}
function checkForOppositeS(startingcoord, mdirection) {
    var oppositeDirection = {
        UL: "DR",
        DL: "UR",
        UR: "DL",
        DR: "UL",
    };
    var sDir = oppositeDirection[mdirection];
    var sVec = directionVectors[directions.indexOf(sDir)];
    var sCoord = [startingcoord[0] + sVec[1], startingcoord[1] + sVec[0]];
    console.log("checkForOppositeS: ", startingcoord, sDir, sVec, sCoord);
    if (tilemap[sCoord[0]][sCoord[1]] === "S")
        return true;
    return false;
}
function findDirection(currentCoord, endCoord) {
    var dx = endCoord[1] - currentCoord[1];
    var dy = endCoord[0] - currentCoord[0];
    //console.log("dx: ", dx, " dy: ", dy);
    //console.log(currentCoord, endCoord);
    if (dx < 0 && dy < 0) {
        return "UL";
    }
    else if (dx < 0 && dy > 0) {
        return "DL";
    }
    else if (dx > 0 && dy < 0) {
        return "UR";
    }
    else if (dx > 0 && dy > 0) {
        return "DR";
    }
    return "";
}
for (var i = 0; i < tilemap.length; i++) {
    for (var j = 0; j < tilemap[i].length; j++) {
        if (tilemap[i][j] === "A") {
            console.log("************************");
            console.log("found A: ", i, j);
            var neighbors = findNeighbors(tilemap, tilewidth, [i, j]);
            var rstl = checkForTwoMs(neighbors);
            console.log("does this A have two Ms: ", rstl);
            if (rstl.status) {
                // need to find the direction of the Ms, and check for an 'S'
                var direction1 = findDirection([i, j], rstl.mIndex[0]);
                var direction2 = findDirection([i, j], rstl.mIndex[1]);
                console.log("found two m's, directions: ", direction1, direction2);
                if (checkForOppositeS([i, j], direction1) && checkForOppositeS([i, j], direction2)) {
                    console.log("found MAS's: ", [i, j], direction1, direction2);
                    score++;
                }
            }
        }
    }
}
console.log("score: ", score);
