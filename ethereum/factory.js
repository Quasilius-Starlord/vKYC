import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0xEBC35d89c76F4789b48E2aa7CF5B4885B075B728'
	);

export default instance;