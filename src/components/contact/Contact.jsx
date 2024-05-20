'use client';

import { useRef, useState } from 'react';
import styles from './Contact.module.css';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
}

export default function Contact() {
  const emailRef = useRef();
  const subjectRef = useRef();
  const contentRef = useRef();

  const [formCustomData, setFormCustomData] = useState({
    email: '',
    subject: '',
    content: '',
  });
  const [formSuccessful, setFormSuccessful] = useState(null);
  let lastTimer = useRef();

  function handleCustomForm(fieldName, value) {
    setFormCustomData((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  }

  async function handleSubmit(e) {
    if (lastTimer.current) {
      clearTimeout(lastTimer.current);
    }
    e.preventDefault();
    const email = formCustomData.email;
    const subject = formCustomData.subject;
    const content = formCustomData.content;
    if (validateEmail(email) && subject.trim() && content.trim()) {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formCustomData),
      });

      if (!res.ok) {
        console.log('failed');
        return;
      }
      setFormCustomData({
        email: '',
        subject: '',
        content: '',
      });
      setFormSuccessful(true);
      lastTimer.current = setTimeout(() => {
        lastTimer.current = null;
        setFormSuccessful(null);
      }, 2000);
    } else {
      setFormSuccessful(false);
      lastTimer.current = setTimeout(() => {
        lastTimer.current = null;
        setFormSuccessful(null);
      }, 2000);
    }
  }

  return (
    <div>
      <h1>Contact Me</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className={styles.input}
          required
          onChange={() => handleCustomForm('email', emailRef.current.value)}
          ref={emailRef}
          value={formCustomData.email}
        ></input>
        <input
          type="text"
          placeholder="Subject"
          name="subject"
          className={styles.input}
          required
          onChange={() => handleCustomForm('subject', subjectRef.current.value)}
          ref={subjectRef}
          value={formCustomData.subject}
        ></input>
        <textarea
          type="text"
          placeholder="..."
          name="content"
          className={styles.input}
          required
          onChange={() => handleCustomForm('content', contentRef.current.value)}
          ref={contentRef}
          value={formCustomData.content}
        ></textarea>
        <div className={styles.buttonContainer}>
          <div>
            <AnimatePresence>
              {formSuccessful === false && (
                <motion.p
                  className={styles.msg}
                  exit={{ opacity: [1, 0], transition: { duration: 2 } }}
                >
                  <Image
                    src="/error.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={styles.errorImg}
                  />
                  Form submission failed. Make sure you are filling correct
                  details!
                </motion.p>
              )}
              {formSuccessful === true && (
                <motion.p
                  className={styles.msg}
                  exit={{ opacity: [1, 0], transition: { duration: 2 } }}
                >
                  ✅ Form submitted successfully.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}
