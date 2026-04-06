import {useEffect, useRef, useState} from 'react';

export function useElementHeight(fallback = 600) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(fallback);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      setHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {wrapperRef, height};
}
