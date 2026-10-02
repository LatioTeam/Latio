import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GalaxyBackground } from './GalaxyBackground';
import { Zap, Cpu, Video, ArrowRight, CheckCircle2, BarChart3, Users2 } from 'lucide-react';
import { ShinyText } from './ShinyText';

export function Solutions() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solutions = [
    {
      title: "Phòng Marketing Thuê Ngoài",
      subtitle: "Đội ngũ chuyên nghiệp, chi phí tối ưu",
      desc: "Không cần tuyển dụng, không cần đào tạo, không cần quản lý. LATIO cung cấp toàn bộ nhân sự marketing - từ strategist, content, designer đến media buyer - vận hành như phòng marketing nội bộ của bạn.",
      icon: Users2,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
      color: "from-blue-600 to-cyan-500",
      features: ["Tiết kiệm 70% chi phí nhân sự", "Vận hành chuyên nghiệp từ Day 1", "Cam kết KPI rõ ràng"]
    },
    {
      title: "AI & Automation",
      subtitle: "Giải pháp chuyển đổi số thông minh",
      desc: "Từ chăm sóc lead, gửi email, phân loại khách hàng đến báo cáo - tất cả được tự động hóa bằng AI. Bạn tập trung bán hàng, hệ thống lo phần còn lại. Tích hợp AI Chatbot & CRM.",
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
      color: "from-purple-600 to-indigo-500",
      features: ["Tự động hóa quy trình 24/7", "Tối ưu tỷ lệ chuyển đổi", "Phân tích dữ liệu thời gian thực"]
    },
    {
      title: "Quảng cáo Đa nền tảng",
      subtitle: "Tối ưu hóa ngân sách & Hiệu quả",
      desc: "Không chỉ chạy ads thủ công. Hệ thống AI của LATIO tối ưu creative, bid và audience liên tục - giúp chi phí trên mỗi khách hàng giảm dần theo thời gian mà vẫn đảm bảo độ phủ rộng.",
      icon: BarChart3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      color: "from-orange-600 to-red-500",
      features: ["Đa kênh: FB, Google, TikTok", "Tối ưu Bid bằng thuật toán AI", "Báo cáo minh bạch mỗi ngày"]
    },
    {
      title: "Video & Hình ảnh Chuyển đổi",
      subtitle: "Không chỉ đẹp, mà còn phải 'Ra đơn'",
      desc: "Content visual được thiết kế theo mục tiêu ads - đúng format, đúng hook, đúng CTA. Mỗi video đều được test kỹ lưỡng trước khi triển khai với ngân sách lớn.",
      icon: Video,
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop",
      color: "from-emerald-600 to-teal-500",
      features: ["Kịch bản chuẩn tâm lý mua hàng", "Sản xuất chất lượng 4K/Premium", "Tối ưu hóa cho Reels/TikTok"]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <GalaxyBackground />
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled
        ? "bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl"
        : "bg-transparent border-transparent"
        }`}>
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </header>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-xs font-black uppercase tracking-[0.2em]">Hệ sinh thái tăng trưởng</span>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter leading-none">
              4 <ShinyText text="Giải Pháp" /> LATIO<br />Đang Triển Khai
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              Chúng tôi không chỉ làm Marketing, chúng tôi xây dựng hệ thống tăng trưởng bền vững cho hơn 100+ doanh nghiệp Việt bằng sự kết hợp giữa Con người & Công nghệ.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 gap-16">
            {solutions.map((item, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                {/* Content Side */}
                <div className="w-full lg:w-1/2 flex flex-col items-start">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20`}>
                    <item.icon className="text-white w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-black mb-4 tracking-tight">{item.title}</h2>
                  <h3 className={`text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${item.color}`}>
                    {item.subtitle}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    {item.desc}
                  </p>

                  <div className="space-y-4 mb-10 w-full">
                    {item.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3 group">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="text-slate-200 font-bold tracking-wide group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/services"
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-xl shadow-white/5 active:scale-95"
                  >
                    Tư vấn giải pháp ngay
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>

                {/* Image/Visual Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000`} />
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-blue-600/20 via-black to-cyan-600/20 border border-white/10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">Sẵn sàng để bùng nổ doanh số?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Hãy để LATIO đồng hành cùng bạn xây dựng một tương lai số vững chắc. Liên hệ ngay để nhận bản phác thảo giải pháp miễn phí.
            </p>
            <Link
              to="/contact"
              className="inline-block px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-sm rounded-2xl transition-all duration-300 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] active:scale-95"
            >
              Bắt đầu hành trình ngay
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
