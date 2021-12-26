import React, {useEffect, useState} from "react";
import './App.css';
import { ethers } from "ethers";
import abi from './utils/WaverPortal.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x024a618Db88Dae459c5f828B4F44Dc1a3dfBAd8e";
  const contractABI = abi.abi;
  const [totalAmountOfWaves, setTotalAmountOfWaves] = useState(0);

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

        let count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave counts...', count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined--', waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave counts...', count.toNumber());
        setTotalAmountOfWaves(count.toNumber());
      }
    } catch (error) {
      console.log(error);
    }
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
            {totalAmountOfWaves}
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
