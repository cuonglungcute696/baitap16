import React, { useContext, useEffect } from "react";
import { VoterContext } from "../context/Voter";

const Home = () => {
  const {
    currentAccount,
    connectWallet,
    candidateArray,
    error,
    loading,
  } = useContext(VoterContext);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Voting DApp</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      {!currentAccount ? (
        <div>
          <p>Vui lòng kết nối ví MetaMask để tiếp tục</p>
          <button
            onClick={connectWallet}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Kết nối MetaMask
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Tài khoản:</strong> {currentAccount.slice(0, 6)}...
            {currentAccount.slice(-4)}
          </p>

          <h2>Danh sách ứng viên</h2>
          {loading ? (
            <p>Đang tải...</p>
          ) : candidateArray.length > 0 ? (
            <ul>
              {candidateArray.map((candidate) => (
                <li key={candidate.id}>
                  <strong>{candidate.name}</strong> - {candidate.voteCount}{" "}
                  phiếu
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có ứng viên nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;