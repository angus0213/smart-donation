import web3 from "./web3";
import Donate from "./setup/Donate.json"

const donate = (address) => {
  return new web3.eth.Contract(Donate.abi, address);
};
export default donate;
