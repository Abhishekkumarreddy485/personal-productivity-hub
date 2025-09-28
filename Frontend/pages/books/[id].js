// /frontend/pages/books/[id].js
import Layout from '../../components/Layout';
import API, { setAuthToken } from '../../lib/api';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '../../styles/BookDetail.module.css';

export default function BookDetail() {
  const r = useRouter();
  const { id } = r.query;
  const [book, setBook] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    if (id) {
      fetchBook();
      fetchQuotes();
    }
  }, [id]);

  async function fetchBook() {
    try {
      const res = await API.get(`/api/books/${id}`);
      setBook(res.data);
    } catch (err) { console.error(err); }
  }

  async function fetchQuotes() {
    try {
      const res = await API.get(`/api/books/${id}/quotes`);
      setQuotes(res.data);
    } catch (err) { console.error(err); }
  }

  async function handleAddQuote() {
    if (!newQuote.trim()) return;
    try {
      await API.post(`/api/books/${id}/quotes`, { text: newQuote });
      setNewQuote('');
      fetchQuotes();
    } catch (err) {
      console.error(err);
      alert('Login required to add quotes.');
    }
  }

  async function handleExport(format) {
    try {
      const res = await API.get(`/api/books/${id}/export`, {
        params: { format },
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(book?.title || 'book')}-quotes.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) { console.error(err); }
  }

  async function handleToggleFavorite(id) {
    try {
      const quote = quotes.find(q => q._id === id);
      await API.put(`/api/quotes/${id}`, { favorite: !quote.favorite });
      fetchQuotes();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleEditQuote(quote) {
    const updatedText = prompt('Edit quote:', quote.text);
    if (updatedText && updatedText !== quote.text) {
      try {
        await API.put(`/api/quotes/${quote._id}`, { text: updatedText });
        fetchQuotes();
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function handleDeleteQuote(id) {
    if (confirm('Are you sure you want to delete this quote?')) {
      try {
        await API.delete(`/api/quotes/${id}`);
        fetchQuotes();
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (!book) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.coverWrapper}>
          <img
            src={book.coverImageUrl || '/placeholder.png'}
            alt={book.title}
            className={styles.coverImage}
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{book.title}</h2>
          <p className={styles.meta}>{book.author} • {book.year}</p>
          <p className={styles.summary}>{book.summary}</p>
        </div>
      </div>

      <section className={styles.quotesSection}>
        <h3 className={styles.quotesTitle}>Quotes</h3>

        <div className={styles.quotesGrid}>
          {quotes.map((q, idx) => (
            <div key={q._id} className={`${styles.quoteCard} ${styles[`bg${idx % 5}`]}`}>
              <div className={styles.quoteActions}>
                <button onClick={() => handleToggleFavorite(q._id)} className={styles.favoriteBtn}>
                  {q.favorite ? '★' : '☆'}
                </button>
                <button onClick={() => handleEditQuote(q)} className={styles.editBtn}>Edit</button>
                <button onClick={() => handleDeleteQuote(q._id)} className={styles.deleteBtn}>Delete</button>
              </div>
              <p className={styles.quoteText}>
                {q.text.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </p>
              <div className={styles.quoteAuthor}>{book.author}</div>
              <div className={styles.quoteDate}>{new Date(q.createdAt).toLocaleString()}</div>
            </div>
          ))}

          {quotes.length === 0 && <div className={styles.noQuotes}>No quotes yet.</div>}
        </div>
      </section>

      {/* Bottom input & export section */}
      <div className={styles.bottomSection}>
        <div className={styles.addQuote}>
          <textarea
            value={newQuote}
            onChange={e => setNewQuote(e.target.value)}
            placeholder="Type or paste a quote (supports multi-line)..."
            className={styles.textarea}
            rows={3}
          />
          <button onClick={handleAddQuote} className={styles.uploadBtn}>Upload Quote</button>
        </div>

        <div className={styles.buttons}>
          <button onClick={() => handleExport('txt')} className={`${styles.btn} ${styles.btnTxt}`}>Export TXT</button>
          <button onClick={() => handleExport('csv')} className={`${styles.btn} ${styles.btnCsv}`}>Export CSV</button>
          <button onClick={() => handleExport('pdf')} className={`${styles.btn} ${styles.btnPdf}`}>Export PDF</button>
        </div>
      </div>
    </Layout>
  );
}
