// parse list
const list: number[][] = [];
import { log } from "node:console";
import * as fs from "node:fs";

const DATASET = "./data.txt";

try {
  const data = fs.readFileSync(DATASET, "utf-8");
  // Process the data here
  const lines = data.split("\r\n");
  // Do something with each line
  lines.forEach(line => {
    const numbers = line.split(" ");
    const numberRow: number[] = [];
    numbers.forEach(number => numberRow.push(parseInt(number)));
    list.push(numberRow);
  });
} catch (err) {
  console.error("ERROR", err);
}

const results: boolean[] = [];

type TestResult = {
  pass: boolean | null;
  retry: boolean;
  rawList: number[];
  endList: number[];
};

let content = `line number, overall, test 1 result, test 2 result, raw line data, ending line data, retry1, retry2 \n`;

function test1(list: number[], retries: number = 0): TestResult {
  //The levels are either all increasing or all decreasing.
  let tresult: TestResult = { pass: false, retry: false, rawList: [...list], endList: [] };
  let endList: number[] = [...list];
  let direction: "increasing" | "decreasing" = "increasing";
  let retry: boolean = false;

  console.log("list: ", list);

  for (let i = 0; i < endList.length; i++) {
    if (i == 0) {
      // test for decreasing

      if (endList[i] > endList[i + 1]) {
        direction = "decreasing";
      }
      console.log("setting diretion ", direction);
    } else {
      if (direction == "increasing") {
        if (endList[i] >= endList[i + 1]) {
          //retest, remove problem index
          console.log("failed check", endList[i], endList[i + 1]);

          retry = true;
          if (retries == 0) {
            endList.splice(i + 1, 1);
            //endList.splice(i, 1);
            console.log("retrying", endList);
            let retryResult = test1(endList, 1);
            if (retryResult.pass == false) {
              tresult = { pass: false, retry, rawList: [...list], endList: endList };
              return tresult;
            }
          } else {
            tresult = { pass: false, retry, rawList: [...list], endList: endList };
            return tresult;
          }
        }
      } else {
        // test for decreasing
        if (endList[i] <= endList[i + 1]) {
          console.log("failed check", endList[i], endList[i + 1]);
          retry = true;
          if (retries == 0) {
            endList.splice(i + 1, 1);
            //endList.splice(i, 1);
            console.log("retrying", endList);
            let retryResult = test1(endList, 1);
            if (retryResult.pass == false) {
              tresult = { pass: false, retry, rawList: [...list], endList: endList };
              return tresult;
            }
          } else {
            tresult = { pass: false, retry, rawList: [...list], endList: endList };
            return tresult;
          }
        }
      }
    }
  }

  console.log("passed check", endList);
  tresult = { pass: true, retry, rawList: [...list], endList: endList };
  return tresult;
}

function test2(list: number[], retries: number = 0): TestResult {
  let tresult: TestResult = { pass: null, retry: false, rawList: [...list], endList: [] };
  let endList: number[] = [...list];
  let retry: boolean = false;

  //console.log("list: ", list);

  if (retries == 1) {
    retry = true;
  }

  for (let i = 0; i < endList.length - 1; i++) {
    //gap is less than 3
    const gap = Math.abs(endList[i + 1] - endList[i]);
    console.log("gap: ", gap, " index: ", i);
    if (gap > 3 || gap == 0) {
      //console.log("failed gap");
      retry = true;
      if (retries == 0) {
        console.log("retry");

        const endListCopy = [...endList];
        endListCopy.splice(i, 1);
        console.log("endListcopy: ", endListCopy);
        const endListCopy2 = [...endList];
        endListCopy2.splice(i + 1, 1);
        console.log("endListcopy2: ", endListCopy2);

        let retryResult = test2(endListCopy, 1);
        if (retryResult.pass == false) {
          retryResult = test2(endListCopy2, 1);

          if (retryResult.pass == false) {
            tresult = { pass: false, retry, rawList: [...list], endList: endListCopy2 };
            return tresult;
          } else endList = [...endListCopy2];
        } else {
          endList = [...endListCopy];
        }
      } else {
        //console.log("fail gap, out of retries");
        tresult = { pass: false, retry, rawList: [...list], endList };
        return tresult;
      }
    }
  }
  //console.log("passed gap check");
  tresult = { pass: true, retry, rawList: [...list], endList };
  return tresult;
}

let trueCount = 0;
for (let i = 0; i < list.length; i++) {
  let test1Result: TestResult = test1(list[i]);
  let test2Result: TestResult = { pass: null, retry: false, rawList: [], endList: [] };

  if (test1Result.pass) {
    if (test1Result.retry) {
      test2Result = test2(test1Result.endList, 1);
    } else test2Result = test2(test1Result.endList);

    if (test2Result.pass) {
      results.push(true);
    } else {
      results.push(false);
    }
  } else {
    results.push(false);
  }
  content += `${i + 1},${results[i]},${test1Result.pass},${test2Result.pass},`;
  list[i].forEach(number => (content += `${number} `));
  content += `,`;
  test2Result.endList.forEach(number => (content += `${number} `));
  content += `,${test1Result.retry}, ${test2Result.retry} \n`;

  if (results[i]) trueCount++;
}

//count the trues

//write results to file

console.log("true count: ", trueCount);

fs.writeFile("./test.csv", content, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});
