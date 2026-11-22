
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "../styles/PDFViewer.module.css";

// PDF Worker Configuration
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Dynamically import flipbook (disable SSR)
const HTMLFlipBook = dynamic(
  () => import("react-pageflip"),
  { ssr: false }
);

export default function PDFViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef(null);

  // =====================================
  // RESPONSIVE SCREEN DIMENSIONS
  // =====================================

  const [screenSize, setScreenSize] = useState({
    width: 1024,
    height: 768,
  });

  useEffect(() => {
    function updateScreenSize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    updateScreenSize();

    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  // Detect mobile devices
  const isMobile = screenSize.width <= 768;

  // =====================================
  // MOBILE PDF DIMENSIONS
  // =====================================

  const mobileWidth = Math.max(
    240,
    Math.floor(
      Math.min(
        screenSize.width - 24,
        (screenSize.height - 100) * (650 / 900)
      )
    )
  );

  const mobileHeight = Math.max(
    330,
    Math.floor(mobileWidth * (900 / 650))
  );

  // =====================================
  // PAGE FLIP SOUND
  // =====================================

  useEffect(() => {
    // Prevent DOMMatrix error (client side)
    if (typeof window !== "undefined" && !window.DOMMatrix) {
      window.DOMMatrix =
        window.WebKitCSSMatrix ||
        window.MSCSSMatrix ||
        class {};
    }

    // Preload page flip sound
    audioRef.current = new Audio("/sounds/page-flip.mp3");
    audioRef.current.volume = 0.9;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // =====================================
  // PDF LOAD SUCCESS
  // =====================================

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // =====================================
  // PAGE FLIP SOUND HANDLER
  // =====================================

  function handleFlipSound(e) {
    if (audioRef.current && e.data && e.data.page !== 0) {
      audioRef.current.currentTime = 0;

      audioRef.current.play().catch(() => {});
    }
  }

  // =====================================
  // MAIN PDF VIEWER
  // =====================================

  return (
    <div className={styles.overlay}>

      {/* Close Button */}
      <button
        onClick={onClose}
        className={styles.closeBtn}
        aria-label="Close PDF viewer"
      >
        ✕ Close
      </button>

      {/* Viewer Container */}
      <div className={styles.viewerContainer}>

        {loading && (
          <p className={styles.loadingText}>
            Loading book...
          </p>
        )}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
        >

          {numPages > 0 && (

            <HTMLFlipBook
              key={isMobile ? "mobile" : "desktop"}

              // Desktop: Original dimensions
              // Mobile: Responsive dimensions
              width={isMobile ? mobileWidth : 650}
              height={isMobile ? mobileHeight : 900}

              minWidth={isMobile ? 240 : 315}
              maxWidth={isMobile ? 768 : 1200}

              minHeight={isMobile ? 330 : 400}
              maxHeight={isMobile ? 1100 : 1536}

              drawShadow={true}
              maxShadowOpacity={0.6}

              showCover={true}

              // Mobile: Single page
              // Desktop: Two-page layout
              usePortrait={isMobile}

              mobileScrollSupport={true}
              flippingTime={1000}
              startPage={0}

              showPageCorners={!isMobile}
              clickEventForward={true}

              className={styles.flipBook}
              onFlip={handleFlipSound}
            >

              {/* Render all PDF pages */}
              {Array.from(
                { length: numPages },
                (_, i) => (
                  <div
                    key={`page_${i + 1}`}
                    className={styles.page}
                  >

                    <Page
                        pageNumber={i + 1}
                        width={
                          isMobile
                            ? Math.max(
                                100,
                                mobileWidth - (screenSize.width <= 599 ? 40 : 60)
                              )
                            : undefined
                        }
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />

                  </div>
                )
              )}

            </HTMLFlipBook>

          )}

        </Document>

      </div>
    </div>
  );
}
