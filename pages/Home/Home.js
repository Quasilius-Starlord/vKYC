import React, { useState, useEffect } from "react";
import {FormLabel, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";

const admins=['0x59344a4EDBB68763fbc0f92e2cefB7d41Bd31f8B'];

function Home(props){
    const [ account, setAccount ] = useState('');
    //const [ kyc, setKyc ] = useState('');
    const router=useRouter();
    const [ isAdmin, setIsAdmin ] = useState(false);

    useEffect(async()=>{
        console.log('props',props)
        console.log(admins)
        let accounts = await web3.eth.getAccounts();
        if(accounts.length===0){
            console.log('no account found')
            return;
        }else{
            let acc=accounts[0];
            for (let index = 0; index < admins.length; index++) {
                if(admins[index]===acc){
                    setIsAdmin(true);
                    break;
                }
            }
            setAccount(accounts[0])
        }
    },[])
    console.log('accounts',account);

    const createKycSubmit = async(e)=>{
        console.log('creating KYC');
        let accounts = account
        try{
        	let kyc = await factory.methods.login(accounts).call();
            const contract = Kyc(kyc);
            try{
                const userDetails = await contract.methods.getparticularUser(accounts).call();
                router.push('/Confirmation/Confirmation');
            }
            catch (e){
                console.log("You need to provide details");
                router.push('/FormRegister/Register');
            }
        	console.log("You are already registered");
        } catch(e){
        	await factory.methods.createKyc().send({
        		from: accounts
        	});
            router.push('/FormRegister/Register');
        }
        // I need to check here once whether the user has already created kyc or not. for now i am just redirecting
    };

    const loginToKyc= async(e) => {
        console.log('applying for kyc');
        let accounts = account;
        try{
            let kyc = await factory.methods.login(accounts).call();
            const contract = Kyc(kyc);
            try{
                const userDetails = await contract.methods.getparticularUser(accounts).call();
                router.push('/Confirmation/Confirmation');
            }
            catch (e){
                console.log("You need to provide details");
                router.push('/FormRegister/Register');
            }
            console.log("You are already registered");
        }catch(e){
            console.log('user not registered for kyc creation');
        }
    };
    if(isAdmin){
        router.push('/Admins/Admins');
    }

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

export async function getServerSideProps(context){
    let accounts = await web3.eth.getAccounts();
    // console.log(accounts)
    if(accounts === []){
        return{
            props:{
                accounts:[]
            }
        }
    }else{
        return{
            props:{
                acc:accounts
            }
        }
    }
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


