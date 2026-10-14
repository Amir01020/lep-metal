import { useEffect, useState } from 'react';
import { products, MAX_FILE_MB, FILE_ACCEPT } from '../data';
import { useLeadForm } from '../lib/form';
import { getLenis } from '../lib/motion';
import { Field, PhoneInput, FormMeta, FormStatus, Button } from './ui';

// Форма заявки. Все поля уходят в Telegram-бота через send.php (вместе с файлом)
export function QuoteForm({ product = '', source = 'Заявка на расчёт', onSent }) {
  const [fileLabel, setFileLabel] = useState('');
  const [value, setValue] = useState(product);
  useEffect(() => setValue(product), [product]);

  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone'], {
    successText: 'Спасибо! Инженер свяжется с вами в течение рабочего дня.',
    onSuccess: () => { setFileLabel(''); onSent?.(); },
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
    <form className="form" onSubmit={onSubmit} noValidate encType="multipart/form-data">
      <FormMeta source={source} />
      <div className="form__row">
        <Field label="Имя *" error={errors.name}><input type="text" name="name" autoComplete="name" /></Field>
        <Field label="Телефон *" error={errors.phone}><PhoneInput /></Field>
      </div>
      <div className="form__row">
        <Field label="Компания"><input type="text" name="company" autoComplete="organization" /></Field>
        <Field label="Количество"><input type="text" name="quantity" placeholder="напр. 50 шт / 12 т" /></Field>
      </div>
      <Field label="Изделие">
        <select name="product" value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">Не выбрано</option>
          {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </Field>
      <Field label="Комментарий">
        <textarea name="comment" rows="3" placeholder="Сроки, адрес объекта, особые требования" />
      </Field>
      <label className={`file${fileLabel ? ' has-file' : ''}`}>
        <input type="file" name="file" accept={FILE_ACCEPT} onChange={onFile} />
        <span>{fileLabel || `+ Прикрепить чертёж (до ${MAX_FILE_MB} МБ)`}</span>
      </label>
      <Button type="submit" disabled={sending}>Отправить заявку</Button>
      <FormStatus status={status} />
    </form>
  );
}

// Панель с формой, выезжает справа (открывается кнопкой "Запросить расчёт")
export default function QuotePanel({ open, product, onClose }) {
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop(); else lenis?.start();
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`quote${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="quote__overlay" onClick={onClose} />
      <aside className="quote__panel" role="dialog" aria-modal="true" aria-label="Запросить расчёт" data-lenis-prevent>
        <button className="quote__close" onClick={onClose} aria-label="Закрыть">Закрыть</button>
        <h2 className="quote__title">Запросить расчёт</h2>
        <p className="quote__text">Оставьте контакты и прикрепите чертёж — ответим в течение рабочего дня.</p>
        {open && <QuoteForm product={product} />}
      </aside>
    </div>
  );
}
