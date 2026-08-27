import { Cursor, Footer, Header, PrototypeBar } from './components/Chrome';
import { Hero } from './components/Hero';
import { Manifest, Interlude, About, Testimonials } from './components/Editorial';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <>
      <a
        href="#portfolio"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-paper focus:bg-ink focus:px-5 focus:py-3"
      >
        Zum Inhalt springen
      </a>

      <PrototypeBar />
      <Header />

      <main>
        <Hero />
        <Manifest />
        <Portfolio />
        <Interlude />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <Cursor />
    </>
  );
}
