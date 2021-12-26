// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
	uint256 totalWaves;

	/* 
		Solidity Events are the same as events in any other programming language. 
		An event is an inheritable member of the contract, which stores the arguments passed in the transaction logs 
		when emitted. Generally, events are used to inform the calling application about the current state of the 
		contract, with the help of the logging facility of EVM. Events notify the applications about the change 
		made to the contracts and applications which can be used to execute the dependent logic.
	*/

	event NewWave(address indexed from, uint256 timestamp, string message);

	struct Wave {
		// Holds a 20 byte value (size of an Ethereum address)
		address waver;
		string message;
		uint256 timestamp;
	}

	/* 
		Here I declare an array of Wave struct, in which I will store all my message,
		including the address of the sender and the timestamp
	*/  
	Wave[] waves;

	constructor() {
		console.log('Yo yo');
	}

	function wave(string memory _message) public {
		totalWaves++;
		/*
			msg.sender is the wallet address of the person who called the function. 
			It's like built-in authentication. We know exactly who called the function because in order to 
			even call a smart contract function, you need to be connected with a valid wallet!
		*/
		console.log("%s has waved", msg.sender);
		uint256 timestamp = block.timestamp;
		waves.push(Wave(msg.sender, _message, timestamp));
		emit NewWave(msg.sender, timestamp, _message);
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
