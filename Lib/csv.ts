import * as fs from "node:fs";

type CSVdata = string | number;

let CSVcontent: CSVdata[][] = [];
let CSVHeaders: string[] = [];
let CSVFileName = "./test.csv";

let CSVContentLine: CSVdata[] = [];

export function setupCSVFile(fileName: string, headers: string[] = []) {
  CSVFileName = fileName;
  CSVHeaders = [...headers];
}

export function getCSVContent(showHeaders: boolean = false): CSVdata[][] {
  if (showHeaders) {
    return [CSVHeaders, ...CSVcontent];
  } else {
    return [...CSVcontent];
  }
}

export function resetCSVLine() {
  CSVContentLine = [];
}

export function appendToCSVLine(input: CSVdata) {
  CSVContentLine.push(input);
}

export function appendCSVLineToCSVContent() {
  CSVcontent.push([...CSVContentLine]);
}

export function appendCSVColumn(content: CSVdata[] = []) {
  const numRows = content.length;
  const numCSVcols = CSVcontent.length;
  console.log("numCSVcols: ", numCSVcols);
  console.log("numRows: ", numRows);
  console.log("CSVcontent: ", CSVcontent);

  for (let i = 0; i < numRows; i++) {
    if (!CSVcontent[numCSVcols]) {
      CSVcontent.push([]);
      console.log("CSVcontent[numCSVcols]: ", CSVcontent[numCSVcols]);
    }
    CSVcontent[numCSVcols].push(content[i]);
  }
}

export function editCSVdata(row: number, column: number, content: CSVdata): CSVdata {
  try {
    let currentContent = CSVcontent[column][row];
  } catch (error) {
    throw new Error("row or column does not exist");
  }

  CSVcontent[column][row] = content;
  return CSVcontent[column][row];
}

export function clearCSVContent() {
  CSVcontent;
}

export function writeCSVfile() {
  let contentstring = "";
  for (let i = 0; i < CSVHeaders.length; i++) {
    contentstring += `${CSVHeaders[i]},`;
  }
  contentstring += `\n`;

  for (let i = 0; i < CSVcontent.length; i++) {
    for (let j = 0; j < CSVcontent[i].length; j++) {
      contentstring += `${CSVcontent[i][j]},`;
    }
    contentstring += `\n`;
  }

  fs.writeFile(CSVFileName, contentstring, err => {
    if (err) {
      console.error(err);
    }
  });
}
