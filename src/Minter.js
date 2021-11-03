import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./util/interact.js";
import logo from "./images/menu-button.png";
import { sampleNFT } from "./image.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {

    async function fetchData() {
      try {
        const { address } = await getCurrentWalletConnected();
        setWallet(address)
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
    setConnected(false);


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

    var container1 = document.getElementById("svgtag1");
    const sampleNFTImage = sampleNFT();
    container1.innerHTML = sampleNFTImage;

    var container2 = document.getElementById("svgtag2");
    container2.innerHTML = sampleNFTImage;


  }, []);



  const connectWalletPressed = async () => {
    if (!connected) {
      const walletResponse = await connectWallet();
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
    setMessage(walletResponse.status);

    //on successful mint, display minted NFT
    if (walletResponse.success) {
      var obj = JSON.parse(walletResponse.uri);
      console.log(obj.name);

      let base64 = obj.image.split(",")[1];
      console.log(base64);

      let base64ToString = Buffer.from(base64, "base64").toString();
      console.log(base64ToString);

      let svg = base64ToString;
      var container = document.getElementById("svgtag1");
      container.innerHTML = svg;

      console.log(container);
      console.log("End of print");
      console.log(message);
    }
  };

  return (
    <div className="pad-main">
      <nav className="navbar">
        <h1 className="logo">Battle Loot</h1>
        <ul className="nav-links">
          <li className="act"><a href="https://www.twitter.com/akshayincharge">Opensea</a></li>
          <li className="act"><a href="https://www.twitter.com/akshayincharge">Twitter</a></li>
          <li className="act"><a href="https://www.twitter.com/akshayincharge">Discord</a></li>
          <li className="ctn" onClick={connectWalletPressed}>
            {(walletAddress.length > 0) ? (
              "" +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>Connect Wallet</span>
            )}</li>
        </ul>
        <img src={logo} alt="" className="menu-btn" />
      </nav>

      <div className="row pad">
        <div className="header-div column">
          <div className="header-content">
            <h2>Survival of the Rarest</h2>
            <h1>Battle Arena</h1>
            <div><button onClick={onMintPressed} class="custom-btn btn-14">Gather your loot now</button></div>
          </div>
        </div>
        <div className=" column2">
          <div>
            <div className=" card" >
              <div id="svgtag1" className="front">
              </div>
              <div id="svgtag2" className="back">
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="type-a">
        <div className="title">
          <h2>Loot Royale</h2>
        </div>
        <div className="story">
          <h3 className="heading">Overview</h3>
          <p className="text1">Battle Loot is the randomly generate battle royale loot for RPG players. Images are omitted for
            reducing blockchain complexity</p>
          <p className="text1">Battle Loot is the randomly generate battle royale loot for RPG players. Images are omitted for
            reducing blockchain complexity</p>
          <h3 className="heading">The Story</h3>
          <p className="text1">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.</p>
          <p className="text1">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.</p>
        </div>
      </section>


      <section className="type-b">
        <h2 className="quest">FAQs</h2>

        <div className="faq">
          <div className="question">
            <h3>How much loot is available for the battle?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="answer">
            <p>10,000 bags of loot is ready to avenge your enemies</p>
          </div>
        </div>


        <div className="faq">
          <div className="question">
            <h3> On which Network loot royale is deployed?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="answer">
            <p>The entire loot royale, NFTs and the game, will be deployed on Polygon Network</p>
          </div>
        </div>

        <div className="faq">
          <div className="question">
            <h3>What is the royaly fee on the secondary sales?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="answer">
            <p>1% royalty fee set for the secondary sales is entirely used for the community development and giveaways</p>
          </div>
        </div>

        <div className="faq">
          <div className="question">
            <h3>What is the drop date for the loot royale?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="answer">
            <p>01/01/2022</p>
          </div>
        </div>

        <div className="faq">
          <div className="question">
            <h3>What is the mint price for the loot royale?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="answer">
            <p>10 MATIC</p>
          </div>
        </div>


      </section>


      <section id="roadmap">
        <div className="container">
          <div id="title">
            <h2>Roadmap</h2>
          </div>
          <div className="roadmap">
            <div className="block first">
              <h4>1.</h4>
              <div className="roadmap-line">
                <span className="roadmap-line-circle"></span>
                <span className="roadmap-line-line"></span>
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
            <div className="block active">
              <h4>2.</h4>
              <div className="roadmap-line">
                <span className="roadmap-line-circle"></span>
                <span className="roadmap-line-line"></span>
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
            <div className="block last">
              <h4>3.</h4>
              <div className="roadmap-line">
                <span className="roadmap-line-circle"></span>
                <span className="roadmap-line-line"></span>
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
            <div className="block last">
              <h4>4.</h4>
              <div className="roadmap-line">
                <span className="roadmap-line-circle"></span>
                <span className="roadmap-line-line"></span>
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