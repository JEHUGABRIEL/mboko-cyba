
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Amenities } from './components/Amenities';
import { Rooms } from './components/Rooms';
import { Dining } from './components/Dining';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { ChambresPage } from './pages/ChambresPage';
import { RestaurantPage } from './pages/RestaurantPage';
import { BarPage } from './pages/BarPage';
import { BienEtrePage } from './pages/BienEtrePage';
import { SuitesPage } from './pages/SuitesPage';
import { EvenementsPage } from './pages/EvenementsPage';
import { WhatsAppFab } from './components/WhatsAppFab';
import { ContactModalProvider } from './context/ContactModalContext';
import { ContactModal } from './components/ContactModal';

function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Amenities />
      <Rooms />
      <Dining />
      <Testimonials />
      <Contact />
    </main>
  );
}

export function App() {
  return (
    <ContactModalProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-200 selection:text-brand-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chambres" element={<ChambresPage />} />
            <Route path="/restaurant" element={<RestaurantPage />} />
            <Route path="/bar" element={<BarPage />} />
            <Route path="/bien-etre" element={<BienEtrePage />} />
            <Route path="/suites" element={<SuitesPage />} />
            <Route path="/evenements" element={<EvenementsPage />} />
          </Routes>
          <WhatsAppFab />
          <ContactModal />
          <Footer />
        </div>
      </BrowserRouter>
    </ContactModalProvider>
  );
}