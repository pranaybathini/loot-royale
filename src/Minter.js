import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, disconnectWallet, mintNFT } from "./util/interact.js";
const fs = require("fs");

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

      // Check generated metadata.
      const metadata = JSON.parse(base64ToString);
      console.log(metadata);

      // Check SVG.
      const imageValue = metadata.image;
      const SVG_PREFIX = "data:image/svg+xml;base64,";
      const imageBase64 = imageValue.slice(SVG_PREFIX.length);
      let svg = Buffer.from(imageBase64, "base64").toString();

      fs.writeFileSync("test.svg", svg);
      
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
    <div>


      <div class="matter">

        <h1>Loot 2.0</h1>
        <div class="head">
          <ul>
            <li><a href="">Opensea</a></li>
            <li><a href="">Twitter</a></li>
            <li><a href="https://testnet.bscscan.com/address/0x59dab2913703472b9572e1a81075521c20f4844e">Contract</a></li>
          </ul>
        </div>
        <p>Treasure comes in most unimaginable ways. Here is the pathway that gets you to the treasure. Mint one of our treasure maps and you will be granted what you seek.</p>
        <p>Claim your random treasure map</p>
        <button id="mint" onClick={onMintPressed}>Mint</button>
        <br/>
        {success ?
          <div class="container">
            <div class="image"> <img src={`data:image/svg+xml;utf8,${status}`} />  </div>
            <div class="check"><button><a target="_blank" href={message}>Check your transaction here</a></button></div>
          </div>
          :
          <div class="container">
            <div class="text"><p> {message}</p></div>
          </div>}
          <br /><br />

      </div>

      <button class="login" onClick={connectWalletPressed}>
        {(walletAddress.length > 0) ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}</button>
        

    </div>

  );
};


export default Minter;
