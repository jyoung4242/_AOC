var testString = "mul(933,97)";
var reg = RegExp(/^mul\(\d+,\d+\)$/);
console.log(reg.test(testString)); // true
