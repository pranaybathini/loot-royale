import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./util/interact.js";
import logo from "./images/menu-btn.png";

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
    const menuBtn = document.querySelector('.menu-btn');

    const navlinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
      navlinks.classList.toggle('mobile-menu')
    });

    const faqs = document.querySelectorAll(".faq");
    faqs.forEach(faq => {
      faq.addEventListener("click", () => {
        faq.classList.toggle("active");
      });
    });

  }, []);

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

  const connectWalletPressed = async () => {
    if (!connected) {
      const walletResponse = await connectWallet();
      setStatus(walletResponse.status);
      setWallet(walletResponse.address);
      setConnected(true);
      console.log("Connected metamask to Battle Royale!!")
    }
  };

  const onMintPressed = async () => {

    //mint nft call
    const walletResponse = await mintNFT();
    console.log('Wallet Response after mint', walletResponse);

    //Update UI with mint status
    setSuccess(walletResponse.success);
    setMessage(walletResponse.status);
    setID(walletResponse.id);

    //on successful mint, display minted NFT
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
  
  return (
    <div>
      <nav class="navbar">
        <h1 class="logo">Battle Loot</h1>
        <ul class="nav-links">
          <li class="act"><a href="#">Opensea</a></li>
          <li class="act"><a href="https://www.twitter.com/akshayincharge">Twitter</a></li>
          <li class="act"><a href="#">Discord</a></li>
          <li class="ctn" onClick={connectWalletPressed}>
            {(walletAddress.length > 0) ? (
              "" +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>Connect Wallet</span>
            )}</li>
        </ul>
        <img src={logo} alt="" class="menu-btn" />
      </nav>
      
      <header>
        <div class="header-content">
          <h2>Survival of the Rarest</h2>
          <h1>Battle Arena</h1>
          <div class="ctn" onClick={onMintPressed}>Gather your loot now</div>
        </div>
      </header>

      {success ?
          <div>
            <div> <img src={`data:image/svg+xml;utf8,${status}`} />  </div>
          </div>
          :
          <div class="container">
            <div class="text"><p> {message}</p></div>
          </div>}

      <section class="type-a">
        <div class="title">
          <h2>Loot Royale</h2>
        </div>
        <div class="story">
          <h3 class="heading">Overview</h3>
          <p class="text1">Battle Loot is the randomly generate battle royale loot for RPG players. Images are omitted for
            reducing blockchain complexity</p>
          <p class="text1">Battle Loot is the randomly generate battle royale loot for RPG players. Images are omitted for
            reducing blockchain complexity</p>
          <h3 class="heading">The Story</h3>
          <p class="text1">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.</p>
          <p class="text1">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.</p>
        </div>
      </section>


      <section class="type-b">
        <h2 class="quest">FAQs</h2>

        <div class="faq">
          <div class="question">
            <h3>How much loot is available for the battle?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" stroke-width="7" stroke-linecap="round" />
            </svg>
          </div>
          <div class="answer">
            <p>10,000 bags of loot is ready to avenge your enemies</p>
          </div>
        </div>


        <div class="faq">
          <div class="question">
            <h3> On which Network loot royale is deployed?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" stroke-width="7" stroke-linecap="round" />
            </svg>
          </div>
          <div class="answer">
            <p>The entire loot royale, NFTs and the game, will be deployed on Polygon Network</p>
          </div>
        </div>

        <div class="faq">
          <div class="question">
            <h3>What is the royaly fee on the secondary sales?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" stroke-width="7" stroke-linecap="round" />
            </svg>
          </div>
          <div class="answer">
            <p>1% royalty fee set for the secondary sales is entirely used for the community development and giveaways</p>
          </div>
        </div>

        <div class="faq">
          <div class="question">
            <h3>What is the drop date for the loot royale?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" stroke-width="7" stroke-linecap="round" />
            </svg>
          </div>
          <div class="answer">
            <p>01/01/2022</p>
          </div>
        </div>

        <div class="faq">
          <div class="question">
            <h3>What is the mint price for the loot royale?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" stroke-width="7" stroke-linecap="round" />
            </svg>
          </div>
          <div class="answer">
            <p>10 MATIC</p>
          </div>
        </div>


      </section>


      <section id="roadmap">
        <div class="container">
          <div id="title">
            <h2>Roadmap</h2>
          </div>
          <div class="roadmap">
            <div class="block first">
              <h4>1.</h4>
              <div class="roadmap-line">
                <span class="roadmap-line-circle"></span>
                <span class="roadmap-line-line"></span>
              </div>
              <ul>
                <li>

                  <p>
                    <b>NFT Launch</b>
                    <br />Launch loot royale NFT with exclusive giveaways and rewards for the community.
                  </p>
                </li>
              </ul>

            </div>
            <div class="block active">
              <h4>2.</h4>
              <div class="roadmap-line">
                <span class="roadmap-line-circle"></span>
                <span class="roadmap-line-line"></span>
              </div>
              <ul>
                <li>

                  <p>
                    <b>Loot Marketplace</b>
                    <br />Our own marketplace with 0% royalty fees and with added rarity scores embedded into our website
                  </p>
                </li>
              </ul>
            </div>
            <div class="block last">
              <h4>3.</h4>
              <div class="roadmap-line">
                <span class="roadmap-line-circle"></span>
                <span class="roadmap-line-line"></span>
              </div>
              <ul>
                <li>
                  <p>
                    <b>Game Development</b>
                    <br />Develop a automated battle royale game on blockchain based on the loot generated
                    <br />NFT holders have the access to play version 1 of the battle royale
                  </p>
                </li>
              </ul>
            </div>
            <div class="block last">
              <h4>4.</h4>
              <div class="roadmap-line">
                <span class="roadmap-line-circle"></span>
                <span class="roadmap-line-line"></span>
              </div>
              <ul>
                <li>
                  <p>
                    <b>Token Launch</b>
                    <br />Launching our token which will be used to reward the winners of the battle.Join battle pools and win token rewards.
                    <br />NFT holders receive part of token supply.
                  </p>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>




    </div>
  );
};

export default Minter;