import * as rL from "node:readline";

const rLc = rL.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function test() {
  console.log("node readline", rL);
  console.log("readline interface", rLc);
}

export function waitForKeypress(): Promise<void> {
  return new Promise(resolve => {
    console.log("Press any key to continue...");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      rLc.close();
      resolve();
    });
  });
}
