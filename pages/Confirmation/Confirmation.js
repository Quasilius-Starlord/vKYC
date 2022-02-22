import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {FormLabel, Button, Container, Row } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";
import Auxil from './../Auxilary/Auxil'
import axios from 'axios';
import Meeting from './Meeting';

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
    const [ displayRequests, setDisplayRequests ] = useState(false);
    const [ meet, setMeet ] = useState(false)
    const [ meetlink, setMeetlink ] = useState('No Meet Link');
    const [ meetTime, setMeetTime ] = useState('');
    const [ meetPending, setMeetPending ] = useState(null);

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
            const contract = Kyc(kycaddress);
            try{
                const req = await contract.methods.getRequest().call();
                //const app = await contract.methods.approveRequest().send({from: accounts[0]});
                const ass = await contract.methods.assigned().call();
                console.log('ass',ass);
                console.log(req);
            } catch(e) {
                console.log(e);
            }
            
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

    const viewRequests=async(e) => {
        try{
            axios.post('http://localhost:8000/getmeetings/',{'user':account,'email':email}).then(res=>res.data).then(res=>{
                // console.log(res.meet,res.meet.meetlink, res.meet.meetingTime, res.meet.pending);
                setMeetlink(res.meet.meetlink)
                setMeetTime(new Date(Date.parse(res.meet.meetingTime)))
                setMeetPending(res.meet.pending)
                setMeet(res.response);
            }).catch(err=>{
                console.log(err)
            })
            setDisplayRequests(!displayRequests);
            console.log(reqs);
        } catch(e) {
            console.log('No requests');
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
            <Row className='mb-3'>
                {
                    !displayCardDetails ? (<Button variant='secondary' onClick={e=>displayCards(e)}>View Cards</Button>) : (
                        <Auxil>
                            <Row>Card Details</Row>
                            <Row>Aadhar Card Number: {aadhaNumber} <a target={'_blank'} href={`https://ipfs.io/ipfs/${aadharIPFS.current}`}>View Aadhar Card</a></Row>
                            <Row>PAN Card Number: {PANNumber} <a target={'_blank'} href={`https://ipfs.io/ipfs/${PANIPFS.current}`}>View PAN Card</a></Row>
                        </Auxil>
                    )
                }
            </Row>
            <Row className='mb-3'>
                {
                    !displayRequests ? (<Button variant='secondary' onClick={e=>{viewRequests(e)}}>View Requests</Button>) : 
                    <Meeting setMeeting={setMeet} meeting={meet} meetlink={meetlink} meetTime={meetTime} pending={meetPending} account={account} setMeetPending={setMeetPending} />
                }
            </Row>
            <Row>Thank You for Registering with us!</Row>
            <Button variant='info' onClick={e=>{router.push('/Home/Home')}}>Back to Home</Button>
        </Container>
    );
}