import Image from 'next/image';
import styles from './Card.module.css';
import Link from 'next/link';

export default function Card({ item, key }) {
  return (
    <div className={styles.container} key={key}>
      {item?.img && (
        <div className={styles.imageContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>{item.createdAt.substring(0, 10)}</span>
          {' - '}
          <span className={styles.category}>{item.catSlug}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h3>{item.title}</h3>
        </Link>
        <p
          className={styles.desc}
          dangerouslySetInnerHTML={{ __html: `${item.desc}` }}
        />
        <Link href={`/posts/${item.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  );
}
