const hre = require("hardhat");

async function main() {
  // Địa chỉ contract vừa deploy
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Kết nối tới contract
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const contract = VotingContract.attach(contractAddress);
  
  console.log("🔍 Testing contract at:", contractAddress);
  
  // 1. Test getOwner()
  try {
    const owner = await contract.getOwner();
    console.log("✅ getOwner() succeeded! Owner:", owner);
  } catch (err) {
    console.log("❌ getOwner() failed:", err.message);
  }
  
  // 2. Lấy số lượng candidates
  const count = await contract.candidatesCount();
  console.log("📊 Candidates count:", count.toString());
  
  // 3. Cố gắng lấy danh sách candidates
  try {
    const candidates = await contract.getAllCandidates();
    console.log("✅ getAllCandidates() succeeded!");
    console.log("Candidates:", candidates);
  } catch (err) {
    console.log("❌ getAllCandidates() failed:", err.message);
  }
  
  // 4. Thêm candidate để test
  console.log("\n➕ Adding test candidates...");
  const [owner] = await hre.ethers.getSigners();
  
  const tx1 = await contract.addCandidate("Candidate A");
  await tx1.wait();
  console.log("✅ Added Candidate A");
  
  const tx2 = await contract.addCandidate("Candidate B");
  await tx2.wait();
  console.log("✅ Added Candidate B");
  
  // 5. Kiểm tra lại
  const newCount = await contract.candidatesCount();
  console.log("📊 New candidates count:", newCount.toString());
  
  const candidates = await contract.getAllCandidates();
  console.log("✅ getAllCandidates() result:", candidates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
