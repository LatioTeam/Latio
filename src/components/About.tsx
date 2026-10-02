import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Target, Award, Users, Globe, PlaySquare, TrendingUp, Briefcase } from 'lucide-react';
import { ShinyText } from './ShinyText';
import { Footer } from './Footer';
import { GalaxyBackground } from './GalaxyBackground';

export function About() {
  const steps = [
    { title: "Tư vấn & Phân tích", desc: "Lắng nghe nhu cầu, phân tích tình hình hiện tại của doanh nghiệp, đối thủ cạnh tranh và thị trường mục tiêu." },
    { title: "Lập kế hoạch", desc: "Xây dựng chiến lược marketing bài bản, tối ưu hóa phù hợp với mục tiêu kinh doanh và ngân sách của bạn." },
    { title: "Triển khai", desc: "Thực thi chiến dịch trên đa nền tảng với nội dung sáng tạo đột phá và chiến lược tiếp cận thông minh." },
    { title: "Theo dõi & Báo cáo", desc: "Giám sát hiệu suất theo thời gian thực, cung cấp báo cáo minh bạch, chi tiết về kết quả đạt được." },
    { title: "Tối ưu hóa", desc: "Liên tục phân tích dữ liệu và tinh chỉnh chiến dịch để đẩy mạnh hiệu suất và tối đa hóa chỉ số ROI." }
  ];

  const sectors = [
    { name: "Nhà hàng - F&B", num: "+10", id: "01" },
    { name: "Giáo dục", num: "+07", id: "02" },
    { name: "Xây dựng", num: "+06", id: "03" },
    { name: "Nội thất", num: "+04", id: "04" },
    { name: "Spa - Thẩm mỹ", num: "+06", id: "05" },
    { name: "Du học - Du lịch", num: "+05", id: "06" },
    { name: "Mẹ & Bé", num: "+05", id: "07" },
    { name: "Thời trang", num: "+03", id: "08" },
    { name: "Quảng cáo - sự kiện", num: "+02", id: "09" },
    { name: "Kinh doanh", num: "+03", id: "10" },
    { name: "Nha khoa", num: "+02", id: "11" },
    { name: "Kính mắt", num: "+02", id: "12" },
  ];

  const services = [
    { icon: Users, text: "Quản lý nền tảng mạng xã hội" },
    { icon: Globe, text: "Xây dựng thương hiệu doanh nghiệp" },
    { icon: PlaySquare, text: "Sản xuất nội dung số (TVC, Youtube, Reels, TikTok...)" },
    { icon: TrendingUp, text: "Lên kế hoạch chiến lược & triển khai thực thi hiệu quả" },
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col font-sans bg-transparent min-h-screen text-slate-300 relative overflow-hidden">
      <GalaxyBackground />

      {/* GLOBAL BACKGROUND EFFECTS (ANIMATED) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Floating Glowing Orbs */}
        <motion.div
          animate={{ y: [0, -80, 0], x: [0, 50, 0], scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen"
        />

        <motion.div
          animate={{ y: [0, 80, 0], x: [0, -50, 0], scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[150px] rounded-full mix-blend-screen"
        />

        <motion.div
          animate={{ x: [0, 100, 0], scale: [1, 1.1, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] bg-indigo-600/15 blur-[150px] rounded-full mix-blend-screen"
        />
      </div>

      {/* NAVBAR - Dynamic Scroll State */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled
        ? "bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl"
        : "bg-transparent border-transparent"
        }`}>
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-16 sm:gap-24 lg:gap-32 pt-28 sm:pt-32 pb-16 sm:pb-24">

        {/* HERO SECTION OF ABOUT PAGE */}
        <section className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Về Chúng Tôi</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                Giải Pháp<br />
                {/* Using ShinyText for the WOW factor */}
                <ShinyText text="Marketing" className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] py-1" /><br />
                Toàn Diện
              </h1>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12 max-w-lg">
                LATIO là đơn vị tiên phong trong lĩnh vực truyền thông và công nghệ số tại miền Trung - Việt Nam. Mang lại giá trị thiết thực và sự phát triển bền vững cho khách hàng.
              </p>
            </motion.div>

            {/* Stats Glass Cards - Animated */}
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-[30px] rounded-full group-hover:bg-blue-400/30 transition-colors duration-500 pointer-events-none"></div>
                <Target className="text-blue-400 mb-4 w-10 h-10 relative z-10" strokeWidth={1.5} />
                <h3 className="text-4xl font-black text-white mb-1 tracking-tighter relative z-10">20.000<span className="text-blue-500">+</span></h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold relative z-10">Dự án thành công</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-[30px] rounded-full group-hover:bg-cyan-400/30 transition-colors duration-500 pointer-events-none"></div>
                <Award className="text-cyan-400 mb-4 w-10 h-10 relative z-10" strokeWidth={1.5} />
                <h3 className="text-4xl font-black text-white mb-1 tracking-tighter relative z-10">10<span className="text-cyan-500">+</span></h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold relative z-10">Năm kinh nghiệm</p>
              </motion.div>
            </div>
          </div>

          {/* Floating Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative perspective-1000"
          >
            <motion.div
              whileHover={{ rotateY: 5, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-style-3d"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 10, ease: "linear" }}
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop"
                alt="Latio Team"
                className="w-full h-full object-cover opacity-90"
              />

              {/* Floating Widget */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 right-8 z-20 bg-black/50 backdrop-blur-2xl border border-white/20 p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    <TrendingUp className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg leading-tight">Đồng Hành Đáng Tin Cậy</h4>
                    <p className="text-xs text-slate-300 mt-1">Của hàng trăm doanh nghiệp đa lĩnh vực.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* SERVICES / INTRODUCTION GRID */}
        <section className="w-full pt-16 relative">
          {/* Subtle separator line with glowing center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          <div className="text-center mb-10 sm:mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Năng Lực Cốt Lõi</h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">Sở hữu đội ngũ chuyên viên sáng tạo, đa năng và giàu kinh nghiệm, chúng tôi tự tin mang đến những giải pháp đột phá nhất.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.05] transition-all duration-500 flex items-center gap-6 relative overflow-hidden shadow-lg"
              >
                {/* Spotlight effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 transition-all duration-500 shadow-inner">
                  <service.icon className="text-cyan-400 w-8 h-8 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">{service.text}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WORKING PROCESS - Horizontal Pipeline Layout */}
        <section className="w-full pt-24 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="text-center mb-12 sm:mb-20 relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 sm:mb-8 uppercase tracking-tighter leading-none">
              Quy Trình <ShinyText text="Làm Việc" className="text-4xl md:text-7xl font-black py-1" />
            </h2>
            <p className="text-slate-400 leading-relaxed text-base sm:text-xl max-w-3xl mx-auto font-medium">
              Lộ trình tối ưu tăng trưởng chuyên nghiệp, minh bạch và hiệu quả tuyệt đối.
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 relative">
            {/* Horizontal Connection Line (Desktop) */}
            <div className="absolute top-[32px] left-[10%] right-[10%] h-px bg-white/10 hidden md:block">
              <motion.div
                animate={{ left: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Diamond Node at Top */}
                  <div className="relative mb-8">
                    <motion.div
                      whileHover={{ rotate: 135, scale: 1.1 }}
                      className="w-16 h-16 bg-black border-2 border-blue-500 rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-cyan-400 transition-all duration-500"
                    >
                      <span className="font-black text-2xl text-white -rotate-45 group-hover:-rotate-[135deg] transition-all duration-500">{index + 1}</span>
                    </motion.div>
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse -z-10" />
                  </div>

                  {/* Card Content */}
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] group-hover:bg-white/[0.07] group-hover:border-blue-500/40 transition-all duration-500 flex-1 flex flex-col items-center">
                    <h4 className="text-lg md:text-xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTORS / CHUYÊN SÂU TỪNG LĨNH VỰC - High End Glassmorphism */}
        <section className="w-full pt-16 pb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          <div className="text-center mb-16 relative z-10 mt-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tight">
              Chuyên Sâu <ShinyText text="Từng Lĩnh Vực" className="text-3xl md:text-4xl lg:text-5xl font-black py-1" />
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              Mỗi ngành có hành vi khách hàng khác nhau. LATIO hiểu từng ngành từ bên trong, cam kết mang lại chiến lược sát sườn nhất.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
            {sectors.map((sector, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                key={index}
                className="relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 p-5 group cursor-pointer hover:border-cyan-400/50 transition-all duration-500 h-[160px] flex flex-col justify-between shadow-lg hover:shadow-[0_15px_30px_-10px_rgba(6,182,212,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-400/20 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex justify-between items-start w-full relative z-10">
                  <span className="text-white font-bold text-lg leading-tight w-2/3 group-hover:text-white transition-colors">{sector.name}</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-lg border border-cyan-400/20 font-mono font-bold tracking-widest group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300">
                    {sector.id}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 relative z-10 mt-auto">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 group-hover:from-cyan-300 group-hover:to-blue-500 font-black text-4xl md:text-5xl tracking-tighter transition-all duration-500 drop-shadow-sm">
                    {sector.num}
                  </span>
                  <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors duration-500">Thương<br />Hiệu</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PARTNERS SECTION - DYNAMIC & HIGH END */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="text-center mb-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-100 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000" />
                <button className="relative px-12 py-4 bg-black border border-blue-500/30 rounded-2xl font-black text-white uppercase tracking-[0.3em] text-sm shadow-[0_10px_40px_-10px_rgba(234,88,12,0.3)]">
                  Mạng Lưới Đối Tác
                </button>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-8 uppercase tracking-tight">Đồng hành cùng sự phát triển</h2>
            </motion.div>
          </div>

          {/* Dynamic Partner Grid */}
          <PartnerGrid />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 text-center"
          >
            <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent mb-10" />
            <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs">
              Kết nối với mạng lưới đối tác chiến lược hàng đầu
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Sub-component for dynamic partner listing
function PartnerGrid() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://latio-backend-production-050c.up.railway.app/api/partners')
      .then(res => res.json())
      .then(data => {
        setPartners(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (partners.length === 0) return (
    <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-3xl">
      Chưa có đối tác nào. Thêm đối tác từ Admin Dashboard.
    </div>
  );

  // Group partners by sector with aggressive normalization
  const groupedPartners = partners.reduce<Record<string, any[]>>((acc, partner) => {
    let sector = (partner.sector || 'Khác').trim();
    // Aggressive grouping logic to merge similar sectors with Unicode normalization
    const norm = sector.toLowerCase().normalize('NFC');

    if (norm.includes('đẹp') || norm.includes('spa') || norm.includes('thẩm mỹ') || norm.includes('làm đẹp') || norm.includes('skincare')) {
      sector = "SPA & Beauty";
    } else if (norm.includes('f&b') || norm.includes('nhà hàng') || norm.includes('ăn uống') || norm.includes('ẩm thực') || norm.includes('quán') || norm.includes('uống') || norm.includes('cafe')) {
      sector = "Nhà hàng - F&B";
    } else if (norm.includes('thời trang') || norm.includes('quần áo') || norm.includes('giày') || norm.includes('túi')) {
      sector = "Thời trang";
    } else if (norm.includes('mẹ & bé') || norm.includes('mẹ')) {
      sector = "Mẹ & Bé";
    } else if (norm.includes('sức khỏe') || norm.includes('nha khoa') || norm.includes('y tế') || norm.includes('bác sĩ') || norm.includes('bệnh viện')) {
      sector = "Sức khỏe";
    } else if (norm.includes('nội thất') || norm.includes('bàn ghế') || norm.includes('cửa') || norm.includes('decor')) {
      sector = "Nội thất";
    } else if (norm.includes('trường học') || norm.includes('nhà trẻ') || norm.includes('đại học') || norm.includes('giáo dục')) {
      sector = "Trường học";
    } else if (norm.includes('khác')) {
      sector = "Khác";
    }

    if (!acc[sector]) acc[sector] = [];
    acc[sector].push(partner);
    return acc;
  }, {});

  // Sort sectors based on user's preferred order
  const desiredOrder = [
    "Nhà hàng - F&B",
    "Nội thất",
    "SPA & Beauty",
    "Trường học",
    "Khác",
    "Sức khỏe",
    "Mẹ & Bé"
  ];

  const sortedSectors = Object.entries(groupedPartners).sort(([a], [b]) => {
    const indexA = desiredOrder.indexOf(a);
    const indexB = desiredOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-col gap-12 relative z-10">
      {sortedSectors.map(([sector, sectorPartners]: [string, any[]]) => {
        // Only use marquee if there are more than 3 logos
        const isMarquee = sectorPartners.length > 3;

        return (
          <div key={sector} className="flex flex-col gap-8">
            {/* Sector Header */}
            <div className="flex items-center gap-4 px-4 md:px-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                <Briefcase className="text-blue-500 w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.4em] mb-0.5">Classification</span>
                <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
                  {sector}
                </h3>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent ml-4 mt-3"></div>
            </div>

            {/* Partner Container */}
            <div className="relative w-full overflow-hidden py-4">
              {/* Gradient Overlays - only for marquee */}
              {isMarquee && (
                <>
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                </>
              )}

              <motion.div
                className={`flex gap-6 md:gap-10 ${isMarquee ? 'w-fit' : 'px-4 md:px-0'}`}
                style={isMarquee ? { willChange: "transform" } : {}}
                animate={isMarquee ? {
                  x: ["0%", "-50%"],
                } : {}}
                transition={isMarquee ? {
                  duration: Math.max(sectorPartners.length * 7, 30), // Slightly slower for better visual stability
                  repeat: Infinity,
                  ease: "linear",
                } : {}}
              >
                {/* Render items twice for marquee, once for static */}
                {(isMarquee ? [...sectorPartners, ...sectorPartners] : sectorPartners).map((partner, pIdx) => (
                  <motion.div
                    key={`${partner._id}-${pIdx}`}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="shrink-0 w-[140px] sm:w-[180px] md:w-[220px] aspect-square bg-white rounded-3xl p-6 md:p-10 flex items-center justify-center transition-all duration-500 shadow-[0_15px_35px_-10px_rgba(255,255,255,0.05)] hover:shadow-[0_30px_70px_-15px_rgba(255,255,255,0.15)] overflow-hidden cursor-pointer group relative"
                    style={{ transform: 'translateZ(0)' }} // Force GPU acceleration
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent pointer-events-none"></div>

                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      className="w-full h-full object-contain filter grayscale-[0.3] group-hover:grayscale-0 transition-opacity duration-500 scale-90 group-hover:scale-105"
                      style={{ transform: 'translateZ(0)' }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-10 h-1 bg-blue-500 rounded-full mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100"></div>
                      <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.2em] leading-tight">
                        {partner.name}
                      </span>
                      <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        Official Partner
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Global style to hide scrollbars for the horizontal rows
const scrollbarHideStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Inject style
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = scrollbarHideStyle;
  document.head.appendChild(style);
}



