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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae quod
          dolore explicabo ad ea! At, veniam est, cumque sequi similique quidem
          deserunt perspiciatis doloremque vero eos aliquam labore mollitia in?
        </p>
        <div className={styles.icons}>
          <Image src="/facebook.png" alt="" width={18} height={18} />
          <Image src="/instagram.png" alt="" width={18} height={18} />
          <Image src="/youtube.png" alt="" width={18} height={18} />
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Links</span>
          <Link href="/">Home</Link>
          <Link href="/">Blog</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Tags</span>
          <Link href="/">Style</Link>
          <Link href="/">Fashion</Link>
          <Link href="/">Coding</Link>
          <Link href="/">Travel</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link href="/">Facebook</Link>
          <Link href="/">Instagram</Link>
          <Link href="/">Youtube</Link>
        </div>
      </div>
    </div>
  );
}
