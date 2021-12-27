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
	const waveContract = await waveContractFactory.deploy({
		// here we deploy our contract with 0.1 ether
		value: hre.ethers.utils.parseEther('0.1'),
	  });

	// here we wait until our contract is done deploying
	await waveContract.deployed();
	console.log('Contract deplotyed to: ', waveContract.address);

	/*
		Get contract balance
	*/
	let contractBalance = await hre.ethers.provider.getBalance(
		waveContract.address
	);
	console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

	/*
		Get wave count
	*/
	let waveCount;
	waveCount = await waveContract.getTotalWaves();

	/*
		Send Wave
	*/
	let waveTxn;
	waveTxn = await waveContract.wave("Small contracts are siiiick!");
	await waveTxn.wait();

	contractBalance = await hre.ethers.provider.getBalance(
		waveContract.address
	);
	console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

	/*
		In order to deploy something to the blockchain, we need to have a wallet address! Hardhat does this 
		for us magically in the background, but here I grabbed the wallet address of contract owner and I also 
		grabbed a random wallet address and called it randomPerson. This will make more sense in a moment.
	*/
	const [user, randomPerson] = await hre.ethers.getSigners();
	waveTxn = await waveContract.connect((randomPerson)).wave('Another message!');
	await waveTxn.wait();

	let allWaves = await waveContract.getAllWaves();
	console.log(allWaves);
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