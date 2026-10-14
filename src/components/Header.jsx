import { useEffect, useState } from 'react';
import { site } from '../data';
import { getLenis } from '../lib/motion';
import { Button } from './ui';

// Текстовый логотип
export function Wordmark({ className = '' }) {
  return <a href="#top" className={`wordmark ${className}`}>{site.brand}</a>;
}

export default function Header({ onQuote, solid }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  // После первого экрана шапка становится "липкой" тёмной полосой
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop(); else lenis?.start();
  }, [open]);

  const cls = ['nav', (stuck || solid) && 'is-stuck', open && 'is-open'].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className="nav__bar">
        <Wordmark />
        <nav className="nav__links" onClick={(e) => e.target.closest('a') && setOpen(false)}>
          {site.nav.map((n) => <a key={n.href} href={n.href} className="nav__link">{n.label}</a>)}
          <button className="nav__link nav__link--cta" onClick={() => { setOpen(false); onQuote(); }}>{site.cta}</button>
        </nav>
        <div className="nav__cta"><Button small variant="light" onClick={onQuote}>{site.cta}</Button></div>
        <button className="nav__toggle" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Закрыть' : 'Меню'}</button>
      </div>
    </header>
  );
}
