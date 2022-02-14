import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0xF55c759Ee3e0c0F06984fC2B45C55f98E03ed41d'
	);

export default instance;