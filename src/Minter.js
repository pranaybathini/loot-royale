import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, disconnectWallet, mintNFT } from "./util/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [id, setID] = useState("");
  const [connected, setConnected] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(async () => {
    setConnected(false);
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);

    addWalletListener();
  }, []);


  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    setConnected(true);
  };





  const onMintPressed = async () => {

    const walletResponse = await mintNFT();
    console.log('Wallet Response after mint', walletResponse);

    setSuccess(walletResponse.success);
    setMessage(walletResponse.status);
    setID(walletResponse.id);

    if (walletResponse.success) {
      var obj = JSON.parse(walletResponse.uri);
      console.log(obj.name);

      let base64 = obj.image.split(",")[1];
      console.log(base64);

      let base64ToString = Buffer.from(base64, "base64").toString();
      console.log(base64ToString);

      let svg = base64ToString;
      setStatus(svg);

      let blob = new Blob([svg], { type: 'image/svg+xml' });
      let url = URL.createObjectURL(blob);
      let image = document.createElement('img');
      image.src = url;
      image.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
    }
  };


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus(true);
        } else {
          setWallet(false);
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }


  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {(walletAddress.length > 0) ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>


      <h2>Loot your Random NFT :
  
      <button id="mintButton" onClick={onMintPressed}>
      Mint my NFT
      </button></h2>
      <br /><br />

      <div>
        {success ? 
        <div class="container">
          <div class="image"> <img src={`data:image/svg+xml;utf8,${status}`} />  </div>
          <div class="text"><p>Transaction : <a target="_blank" href={message}>NFT #{id} txn</a></p></div>
        </div>
          : 
          <div class="container">
          <div class="image"> <img src="https://previews.123rf.com/images/lkeskinen/lkeskinen1707/lkeskinen170702353/81520612-cartoon-image-of-burglar-with-loot-bag.jpg" />  </div>
          <div class="text"><p> {message}</p></div>
        </div>
          }
      </div>
      <br /><br /><br />
    </div>
  );
};


export default Minter;
