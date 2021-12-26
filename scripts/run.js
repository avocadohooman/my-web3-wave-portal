const main = async () => {
	/*
		In order to deploy something to the blockchain, we need to have a wallet address! Hardhat does this 
		for us magically in the background, but here I grabbed the wallet address of contract owner and I also 
		grabbed a random wallet address and called it randomPerson. This will make more sense in a moment.
	*/
	const [owner, randomPerson] = await hre.ethers.getSigners();
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
	console.log('Contract deplotyed by: ', owner.address);

	let waveCount;
	waveCount = await waveContract.getTotalWaves();

	let waveTxn;
	waveTxn = await waveContract.wave();
	await waveTxn.wait();

	let visitorMessage;
	visitorMessage = await waveContract.visitorMessage("Small contracts are siiiick!")
	
	waveCount = await waveContract.getTotalWaves();

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