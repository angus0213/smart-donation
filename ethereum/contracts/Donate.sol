// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract DonateFactory {
    address payable[] public deployedCase;

    function createCase(
        uint _minimum,
        string memory _recipientName,
        string memory _fundraisingReason,
        string memory _description
    ) public {
        address newCase = address(
            new Donate(
                _minimum,
                _recipientName,
                _fundraisingReason,
                _description,
                msg.sender
            )
        );
        deployedCase.push(payable(newCase));
    }

    function getDeployedCases() public view returns (address payable[] memory) {
        return deployedCase;
    }
}

contract Donate {
    struct SpendRequest {
        string description;
        uint value;
        bool finish;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    SpendRequest[] public spendRequests;
    address public recipient;
    uint public minimumContribution;
    string public recipientName;
    string public fundraisingReason;
    string public description;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == recipient);
        _;
    }

    constructor(
        uint _minimumAmount,
        string memory _recipientName,
        string memory _fundraisingReason,
        string memory _description,
        address _creator
    ) {
        minimumContribution = _minimumAmount;
        recipientName = _recipientName;
        fundraisingReason = _fundraisingReason;
        description = _description;
        minimumContribution = _minimumAmount;
        recipient = _creator;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createSpendRequest(
        string memory _description,
        uint _value
    ) public restricted {
        SpendRequest storage newSpendRequest = spendRequests.push();
        newSpendRequest.description = _description;
        newSpendRequest.value = _value;
        newSpendRequest.finish = false;
        newSpendRequest.approvalCount = 0;
    }

    function approveSpendRequest(uint _index) public {
        SpendRequest storage spendRequest = spendRequests[_index];

        require(approvers[msg.sender]);
        require(!spendRequest.approvals[msg.sender]);

        spendRequest.approvals[msg.sender] = true;
        spendRequest.approvalCount++;
    }

    function endSpendRequest(uint _index) public restricted {
        SpendRequest storage spendRequest = spendRequests[_index];

        require(spendRequest.approvalCount > (approversCount / 2));
        require(!spendRequest.finish);

        payable(recipient).transfer(spendRequest.value);
        spendRequest.finish = true;
    }

    function getSummary()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint,
            uint,
            uint,
            uint,
            address
        )
    {
        return (
            recipientName,
            fundraisingReason,
            description,
            minimumContribution,
            address(this).balance,
            spendRequests.length,
            approversCount,
            recipient
        );
    }

    function getSpendRequestsCount() public view returns (uint) {
        return spendRequests.length;
    }
}
