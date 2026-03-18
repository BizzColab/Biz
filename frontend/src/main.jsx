import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './lib/Providers';
import { useSelector } from 'react-redux';
import { selectAuth } from './redux/auth/selectors';
import AuthRouter from './router/AuthRouter';
import ErpApp from './apps/ErpApp';
import Lenis from '@studio-freight/lenis';
import './style/app.css';

const App = () => {
  const { isLoggedIn } = useSelector(selectAuth);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (!isLoggedIn) {
    return <AuthRouter />;
  }

  return <ErpApp />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);

