import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

const getData = async (fieldname) => {
  const res = await fetch(
    `${process.env.PROD_URL}/api/bloginfo/?fieldname=${fieldname}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};
export default async function Footer() {
  const { info } = await getData('summary');
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="BlogApp logo" width={50} height={50} />
          <h4 className={styles.logoText}>BlogApp</h4>
        </Link>
        {info && (
          <p
            className={styles.desc}
            dangerouslySetInnerHTML={{ __html: info }}
          />
        )}
        <div className={styles.icons}>
          <Link href="https://www.facebook.com/shailendrakrsk">
            <Image src="/facebook.png" alt="facebook" width={18} height={18} />
          </Link>
          <Link href="https://www.instagram.com/shailendrakrsk">
            <Image
              src="/instagram.png"
              alt="instagram"
              width={18}
              height={18}
            />
          </Link>
          <Link href="https://www.twitter.com/shailendrakrsk_">
            <Image
              src={'https://twitter.com/favicon.ico'}
              alt="X (Twitter)"
              width={18}
              height={18}
            />
          </Link>
          <Link href="/">
            <Image src="/youtube.png" alt="youtube" width={18} height={18} />
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
