import React from 'react';
import styles from './Menu.module.css';
import Link from 'next/link';
import MenuPosts from '../menuPosts/MenuPosts';
import MenuCategories from '../menuCategories/MenuCategories';

export default function Menu({ page, hideIt, hideInHomePage }) {
  return (
    <div className={`${styles.container} ${hideIt && styles.hideIt}`}>
      <span>
        <h3 className={styles.subtitle}>{"What's hot"}</h3>
        <h4 className={styles.title}>Most Popular</h4>
        <MenuPosts withImage={false} />
      </span>
      <span className={hideInHomePage ? styles.hideInHomePage : ''}>
        <h3 className={styles.subtitle}>Discover by topic</h3>
        <h4 className={styles.title}>
          Categories
          <Link href="/categories">
            {page === 1 && <sup className={styles.seeAll}>{' [See All]'}</sup>}
          </Link>
        </h4>
        <MenuCategories />
      </span>
      <span className={hideInHomePage ? styles.hideInHomePage : ''}>
        <h3 className={styles.subtitle}>Chosen by the editor</h3>
        <h4 className={styles.title}>Editors Pick</h4>
        <MenuPosts withImage={true} />
      </span>
    </div>
  );
}
