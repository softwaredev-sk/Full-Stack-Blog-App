'use client';
import { useEffect, useRef } from 'react';
import styles from './PageProgress.module.css';
import { motion, useScroll, useSpring } from 'framer-motion';
import CategoryItem from '../categoryItem/CategoryItem';

export default function PageProgress({ postContent, edited }) {
  // let ref = useRef(null);
  const ref = useRef(null);
  // ref.current = document.querySelector('#post');
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // useEffect(() => {
  //   ref.current = document.querySelector('#post');
  // }, []);

  return (
    <>
      <motion.div className={styles.fullWidth}>
        <motion.div
          className={styles.progressBar}
          style={{
            scaleX: scaleX,
          }}
        />
      </motion.div>

      {edited && (
        <span>
          <CategoryItem category="edited" customCss="edited" edited />
        </span>
      )}

      <div
        id="post"
        ref={ref}
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: `${postContent}` }}
      />
    </>
  );
}
