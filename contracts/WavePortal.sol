// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
	uint256 totalWaves;
    uint256 private seed;
	/* 
		here we create a hash table like map
		the key is of type address
		and value stores is of type uint256
	*/
    mapping(address => uint256) public lastWavedAt;

	/* 
		Solidity Events are the same as events in any other programming language. 
		An event is an inheritable member of the contract, which stores the arguments passed in the transaction logs 
		when emitted. Generally, events are used to inform the calling application about the current state of the 
		contract, with the help of the logging facility of EVM. Events notify the applications about the change 
		made to the contracts and applications which can be used to execute the dependent logic.
	*/
	event NewWave(address indexed from, uint256 timestamp, string message, string url);
	event YouWon(address indexed from, uint256 timestamp, string message);

	struct Wave {
		// Holds a 20 byte value (size of an Ethereum address)
		address waver;
		string message;
		string url;
		uint256 timestamp;
	}

	/* 
		Here I declare an array of Wave struct, in which I will store all my message,
		including the address of the sender and the timestamp
	*/  
	Wave[] waves;

	constructor() payable {
		console.log('Yo yo');
		seed = (block.timestamp + block.difficulty) % 100;
	}

	function wave(string memory _message, string memory _url) public {
		/*
			here we check that the last wave is at least 30 seconds
		*/
		require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Wait 30 seconds for your next wave");

		// here we update the time of the last wave...
		lastWavedAt[msg.sender] = block.timestamp;
		// ...and increase the wave
		totalWaves++;
		/*
			msg.sender is the wallet address of the person who called the function. 
			It's like built-in authentication. We know exactly who called the function because in order to 
			even call a smart contract function, you need to be connected with a valid wallet!
		*/
		console.log("%s has waved", msg.sender);
		uint256 timestamp = block.timestamp;
		waves.push(Wave(msg.sender, _message, _url, timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
        */

		seed = (block.difficulty + block.timestamp + seed) % 100;
		console.log("Random # generated seed: %d", seed);
		console.log("_url legth", bytes(_url).length);
		if (seed <= 10 && bytes(_url).length == 0) {
			console.log("%s won!", msg.sender);
			uint256 prizeAmount = 0.0001 ether;
			/* 
				require Solidity function guarantees validity of conditions that cannot be detected before execution. 
				It checks inputs, contract state variables and return values from calls to external contracts.
			*/
			require (
				//address(this).balance is the balance of the contract itself.
				prizeAmount <= address(this).balance,
				"Trying to withdraw more money than the contract has."
			);
			(bool success, ) = (msg.sender).call{value: prizeAmount}("");
			//require(success is where we know the transaction was a success
			require(success, "Failed to withdraw money from the contract");
			string memory awardMessage = "Congratulations! You won: 0.0001 ETH!";
			emit YouWon(msg.sender, timestamp, awardMessage);
		} else if (seed <= 50 && bytes(_url).length > 0) {
			console.log("%s won!", msg.sender);
			uint256 prizeAmount = 0.0001 ether;
			/* 
				require Solidity function guarantees validity of conditions that cannot be detected before execution. 
				It checks inputs, contract state variables and return values from calls to external contracts.
			*/
			require (
				//address(this).balance is the balance of the contract itself.
				prizeAmount <= address(this).balance,
				"Trying to withdraw more money than the contract has."
			);
			(bool success, ) = (msg.sender).call{value: prizeAmount}("");
			//require(success is where we know the transaction was a success
			require(success, "Failed to withdraw money from the contract");
			string memory awardMessage = "Congratulations! You won: 0.0001 ETH!";
			emit YouWon(msg.sender, timestamp, awardMessage);
		}
		emit NewWave(msg.sender, timestamp, _message, _url);
	}

	// View function ensure that they do not modify the state
	function visitorMessage(string memory message) public view {
		console.log("%s has left a message: %s", msg.sender, message);
	}

	function getAllWaves() public view returns(Wave[] memory) {
		return waves;
	}

	function getTotalWaves() public view returns (uint256) {
		console.log("We have %d total waves!", totalWaves);
		return totalWaves;
	}
}
