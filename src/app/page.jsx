import styles from './homepage.module.css';
import Featured from '@/components/featured/Featured';
import CategoryList from '@/components/categoryList/CategoryList';
import CardList from '@/components/cardList/CardList';
import Menu from '@/components/menu/Menu';

export default function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;

  return (
    <div className={styles.container}>
      {page === 1 && (
        <>
          <Featured />
          <CategoryList page={page} />
        </>
      )}
      <div className={styles.content}>
        <CardList page={page} />
        <Menu page={page} hideInHomePage={true} />
      </div>
    </div>
  );
}
