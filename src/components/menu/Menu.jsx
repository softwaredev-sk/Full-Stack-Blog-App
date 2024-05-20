import React from 'react';
import styles from './Menu.module.css';
import Link from 'next/link';
import Image from 'next/image';
import MenuPosts from '../menuPosts/MenuPosts';
import MenuCategories from '../menuCategories/MenuCategories';

export default function Menu({ page, hideIt }) {
  return (
    <div className={`${styles.container} ${hideIt && styles.hideIt}`}>
      <h4 className={styles.subtitle}>{"What's hot"}</h4>
      <h3 className={styles.title}>Most Popular</h3>
      <MenuPosts withImage={false} />
      <h4 className={styles.subtitle}>Discover by topic</h4>
      <h3 className={styles.title}>
        Categories
        <Link href="/categories">
          {page === 1 && <sup className={styles.seeAll}>{' [See All]'}</sup>}
        </Link>
      </h3>
      <MenuCategories />
      <h4 className={styles.subtitle}>Chosen by the editor</h4>
      <h3 className={styles.title}>Editors Pick</h3>
      <MenuPosts withImage={true} />
    </div>
  );
}
