import Link from 'next/link';
import styles from './CategoryList.module.css';
import Image from 'next/image';
import CategoryItem from '../categoryItem/CategoryItem';

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
      <h2 className={styles.title}>
        {page === 1 ? 'Popular' : 'All'} Categories
        <Link href="/categories">
          {page === 1 && <sup className={styles.seeAll}>{' [See All]'}</sup>}
        </Link>
      </h2>
      <div className={styles.categories}>
        {data?.map((item) => (
          <CategoryItem
            category={item.title}
            key={item.title}
            customCss="categoryList"
          >
            {item.img && (
              <Image
                src={item.img}
                alt="tag image"
                width={32}
                height={32}
                className={styles.image}
              />
            )}
          </CategoryItem>
        ))}
      </div>
    </div>
  );
}
