import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reset window scroll on SPA navigation so new pages start at the top
 * (footer/nav links no longer leave the user at the previous scroll position).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
