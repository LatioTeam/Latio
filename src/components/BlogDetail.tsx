import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Calendar, ArrowLeft, Globe, Share, Link as LinkIcon, Loader2 } from 'lucide-react';

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

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://latio-backend-production-050c.up.railway.app/api');
      const res = await fetch(`${API_BASE}/blogs/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-black mb-6 uppercase tracking-tighter">Không tìm thấy bài viết</h1>
        <Link to="/blog" className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest hover:underline">
          <ArrowLeft size={20} /> Quay lại Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-4">
        <Navbar />
      </div>

      <main className="pt-32 pb-24">
        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]"
        />

        <article className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb & Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link to="/blog" className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-transparent transition-all">
                <ArrowLeft size={14} className="text-white" />
              </div>
              Quay lại danh sách
            </Link>
          </motion.div>

          {/* Header */}
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter uppercase">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">
                    {post.author.charAt(0)}
                  </div>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  <span>{new Date(post.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </motion.div>
          </header>

          {/* Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-16 border border-white/10"
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert prose-blue max-w-none blog-content"
          >
            <div style={{ overflowX: 'auto' }}>
              <div
                className="text-slate-300 text-base md:text-xl leading-[1.8] font-medium break-words"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </motion.div>

          <style>{`
            .blog-content {
              line-height: 1.7 !important;
              color: #cbd5e1 !important;
            }
            /* Universal Reset for Pasted Styles */
            .blog-content *:not(table):not(thead):not(tbody):not(tr):not(th):not(td) {
              background-color: transparent !important;
              color: inherit !important;
            }
            /* Specific Table Reset for Readability */
            .blog-content table, .blog-content tr, .blog-content td, .blog-content th {
              background-color: transparent !important;
              color: white !important;
            }
            .blog-content p {
              margin-bottom: 1.2rem !important;
              margin-top: 0 !important;
              background-color: transparent !important;
            }
            /* Hide empty paragraphs often caused by pasting */
            .blog-content p:empty, .blog-content p:has(br:only-child) {
              display: none !important;
            }
            .blog-content table {
              width: 100% !important;
              border-collapse: separate !important;
              border-spacing: 0 !important;
              margin: 3rem 0 !important;
              border: 1px solid rgba(255, 255, 255, 0.05) !important;
              border-radius: 1rem !important;
              overflow: hidden !important;
              background: rgba(255, 255, 255, 0.02) !important;
              backdrop-filter: blur(10px) !important;
            }
            .blog-content th, .blog-content td {
              border: 0.5px solid rgba(255, 255, 255, 0.05) !important;
              padding: 1rem 1.5rem !important;
              text-align: left !important;
              font-size: 0.95rem !important;
            }
            .blog-content th {
              background: rgba(59, 130, 246, 0.05) !important;
              color: #60a5fa !important;
              font-weight: 800 !important;
              text-transform: uppercase !important;
              font-size: 0.7rem !important;
              letter-spacing: 0.15em !important;
              border-bottom: 1px solid rgba(59, 130, 246, 0.2) !important;
            }
            .blog-content tr:hover {
              background: rgba(255, 255, 255, 0.03) !important;
            }
            .blog-content h1, .blog-content h2, .blog-content h3 {
              color: white !important;
              font-weight: 900 !important;
              margin-top: 4rem !important;
              margin-bottom: 1.5rem !important;
              text-transform: uppercase !important;
              letter-spacing: -0.03em !important;
              line-height: 1.2 !important;
            }
            .blog-content h2 { font-size: 1.8rem !important; }
            .blog-content h3 { font-size: 1.4rem !important; }
            
            .blog-content ul, .blog-content ol {
              padding-left: 1.2rem !important;
              margin: 2rem 0 !important;
              list-style-type: none !important;
            }
            .blog-content li {
              margin-bottom: 0.8rem !important;
              position: relative !important;
            }
            .blog-content ul li::before {
              content: "•";
              color: #3b82f6;
              font-weight: bold;
              position: absolute;
              left: -1.2rem;
            }
            .blog-content strong {
              color: white !important;
              font-weight: 800 !important;
            }
            .blog-content blockquote {
              border-left: 4px solid #3b82f6 !important;
              padding: 1.5rem 2rem !important;
              margin: 2.5rem 0 !important;
              background: rgba(59, 130, 246, 0.03) !important;
              font-style: italic !important;
              border-radius: 0 1rem 1rem 0 !important;
            }
          `}</style>

          {/* Footer Actions */}
          <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Chia sẻ bài viết:</span>
              <div className="flex items-center gap-2">
                {[Globe, Share, LinkIcon].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-transparent transition-all">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            <Link to="/blog" className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all shadow-xl">
              Đọc thêm bài khác
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
