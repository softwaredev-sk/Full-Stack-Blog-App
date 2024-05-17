import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="BlogApp" width={50} height={50} />
          <h4 className={styles.logoText}>BlogApp</h4>
        </div>
        <p className={styles.desc}>
          This is a blog app created by <b>Shailendra Kumar</b>.
        </p>
        <div className={styles.icons}>
          <Link href="https://www.facebook.com/shailendrakrsk">
            <Image src="/facebook.png" alt="" width={18} height={18} />
          </Link>
          <Link href="https://www.instagram.com/shailendrakrsk">
            <Image src="/instagram.png" alt="" width={18} height={18} />
          </Link>{' '}
          <Link href="/">
            <Image src="/youtube.png" alt="" width={18} height={18} />
          </Link>
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Links</span>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Tags</span>
          <Link href="/blog?cat=coding">Coding</Link>
          <Link href="/blog?cat=travel">Travel</Link>
          <Link href="/blog?cat=fashion">Fashion</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link href="https://www.facebook.com/shailendrakrsk">Facebook</Link>
          <Link href="https://www.instagram.com/shailendrakrsk">Instagram</Link>
          <Link href="/">Youtube</Link>
        </div>
      </div>
    </div>
  );
}
