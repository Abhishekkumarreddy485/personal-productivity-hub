import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Personal Productivity Hub</h1>
          <nav className={styles.nav}>
            <a href="/books" className={styles.navLink}>Books</a>
            <a href="/" className={styles.navLink}>Home</a>
            {isLoggedIn && (
              <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
