"use client";

import { useEffect, useState } from "react";
import { debounce } from "lodash-es";
import { PostFooterSeparator } from "../PostFooterSeparator";

export interface ScrollAwareSeparatorProps {}

const ScrollAwareSeparator = (_props: ScrollAwareSeparatorProps) => {
  const [hasScrollbar, setHasScrollbar] = useState(false);

  useEffect(() => {
    const checkScrollbar = debounce(() => {
      setHasScrollbar(document.documentElement.scrollHeight > window.innerHeight);
    }, 100);

    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    return () => window.removeEventListener("resize", checkScrollbar);
  }, []);

  if (!hasScrollbar) {
    return null;
  }

  return <PostFooterSeparator />;
};

export { ScrollAwareSeparator };
