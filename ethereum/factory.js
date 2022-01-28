import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0x49687eF7d006d8E82ef4432A8AFcFA782c654d88'
	);

export default instance;