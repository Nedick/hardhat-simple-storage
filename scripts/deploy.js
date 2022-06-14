// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );
    console.log("Deploying contract...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    // what's the private key?
    // what's the rpc url?
    console.log(`Deployed contract to: ${simpleStorage.address}`);
    // what happens when we deploy to our hardhat network
    console.log(network.config);
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
        console.log("Deployed to Rinkeby");
    }
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("verify:verify")) {
            console.log("Already verified!");
        } else {
            console.log(e);
        }
    }
}

//main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
