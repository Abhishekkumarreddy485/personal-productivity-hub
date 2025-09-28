// /frontend/components/CoverImage.js
import styles from "../styles/CoverImage.module.css";

export default function CoverImage({ title, author, url, size = 160 }) {
  const initials = title
    ? title.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase()
    : "B";

  if (url) {
    return (
      <img
        src={url}
        alt={title}
        className={styles.image}
        style={{ width: size, height: size }}
      />
    );
  }

  // gradient background with initials
  const gradients = [
    styles.gradient1,
    styles.gradient2,
    styles.gradient3,
    styles.gradient4,
  ];
  const c = gradients[(title?.length || 1) % gradients.length];

  return (
    <div
      style={{ width: size, height: size }}
      className={`${styles.coverBox} ${c}`}
    >
      <div className={styles.textWrapper}>
        <div className={styles.initials}>{initials}</div>
        <div className={styles.author}>
          {author ? author.split(" ")[0] : ""}
        </div>
      </div>
    </div>
  );
}
