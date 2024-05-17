'use client';
import Link from 'next/link';
import styles from './AuthLinks.module.css';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AuthLinks() {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(true);

  const { data, status } = useSession();
  // console.log('thisis', data);

  useEffect(() => {
    if (open) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = null;
      document.body.style.width = 'initial';
    }
  }, [open]);

  return (
    <>
      {status === 'unauthenticated' ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <>
          <div className={styles.imageContainer}>
            {/* <Link href="/profile"> */}
            <Image
              src={data?.user.image}
              alt=""
              className={styles.profile}
              fill
            />
            {/* </Link> */}
            {openProfile && (
              <div className={styles.profileMenu}>
                <Link href="/write" className={styles.link}>
                  Write
                </Link>
                <span className={styles.link} onClick={signOut}>
                  Logout
                </span>
              </div>
            )}
          </div>
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
