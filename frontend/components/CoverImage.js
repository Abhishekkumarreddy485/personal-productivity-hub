// /frontend/components/CoverImage.js
import styles from "../styles/CoverImage.module.css";

export default function CoverImage({ title, author, url, size = 300 }) {
  const initials = title
    ? title.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase()
    : "B";

  // If a cover image exists
  if (url) {
    return (
      <img
        src={url}
        alt={title}
        className={styles.image}
        style={{
          width: "100%",               // For Image 
          height: size,               // tall cover
          objectFit: "cover",
          borderRadius: "0.6rem",
        }}
      />
    );
  }

  // Fallback when no cover image
  const gradients = [
    styles.gradient1,
    styles.gradient2,
    styles.gradient3,
    styles.gradient4,
  ];
  const c = gradients[(title?.length || 1) % gradients.length];

  return (
    <div
      className={`${styles.coverBox} ${c}`}
      style={{
        width: "100%",   // If No Image
        height: size,
        borderRadius: "0.6rem",
      }}
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
