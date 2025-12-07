import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CodePreview } from './components/CodePreview';
import { Stats } from './components/Stats';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0F0F12] overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <CodePreview />
        <Stats />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
