import CardList from '@/components/cardList/CardList';
import Menu from '@/components/menu/Menu';
import styles from './BlogPage.module.css';

export default function BlogPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{cat} Blog</h2>
      <div className={styles.content}>
        <CardList page={page} cat={cat} />
        <Menu />
      </div>
    </div>
  );
}
