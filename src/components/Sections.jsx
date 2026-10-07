import { useState } from 'react';
import { hero, products, about, advantages, process, MAX_FILE_MB, FILE_ACCEPT } from '../data';
import { useLeadForm } from '../lib/form';
import Icon from '../lib/Icon';
import { Button, SectionHead, Field, PhoneInput, FormMeta, FormStatus, PhotoPlaceholder } from './ui';
import { TowerArt, ProductArt } from './Art';

const base = import.meta.env.BASE_URL;

/* ---------- 1. Hero ---------- */
export function Hero() {
  return (
    <section className="hero hero--lep" id="hero">
      <div className="hero__media" aria-hidden="true">
        {hero.photo ? <img className="hero__photo" src={base + hero.photo} alt="" /> : (
          <>
            <div className="hero__lamp hero__lamp--moon" />
            <TowerArt />
          </>
        )}
      </div>
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="hero__title">
            {hero.titleStart}<em>{hero.titleAccent}</em>{hero.titleEnd}
          </h1>
          <p className="hero__text">{hero.text}</p>
          <div className="hero__actions">
            <Button href="#order" arrow>Запросить расчёт</Button>
            <Button href="#catalog" variant="ghost">Каталог продукции</Button>
          </div>
        </div>
        <ul className="hero__features">
          {hero.features.map((f) => (
            <li key={f.icon}>
              <span className="ico"><Icon name={f.icon} /></span>
              <span>{f.text[0]}<br />{f.text[1]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 2. Каталог ---------- */
export function Catalog({ onRequest }) {
  return (
    <section className="section section--deep" id="catalog">
      <div className="container">
        <SectionHead
          className="section__head--split"
          eyebrow="Каталог продукции"
          title={`${products.length} видов продукции для ЛЭП`}
          subtitle="Изготовим типовые изделия по сериям или по индивидуальному чертежу заказчика."
        >
          <div className="pill-note">
            <Icon name="tower" />
            <span>ВЛ 0,4-220 кВ<br />по ГОСТ и чертежам</span>
          </div>
        </SectionHead>
        <div className="catalog catalog--4">
          {products.slice(0, 7).map((p) => (
            <article className="card reveal" key={p.id}>
              <div className="card__gallery">
                <div className="card__slide is-active">
                  {p.image ? <img src={base + p.image} alt={p.name} loading="lazy" /> : <ProductArt kind={p.kind} />}
                </div>
                <span className="card__tag">{p.tag}</span>
              </div>
              <div className="card__body">
                <h3 className="card__title">{p.name}</h3>
                <p className="card__purpose">{p.purpose}</p>
                <ul className="card__specs">
                  {p.specs.map(([k, v]) => <li key={k}><span>{k}</span><span>{v}</span></li>)}
                </ul>
                <div className="card__footer">
                  <Button as="button" type="button" variant="outline" arrow className="btn--block" onClick={() => onRequest(p.name)}>
                    Запросить расчёт
                  </Button>
                </div>
              </div>
            </article>
          ))}
          <article className="card card--cta reveal">
            <div className="card__body">
              <span className="ico"><Icon name="file" /></span>
              <h3 className="card__title">Есть чертёж?</h3>
              <p className="card__purpose">Пришлите чертёж или спецификацию - рассчитаем стоимость и сроки в течение 1 рабочего дня.</p>
              <Button href="#order" arrow className="btn--block">Отправить чертёж</Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. О компании ---------- */
export function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div className="about__text reveal">
          <span className="eyebrow">{about.eyebrow}</span>
          <h2 className="section__title">{about.title}</h2>
          {about.paragraphs.map((t) => <p key={t}>{t}</p>)}
          <ul className="about__stats">
            {about.stats.map(([num, label]) => <li key={label}><strong>{num}</strong><span>{label}</span></li>)}
          </ul>
        </div>
        <div className="about__media reveal">
          {about.photos.map((src, i) => (
            <figure key={i} className="gallery__item">
              {src ? <img src={base + src} alt={`Производство ${i + 1}`} loading="lazy" /> : <PhotoPlaceholder label={i === 0 ? 'Фото цеха' : `Фото ${i + 1}`} />}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Преимущества ---------- */
export function Advantages() {
  return (
    <section className="advantages">
      <div className="container advantages__grid">
        {advantages.map((a) => (
          <div className="adv reveal" key={a.icon}>
            <span className="ico"><Icon name={a.icon} /></span>
            <p>{a.text.map((line, i) => <span key={i}>{line}<br /></span>)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 5. Порядок работы ---------- */
export function Process() {
  return (
    <section className="section" id="process">
      <div className="container">
        <SectionHead eyebrow="Как мы работаем" title="Порядок работы" subtitle="От заявки до поставки на объект" />
        <div className="process">
          {process.map((s, i) => (
            <div className="process__item reveal" key={s.title}>
              <div className="process__num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Заявка ---------- */
export function Order({ product, setProduct }) {
  const [fileLabel, setFileLabel] = useState('');
  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone'], {
    successText: 'Спасибо! Инженер свяжется с вами в течение рабочего дня.',
    onSuccess: () => { setFileLabel(''); setProduct(''); },
  });

  const onFile = (e) => {
    const f = e.target.files[0];
    if (f && f.size > MAX_FILE_MB * 1024 * 1024) {
      e.target.value = '';
      setFileLabel(`Файл больше ${MAX_FILE_MB} МБ`);
      return;
    }
    setFileLabel(f ? f.name : '');
  };

  return (
    <section className="order" id="order">
      <div className="order__glow" aria-hidden="true" />
      <div className="container order__inner">
        <div className="order__text reveal">
          <span className="eyebrow">Расчёт за 1 рабочий день</span>
          <h2 className="section__title">Запросить расчёт стоимости</h2>
          <p>Прикрепите чертёж или спецификацию - инженер подготовит коммерческое предложение с ценой и сроками изготовления.</p>
          <ul className="checklist">
            <li><Icon name="check" />Работаем с юрлицами по договору</li>
            <li><Icon name="check" />Полный пакет документов и сертификаты</li>
            <li><Icon name="check" />Доставка на объект по всему Узбекистану</li>
          </ul>
        </div>
        <form className="form reveal" onSubmit={onSubmit} noValidate encType="multipart/form-data">
          <FormMeta source="Заявка на расчёт" />
          <div className="form__row">
            <Field label="Ваше имя *" error={errors.name}><input type="text" name="name" placeholder="Имя" /></Field>
            <Field label="Компания"><input type="text" name="company" placeholder="Название" /></Field>
          </div>
          <div className="form__row">
            <Field label="Телефон *" error={errors.phone}><PhoneInput /></Field>
            <Field label="Количество"><input type="text" name="quantity" placeholder="напр. 50 шт / 12 т" /></Field>
          </div>
          <Field label="Вид продукции">
            <select name="product" value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="">Выберите или опишите в комментарии</option>
              {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Комментарий">
            <textarea name="comment" placeholder="Сроки, адрес объекта, особые требования" />
          </Field>
          <label className={`file${fileLabel ? ' has-file' : ''}`}>
            <input type="file" name="file" accept={FILE_ACCEPT} onChange={onFile} />
            <span className="file__icon"><Icon name="clip" /></span>
            <span className="file__name">{fileLabel || `Прикрепить чертёж / спецификацию (до ${MAX_FILE_MB} МБ)`}</span>
          </label>
          <Button as="button" type="submit" arrow className="btn--block" disabled={sending}>Отправить заявку</Button>
          <p className="form__note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
          <FormStatus status={status} />
        </form>
      </div>
    </section>
  );
}
