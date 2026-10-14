import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import QuotePanel from './components/QuoteForm';
import { Arrow } from './components/ui';
import { Hero, Intro, Statement, Catalog, Projects, Numbers, Contacts, Footer } from './components/Sections';
import Product from './pages/Product';
import { initSmoothScroll, initScrollAnimations, getLenis, ScrollTrigger } from './lib/motion';
import { useRoute } from './lib/router';
import { site } from './data';

export default function App() {
  const route = useRoute();
  const [quote, setQuote] = useState({ open: false, product: '' });
  const openQuote = useCallback((product = '') => setQuote({ open: true, product }), []);
  const closeQuote = useCallback(() => setQuote((q) => ({ ...q, open: false })), []);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const stop = initSmoothScroll();
    getLenis()?.start();
    return stop;
  }, []);

  // смена страницы: наверх (или к нужной секции) и перезапуск анимаций появления
  useEffect(() => {
    const lenis = getLenis();
    const target = route.anchor && document.getElementById(route.anchor);
    if (target) setTimeout(() => (lenis ? lenis.scrollTo(target, { offset: -70, immediate: true }) : target.scrollIntoView()), 50);
    else if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const stop = initScrollAnimations();
    ScrollTrigger.refresh();
    return stop;
  }, [route.page, route.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header onQuote={() => openQuote()} solid={route.page !== 'home'} />
      <main key={route.page + (route.id || '')}>
        {route.page === 'home' && (
          <>
            <Hero onQuote={() => openQuote()} />
            <Intro />
            <Statement />
            <Catalog />
            <Projects onQuote={openQuote} />
            <Numbers />
            <Contacts />
          </>
        )}
        {route.page === 'product' && <Product id={route.id} onQuote={openQuote} />}
      </main>
      <Footer />

      {/* Закреплённая кнопка заявки в углу экрана */}
      <button className={`fab${quote.open ? ' is-hidden' : ''}`} onClick={() => openQuote()} aria-label={site.cta}>
        <span className="fab__label">{site.cta}</span>
        <span className="fab__icon"><Arrow /></span>
      </button>

      <QuotePanel open={quote.open} product={quote.product} onClose={closeQuote} />
    </>
  );
}
