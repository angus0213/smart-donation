import React, { useEffect, useState } from 'react';
import factory from "../ethereum/factory";
import PageLayout from "../components/PageLayout";
import styled from "styled-components";
import { COLORS } from "@/styles/Constants";
import web3 from "@/ethereum/web3";
import donate from "@/ethereum/donate";
import { Card } from 'antd';
import { Link } from "../routes";


const Home=(cases)=>{
  const casesArray= Object.values(cases);
  const [caseArrayStatus, setCaseArrayStatus]=useState("");

  useEffect(()=>{
  const array=[];
  casesArray.forEach(async(address)=>{
    const summary=await donate(address).methods.getSummary().call();
    array.push({ address:address,recipientName:summary[0], fundraisingReason:summary[1], description:summary[2]});
    if(casesArray.length===array.length){
    setCaseArrayStatus(array)
    }
})
},[])


return (

  <>
  <PageLayout>
  <Img src="banner.png"/>
  <H1>Please Donate Me!</H1>
  <ContentWrapper>
 {caseArrayStatus && caseArrayStatus.map((item)=>{
  return (
   <Card title={item.address} bordered={false} style={{ width: 450 }}>
    <p>{item.recipientName}</p>
    <p>{item.fundraisingReason}</p>
    <p>{item.description}</p>
    <button>
    <Link route={`/cases/${item.address}`}>
            View Details
          </Link>
    </button>
  </Card>
  )
 })}
 </ContentWrapper>
 </PageLayout>
  </>
)
}

Home.getInitialProps=async()=> {
  const cases= await factory.methods.getDeployedCases().call();
  return cases;
}

const Img=styled.img`
width:100%;
`;

const H1=styled.h1`
  position: relative;
  top:-190px;
  left: 550px;
  color: ${COLORS.white};
  font-size: 30px;
`;

const ContentWrapper=styled.div`
display: flex;
justify-content: space-evenly;
`;


export default Home;
