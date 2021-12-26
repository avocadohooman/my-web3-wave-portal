const main = async () => {
	/* 	
		Here we create a local ETH network, for the contract WavePortal
	 	After completion of the script, the network will be destroyed
		hre is no where imported, the reason:
		The Hardhat Runtime Environment, or HRE for short, is an object containing 
		all the functionality that Hardhat exposes when running a task, test or script. 
		In reality, Hardhat is the HRE.
	*/ 
	const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
	const waveContract = await waveContractFactory.deploy();
	// here we wait until our contract is done deploying
	await waveContract.deployed();
	console.log('Contract deplotyed to: ', waveContract.address);
}

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error.message);
		process.exit(0);
	}
}

runMain();