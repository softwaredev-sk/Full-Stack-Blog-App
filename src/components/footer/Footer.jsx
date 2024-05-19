import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Link href="/">
          <div className={styles.logo}>
            <Image src="/logo.png" alt="BlogApp" width={50} height={50} />
            <h4 className={styles.logoText}>BlogApp</h4>
          </div>
        </Link>
        <p className={styles.desc}>
          This is a blog app created by <b>Shailendra Kumar</b>. A dynamic blog
          application where users can publish their stories as articles.
          Features include user authentication, comments, and responsive design.
          Built with Next.js, firebase storage, MongoDB and Prisma.
        </p>
        <div className={styles.icons}>
          <Link href="https://www.facebook.com/shailendrakrsk">
            <Image src="/facebook.png" alt="" width={18} height={18} />
          </Link>
          <Link href="https://www.instagram.com/shailendrakrsk">
            <Image src="/instagram.png" alt="" width={18} height={18} />
          </Link>
          <Link href="https://www.twitter.com/shailendrakrsk_">
            <Image
              src={'https://twitter.com/favicon.ico'}
              alt=""
              width={18}
              height={18}
            />
          </Link>
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
          <Link href="/categories">Tags</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Tags</span>
          <Link href="/blog?cat=style">Tech</Link>
          <Link href="/blog?cat=coding">Coding</Link>
          <Link href="/blog?cat=travel">Travel</Link>
          <Link href="/blog?cat=fashion">Fashion</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link href="https://www.facebook.com/shailendrakrsk">Facebook</Link>
          <Link href="https://www.instagram.com/shailendrakrsk">Instagram</Link>
          <Link href="https://www.twitter.com/shailendrakrsk_">
            {'X (Twitter)'}
          </Link>
          <Link href="/">Youtube</Link>
        </div>
      </div>
    </div>
  );
}
