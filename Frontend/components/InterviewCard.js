import { useState } from 'react';
import API from '../lib/api';
import { useRouter } from 'next/router';
import styles from '../styles/InterviewCard.module.css'; // ✅ Correct import
import DeleteConfirmModal from './DeleteConfirmModal'; // ✅ Import modal

export default function InterviewCard({ question, onDelete, onUpdate }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    question: question.question,
    answer: question.answer,
    tags: question.tags.join(', '),
    module: question.module || '',
    difficulty: question.difficulty || 'Easy',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // async function handleDelete() {
  //   if (confirm('Delete this question?')) {
  //     try {
  //       await API.delete(`/api/interview-questions/${question._id}`);
  //       onDelete();
  //     } catch (err) {
  //       console.error(err);
  //       alert('Failed to delete question');
  //     }
  //   }
  // }

  async function confirmDelete() {
  setDeleting(true);
  try {
    await API.delete(`/api/interview-questions/${question._id}`);
    onDelete();
  } catch (err) {
    console.error(err);
    alert('Failed to delete question');
  } finally {
    setDeleting(false);
    setShowDeleteModal(false);
  }
}


  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await API.put(`/api/interview-questions/${question._id}`, {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()),
      });
      setEditing(false);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to update question');
    }
  }

  async function toggleFavorite() {
    try {
      await API.post(`/api/interview-questions/${question._id}/favorite`);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleBookmark() {
    try {
      await API.post(`/api/interview-questions/${question._id}/bookmark`);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles['interview-card']}>
      <div className={styles['interview-header']}>
        {editing ? (
         <form onSubmit={handleUpdate} className={styles['interview-form']}>
  <div className={styles['form-group']}>
    <label className={styles['form-label']}>Question</label>
    <input
      name="question"
      value={form.question}
      onChange={handleChange}
      className={styles['input-field']}
      placeholder="Enter question"
      required
    />
  </div>

  <div className={styles['form-group']}>
    <label className={styles['form-label']}>Answer</label>
    <textarea
      name="answer"
      value={form.answer}
      onChange={handleChange}
      className={styles['textarea-field']}
      placeholder="Enter answer"
      required
    />
  </div>

  <div className={styles['form-group']}>
    <label className={styles['form-label']}>Tags</label>
    <input
      name="tags"
      value={form.tags}
      onChange={handleChange}
      className={styles['input-field']}
      placeholder="Comma separated tags"
    />
  </div>

  <div className={styles['form-row']}>
    <div className={styles['form-group']}>
      <label className={styles['form-label']}>Module</label>
      <input
        name="module"
        value={form.module}
        onChange={handleChange}
        className={styles['input-field']}
        placeholder="Module"
      />
    </div>

    <div className={styles['form-group']}>
      <label className={styles['form-label']}>Difficulty</label>
      <select
        name="difficulty"
        value={form.difficulty}
        onChange={handleChange}
        className={styles['select-field']}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
    </div>
  </div>

  <div className={styles['form-buttons']}>
    <button type="submit" className={`${styles.btn} ${styles['btn-green']}`}>
      Save
    </button>
    <button
      type="button"
      onClick={() => setEditing(false)}
      className={`${styles.btn} ${styles['btn-gray']}`}
    >
      Cancel
    </button>
  </div>
</form>


        ) : (
          <>
            <h2
              className={styles['question-title']}
              onClick={() => router.push(`/interview/${question._id}`)}
            >
              {question.question}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={toggleFavorite} className={`${styles['icon-btn']} ${styles.favorite}`}>
                {question.favorites?.length ? '★' : '☆'}
              </button>
              <button onClick={toggleBookmark} className={`${styles['icon-btn']} ${styles.bookmark}`}>
                {question.bookmarks?.length ? '🔖' : '📑'}
              </button>
            </div>
          </>
        )}
      </div>

      {!editing && (
        <>
          <p className={styles['answer-preview']}>{question.answer}</p>
          <div className={styles['tag-list']}>
            {question.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          {/* <p className={styles.meta}>
            Module: {question.module || 'N/A'} | Difficulty: {question.difficulty || 'N/A'}
          </p>
          <div className={styles['action-buttons']}>
            <button onClick={() => setEditing(true)} className={`${styles.btn} ${styles['btn-black']}`}>Edit</button>
            <button onClick={handleDelete} className={`${styles.btn} ${styles['btn-black']}`}>Delete</button>
          </div> */}
          <div className={styles['card-footer']}>
            <p className={styles.meta}>
              Module: {question.module || 'N/A'} | Difficulty: {question.difficulty || 'N/A'}
            </p>
            <div className={styles['action-buttons']}>
              <button onClick={() => setEditing(true)} className={`${styles.btn} ${styles['btn-black']}`}>Edit</button>
              <button onClick={() => setShowDeleteModal(true)} className={`${styles.btn} ${styles['btn-black']}`}>
                Delete
              </button>
            </div>
          </div>

        </>
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          item={question}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
