import React, { useState, useEffect } from "react";
import {FormLabel, Button, Form, Card, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";
import Auxil from './../Auxilary/Auxil'
import axios from "axios";

const admins=['0x59344a4EDBB68763fbc0f92e2cefB7d41Bd31f8B','0xA6e14e16C49163dC164693d5AaD606DB4a445156'];

export default function Admins(props){
    const [ account, setAccount ] = useState('');
    const router=useRouter();
    const [ randomUserKyc, setrandomUserKyc ] = useState(null);

    // const [ getRandomUs ]
    useEffect(async ()=>{
        console.log('props',props)
        let accounts = await web3.eth.getAccounts();
        if(accounts.length===0){
            console.log('no account found')
            return;
        }else{
            try{
                const found=admins.find(element=>element==accounts[0])
                console.log(found)
                if(!found){
                    router.push('/')
                    return;
                }

            }catch(err){
                console.log('no user found')
                console.log(err);
            }
            setAccount(accounts[0]);
        }
    },[]);

    const listPendingRequests = async () => {

    };

    const listAcceptedRequests = async () => {

    };

    const getNewUser = async () => {
        axios.post('http://localhost:8000/getUnappointed/',{'official':account}).then(res=>JSON.parse(res)).then(res=>{
            console.log(res);
        }).catch(err=>console.log(err));
    }

    return (
        // <Auxil>
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
                {}
                <Button onClick={e=>getNewUser()}>Get New User</Button>
            </Container>
        // {/* </Auxil> */}
    );
}