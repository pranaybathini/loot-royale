import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./util/interact.js";
import logo from "./images/menu-button.png";
import { sampleNFT } from "./image.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");

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

    var txnContainer = document.getElementById("check-txn");
    txnContainer.style.display = "none";

  }, []);



  const connectWalletPressed = async () => {
    if (!connected) {
      const walletResponse = await connectWallet();
      console.log(walletResponse);
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

      setMessage(walletResponse.status);
      var txnContainer = document.getElementById("check-txn");
      txnContainer.style.display = "block";
    }
  };

  return (
    <div className="pad-main">
      <nav className="navbar">
        <h1 className="logo"><b>Loot Royale</b></h1>
        <ul className="nav-links">
        <li className="act"><a href="https://lootroyale.xyz/">Opensea</a></li>
        <li className="act"><a href="https://discord.com/invite/PrT7ZX2EAa">Discord</a></li>
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
            <h2><b>Survival of the Rarest</b></h2>
            <h1><b>Battle Arena</b></h1>
            <div><button onClick={onMintPressed} className="custom-btn btn-14">Gather your loot now</button></div><br />
            <div id="check-txn"><button onClick={() => { window.open(message) }} className="custom-btn btn-14">Check your transaction</button></div>
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
          <p className="text1">Loot royale is a randomly generated battle royale loot. Loot royale NFTs are completely on-chain</p>
          <h3 className="heading">The Story</h3>
          <p className="text1">The year is 2121, the fiercest warrior groups fought for the supremacy of the land. Every warrior had equal fighting capabilities. A group of warriors has thought a step ahead to fight their equals. Eventually, they won all the battles. The loot has made them victorious.</p>
          <p className="text1">The loot was then hidden in the metaverse forests. A group of looters went in search of the loot and has come across the most advanced loot of all time. This is it, you have now found it...The time has come for you to emerge victorious in this ultimate battle. Gather your loot now.</p>
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
            <p>There will be only 10,000 bags of loot.</p>
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
            <p>Loot royale NFTs are deployed on the Polygon(Matic) network to avoid excessive gas fees on Ethereum.</p>
          </div>
        </div>

        <div className="faq">
          <div className="question">
          <h3>What does a loot bag contain?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="answer">
          <p>Each bag of loot contains necessary tools like weapons, armors, and consumables that make you battle ready.</p>
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
            <p>0%</p>
          </div>
        </div>

        <div className="faq">
          <div className="question">
            <h3>When can we mint Loot NFTs?</h3>
            <svg width="15" height="10" viewBox="0 0 42 35">
              <path d="M3 3L21 21L39 3" stroke="white" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="answer">
            <p>Now</p>
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
            <p>5 MATIC<br></br></p>
          </div>
        </div>
        <div className="faq"></div>

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
                    <br />Loot royale NFT launch will be fair. No NFTs are reserved for the owner.
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
                  <b>Rarity Tool</b>
                  <br/>Every loot bag is unique. We are going to develop a rarity tool to sort loot royale NFTs by rarity and rank.
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

      <footer>
        <div className="container rowx">
          <div className="infos columnx cid" >
            <div className="blockmark columnx">
              <div className="logo rowx">
                <div className="pic"></div>
                <div className="typo">Loot Royale</div>
              </div>
              <p className="baseline">Battle Royale on Blockchain.</p>
            </div>
            <p className="copyright">©Loot Royale 2021. All rights reserved.</p>
          </div>
          <div className="right columnx sr-top-fast-delayed rcd" >
            <div className="nav columnx">
              <a href="https://lootroyale.xyz">Home</a>
              <a href="https://lootroyale.xyz">Contract(Soon)</a>
            </div>
            <div className="social rowx">
              <div className="link">
                <a href="https://opensea.com" name="opensea" rel="noreferrer" target="_blank" className="opensea row keychainify-checked">

                </a>
              </div>
              <div className="link">
                <a href="https://discord.com/invite/PrT7ZX2EAa" rel="noreferrer" name="discord" target="_blank" className="discord row keychainify-checked">

                </a>
              </div>
              
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default Minter;