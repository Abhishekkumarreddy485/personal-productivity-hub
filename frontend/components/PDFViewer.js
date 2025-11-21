"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "../styles/PDFViewer.module.css";

// Fix: proper worker path for Next.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Dynamically import flipbook to disable SSR
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export default function PDFViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Prevent DOMMatrix error (client only)
    if (typeof window !== "undefined" && !window.DOMMatrix) {
      window.DOMMatrix = window.WebKitCSSMatrix || window.MSCSSMatrix || class {};
    }

    // Preload the page-flip sound
    audioRef.current = new Audio("/sounds/page-flip.mp3");
    audioRef.current.volume = 0.9; // adjust volume (0–1)
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // 🔊 Play sound only when user flips a page manually
  function handleFlipSound(e) {
    if (audioRef.current && e.data) {
      // Prevent sound from playing when initially rendered
      if (e.data.page !== 0) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  }

  return (
    <div className={styles.overlay}>
      <button onClick={onClose} className={styles.closeBtn}>
        ✕ Close
      </button>
    
      <div className={styles.viewerContainer}>
        {loading && <p className={styles.loadingText}>Loading book...</p>}

        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages > 0 && (
            // <HTMLFlipBook
            //   width={600}
            //   height={800}
            //   showCover={false}
            //   usePortrait={true}
            //   className={styles.flipBook}
            //   onFlip={handleFlipSound} // 👈 play sound on manual page flip
            // >
            <HTMLFlipBook
  width={650}
  height={900}
  // size="stretch"
  minWidth={315}
  maxWidth={1200}
  minHeight={400}
  maxHeight={1536}
  drawShadow={true}
  maxShadowOpacity={0.6}
  showCover={true}
  usePortrait={false}          // two-page layout
  mobileScrollSupport={true}
  flippingTime={1000}
  startPage={0}
  showPageCorners={true}
  clickEventForward={true}
  className={styles.flipBook}
  onFlip={handleFlipSound}
>


              {Array.from({ length: numPages }, (_, i) => (
                <div key={`page_${i + 1}`} className={styles.page}>
                  <Page
                    pageNumber={i + 1}
                    // width={600}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>
    </div>
  );
}
