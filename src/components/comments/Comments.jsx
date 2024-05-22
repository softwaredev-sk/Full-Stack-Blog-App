'use client';
import Link from 'next/link';
import styles from './Comments.module.css';
import Image from 'next/image';
import useSwr from 'swr';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import CategoryItem from '../categoryItem/CategoryItem';
import { AnimatePresence, motion } from 'framer-motion';
import ActionStatus from '../ActionStatus/ActionStatus';
import getLocalDateTime from '@/utils/getLocalTime';

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
  const [editing, setEditing] = useState(null);
  const [desc, setDesc] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [hasError, setHasError] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [uiLoading, setUiLoading] = useState(null);
  const ref = useRef();
  const editRef = useRef();
  const error = useRef();
  let lastError = useRef();
  let loadingRef = useRef();

  const { data, mutate, isLoading } = useSwr(
    `/api/comments/?postSlug=${postSlug}&commentPage=${commentPage}`,
    fetcher
  );

  async function handleSubmit(edit, id) {
    if (lastError.current) {
      clearTimeout(lastError.current);
    }
    if (loadingRef.current) {
      clearTimeout(loadingRef.current);
    }
    let method = 'POST';
    let comment = desc;
    let identifier = postSlug;
    if (edit) {
      method = 'PUT';
      comment = editDesc;
      identifier = id;
    }
    if (comment.trim()) {
      setUiLoading(true);
      await fetch('/api/comments', {
        method: method,
        body: JSON.stringify({ comment, identifier }),
      });
      await mutate();
      setDesc('');
      setEditing(null);
      setUiLoading(false);
      loadingRef.current = setTimeout(() => {
        loadingRef.current = null;
        setUiLoading(null);
      }, 2000);
      if (!edit) {
        setCommentPage(1);
      }
      return;
    }
    setHasError(true);
    setUiLoading(null);
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
    const res = await fetch(`/api/comments/?id=${id}&postSlug=${postSlug}`, {
      method: 'DELETE',
    });
    await mutate();
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    if (commentPage > data?.totalPageAfterDelete) {
      setCommentPage((prevCount) => prevCount - 1);
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

  function handleFetchComment(move) {
    setEditing(false);
    move === 'next'
      ? setCommentPage((prevCount) => prevCount + 1)
      : setCommentPage((prevCount) => prevCount - 1);
  }
  return (
    <>
      <div className={styles.container}>
        <h6 className={styles.title}>Comments</h6>
        {status === 'authenticated' ? (
          <div className={styles.write}>
            <motion.span ref={error}>
              <textarea
                key={error}
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
              {uiLoading === true && (
                <ActionStatus text="Sending" status="loading" iconSize={30} />
              )}
              {uiLoading === false && (
                <ActionStatus text="Sent" status="success" iconSize={20} />
              )}
              {uiLoading === null && <p className={styles.sendText}>Send</p>}
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
        <motion.div className={styles.comments}>
          {isLoading ? (
            <ActionStatus text="Loading" status="loading" iconSize={40} />
          ) : (
            <AnimatePresence mode="sync">
              {data?.comments?.length > 0 && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ y: -30, opacity: 0 }}
                >
                  <AnimatePresence>
                    {data?.comments?.map((item, index) => (
                      <motion.div
                        layout
                        key={index}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                        }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.comment}
                      >
                        <div className={styles.user}>
                          <Image
                            src={item?.user?.image}
                            alt="user image"
                            width={50}
                            height={50}
                            className={styles.image}
                          />
                          <div className={styles.userInfo}>
                            <span className={styles.username}>
                              {item.user.name}
                            </span>
                            <span className={styles.date}>
                              {getLocalDateTime(item?.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className={styles.editContainer}>
                          <span>
                            {item?.edited && (
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
                                  onClick={() =>
                                    handleDelete(item?.id, item?.postSlug)
                                  }
                                >
                                  Delete
                                </span>
                              ) : (
                                <span
                                  className={styles.cancel}
                                  onClick={handleCancel}
                                >
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
              {data?.comments?.length === 0 && (
                <motion.p
                  key="fallback"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  No Comments found.
                </motion.p>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.button}
          onClick={() => handleFetchComment('previous')}
          disabled={!data?.hasPrev}
        >
          Previous
        </button>
        {data?.comments?.length !== 0 && (
          <div>{`${commentPage}${
            data?.totalPage ? ' / ' + data?.totalPage : ''
          }`}</div>
        )}
        <button
          className={styles.button}
          onClick={() => handleFetchComment('next')}
          disabled={!data?.hasNext}
        >
          Next
        </button>
      </div>
    </>
  );
}
