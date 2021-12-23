import styles from "./styles.module.scss";

export function Loading() {
  return (
    <div className={styles.preloader}>
      <div>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
