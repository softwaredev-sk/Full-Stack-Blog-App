import Image from 'next/image';
import styles from './SinglePage.module.css';
import Comments from '@/components/comments/Comments';
import Menu from '@/components/menu/Menu';
import { notFound } from 'next/navigation';
import CategoryItem from '@/components/categoryItem/CategoryItem';
import { getAuthSession } from '@/utils/auth';
import EditAction from '@/components/edit/EditAction';
import getLocalDateTime from '@/utils/getLocalTime';

const getData = async (slug) => {
  const res = await fetch(`${process.env.PROD_URL}/api/posts/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function SinglePage({ params }) {
  const { slug } = params;

  const data = await getData(slug);

  if (data.statusCode !== 200) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          {data?.post?.catSlug && (
            <CategoryItem
              category={data?.post.catSlug}
              key={data?.post.catSlug}
              customCss="categoryPill"
            />
          )}
          <h1 className={styles.title}>{data?.post.title}</h1>

          <div className={styles.user}>
            {data?.post?.user.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={data.post.user.image}
                  alt=""
                  fill
                  className={styles.avatar}
                  sizes=""
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.post.user?.name}</span>
              <span className={styles.date}>
                <span>{getLocalDateTime(data?.post?.createdAt)}</span>
                <span className={styles.updateDate}>
                  {data?.post?.edited &&
                    '[Updated] ' + getLocalDateTime(data?.post?.postUpdatedAt)}
                </span>
              </span>
            </div>
          </div>
        </div>
        {data?.post.img && (
          <div className={styles.imageContainer}>
            <Image
              src={data?.post.img}
              alt=""
              fill
              className={styles.image}
              sizes=""
            />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <span>
            {data?.post?.edited && (
              <CategoryItem category="edited" customCss="edited" edited />
            )}
          </span>

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: `${data?.post.desc}` }}
          />
          <EditAction postData={data?.post} />
          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu hideIt={true} />
      </div>
    </div>
  );
}
