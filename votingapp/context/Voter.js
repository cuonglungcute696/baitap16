import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "./constants";

export const VoterContext = createContext();

export const VoterProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateArray, setCandidateArray] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contractOwner, setContractOwner] = useState("");
  const [votingEnded, setVotingEnded] = useState(false);

  // Kết nối ví MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Vui lòng cài đặt MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      setError("");
    } catch (err) {
      setError("Lỗi kết nối ví: " + err.message);
      console.error(err);
    }
  };

  // Kiểm tra ví đã kết nối
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ⚡ Chuyển sang Hardhat Network
  const switchToHardhatNetwork = async () => {
    try {
      console.log("🔄 Chuẩn bị chuyển sang Hardhat Local...");
      
      // Thử chuyển sang Hardhat network (Chain ID: 31337)
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }], // 0x7a69 = 31337 in hex
      });
      
      console.log("✅ Đã chuyển sang Hardhat Local!");
      return true;
    } catch (switchError) {
      // Nếu network chưa được thêm, thêm nó
      if (switchError.code === 4902) {
        try {
          console.log("➕ Thêm Hardhat network vào MetaMask...");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7a69", // 31337
                chainName: "Hardhat Local",
                rpcUrls: ["http://127.0.0.1:8545"],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          });
          console.log("✅ Đã thêm Hardhat network!");
          return true;
        } catch (addError) {
          console.error("❌ Lỗi thêm network:", addError);
          setError("Không thể thêm Hardhat network: " + addError.message);
          return false;
        }
      } else {
        console.error("❌ Lỗi chuyển network:", switchError);
        setError("Lỗi chuyển network: " + switchError.message);
        return false;
      }
    }
  };

  // Lấy contract instance
  const getContract = async () => {
    try {
      console.log("📍 Địa chỉ Contract:", VOTING_CONTRACT_ADDRESS);
      console.log("📍 Các hàm ABI:", VOTING_CONTRACT_ABI.map(x => x.name).filter(Boolean));
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("📍 Địa chỉ Signer:", signerAddress);
      
      const contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        signer
      );
      
      console.log("✅ Contract đã kết nối!");
      return contract;
    } catch (err) {
      setError("Lỗi kết nối contract: " + err.message);
      console.error("❌ Lỗi Contract:", err);
    }
  };

  // Thêm ứng viên (chỉ owner)
  const addCandidate = async (name) => {
    try {
      setLoading(true);
      await switchToHardhatNetwork(); // Chuyển network trước
      const contract = await getContract();
      const tx = await contract.addCandidate(name);
      await tx.wait();
      setLoading(false);
      await getAllCandidates();
      return true;
    } catch (err) {
      setError("Lỗi thêm ứng viên: " + err.message);
      setLoading(false);
      console.error(err);
      return false;
    }
  };

  // Cho phép người bầu (chỉ owner)
  const allowVoter = async (voterAddress) => {
    try {
      setLoading(true);
      await switchToHardhatNetwork(); // Chuyển network trước
      const contract = await getContract();
      const tx = await contract.allowVoter(voterAddress);
      await tx.wait();
      setLoading(false);
      return true;
    } catch (err) {
      setError("Lỗi cho phép voter: " + err.message);
      setLoading(false);
      console.error(err);
      return false;
    }
  };

  // Kết thúc bầu chọn (chỉ owner)
  const endVoting = async () => {
    try {
      setLoading(true);
      await switchToHardhatNetwork(); // Chuyển network trước
      const contract = await getContract();
      const tx = await contract.endVoting();
      await tx.wait();
      setLoading(false);
      setVotingEnded(true);
      return true;
    } catch (err) {
      setError("Lỗi kết thúc bầu chọn: " + err.message);
      setLoading(false);
      console.error(err);
      return false;
    }
  };

  // Reset bầu chọn (chỉ owner)
  const resetVoting = async () => {
    try {
      setLoading(true);
      await switchToHardhatNetwork(); // Chuyển network trước
      const contract = await getContract();
      const tx = await contract.resetVoting();
      await tx.wait();
      setLoading(false);
      setVotingEnded(false);
      setCandidateArray([]); // Xóa danh sách ứng viên
      await getAllCandidates(); // Tải lại danh sách
      return true;
    } catch (err) {
      setError("Lỗi reset bầu chọn: " + err.message);
      setLoading(false);
      console.error(err);
      return false;
    }
  };

  // Bỏ phiếu
  const vote = async (candidateId) => {
    try {
      if (votingEnded) {
        setError("Bầu chọn đã kết thúc");
        return false;
      }
      setLoading(true);
      await switchToHardhatNetwork(); // Chuyển network trước
      const contract = await getContract();
      const tx = await contract.vote(candidateId);
      await tx.wait();
      setLoading(false);
      await getAllCandidates();
      return true;
    } catch (err) {
      setError("Lỗi bỏ phiếu: " + err.message);
      setLoading(false);
      console.error(err);
      return false;
    }
  };

  // Lấy danh sách ứng viên
  const getAllCandidates = async () => {
    try {
      if (VOTING_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.log("Contract chưa được deploy. Vui lòng deploy contract trước.");
        setCandidateArray([]);
        return [];
      }

      console.log("📍 Đang lấy ứng viên từ:", VOTING_CONTRACT_ADDRESS);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log("📍 Provider đã kết nối");
      
      const contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        provider
      );
      console.log("📍 Contract instance đã tạo");
      
      // Thay vì gọi candidatesCount, thử lấy từng candidate từ ID 1 đến 100
      const candidates = [];
      let consecutiveEmpty = 0;
      let consecutiveErrors = 0;

      for (let i = 1; i <= 100; i++) {
        try {
          const candidate = await contract.getCandidate(i);

          const id = Number(candidate[0]);
          const name = (candidate[1] || "").trim();
          const votes = Number(candidate[2]);

          // Bỏ qua slot rỗng
          if (!id || !name) {
            consecutiveEmpty++;
          } else {
            candidates.push({ id, name, voteCount: votes });
            consecutiveEmpty = 0;
          }

          consecutiveErrors = 0; // reset vì call thành công

          // Nếu gặp 5 slot rỗng liên tiếp, dừng vòng lặp
          if (consecutiveEmpty > 5) {
            break;
          }
        } catch (err) {
          // Nếu lỗi (ID không tồn tại), tăng bộ đếm lỗi
          consecutiveErrors++;
          if (consecutiveErrors > 5) {
            break;
          }
        }
      }
      
      console.log("✅ Đã lấy", candidates.length, "ứng viên");
      setCandidateArray(candidates);
      // Cập nhật trạng thái bầu chọn
      try {
        const ended = await contract.votingEnded();
        setVotingEnded(ended);
      } catch (statusErr) {
        console.error("❌ Lỗi lấy trạng thái voting:", statusErr);
      }
      return candidates;
    } catch (err) {
      console.error("❌ Lỗi lấy candidates:", err);
      setCandidateArray([]);
      return [];
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    // Đồng bộ trạng thái votingEnded khi load trang
    const fetchStatus = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          VOTING_CONTRACT_ADDRESS,
          VOTING_CONTRACT_ABI,
          provider
        );
        const ended = await contract.votingEnded();
        setVotingEnded(ended);
      } catch (err) {
        console.error("❌ Lỗi lấy trạng thái voting:", err);
      }
    };
    fetchStatus();
  }, []);

  // Lấy Owner từ contract
  const getContractOwner = async () => {
    try {
      // Owner là Account #0 của Hardhat (cái deploy contract)
      const ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      console.log("📍 Contract Owner:", ownerAddress);
      setContractOwner(ownerAddress);
      return ownerAddress;
    } catch (err) {
      console.error("❌ Lỗi lấy owner:", err);
      return null;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getContractOwner();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getAllCandidates();
    }
  }, [currentAccount]);

  return (
    <VoterContext.Provider
      value={{
        currentAccount,
        connectWallet,
        candidateArray,
        addCandidate,
        allowVoter,
        endVoting,
        resetVoting,
        vote,
        error,
        loading,
        getAllCandidates,
        contractOwner,
        votingEnded,
      }}
    >
      {children}
    </VoterContext.Provider>
  );
};
