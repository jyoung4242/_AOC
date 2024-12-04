import * as fs from "node:fs";

export const readFileToStringList = (datafilepath: string): string[] => {
  let list: string[] = [];
  try {
    const data = fs.readFileSync(datafilepath, "utf-8");
    // Process the data here
    //const lines = data.split("\r\n");
    // Do something with each line
    list.push(data);
  } catch (err) {
    console.error("ERROR", err);
  }

  return list;
};

export const readFileToNumberList = (datafilepath: string, numLists: number, splitString: string = " "): number[][] => {
  const lists: number[][] = Array(numLists);
  for (let i = 0; i < numLists; i++) {
    lists[i] = [];
  }

  try {
    const data = fs.readFileSync(datafilepath, "utf-8");
    // Process the data here
    const lines = data.split("\r\n");

    // Do something with each line
    lines.forEach(line => {
      const numbers = line.split(splitString);
      if (numbers.length != numLists) {
        throw new Error("Number of coloums in file does not match number of lists submitted");
      }
      for (let i = 0; i < numLists; i++) {
        lists[i].push(parseInt(numbers[i]));
      }
    });
  } catch (err) {
    console.error("ERROR", err);
  }

  return lists;
};

export const readFileToString = (datafilepath: string): string => {
  let data = "";
  try {
    data = fs.readFileSync(datafilepath, "utf-8");
  } catch (err) {
    console.error("ERROR", err);
  }

  return data;
};
