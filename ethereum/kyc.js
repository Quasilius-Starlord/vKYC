import web3 from './web3';
import Userdef from './build/Userdef.json';



export default address => {
	return new web3.eth.Contract(
	Userdef.abi,
	address
	);
}
