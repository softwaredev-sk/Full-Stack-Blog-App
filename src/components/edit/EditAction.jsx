'use client';
import { useSession } from 'next-auth/react';
import styles from './EditAction.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditAction({ postData }) {
  const { data } = useSession();
  const router = useRouter();
  async function handleDeletePost(id, slug) {
    const proceed = window.confirm(
      'Are you sure you want to delete post and all associated comments?'
    );
    if (!proceed) {
      return;
    }
    const res = await fetch(`/api/posts/?id=${id}&postSlug=${slug}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      return;
    }

    router.push('/');
  }
  return (
    <>
      {data?.user.email === postData?.user.email && (
        <div className={styles.editActions}>
          <Link href={`/write/?edit=${postData?.slug}`}>Edit</Link>
          <span
            className={styles.danger}
            onClick={() => handleDeletePost(postData?.id, postData?.slug)}
          >
            Delete
          </span>
        </div>
      )}
    </>
  );
}
