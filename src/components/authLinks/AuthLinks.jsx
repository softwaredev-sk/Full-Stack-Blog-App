'use client';
import Link from 'next/link';
import styles from './AuthLinks.module.css';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AuthLinks({ path }) {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { data, status } = useSession();

  useEffect(() => {
    function handleState(e) {
      if (
        (e.target.tagName.toLowerCase() !== 'IMG'.toLowerCase() &&
          e.target.tagName.toLowerCase() !== 'span'.toLowerCase() &&
          e.type.toLowerCase() === 'click'.toLowerCase()) ||
        (e.type.toLowerCase() === 'keydown'.toLowerCase() &&
          e.key.toLowerCase() === 'Escape'.toLowerCase())
      ) {
        setOpenProfile(false);
      }
    }
    document.body.addEventListener('click', (e) => handleState(e));
    document.body.addEventListener('keydown', (e) => handleState(e));

    return () => {
      document.body.removeEventListener('click', handleState);
      document.body.removeEventListener('keydown', handleState);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = 'initial';
      document.body.style.width = 'initial';
    }
  }, [open]);

  return (
    <>
      {status === 'unauthenticated' ? (
        <Link
          href="/login"
          className={`${styles.link} ${path === '/login' ? styles.active : ''}`}
        >
          Login
        </Link>
      ) : (
        <>
          <div className={styles.imageContainer}>
            <Image
              src={data?.user.image}
              alt=""
              className={styles.profile}
              fill
              onClick={() => {
                setOpenProfile((prevState) => !prevState);
              }}
            />
            {openProfile && (
              <div className={styles.profileMenu} key="menu">
                <Link
                  href="/write"
                  className={`${styles.link} ${
                    path === '/write' ? styles.active : ''
                  }`}
                >
                  Write
                </Link>
                <Link
                  href="/profile"
                  className={`${styles.link} ${
                    path === '/profile' ? styles.active : ''
                  }`}
                >
                  Profile
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
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`${styles.link} ${path === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`${styles.link} ${
              path === '/about' ? styles.active : ''
            }`}
          >
            About
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`${styles.link} ${
              path === '/contact' ? styles.active : ''
            }`}
          >
            Contact
          </Link>
          {status === 'unauthenticated' ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={`${styles.link} ${
                path === '/login' ? styles.active : ''
              }`}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/write"
                className={`${styles.link} ${
                  path === '/profile' ? styles.active : ''
                }`}
              >
                Profile
              </Link>
              <Link
                href="/write"
                className={`${styles.link} ${
                  path === '/login' ? styles.active : ''
                }`}
              >
                Write
              </Link>
              <span className={styles.link} onClick={signOut}>
                Logout
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
}
