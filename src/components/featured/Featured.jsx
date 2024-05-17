import Image from 'next/image';
import styles from './Featured.module.css';
import Link from 'next/link';

const getData = async (page, cat) => {
  const res = await fetch(
    // `http://localhost:3000/api/posts?page=${page || ''}&cat=${
    `https://full-stack-blog-app-sk.vercel.app/api/posts?page=${
      page || ''
    }&cat=${cat || ''}&featured=true`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function Featured() {
  const { featuredPost } = await getData();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey there, SK here!</b> Discover my stories and creative ideas.
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image src="/p1.jpeg" alt="" fill className={styles.image} />
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.postTitle}>{featuredPost?.title}</h2>
          <p
            className={styles.postDesc}
            dangerouslySetInnerHTML={{ __html: `${featuredPost?.desc}` }}
          />
          <Link href={`/posts/${featuredPost?.slug}`}>
            <button className={styles.button}>Read More!</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
