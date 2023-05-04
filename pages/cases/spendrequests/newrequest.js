import { useState } from "react";
import styled from "styled-components";
import web3 from "@/ethereum/web3";
import donate from "@/ethereum/donate";
import { Link,Router } from "../../../routes"

const newrequest=({address})=>{
    const [description, setdescription]=useState("");
    const [requestAmount, setRequestAmount]=useState("");

  const submitHandler=async(event)=>{
    event.preventDefault();
    try{
    const account=await web3.eth.getAccounts();
    await donate(address).methods.createSpendRequest(description, web3.utils.toWei(requestAmount, 'ether')).send({from:account[0]});
    Router.replaceRoute(`/cases/${address}/spendrequests`);
  }
    catch(err){
      console.log(err);
    }
}

    return (
        <>
              <Form onSubmit={submitHandler}>
        <label>Request Description </label>
    <input onChange={(e)=>setdescription(e.target.value)} />
    <label>Request Amount (ether) </label>
    <input onChange={(e)=>setRequestAmount(e.target.value)} />
    <button>Submit</button>
    </Form>

        </>
    )

}

newrequest.getInitialProps=(props)=> {
    const { address } = props.query;
    return {address};
  }

  const Form=styled.form`
    position:relative;
    left: 300px;
    top:100px;
`;

export default newrequest;