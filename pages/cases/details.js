import donate from "@/ethereum/donate";
import web3 from "@/ethereum/web3";
import { Card } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { Link,Router } from "../../routes"

const details = (caseDetail) => {
  const {summary,contractAddress}=caseDetail;
  const [donateAmount, setDonateAmount]=useState("");
  const submitHandler=async(event)=>{
    event.preventDefault();
    try{
    const account=await web3.eth.getAccounts();
    await donate(contractAddress).methods.contribute().send({from:account[0], value: web3.utils.toWei(donateAmount, 'ether')});
    Router.replaceRoute(`/cases/${contractAddress}`);
    setDonateAmount('');
  }
    catch(err){
      console.log(err);
    }
    
  }
  return (
    <Wrapper>
      <Card title={"Fundraising Details"} bordered={false} style={{ width: 750 }}>
        <p><span>Name: </span><span>{summary[0]}</span></p>
        <p><span>Reason for Fundraising: </span><span>{summary[1]}</span></p>
        <p><span>Detais: </span><span>{summary[2]}</span></p>
        <p><span>Minimum Donation Acception (ether): </span><span>{web3.utils.fromWei(summary[3], 'ether')}</span></p>
        <p><span>Donation Balance (ether): </span><span>{web3.utils.fromWei(summary[4], 'ether')}</span></p>
        <p><span>Number of Spend Requests: </span><span>{summary[5]}</span></p>
        <p><span>Number of Approvers: </span><span>{summary[6]}</span></p>
        <p><span>Recipient Address: </span><span>{summary[7]}</span></p>
        <Link route={`/cases/${contractAddress}/spendrequests`}>
        <button onClick={()=>{}}>View Spend Requests</button>
        </Link>
      </Card>
      <Form onSubmit={submitHandler}>
        <label>Make Donation (ether) </label>
    <input onChange={(e)=>setDonateAmount(e.target.value)} value={donateAmount}/>
    <button>Submit</button>
    </Form>
    </Wrapper>
  );
};

details.getInitialProps = async (props) => {
  const donateCase = donate(props.query.address);

  const summary = await donateCase.methods.getSummary().call();
  const caseDetail={summary:summary, contractAddress:props.query.address}
  return caseDetail;
};

const Wrapper=styled.div`
    display: flex;
`;

const Form=styled.form`
    position:relative;
    left: 300px;
    top:100px;
`;
export default details;
