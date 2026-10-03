import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GalaxyBackground } from './GalaxyBackground';
import { Search, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

const CATEGORIES = ["Tất cả", "AI MARKETING", "Dịch vụ chạy quảng cáo", "Kiến thức Marketing"];

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://latio-backend-production-050c.up.railway.app/api');
      const res = await fetch(`${API_BASE}/blogs`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-transparent text-white font-sans selection:bg-orange-500/30">
      <GalaxyBackground />
      <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/5 px-6 py-4">
        <Navbar />
      </header>

      <main className="bg-transparent">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-16 overflow-hidden bg-transparent">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Knowledge Base</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
                Latio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Blog</span>
              </h1>

              <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
                Chia sẻ kiến thức Marketing thực chiến, xu hướng AI 2024 và những giải pháp tăng trưởng đột phá cho doanh nghiệp.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto relative group"
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-white placeholder:text-slate-600 backdrop-blur-xl shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-6 py-3 border-y border-white/5 bg-black/80 backdrop-blur-md sticky top-[72px] z-40">
          <div className="max-w-7xl mx-auto flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-3 md:gap-6 px-4 pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải kiến thức...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              <AnimatePresence mode='popLayout'>
                {filteredPosts.map((post, idx) => (
                  <motion.article
                    key={post._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group flex flex-col h-full bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)]"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          {post.author}
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-white mb-4 leading-tight group-hover:text-blue-500 transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 flex-1 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <Link to={`/blog/${post._id}`} className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs group/btn">
                        Đọc bài viết
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:border-transparent transition-all duration-300 group-hover/btn:translate-x-2">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 text-xl font-medium">Không tìm thấy bài viết nào phù hợp.</p>
              <button
                onClick={() => { setSelectedCategory("Tất cả"); setSearchQuery(""); }}
                className="mt-6 text-blue-500 font-bold uppercase tracking-widest hover:underline"
              >
                Xem tất cả bài viết
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-[0_30px_60px_-12px_rgba(59,130,246,0.3)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                  Đăng ký nhận <br /> <span className="text-black/30 text-4xl md:text-6xl">Kiến thức mới nhất</span>
                </h2>
                <p className="text-white/80 font-medium">
                  Chúng tôi gửi bản tin 2 lần mỗi tuần về các xu hướng Marketing và AI mới nhất. Không spam, hứa danh dự!
                </p>
              </div>

              <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all backdrop-blur-md"
                />
                <button className="px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-zinc-900 transition-all shadow-xl hover:-translate-y-1">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
