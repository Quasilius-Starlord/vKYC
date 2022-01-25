const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../build/KycFactory.json');
const compiledUserdef = require('../build/Userdef.json');

let accounts;
let userdef;
let factory;
let userdefAddress;

beforeEach( async() => {
	accounts = await web3.eth.getAccounts();
	factory = await new web3.eth.Contract(compiledFactory.abi).
	deploy({data: "0x" + compiledFactory.evm.bytecode }).
	send({from: accounts[0], gas: '1000000'});
});
