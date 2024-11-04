// NoApartmentsAvailable.tsx
import React from 'react';
import styles from './NoApartmentsAvailable.module.css';

export default function NoApartmentsAvailable() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>🏢</div>
      <h2 className={styles.message}>No Apartments Available</h2>
      <p className={styles.subtext}>Please try a different search or check back later.</p>
      <button className={styles.retryButton} onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
}
