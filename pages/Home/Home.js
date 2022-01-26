import React, { useState, useEffect } from "react";
import {FormLabel, Button, Form } from 'react-bootstrap';
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '..//additional/validator';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import factory from '../../ethereum/factory';
import Kyc from '../../ethereum/kyc';
import web3 from '../../ethereum/web3';
import './Login.css';
import { Link ,useNavigate } from "react-router-dom";

function KYCIndex(props){
    const [ account, setAccount ] = useState('');
    //const [ kyc, setKyc ] = useState('');

    useEffect(async()=>{
        let accounts = await web3.eth.getAccounts();
        //let kyc = await factory.methods.login(accounts[0]).call();

        if(accounts === []){
            console.log('no account found');
            return;
        }else{
            accounts=accounts[0];
        }
        setAccount(accounts);
        //setKyc(kyc);
    },[])


    const createKycSubmit = async(e)=>{
        console.log('creating KYC');
        let accounts = account
        try{
        	let kyc = await factory.methods.login(accounts).call();
        	console.log("You are already registered");
        } catch(e){
        	await factory.methods.createKyc().send({
        		from: accounts
        	});
        	console.log("creating kyc");
        }
        // I need to check here once whether the user has already created kyc or not. for now i am just redirecting

        //let accounts = await web3.eth.getAccounts();
    };

    const loginToKyc= async(e) => {
        console.log('applying for kyc');
        let accounts = account;
		let kyc = await factory.methods.login(accounts).call();
		const con = Kyc(kyc);
		const user = await con.methods.manager().call();

		console.log(kyc);
		console.log(user);
    };

    return(
    	<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div className="Login">
                <Form onSubmit={e=>e.preventDefault()}>
                    <Form.Group className="mb-3" style={{display:'flex', justifyContent:'space-between'}}>
                        <Button variant="primary" onClick={e=>{createKycSubmit(e)}} size="lg">Create KYC</Button>
                        <Button variant="primary" onClick={e=>{loginToKyc(e)}} size="lg">Login</Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    	);
}

export default Home;

// /*class KYCIndex extends React.Component {

// 	static async getInitialProps() {
// 		const kycs = await factory.methods.getDeployedKycs().call();
// 		let accounts = await web3.eth.getAccounts();
// 		//let kyc = await factory.methods.login(accounts[0]).call();
// 		return { accounts } ;
// 	}

// 	async componentDidMount() {
// 		let accounts = await web3.eth.getAccounts();
// 		//throw new Error('I crashed!');
// 		console.log('Hey');
// 		console.log(accounts);
		
// 	}

// 	render() {
// 		return <div>Account is: {this.props.accounts}</div>;
// 	}	
// }*/


