'use client';
import Link from 'next/link';
import styles from './AuthLinks.module.css';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function AuthLinks() {
  const [open, setOpen] = useState(false);

  const { status } = useSession();

  return (
    <>
      {status === 'unauthenticated' ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <>
          <Link href="/write" className={styles.link}>
            Write
          </Link>
          <span className={styles.link} onClick={signOut}>
            Logout
          </span>
        </>
      )}
      <div
        className={styles.burger}
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/" onClick={() => setOpen(false)}>
            Contact
          </Link>
          {status === 'unauthenticated' ? (
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              <Link href="/write">Write</Link>
              <span className={styles.link}>Logout</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
