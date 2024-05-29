'use client';

import { useRef, useState } from 'react';
import styles from './Contact.module.css';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import ActionStatus from '../ActionStatus/ActionStatus';

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
}

async function sendContactForm(data) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to send message');
  }
  return res;
}

export default function Contact() {
  const emailRef = useRef();
  const subjectRef = useRef();
  const contentRef = useRef();
  const nameRef = useRef();

  const [formCustomData, setFormCustomData] = useState({
    name: '',
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

  function handleFormSendStatus(val) {
    setFormSuccessful(val);
    lastTimer.current = setTimeout(() => {
      lastTimer.current = null;
      setFormSuccessful(null);
    }, 2000);
  }

  async function handleSubmit(e) {
    handleFormSendStatus('');
    if (lastTimer.current) {
      clearTimeout(lastTimer.current);
    }
    e.preventDefault();
    const name = formCustomData.name;
    const email = formCustomData.email;
    const subject = formCustomData.subject;
    const content = formCustomData.content;
    if (
      name.trim() &&
      validateEmail(email) &&
      subject.trim() &&
      content.trim()
    ) {
      const res = await sendContactForm(formCustomData);
      if (!res.ok) {
        console.log('failed to submit form');
        handleFormSendStatus(false);
        return;
      }
      setFormCustomData({
        name: '',
        email: '',
        subject: '',
        content: '',
      });

      handleFormSendStatus(true);
    } else {
      handleFormSendStatus(false);
    }
  }

  return (
    <div>
      <h1>Contact Me</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            name="name"
            className={styles.input}
            required
            onChange={() => handleCustomForm('name', nameRef.current.value)}
            ref={nameRef}
            value={formCustomData.name}
          ></input>
        </div>

        <div className={styles.fields}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            name="email"
            className={styles.input}
            required
            onChange={() => handleCustomForm('email', emailRef.current.value)}
            ref={emailRef}
            value={formCustomData.email}
          ></input>
        </div>

        <div className={styles.fields}>
          <label htmlFor="subject" className={styles.label}>
            Subject
          </label>
          <input
            type="text"
            id="subject"
            placeholder="Subject"
            name="subject"
            className={styles.input}
            required
            onChange={() =>
              handleCustomForm('subject', subjectRef.current.value)
            }
            ref={subjectRef}
            value={formCustomData.subject}
          ></input>
        </div>

        <div className={styles.fields}>
          <label htmlFor="content" className={styles.label}>
            Got to say something?
          </label>
          <textarea
            type="text"
            id="content"
            placeholder="...?"
            name="content"
            className={styles.input}
            required
            onChange={() =>
              handleCustomForm('content', contentRef.current.value)
            }
            ref={contentRef}
            value={formCustomData.content}
          ></textarea>
        </div>
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
                  <ActionStatus
                    text="Form submitted successfully."
                    status="success"
                    iconSize={24}
                  />
                </motion.p>
              )}
              {formSuccessful === '' && (
                <ActionStatus text="Sending" status="loading" iconSize={24} />
              )}
            </AnimatePresence>
          </div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}
