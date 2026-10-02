import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ShinyText } from './ShinyText';

export function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-transparent">
      {/* Background Video */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
          type="video/mp4"
        />
      </video> */}

      {/* Fixed Navigation with Scroll State */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled
        ? "bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl"
        : "bg-transparent border-transparent"
        }`}>
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </header>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col pt-24 sm:pt-32 pb-12">

        {/* Top Section - hide second paragraph on mobile */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-4 lg:mt-12 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/80 text-xs sm:text-sm md:text-base max-w-md"
          >
            Chúng tôi cung cấp các giải pháp AI đột phá, trao quyền cho doanh nghiệp với công nghệ tiên tiến để bứt phá và vươn tầm toàn cầu.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block text-white/80 text-sm md:text-base lg:text-right"
          >
            1000+ Doanh Nghiệp Đã Triển Khai !
          </motion.p>
        </div>

        {/* Main Hero Center */}
        <div className="flex-1 flex flex-col justify-center items-center mt-12 lg:mt-0 text-center relative">
          {/* Subtle Glow behind text */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-cyan-400 text-[10px] sm:text-xs uppercase font-black tracking-[0.3em] sm:tracking-[0.5em] mb-4 sm:mb-6 relative"
          >
            <span className="relative z-10">Kỷ Nguyên Marketing AI Mới</span>
            <motion.span
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-sm bg-cyan-400/30 -z-10"
            />
          </motion.p>

          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-white font-normal tracking-tight leading-[0.85] text-4xl sm:text-6xl md:text-8xl lg:text-9xl m-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              LATIO AI
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShinyText
                text="Marketing Agency"
                className="tracking-tight leading-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mt-2 sm:mt-4 lg:mt-6 py-4 px-2"
              />
            </motion.div>
          </div>

          {/* <p className="text-white/60 text-lg md:text-xl max-w-2xl mt-12 font-medium leading-relaxed">
            Biến dữ liệu thành doanh thu. Ứng dụng AI đột phá vào chiến lược Marketing đa kênh để bứt phá mọi giới hạn tăng trưởng.
          </p> */}

          {/* CTA Button */}
          <div className="mt-8 sm:mt-12 lg:mt-16 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/contact" className="group relative inline-flex items-center justify-center gap-3 bg-white text-black rounded-full px-6 md:px-10 py-4 md:py-5 font-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Nhận Tư Vấn Ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group relative inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full px-6 md:px-10 py-4 md:py-5 font-black transition-all hover:bg-white/10">
              Xem Kết Quả Thực Tế
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
