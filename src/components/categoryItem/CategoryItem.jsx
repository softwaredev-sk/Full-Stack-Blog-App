import Link from 'next/link';
import styles from './CategoryItem.module.css';

export default function CategoryItem({
  category,
  customCss,
  key,
  children,
  edited,
}) {
  if (edited) {
    return (
      <div
        key={key}
        className={`${styles.categoryItem} ${styles[category]} ${
          customCss ? styles[customCss] : ''
        }`}
      >
        {children}
        {category}
      </div>
    );
  }
  return (
    <Link
      key={key}
      href={`/blog?cat=${category}`}
      className={`${styles.categoryItem} ${styles[category]} ${
        customCss ? styles[customCss] : ''
      }`}
    >
      {children}
      {category}
    </Link>
  );
}
