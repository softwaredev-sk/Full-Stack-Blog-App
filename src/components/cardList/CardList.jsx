import React from 'react';
import styles from './CardList.module.css';
import Pagination from '../pagination/Pagination';
import Card from '../card/Card';
import Link from 'next/link';

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
  const { posts, hasPrev, hasNext, totalPage } = await getData(page, cat);

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} ${page !== 1 && styles.underlineTitle}`}>
        {page === 1 ? 'Recent Posts' : `Page ${page} out of ${totalPage}`}
      </h2>
      <div className={styles.posts}>
        {posts?.length === 0 && (
          <>
            <p>
              No Posts found{cat && ' for the selected category'}. How about{' '}
              <Link href="/write">
                <b>expanding</b>
              </Link>{' '}
              the {"posts'"} collection?
            </p>
            <Link href="/write">
              <b>Write</b>
            </Link>{' '}
            a post!
          </>
        )}
        {posts?.map((item) => (
          <Card item={item} key={item._id} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} cat={cat} />
    </div>
  );
}
