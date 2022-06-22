import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {FormLabel, Button, Container, Row } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import factory from '../../ethereum/factory';
import Kyc from '../../ethereum/kyc';
import web3 from '../../ethereum/web3';
import { useRouter } from "next/router";
import Auxil from './../Auxilary/Auxil'
import axios from 'axios';
import Meeting from './Meeting';
import {PuffLoader, PulseLoader} from 'react-spinners';
import Head from 'next/head';

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
    const [ waiting, setWaiting ] = useState(false);


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
                // const req = await contract.methods.getRequest().call();
                //const app = await contract.methods.approveRequest().send({from: accounts[0]});
                const ass = await contract.methods.assigned().call();
                console.log('ass',ass);
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
            setWaiting(true);
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
        }finally{
            setWaiting(false);
        }
    }

    const viewRequests=async(e) => {
        try{
            setWaiting(true);
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
            // console.log(reqs);
        } catch(e) {
            console.log('No requests');
        }finally{
            setWaiting(false);
        }
    }

    return(
    	<div style={{display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Redressed&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap" rel="stylesheet"/>
            </Head>
            <Container style={{width:'50%',paddingBottom:'70px', margin:'auto',fontSize:'1.2em'}}>
                <div className='mb-3' style={{fontSize:'4.5rem',textAlign:'center',marginTop:'5%',letterSpacing:'5px',fontFamily:['Redressed','cursive']}}>Ethereum KYC</div>
                <div className='mb-3' style={{color:'#12505A',fontSize:'3.5rem',textAlign:'center',marginTop:'2%',fontFamily:['Redressed','cursive']}}>Your KYC Details</div>
                <Row className='mb-3'>Name: {name ? name : (<PulseLoader css={`width: fit-content;`} size={'10px'} margin={'10px'} />)}</Row>
                <Row className='mb-3'>Father's name: {fatherName ? fatherName : (<PulseLoader css={`width: fit-content;`} size={'10px'} margin={'10px'} />)}</Row>
                <Row className='mb-3'>Mother's name: {motherName ? motherName : (<PulseLoader css={`width: fit-content;`} size={'10px'} margin={'10px'} />)}</Row>
                <Row className='mb-3'>Address: {address ? address : (<PulseLoader css={`width: fit-content;`} size={'10px'} margin={'10px'} />)}</Row>
                <Row className='mb-3'>Mobile Number: {number ? number : (<PulseLoader css={`width: fit-content;`} size={'10px'} margin={'10px'} />)}</Row>
                <Row className='mb-3'>Date of Birth: {DOB ? DOB : (<PulseLoader css={`width: fit-content;`} size={'10px'} margin={'10px'} />)}</Row>
                <Row className='mb-3'>Email address: {email ? email : (<PulseLoader css={`width: fit-content;`} size={'10px'} margin={'10px'} />)}</Row>
                <Row className='mb-3' style={{fontFamily:['Cinzel']}}>
                    {
                        !displayCardDetails ? (<div style={{textAlign:'center'}}><Button style={{width:'28%',fontSize:'1.4rem'}} variant='secondary' onClick={e=>displayCards(e)}>View Cards</Button></div>) : (
                            <Auxil>
                                <Row style={{fontWeight:600,fontSize:'2rem',justifyContent:'center'}}>Card Details</Row>
                                <Row style={{margin:'15px 0px',border:'2px dashed black',paddingTop:'10px',paddingBottom:'10px',borderRadius:'7px'}}>Aadhar Card Number: {aadhaNumber} <a target={'_blank'} href={`https://ipfs.io/ipfs/${aadharIPFS.current}`}>View Aadhar Card</a></Row>
                                <Row style={{margin:'15px 0px',border:'2px dashed black',paddingTop:'10px',paddingBottom:'10px',borderRadius:'7px'}}>PAN Card Number: {PANNumber} <a target={'_blank'} href={`https://ipfs.io/ipfs/${PANIPFS.current}`}>View PAN Card</a></Row>
                            </Auxil>
                        )
                    }
                </Row>
                <Row className='mb-3' style={{fontFamily:['Cinzel']}}>
                    {
                        !displayRequests ? (<div style={{textAlign:'center'}}><Button style={{width:'28%',fontSize:'1.4rem'}} variant='secondary' onClick={e=>{viewRequests(e)}}>View Requests</Button></div>) : 
                        <Meeting waiting={waiting} setWaiting={setWaiting} setMeeting={setMeet} meeting={meet} meetlink={meetlink} meetTime={meetTime} pending={meetPending} account={account} setMeetPending={setMeetPending} />
                    }
                </Row>
                <Row className='mb-3' style={{fontFamily:['Redressed'],fontSize:'2.5rem',textTransform:'capitalize',justifyContent:'center',textAlign:'center',letterSpacing:'4px'}}>Thank You for Registering with us!</Row>
                <Row><div style={{textAlign:'center',fontFamily:['Cinzel']}}><Button style={{fontSize:'1.4rem'}} variant='info' onClick={e=>{router.push('/Home/')}}>Back to Home</Button></div></Row>
            </Container>
            {
                waiting ? (
                    <div style={{position:'absolute',width:'100%',display:'flex',justifyContent:'center',alignItems:'center',height:'100%',backgroundColor:'rgb(157, 224, 224,0.8)'}}>
                        <PuffLoader css={`position: fixed;left: 50%;top: 50%;transform: translate(-50%,-50%);`} loading={true} size={150} />
                    </div>
                ) : null
            }
        </div>
    );
}