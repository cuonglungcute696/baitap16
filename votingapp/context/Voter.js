import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "./constants";

export const VoterContext = createContext();

export const VoterProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateArray, setCandidateArray] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Lấy contract instance
  const getContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        signer
      );
      return contract;
    } catch (err) {
      setError("Lỗi kết nối contract: " + err.message);
      console.error(err);
    }
  };

  // Thêm ứng viên (chỉ owner)
  const addCandidate = async (name) => {
    try {
      setLoading(true);
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

  // Bỏ phiếu
  const vote = async (candidateId) => {
    try {
      setLoading(true);
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
      // Kiểm tra contract đã deploy chưa
      if (VOTING_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.log("Contract chưa được deploy. Vui lòng deploy contract trước.");
        setCandidateArray([]);
        return [];
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        provider
      );
      const candidates = await contract.getAllCandidates();
      
      const formattedCandidates = candidates.map((c) => ({
        id: Number(c.id),
        name: c.name,
        voteCount: Number(c.voteCount),
      }));

      setCandidateArray(formattedCandidates);
      return formattedCandidates;
    } catch (err) {
      console.error("Lỗi lấy candidates:", err);
      setCandidateArray([]);
      return [];
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
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
        vote,
        error,
        loading,
        getAllCandidates,
      }}
    >
      {children}
    </VoterContext.Provider>
  );
};
