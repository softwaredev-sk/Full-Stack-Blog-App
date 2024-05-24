import Image from 'next/image';
import styles from './Featured.module.css';
import Link from 'next/link';

const getData = async () => {
  const res = await fetch(`${process.env.PROD_URL}/api/posts/?featured=true`, {
    cache: 'no-store',
  });

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
        <b>Hey there, Welcome!</b> Discover new stories and creative ideas.
      </h1>
      {featuredPost && (
        <div className={styles.post}>
          <div className={styles.imgContainer}>
            <Image
              src={featuredPost?.img}
              alt="post image"
              fill
              className={styles.image}
              sizes=""
            />
          </div>
          <div className={styles.textContainer}>
            <div className={styles.mostViewed}>Most Viewed</div>
            <h2 className={styles.postTitle}>{featuredPost?.title}</h2>
            <p
              className={styles.postDesc}
              dangerouslySetInnerHTML={{
                __html: `${featuredPost?.desc}`,
              }}
            />
            <Link href={`/posts/${featuredPost?.slug}`}>
              <button className={styles.button}>Read More!</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
