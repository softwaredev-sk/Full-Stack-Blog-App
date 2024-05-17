import Link from 'next/link';
import styles from './CategoryList.module.css';
import Image from 'next/image';

const getData = async () => {
  // const res = await fetch('http://localhost:3000/api/categories', {
  const res = await fetch(
    'https://full-stack-blog-app-sk.vercel.app/api/categories',
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function CategoryList() {
  const data = await getData();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Popular Categories</h2>
      <div className={styles.categories}>
        {data?.map((item) => (
          <Link
            href={`/blog?cat=${item.title}`}
            className={`${styles.category} ${styles[item.slug]}`}
            key={item._id}
          >
            {item.img && (
              <Image
                src={item.img}
                alt=""
                width={32}
                height={32}
                className={styles.image}
              />
            )}
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
