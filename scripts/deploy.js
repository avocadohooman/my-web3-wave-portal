
const deploy = async () => {
	const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
	const waveContract = await waveContractFactory.deploy({
	value: hre.ethers.utils.parseEther('0.001'),
	});

	await waveContract.deployed();

	console.log('WavePortal address: ', waveContract.address);
}

const runDeploy = async () => {
	try {
		await deploy();
		process.exit(0);
	} catch (error) {
		console.error(error.message);
		process.exit(0);
	}
}

runDeploy();