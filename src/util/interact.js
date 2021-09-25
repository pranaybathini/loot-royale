import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
const contractABI = require("../contract-abi.json");
const contractAddress = "0x84B71348D927312eb61b9605507d30BbdDbd4987";
const ids  = Array(10000).fill().map((_, index) => index + 1);


export const connectWallet = async () => {
    if (window.ethereum) {
      //switch if not connect to required network
      const chainId = await web3.eth.getChainId();
      console.log("chain id is "+chainId); 
      if(chainId!=97){
        //add in try block to handle if network to switch doesn't exist
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }],
        });
      }
      console.log("Switched network");

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



  export const mintNFT = async () => {

   //TODO: Add LOOT Asset to metamask function
   // Handle corner cases - like allow this function 10k times

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
    
    console.log(ids);
    shuffle(ids);
    let id = ids[0];

    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: web3.utils.toHex(1e17),
      data: contract.methods
        .claim(id)
        .encodeABI(),
    };
  
    try {
      
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      
      

      const uri = await contract.methods.tokenURI(id).call();
      console.log(uri);
      ids.splice(0,1);

      console.log('Remaining NFTS:', ids);

      return {
        success: true,
        status:
          "https://testnet.bscscan.com/tx/" +
          txHash,
        uri: uri,  
        id: id,
      };
    } catch (error) {
      return {
        success: false,
        status: "😥 Something went wrong: " + error.message,
        uri: '',
        id: -1,
      };
    }
  };

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  