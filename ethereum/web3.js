import Web3 from 'web3';

let web3;
const goreli='https://goerli.infura.io/v3/01cb190e84204425a5153202124d11a4'
const local='HTTP://127.0.0.1:7545'

if(typeof window != "undefined" && typeof window.ethereum !== "undefined") {
	window.ethereum.request({method: "eth_requestAccounts"});
	web3 = new Web3(window.ethereum);
}
else{
	const provider = new Web3.providers.HttpProvider(
		// "https://rinkeby.infura.io/v3/04736f0e7d19460c9f3411677477e3d6"
		local
		);
	web3 = new Web3(provider);
}

export default web3;