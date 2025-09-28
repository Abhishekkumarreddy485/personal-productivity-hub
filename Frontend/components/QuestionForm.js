import { useState } from 'react';
import API from '../lib/api';
import styles from '../styles/QuestionForm.module.css'; // ✅ Import CSS

export default function QuestionForm({ onSuccess }) {
  const [form, setForm] = useState({
    question: '',
    answer: '',
    tags: '',
    module: '',
    difficulty: 'Easy',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    await API.post('/api/interview-questions', {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()),
    });
    if (onSuccess) onSuccess();

    // ✅ Reset form after successful submission
    setForm({
      question: '',
      answer: '',
      tags: '',
      module: '',
      difficulty: 'Easy',
    });
  } catch (err) {
    console.error(err);
    alert('Failed to add question');
  }
}


  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Question</label>
        <input
          name="question"
          value={form.question}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter the question"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Answer</label>
        <textarea
          name="answer"
          value={form.answer}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Enter the answer"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className={styles.input}
          placeholder="Comma separated tags"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Module</label>
          <input
            name="module"
            value={form.module}
            onChange={handleChange}
            className={styles.input}
            placeholder="HR, Technical, etc."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className={styles.select}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn}>Save</button>
      </div>
    </form>
  );
}
