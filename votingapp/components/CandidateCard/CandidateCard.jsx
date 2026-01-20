import React, { useContext } from "react";
import styles from "./CandidateCard.module.css";
import { VoterContext } from "../../context/Voter";

export default function CandidateCard({ candidate, isOwner, loading, votingEnded, onVote }) {
  const { candidateArray } = useContext(VoterContext);
  
  // Tính tổng phiếu
  const totalVotes = candidateArray.reduce((sum, c) => sum + c.voteCount, 0);
  const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.avatar}>{candidate.name?.[0]?.toUpperCase() || "?"}</div>
        <div className={styles.info}>
          <div className={styles.id}>#{candidate.id}</div>
          <h3 className={styles.name}>{candidate.name}</h3>
          <div className={styles.voteRow}>
            <span className={styles.voteCount}>🗳️ {candidate.voteCount} phiếu ({percentage}%)</span>
          </div>
          {/* Progress bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </div>

      {!isOwner && (
        <button
          onClick={() => onVote(candidate.id)}
          disabled={loading || votingEnded}
          className={styles.button}
          style={{ opacity: loading || votingEnded ? 0.5 : 1 }}
        >
          {votingEnded ? "Đã kết thúc" : loading ? "Đang vote..." : "Bỏ phiếu"}
        </button>
      )}
    </div>
  );
}
