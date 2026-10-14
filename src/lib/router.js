import { useEffect, useState } from 'react';

// Простой роутер на hash: работает на любом хостинге и из любой папки без настройки сервера.
//   #/product/<id>   - страница изделия с фотогалереей
//   #<section>       - главная + прокрутка к секции
export function parseRoute(hash = window.location.hash) {
  const m = hash.match(/^#\/(product)(?:\/([\w-]+))?/);
  if (m) return { page: m[1], id: m[2] || null, anchor: null };
  return { page: 'home', id: null, anchor: hash.length > 1 ? hash.slice(1) : null };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute());
  useEffect(() => {
    const on = () => setRoute(parseRoute());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
