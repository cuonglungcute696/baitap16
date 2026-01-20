import React from "react";
import styles from "./OwnerPanel.module.css";

export default function OwnerPanel({
  candidateName,
  setCandidateName,
  voterAddress,
  setVoterAddress,
  onAddCandidate,
  onAllowVoter,
  onEndVoting,
  onResetVoting,
  loading,
  votingEnded,
}) {
  return (
    <div className={styles.grid}>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2>➕ Thêm Ứng viên</h2>
          <span className={styles.pill}>Owner</span>
        </div>
        <input
          type="text"
          placeholder="Tên ứng viên"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className={styles.input}
        />
        <button
          onClick={onAddCandidate}
          disabled={loading || votingEnded}
          className={`${styles.button} ${styles.primaryBtn}`}
          style={{ opacity: loading || votingEnded ? 0.6 : 1 }}
        >
          {loading ? "Đang xử lý..." : votingEnded ? "Đã kết thúc" : "Thêm"}
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <h2>✅ Cho phép Voter</h2>
          <span className={styles.pill}>Owner</span>
        </div>
        <input
          type="text"
          placeholder="Địa chỉ ví (0x...)"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
          className={styles.input}
        />
        <button
          onClick={onAllowVoter}
          disabled={loading || votingEnded}
          className={`${styles.button} ${styles.primaryBtn}`}
          style={{ opacity: loading || votingEnded ? 0.6 : 1 }}
        >
          {loading ? "Đang xử lý..." : votingEnded ? "Đã kết thúc" : "Cho phép"}
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <h2>🛑 Kết thúc Bầu chọn</h2>
          <span className={`${styles.pill} ${styles.pillDanger}`}>Owner</span>
        </div>
        <p className={styles.helperText}>Khóa bỏ phiếu và chốt kết quả.</p>
        <button
          onClick={onEndVoting}
          disabled={loading || votingEnded}
          className={`${styles.button} ${styles.dangerBtn}`}
          style={{ opacity: loading || votingEnded ? 0.6 : 1 }}
        >
          {loading ? "Đang xử lý..." : votingEnded ? "Đã kết thúc" : "Kết thúc bầu chọn"}
        </button>
      </div>

      {votingEnded && (
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>🔄 Bắt đầu bầu chọn mới</h2>
            <span className={`${styles.pill} ${styles.pillSuccess}`}>Owner</span>
          </div>
          <p className={styles.helperText}>Reset tất cả dữ liệu và bắt đầu cuộc bầu chọn mới.</p>
          <button
            onClick={onResetVoting}
            disabled={loading}
            className={`${styles.button} ${styles.successBtn}`}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Đang xử lý..." : "Bắt đầu bầu chọn mới"}
          </button>
        </div>
      )}
    </div>
  );
}
