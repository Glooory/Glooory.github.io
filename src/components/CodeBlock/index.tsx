"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!preRef.current) {
      return;
    }

    const codeEl = preRef.current.querySelector("code");
    if (!codeEl) {
      return;
    }

    const lines = codeEl.querySelectorAll("[data-line]");
    const lineCount = lines.length;
    const digits = lineCount.toString().length;

    preRef.current.style.setProperty("--line-number-width", `${digits}ch`);
  }, [children]);

  const handleCopy = async () => {
    if (!preRef.current) {
      return;
    }

    const code = preRef.current.textContent || "";

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard API is not available
    }
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <button
        type="button"
        onClick={handleCopy}
        className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
