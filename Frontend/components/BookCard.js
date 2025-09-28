import { useState } from 'react';
import { useRouter } from 'next/router';
import CoverImage from './CoverImage';
import EditBookModal from './EditBookModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import styles from '../styles/BookCard.module.css';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

export default function BookCard({ book }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/books/${book._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        alert('Book deleted');
        router.reload();
      } else {
        const { message } = await res.json();
        alert(`Error: ${message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <CoverImage
          title={book.title}
          author={book.author}
          url={book.coverImageUrl}
          size={90}
        />
        <div className={styles.details}>
          <h4 className={styles.title}>{book.title}</h4>
          <p className={styles.meta}>
            {book.author} • {book.year}
          </p>
          <p className={styles.summary}>{book.summary}</p>

          <div className={styles.actions}>
            <a href={`/books/${book._id}`} className={styles.readLink}>
              Read
            </a>
            <button onClick={() => setShowEditModal(true)} className={styles.iconBtn}>
              <FaEdit />
            </button>
            <button onClick={() => setShowDeleteModal(true)} className={styles.iconBtn} disabled={loading}>
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditBookModal
          book={book}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => router.reload()}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          book={book}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}
    </>
  );
}
