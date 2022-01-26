import React, { useState, useEffect } from "react";
import {FormLabel, Button, Form } from 'react-bootstrap';
import Router,{ useRouter } from "next/router";

import factory from '../ethereum/factory';
import Kyc from '../ethereum/kyc';
import web3 from '../ethereum/web3';
import Home from "./Home/Home";
import KYCForm from "./FormRegister/Register";


function KYCIndex(props){
    const [ account, setAccount ] = useState('');
    //const [ kyc, setKyc ] = useState('');
    const router = useRouter();

    useEffect(async()=>{
        let accounts = await web3.eth.getAccounts();
        console.log('from index')
        //let kyc = await factory.methods.login(accounts[0]).call();

        if(accounts === []){
            console.log('no account found');
            return;
        }else{
            accounts=accounts[0];
        }
        console.log(accounts)
        setAccount(accounts);
        router.push('/Home/Home')
    },[])


    return null;
}

export default KYCIndex;


