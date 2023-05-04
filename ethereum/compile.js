const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const setupPath = path.resolve(__dirname, "setup");
fs.removeSync(setupPath);

const donatePath = path.resolve(__dirname, "contracts", "Donate.sol");
const source = fs.readFileSync(donatePath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Donate.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Donate.sol"
];

fs.ensureDirSync(setupPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(setupPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
