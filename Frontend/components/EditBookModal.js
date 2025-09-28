// components/EditBookModal.js
import { useState } from 'react';
import styles from '../styles/EditBookModal.module.css';
import { FaSave, FaTimes } from 'react-icons/fa';

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
      const res = await fetch(`http://localhost:4000/api/books/${book._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Book updated');
        onUpdated(); // refresh parent
        onClose();   // close modal
      } else {
        const { message } = await res.json();
        alert(`Error: ${message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
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
