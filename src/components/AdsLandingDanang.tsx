import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, ArrowRight, Zap, Target, TrendingUp, BarChart3, Shield, Clock, ChevronDown, Phone, MessageSquare, MapPin, Star } from 'lucide-react';

// ─── Icons ───────────────────────────────────────────────────────────────────
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.73-3.95-1.68-.1.93-.1 1.86-.1 2.79 0 1.93-.5 3.84-1.5 5.48-1.5 2.5-4.12 4.16-7 4.39-2.88.23-5.83-.8-7.79-2.95C.13 15.93-.41 12.83.65 10c.84-2.22 2.72-3.92 4.97-4.63.1-.03.2-.06.3-.08V9.4c-.67.2-1.32.55-1.8 1.08-.76.84-1.07 1.99-.95 3.1.1 1.05.6 2.05 1.45 2.68 1.18.88 2.82.99 4.08.31 1.05-.56 1.76-1.66 1.87-2.85.08-2.61.03-5.22.04-7.83 0-1.8-.02-3.6 0-5.4 0-.1.02-.2.03-.3z" />
  </svg>
);
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const ZaloIcon = () => (
  <svg viewBox="0 0 100 100" className="w-5 h-5">
    <circle cx="50" cy="50" r="50" fill="#0068FF"/>
    <text x="50" y="65" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold" fontFamily="Arial">Z</text>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const platforms = [
  {
    key: 'facebook', label: 'Facebook Ads', icon: <FacebookIcon />,
    color: '#1877F2', lightBg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', tag: 'bg-blue-100 text-blue-700',
    packages: [
      { name: 'BASIC', price: '6.000.000', budget: '4.000.000', fee: '2.000.000', features: ['Nghiên cứu đối tượng cơ bản', '1-2 nhóm quảng cáo / tháng', 'Tối ưu Traffic hoặc Engagement', 'Báo cáo cuối tháng', 'Tư vấn nội dung cơ bản'] },
      { name: 'PRO 1', price: '12.000.000', budget: '8.000.000', fee: '4.000.000', features: ['Phân tích & target đối tượng chi tiết', '3-5 nhóm quảng cáo / tháng', 'Tối ưu Lead / Conversion', 'A/B test creative', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '22.000.000', budget: '16.000.000', fee: '6.000.000', popular: true, features: ['Target nâng cao: Custom Audience, Lookalike', 'Không giới hạn nhóm quảng cáo', 'Remarketing bám đuổi nhiều tầng', 'Tối ưu ROAS - tư vấn landing page', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>30 TRIỆU', budget: '>20.000.000', fee: '12% - 15% NS', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược quảng cáo theo phễu (Funnel)', 'Tư vấn content & creative theo tuần', 'Tích hợp Pixel - sự kiện chuyển đổi nâng cao', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>50 TRIỆU', budget: '>40.000.000', fee: '10% NS', features: ['Toàn bộ tính năng VIP 1', 'Quản lý tài khoản quảng cáo BM riêng', 'Tư vấn chiến lược marketing tổng thể', 'Kết hợp Google Ads + Facebook Ads', 'Báo cáo phân tích chuyên sâu hàng tháng'] },
    ],
  },
  {
    key: 'tiktok', label: 'TikTok Ads', icon: <TiktokIcon />,
    color: '#010101', lightBg: 'bg-pink-50', border: 'border-pink-200', accent: 'text-pink-600', btn: 'bg-pink-600 hover:bg-pink-700', tag: 'bg-pink-100 text-pink-700',
    packages: [
      { name: 'BASIC', price: '7.000.000', budget: '5.000.000', fee: '2.000.000', features: ['In-Feed Ads cơ bản', 'Target theo độ tuổi, giới tính, khu vực', '1-2 video quảng cáo / tháng', 'Tối ưu View / Traffic', 'Báo cáo cuối tháng'] },
      { name: 'PRO 1', price: '13.000.000', budget: '9.000.000', fee: '4.000.000', features: ['In-Feed Ads + Spark Ads', 'Target Interest & Behavior chi tiết', '3-5 creative video / tháng', 'A/B test nội dung', 'Báo cáo chi tiết hàng tuần'] },
      { name: 'PRO 2', price: '23.000.000', budget: '17.000.000', fee: '6.000.000', popular: true, features: ['In-Feed + Spark Ads + TopView', 'Custom Audience & Lookalike nâng cao', 'Remarketing người đã xem video', 'Tư vấn brief content & script video', 'Báo cáo hàng tuần + đề xuất chiến lược'] },
      { name: 'VIP 1', price: '>35 TRIỆU', budget: '>25.000.000', fee: '12%-15% NS', features: ['Toàn bộ tính năng PRO 2', 'Chiến lược content TikTok theo phễu', 'Tư vấn kịch bản video hàng tuần', 'Tích hợp Pixel TikTok - event chuyển đổi', 'Dashboard báo cáo real-time'] },
      { name: 'VIP 2', price: '>55 TRIỆU', budget: '>45.000.000', fee: '10% NS', features: ['Toàn bộ tính năng VIP 1', 'Kết hợp TikTok + Facebook Ads', 'Quản lý tài khoản Business Center riêng', 'Chiến lược marketing tổng thể đa kênh', 'Báo cáo phân tích chuyên sâu hàng tháng'] },
    ],
  },
  {
    key: 'google', label: 'Google Ads', icon: <GoogleIcon />,
    color: '#EA4335', lightBg: 'bg-orange-50', border: 'border-orange-200', accent: 'text-orange-600', btn: 'bg-orange-500 hover:bg-orange-600', tag: 'bg-orange-100 text-orange-700',
    packages: [
      { name: 'BASIC', price: '6.000.000', budget: '4.000.000', fee: '2.000.000', features: ['20-30 từ khóa theo ngành', 'Quảng cáo Top Google khu vực mục tiêu', 'Theo dõi - tối ưu cơ bản chuyển đổi', 'Báo cáo cuối tháng (Click, CTR, Chi phí)'] },
      { name: 'PRO 1', price: '12.000.000', budget: '8.000.000', fee: '4.000.000', features: ['50-100 từ khóa theo ngành', 'Tối ưu chuyển đổi (form, gọi điện)', 'Remarketing khách đã truy cập', 'Tối ưu web cơ bản để tăng hiệu quả', 'Báo cáo chi tiết hàng tháng'] },
      { name: 'PRO 2', price: '22.000.000', budget: '16.000.000', fee: '6.000.000', popular: true, features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu website tăng tỷ lệ chuyển đổi', 'Tư vấn hệ thống marketing online'] },
      { name: 'VIP 1', price: '>30 TRIỆU', budget: '>30.000.000', fee: '12%-15% NS', features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu web + chạy video Youtube', 'Tư vấn tối ưu hệ thống marketing online'] },
      { name: 'VIP 2', price: '>50 TRIỆU', budget: '>50.000.000', fee: '10% NS', features: ['Không giới hạn từ khóa', 'Tối ưu chuyển đổi toàn diện', 'Remarketing bám đuổi khách hàng', 'Tối ưu web toàn diện', 'Tư vấn tối ưu hệ thống marketing online'] },
    ],
  },
  {
    key: 'zalo', label: 'Zalo Ads', icon: <ZaloIcon />,
    color: '#0068FF', lightBg: 'bg-sky-50', border: 'border-sky-200', accent: 'text-sky-600', btn: 'bg-sky-600 hover:bg-sky-700', tag: 'bg-sky-100 text-sky-700',
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
  { value: '500+', label: 'Khách hàng tin tưởng', icon: '🏆' },
  { value: '5+', label: 'Năm kinh nghiệm', icon: '📅' },
  { value: '3x', label: 'ROAS trung bình', icon: '📈' },
  { value: '98%', label: 'Tỷ lệ hài lòng', icon: '⭐' },
];

const usps = [
  { icon: <Target className="w-6 h-6" />, color: 'text-blue-600 bg-blue-50', title: 'Target chính xác tại Đà Nẵng', desc: 'Hiểu rõ thị trường địa phương, target đúng khách hàng Đà Nẵng và các tỉnh lân cận.' },
  { icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-600 bg-green-50', title: 'Tối ưu ROAS liên tục', desc: 'Theo dõi và tối ưu chiến dịch theo thời gian thực để tối đa hóa lợi nhuận.' },
  { icon: <BarChart3 className="w-6 h-6" />, color: 'text-orange-600 bg-orange-50', title: 'Báo cáo minh bạch', desc: 'Dashboard real-time, báo cáo chi tiết hàng tuần — không che giấu số liệu.' },
  { icon: <Shield className="w-6 h-6" />, color: 'text-purple-600 bg-purple-50', title: 'Cam kết hiệu quả', desc: 'Đội ngũ 5+ năm kinh nghiệm, cam kết hiệu quả hoặc hoàn tiền dịch vụ.' },
  { icon: <Zap className="w-6 h-6" />, color: 'text-yellow-600 bg-yellow-50', title: 'Triển khai trong 24h', desc: 'Lên chiến dịch nhanh chóng, không trì hoãn, không mất cơ hội thị trường.' },
  { icon: <Clock className="w-6 h-6" />, color: 'text-red-600 bg-red-50', title: 'Hỗ trợ 24/7', desc: 'Luôn sẵn sàng hỗ trợ và xử lý sự cố ngay cả ngoài giờ hành chính.' },
];

const process = [
  { step: '01', title: 'Tư vấn miễn phí', desc: 'Phân tích mục tiêu, đối tượng khách hàng và ngân sách phù hợp với doanh nghiệp tại Đà Nẵng.' },
  { step: '02', title: 'Xây dựng chiến lược', desc: 'Lên kế hoạch chiến dịch, chọn nền tảng tối ưu và thiết kế phễu chuyển đổi.' },
  { step: '03', title: 'Triển khai & Test', desc: 'Khởi chạy chiến dịch, A/B test creative để tìm ra công thức hiệu quả nhất.' },
  { step: '04', title: 'Tối ưu & Scale', desc: 'Theo dõi số liệu real-time, tối ưu ngân sách và nhân rộng những gì hiệu quả.' },
];

const reviews = [
  { name: 'Nguyễn Văn Minh', biz: 'Nhà hàng Hải Sản Đà Nẵng', text: 'LATIO giúp chúng tôi tăng 300% lượng đặt bàn chỉ sau 2 tháng chạy Facebook Ads. Rất chuyên nghiệp!', stars: 5 },
  { name: 'Trần Thị Lan', biz: 'Shop Thời Trang Online', text: 'Đội ngũ nhiệt tình, báo cáo rõ ràng. ROAS đạt 4x sau tháng đầu. Sẽ tiếp tục hợp tác lâu dài.', stars: 5 },
  { name: 'Lê Quang Hưng', biz: 'Công ty BĐS Đà Nẵng', text: 'Google Ads với LATIO giúp chúng tôi có khách hàng tiềm năng chất lượng, tỷ lệ chốt cao hơn hẳn.', stars: 5 },
];

const faqs = [
  { q: 'LATIO có kinh nghiệm chạy ads cho doanh nghiệp tại Đà Nẵng không?', a: 'Có. LATIO đã triển khai chiến dịch cho 100+ doanh nghiệp tại Đà Nẵng trong các ngành: nhà hàng, du lịch, bất động sản, thời trang, spa, giáo dục...' },
  { q: 'Ngân sách tối thiểu để chạy quảng cáo hiệu quả là bao nhiêu?', a: 'Ngân sách tối thiểu chúng tôi khuyến nghị là 3-5 triệu/tháng cho mỗi nền tảng. Bạn vẫn có thể bắt đầu với gói BASIC để thử nghiệm.' },
  { q: 'Mất bao lâu để thấy kết quả?', a: 'Thường 2-4 tuần đầu là giai đoạn học máy và tối ưu. Kết quả ổn định thường thấy rõ từ tháng thứ 2 trở đi.' },
  { q: 'LATIO có thể chạy đồng thời nhiều nền tảng không?', a: 'Có. Chúng tôi có đội ngũ chuyên biệt cho từng nền tảng và triển khai chiến dịch đa kênh tích hợp để tối đa hóa hiệu quả.' },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${open ? 'border-orange-300 shadow-sm' : 'border-gray-200'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors">
        <span className="text-gray-800 font-semibold text-sm leading-relaxed">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function AdsLandingDanang() {
  const [activePlatform, setActivePlatform] = useState(0);
  const current = platforms[activePlatform];

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Topbar ── */}
      <div className="bg-orange-500 text-white text-center py-2 text-xs font-semibold tracking-wide">
        📍 Dịch vụ chạy quảng cáo tại Đà Nẵng — Tư vấn miễn phí: <a href="tel:0899180086" className="underline font-bold">0899 180 086</a>
      </div>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-new.png" alt="LATIO" className="h-8 object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#dich-vu" className="hover:text-orange-500 transition-colors">Dịch vụ</a>
            <a href="#bang-gia" className="hover:text-orange-500 transition-colors">Bảng giá</a>
            <a href="#danh-gia" className="hover:text-orange-500 transition-colors">Đánh giá</a>
            <a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a>
          </div>
          <a href="https://zalo.me/0899180086" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm">
            <MessageSquare className="w-4 h-4" /> Tư vấn ngay
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20 md:py-28 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-6">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600 text-xs font-bold uppercase tracking-widest">Chuyên gia quảng cáo tại Đà Nẵng</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
            Tăng doanh số với<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Quảng cáo đa nền tảng</span><br />
            tại Đà Nẵng
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Facebook · TikTok · Google · Zalo — Tối ưu bởi AI và đội ngũ chuyên gia 5+ năm kinh nghiệm. Đồng hành cùng 500+ doanh nghiệp tại Đà Nẵng.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4 justify-center">
            <a href="#bang-gia" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5">
              Xem bảng giá <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://zalo.me/0899180086" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-orange-300 hover:text-orange-500 transition-all hover:-translate-y-0.5">
              <MessageSquare className="w-4 h-4" /> Tư vấn miễn phí
            </a>
          </motion.div>

          {/* Platform badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-3 justify-center mt-10">
            {[{ icon: <FacebookIcon />, name: 'Facebook Ads', color: 'text-blue-600' }, { icon: <TiktokIcon />, name: 'TikTok Ads', color: 'text-gray-900' }, { icon: <GoogleIcon />, name: 'Google Ads', color: 'text-red-500' }, { icon: <ZaloIcon />, name: 'Zalo Ads', color: 'text-blue-500' }].map((p, i) => (
              <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-semibold ${p.color}`}>
                {p.icon} {p.name}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-4xl font-black text-orange-500 mb-1">{s.value}</p>
              <p className="text-gray-500 text-sm font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── USPs ── */}
      <section id="dich-vu" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Tại sao chọn LATIO?</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Đối tác quảng cáo đáng tin cậy<br />tại Đà Nẵng</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Không chỉ chạy quảng cáo — chúng tôi xây dựng hệ thống tăng trưởng bền vững cho doanh nghiệp địa phương.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${u.color}`}>{u.icon}</div>
                <h3 className="text-gray-900 font-bold text-base mb-2">{u.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Quy trình</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Từ tư vấn đến kết quả</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Minh bạch, chuyên nghiệp, đúng cam kết.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative p-6 rounded-2xl bg-orange-50 border border-orange-100 hover:border-orange-300 transition-all">
                <span className="text-5xl font-black text-orange-200 select-none">{p.step}</span>
                <span className="block text-orange-500 text-xs font-bold uppercase tracking-widest mt-2 mb-1">Bước {p.step}</span>
                <h3 className="text-gray-900 font-bold text-base mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                {i < process.length - 1 && <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-300 z-10" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="bang-gia" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Bảng giá</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Giá dịch vụ minh bạch<br />không phát sinh ẩn</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Chọn nền tảng và gói dịch vụ phù hợp với quy mô doanh nghiệp tại Đà Nẵng.</p>
          </div>

          {/* Platform tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {platforms.map((p, i) => (
              <button key={p.key} onClick={() => setActivePlatform(i)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border transition-all ${activePlatform === i ? `${p.btn} text-white border-transparent shadow-md` : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div key={activePlatform} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {current.packages.map((pkg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6, transition: { duration: 0.2 } }} className={`relative flex flex-col rounded-2xl bg-white border-2 ${pkg.popular ? `${current.border} shadow-xl` : 'border-gray-100 shadow-sm'} p-5`}>
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`${current.tag} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap border border-current/20`}>Khuyên dùng</span>
                    </div>
                  )}
                  <div className="mb-4 text-center">
                    <span className={`text-xs font-black uppercase tracking-widest block mb-1 ${current.accent}`}>Gói {pkg.name}</span>
                    <p className="text-2xl font-black text-gray-900">{pkg.price}</p>
                    <p className="text-gray-400 text-[10px] font-semibold mt-0.5">VNĐ / THÁNG</p>
                    <div className="mt-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                      <p className="text-gray-500 text-[10px] font-semibold leading-relaxed">
                        Ngân sách: <span className="text-gray-800">{pkg.budget}đ</span><br />
                        Phí DV: <span className="text-gray-800">{pkg.fee}{!pkg.fee.includes('%') && ' VNĐ'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 mb-5">
                    {pkg.features.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${current.lightBg}`}>
                          <Check className={`w-2.5 h-2.5 ${current.accent}`} />
                        </div>
                        <span className="text-gray-600 text-[11px] leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href="https://zalo.me/0899180086" target="_blank" rel="noopener noreferrer" className={`w-full py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest text-white transition-all ${current.btn} text-center block hover:scale-[1.02] active:scale-95`}>
                    Tư vấn ngay
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">Ngân sách lớn hơn? <span className="text-gray-800 font-bold">Liên hệ để được báo giá riêng và ưu đãi đặc biệt.</span></p>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="danh-gia" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Khách hàng nói gì?</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Đánh giá từ doanh nghiệp Đà Nẵng</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
                <div>
                  <p className="text-gray-900 font-bold text-sm">{r.name}</p>
                  <p className="text-gray-500 text-xs">{r.biz}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Câu hỏi thường gặp</h2>
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
      <section className="py-24 px-4 bg-gradient-to-br from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Sẵn sàng bùng nổ doanh số?</h2>
            <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto">Nhận tư vấn miễn phí 30 phút — chúng tôi phân tích và đề xuất chiến lược phù hợp nhất cho doanh nghiệp tại Đà Nẵng.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://zalo.me/0899180086" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-orange-500 font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                <MessageSquare className="w-5 h-5" /> Tư vấn qua Zalo
              </a>
              <a href="tel:0899180086" className="flex items-center gap-2 px-10 py-5 rounded-2xl bg-white/20 border-2 border-white/40 text-white font-black text-sm uppercase tracking-widest hover:bg-white/30 transition-all">
                <Phone className="w-5 h-5" /> 0899 180 086
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 text-center text-sm">
        <img src="/logo-new.png" alt="LATIO" className="h-8 object-contain mx-auto mb-4 opacity-70" />
        <p className="mb-2">© 2026 LATIO Agency — Đơn vị truyền thông AI hàng đầu Việt Nam</p>
        <p className="flex items-center justify-center gap-1"><MapPin className="w-3.5 h-3.5" /> Đà Nẵng, Việt Nam</p>
      </footer>
    </div>
  );
}
