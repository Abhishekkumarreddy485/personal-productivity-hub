// /frontend/pages/books/index.js
import Layout from '../../components/Layout';
import API, { setAuthToken } from '../../lib/api';
import { useEffect, useState } from 'react';
import BookCard from '../../components/BookCard';
import styles from '../../styles/BooksPage.module.css';
import BookFormModal from '../../components/BookFormModal';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const params = {};
    if (q) params.q = q;
    if (onlyFav) params.favorite = true;
    try {
      const res = await API.get('/api/books', { params });
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  // async function handleAddSample() {
  //   try {
  //     await API.post('/api/books', {
  //       title: 'Sample Book',
  //       author: 'Author X',
  //       year: 2023,
  //       genre: 'Learning',
  //       rating: 4,
  //       summary: 'A sample book added from frontend.',
  //       coverImageUrl: ''
  //     });
  //     fetchBooks();
  //   } catch (err) {
  //     console.error(err);
  //     alert('Need to login to add a book. Create an account via /api/auth/register');
  //   }
  // }

  return (
    <Layout>
      <div className={styles.topBar}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search books"
          className={styles.searchInput}
        />
        <button onClick={fetchBooks} className={styles.searchButton}>
          Search
        </button>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={onlyFav}
            onChange={e => setOnlyFav(e.target.checked)}
          />
          <span>Favorites only</span>
        </label>
        <div className={styles.addSampleWrapper}>
           <button onClick={() => setShowCreateModal(true)} className={styles.addSampleButton}>
                Create New Book
 </button>
        </div>
      </div>

      <div className={styles.grid}>
        {books.map(b => (
          <BookCard key={b._id} book={b} />
        ))}
        {books.length === 0 && (
          <div className={styles.noBooks}>No books — try adding one</div>
        )}
      </div>
      {showCreateModal && (
          <BookFormModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={fetchBooks}
          />
        )}

    </Layout>
  );
}
