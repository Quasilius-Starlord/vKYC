const path = require('path');
const solc = require('solc');
const fs = require("fs-extra");
 
// get path to build folder
const buildPath = path.resolve(__dirname, "build");
// delete build folder
fs.removeSync(buildPath);
 
// get path to KYC.sol
const kycPath = path.resolve(__dirname, "contracts", "KYC.sol");
// read KYC file
const source = fs.readFileSync(kycPath, "utf8");
// compile contracts and get contracts
let input = {
  language: "Solidity",
  sources: {
    "KYC.sol": {
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
// const output = solc.compile(output, 1);
const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output); 
// create build folder
fs.ensureDirSync(buildPath);
 
// loop over output and write each contract to different file in build directory
if (output.errors) {
  output.errors.forEach((err) => {
    console.log(err.formattedMessage);
  });
} else {
  const contracts = output.contracts["KYC.sol"];
  for (let contract in contracts) {
  if (contracts.hasOwnProperty(contract)) {
    fs.outputJsonSync(path.resolve(buildPath, `${contract}.json`), contracts[contract]);
  }
}
}