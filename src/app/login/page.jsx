'use client';
import { signIn, useSession } from 'next-auth/react';
import styles from './LoginPage.module.css';
import { useRouter } from 'next/navigation';
import { ReactTyped } from 'react-typed';
import { useState } from 'react';

export default function LoginPage({ searchParams }) {
  const redirectUrl = searchParams?.redirect ?? '';
  const { status } = useSession();
  const [typing, setTyping] = useState();

  const router = useRouter();
  const callbackUrl = redirectUrl ? `/posts/${redirectUrl}` : '/';
  console.log('R- ', redirectUrl, ' C- ', callbackUrl, ' SP- ', searchParams);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        Loading{' .'}
        <ReactTyped
          typedRef={setTyping}
          showCursor={false}
          strings={['...']}
          typeSpeed={300}
          loop
        />
      </div>
    );
  }
  if (status === 'authenticated') {
    router.push('/');
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div
          className={styles.socialButton}
          onClick={() =>
            signIn('google', {
              callbackUrl,
            })
          }
        >
          Sign in with Google
        </div>
        <div
          className={styles.socialButton}
          onClick={() =>
            signIn('github', {
              callbackUrl,
            })
          }
        >
          Sign in with Github
        </div>
        <div
          className={styles.testLoginButton}
          onClick={() =>
            signIn('credentials', {
              email: 'test@test.com',
              password: '123456',
              callbackUrl,
            })
          }
        >
          Sign in as Test User
        </div>
      </div>
    </div>
  );
}
