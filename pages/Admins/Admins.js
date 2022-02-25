import React, { useState, useEffect, useRef } from "react";
import {FormLabel, Button, Form, Card, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import web3 from './../../ethereum/web3';
import { useRouter } from "next/router";
import Auxil from './../Auxilary/Auxil'
import axios from "axios";
import {PuffLoader, PulseLoader} from 'react-spinners';

const admins=['0x59344a4EDBB68763fbc0f92e2cefB7d41Bd31f8B','0xA6e14e16C49163dC164693d5AaD606DB4a445156'];

function isAdmin(userAcc){
    return admins.find(element=>element==userAcc);
}

export default function Admins(props){
    const [ account, setAccount ] = useState('');
    const router=useRouter();
    const [ selectedRandomUser, setSelectedRandomUser ] = useState('');
    const meetLink = useRef('')
    const randomUser = useRef(null);
    const [ preMeetings, setPreMeetings ] = useState(false);
    const [ waiting, setWaiting ] = useState(false);
    const allMeetings = useRef([])
    // const [ getRandomUs ]
    useEffect(async ()=>{
        console.log('props',props)
        let accounts = await web3.eth.getAccounts();
        if(accounts.length===0){
            console.log('no account found')
            return;
        }else{
            try{
                const found=isAdmin(accounts[0]);
                console.log(found)
                if(!found){
                    router.push('/')
                    return;
                }

            }catch(err){
                console.log('no user found')
                console.log(err);
            }
            console.log(accounts[0]);
            setAccount(accounts[0]);
        }
    },[]);

    const createRequest = async (e)=> {
        try {
            if(!meetLink.current){
                window.alert('meet link is empty')
                return;
            }
            setWaiting(true)
            console.log('selected',e,'meet linjk',meetLink.current);
            axios.post('http://localhost:8000/requestMeeting/',{'official':account, 'meetLink':meetLink.current, 'randomUser':e}).then(res=>res.data).then(res=>{
                console.log(res);
                randomUser.current=null;
                setSelectedRandomUser('');
                setWaiting(false)
            }).catch(err=>{
                console.error(err);
                setWaiting(false)
            })
        }catch(err){
            console.log('no user found')
            console.log(err);
            setWaiting(false)
        }
    };

    const getallmeetings = async e => {
        try{
            if(allMeetings.current.length>0)
                return;
            
            axios.post('http://localhost:8000/getallmeetings/',{'official':account}).then(res=>res.data).then(res=>{
                console.log(res)
                if(!res.response){
                    return;
                }
                res.meetings.forEach(element => {
                    let datetime=new Date(Date.parse(element.meetingTime));
                    allMeetings.current.push(<Card key={element['id']} className={'mb-3'}>
                        <Card.Header style={{backgroundColor:'#12d589'}} as="h5">Registered User</Card.Header>
                        <Card.Body>
                            <Card.Title>{`User ${element['id']}`}</Card.Title>
                            <Card.Text>
                                Appointment date: {datetime.toDateString()}, Appointment time: {datetime.toTimeString()}
                            </Card.Text>
                            <Card.Text>
                                Meeting link: {element['meetlink']}
                            </Card.Text>
                            <Button onClick={e=>{userDetails(element['user_blockchain_address'])}} variant="info">Get User Details</Button>
                        </Card.Body>
                    </Card>)
                });
                setPreMeetings(true)

            }).catch(err=>{
                console.log(err)
            })
        }catch(err){
            console.log(err)
        }
    }

    const userDetails = async(e)=> {
        console.log(e)
        try{
            setWaiting(true);
            let kyc=await factory.methods.login(e).call();
            console.log(kyc);
            const contract = Kyc(kyc);
            const assigned = await contract.methods.assigned().call();
            console.log(assigned);
            const details = await contract.methods.getUserDetails(account).call();
            console.log(details);
            setWaiting(false);
        } catch(err){
            console.log("Permission denied");
            console.log(err);
            setWaiting(false);
        }

    }
    
    const getNewUser = async () => {
        try{
            setWaiting(true);
            axios.post('http://localhost:8000/getUnappointed/',{'official':account}).then(res=>res.data).then(res=>{
                console.log(res);
                let datetime=new Date(Date.parse(res.onTime));
                console.log(datetime.toDateString(),datetime.toTimeString())
                randomUser.current=(<Card>
                        <Card.Header style={{backgroundColor:'#b8a29d'}} as="h5">Unregistered User</Card.Header>
                        <Card.Body>
                            <Card.Title>{`User ${res['id']}`}</Card.Title>
                            <Card.Text>
                                Address of the user {res['blockchain_address']}
                            </Card.Text>
                            <Card.Text>
                                Appointment date: {datetime.toDateString()}, Appointment time: {datetime.toTimeString()}
                            </Card.Text>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meet Link</Form.Label>
                                    <Form.Control required={true} type='text' onChange={e=>{meetLink.current=e.target.value}} placeholder={'link'} />
                                </Form.Group>
                            </Form>
                            <Button onClick={e=>{createRequest(res['blockchain_address'])}} variant="info">Send Request</Button>
                             
                        </Card.Body>
                    </Card>)
                console.log(res['blockchain_address']);
                setSelectedRandomUser(res['blockchain_address']);
                setWaiting(false);
            }).catch(err=>{
                console.log(err);
                setWaiting(false);
            });
        }catch(err){
            console.log(err);
            setWaiting(false);
        }finally{
        }
    }
    getallmeetings();
    console.log(allMeetings.current, preMeetings)
    return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',position:'relative',minHeight:'100vh'}}>
            <Container style={{padding:'20px 0px'}}>
                {allMeetings.current.map(e=>e)}
                {randomUser.current}
                <div style={{padding:'20px 0px',flexDirection:'row',justifyContent:'space-between',display:'flex'}}>
                    <Button variant="info" onClick={e=>getNewUser()}>Get New User</Button>
                    <Button variant="info" onClick={e=>userDetails()}>Get User Details</Button>
                </div>
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