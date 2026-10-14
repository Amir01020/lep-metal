import { useEffect, useRef, useState } from 'react';
import { products } from '../data';
import { gsap } from '../lib/motion';
import { Button, Arrow } from '../components/ui';

// Фотогалерея: большое фото, миниатюры, стрелки, свайп и просмотр на весь экран
function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const n = images.length;
  const stage = useRef(null);
  const go = (d) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    const img = stage.current.querySelector('img');
    gsap.fromTo(img, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out' });
  }, [i]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setZoom(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useRef(0);
  const swipe = {
    onPointerDown: (e) => { start.current = e.clientX; },
    onPointerUp: (e) => { const dx = e.clientX - start.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); },
  };

  return (
    <div className="gallery">
      <div className="gallery__stage" ref={stage} {...swipe}>
        <img key={i} src={images[i]} alt={`${name} — фото ${i + 1}`} draggable="false" onClick={() => setZoom(true)} />
        <button className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label="Предыдущее фото"><Arrow /></button>
        <button className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label="Следующее фото"><Arrow /></button>
        <span className="gallery__count">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
      <div className="gallery__thumbs">
        {images.map((src, k) => (
          <button key={k} className={k === i ? 'is-active' : ''} onClick={() => setI(k)} aria-label={`Фото ${k + 1}`}>
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {zoom && (
        <div className="lightbox" onClick={() => setZoom(false)} role="dialog" aria-modal="true">
          <img src={images[i]} alt={`${name} — фото ${i + 1}`} onClick={(e) => e.stopPropagation()} {...swipe} />
          <button className="lightbox__close" onClick={() => setZoom(false)}>Закрыть</button>
        </div>
      )}
    </div>
  );
}

export default function Product({ id, onQuote }) {
  const idx = products.findIndex((x) => x.id === id);
  const p = products[idx];

  if (!p) {
    return (
      <section className="page wrap">
        <h1 className="h2">Изделие не найдено</h1>
        <Button href="#catalog">Вернуться в каталог</Button>
      </section>
    );
  }

  const next = products[(idx + 1) % products.length];

  return (
    <>
      <section className="page">
        <div className="wrap">
          <a href="#catalog" className="back js-fade">← Каталог</a>
          <div className="product">
            <div className="product__gallery js-fade"><Gallery images={p.gallery} name={p.name} /></div>
            <div className="product__info">
              <span className="product__tag js-fade">{p.tag}</span>
              <h1 className="h2 js-lines">{p.name}</h1>
              <p className="product__text js-fade">{p.text}</p>
              <dl className="specs js-stagger">
                {p.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
              <div className="js-fade"><Button onClick={() => onQuote(p.name)}>Запросить расчёт</Button></div>
            </div>
          </div>
        </div>
      </section>
      <a href={`#/product/${next.id}`} className="next">
        <div className="wrap next__inner">
          <span>Следующее изделие</span>
          <span className="next__name">{next.name} <Arrow /></span>
        </div>
      </a>
    </>
  );
}
