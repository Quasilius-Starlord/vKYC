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

// 0xA7bA5907B052e3360eFC1cE884CD656eFF4cA0B7
// 0xF76c382C09E87914C2dbDF56ed7e77EE1fD79042
// 0x732785Da1781d9b9a07054C501260344561D2CA9
// 0x61DEec662E2D3b97A7badeD1c3D1DF3b84F54187

/* 
[
  {
    inputs: [],
    name: 'createKyc',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    constant: undefined,
    payable: undefined,
    signature: '0x826c4ae6'
  },
  {
    inputs: [ [Object] ],
    name: 'deployedKycs',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
    signature: '0x7e3c01d7'
  },
  {
    inputs: [],
    name: 'getDeployedKycs',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
    signature: '0x8379ec2f'
  },
  {
    inputs: [],
    name: 'getparticularUser',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
    signature: '0xbdb37313'
  },
  {
    inputs: [],
    name: 'login',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
    signature: '0xb34e97e8'
  }
]
*/