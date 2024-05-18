import Link from 'next/link';
import styles from './CategoryList.module.css';
import Image from 'next/image';

const getData = async () => {
  const res = await fetch(`${process.env.PROD_URL}/api/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function CategoryList({ page }) {
  let data = await getData();
  if (page === 1) {
    data = data.slice(0, 4);
  }
  return (
    <div className={styles.container}>
      <Link href="/categories">
        <h2 className={styles.title}>
          Popular Categories{' '}
          <span className={styles.seeAll}>{'[See All]'}</span>
        </h2>
      </Link>
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
