// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
	uint256 totalWaves;

	constructor() {
		console.log('Yo yo');
	}

	function wave() public {
		totalWaves++;
		/*
			msg.sender is the wallet address of the person who called the function. 
			It's like built-in authentication. We know exactly who called the function because in order to 
			even call a smart contract function, you need to be connected with a valid wallet!
		*/
		console.log("%s has waved", msg.sender);
	}

	function getTotalWaves() public view returns (uint256) {
		console.log("We have %d total waves!", totalWaves);
		return totalWaves;
	}
}
