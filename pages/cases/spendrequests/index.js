import donate from "@/ethereum/donate";
import { Table, Avatar } from "antd";
import styled from "styled-components";
import { COLORS } from "@/styles/Constants";
import web3 from "@/ethereum/web3";
import { useState } from "react";
import { Link,Router } from "../../../routes"

const spendRequest = (requestDetails) => {
  const [approveStatus, setApproveStatus] = useState(false);
  const [sendStatus, setSendStatus] = useState(false);
console.log(approveStatus);
  const data = requestDetails.requests.map((request, index) => {
    return {
      ID: index + 1,
      Description: request.description,
      Amount: web3.utils.fromWei(request.value, "ether"),
      ApprovalCount: `${request.approvalCount} / ${requestDetails.approversCount}`,
    };
  });

  // get the right data that need to input in the wallet table

  const columns = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      sorter: (a, b) => a - b,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      sorter: (a, b) =>
        a["Description"].charCodeAt(0) - b["Description"].charCodeAt(0),
    },
    {
      title: "Amount (ether)",
      dataIndex: "Amount",
      key: "Amount",
      sorter: (a, b) => a - b,
    },

    {
      title: "Approval Count",
      dataIndex: "ApprovalCount",
      key: "ApprovalCount",
      sorter: (a, b) => a - b,
    },
    {
      dataIndex: "Approve Request",
      key: "Approve",
      //   width: "10%",
      render: (text, record) => (
        <Button
          onClick={async () => {
            const account = await web3.eth.getAccounts();
            await donate(requestDetails.address)
              .methods.approveSpendRequest(record.ID - 1)
              .send({ from: account[0] });
            Router.replaceRoute(
              `/cases/${requestDetails.address}/spendrequests`
            );
            setApproveStatus(true);
          }}
        disabled={approveStatus}>
          {"Approve"}
        </Button>
      ),
    },
    {
      dataIndex: "Send to Recipient",
      key: "Send",
      //   width: "10%",
      render: (text, record) => (
        <Button
          onClick={async () => {
            const account = await web3.eth.getAccounts();
            await donate(requestDetails.address)
              .methods.endSpendRequest(record.ID - 1)
              .send({ from: account[0] });
            Router.replaceRoute(
              `/cases/${requestDetails.address}/spendrequests`
            );
            setSendStatus(true);
          }}
        
        disabled={sendStatus}>
          {"Send to Recipent"}
        </Button>
      ),
    },
  ];

  return (
    <Div>
      <Table
        dataSource={data}
        columns={columns}
        rowClassName={"row"}
        pagination={{ pageSize: 15 }}
      />
      <Link route={`/cases/${requestDetails.address}/spendrequests/newrequest`}>
        <button>Add Request</button>
      </Link>
    </Div>
  );
}; // setup wallet table

const MyTable = styled(Table)`
  width: 500px;
  position: absolute;
  top: 130px;
  background-color: ${COLORS.grey};
  z-index: 0;
  .row {
    color: ${COLORS.black};
    background-color: ${COLORS.grey};
  }
`;

const Div = styled.div`
  width: 800px;
`;

const Button = styled.button`
  border-radius: 15px;
  width: 100px;
  color: ${COLORS.grey};
  padding: 3px;
  background-color: ${COLORS.blue};
`;

spendRequest.getInitialProps = async (props) => {
  const { address } = props.query;
  const requestCount = await donate(address)
    .methods.getSpendRequestsCount()
    .call();
  const approversCount = await donate(address).methods.approversCount().call();
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((request, index) => {
        return donate(address).methods.spendRequests(index).call();
      })
  );

  const requestDetails = {
    address: address,
    requests: requests,
    approversCount: approversCount,
    requestCount: requestCount,
  };
  return requestDetails;
};

export default spendRequest;
