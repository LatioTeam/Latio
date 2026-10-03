import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Megaphone } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GalaxyBackground } from './GalaxyBackground';

export function ServicesHub() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 'care',
      path: '/services/care',
      icon: <Heart className="w-12 h-12" />,
      title: 'Dịch Vụ Chăm Sóc',
      subtitle: 'Social Media & Content',
      description: 'Quản lý và phát triển thương hiệu trên đa nền tảng: Fanpage, TikTok, Zalo, Website, Shopee... với nội dung sáng tạo, chuyên nghiệp.',
      features: ['Quản lý Fanpage Facebook', 'TikTok Marketing', 'Zalo OA Marketing', 'SEO Website', 'Shopee Marketing'],
      gradient: 'from-blue-600 to-cyan-500',
      glowColor: 'rgba(37,99,235,0.5)',
      borderColor: 'border-blue-500/40 hover:border-blue-400',
      bgGlass: 'bg-gradient-to-br from-blue-500/10 via-zinc-900/95 to-zinc-900',
      tag: 'CHĂM SÓC & VẬN HÀNH',
      tagColor: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'ads',
      path: '/services/ads',
      icon: <Megaphone className="w-12 h-12" />,
      title: 'Dịch Vụ Ads',
      subtitle: 'Quảng Cáo Đa Nền Tảng',
      description: 'Chiến lược quảng cáo hiệu quả trên Zalo Ads, TikTok Ads, Google Ads và Facebook Ads giúp doanh nghiệp bùng nổ doanh số.',
      features: ['Zalo Ads', 'TikTok Ads', 'Google Ads', 'Facebook Ads'],
      gradient: 'from-orange-600 to-red-500',
      glowColor: 'rgba(234,88,12,0.5)',
      borderColor: 'border-orange-500/40 hover:border-orange-400',
      bgGlass: 'bg-gradient-to-br from-orange-500/10 via-zinc-900/95 to-zinc-900',
      tag: 'QUẢNG CÁO & TĂNG DOANH SỐ',
      tagColor: 'bg-orange-600/20 text-orange-300 border-orange-500/30',
    }
  ];

  return (
    <div className="w-full min-h-screen bg-transparent text-white overflow-x-hidden">
      <GalaxyBackground />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.4, 1], x: [0, 50, 0], y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <motion.div animate={{ scale: [1.4, 1, 1.4], x: [0, -50, 0], y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </header>

      <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">Chọn dịch vụ phù hợp</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
              Dịch Vụ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Latio</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-slate-400 text-lg max-w-xl mx-auto">
              Chọn danh mục dịch vụ bạn muốn tìm hiểu để xem bảng giá chi tiết.
            </motion.p>
          </div>

          {/* 2 Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.25 + i * 0.18,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                whileHover={{ scale: 1.04, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={svc.path}
                  className={`group relative flex flex-col h-full min-h-[460px] rounded-[2.5rem] border ${svc.borderColor} ${svc.bgGlass} p-10 overflow-hidden transition-colors duration-500 hover:shadow-2xl block`}
                  style={{ boxShadow: `0 0 0 0 ${svc.glowColor}` }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 80px -10px ${svc.glowColor}`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${svc.glowColor}`)}
                >
                  {/* Top decoration */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${svc.gradient} opacity-10 blur-[80px] rounded-full group-hover:opacity-25 transition-opacity duration-700`} />

                  {/* Tag */}
                  <span className={`inline-flex self-start items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border mb-8 ${svc.tagColor}`}>
                    {svc.tag}
                  </span>

                  {/* Icon */}
                  <div className={`mb-6 text-transparent bg-clip-text bg-gradient-to-br ${svc.gradient} w-fit`}>
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${svc.gradient} bg-opacity-10 border border-white/10 text-white`}>
                      {svc.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{svc.title}</h2>
                  <p className={`text-sm font-bold uppercase tracking-widest mb-4 text-transparent bg-clip-text bg-gradient-to-r ${svc.gradient}`}>{svc.subtitle}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">{svc.description}</p>

                  {/* Features list */}
                  <div className="flex flex-wrap gap-2 mb-8 flex-1">
                    {svc.features.map(f => (
                      <span key={f} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-bold">
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className={`flex items-center gap-3 font-black text-sm uppercase tracking-widest bg-gradient-to-r ${svc.gradient} bg-clip-text text-transparent group-hover:gap-5 transition-all duration-300`}>
                    Xem bảng giá
                    <ArrowRight className={`w-5 h-5 bg-gradient-to-r ${svc.gradient} text-white p-0.5 rounded-full flex-shrink-0 group-hover:translate-x-2 transition-transform duration-300`} style={{ background: `linear-gradient(to right, ${svc.gradient.replace('from-','').replace(' to-', ', ')})`, color: 'white' }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
