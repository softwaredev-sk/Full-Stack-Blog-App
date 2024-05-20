import styles from './MenuCategories.module.css';
import CategoryItem from '../categoryItem/CategoryItem';

const getData = async () => {
  const res = await fetch(`${process.env.PROD_URL}/api/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function MenuCategories() {
  const data = await getData();

  return (
    <div className={styles.categoryList}>
      {data &&
        data
          ?.slice(-9, -1)
          .reverse()
          .map((item) => (
            <CategoryItem
              key={item.title}
              category={item.title}
              customCss="categoryMenu"
            />
          ))}
    </div>
  );
}
