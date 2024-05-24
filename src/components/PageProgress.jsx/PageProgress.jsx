'use client';
import { useEffect, useRef } from 'react';
import styles from './PageProgress.module.css';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function PageProgress() {
  let ref = useRef(null);
  ref.current = document.querySelector('#post');
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['200px end', 'end end'],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    ref.current = document.querySelector('#post');
    console.log(ref);
  }, []);

  return (
    <motion.div className={styles.fullWidth}>
      <motion.div
        className={styles.progressBar}
        style={{
          scaleX: scaleX,
        }}
      />
    </motion.div>
  );
}
