import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15 });

export const RouterProgress: React.FC = () => {
  const location = useLocation();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (prev.current !== null && prev.current !== location.pathname) {
      NProgress.start();
      // Finish on next paint — by then the new component has rendered
      const id = requestAnimationFrame(() => {
        NProgress.done();
      });
      return () => cancelAnimationFrame(id);
    }
    prev.current = location.pathname;
  }, [location.pathname]);

  return null;
};
