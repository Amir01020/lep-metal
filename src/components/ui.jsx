import { maskPhone } from '../lib/form';

export function Arrow() {
  return <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>;
}

// Кнопка: текст сменяется снизу при наведении, справа квадрат со стрелкой
export function Button({ href, onClick, variant = 'dark', small, children, type, disabled }) {
  const cls = `btn btn--${variant}${small ? ' btn--sm' : ''}`;
  const inner = (
    <>
      <span className="btn__label"><span className="btn__roll"><span>{children}</span><span aria-hidden="true">{children}</span></span></span>
      <span className="btn__icon"><Arrow /></span>
    </>
  );
  if (href) return <a href={href} className={cls} onClick={onClick}>{inner}</a>;
  return <button type={type || 'button'} className={cls} onClick={onClick} disabled={disabled}>{inner}</button>;
}

export function Field({ label, error, children }) {
  return (
    <label className={`field${error ? ' is-error' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function PhoneInput(props) {
  return (
    <input
      type="tel"
      name="phone"
      placeholder="+998 __ ___-__-__"
      onInput={(e) => { e.target.value = maskPhone(e.target.value); }}
      {...props}
    />
  );
}

// Скрытое поле-ловушка для ботов + источник заявки
export function FormMeta({ source }) {
  return (
    <>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="form" value={source} />
    </>
  );
}

export function FormStatus({ status }) {
  return (
    <p className={`form__status${status.type ? ' is-' + status.type : ''}`} role="status">
      {status.text}
    </p>
  );
}
