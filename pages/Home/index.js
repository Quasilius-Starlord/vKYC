import React, { useState, useEffect } from "react";
import {FormLabel, Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import factory from '../../ethereum/factory';
import Kyc from '../../ethereum/kyc';
import web3 from '../../ethereum/web3';
import { useRouter } from "next/router";
import PuffLoader from 'react-spinners/PuffLoader';

const admins=['0x59344a4EDBB68763fbc0f92e2cefB7d41Bd31f8B','0xA6e14e16C49163dC164693d5AaD606DB4a445156'];

function Home(props){
    const [ account, setAccount ] = useState('');
    const [ waiting, setWaiting ] = useState(false);
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
    },[]);
    console.log('accounts',account);

    const createKycSubmit = async(e)=>{
        setWaiting(true);
        console.log('creating KYC');
        let accounts = account
        try{
        	let kyc = await factory.methods.login(accounts).call();
            const contract = Kyc(kyc);
            try{
                const userDetails = await contract.methods.getparticularUser(accounts).call();
                console.log("You are already registered");
                router.push('/Confirmation/');
            }
            catch (e){
                console.log("You need to provide details");
                router.push('/FormRegister/');
            }
        }catch(e){
            try{
                await factory.methods.createKyc().send({
                    from: accounts
                });
                router.push('/FormRegister/');
            }catch(e){
                console.log('rejected payment');
                setWaiting(false);e
            }
        }
        // I need to check here once whether the user has already created kyc or not. for now i am just redirecting
    };

    const loginToKyc= async(e) => {
        console.log('applying for kyc');
        setWaiting(true);
        let accounts = account;
        try{
            let kyc = await factory.methods.login(accounts).call();
            const contract = Kyc(kyc);
            try{
                const userDetails = await contract.methods.getparticularUser(accounts).call();
                router.push('/Confirmation/');
            }
            catch (e){
                console.log("You need to provide details");
                router.push('/FormRegister/');
            }
            console.log("You are already registered");
        }catch(e){
            setWaiting(false);
            console.log('user not registered for kyc creation');
        }
    };
    if(isAdmin){
        router.push('/Admins/');
    }

    return(
    	<div style={{display:'flex',justifyContent:'space-evenly',flexDirection:'column',alignItems:'center',position:'relative',minHeight:'100vh'}}>
            <div style={{width:'70%', textAlign:'center'}}>
                <h1>Etherem Virtual KYC</h1>
                <h5>Install <a href="https://metamask.io/download/" target={'_blank'}>Meta Mask wallet</a> extention to use our services.</h5>
            </div>
            <div style={{width:'50%'}}>
                <Form onSubmit={e=>e.preventDefault()}>
                    <Form.Group style={{display:'flex', justifyContent:'space-between'}}>
                        <Button style={{backgroundColor:'#0fcead',border:'none'}} onClick={e=>{createKycSubmit(e)}} size="lg">Create KYC</Button>
                        <Button style={{backgroundColor:'#0fcead',border:'none'}} onClick={e=>{loginToKyc(e)}} size="lg">Login</Button>
                    </Form.Group>
                </Form>
            </div>
            {/* <Container style={{width:'65%',alignSelf:'center', height:'100%',flexDirection:'column', justifyContent:'space-around'}}>
            </Container> */}
            {
                waiting ? (
                    <div style={{position:'absolute',width:'100%',display:'flex',justifyContent:'center',alignItems:'center',height:'100%',backgroundColor:'rgb(157, 224, 224,0.8)'}}>
                        <PuffLoader loading={true} size={150} />
                    </div>
                ) : null
            }
        </div>
    );
}

export default Home;
