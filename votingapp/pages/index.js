import React, { useContext, useState, useEffect } from "react";
import { VoterContext } from "../context/Voter";
import { useToast } from "../components/Toast/Toast";
import OwnerPanel from "../components/OwnerPanel/OwnerPanel";
import CandidateCard from "../components/CandidateCard/CandidateCard";
import styles from "../styles/index.module.css";

const Home = () => {
  const {
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
    contractOwner,
    votingEnded,
  } = useContext(VoterContext);

  const [candidateName, setCandidateName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const { showToast } = useToast();

  const handleAddCandidate = async () => {
    if (!candidateName.trim()) {
      showToast("Vui lòng nhập tên ứng viên", "warning");
      return;
    }
    const success = await addCandidate(candidateName);
    if (success) {
      setCandidateName("");
      showToast("Thêm ứng viên thành công!", "success");
    }
  };

  const handleAllowVoter = async () => {
    if (!voterAddress.trim()) {
      showToast("Vui lòng nhập địa chỉ voter", "warning");
      return;
    }
    const success = await allowVoter(voterAddress);
    if (success) {
      setVoterAddress("");
      showToast("Cho phép voter thành công!", "success");
    }
  };

  const handleVote = async (candidateId) => {
    if (votingEnded) {
      showToast("Bầu chọn đã kết thúc", "warning");
      return;
    }
    const success = await vote(candidateId);
    if (success) {
      showToast("Bỏ phiếu thành công!", "success");
    }
  };

  const handleEndVoting = async () => {
    const confirmEnd = window.confirm("Bạn chắc chắn muốn kết thúc bầu chọn?");
    if (!confirmEnd) return;

    const success = await endVoting();
    if (success) {
      showToast("Đã kết thúc bầu chọn!", "success");
    }
  };

  const handleResetVoting = async () => {
    const confirmReset = window.confirm("Bạn chắc chắn muốn bắt đầu cuộc bầu chọn mới? (Tất cả dữ liệu sẽ bị xóa)");
    if (!confirmReset) return;

    const success = await resetVoting();
    if (success) {
      showToast("Bắt đầu bầu chọn mới thành công!", "success");
    }
  };

  // Hiển thị lỗi bằng toast nếu có
  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  const isOwner = currentAccount?.toLowerCase() === contractOwner?.toLowerCase();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headerBar}>
          <div>
            <p className={styles.appLabel}>Voting DApp</p>
            <h1 className={styles.title}>🗳️ Bầu chọn minh bạch</h1>
          </div>
          {votingEnded ? (
            <div className={`${styles.badge} ${styles.badgeEnded}`}>Đã kết thúc</div>
          ) : (
            <div className={`${styles.badge} ${styles.badgeLive}`}>Đang mở</div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {votingEnded && <div className={styles.infoBanner}>Bầu chọn đã kết thúc</div>}

        {!currentAccount ? (
          <div className={styles.connectSection}>
            <p>Vui lòng kết nối ví MetaMask để tiếp tục</p>
            <button
              onClick={connectWallet}
              className={`${styles.button} ${styles.primaryBtn}`}
            >
              Kết nối MetaMask
            </button>
          </div>
        ) : (
          <>
            <div className={styles.accountInfo}>
              <div>
                <strong>Tài khoản:</strong>{" "}
                {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
              </div>
              <div className={styles.accountActions}>
                {isOwner && <span className={styles.ownerBadge}>👑 Owner</span>}
                {votingEnded && <span className={styles.endedTag}>Bầu chọn đã kết thúc</span>}
              </div>
            </div>

            {isOwner && (
              <OwnerPanel
                candidateName={candidateName}
                setCandidateName={setCandidateName}
                voterAddress={voterAddress}
                setVoterAddress={setVoterAddress}
                onAddCandidate={handleAddCandidate}
                onAllowVoter={handleAllowVoter}
                onEndVoting={handleEndVoting}
                onResetVoting={handleResetVoting}
                loading={loading}
                votingEnded={votingEnded}
              />
            )}
            <div className={styles.section}>
              <h2>📊 Danh sách Ứng viên</h2>
              {loading ? (
                <p>Đang tải...</p>
              ) : candidateArray.length > 0 ? (
                <div className={styles.candidateList}>
                  {candidateArray.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      isOwner={isOwner}
                      loading={loading}
                      votingEnded={votingEnded}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>Chưa có ứng viên nào.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default Home;