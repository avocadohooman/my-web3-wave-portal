import React, {useEffect, useState} from "react";
import './App.css';
import { ethers } from "ethers";
import abi from './utils/WaverPortal.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x1E8491be77bE785cd286120C632BD81E402D8057";
  const contractABI = abi.abi;
  const [totalAmountOfWaves, setTotalAmountOfWaves] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const [waveMessage, setWaveMessage] = useState('')

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return ;
      }
      console.log("we have the ethereum object", ethereum);

      const accounts = await ethereum.request({method: 'eth_accounts'});

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('found an authorized account: ', account);
        setCurrentAccount(account);
        await getNumberOfWaves();
        await getAllWaves();
      } else {
         console.log('no authorized account found');
      }
    } catch (error) {
        console.error(error.message);
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        window.alert("Make sure you have MetaMask!");
        return ;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch(error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waveTxn = await wavePortalContract.wave(waveMessage);
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined--', waveTxn.hash);

        await getNumberOfWaves();
        await getAllWaves();
        setWaveMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getNumberOfWaves = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave counts...', count.toNumber());
        setTotalAmountOfWaves(count.toNumber());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        console.log('getAllWaves', getAllWaves);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = waves.map((wave) => ({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        }));
        console.log('wavesCleaned', wavesCleaned);
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleWaveMessage = (e) => {
    e.preventDefault();
    const waveMessage = e.target.value;
    setWaveMessage(waveMessage);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <div className="bio">
            Total amount of waves: {totalAmountOfWaves}
        </div>


        <div className="bio">
         Leave me a message :) 
        </div>

        <div className="waveMessageWrapper">
          <textarea className="waveMessage" onChange={(e) => handleWaveMessage(e)}/>
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
            return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
          })
        }
      </div>
    </div>
  );
}
