import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0xF76c382C09E87914C2dbDF56ed7e77EE1fD79042'
	);

export default instance;