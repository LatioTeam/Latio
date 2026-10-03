import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GalaxyBackground } from './GalaxyBackground';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ShinyText } from './ShinyText';

export function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://latio-backend-production-050c.up.railway.app/api');
      const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormState('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setFormState('idle'), 5000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormState('idle');
      alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau hoặc gọi hotline.');
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      details: ["0899 180086", "0868 651 224"],
      color: "blue"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["latiodigital@gmail.com"],
      color: "cyan"
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: ["86 Đoàn Văn Cừ, Hòa Khánh Bắc,", "Liên Chiểu, Đà Nẵng"],
      color: "indigo"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      details: ["Thứ 2 - Thứ 7", "08:00 - 17:30"],
      color: "purple"
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans bg-transparent min-h-screen text-slate-300 relative overflow-hidden">
      <GalaxyBackground />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full"
        />
      </div>

      {/* Navbar */}
      <div className="w-full bg-black py-6 px-4 sm:px-6 lg:px-8 border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-24 py-20">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Liên hệ với chúng tôi</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
              Bắt Đầu <ShinyText text="Hành Trình" className="py-1" /> Của Bạn
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
              Hãy để Latio Agency đồng hành cùng doanh nghiệp của bạn kiến tạo những giá trị số đột phá và bền vững.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-colors duration-700" />

              <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                Gửi Lời Nhắn
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                    <input
                      required
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 outline-none px-6 py-4 rounded-2xl text-white transition-all duration-300 placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0899 xxx xxx"
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 outline-none px-6 py-4 rounded-2xl text-white transition-all duration-300 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 outline-none px-6 py-4 rounded-2xl text-white transition-all duration-300 placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Nội dung tư vấn</label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Bạn đang quan tâm đến dịch vụ nào của Latio?"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 outline-none px-6 py-4 rounded-2xl text-white transition-all duration-300 placeholder:text-slate-600 resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formState !== 'idle'}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 shadow-lg ${formState === 'success'
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)]'
                    }`}
                >
                  {formState === 'idle' && (
                    <>
                      Gửi Yêu Cầu
                      <Send className="w-5 h-5" />
                    </>
                  )}
                  {formState === 'submitting' && (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {formState === 'success' && (
                    <>
                      Gửi Thành Công
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Details Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:border-blue-500/30 transition-all duration-500"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <info.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2 tracking-tight uppercase text-xs opacity-60 tracking-[0.2em]">{info.title}</h3>
                  {info.details.map((detail, dIdx) => (
                    <p key={dIdx} className="text-white font-medium text-sm leading-relaxed">{detail}</p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Map Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3 rounded-[2.5rem] overflow-hidden group shadow-2xl"
            >
              <div className="relative rounded-[2rem] overflow-hidden h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.4145008794335!2d108.1677706!3d16.043966300000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219a785f38dcd:0xf42afe9e00149ca9!2sLATIO%20AGENCY!5e0!3m2!1sen!2s!4v1778033077263!5m2!1sen!2s"
                  className="w-full h-full border-0 grayscale invert opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700"
                  allowFullScreen
                  loading="lazy"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <a
                    href="https://maps.app.goo.gl/9u2kZJ6r7U8E9N9U9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl group/btn overflow-hidden"
                  >
                    <span className="text-white font-bold text-sm tracking-tight">Mở bản đồ trực tiếp</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Social Connection */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] whitespace-nowrap">Kết nối mạng xã hội</p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="flex justify-center gap-4">
              {['Facebook', 'TikTok', 'Instagram', 'Zalo'].map((platform, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-widest hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 shadow-inner"
                >
                  {platform}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Preview or CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-white/10 p-10 md:p-16 rounded-[3rem] text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Bạn Đã Sẵn Sàng Bứt Phá?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để tìm ra giải pháp tối ưu nhất cho doanh nghiệp.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="tel:0899180086" className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-xl">
                <Phone className="w-5 h-5" />
                Gọi Ngay
              </a>
              <a href="https://zalo.me/0899180086" target="_blank" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-xl shadow-blue-500/20">
                <MessageSquare className="w-5 h-5" />
                Chat Zalo
              </a>
            </div>
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
