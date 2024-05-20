import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuPosts.module.css';
import CategoryItem from '../categoryItem/CategoryItem';

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
  const { menuPosts } = await getData(withImage ? 'false' : 'true');

  return (
    <div className={styles.items}>
      {menuPosts &&
        menuPosts.map((item) => (
          <Link
            href={`/posts/${item.slug}`}
            className={styles.item}
            key={menuPosts._id}
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
              {item?.catSlug && (
                <CategoryItem
                  category={item?.catSlug}
                  key={item?.catSlug}
                  customCss="categoryPillSmall"
                />
              )}
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
