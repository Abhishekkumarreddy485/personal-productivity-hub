import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import API, { setAuthToken } from '../../lib/api';

export default function InterviewDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [question, setQuestion] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', tags: '', module: '', difficulty: 'Easy' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    if (id) fetchQuestion();
  }, [id]);

  async function fetchQuestion() {
    try {
      const res = await API.get(`/api/interview-questions/${id}`);
      setQuestion(res.data);
      setForm({
        question: res.data.question,
        answer: res.data.answer,
        tags: res.data.tags.join(', '),
        module: res.data.module || '',
        difficulty: res.data.difficulty || 'Easy',
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await API.put(`/api/interview-questions/${id}`, {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()),
      });
      setEditing(false);
      fetchQuestion();
    } catch (err) {
      console.error(err);
      alert('Failed to update question');
    }
  }

  async function handleDelete() {
    if (confirm('Delete this question?')) {
      try {
        await API.delete(`/api/interview-questions/${id}`);
        router.push('/interview'); // go back to list
      } catch (err) {
        console.error(err);
        alert('Failed to delete question');
      }
    }
  }

  if (!question) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-3">
            <input
              name="question"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="answer"
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              rows={4}
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="tags"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Tags (comma separated)"
            />
            <input
              name="module"
              value={form.module}
              onChange={(e) => setForm({ ...form, module: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Module"
            />
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">{question.question}</h1>
            <p className="text-gray-700 whitespace-pre-line">{question.answer}</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {question.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-sm bg-gray-200 rounded">{tag}</span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Module: {question.module || 'General'} | Difficulty: {question.difficulty || 'Easy'}
            </p>
            <div className="flex gap-2 justify-end mt-4">
              {/* <button onClick={() => setEditing(true)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded">Edit</button>
              <button onClick={handleDelete} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded">Delete</button> */}
                <button
                    onClick={() => setEditing(true)}
                    style={{
                      padding: "0.25rem 0.75rem", // px-3 py-1
                      backgroundColor: "#3b82f6", // bg-blue-500
                      color: "white",
                      borderRadius: "0.375rem", // rounded
                      border: "none",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")} // hover:bg-blue-600
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    style={{
                      padding: "0.25rem 0.75rem", // px-3 py-1
                      backgroundColor: "#ef4444", // bg-red-500
                      color: "white",
                      borderRadius: "0.375rem",
                      border: "none",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")} // hover:bg-red-600
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
                  >
                    Delete
                  </button>

            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
