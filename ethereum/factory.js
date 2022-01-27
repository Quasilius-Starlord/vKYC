import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0xA7bA5907B052e3360eFC1cE884CD656eFF4cA0B7'
	);

export default instance;