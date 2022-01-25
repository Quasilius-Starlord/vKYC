import React from 'react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';

class KYCIndex extends React.Component {
	async componentDidMount() {
		//throw new Error('I crashed!');
		console.log('Hey');
		const kycs = await factory.methods.getDeployedKycs().call();
		let accounts = await web3.eth.getAccounts();
		try{
			const kyc = await factory.methods.login(accounts[0]).call();
			console.log(accounts[0]);
		console.log(kycs);
		console.log(kyc);
		}	catch(e){
			console.log("Problem occured");
		}
		
	}

	render() {
		return <div>Kycs Index!</div>;
	}	
}

export default KYCIndex;
