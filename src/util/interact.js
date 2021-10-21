import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider);
const contractABI = require("../contract-abi.json");
const contractAddress = "0xb26282d4CE9839e13Ba732fdA13Ef9d915eeD51D";
const contract = new web3.eth.Contract(contractABI, contractAddress);


export const connectWallet = async () => {
  if (window.ethereum) {

    //switch if not connect to required network
    const chainId = await web3.eth.getChainId();
    console.log("chain id is " + chainId);
    if (chainId != 80001) {
      //add in try block to handle if network to switch doesn't exist
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      });
    }
    console.log("Switched network");

    // connect site to metamask
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
        connected: true
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


export const mintNFT = async () => {

  const chainId = await web3.eth.getChainId();
  console.log("chain id is " + chainId);
  if (chainId != 80001) {
    //add in try block to handle if network to switch doesn't exist
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }],
    });
  }
  console.log("Switched network");


  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: web3.utils.toHex(1e16),//0.01 of selected network main token
    data: contract.methods
      .claim()
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });


//TODO: get id from lasted nft minted and then call tokenURI method to display NFT.

    const id = await contract.methods.getLastMintedId( window.ethereum.selectedAddress).call();
    console.log("Last Minted Id" ,id);

    const uri = await contract.methods.tokenURI(id).call();
    console.log(uri);

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
