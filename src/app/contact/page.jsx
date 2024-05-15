'use client';

import styles from './Contact.module.css';

export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div>
      <h2>Contact Me</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          required
        ></input>
        <input
          type="text"
          placeholder="Subject"
          className={styles.input}
        ></input>
        <textarea
          type="text"
          placeholder="..."
          className={styles.input}
        ></textarea>
        <button>Submit</button>
      </form>
    </div>
  );
}
