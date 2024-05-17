import Image from 'next/image';
import styles from './SinglePage.module.css';
import Comments from '@/components/comments/Comments';
import Menu from '@/components/menu/Menu';
import { notFound } from 'next/navigation';

const getData = async (slug) => {
  const res = await fetch(
    // `http://localhost:3000/api/posts/${slug}`,
    `https://full-stack-blog-app-sk.vercel.app/api/posts/${slug}`,
    {
      cache: 'no-store',
    }
  );

  console.log('res-postslug ', res.status);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function SinglePage({ params }) {
  const { slug } = params;

  const data = await getData(slug);

  console.log('singlepost ', data);
  if (data.statusCode !== 200) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.post.title}</h1>
          <div className={styles.user}>
            {data?.post?.user.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={data.post.user.image}
                  alt=""
                  fill
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.post.user?.name}</span>
              <span className={styles.date}>
                {data?.post.createdAt?.substring(8, 10) +
                  '-' +
                  data?.post.createdAt?.substring(5, 7) +
                  '-' +
                  data?.post.createdAt?.substring(0, 4)}
              </span>
            </div>
          </div>
        </div>
        {data?.post.img && (
          <div className={styles.imageContainer}>
            <Image src={data?.post.img} alt="" fill className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: `${data?.post.desc}` }}
          />

          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
}
