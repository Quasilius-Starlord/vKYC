import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0xFAc22cef8003088ce67f37bE5Cb373d58507062F'
	);

export default instance;