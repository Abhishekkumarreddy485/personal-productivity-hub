import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API, { setAuthToken } from '../../lib/api';
import InterviewCard from '../../components/InterviewCard';
import QuestionForm from '../../components/QuestionForm';
import styles from '../../styles/InterviewPage.module.css'; // ✅ new CSS file

export default function InterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchQuestions();
    } else {
      setError('Login required to view questions.');
      setLoading(false);
    }
  }, [search, page]);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const res = await API.get('/api/interview-questions', {
        params: { search, page, limit },
      });
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Interview Prep</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className={styles.addBtn}
          >
            {showForm ? 'Close' : 'Add Question'}
          </button>
        </div>

        {showForm && <QuestionForm onSuccess={fetchQuestions} />}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className={styles.searchInput}
        />

        {loading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          <div className={styles.grid}>
            {questions.map((q) => (
              <InterviewCard
                key={q._id}
                question={q}
                onDelete={fetchQuestions}
                onUpdate={fetchQuestions}
              />
            ))}
          </div>
        )}

        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={styles.pageBtn}
          >
            Prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}
