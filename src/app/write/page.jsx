'use client';
import Image from 'next/image';
import styles from './WritePage.module.css';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
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
// import dynamic from 'next/dynamic';

export default function WritePage() {
  const { status } = useSession();
  // const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

  const router = useRouter();

  const [file, setFile] = useState(null);
  const [media, setMedia] = useState('');
  const [title, setTitle] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    const storage = getStorage(app);
    const upload = () => {
      const name = new Date().getTime();
      const storageRef = ref(storage, name + file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.log(error.code);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            setMedia(downloadURL);
          });
        }
      );
    };

    file && upload();
  }, [file]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }
  if (status === 'unauthenticated') {
    router.push('/');
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  async function handleSubmit() {
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        slug: slugify(title),
        catSlug: 'travel',
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    }
  }

  if (status === 'authenticated') {
    return (
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Title"
          className={styles.input}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* <input type="text" placeholder="category" /> To be worked */}
        <div className={styles.editor}>
          <button
            className={styles.button}
            onClick={() => setOpen((prevState) => !prevState)}
          >
            <Image src="/plus.png" alt="" width={16} height={16} />
          </button>
          {open && (
            <div className={styles.add}>
              <input
                type="file"
                id="image"
                onChange={(e) => setFile(e.target.files[0])}
                className={styles.hiddenInput}
              />
              <button className={styles.addButton}>
                <label htmlFor="image" className={styles.label}>
                  <Image src="/image.png" alt="" width={16} height={16} />
                </label>
              </button>
              <button className={styles.addButton}>
                <Image src="/external.png" alt="" width={16} height={16} />
              </button>
              <button className={styles.addButton}>
                <Image src="/video.png" alt="" width={16} height={16} />
              </button>
            </div>
          )}
          <ReactQuill
            className={styles.textArea}
            theme="bubble"
            value={value}
            onChange={setValue}
            placeholder="Let the world know your thoughts..."
          />
        </div>
        <button className={styles.publish} onClick={handleSubmit}>
          Publish
        </button>
      </div>
    );
  }
}
