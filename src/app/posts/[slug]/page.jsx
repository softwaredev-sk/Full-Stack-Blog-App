import Image from 'next/image';
import styles from './SinglePage.module.css';
import Comments from '@/components/comments/Comments';
import Menu from '@/components/menu/Menu';
import { notFound } from 'next/navigation';
import CategoryItem from '@/components/categoryItem/CategoryItem';
import EditAction from '@/components/edit/EditAction';
import LocalDateTime from '@/components/LocalDateTime/LocalDateTime';
import PageProgress from '@/components/PageProgress.jsx/PageProgress';

const getData = async (slug) => {
  const res = await fetch(`${process.env.PROD_URL}/api/posts/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export async function generateMetadata({ params }) {
  const post = await getData(params.slug);
  if (!post) {
    notFound();
  }

  return {
    title: post?.post?.title,
    description: 'Read amazing article on "' + post?.post?.title + '"',
  };
}

export default async function SinglePage({ params }) {
  const { slug } = params;

  const data = await getData(slug);

  if (data.statusCode !== 200) {
    notFound();
  }

  return (
    <>
      <div className={styles.container}>
        {data?.post && <PageProgress />}
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
                    src={data?.post.user.image}
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
                  <LocalDateTime date={data?.post?.createdAt} />
                  <span className={styles.updateDate}>
                    {data?.post?.edited && (
                      <>
                        {'[Updated] '}
                        <LocalDateTime date={data?.post?.postUpdatedAt} />
                      </>
                    )}
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
              id="post"
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
    </>
  );
}
