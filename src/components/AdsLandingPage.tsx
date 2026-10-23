import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, ArrowRight, Zap, Target, TrendingUp, BarChart3, Shield, Clock, ChevronDown, Phone, MessageSquare } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GalaxyBackground } from './GalaxyBackground';

// ─── Icons ───────────────────────────────────────────────────────────────────
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.73-3.95-1.68-.1.93-.1 1.86-.1 2.79 0 1.93-.5 3.84-1.5 5.48-1.5 2.5-4.12 4.16-7 4.39-2.88.23-5.83-.8-7.79-2.95C.13 15.93-.41 12.83.65 10c.84-2.22 2.72-3.92 4.97-4.63.1-.03.2-.06.3-.08V9.4c-.67.2-1.32.55-1.8 1.08-.76.84-1.07 1.99-.95 3.1.1 1.05.6 2.05 1.45 2.68 1.18.88 2.82.99 4.08.31 1.05-.56 1.76-1.66 1.87-2.85.08-2.61.03-5.22.04-7.83 0-1.8-.02-3.6 0-5.4 0-.1.02-.2.03-.3z" />
  </svg>
);
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);
const ZaloIcon = () => (
  <svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6">
    <circle cx="50" cy="50" r="50" fill="#0068FF" />
    <text x="50" y="65" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold" fontFamily="Arial">Z</text>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const platforms = [
  {
    key: 'facebook',
    label: 'Facebook Ads',
    icon: <FacebookIcon />,
    color: 'blue',
    gradient: 'from-blue-600 to-blue-400',
    glow: 'shadow-[0_0_40px_-8px_rgba(59,130,246,0.6)]',
    border: 'border-blue-500/50 hover:border-blue-400',
    accent: 'text-blue-300',
    bg: 'bg-blue-500/10',
    btnBg: 'bg-blue-600 hover:bg-blue-500',
    packages: [
      { name: 'BASIC', price: '6.000.000', budget: '4.000.000', fee: '2.000.000', features: ['Nghiên cứu đối tượng cơ bản', '1-2 nhóm quảng cáo / tháng', 'Tối ưu Traffic hoặc Engagement', 'Báo cáo cuối tháng', 'Tư vấn nội dung cơ bản'] },
      { name: 'PRO 1', price: '12.000.000', budget: '8.000.000', fee: '4.000.000', features: ['Phân tích & target đối tượng chi tiết', '3-5 nhóm quảng cáo / tháng', 'Tối ưu Lead / Conversion', 'A/B test creative', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '22.000.000', budget: '16.000.000', fee: '6.000.000', popular: true, features: ['Target nâng cao: Custom Audience, Lookalike', 'Không giới hạn nhóm quảng cáo', 'Remarketing bám đuổi nhiều tầng', 'Tối ưu ROAS - tư vấn landing page', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>30 TRIỆU', budget: '>20.000.000', fee: '12% - 15% NS', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược quảng cáo theo phễu (Funnel)', 'Tư vấn content & creative theo tuần', 'Tích hợp Pixel - sự kiện chuyển đổi nâng cao', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>50 TRIỆU', budget: '>40.000.000', fee: '10% NS', features: ['Toàn bộ tính năng VIP 1', 'Quản lý tài khoản quảng cáo BM riêng', 'Tư vấn chiến lược marketing tổng thể', 'Kết hợp Google Ads + Facebook Ads', 'Báo cáo phân tích chuyên sâu hàng tháng'] },
    ],
  },
  {
    key: 'tiktok',
    label: 'TikTok Ads',
    icon: <TiktokIcon />,
    color: 'pink',
    gradient: 'from-pink-600 to-rose-400',
    glow: 'shadow-[0_0_40px_-8px_rgba(236,72,153,0.6)]',
    border: 'border-pink-500/50 hover:border-pink-400',
    accent: 'text-pink-300',
    bg: 'bg-pink-500/10',
    btnBg: 'bg-pink-600 hover:bg-pink-500',
    packages: [
      { name: 'BASIC', price: '7.000.000', budget: '5.000.000', fee: '2.000.000', features: ['In-Feed Ads cơ bản', 'Target theo độ tuổi, giới tính, khu vực', '1-2 video quảng cáo / tháng', 'Tối ưu View / Traffic', 'Báo cáo cuối tháng'] },
      { name: 'PRO 1', price: '13.000.000', budget: '9.000.000', fee: '4.000.000', features: ['In-Feed Ads + Spark Ads', 'Target Interest & Behavior chi tiết', '3-5 creative video / tháng', 'A/B test nội dung', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '23.000.000', budget: '17.000.000', fee: '6.000.000', popular: true, features: ['In-Feed + Spark Ads + TopView', 'Custom Audience & Lookalike nâng cao', 'Remarketing người đã xem video', 'Tư vấn brief content & script video', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>35 TRIỆU', budget: '>25.000.000', fee: '12%-15% NS', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược content TikTok theo phễu', 'Tư vấn kịch bản video hàng tuần', 'Tích hợp Pixel TikTok - event chuyển đổi', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>55 TRIỆU', budget: '>45.000.000', fee: '10% NS', features: ['Toàn bộ tính năng VIP 1', 'Kết hợp TikTok + Facebook Ads', 'Quản lý tài khoản Business Center riêng', 'Chiến lược marketing tổng thể đa kênh', 'Báo cáo phân tích chuyên sâu hàng tháng'] },
    ],
  },
  {
    key: 'google',
    label: 'Google Ads',
    icon: <GoogleIcon />,
    color: 'orange',
    gradient: 'from-orange-500 to-yellow-400',
    glow: 'shadow-[0_0_40px_-8px_rgba(249,115,22,0.6)]',
    border: 'border-orange-500/50 hover:border-orange-400',
    accent: 'text-orange-300',
    bg: 'bg-orange-500/10',
    btnBg: 'bg-orange-600 hover:bg-orange-500',
    packages: [
      { name: 'BASIC', price: '6.000.000', budget: '4.000.000', fee: '2.000.000', features: ['20-30 từ khóa theo ngành', 'Quảng cáo Top Google khu vực mục tiêu', 'Theo dõi - tối ưu cơ bản chuyển đổi', 'Báo cáo cuối tháng (Click, CTR, Chi phí)'] },
      { name: 'PRO 1', price: '12.000.000', budget: '8.000.000', fee: '4.000.000', features: ['50-100 từ khóa theo ngành', 'Tối ưu chuyển đổi (form, gọi điện)', 'Remarketing khách đã truy cập', 'Tối ưu web cơ bản để tăng hiệu quả', 'Báo cáo chi tiết hàng tháng'] },
      { name: 'PRO 2', price: '22.000.000', budget: '16.000.000', fee: '6.000.000', popular: true, features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu website tăng tỷ lệ chuyển đổi', 'Tư vấn hệ thống marketing online'] },
      { name: 'VIP 1', price: '>30 TRIỆU', budget: '>30.000.000', fee: '12%-15% NS', features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu web + chạy video Youtube', 'Tư vấn tối ưu hệ thống marketing online'] },
      { name: 'VIP 2', price: '>50 TRIỆU', budget: '>50.000.000', fee: '10% NS', features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu web toàn diện', 'Tư vấn tối ưu hệ thống marketing online'] },
    ],
  },
  {
    key: 'zalo',
    label: 'Zalo Ads',
    icon: <ZaloIcon />,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-400',
    glow: 'shadow-[0_0_40px_-8px_rgba(20,184,166,0.6)]',
    border: 'border-teal-500/50 hover:border-teal-400',
    accent: 'text-teal-300',
    bg: 'bg-teal-500/10',
    btnBg: 'bg-teal-600 hover:bg-teal-500',
    packages: [
      { name: 'BASIC', price: '5.000.000', budget: '3.000.000', fee: '2.000.000', features: ['Zalo Display Ads cơ bản', 'Target khu vực, độ tuổi, giới tính', '1-2 banner quảng cáo / tháng', 'Tối ưu Reach / Traffic', 'Báo cáo cuối tháng'] },
      { name: 'PRO 1', price: '10.000.000', budget: '7.000.000', fee: '3.000.000', features: ['Zalo Display Ads + OA Ads', 'Target nâng cao: sở thích, hành vi', '3-5 banner / tháng', 'Tối ưu Follow OA + Lead', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '18.000.000', budget: '13.000.000', fee: '5.000.000', popular: true, features: ['Zalo Display + OA Ads + Remarketing', 'Custom Audience từ danh sách khách hàng', 'Tối ưu chuyển đổi & CPL', 'Quản lý nội dung Zalo OA cơ bản', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>28 TRIỆU', budget: '>20.000.000', fee: '12%-15% NS', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược quảng cáo Zalo theo phễu', 'Quản lý Zalo OA toàn diện (bài đăng, chat)', 'Tích hợp Zalo Pixel - sự kiện chuyển đổi', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>45 TRIỆU', budget: '>35.000.000', fee: '10% NS', features: ['Toàn bộ tính năng VIP 1', 'Kết hợp Zalo + Facebook + Google Ads', 'Chiến lược marketing tổng thể đa kênh', 'Tư vấn CRM Zalo - chăm sóc khách hàng', 'Báo cáo phân tích chuyên sâu hàng tháng'] },
    ],
  },
];

const stats = [
  { value: '500+', label: 'Khách hàng tin tưởng' },
  { value: '5+', label: 'Năm kinh nghiệm' },
  { value: '3x', label: 'ROAS trung bình' },
  { value: '98%', label: 'Tỷ lệ hài lòng' },
];

const usps = [
  { icon: <Target className="w-7 h-7" />, title: 'Target chính xác', desc: 'Phân tích đối tượng chuyên sâu, đưa quảng cáo đến đúng người, đúng thời điểm.' },
  { icon: <TrendingUp className="w-7 h-7" />, title: 'Tối ưu ROAS liên tục', desc: 'Theo dõi và tối ưu chiến dịch theo thời gian thực để tối đa hóa lợi nhuận.' },
  { icon: <BarChart3 className="w-7 h-7" />, title: 'Báo cáo minh bạch', desc: 'Dashboard real-time, báo cáo chi tiết hàng tuần — không che giấu số liệu.' },
  { icon: <Shield className="w-7 h-7" />, title: 'Cam kết hiệu quả', desc: 'Đội ngũ 5+ năm kinh nghiệm, cam kết hiệu quả hoặc hoàn tiền dịch vụ.' },
  { icon: <Zap className="w-7 h-7" />, title: 'Triển khai nhanh', desc: 'Lên chiến dịch trong 24-48h, không trì hoãn, không mất cơ hội thị trường.' },
  { icon: <Clock className="w-7 h-7" />, title: 'Hỗ trợ 24/7', desc: 'Luôn sẵn sàng hỗ trợ và xử lý sự cố ngay cả ngoài giờ hành chính.' },
];

const process = [
  { step: '01', title: 'Tư vấn & Phân tích', desc: 'Hiểu rõ mục tiêu kinh doanh, đối tượng khách hàng và ngân sách phù hợp.' },
  { step: '02', title: 'Xây dựng chiến lược', desc: 'Lên kế hoạch chiến dịch, chọn nền tảng tối ưu và thiết kế phễu chuyển đổi.' },
  { step: '03', title: 'Triển khai & Test', desc: 'Khởi chạy chiến dịch, A/B test creative để tìm ra công thức hiệu quả nhất.' },
  { step: '04', title: 'Tối ưu liên tục', desc: 'Theo dõi số liệu real-time, tối ưu ngân sách và scale up những gì hiệu quả.' },
];

const faqs = [
  { q: 'Ngân sách tối thiểu để chạy quảng cáo hiệu quả là bao nhiêu?', a: 'Ngân sách tối thiểu chúng tôi khuyến nghị là 3-5 triệu/tháng cho mỗi nền tảng. Tuy nhiên, với ngân sách thấp hơn bạn vẫn có thể thử nghiệm với gói BASIC của chúng tôi.' },
  { q: 'LATIO có cam kết kết quả cụ thể không?', a: 'Chúng tôi cam kết báo cáo minh bạch và tối ưu liên tục. Mục tiêu cụ thể (CPA, ROAS) sẽ được thỏa thuận rõ trong hợp đồng dịch vụ.' },
  { q: 'Mất bao lâu để thấy kết quả từ quảng cáo?', a: 'Thường 2-4 tuần đầu là giai đoạn học máy và tối ưu. Kết quả ổn định thường thấy rõ từ tháng thứ 2 trở đi.' },
  { q: 'LATIO có thể chạy đồng thời nhiều nền tảng không?', a: 'Có. Chúng tôi có đội ngũ chuyên biệt cho từng nền tảng và có thể triển khai chiến dịch đa kênh tích hợp để tối đa hóa hiệu quả.' },
];

// ─── Package Card ─────────────────────────────────────────────────────────────
function PkgCard({ pkg, platform }: { pkg: any; platform: typeof platforms[0] }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative flex flex-col rounded-3xl border ${platform.border} ${platform.bg} backdrop-blur-sm ${pkg.popular ? platform.glow : ''} shadow-xl p-6`}
    >
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg whitespace-nowrap">
            Khuyên Dùng
          </span>
        </div>
      )}
      <div className="mb-5">
        <span className={`text-xs font-black uppercase tracking-[0.2em] block mb-2 text-center ${platform.accent}`}>Gói {pkg.name}</span>
        <p className="text-2xl font-black text-white text-center tracking-tighter">{pkg.price}</p>
        <p className={`text-[10px] font-bold text-center mt-1 ${platform.accent}/70`}>VNĐ / THÁNG</p>
        <div className="mt-3 p-2 rounded-xl bg-black/40 border border-white/5 text-center">
          <p className="text-white/60 text-[10px] font-semibold leading-relaxed">
            Ngân sách: <span className="text-white/90">{pkg.budget}đ</span>
            <br />
            Phí DV: <span className="text-white/90">{pkg.fee}{!pkg.fee.includes('%') && ' VNĐ'}</span>
          </p>
        </div>
      </div>
      <div className="flex-1 space-y-2.5 mb-6">
        {pkg.features.map((f: string, i: number) => (
          <div key={i} className="flex items-start gap-2">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
              <Check className={`w-2 h-2 ${platform.accent}`} />
            </div>
            <span className="text-slate-300 text-[11px] font-medium leading-relaxed">{f}</span>
          </div>
        ))}
      </div>
      <a
        href="https://zalo.me/0899180086"
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 ${platform.btnBg} hover:scale-[1.02] active:scale-95 text-center block`}
      >
        Tư vấn ngay
      </a>
    </motion.div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-bold text-sm leading-relaxed">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdsLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activePlatform, setActivePlatform] = useState(0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const current = platforms[activePlatform];

  return (
    <div className="w-full min-h-screen bg-transparent text-white overflow-x-hidden">
      <GalaxyBackground />

      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 14, repeat: Infinity }} className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-orange-600/10 blur-[120px] rounded-full" />
        <motion.div animate={{ scale: [1.3, 1, 1.3], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 18, repeat: Infinity }} className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto"><Navbar /></div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">LATIO — Đơn vị quảng cáo hàng đầu Việt Nam</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
            Bứt phá<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-500">doanh số</span><br />
            với AI Ads
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Quảng cáo đa nền tảng — Facebook, TikTok, Google, Zalo — được tối ưu bởi AI và đội ngũ chuyên gia 5+ năm kinh nghiệm.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4 justify-center">
            <a
              href="#pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_-8px_rgba(249,115,22,0.6)]"
            >
              Xem bảng giá <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://zalo.me/0899180086"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-black text-sm uppercase tracking-widest hover:bg-white/15 transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Tư vấn miễn phí
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-2">{s.value}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── USPs ── */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Tại sao chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">LATIO?</span>
            </motion.h2>
            <p className="text-slate-400 max-w-xl mx-auto">Không chỉ chạy quảng cáo — chúng tôi xây dựng hệ thống tăng trưởng bền vững cho doanh nghiệp của bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-white/8 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 group-hover:bg-orange-500/20 transition-colors">
                  {u.icon}
                </div>
                <h3 className="text-white font-black text-lg mb-2">{u.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Quy trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">làm việc</span>
            </motion.h2>
            <p className="text-slate-400 max-w-xl mx-auto">Từ tư vấn đến kết quả — minh bạch, chuyên nghiệp, hiệu quả.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors"
              >
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500/30 to-transparent select-none absolute top-4 right-4">{p.step}</span>
                <div className="relative z-10">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest mb-3 block">Bước {p.step}</span>
                  <h3 className="text-white font-black text-lg mb-3">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
                {i < process.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500/40 z-20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platforms + Pricing ── */}
      <section id="pricing" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              <span className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">Bảng giá minh bạch — không phát sinh ẩn</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
              Bảng giá <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">dịch vụ</span>
            </motion.h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Chọn nền tảng và gói dịch vụ phù hợp với quy mô, ngân sách của doanh nghiệp bạn.</p>
          </div>

          {/* Platform Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {platforms.map((p, i) => (
              <button
                key={p.key}
                onClick={() => setActivePlatform(i)}
                className={`relative flex items-center gap-2.5 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-400 border ${activePlatform === i
                  ? `text-white border-transparent bg-gradient-to-r ${p.gradient} shadow-lg`
                  : 'text-slate-400 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Package Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlatform}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{ visible: { opacity: 1, transition: { staggerChildren: 0.08 } }, hidden: { opacity: 0 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
            >
              {current.packages.map((pkg, i) => (
                <PkgCard key={i} pkg={pkg} platform={current} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Footer note */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
            <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 border border-white/5">
              <p className="text-slate-400 text-sm font-medium">
                Ngân sách lớn hơn? <span className="text-white font-bold">Liên hệ để được báo giá riêng và ưu đãi đặc biệt.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Câu hỏi <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">thường gặp</span>
            </motion.h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative p-1 rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-[0_0_80px_-20px_rgba(249,115,22,0.5)]">
            <div className="bg-black/90 rounded-[calc(1.5rem-4px)] px-8 py-16 backdrop-blur-xl">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
                Sẵn sàng<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">bùng nổ doanh số?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Nhận tư vấn miễn phí trong 30 phút — chúng tôi sẽ phân tích và đề xuất chiến lược phù hợp nhất cho doanh nghiệp của bạn.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://zalo.me/0899180086"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_-8px_rgba(249,115,22,0.5)]"
                >
                  <MessageSquare className="w-5 h-5" /> Tư vấn qua Zalo
                </a>
                <a
                  href="tel:0899180086"
                  className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-black text-sm uppercase tracking-widest hover:bg-white/15 transition-all"
                >
                  <Phone className="w-5 h-5" /> 0899 180 086
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
