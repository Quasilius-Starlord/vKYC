import web3 from './web3';
import KycFactory from './build/KycFactory.json';


const instance = new web3.eth.Contract(
	KycFactory.abi,
	//gorieli address
	// '0x705C3A99decFEe2253372C4FfB9bc6Fa7Fe83690'
	// local address
	'0x1A6ccE180B34F7d274CcFf516881FB77785c8a0C'
	);

export default instance;