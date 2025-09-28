import { useState } from 'react';
import styles from '../styles/EditBookModal.module.css';
import { FaSave, FaTimes } from 'react-icons/fa';
import API from '../lib/api'; // ✅ use shared API instance

export default function EditBookModal({ book, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    year: book.year,
    summary: book.summary,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.put(`/api/books/${book._id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Book updated');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Edit Book</h3>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
        />
        <input
          type="text"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Author"
        />
        <input
          type="number"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          placeholder="Year"
        />
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="Summary"
        />
        <div className={styles.actions}>
          <button onClick={handleSave} disabled={loading}>
            <FaSave /> Save
          </button>
          <button onClick={onClose}>
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
