/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './styles/App.css';

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  {/* USESTATE IS FOR CHANGING STATE VARIABLE WITH A FUNCTION */}
  {/* USEEFFECT IS FOR CALLING A FUNCTION ON A CHANGE */}
  const TEST_GIFS = [
    "https://media.giphy.com/media/b8RfbQFaOs1rO10ren/giphy.gif",
    "https://media.giphy.com/media/jThvO9RsD1NDy/giphy.gif",
    "https://media.giphy.com/media/l3q2Z6S6n38zjPswo/giphy.gif",
    "https://media.giphy.com/media/JQvUME2YOpTgqCKhDb/giphy-downsized-large.gif"
  ];

  const [walletAdress, setWalletAdress] = useState(null);

  const [inputValue, setInputValue] = useState(' ');

  const [gifList, setGifList] = useState([]);
  
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */

  function renderNotConnectedContainer() {
    return (
      <button className="cta-button connect-wallet-button" onClick={connectWallet}>
        Connect Wallet
      </button>
    );
  }

  function renderConnectedContainer() {
    return (
      <div className="connected-container">

        { /* Event.preventdefault so that page does not reload */}
        <form onSubmit={(event)=> {
          event.preventDefault(); 
          sendGif();
        }}>
          <input type="text" placeholder="Paste your gif's link here!" value={inputValue} onChange={onInputChange} />
          <button className="cta-button submit-gif-button"> Submit </button>
        </form>


        <div className="gif-grid">
          {TEST_GIFS.map(gif => {
            return (
              <div className="gif-item" key={gif}>
                <img src={gif} alt={gif} />
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(response.publicKey.toString());

          setWalletAdress(response.publicKey.toString());
        }
      } else {
        console.log('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };


  async function connectWallet() {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString())
      setWalletAdress(response.publicKey.toString());
    }

  };

  async function sendGif() {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue)
    } else {
      console.log("Input Empty");
    }
  }

  function onInputChange(event) {
    const { value } = event.target;
    setInputValue(value);
  }
  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

useEffect(()=>{
  if(walletAdress) {
    console.log("Fetching GIF links...")
    setGifList(TEST_GIFS);
  }
}, [walletAdress])
  
  return (
    <div className="App">
      {/* If walletAdress is filled with a string (true), or if it is empty (false) */}

      <div className={walletAdress ? 'authed-container' : 'container'}>
        <p className="header">🖼 GIF Club</p>
        <p className="sub-text">
          View your GIF collection in the metaverse ✨
        </p>
        {!walletAdress && renderNotConnectedContainer()}

        {walletAdress && renderConnectedContainer()}
      </div>

    </div>
  );
};

export default App;