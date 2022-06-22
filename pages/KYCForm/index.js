import React from 'react';
import { useState } from 'react';
import {FormLabel, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

export default function KYCForm(props){
    const [ aadharFile, setAadharFile ] = useState(null);
    const [ PANFile, setPANFile ] = useState(null);
    const [ name, setName ] = useState('');
    const [ fatherName, setFatherName ] = useState('');
    const [ motherName, setMotherName ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ number, setNumber ] = useState('');
    const [ DOB, setDOB ] = useState('');
    const [ buffer, setBuffer ] = useState(null);
    let submitHandler=async e => {
        e.preventDefault();
        if(aadharFile!==null && PANFile!==null){
            await props.uploadForKYC();
            // console.log(aadharFile.name, PANFile.name);
            // const formData=new FormData();
            // formData.append('aadhar', aadharFile, aadharFile.name);
            // formData.append('pan', PANFile, PANFile.name);
            // axios.post('http://localhost:8000/uploadDocs/',formData,{
            //     headers:{
            //         'Content-Type':'multipart/form-data'
            //     }
            // }).then(e => console.log(e))
        }
    }

    const captureFile=(event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = ()=> {
            setBuffer(Buffer(reader.result));
        }
    }

    //name
    //father name
    //mother name
    // address
    // dob
    return(
        <div style={{width:'50%'}}>
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