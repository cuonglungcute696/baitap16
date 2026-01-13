const hre = require("hardhat");

async function main() {
  console.log("Deploying VotingContract...");

  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();

  await votingContract.waitForDeployment();

  const address = await votingContract.getAddress();

  console.log("\n✅ VotingContract deployed to:", address);
  console.log("\n📝 Copy địa chỉ này vào votingapp/context/constants.js");
  console.log(`export const VOTING_CONTRACT_ADDRESS = "${address}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
