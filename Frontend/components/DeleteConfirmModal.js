import styles from '../styles/DeleteConfirmModal.module.css';
import { FaTrashAlt, FaTimes } from 'react-icons/fa';

export default function DeleteConfirmModal({ book, onConfirm, onCancel, loading }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Delete Book</h3>
        <p>Are you sure you want to delete <strong>"{book?.title || 'this book'}"</strong>?</p>
        <div className={styles.actions}>
          <button onClick={onConfirm} disabled={loading} className={styles.deleteBtn}>
            <FaTrashAlt /> {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
