import { getAuthSession } from '@/utils/auth';
import Image from 'next/image';
import styles from './Profile.module.css';
import Link from 'next/link';

const getData = async (email) => {
  const res = await fetch(`${process.env.PROD_URL}/api/users/?user=${email}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function Profile() {
  const session = await getAuthSession();
  if (!session) {
    return (
      <div className={styles.notLoggedIn}>
        Please{' '}
        <Link href="/login" className={styles.link}>
          {' '}
          login{' '}
        </Link>{' '}
        first to view your profile.
      </div>
    );
  }

  const { postCount, commentsCount } = await getData(session.user.email);
  return (
    <div className={styles.container}>
      {session?.user && (
        <div className={styles.imageContainer}>
          <Image
            src={session.user.image.replace('s96', 's400')}
            alt=""
            width={250}
            height={250}
            className={styles.image}
            sizes=""
          />
        </div>
      )}
      <div className={styles.detailContainer}>
        <h1>Hey, {session?.user?.name}</h1>
        <h2>Your Record:</h2>
        <p>
          <b>Name:</b> {session?.user?.name}
        </p>
        <p>
          <b>Email:</b> {session?.user?.email}
        </p>
        <p>
          <b>Total Posts:</b> {postCount}
        </p>
        <p>
          <b>Total Comments:</b> {commentsCount}
        </p>
      </div>
    </div>
  );
}
