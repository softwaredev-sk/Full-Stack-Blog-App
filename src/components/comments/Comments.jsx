'use client';
import Link from 'next/link';
import styles from './Comments.module.css';
import Image from 'next/image';
import useSwr from 'swr';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { ReactTyped } from 'react-typed';

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

export default function Comments({ postSlug }) {
  const { status } = useSession();
  const ref = useRef();
  const [typing, setTyping] = useState();

  const { data, mutate, isLoading } = useSwr(
    `/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  const [desc, setDesc] = useState('');

  async function handleSubmit() {
    if (desc.trim()) {
      await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ desc, postSlug }),
      });
      await mutate();
      setDesc('');
    }
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Comments</h4>
      {status === 'authenticated' ? (
        <div className={styles.write}>
          <textarea
            placeholder="write a comment..."
            className={styles.input}
            onChange={() => setDesc(ref.current.value)}
            ref={ref}
            value={desc}
          />
          <button className={styles.button} onClick={handleSubmit}>
            Send
          </button>
        </div>
      ) : (
        <>
          <Link href={`/login/?redirect=${postSlug}`}>
            <b>Login</b>
          </Link>
          {' to write a comment'}
        </>
      )}
      <div className={styles.comments}>
        {isLoading ? (
          <>
            <p>
              Loading{' .'}
              <ReactTyped
                typedRef={setTyping}
                showCursor={false}
                strings={['...']}
                typeSpeed={300}
                loop
              />
            </p>
          </>
        ) : (
          data?.map((item) => (
            <div className={styles.comment} key={item._id}>
              <div className={styles.user}>
                <Image
                  src={item.user.image}
                  alt=""
                  width={50}
                  height={50}
                  className={styles.image}
                />
                <div className={styles.userInfo}>
                  <span className={styles.username}>{item.user.name}</span>
                  <span className={styles.date}>
                    {item.createdAt.substring(8, 10) +
                      '-' +
                      item.createdAt.substring(5, 7) +
                      '-' +
                      item.createdAt.substring(0, 4)}
                  </span>
                </div>
              </div>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
