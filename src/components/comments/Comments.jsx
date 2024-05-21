'use client';
import Link from 'next/link';
import styles from './Comments.module.css';
import Image from 'next/image';
import useSwr from 'swr';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { ReactTyped } from 'react-typed';
import CategoryItem from '../categoryItem/CategoryItem';
import { motion } from 'framer-motion';

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
  const { data: sessionData, status } = useSession();
  const ref = useRef();
  const editRef = useRef();
  const [typing, setTyping] = useState();
  const [editing, setEditing] = useState(null);
  const [desc, setDesc] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [hasError, setHasError] = useState(false);
  const error = useRef();
  let lastError = useRef();

  const { data, mutate, isLoading } = useSwr(
    `/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  async function handleSubmit(edit, id) {
    if (lastError.current) {
      clearTimeout(lastError.current);
    }
    let method = 'POST';
    let comment = desc;
    let identifier = postSlug;
    if (edit) {
      method = 'PUT';
      comment = editDesc;
      identifier = id;
    }
    // console.log('m-', method, ' c- ', comment, ' idd- ', identifier);
    if (comment.trim()) {
      await fetch('/api/comments', {
        method: method,
        body: JSON.stringify({ comment, identifier }),
      });
      await mutate();
      setDesc('');
      setEditing(null);
      return;
    }
    setHasError(true);
    lastError.current = setTimeout(() => {
      lastError.current = null;
      setHasError(false);
    }, 2000);
  }

  async function handleDelete(id) {
    const proceed = window.confirm('Are you sure you want to delete?');
    if (!proceed) {
      return;
    }
    const res = await fetch(`/api/comments/?id=${id}`, {
      method: 'DELETE',
    });
    await mutate();
    if (!res.ok) {
      return;
    }
  }

  function handleEdit(editData, id) {
    setEditDesc(editData);
    setEditing(id);
  }

  function handleCancel() {
    setEditDesc('editData');
    setEditing(null);
  }

  return (
    <div className={styles.container}>
      <h6 className={styles.title}>Comments</h6>
      {status === 'authenticated' ? (
        <div className={styles.write}>
          <motion.span ref={error}>
            <textarea
              placeholder="write a comment..."
              className={`${styles.input} ${hasError ? styles.error : ''}`}
              onChange={() => setDesc(ref.current.value)}
              ref={ref}
              value={desc}
            />
          </motion.span>
          <button
            className={styles.button}
            onClick={() => handleSubmit(false, null)}
          >
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
            <>
              <div className={styles.comment} key={item._id}>
                <div className={styles.user}>
                  <Image
                    src={item?.user?.image}
                    alt="user image"
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

                <div className={styles.editContainer}>
                  <span>
                    {item.edited && (
                      <CategoryItem
                        category="edited"
                        customCss="edited"
                        edited
                      />
                    )}
                  </span>
                  {sessionData?.user?.email === item.user.email && (
                    <div className={styles.commentActions}>
                      {!editing || editing !== item.id ? (
                        <span
                          className={styles.danger}
                          onClick={() => handleDelete(item?.id)}
                        >
                          Delete
                        </span>
                      ) : (
                        <span className={styles.cancel} onClick={handleCancel}>
                          Cancel
                        </span>
                      )}
                      {editing && editing === item.id ? (
                        <span
                          className={styles.edit}
                          onClick={() => handleSubmit(true, item.id)}
                        >
                          Save
                        </span>
                      ) : (
                        <span
                          className={styles.edit}
                          onClick={() => handleEdit(item.desc, item.id)}
                        >
                          Edit
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {editing && editing === item.id ? (
                  <input
                    type="text"
                    value={editDesc}
                    ref={editRef}
                    className={styles.editInput}
                    onChange={() => setEditDesc(editRef.current.value)}
                  />
                ) : (
                  <p className={styles.desc}>{item.desc}</p>
                )}
              </div>
            </>
          ))
        )}
      </div>
    </div>
  );
}
