import Image from 'next/image';
import styles from './ActionStatus.module.css';

export default function ActionStatus({ text, status, iconSize }) {
  return (
    <p className={styles.actionStatus}>
      {text && text}
      {status === 'success' && (
        <Image
          src="/success.gif"
          alt="success icon"
          width={iconSize}
          height={iconSize}
        />
      )}
      {status === 'loading' && (
        <Image
          src="/loading.svg"
          alt="loading icon"
          width={iconSize}
          height={iconSize}
        />
      )}
      {status === 'none' && <p></p>}
    </p>
  );
}
