import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuPosts.module.css';

const getData = async (withImage) => {
  const res = await fetch(
    `${process.env.PROD_URL}/api/posts/?popular=${withImage || ''}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function MenuPosts({ withImage }) {
  const { popularPosts } = await getData(withImage ? 'false' : 'true');
  // console.log('popular', popularPosts);

  return (
    <div className={styles.items}>
      {popularPosts &&
        popularPosts.map((item) => (
          <Link
            href={`/posts/${item.slug}`}
            className={styles.item}
            key={popularPosts._id}
          >
            {withImage && (
              <div className={styles.imageContainer}>
                <Image
                  src={item.img ?? '/p1.jpeg'}
                  alt=""
                  fill
                  className={styles.image}
                  sizes=""
                />
              </div>
            )}
            <div className={styles.textContainer}>
              <span className={`${styles.category} ${styles[item.catSlug]}`}>
                {item.catSlug}
              </span>
              <h5 className={styles.postTitle}>{item.title}</h5>
              <div className={styles.detail}>
                <span className={styles.username}>
                  {item.user.name.split(' ')[0]}
                </span>
                {' - '}
                <span className={styles.date}>
                  {item.createdAt.split('T')[0]}
                </span>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
