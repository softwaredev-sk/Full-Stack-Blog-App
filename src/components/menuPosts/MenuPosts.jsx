import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuPosts.module.css';
import CategoryItem from '../categoryItem/CategoryItem';
import LocalDateTime from '../LocalDateTime/LocalDateTime';

const getData = async (withImage) => {
  const res = await fetch(
    `${process.env.PROD_URL}/api/posts/?popular=${withImage}`,
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
      {menuPosts?.length > 0 &&
        menuPosts?.map((item) => (
          <div
            // Link
            // href={`/posts/${item.slug}`}
            className={styles.item}
            key={item._id}
          >
            {withImage && (
              <Link
                href={`/posts/${item.slug}`}
                className={styles.imageContainer}
              >
                <Image
                  src={item.img ?? '/p1.jpeg'}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes=""
                />
              </Link>
            )}
            <div className={styles.textContainer}>
              {item?.catSlug && (
                <CategoryItem
                  category={item?.catSlug}
                  key={item?.catSlug}
                  customCss="categoryPillSmall"
                />
              )}
              <Link href={`/posts/${item.slug}`} className={styles.postTitle}>
                {item.title}
              </Link>
              <div className={styles.detail}>
                <span className={styles.username}>
                  {item.user.name.split(' ')[0]}
                </span>
                {' - '}
                <span className={styles.date}>
                  <LocalDateTime date={item?.createdAt} />
                </span>
              </div>
            </div>
          </div>
        ))}
      {menuPosts?.length === 0 && (
        <p>
          {withImage ? 'No post picked by editor. ' : 'No posts found. '}How
          about{' '}
          <Link href="/write">
            <b>expanding</b>
          </Link>{' '}
          the collection?
          <Link href="/write">
            <b> Write</b>
          </Link>{' '}
          a post!
        </p>
      )}
    </div>
  );
}
