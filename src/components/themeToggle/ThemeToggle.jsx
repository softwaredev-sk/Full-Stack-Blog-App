'use client';

import Image from 'next/image';
import styles from './ThemeToggle.module.css';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);

  return (
    <div
      className={`${styles.container} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
      onClick={toggle}
    >
      <Image src="/moon.png" alt="" width={14} height={14} />
      <div
        className={`${styles.ball} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      ></div>
      <Image src="/sun.svg" alt="" width={14} height={14} />
    </div>
  );
}
