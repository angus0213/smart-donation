import { Form, ButtonToolbar, Button, Input } from 'rsuite';
import React, { useState } from 'react';
import "rsuite/dist/rsuite.css";
import web3 from '@/ethereum/web3';
import factory from '../ethereum/factory';
import {Router} from '../routes'

const CaseForm=()=>{
    const [minimum, setMinimum]=useState("");
    const [name, setName]=useState("");
    const [fundraisingReason, setFundraisingReason]=useState("");
    const [description, setDescription]=useState("");
  
    const submitHandler=async(event)=>{
        event.preventDefault;
        if (Number(minimum)!=="NaN" && Number(minimum)>0) {
            try {
                const account= await web3.eth.getAccounts();
                await factory.methods.createCase(web3.utils.toWei(minimum,'ether'), name, fundraisingReason, description).send({from: account[0]});
                Router.pushRoute('/');
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Please input right data')
        }
        
    }
    return (
        <>
         <Form onSubmit={submitHandler}>
    <Form.Group controlId="minimum" onChange={(e)=>setMinimum(e.target.value)}>
      <Form.ControlLabel>Minimum Donation Amount</Form.ControlLabel>
      <Form.Control name="minimum" />
    </Form.Group>
    <Form.Group controlId="recipientName" onChange={(e)=>setName(e.target.value)}>
      <Form.ControlLabel>Recipient Name</Form.ControlLabel>
      <Form.Control name="recipientName"/>
    </Form.Group>
    <Form.Group controlId="fundraisingReason" onChange={(e)=>setFundraisingReason(e.target.value)}>
      <Form.ControlLabel>Fundraising Reason</Form.ControlLabel>
      <Form.Control name="fundraisingReason"/>
    </Form.Group>
    <Form.Group controlId="description" onChange={(e)=>setDescription(e.target.value)}>
      <Form.ControlLabel>Description Details</Form.ControlLabel>
      <Form.Control rows={5} name="description" accepter='textarea'/>
    </Form.Group>
    <Form.Group>
      <ButtonToolbar>
        <Button appearance="primary" type='sumbit'>Submit</Button>
        <Button appearance="default">Cancel</Button>
      </ButtonToolbar>
    </Form.Group>
  </Form>
        </>
    )
}

export default CaseForm;