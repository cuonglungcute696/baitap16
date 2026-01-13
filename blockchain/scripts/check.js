const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("🔍 Đang kiểm tra contract...\n");

  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const contract = VotingContract.attach(contractAddress);

  const owner = await contract.owner();
  const candidatesCount = await contract.candidatesCount();
  const votingEnded = await contract.votingEnded();

  console.log("✅ Contract Address:", contractAddress);
  console.log("✅ Owner Address:", owner);
  console.log("✅ Số lượng ứng viên:", candidatesCount.toString());
  console.log("✅ Bầu cử đã kết thúc:", votingEnded);
  console.log("\n📌 Contract đã deploy thành công và hoạt động!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  });
