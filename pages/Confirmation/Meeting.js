import React from 'react';
import { useState, useEffect } from 'react';
// import Auxil from './../Auxilary/Auxil'
import axios from 'axios';
import { Button, Container, Row } from 'react-bootstrap';
import factory from './../../ethereum/factory';
import Kyc from './../../ethereum/kyc';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function Meeting(props){
    console.log(props)
    if(!props.meeting){
        return (
            <Row className='mb-3'>No meeting has been set</Row>
        )
    }
    // return null;
    const approveRequest=async(e) => {
        try{
            console.log(props.setWaiting)
            props.setWaiting(true);
            axios.post('http://localhost:8000/approvemeeting/',{'user':props.account}).then(res=>res.data).then(async (res) =>{
                console.log(res['official_address'])

                if(res.response){
                    const kyc = await factory.methods.login(props.account).call(); 
                    const contract = Kyc(kyc);
                    await contract.methods.approveRequest(res['official_address']).send({from: props.account});
                    props.setMeetPending(false)
                }
                console.log('approved');
            }).catch(err=>{
                console.log('rejected')
                console.log(err)
            })
        } catch(e) {
            console.log("Problem");
            console.log(e);
        }finally{
            props.setWaiting(false);
        }
    }



    const declinedRequest=async e => {
        try{
            // const contract = Kyc(kycContractAddress);
            // await contract.methods.approveRequest().send({from: account});
            props.setWaiting(true);
            axios.post('http://localhost:8000/deletemeeting/',{'user':props.account}).then(res=>res.data).then(res=>{
                console.log(res)
                if(res.response){
                    props.setMeeting(false)
                }
            }).catch(err=>{
                console.log(err)
            })

            console.log('approved');
        } catch(e) {
            console.log("Problem");
            console.log(e);
        }finally{
            props.setWaiting(false);
        }
        
    }

    return(
        <div style={{border:'2px dashed black',paddingTop:'15px',paddingBottom:'15px',borderRadius:'7px'}}>
            <div className='mb-3'>Meeting Link: {props.meetlink}</div>
            <div className='mb-3'>Meeting Date: {props.meetTime.toLocaleDateString(undefined,{dateStyle:"full"})} Meeting Time: {props.meetTime.toLocaleTimeString()}</div>
            {
                props.pending ? (
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                        <Button variant='success' onClick={e=>{approveRequest(e)}}>Approve request</Button>
                        <Button variant='danger' onClick={e=>{declinedRequest(e)}}>Decline request</Button>
                    </div>
                ) : (
                    <div className='mb-3'>Meeting has been set</div>
                )
            }
            
        </div>
    )
}