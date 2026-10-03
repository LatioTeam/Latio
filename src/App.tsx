import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { About } from './components/About';
import { AgencyContent } from './components/AgencyContent';
import { Footer } from './components/Footer';
import { Admin } from './components/Admin';
import { Blog } from './components/Blog';
import { BlogDetail } from './components/BlogDetail';
import { Contact } from './components/Contact';
import { ServicesHub } from './components/ServicesHub';
import { ServicesCare } from './components/ServicesCare';
import { ServicesAds } from './components/ServicesAds';
import { FloatingContact } from './components/FloatingContact';
import ScrollToTop from './components/ScrollToTop';
import { Solutions } from './components/Solutions';

function HomePage() {
  return (
    <div className="w-full min-h-screen bg-transparent relative">
      {/* Video nền toàn trang */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
          type="video/mp4"
        />
      </video>
      <Hero />
      <AgencyContent />
      <Pricing />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<ServicesHub />} />
        <Route path="/services/care" element={<ServicesCare />} />
        <Route path="/services/ads" element={<ServicesAds />} />
        <Route path="/solutions" element={<Solutions />} />
      </Routes>
      <FloatingContact />
    </Router>
  );
}

export default App;
