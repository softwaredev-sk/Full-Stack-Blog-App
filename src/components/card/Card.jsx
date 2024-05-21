import Image from 'next/image';
import styles from './Card.module.css';
import Link from 'next/link';
import CategoryItem from '../categoryItem/CategoryItem';
import getLocalDateTime from '@/utils/getLocalTime';

export default function Card({ item, key }) {
  return (
    <div className={styles.container} key={key}>
      {item?.img && (
        <div className={styles.imageContainer}>
          <Link href={`/posts/${item.slug}`}>
            <Image
              src={item.img}
              alt="post image"
              fill
              className={styles.image}
              sizes=""
            />
          </Link>
        </div>
      )}
      <div id="card" className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {getLocalDateTime(item?.createdAt).split(',')[0]}
          </span>
          {' - '}
          <CategoryItem
            category={item.catSlug}
            key={item.catSlug}
            customCss="categoryPill"
          />
        </div>
        <Link href={`/posts/${item.slug}`} className={styles.title}>
          <h3>{item.title}</h3>
        </Link>
        <p
          className={styles.desc}
          dangerouslySetInnerHTML={{ __html: `${item.desc}` }}
        />
        <Link href={`/posts/${item.slug}`} className={styles.link}>
          Read More...
        </Link>
      </div>
    </div>
  );
}
