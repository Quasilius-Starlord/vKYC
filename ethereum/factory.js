import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0x0BC2F883BcfD155Ea1d9B8580C07d2CD367536f9'
	);

export default instance;