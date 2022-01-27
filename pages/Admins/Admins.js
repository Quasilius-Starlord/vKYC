import React, { useState, useEffect } from "react";
import {FormLabel, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";

export default function Admins(props){
    const [ account, setAccount ] = useState('');
    const router=useRouter();
    const [ randomUserKyc, setrandomUserKyc ] = useState(null);

    useEffect(async()=>{
        console.log('props',props)
        let accounts = await web3.eth.getAccounts();
        if(accounts.length===0){
            console.log('no account found')
            return;
        }else{
            try{
                let kyc=await factory.methods.getDeployedKycs().call();
                const contract  = Kyc(kyc[0]);
                await contract.methods.createRequest("I want it","wfd").send({from: accounts[0]});
                const userkycdetail=await contract.methods.getparticularUser(acc).call();
                console.log(userkycdetail);
                console.log(kyc)
            }catch(err){
                console.log('no user found')
                console.log(err);
            }
            setAccount(accounts[0]);
        }
    },[]);

    return null;
}