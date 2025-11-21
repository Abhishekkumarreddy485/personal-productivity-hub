import { useState } from 'react';
import { useRouter } from 'next/router';
import CoverImage from './CoverImage';
import BookFormModal from './BookFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import styles from '../styles/BookCard.module.css';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import API from '../lib/api';

export default function BookCard({ book }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await API.delete(`/api/books/${book._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      router.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const openBook = () => {
    router.push(`/books/${book._id}`);
  };

  return (
    <>
      <div className={styles.cardLink}>
        <div
          className={styles.card}
          onClick={openBook}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openBook();
          }}
        >
          <CoverImage
            title={book.title}
            author={book.author}
            url={book.coverImageUrl}
          />

          <div className={styles.details}>
            <div>
              {/* You can render title/author description here if needed */}
            </div>

            <div className={styles.actions}>
              {/* STOP navigation from card click for individual buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openBook();
                }}
                className={styles.readLink}
                type="button"
              >
                Read
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
                className={styles.iconBtn}
                type="button"
                aria-label="Edit book"
              >
                <FaEdit />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className={styles.iconBtn}
                disabled={loading}
                type="button"
                aria-label="Delete book"
              >
                <FaTrashAlt />
              </button>
            </div>
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
