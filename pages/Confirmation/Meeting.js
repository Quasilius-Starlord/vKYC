import React from 'react';
import { useState, useEffect } from 'react';
import Auxil from './../Auxilary/Auxil'
import axios from 'axios';
import { Button, Container, Row } from 'react-bootstrap';

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
            // const contract = Kyc(kycContractAddress);
            // await contract.methods.approveRequest().send({from: account});
            axios.post('http://localhost:8000/approverequest/',{'user':props.account}).then(res=>res.data).then(res=>{
                console.log(res)
                if(res.response){
                    props.setMeetPending(false)
                }
            }).catch(err=>{
                console.log(err)
            })

            console.log('approved');
        } catch(e) {
            console.log("Problem");
            console.log(e);
        }
    }

    const declinedRequest=async e => {
        try{
            // const contract = Kyc(kycContractAddress);
            // await contract.methods.approveRequest().send({from: account});
            axios.post('http://localhost:8000/deleterequest/',{'user':props.account}).then(res=>res.data).then(res=>{
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
        }
        
    }

    return(
        <Auxil>
            <Row className='mb-3'>Meeting Link: {props.meetlink}</Row>
            <Row className='mb-3'>Meeting Date: {props.meetTime.toLocaleDateString(undefined,{dateStyle:"full"})} Meeting Time: {props.meetTime.toLocaleTimeString()}</Row>
            {
                props.pending ? (
                    <Auxil>
                        <Row className='mb-3'><Button onClick={e=>{approveRequest(e)}}>Approve request</Button></Row>
                        <Row className='mb-3'><Button onClick={e=>{declinedRequest(e)}}>Decline request</Button></Row>
                    </Auxil>
                ) : (
                    <Row>Meeting has been set</Row>
                )
            }
            
        </Auxil>
    )
}