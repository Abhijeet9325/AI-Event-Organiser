"use client";
import styles from "./SparkDrop.module.css";

export default function SparkDrop() {
  return (
    <div className={styles.container}>
      <div className={styles.spark}></div>
      <div className={styles.spark}></div>
      <div className={styles.spark}></div>
      <div className={styles.spark}></div>
    </div>
  );
}