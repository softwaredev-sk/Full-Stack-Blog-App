'use client';
import Image from 'next/image';
import styles from './WritePage.module.css';
import React, { useEffect, useRef, useState } from 'react';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '@/utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ActionStatus from '@/components/ActionStatus/ActionStatus';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <ActionStatus text="Loading" status="Loading" iconSize={30} />,
});

const getData = async () => {
  const res = await fetch(`/api/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

const getPostData = async (slug) => {
  const res = await fetch(`/api/posts/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default function WritePage({ searchParams }) {
  const { status } = useSession();

  const edit = searchParams.edit || false;

  const router = useRouter();

  const [file, setFile] = useState(null);
  const [media, setMedia] = useState('/p1.jpeg');
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [catSlug, setCatSlug] = useState('untagged');
  const [hasError, setHasError] = useState({
    hasError: false,
    flag: null,
    errorMsg: '',
  });
  const [progress, setProgress] = useState(null);
  const [uploadSuccessful, setUploadSuccessful] = useState(null);
  const [catData, setCatData] = useState(null);
  const [published, setPublished] = useState(null);
  const [publishMethod, setPublishMethod] = useState('POST');
  const [editPostSlug, setEditPostSlug] = useState(null);
  const [cancelling, setCacelling] = useState(false);
  const [mounted, setMounted] = useState(false);
  let lastError = useRef();

  useEffect(() => {
    async function fetchData() {
      const catData = await getData();
      setCatData(catData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    function handleEventListenerState(e) {
      if (
        (e.target.tagName.toLowerCase() !== 'IMG'.toLowerCase() &&
          e.target.tagName.toLowerCase() !== 'input'.toLowerCase() &&
          e.target.tagName.toLowerCase() !== 'button'.toLowerCase() &&
          e.type.toLowerCase() === 'click'.toLowerCase()) ||
        (e.type.toLowerCase() === 'keydown'.toLowerCase() &&
          e.key.toLowerCase() === 'Escape'.toLowerCase())
      ) {
        setOpen(false);
      }
    }

    document.body.addEventListener('click', (e) => handleEventListenerState(e));
    document.body.addEventListener('keydown', (e) =>
      handleEventListenerState(e)
    );

    return () => {
      document.body.removeEventListener('click', handleEventListenerState);
      document.body.removeEventListener('keydown', handleEventListenerState);
    };
  }, []);

  useEffect(() => {
    const storage = getStorage(app);

    const upload = () => {
      const name = new Date().getTime();
      const storageRef = ref(storage, name + file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setUploadSuccessful(false);
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          // switch (snapshot.state) {
          //   case 'paused':
          //     console.log('Upload is paused');
          //     break;
          //   case 'running':
          //     console.log('Upload is running');
          //     break;
          // }
          setProgress(progress);
        },
        (error) => {
          handleError(
            'Image size too large. Please upload image smaller than 200 KB',
            'upload'
          );
          setProgress(null);
          setMedia('/p1.jpeg');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            setMedia(downloadURL);
          });
          setUploadSuccessful(true);
          setTimeout(() => {
            setProgress(null);
          }, 1200);
        }
      );
    };

    file && upload();
    setOpen(false);
  }, [file]);

  useEffect(() => {
    async function fetchPostData() {
      if (!edit) {
        setMounted(true);
        return;
      }
      const postData = await getPostData(edit);
      if (postData.statusCode !== 200) {
        router.push('/write');
      }
      setDesc(postData?.post?.desc);
      setTitle(postData?.post?.title);
      setCatSlug(postData?.post?.catSlug);
      setMedia(postData?.post?.img);
      setEditPostSlug(postData?.post?.id);
      setPublishMethod('PUT');
      setMounted(true);
    }
    fetchPostData();
  }, [edit, router]);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <ActionStatus text="Loading" status="loading" iconSize={30} />
      </div>
    );
  }
  if (status === 'unauthenticated') {
    router.push('/login');
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  async function handleSubmit() {
    setPublished(false);
    if (
      !title.trim() ||
      desc.trim().length < 100
      // || uploadSuccessful === false
    ) {
      handleError(
        "Title can't be empty and story need to be at least 100 characters long.",
        'validation failed'
      );

      setPublished(null);
      return;
    }

    if (uploadSuccessful === false) {
      const proceed = window.confirm(
        'Upload Failed! Are you sure to proceed without an image?'
      );
      if (!proceed) {
        setPublished(null);
        return;
      }
    }

    const date = new Date();
    const slugSalt = slugify(title) + '-' + date.getTime();
    const res = await fetch('/api/posts', {
      method: publishMethod,
      body: JSON.stringify({
        data: {
          title: title.trim(),
          desc: desc.trim(),
          img: media,
          // slug: slugify(title),
          slug: slugSalt,
          catSlug: catSlug || 'untagged',
        },
        identifier: editPostSlug,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      setPublished(true);
      router.push(`/posts/${data.slug}`);
    }
  }

  function handleError(msg, flag) {
    if (lastError.current) {
      clearTimeout(lastError.current);
    }
    setHasError((prevState) => {
      return {
        ...prevState,
        hasError: true,
        flag,
        errorMsg: msg,
      };
    });
    lastError.current = setTimeout(() => {
      lastError.current = null;
      setHasError((prevState) => {
        return {
          ...prevState,
          hasError: false,
          flag: null,
          errorMsg: '',
        };
      });
    }, 2000);
  }

  if (status === 'authenticated') {
    return (
      <>
        {!mounted && (
          <ActionStatus text="Please Wait!" status="loading" iconSize={30} />
        )}
        {mounted && (
          <div className={styles.container}>
            <AnimatePresence>
              {hasError.hasError && (
                <motion.div
                  key="error"
                  animate={{
                    x: [2, -2],
                    transition: { duration: 0.2, repeat: 2 },
                  }}
                  className={`${styles.errorData}`}
                >
                  <Image
                    src="/error.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={styles.errorImg}
                  />{' '}
                  {hasError.errorMsg ||
                    ' Some Error Occurred, please try again after sometime.'}
                </motion.div>
              )}
            </AnimatePresence>
            {published === false && (
              <ActionStatus text="Publishing" status="loading" iconSize={30} />
            )}
            {published === true && (
              <ActionStatus text="Published" status="success" iconSize={25} />
            )}
            <input
              type="text"
              placeholder="Title"
              value={title}
              className={styles.input}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.extraContainer}>
              <div className={styles.selectContainer}>
                <label htmlFor="category" className={styles.label}>
                  Category
                </label>
                <select
                  id="category"
                  className={styles.select}
                  onChange={(e) => setCatSlug(e.target.value)}
                  defaultValue="untagged"
                  value={catSlug}
                >
                  {catData &&
                    catData.map((item) => {
                      return (
                        <option
                          key={item.title}
                          value={item.title}
                          disabled={item.title === 'untagged'}
                          hidden={item.title === 'untagged'}
                        >
                          {item.title}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className={styles.addContainer}>
                <div className={styles.buttonSuccessful}>
                  <button
                    className={`${styles.button} ${open && styles.open}`}
                    onClick={() => setOpen((prevState) => !prevState)}
                  >
                    <Image src="/plus.svg" alt="" width={16} height={16} />
                  </button>
                  {uploadSuccessful && (
                    <ActionStatus
                      text="Upload Successful"
                      status="success"
                      iconSize={30}
                    />
                  )}
                  {hasError.flag === 'upload' && (
                    <div className={styles.successful}>
                      Upload Failed{' '}
                      <Image
                        src="/error.svg"
                        alt=""
                        width={16}
                        height={16}
                        className={styles.errorImg}
                      />
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="addButton"
                      className={styles.add}
                      animate={{
                        opacity: [0, 1],
                        x: [600, 0],
                        originX: 0,
                      }}
                      exit={{ x: [0, 400], opacity: [1, 0] }}
                    >
                      <input
                        type="file"
                        id="image"
                        onChange={(e) => setFile(e.target.files[0])}
                        className={styles.hiddenInput}
                      />
                      <button className={styles.addButton}>
                        <label htmlFor="image" className={styles.label}>
                          <Image
                            src="/image.png"
                            alt=""
                            width={16}
                            height={16}
                          />
                        </label>
                      </button>
                      <button className={styles.addButton}>
                        <label htmlFor="image" className={styles.label}>
                          <Image
                            src="/external.png"
                            alt=""
                            width={16}
                            height={16}
                          />
                        </label>
                      </button>
                      <button className={styles.addButton}>
                        <label htmlFor="image" className={styles.label}>
                          <Image
                            src="/video.png"
                            alt=""
                            width={20}
                            height={20}
                          />
                        </label>
                      </button>
                      <motion.div
                        className={styles.span}
                        animate={{ x: [1000, 0] }}
                        exit={{ x: [0, 1000] }}
                      >
                        <b>NOTE:</b> Max file size: 200 KB
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {progress > 0 && <progress value={progress} max="100"></progress>}
            <div className={styles.editor}>
              <ReactQuill
                className={styles.textArea}
                theme="bubble"
                value={desc}
                onChange={setDesc}
                placeholder="Let the world know your thoughts..."
              />
            </div>
            <>
              {edit && (
                <Link href={`/posts/${edit}`} className={styles.cancelPublish}>
                  <button
                    className={styles.publish}
                    type="button"
                    onClick={() => setCacelling(true)}
                  >
                    {cancelling ? (
                      <ActionStatus
                        text="Cancelling"
                        status="loading"
                        iconSize={20}
                      />
                    ) : (
                      'Cancel'
                    )}
                  </button>
                </Link>
              )}
              <button
                className={styles.publish}
                onClick={handleSubmit}
                disabled={published !== null}
              >
                Publish
              </button>
            </>
          </div>
        )}
      </>
    );
  }
}
