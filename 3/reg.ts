const testString = "mul(933,97)";

const reg = RegExp(/^mul\(\d+,\d+\)$/);

console.log(reg.test(testString)); // true
