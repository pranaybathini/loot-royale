import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider);
const contractABI = require("./contracts/contractABI.json");
const contractAddress = "0x0770e20307f712B6dBDd6f282DeBE0376a6ab7BF";
const contract = new web3.eth.Contract(contractABI, contractAddress);



export const connectWallet = async () => {
  if (window.ethereum) {

    //switch if not connect to required network
    const chainId = await web3.eth.getChainId();
    if (chainId !== 137) {
      //add in try block to handle if network to switch doesn't exist
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
      } catch (switchError) {
        if (switchError.code === 4902 ) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }],
            });
          } catch (addError) {
            window.alert("Error adding Polygon RPC to Metamask. Please add Manually.");
          }
        }
      }
    }

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
        console.log(err);
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
              <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
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
        address: "2",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "3",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};


export const mintNFT = async () => {

  const chainId = await web3.eth.getChainId();
  console.log("chain id is " + chainId);
  if (chainId !== 137) {
    //add in try block to handle if network to switch doesn't exist
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x89' }],
    });
  }
  console.log("Switched network");


  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: web3.utils.toHex(5e18),//5 of selected network main token, 1**18 == 1, 1**17 == 0.1, 1**16==0.01
    data: contract.methods
      .claim()
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    const id = await contract.methods.getLastMintedId().call();
    const uri = await contract.methods.tokenURI(id).call();

    return {
      success: true,
      status:
        "https://polygonscan.com/tx/" +
        txHash,
      uri: uri,
      id: id,
    };
  } catch (error) {
    console.log(error.code)
  
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
      uri: '',
      id: -1,
    };
  }
};



