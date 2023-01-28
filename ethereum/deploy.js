const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/KycFactory.json');

const interface = compiledFactory.abi;
const bytecode = compiledFactory.evm.bytecode.object;

const goreli='https://goerli.infura.io/v3/01cb190e84204425a5153202124d11a4'
const local='HTTP://127.0.0.1:7545'

const provider = new HDWalletProvider(
	'3dd74c8b5b52d448736932b28eee0d5bfe0b9b2cc7de26ff9c223dd607b2f9f1',
	local
);
	// 'entry penalty feature canal length nation spoil frame cargo swap drive force',
	// 'pistol traffic broccoli bitter stool labor dance cricket main slice insect dirt',
	// local
	// 'https://rinkeby.infura.io/v3/04736f0e7d19460c9f3411677477e3d6'
		// local

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
// goreli:
// 0x705C3A99decFEe2253372C4FfB9bc6Fa7Fe83690

// local
// 0x20296B6f75bF02257C15d2C16ff704d83A50eE12