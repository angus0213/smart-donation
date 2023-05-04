import React from 'react';
import {Layout, theme } from 'antd';
import styled from 'styled-components';
import { TfiWallet } from 'react-icons/tfi';
import {COLORS} from "../styles/Constants";
import { FaEthereum } from 'react-icons/fa';
import { Link, Router } from "../routes";


const PageLayout = (props) => {
  const { Header, Content, Footer } = Layout;
  const clickHandle=()=> window.ethereum.request({ method: "eth_requestAccounts" });
  const clickRouter=()=>Router.pushRoute('/cases/newcase');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <ButtonWallet onClick={clickHandle} ><MyTfiWallet/> Connect Wallet</ButtonWallet>
        <ButtonCase onClick={clickRouter} ><MyFaEthereum/> Need Donation</ButtonCase>
      </Header>
      <Content style={{ padding: '0 50px' }}>
      
        <div className="site-layout-content" style={{ background: colorBgContainer }}>
            {props.children}         
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};



const ButtonWallet=styled.button`
width:150px;
height: 30px;
font-weight: bold;
border-radius: 50px;
:hover{
  cursor: pointer;
}
position: relative;
left: 1250px;
background-color: ${COLORS.green};
border: none;
`;

const ButtonCase=styled.button`
width:150px;
height: 30px;
font-weight: bold;
border-radius: 50px;
:hover{
  cursor: pointer;
}
position: relative;
left: 1350px;
background-color: ${COLORS.lightblue};
border: none;
`;

const MyTfiWallet=styled(TfiWallet)`
position:relative;
top: 2px;
`;

const MyFaEthereum=styled(FaEthereum)`
position:relative;
top: 2px;
`;

export default PageLayout;