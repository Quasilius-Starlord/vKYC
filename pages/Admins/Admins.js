import React, { useState, useEffect } from "react";
import {FormLabel, Button, Form, Card, Container } from 'react-bootstrap';
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
                console.log(kyc);
                const contract  = Kyc(kyc[0]);
                try{
                    const req = await contract.methods.getRequest().call();
                    console.log(req);
                } catch(e) {
                    await contract.methods.createRequest("I want it","wfd").send({from: accounts[0]});
                    console.log("Req created")
                }
                
                const userkycdetail=await contract.methods.getparticularUser(accounts[0]).call();
                console.log(userkycdetail);
                console.log(kyc)
            }catch(err){
                console.log('no user found')
                console.log(err);
            }
            setAccount(accounts[0]);
        }
    },[]);

    return (
        <Container>
            <Card>
                <Card.Header as="h5">Featured</Card.Header>
                <Card.Body>
                    <Card.Title>Name of user</Card.Title>
                    <Card.Text>
                        details of user
                    </Card.Text>
                    <Button onClick={e=>{console.log('send request')}} variant="info">Send Request</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}