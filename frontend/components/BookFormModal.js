// components/BookFormModal.js
import { useState } from 'react';
import styles from '../styles/EditBookModal.module.css';
import { FaSave, FaTimes } from 'react-icons/fa';
import API from '../lib/api';

export default function BookFormModal({ 
  book = null,     // if book is passed => Edit mode, else => Create mode
  onClose, 
  onSuccess 
}) {
  const isEdit = !!book;

  const [form, setForm] = useState({
    title: book?.title || '',
    author: book?.author || '',
    year: book?.year || '',
    genre: book?.genre || '',
    rating: book?.rating || '',
    summary: book?.summary || '',
    coverImageUrl: book?.coverImageUrl || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.year) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

      if (isEdit) {
        await API.put(`/api/books/${book._id}`, form, { headers });
        alert('Book updated successfully');
      } else {
        await API.post('/api/books', form, { headers });
        alert('Book created successfully');
      }

      onSuccess();
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
        <h3>{isEdit ? 'Edit Book' : 'Create New Book'}</h3>

        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title *"
        />
        <input
          type="text"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Author *"
        />
        <input
          type="number"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          placeholder="Year *"
        />
        <input
          type="text"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          placeholder="Genre"
        />
        <input
          type="number"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          placeholder="Rating (1-5)"
        />
        <input
          type="text"
          value={form.coverImageUrl}
          onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
          placeholder="Cover Image URL"
        />
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="Summary"
        />

        <div className={styles.actions}>
          <button onClick={handleSubmit} disabled={loading}>
            <FaSave /> {isEdit ? 'Save Changes' : 'Create'}
          </button>
          <button onClick={onClose}>
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
