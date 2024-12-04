//read in textdata as 2d array
import * as mfs from "../Lib/file";

const DATASET = "./data.txt";
let list = mfs.readFileToTileMap(DATASET);

let tilemap = list.map;
let tilewidth = list.width;

let score = 0;

//interate over each 'tile' of text looking for an 'x'

const directionVectors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const directions = ["UL", "L", "DL", "U", "D", "UR", "R", "DR"];

function findNeighbors(tilemap: string[][], tilewidth: number, coord: number[]): number[][] {
  const neighbors: number[][] = [];

  for (let i = 0; i < directionVectors.length; i++) {
    const x = coord[0] + directionVectors[i][0];
    const y = coord[1] + directionVectors[i][1];
    if (x >= 0 && x < tilewidth && y >= 0 && y < tilewidth) {
      neighbors.push([x, y]);
    }
  }

  return neighbors;
}

function findDirection(currentCoord: number[], endCoord: number[]): string {
  const dx = endCoord[1] - currentCoord[1];
  const dy = endCoord[0] - currentCoord[0];
  //console.log("dx: ", dx, " dy: ", dy);
  //console.log(currentCoord, endCoord);

  if (dx < 0 && dy < 0) {
    return "UL";
  } else if (dx < 0 && dy === 0) {
    return "L";
  } else if (dx < 0 && dy > 0) {
    return "DL";
  } else if (dx === 0 && dy < 0) {
    return "U";
  } else if (dx === 0 && dy > 0) {
    return "D";
  } else if (dx > 0 && dy < 0) {
    return "UR";
  } else if (dx > 0 && dy === 0) {
    return "R";
  } else if (dx > 0 && dy > 0) {
    return "DR";
  }

  return "";
}

function checkforXMAS(startingcoord: number[], direction: string): boolean {
  let dirVec = directionVectors[directions.indexOf(direction)];
  //console.log("in XMAS check", startingcoord, direction, dirVec);

  //check X
  let xCoord = [startingcoord[0], startingcoord[1]];
  let mCoord = [startingcoord[0] + dirVec[1], startingcoord[1] + dirVec[0]];
  let aCoord = [startingcoord[0] + 2 * dirVec[1], startingcoord[1] + 2 * dirVec[0]];
  let sCoord = [startingcoord[0] + 3 * dirVec[1], startingcoord[1] + 3 * dirVec[0]];

  //console.log("xCoord: ", xCoord, " mCoord: ", mCoord, " aCoord: ", aCoord, " sCoord: ", sCoord);
  // check coords for validity
  if (xCoord[0] < 0 || xCoord[0] >= tilewidth || xCoord[1] < 0 || xCoord[1] >= tilewidth) return false;
  if (mCoord[0] < 0 || mCoord[0] >= tilewidth || mCoord[1] < 0 || mCoord[1] >= tilewidth) return false;
  if (aCoord[0] < 0 || aCoord[0] >= tilewidth || aCoord[1] < 0 || aCoord[1] >= tilewidth) return false;
  if (sCoord[0] < 0 || sCoord[0] >= tilewidth || sCoord[1] < 0 || sCoord[1] >= tilewidth) return false;

  //console.log("passed validity checks");

  // Check X
  const x_check = tilemap[xCoord[0]][xCoord[1]] == "X";
  //check M
  const m_check = tilemap[mCoord[0]][mCoord[1]] == "M";
  //check A
  const a_check = tilemap[aCoord[0]][aCoord[1]] == "A";
  //check S
  const s_check = tilemap[sCoord[0]][sCoord[1]] == "S";

  //console.log("x_check: ", x_check, " m_check: ", m_check, " a_check: ", a_check, " s_check: ", s_check);

  return x_check && m_check && a_check && s_check;
}

for (let i = 0; i < tilemap.length; i++) {
  for (let j = 0; j < tilemap[i].length; j++) {
    if (tilemap[i][j] === "X") {
      //find 'm' as a neighbor tile
      const neighbors = findNeighbors(tilemap, tilewidth, [i, j]);

      for (let tile of neighbors) {
        if (tilemap[tile[0]][tile[1]] === "M") {
          //console.log("***********************");

          //console.log("found M: ", tile[0], tile[1]);
          let direction = findDirection([i, j], tile);
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
