import React from 'react';
import styles from './CardList.module.css';
import Pagination from '../pagination/Pagination';
import Card from '../card/Card';

const getData = async (page, cat) => {
  const res = await fetch(
    `${process.env.PROD_URL}/api/posts/?page=${page}&cat=${cat || ''}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function CardList({ page, cat }) {
  const { posts, hasPrev, hasNext } = await getData(page, cat);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {page === 1 ? 'Recent Posts' : 'Browse through posts!'}
      </h2>
      <div className={styles.posts}>
        {posts?.map((item) => (
          <Card item={item} key={item._id} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
}
