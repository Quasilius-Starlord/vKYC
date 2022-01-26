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

//initial -  0xaea54024B29a9482e725E7BEA934c83b895AEF32

// later - 0x4b84F8FcBF0132593233E8A2eCDA31213f7a5528

// 0x0BC2F883BcfD155Ea1d9B8580C07d2CD367536f9

// 0xEBC35d89c76F4789b48E2aa7CF5B4885B075B728

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