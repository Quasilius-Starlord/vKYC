import React from 'react';
import { useState, useEffect } from 'react';
import {FormLabel, Button, Form } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";


export default function KYCForm(props){
    const [ aadharFile, setAadharFile ] = useState(null);
    const [ PANFile, setPANFile ] = useState(null);
    const [ name, setName ] = useState('');
    const [ fatherName, setFatherName ] = useState('');
    const [ motherName, setMotherName ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ number, setNumber ] = useState('');
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
    },[])

    let submitHandler=async e => {
        e.preventDefault();
        let accounts = account;
        const kyc = kycContractAddress;
        const contract = Kyc(kyc);
        //const userkycdetail = await contract.methods.getparticularUser(accounts).call();
        //console.log(userkycdetail)
        // if(aadharFile!==null && PANFile!==null){
        if(true){
            try{
                console.log(name,fatherName,motherName,DOB,address,number,'rathoplexian007@gmail.com',7894561230,'whatever pan number')
                const res=await contract.methods.addUser(name,fatherName,motherName,DOB,address,number,'rathoplexian007@gmail.com',7894561230,'whatever pan number').send({from: accounts});
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
                    <Form.Control value={name} type='text' onChange={e => {setName(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Fathter Name</Form.Label>
                    <Form.Control value={fatherName} type='text' onChange={e => {setFatherName(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mother Name</Form.Label>
                    <Form.Control value={motherName} type='text' onChange={e => {setMotherName(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control value={address} type='text' onChange={e => {setAddress(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control value={number} type='text' onChange={e => {setNumber(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type='date' value={DOB} onChange={e => {setDOB(e.target.value); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Aadhar Card</Form.Label>
                    <Form.Control type='file' accept='.pdf' onChange={e => {setAadharFile(e.target.files[0]); }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>PAN</Form.Label>
                    <Form.Control type='file' accept='.pdf' onChange={e => {setPANFile(e.target.files[0]); }}/>
                </Form.Group>
                <Form.Group className="text-center">
                    <Button variant="primary" type="submit">Submit</Button>
                </Form.Group>
            </Form>
        </div>
    )
}