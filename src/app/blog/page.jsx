import CardList from '@/components/cardList/CardList';
import Menu from '@/components/menu/Menu';
import styles from './BlogPage.module.css';

export default function BlogPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{cat} Blog</h1>
        <div className={`${styles.bgCover} ${styles[cat]}`}></div>
      </div>

      <div className={styles.content}>
        <CardList page={page} cat={cat} />
        <Menu hideIt={true} />
      </div>
    </div>
  );
}
