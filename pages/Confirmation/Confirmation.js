import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {FormLabel, Button, Container, Row } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";
import Auxil from './../Auxilary/Auxil'

export default function Confirmation(props){
    const [ aadhaNumber, setAadharNumber ] = useState(null);
    const [ PANNumber, setPANNumber ] = useState(null);
    const [ name, setName ] = useState('');
    const [ fatherName, setFatherName ] = useState('');
    const [ motherName, setMotherName ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ number, setNumber ] = useState('');
    const [ DOB, setDOB ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ account, setAccount ] = useState('');
    const aadharIPFS = useRef('');
    const PANIPFS = useRef('');
    const [ kycContractAddress, setKycContractAddress ] = useState('');
    const [ displayCardDetails, setDisplayCardDetails ] = useState(false);

    const router = useRouter();
    
    useEffect(async()=>{
        console.log('props',props)
        let accounts = await web3.eth.getAccounts();
        let acc=null;
        if(accounts===[]){
            console.log('no account found');
            return;
        }else{
            acc=accounts[0];
            setAccount(accounts[0])
        }
        console.log(accounts,'accounts');
        try{
            let kycaddress=await factory.methods.login(acc).call();
            console.log(kycaddress,'kyc address')
            if(kycaddress!==""){
                setKycContractAddress(kycaddress);
                const contract=Kyc(kycaddress);
                const userkycdetail=await contract.methods.getparticularUser(acc).call();
                setName(userkycdetail[0]);
                setFatherName(userkycdetail[1]);
                setMotherName(userkycdetail[2]);
                setDOB(userkycdetail[3]);
                setAddress(userkycdetail[4]);
                setNumber(userkycdetail[5]);
                setEmail(userkycdetail[6]);
                console.log(userkycdetail)
            }else{
                return;
            }
        }catch(e){
            console.log('login not found please login first')
            console.log(e);
        }
    },[]);

    const displayCards=async e=>{
        try{
            const contract=Kyc(kycContractAddress);
            const cards=await contract.methods.getAadharPan(account).call();
            const cardLinks=await contract.methods.getAadharPanHash(account).call();
            setAadharNumber(cards[0]);
            setPANNumber(cards[1]);
            aadharIPFS.current=cardLinks[0];
            PANIPFS.current=cardLinks[1];
            setDisplayCardDetails(true)
            console.log(cards,cardLinks);
        }catch(e){
            console.log(e);
        }
    }
    return(
        <Container style={{width:'50%', margin:'auto',fontSize:'1.2em'}}>
            <h3>You've registered with following Details</h3>
            <Row>Name: {name}</Row>
            <Row>Father's name: {fatherName}</Row>
            <Row>Mother's name: {motherName}</Row>
            <Row>Address: {address}</Row>
            <Row>Mobile Number: {number}</Row>
            <Row>Date of Birth: {DOB}</Row>
            <Row>Email address: {email}</Row>
            {
                !displayCardDetails ? (<Button variant='secondary' onClick={e=>displayCards(e)}>View Cards</Button>) : (
                    <Auxil>
                        <Row>Card Details</Row>
                        <Row>Aadhar Card Number: {aadhaNumber} <a target={'_blank'} href={`https://ipfs.io/ipfs/${aadharIPFS.current}`}>View Aadhar Card</a></Row>
                        <Row>PAN Card Number: {PANNumber} <a target={'_blank'} href={`https://ipfs.io/ipfs/${PANIPFS.current}`}>View PAN Card</a></Row>
                    </Auxil>
                )
            }
            <Row>Thank You for Registering with us!</Row>
            <Button variant='info' onClick={e=>{router.push('/Home/Home')}}>Back to Home</Button>
        </Container>
    );
}