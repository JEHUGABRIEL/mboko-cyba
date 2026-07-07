import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Contact } from './pages/Contact';
import { Realisations } from './pages/Realisations';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import { SiteProvider } from './context/SiteContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes — les images ne changent pas souvent
      gcTime: 1000 * 60 * 30,    // 30 minutes dans le cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
      {!isAdmin && <Navbar />}
      {!isAdmin && <ChatBot />}
      <main className={isAdmin ? '' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/boutique" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        <Router>
          <AppLayout />
        </Router>
      </SiteProvider>
    </QueryClientProvider>
  );
}