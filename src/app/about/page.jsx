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
      <h2>About BlogApp</h2>
      <h4>{infoHeadline && infoHeadline}</h4>
      <p dangerouslySetInnerHTML={{ __html: info }} />
    </div>
  );
}
