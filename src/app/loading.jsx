import ActionStatus from '@/components/ActionStatus/ActionStatus';
import styles from './homepage.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderWrapper}>
        <ActionStatus status="loading" iconSize="150" />
      </div>
    </div>
  );
}
