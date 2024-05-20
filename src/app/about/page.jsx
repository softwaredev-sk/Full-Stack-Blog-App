import styles from './About.module.css';

const getData = async (fieldname) => {
  const res = await fetch(
    `${process.env.PROD_URL}/api/bloginfo/?fieldname=${fieldname}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function About() {
  const { info: infoHeadline } = await getData('about-headline');
  const { info } = await getData('about');
  return (
    <div className={styles.about}>
      <h1>About BlogApp</h1>
      <h2>{infoHeadline && infoHeadline}</h2>
      <p dangerouslySetInnerHTML={{ __html: info }} />
    </div>
  );
}
