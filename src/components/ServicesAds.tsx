import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, MessageCircle, Search, Rocket, ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GalaxyBackground } from './GalaxyBackground';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.73-3.95-1.68-.1.93-.1 1.86-.1 2.79 0 1.93-.5 3.84-1.5 5.48-1.5 2.5-4.12 4.16-7 4.39-2.88.23-5.83-.8-7.79-2.95C.13 15.93-.41 12.83.65 10c.84-2.22 2.72-3.92 4.97-4.63.1-.03.2-.06.3-.08V9.4c-.67.2-1.32.55-1.8 1.08-.76.84-1.07 1.99-.95 3.1.1 1.05.6 2.05 1.45 2.68 1.18.88 2.82.99 4.08.31 1.05-.56 1.76-1.66 1.87-2.85.08-2.61.03-5.22.04-7.83 0-1.8-.02-3.6 0-5.4 0-.1.02-.2.03-.3z" />
  </svg>
);

const adsPricingData = {
  facebookAds: {
    title: 'Facebook Ads', icon: <FacebookIcon />,
    packages: [
      { name: 'BASIC', price: '6.000.000', target: 'NGÂN SÁCH: 4.000.000 VNĐ | PHÍ DV: 2.000.000 VNĐ', color: 'purple', features: ['Nghiên cứu đối tượng cơ bản', '1-2 nhóm quảng cáo / tháng', 'Tối ưu Traffic hoặc Engagement', 'Báo cáo cuối tháng', 'Tư vấn nội dung cơ bản'] },
      { name: 'PRO 1', price: '12.000.000', target: 'NGÂN SÁCH: 8.000.000 VNĐ | PHÍ DV: 4.000.000 VNĐ', color: 'blue', features: ['Phân tích & target đối tượng chi tiết', '3-5 nhóm quảng cáo / tháng', 'Tối ưu Lead / Conversion', 'A/B test creative', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '22.000.000', popular: true, target: 'NGÂN SÁCH: 16.000.000 VNĐ | PHÍ DV: 6.000.000 VNĐ', color: 'orange', features: ['Target nâng cao: Custom Audience, Lookalike', 'Không giới hạn nhóm quảng cáo', 'Remarketing bám đuổi nhiều tầng', 'Tối ưu ROAS - tư vấn landing page', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>30 TRIỆU', target: 'NGÂN SÁCH: >20.000.000 VNĐ | PHÍ DV: 12% - 15% NS', color: 'pink', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược quảng cáo theo phễu (Funnel)', 'Tư vấn content & creative theo tuần', 'Tích hợp Pixel - sự kiện chuyển đổi nâng cao', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>50 TRIỆU', target: 'NGÂN SÁCH: >40.000.000 VNĐ | PHÍ DV: 10% NS', color: 'teal', features: ['Toàn bộ tính năng VIP 1', 'Quản lý tài khoản quảng cáo BM riêng', 'Tư vấn chiến lược marketing tổng thể', 'Kết hợp Google Ads + Facebook Ads', 'Báo cáo phân tích chuyên sâu hàng tháng'] }
    ]
  },
  zaloAds: {
    title: 'Zalo Ads', icon: <MessageCircle className="w-5 h-5" />,
    packages: [
      { name: 'BASIC', price: '5.000.000', target: 'NGÂN SÁCH: 3.000.000 VNĐ | PHÍ DV: 2.000.000 VNĐ', color: 'purple', features: ['Zalo Display Ads cơ bản', 'Target khu vực, độ tuổi, giới tính', '1-2 banner quảng cáo / tháng', 'Tối ưu Reach / Traffic', 'Báo cáo cuối tháng'] },
      { name: 'PRO 1', price: '10.000.000', target: 'NGÂN SÁCH: 7.000.000 VNĐ | PHÍ DV: 3.000.000 VNĐ', color: 'blue', features: ['Zalo Display Ads + OA Ads', 'Target nâng cao: sở thích, hành vi', '3-5 banner / tháng', 'Tối ưu Follow OA + Lead', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '18.000.000', popular: true, target: 'NGÂN SÁCH: 13.000.000 VNĐ | PHÍ DV: 5.000.000 VNĐ', color: 'orange', features: ['Zalo Display + OA Ads + Remarketing', 'Custom Audience từ danh sách khách hàng', 'Tối ưu chuyển đổi & CPL', 'Quản lý nội dung Zalo OA cơ bản', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>28 TRIỆU', target: 'NGÂN SÁCH: >20.000.000 VNĐ | PHÍ DV: 12%-15% NS', color: 'pink', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược quảng cáo Zalo theo phễu', 'Quản lý Zalo OA toàn diện (bài đăng, chat)', 'Tích hợp Zalo Pixel - sự kiện chuyển đổi', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>45 TRIỆU', target: 'NGÂN SÁCH: >35.000.000 VNĐ | PHÍ DV: 10% NS', color: 'teal', features: ['Toàn bộ tính năng VIP 1', 'Kết hợp Zalo + Facebook + Google Ads', 'Chiến lược marketing tổng thể đa kênh', 'Tư vấn CRM Zalo - chăm sóc khách hàng', 'Báo cáo phân tích chuyên sâu hàng tháng'] }
    ]
  },
  tiktokAds: {
    title: 'TikTok Ads', icon: <TiktokIcon />,
    packages: [
      { name: 'BASIC', price: '7.000.000', target: 'NGÂN SÁCH: 5.000.000 VNĐ | PHÍ DV: 2.000.000 VNĐ', color: 'purple', features: ['In-Feed Ads cơ bản', 'Target theo độ tuổi, giới tính, khu vực', '1-2 video quảng cáo / tháng', 'Tối ưu View / Traffic', 'Báo cáo cuối tháng'] },
      { name: 'PRO 1', price: '13.000.000', target: 'NGÂN SÁCH: 9.000.000 VNĐ | PHÍ DV: 4.000.000 VNĐ', color: 'blue', features: ['In-Feed Ads + Spark Ads', 'Target Interest & Behavior chi tiết', '3-5 creative video / tháng', 'A/B test nội dung', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '23.000.000', popular: true, target: 'NGÂN SÁCH: 17.000.000 VNĐ | PHÍ DV: 6.000.000 VNĐ', color: 'orange', features: ['In-Feed + Spark Ads + TopView', 'Custom Audience & Lookalike nâng cao', 'Remarketing người đã xem video', 'Tư vấn brief content & script video', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>35 TRIỆU', target: 'NGÂN SÁCH: >25.000.000 VNĐ | PHÍ DV: 12%-15% NS', color: 'pink', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược content TikTok theo phễu', 'Tư vấn kịch bản video hàng tuần', 'Tích hợp Pixel TikTok - event chuyển đổi', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>55 TRIỆU', target: 'NGÂN SÁCH: >45.000.000 VNĐ | PHÍ DV: 10% NS', color: 'teal', features: ['Toàn bộ tính năng VIP 1', 'Kết hợp TikTok + Facebook Ads', 'Quản lý tài khoản Business Center riêng', 'Chiến lược marketing tổng thể đa kênh', 'Báo cáo phân tích chuyên sâu hàng tháng'] }
    ]
  },
  googleAds: {
    title: 'Google Ads', icon: <Search className="w-5 h-5" />,
    packages: [
      { name: 'BASIC', price: '6.000.000', target: 'NGÂN SÁCH: 4.000.000 VNĐ | PHÍ DV: 2.000.000 VNĐ', color: 'purple', features: ['20-30 từ khóa theo ngành', 'Quảng cáo Top Google khu vực mục tiêu', 'Theo dõi - tối ưu cơ bản chuyển đổi', 'Báo cáo cuối tháng (Click - CTR - Chi phí)'] },
      { name: 'PRO 1', price: '12.000.000', target: 'NGÂN SÁCH: 8.000.000 VNĐ | PHÍ DV: 4.000.000 VNĐ', color: 'blue', features: ['50-100 từ khóa theo ngành', 'Tối ưu chuyển đổi (form, gọi điện)', 'Remarketing khách đã truy cập', 'Tối ưu web cơ bản để tăng hiệu quả', 'Báo cáo chi tiết hàng tháng'] },
      { name: 'PRO 2', price: '22.000.000', popular: true, target: 'NGÂN SÁCH: 16.000.000 VNĐ | PHÍ DV: 6.000.000 VNĐ', color: 'orange', features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu website tăng tỷ lệ chuyển đổi', 'Tư vấn hệ thống marketing online'] },
      { name: 'VIP 1', price: '>30 TRIỆU', target: 'NGÂN SÁCH: >30.000.000 VNĐ | PHÍ DV: 12%-15% NS', color: 'pink', features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu web + chạy video Youtube', 'Tư vấn tối ưu hệ thống marketing online'] },
      { name: 'VIP 2', price: '>50 TRIỆU', target: 'NGÂN SÁCH: >50.000.000 VNĐ | PHÍ DV: 10% NS', color: 'teal', features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu web toàn diện', 'Tư vấn tối ưu hệ thống marketing online'] }
    ]
  }
};

const getColorStyles = (color: string, popular?: boolean) => {
  switch (color) {
    case 'purple': return { border: 'border-purple-500/90 hover:border-purple-400', bg: 'bg-purple-500/20', accent: 'text-purple-300', btn: 'bg-purple-600 hover:bg-purple-500', glow: 'shadow-[0_0_60px_-10px_rgba(168,85,247,0.5)]', innerGlow: 'shadow-[inset_0_0_60px_rgba(168,85,247,0.3)]', popularBg: 'bg-purple-600', glass: 'bg-gradient-to-br from-purple-500/10 via-zinc-900/90 to-zinc-900/95' };
    case 'orange': return { border: 'border-orange-500/95 hover:border-orange-500', bg: 'bg-orange-500/20', accent: 'text-orange-300', btn: 'bg-orange-600 hover:bg-orange-500', glow: 'shadow-[0_0_60px_-10px_rgba(249,115,22,0.5)]', innerGlow: 'shadow-[inset_0_0_60px_rgba(249,115,22,0.3)]', popularBg: 'bg-orange-600', glass: 'bg-gradient-to-br from-orange-500/10 via-zinc-900/90 to-zinc-900/95' };
    case 'pink': return { border: 'border-pink-500/95 hover:border-pink-500', bg: 'bg-pink-500/20', accent: 'text-pink-300', btn: 'bg-pink-600 hover:bg-pink-500', glow: 'shadow-[0_0_60px_-10px_rgba(236,72,153,0.5)]', innerGlow: 'shadow-[inset_0_0_60px_rgba(236,72,153,0.3)]', popularBg: 'bg-pink-600', glass: 'bg-gradient-to-br from-pink-500/10 via-zinc-900/90 to-zinc-900/95' };
    case 'teal': return { border: 'border-teal-500/95 hover:border-teal-500', bg: 'bg-teal-500/20', accent: 'text-teal-300', btn: 'bg-teal-600 hover:bg-teal-500', glow: 'shadow-[0_0_60px_-10px_rgba(20,184,166,0.5)]', innerGlow: 'shadow-[inset_0_0_60px_rgba(20,184,166,0.3)]', popularBg: 'bg-teal-600', glass: 'bg-gradient-to-br from-teal-500/10 via-zinc-900/90 to-zinc-900/95' };
    default: return { border: popular ? 'border-blue-400' : 'border-blue-500/50 hover:border-blue-400', bg: 'bg-blue-500/20', accent: 'text-blue-300', btn: 'bg-blue-600 hover:bg-blue-500', glow: 'shadow-[0_0_60px_-10px_rgba(59,130,246,0.6)]', innerGlow: 'shadow-[inset_0_0_60px_rgba(59,130,246,0.4)]', popularBg: 'bg-blue-600', glass: 'bg-gradient-to-br from-blue-500/10 via-zinc-900/90 to-zinc-900/95' };
  }
};

export function ServicesAds() {
  const [activeTab, setActiveTab] = useState<keyof typeof adsPricingData>('facebookAds');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }, exit: { opacity: 0 } };
  const cardVariants: any = { hidden: { opacity: 0, y: 50, scale: 0.95 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }, exit: { opacity: 0, y: -20, scale: 0.95 } };

  const scrollToTab = (element: HTMLElement) => {
    const container = document.getElementById('tabs-ads');
    if (!container) return;
    container.scrollTo({ left: element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2), behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-white overflow-x-hidden">
      <GalaxyBackground />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.4, 1], x: [0, 50, 0], y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
        <motion.div animate={{ scale: [1.4, 1, 1.4], x: [0, -50, 0], y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full" />
      </div>

      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto"><Navbar /></div>
      </header>

      <section className="w-full bg-transparent pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <Rocket className="w-4 h-4 text-orange-400" />
              <span className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">Dịch vụ quảng cáo đa nền tảng</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
              Bảng Giá <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Dịch Vụ Ads</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-slate-400 max-w-2xl mx-auto text-lg">
              Quảng cáo đa nền tảng hiệu quả giúp tiếp cận đúng khách hàng mục tiêu và bùng nổ doanh số.
            </motion.p>
          </div>

          {/* Tabs */}
          <div className="relative group mb-16 px-4">
            <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute left-4 inset-y-0 flex items-center z-20 pointer-events-none">
              <button onClick={() => document.getElementById('tabs-ads')?.scrollBy({ left: -400, behavior: 'smooth' })} className="pointer-events-auto p-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-orange-600 hover:scale-110">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div id="tabs-ads" className="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-5 pb-8 px-12 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
              {Object.entries(adsPricingData).map(([key, data]) => {
                const isActive = activeTab === key;
                return (
                  <button key={key} onClick={(e) => { setActiveTab(key as keyof typeof adsPricingData); scrollToTab(e.currentTarget); }} className={`relative flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 border shrink-0 ${isActive ? 'text-white border-orange-500/50' : 'text-slate-400 border-white/10 hover:bg-white/5'}`}>
                    {isActive && <motion.div layoutId="adsTab" className="absolute inset-0 bg-orange-600 rounded-2xl shadow-[0_15px_35px_-10px_rgba(234,88,12,0.6)]" transition={{ type: 'spring', stiffness: 60, damping: 20 }} />}
                    <span className="relative z-10 flex items-center gap-3">{data.icon}{data.title}</span>
                  </button>
                );
              })}
            </div>
            <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#050505] via-[#050505]/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-4 inset-y-0 flex items-center z-20 pointer-events-none">
              <button onClick={() => document.getElementById('tabs-ads')?.scrollBy({ left: 400, behavior: 'smooth' })} className="pointer-events-auto p-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-orange-600 hover:scale-110">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
              {adsPricingData[activeTab].packages.map((pkg, index) => {
                const styles = getColorStyles(pkg.color, pkg.popular);
                return (
                  <motion.div key={index} variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.4 } }} className={`relative flex flex-col rounded-3xl ${styles.glass} border ${styles.border} ${pkg.popular ? styles.glow : ''} ${styles.innerGlow} group/card shadow-2xl`}>
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
                        <span className={`${styles.popularBg} text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-2xl whitespace-nowrap border border-white/20`}>Khuyên Dùng</span>
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${styles.accent.replace('text', 'from')}/20 to-transparent blur-[60px] rounded-full group-hover/card:scale-125 transition-transform duration-1000`} />
                    </div>
                    <div className="relative z-10 p-6 flex flex-col h-full">
                      <div className="mb-6">
                        <span className={`text-xs font-black uppercase tracking-[0.2em] block mb-3 text-center ${styles.accent}`}>Gói {pkg.name}</span>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter text-center leading-none">{pkg.price}</h3>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 mt-4">
                          <p className="text-white/70 text-[10px] font-bold leading-relaxed text-center">{pkg.target}</p>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 mb-8">
                        {pkg.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-start gap-2">
                            <div className="mt-0.5 w-4 h-4 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                              <Check className={`w-2 h-2 ${styles.accent}`} />
                            </div>
                            <span className="text-slate-300 text-[11px] font-medium leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <a href="https://zalo.me/0899180086" target="_blank" rel="noopener noreferrer" className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-300 ${styles.btn} hover:scale-[1.02] active:scale-95 text-center block`}>Tư vấn Ads</a>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <div className="mt-20 text-center">
            <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 border border-white/5">
              <div className="px-8 py-4 rounded-xl bg-black/40 backdrop-blur-md">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Cam kết hiệu quả với chuyên gia <span className="text-white">5+ năm kinh nghiệm</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
