import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import ModuleCard from '../components/ModuleCard';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace('/login');
    }
  }, [authenticated, loading]);

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const modules = [
    { title: 'Bookstore', description: 'Manage your books, quotes, and audiobooks.', href: '/books' },
    { title: 'Interview Prep', description: 'Q&A sets, cheat sheets and practice.', href: '/interview' },
    { title: 'Knowledge Blog', description: 'Write and share insights with markdown.', href: '/blog' },
    { title: 'Journal', description: 'Daily reflections and calendar view.', href: '/blog' },
    { title: 'Skills', description: 'Skill roadmaps and progress tracking.', href: '/blog' },
    { title: 'Tasks', description: 'Weekly goals and reminders.', href: '/blog' },
    { title: 'Mindset', description: 'Daily mindfulness & gratitude.', href: '/blog' },
    { title: 'Style Board', description: 'Outfits, tags and inspiration.', href: '/blog' },
    { title: 'Prompts', description: 'Better Outputs, amazing outputs with perfect prompts.', href: '/blog' },
    {title: 'Money Dashboard', description:'Track income, expenses, savings, investments, and net worth.', href: '/blog'},
    {title: 'Career Growth Tracker', description:'Track salary history, performance, projects, promotions, and achievements.', href: '/blog'},
    {title: 'Business & Side Income Lab', description: 'Manage business ideas, validate opportunities, track customers, revenue, and profit.', href: '/blog'},
    {title: 'Mental Models & Decision Journal', description: 'Practice first-principles thinking, analyze decisions, and learn from mistakes.', href: '/blog'},
    {title: 'Personal Brand & Portfolio', description: 'Manage your LinkedIn, GitHub, technical projects, achievements, and networking.',href: '/blog'},
    {title: 'Health & Performance',description:'Track exercise, nutrition, sleep, weight, and daily energy levels.',href: '/blog'}
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Personal Productivity Hub</h1>
        <p className={styles.subtitle}>Choose a module to get started 🚀</p>

        <div className={styles.grid}>
          {modules.map(m => (
            <ModuleCard key={m.title} {...m} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
