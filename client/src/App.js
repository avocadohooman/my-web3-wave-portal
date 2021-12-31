import React, {useEffect, useState} from "react";
import './App.css';
import { ethers } from "ethers";
import validator from 'validator';
import config from './config/config';

export default function App() {
	const [currentAccount, setCurrentAccount] = useState("");
	const [totalAmountOfWaves, setTotalAmountOfWaves] = useState(0);
	const [allWaves, setAllWaves] = useState([]);
	const [waveMessage, setWaveMessage] = useState('')
	const [memeUrl, setMemeUrl] = useState('');
	const [errorMessage, setErrorMessage] = useState('')
	const [prizeMessage, setPrizeMessage] = useState('');
	const [isMining, setIsMining] = useState(false);

	const validate = (value) => {
		if (validator.isURL(value) && value.length > 0 && value.includes('https://media.giphy.com')) {
			setErrorMessage('');
			return 1;
		}
		setErrorMessage('invalid URL');
		setTimeout(() => {
			setErrorMessage('');
		}, 2000);
		return 0;
	}

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
		setIsMining(true);
		try {
			const { ethereum } = window
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(config.contractAddress, config.contractABI, signer);

				const waveTxn = await wavePortalContract.wave(waveMessage, memeUrl, {gasLimit: 300000});
				console.log('Mining...', waveTxn.hash);

				await waveTxn.wait();
				console.log('Mined--', waveTxn.hash);

				await getNumberOfWaves();
				await getAllWaves();
				setWaveMessage('');
				setMemeUrl('');
			}
		} catch (error) {
			console.log(error);
		}
		setIsMining(false);
	}

	const getNumberOfWaves = async () => {
		try {
			const { ethereum } = window
			if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const wavePortalContract = new ethers.Contract(config.contractAddress, config.contractABI, signer);

			let count = await wavePortalContract.getTotalWaves();
			setTotalAmountOfWaves(count.toNumber());
			}
		} catch (error) {
			console.log(error);
		}
	}

	const getAllWaves = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(config.contractAddress, config.contractABI, signer);
				const waves = await wavePortalContract.getAllWaves();

				let wavesCleaned = waves.map((wave) => ({
					address: wave.waver,
					timestamp: new Date(wave.timestamp * 1000),
					message: wave.message,
					url: wave.url,
			}));
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

	const handleMemeURL = (e) => {
		e.preventDefault();
		const memeURL = e.target.value;
		if (memeURL.length > 0 && validate(memeURL)){
			setMemeUrl(memeURL);
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected();
		let wavePortalContract;

		const onNewWave = (from, timestamp, message) => {
			setAllWaves(prevState => [
				...prevState,
				{
					address: from,
					timestamp: new Date(timestamp * 1000),
					message: message,
				}
			])
		};

		const youWon = (_from, _timestamp, message) => {
			setPrizeMessage(message);
			setTimeout(() => {
				setPrizeMessage('');
			}, 4000);
		}

		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			wavePortalContract = new ethers.Contract(config.contractAddress, config.contractABI, signer);
			wavePortalContract.on("NewWave", onNewWave);
			wavePortalContract.on("YouWon", youWon);
		}
		return () => {
			if (wavePortalContract) {
				wavePortalContract.off("NewWave", onNewWave);
			}
		}
	}, []);

	return (
		<div className="mainContainer">

			<div className="dataContainer">
			<div className="header">
			👋 Hey there!
			</div>

			<div className="bio">
			I am gary and I currently work as full-stack developer at Wunderdog in Helsinki. Connect your Ethereum wallet and wave at me!
			<br/><span style={{color: '#68D391', fontWeight: 'bold'}}>There is a chance to win 0.0001 ETH with every wave!🏆</span>
			</div>

			<div className="bio">
				Total amount of waves: <span className='important'>{totalAmountOfWaves}</span>
			</div>

			<div className="waveMessageWrapper">
				<div >
					<div className="bio">
						<span style={{color: '#68D391', fontWeight: 'bold'}}>INCREASE</span> your chance to <span style={{color: '#68D391', fontWeight: 'bold'}}>WIN</span> by sending me a cool GIF from <a href="https://giphy.com/">giphy.com</a>!
					</div>
					<input placeholder={memeUrl} className="waveMessage" onChange={(e) => handleMemeURL(e)}/>
					<div>
						{errorMessage}
					</div>
				</div>

				<div className="bio">
					and/or leave a message :) 
				</div>

				<div>
					<textarea placeholder={waveMessage} className="waveMessage" onChange={(e) => handleWaveMessage(e)}/>
				</div>
			</div>


			{!prizeMessage && !isMining && 
				<button className="waveButton" onClick={wave}>
					Wave at Me
				</button>
			}

			{isMining && !prizeMessage && 
				<button className="miningButton">
					⛏️⛏️ Mining... ⛏️⛏️
				</button>
			}
			
			{prizeMessage && !isMining &&
				<button className="celebrationButton">
					🎉🎉 {prizeMessage} 🎉🎉
				</button>
			}

			{!currentAccount && (
				<button className="waveButton" onClick={connectWallet}>
				Connect Wallet
				</button>
			)}

			<div className="waveMessagesWrapper">
				{allWaves.map((wave, index) => {
					return (
					<div key={index} style={{ width: '100%', backgroundColor: "#EBF8FF", marginTop: "16px", padding: "8px" }}>
						<div style={{fontSize: '20px', fontStyle: 'bold', textAlign: 'center', marginBottom: '15px'}}>{wave.message}</div>
						<img style={{display: 'block', marginBottom: '15px', marginLeft: 'auto', marginRight: 'auto', width: '75%'}}src={wave.url} />
						<div>From: {wave.address.substr(0, 20)}...</div>
						<div>Time: {wave.timestamp.toString()}</div>
					</div>)
					})
				}
			</div>

			</div>
		</div>
	);
}
