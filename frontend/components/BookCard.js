import { useState } from 'react';
import { useRouter } from 'next/router';
import CoverImage from './CoverImage';
import EditBookModal from './BookFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import styles from '../styles/BookCard.module.css';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import API from '../lib/api'; // ✅ use shared API instance

export default function BookCard({ book }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await API.delete(`/api/books/${book._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // alert('Book deleted');
      router.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server error');
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
            <button
              onClick={() => setShowDeleteModal(true)}
              className={styles.iconBtn}
              disabled={loading}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
         <BookFormModal
            book={book}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => router.reload()}
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
