import web3 from "./web3";
import DonateFactory from "./setup/DonateFactory.json";

const factory = new web3.eth.Contract(
  DonateFactory.abi,
  "0xDc0BA3120f17D99087121058E4cd6Afb2f4BbDBf"
);

export default factory;
