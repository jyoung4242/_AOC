import * as myFS from "../Lib/file";
import * as myCSV from "../Lib/csv";

//let data = myFS.readFileToString("./data.txt");
//console.log("data: ", data);

let list = myFS.readFileToNumberList("./input.txt", 2, "   ");

//setup CSV headers

let headerstrings = ["Line#", "testA", "testB"];
myCSV.setupCSVFile("./test.csv", headerstrings);

list.forEach(element => {
  myCSV.appendCSVColumn(element);
});
//console.log(myCSV.getCSVContent());

myCSV.writeCSVfile();

console.log("done");
