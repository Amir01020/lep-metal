import { useState } from 'react';
import Header from './components/Header';
import { Contacts, Footer } from './components/Contacts';
import { Hero, Catalog, About, Advantages, Process, Order } from './components/Sections';
import useReveal from './lib/useReveal';

export default function App() {
  const [product, setProduct] = useState('');
  useReveal();

  // "Запросить расчёт" в карточке -> выбрать продукт в форме и прокрутить к ней
  const requestQuote = (name) => {
    setProduct(name);
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog onRequest={requestQuote} />
        <About />
        <Advantages />
        <Process />
        <Order product={product} setProduct={setProduct} />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
