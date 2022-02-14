const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/KycFactory.json');

const interface = compiledFactory.abi;
const bytecode = compiledFactory.evm.bytecode.object;

const provider = new HDWalletProvider(
'entry penalty feature canal length nation spoil frame cargo swap drive force',
'https://rinkeby.infura.io/v3/04736f0e7d19460c9f3411677477e3d6'
	);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	const result = await new web3.eth.Contract(interface)
     .deploy({data: '0x' + bytecode}) // add 0x bytecode
     .send({from: accounts[0]});
     console.log(interface);
	console.log('Contract deployed to',result.options.address);
};

deploy();

// 0xF55c759Ee3e0c0F06984fC2B45C55f98E03ed41d