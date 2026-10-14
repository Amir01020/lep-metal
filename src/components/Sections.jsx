import { useEffect, useRef, useState } from 'react';
import { hero, intro, statement, products, projects, numbers, site } from '../data';
import { gsap, splitLines } from '../lib/motion';
import { Button, Arrow } from './ui';
import { QuoteForm } from './QuoteForm';
import { Wordmark } from './Header';

/* ---------- Первый экран: фото на всю ширину ---------- */
export function Hero({ onQuote }) {
  const root = useRef(null);
  useEffect(() => {
    const el = root.current;
    const lines = splitLines(el.querySelector('.hero__title'));
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero__bg img', { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'expo.out' });
      gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, delay: 0.2 });
      gsap.fromTo('.hero__fade', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.6 });
      gsap.to('.hero__bg', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__bg"><img src={hero.photo} alt="" fetchpriority="high" /></div>
      <div className="hero__overlay" />
      <div className="hero__inner wrap">
        <h1 className="hero__title">{hero.title}</h1>
        <div className="hero__side">
          <p className="hero__fade">{hero.text}</p>
          <div className="hero__fade"><Button variant="light" onClick={onQuote}>{site.cta}</Button></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- О компании: текст + вертикальное фото ---------- */
export function Intro() {
  return (
    <section className="section" id="about">
      <div className="wrap layout">
        <div className="layout__content">
          <h2 className="h3 js-lines">{intro.title}</h2>
          {intro.text.map((t) => <p key={t} className="js-fade">{t}</p>)}
          <div className="js-fade"><Button href="#catalog">Смотреть каталог</Button></div>
        </div>
        <figure className="layout__img js-reveal-img"><img src={intro.photo} alt="" loading="lazy" /></figure>
      </div>
    </section>
  );
}

/* ---------- Крупное заявление + две колонки ---------- */
export function Statement() {
  return (
    <section className="section section--tight">
      <div className="wrap">
        <h2 className="h1 js-lines">{statement.title}</h2>
        <div className="text-grid js-stagger">
          {statement.columns.map((t) => <p key={t}>{t}</p>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Каталог: плитка, название проявляется при наведении ---------- */
export function Catalog() {
  return (
    <section className="section" id="catalog">
      <div className="wrap">
        <div className="section__head">
          <h2 className="h2 js-lines">Каталог</h2>
          <p className="js-fade">{products.length} видов изделий. Нажмите на изделие, чтобы открыть фотографии и характеристики.</p>
        </div>
        <div className="catalog js-stagger">
          {products.map((p, i) => (
            <a href={`#/product/${p.id}`} key={p.id} className={`tile${i === 0 ? ' tile--wide' : ''}`}>
              <div className="tile__img"><img src={p.img} alt={p.name} loading="lazy" /></div>
              <div className="tile__overlay">
                <span className="tile__tag">{p.tag}</span>
                <h3 className="tile__name">{p.name}</h3>
                <span className="tile__more">Подробнее <Arrow /></span>
              </div>
              <div className="tile__caption">
                <span>{p.name}</span>
                <span>{p.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Объекты: список-аккордеон, фото следует за курсором ---------- */
export function Projects({ onQuote }) {
  const [open, setOpen] = useState(0);
  const [hover, setHover] = useState(null);
  const preview = useRef(null);
  const list = useRef(null);

  useEffect(() => {
    const el = preview.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const onMove = (e) => {
      const r = list.current.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    const node = list.current;
    node.addEventListener('pointermove', onMove);
    return () => node.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <section className="section section--dark" id="projects">
      <div className="wrap">
        <div className="section__head">
          <h2 className="h2 js-lines">Объекты</h2>
          <p className="js-fade">Несколько проектов, для которых мы изготовили металлоконструкции.</p>
        </div>
        <div className="projects" ref={list} onMouseLeave={() => setHover(null)}>
          <div className={`projects__preview${hover !== null ? ' is-visible' : ''}`} ref={preview} aria-hidden="true">
            {projects.map((p, i) => <img key={p.name} src={p.img} alt="" className={i === hover ? 'is-active' : ''} />)}
          </div>
          {projects.map((p, i) => (
            <div className={`project${open === i ? ' is-open' : ''}`} key={p.name} onMouseEnter={() => setHover(i)}>
              <button className="project__row" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className="project__name">{p.name}</span>
                <span className="project__tags">{p.tags}</span>
                <span className="project__place">{p.place}</span>
                <span className="project__year">{p.year}</span>
                <span className="project__icon" aria-hidden="true" />
              </button>
              <div className="project__body">
                <div>
                  <p>{p.text}</p>
                  <img src={p.img} alt="" loading="lazy" className="project__img-mob" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="projects__foot js-fade"><Button variant="light" onClick={() => onQuote()}>Обсудить ваш объект</Button></div>
      </div>
    </section>
  );
}

/* ---------- Цифры + фото со смещением ---------- */
export function Numbers() {
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h1 js-lines">{numbers.title}</h2>
        <div className="offset">
          <figure className="offset__a js-reveal-img"><img src={numbers.photos[0]} alt="" loading="lazy" data-parallax="6" /></figure>
          <figure className="offset__b js-reveal-img"><img src={numbers.photos[1]} alt="" loading="lazy" data-parallax="6" /></figure>
        </div>
        <dl className="stats js-stagger">
          {numbers.stats.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}

/* ---------- Контакты + форма обратной связи ---------- */
export function Contacts() {
  const { contacts } = site;
  return (
    <section className="section section--dark contacts" id="contacts">
      <div className="wrap contacts__grid">
        <div>
          <h2 className="h2 js-lines">Связаться<br />с нами</h2>
          <a className="contacts__big js-fade" href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`}>{contacts.phone}</a>
          <a className="contacts__big js-fade" href={`mailto:${contacts.email}`}>{contacts.email}</a>
          <p className="contacts__meta js-fade">{contacts.address}<br />{contacts.hours}</p>
        </div>
        <div className="js-fade">
          <QuoteForm source="Форма обратной связи" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Футер ---------- */
export function Footer() {
  const { contacts } = site;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <Wordmark className="wordmark--footer" />
          <nav className="footer__links">
            {site.nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div className="footer__links">
            {contacts.socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} {site.brand}</span>
          <span>{contacts.address}</span>
        </div>
      </div>
    </footer>
  );
}
