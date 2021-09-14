import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
const contractABI = require("../contract-abi.json");
const contractAddress = "0x59DAB2913703472b9572e1A81075521c20f4844e";


export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
          connected:true
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


  export const disconnectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ eth_accounts: {} }]
      })
    }
  };


  async function loadContract() {
    return new web3.eth.Contract(contractABI, contractAddress);
  }
  
  const tokenAddress = '0xd00981105e61274c8a5cd5a88fe7e037d935b513';
  const tokenSymbol = 'TUT';
  const tokenDecimals = 18;
  const tokenImage = 'http://placekitten.com/200/300';

  export const mintNFT = async (id) => {
    //If id is empty, return with error
    //Add Token
    // const wasAdded = await window.ethereum.request({
    //   method: 'wallet_watchAsset',
    //   params: {
    //     type: 'ERC20', // Initially only supports ERC20, but eventually more!
    //     options: {
    //       address: tokenAddress, // The address that the token is at.
    //       symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
    //       decimals: tokenDecimals, // The number of decimals in the token
    //     },
    //   },
    // });
    // return wasAdded;

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const uri = await contract.methods.tokenURI(1).call();
    console.log(uri);
    return uri;

  };