import styles from '../styles/ModuleCard.module.css';

export default function ModuleCard({ title, description, href }) {
  return (
    <a href={href} className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </a>
  );
}
