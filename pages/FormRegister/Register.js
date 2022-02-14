import React from 'react';
import { useState, useEffect } from 'react';
import {FormLabel, Button, Form } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";
import ipfs from '../../ethereum/ipfs';
import axios from 'axios';

export default function KYCForm(props){
    const [ aadharFile, setAadharFile ] = useState(null);
    const [ aadharNumber, setAadharNumber ] = useState('');
    const [ PANNumber, setPANNumber ] = useState('');
    const [ PANFile, setPANFile ] = useState(null);
    const [ name, setName ] = useState('');
    const [ fatherName, setFatherName ] = useState('');
    const [ motherName, setMotherName ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ number, setNumber ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ DOB, setDOB ] = useState('');
    const [ account, setAccount ] = useState('');
    const [ kycContractAddress, setKycContractAddress ] = useState('');
    const router = useRouter();
    
    useEffect(async()=>{
        console.log('props',props)
        let accounts = await web3.eth.getAccounts();
        let account=null;
        if(accounts===[]){
            console.log('no account found')
            return;
        }else{
            account=accounts[0];
            setAccount(accounts[0])
        }
        try{
            console.log('done')
            let kycaddress=await factory.methods.login(account).call();
            if(kycaddress!==""){
                setKycContractAddress(kycaddress);
            }else{
                return;
            }
        }catch(e){
            console.log('login not found please login first')
            console.log(e);
        }
    },[]);

    const setBufferArray = async (file, setter) => {
        const reader=new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend=()=>{
            setter(Buffer(reader.result));
        }
    }

    let submitHandler=async e => {
        e.preventDefault();
        let accounts = account;
        const kyc = kycContractAddress;
        const contract = Kyc(kyc);
        if(aadharNumber.length!=12){
            window.alert('Invalid Aadhar Number');
            return;
        }
        if(PANNumber.length!=10){
            window.alert('Invalid PAN Number');
            return;
        }
        console.log(aadharFile, PANFile);
        if(PANFile && aadharFile){
            let aadharHash=null;
            let PANHash=null;
            let response=null;
            try{
                response=await ipfs.files.add(aadharFile);
                aadharHash=response[0].hash;
                response=await ipfs.files.add(PANFile);
                PANHash=response[0].hash;
            }catch(err){
                console.log(err);
                console.log('some error forund while uploading to ipfs');
                return;
            }
            try{
                if(!aadharHash || !PANHash)
                    throw 'some error in ipfs hash';
                console.log(aadharHash,PANHash,'ipfs hash of aadhar and pan');
                console.log(name,fatherName,motherName,DOB,address,number,email,aadharHash,aadharNumber,PANNumber,PANHash)
                const res=await contract.methods.addUser(name,fatherName,motherName,DOB,address,number,email,aadharNumber,PANNumber,aadharHash,PANHash).send({from: accounts});
                let data={};
                data['blockchain_address']=account;
                axios.post('http://localhost:8000/uploadDocs/',data).then(e=>{
                    console.log('data sent',e);
                }).catch(err=>{
                    console.log(err)
                })
                console.log('user data has been added',res);
                router.push('/Confirmation/Confirmation')
            }catch(err){
                console.log(err);
                console.log('some error has occored while adding data of user');
                
            }
        }
    }

    //name
    //father name
    //mother name
    // address
    // dob
    return(
        <div style={{width:'50%', margin:'auto'}}>
            <Form onSubmit={e => submitHandler(e) }>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required={true} value={name} type='text' onChange={e => {setName(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Fathter Name</Form.Label>
                    <Form.Control required={true} value={fatherName} type='text' onChange={e => {setFatherName(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mother Name</Form.Label>
                    <Form.Control required={true} value={motherName} type='text' onChange={e => {setMotherName(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control required={true} value={address} type='text' onChange={e => {setAddress(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required={true} value={email} type='email' onChange={e => {setEmail(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control required={true} value={number} type='text' onChange={e => {setNumber(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control required={true} type='date' value={DOB} onChange={e => {setDOB(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Aadhar Card</Form.Label>
                    <Form.Control required={true} type='file' accept='.pdf' onChange={e => {setBufferArray(e.target.files[0],setAadharFile); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Aadhar Card Number</Form.Label>
                    <Form.Control required={true} type='text' value={aadharNumber} onChange={e => {setAadharNumber(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>PAN</Form.Label>
                    <Form.Control required={true} type='file' accept='.pdf' onChange={e => {setBufferArray(e.target.files[0],setPANFile); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>PAN Card Number</Form.Label>
                    <Form.Control required={true} type='text' value={PANNumber} onChange={e => {setPANNumber(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="text-center">
                    <Button variant="primary" type="submit">Submit</Button>
                </Form.Group>
            </Form>
        </div>
    )
}