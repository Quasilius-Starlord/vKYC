import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	'0x61DEec662E2D3b97A7badeD1c3D1DF3b84F54187'
	);

export default instance;