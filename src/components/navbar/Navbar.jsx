'use client';

import React from 'react';
import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import AuthLinks from '../authLinks/AuthLinks';
import ThemeToggle from '../themeToggle/ThemeToggle';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const path = usePathname();
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Link href="https://www.facebook.com/shailendrakrsk">
          <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        </Link>
        <Link href="https://www.instagram.com/shailendrakrsk">
          <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        </Link>
        <Link href="https://www.twitter.com/shailendrakrsk_">
          <Image
            src={'https://twitter.com/favicon.ico'}
            alt=""
            width={24}
            height={24}
          />
        </Link>
        <Link href="/">
          <Image src="/youtube.png" alt="youtube" width={24} height={24} />
        </Link>
      </div>
      <Link href="/">
        <div className={styles.logo}>BlogApp</div>
      </Link>
      <div className={styles.links}>
        <ThemeToggle />
        <Link
          href="/"
          className={`${styles.link} ${path === '/' ? styles.active : ''}`}
        >
          Home
        </Link>
        <Link
          href="/contact"
          className={`${styles.link} ${
            path === '/contact' ? styles.active : ''
          }`}
        >
          Contact
        </Link>
        <Link
          href="/about"
          className={`${styles.link} ${path === '/about' ? styles.active : ''}`}
        >
          About
        </Link>
        <Link
          href="/categories"
          className={`${styles.link} ${
            path === '/categories' ? styles.active : ''
          }`}
        >
          Tags
        </Link>
        <AuthLinks path={path} />
      </div>
    </div>
  );
}
