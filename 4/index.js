"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//read in textdata as 2d array
var mfs = require("../Lib/file");
var DATASET = "./data.txt";
var list = mfs.readFileToTileMap(DATASET);
var tilemap = list.map;
var tilewidth = list.width;
var score = 0;
//interate over each 'tile' of text looking for an 'x'
var directionVectors = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];
var directions = ["UL", "L", "DL", "U", "D", "UR", "R", "DR"];
function findNeighbors(tilemap, tilewidth, coord) {
    var neighbors = [];
    for (var i = 0; i < directionVectors.length; i++) {
        var x = coord[0] + directionVectors[i][0];
        var y = coord[1] + directionVectors[i][1];
        if (x >= 0 && x < tilewidth && y >= 0 && y < tilewidth) {
            neighbors.push([x, y]);
        }
    }
    return neighbors;
}
function findDirection(currentCoord, endCoord) {
    var dx = endCoord[1] - currentCoord[1];
    var dy = endCoord[0] - currentCoord[0];
    //console.log("dx: ", dx, " dy: ", dy);
    //console.log(currentCoord, endCoord);
    if (dx < 0 && dy < 0) {
        return "UL";
    }
    else if (dx < 0 && dy === 0) {
        return "L";
    }
    else if (dx < 0 && dy > 0) {
        return "DL";
    }
    else if (dx === 0 && dy < 0) {
        return "U";
    }
    else if (dx === 0 && dy > 0) {
        return "D";
    }
    else if (dx > 0 && dy < 0) {
        return "UR";
    }
    else if (dx > 0 && dy === 0) {
        return "R";
    }
    else if (dx > 0 && dy > 0) {
        return "DR";
    }
    return "";
}
function checkforXMAS(startingcoord, direction) {
    var dirVec = directionVectors[directions.indexOf(direction)];
    //console.log("in XMAS check", startingcoord, direction, dirVec);
    //check X
    var xCoord = [startingcoord[0], startingcoord[1]];
    var mCoord = [startingcoord[0] + dirVec[1], startingcoord[1] + dirVec[0]];
    var aCoord = [startingcoord[0] + 2 * dirVec[1], startingcoord[1] + 2 * dirVec[0]];
    var sCoord = [startingcoord[0] + 3 * dirVec[1], startingcoord[1] + 3 * dirVec[0]];
    //console.log("xCoord: ", xCoord, " mCoord: ", mCoord, " aCoord: ", aCoord, " sCoord: ", sCoord);
    // check coords for validity
    if (xCoord[0] < 0 || xCoord[0] >= tilewidth || xCoord[1] < 0 || xCoord[1] >= tilewidth)
        return false;
    if (mCoord[0] < 0 || mCoord[0] >= tilewidth || mCoord[1] < 0 || mCoord[1] >= tilewidth)
        return false;
    if (aCoord[0] < 0 || aCoord[0] >= tilewidth || aCoord[1] < 0 || aCoord[1] >= tilewidth)
        return false;
    if (sCoord[0] < 0 || sCoord[0] >= tilewidth || sCoord[1] < 0 || sCoord[1] >= tilewidth)
        return false;
    //console.log("passed validity checks");
    // Check X
    var x_check = tilemap[xCoord[0]][xCoord[1]] == "X";
    //check M
    var m_check = tilemap[mCoord[0]][mCoord[1]] == "M";
    //check A
    var a_check = tilemap[aCoord[0]][aCoord[1]] == "A";
    //check S
    var s_check = tilemap[sCoord[0]][sCoord[1]] == "S";
    //console.log("x_check: ", x_check, " m_check: ", m_check, " a_check: ", a_check, " s_check: ", s_check);
    return x_check && m_check && a_check && s_check;
}
for (var i = 0; i < tilemap.length; i++) {
    for (var j = 0; j < tilemap[i].length; j++) {
        if (tilemap[i][j] === "X") {
            //find 'm' as a neighbor tile
            var neighbors = findNeighbors(tilemap, tilewidth, [i, j]);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var tile = neighbors_1[_i];
                if (tilemap[tile[0]][tile[1]] === "M") {
                    //console.log("***********************");
                    //console.log("found M: ", tile[0], tile[1]);
                    var direction = findDirection([i, j], tile);
                    //console.log("direction: ", direction);
                    if (checkforXMAS([i, j], direction)) {
                        //console.log("found XMAS: ", [i, j], direction);
                        score++;
                    }
                }
            }
        }
    }
}
console.log("score: ", score);
//when x found, find 'm' as a neighbor tile
// each 'm' tile found sets a 'direction' to walk and spell out 'xmas'
// if 'xmas' is found, increment score
// return score
