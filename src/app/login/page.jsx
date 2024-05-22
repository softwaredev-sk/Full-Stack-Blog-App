'use client';
import { signIn, useSession } from 'next-auth/react';
import styles from './LoginPage.module.css';
import { useRouter } from 'next/navigation';
import ActionStatus from '@/components/ActionStatus/ActionStatus';
import Link from 'next/link';

export default function LoginPage({ searchParams }) {
  const redirectUrl = searchParams?.redirect ?? '';
  const { status } = useSession();

  const router = useRouter();
  const callbackUrl = redirectUrl ? `/posts/${redirectUrl}` : '/';

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <ActionStatus text="Loading" status="loading" iconSize={50} />
      </div>
    );
  }
  if (status === 'authenticated') {
    router.push('/');
  }

  return (
    <div className={styles.container}>
      <div>
        <p>
          Test Login Disabled for security reasons. Feel free to use Google or
          Github Login
        </p>
        <p>
          Use <Link href="/contact">Contact</Link> page to ask for test login
          access.
        </p>
      </div>
      <div className={styles.wrapper}>
        <button
          className={styles.socialButton}
          onClick={() =>
            signIn('google', {
              callbackUrl,
            })
          }
        >
          Sign in with Google
        </button>
        <button
          className={styles.socialButton}
          onClick={() =>
            signIn('github', {
              callbackUrl,
            })
          }
        >
          Sign in with Github
        </button>
        <button
          className={styles.testLoginButton}
          onClick={() =>
            signIn('credentials', {
              email: 'test@test.com',
              password: '123456',
              callbackUrl,
            })
          }
          // disabled
        >
          Sign in as Test User
        </button>
      </div>
    </div>
  );
}
