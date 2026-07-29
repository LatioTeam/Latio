import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Users, Image as ImageIcon, FileText, User, Calendar, X, MessageSquare, Phone, Mail, Eye } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://latio-backend-production-050c.up.railway.app/api');

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    imageUrl: string;
    author: string;
    date?: string;
}

interface Partner {
    _id: string;
    name: string;
    imageUrl: string;
    sector: string;
}

interface ContactRequest {
    _id: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    status: string;
    createdAt: string;
}

type TabType = 'blogs' | 'partners' | 'contacts';

export function Admin() {
    const [activeTab, setActiveTab] = useState<TabType>('blogs');
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [contacts, setContacts] = useState<ContactRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Editing state
    const [editingId, setEditingId] = useState<string | null>(null);

    // Blog Form states
    const [blogTitle, setBlogTitle] = useState('');
    const [blogExcerpt, setBlogExcerpt] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogCategory, setBlogCategory] = useState('AI MARKETING');
    const [blogImage, setBlogImage] = useState('');
    const [blogAuthor, setBlogAuthor] = useState('Latio Team');

    // Partner Form states
    const [partnerName, setPartnerName] = useState('');
    const [partnerImage, setPartnerImage] = useState('');
    const [partnerSector, setPartnerSector] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [blogsRes, partnersRes, contactsRes] = await Promise.all([
                fetch(`${API_BASE}/blogs`).catch(() => ({ json: () => [] })),
                fetch(`${API_BASE}/partners`).catch(() => ({ json: () => [] })),
                fetch(`${API_BASE}/contacts`).catch(() => ({ json: () => [] }))
            ]);

            const blogsData = await (blogsRes as any).json();
            const partnersData = await (partnersRes as any).json();
            const contactsData = await (contactsRes as any).json();

            setBlogs(Array.isArray(blogsData) ? blogsData : []);
            setPartners(Array.isArray(partnersData) ? partnersData : []);
            setContacts(Array.isArray(contactsData) ? contactsData : []);
        } catch (error) {
            showNotification('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const startEditBlog = (post: BlogPost) => {
        setEditingId(post._id);
        setBlogTitle(post.title);
        setBlogExcerpt(post.excerpt);
        setBlogContent(post.content);
        setBlogCategory(post.category);
        setBlogImage(post.imageUrl);
        setBlogAuthor(post.author);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetBlogForm = () => {
        setEditingId(null);
        setBlogTitle('');
        setBlogExcerpt('');
        setBlogContent('');
        setBlogImage('');
        setBlogAuthor('Latio Team');
    };

    const resetPartnerForm = () => {
        setEditingId(null);
        setPartnerName('');
        setPartnerImage('');
        setPartnerSector('');
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE}/blogs/${editingId}` : `${API_BASE}/blogs`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: blogTitle,
                    excerpt: blogExcerpt,
                    content: blogContent,
                    category: blogCategory,
                    imageUrl: blogImage,
                    author: blogAuthor
                })
            });
            if (res.ok) {
                showNotification(editingId ? 'Cập nhật thành công' : 'Thêm bài viết thành công', 'success');
                resetBlogForm();
                fetchData();
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Lỗi từ server');
            }
        } catch (error) {
            console.error("Lỗi chi tiết:", error);
            showNotification(`Lỗi khi lưu bài viết: ${error instanceof Error ? error.message : 'Lỗi kết nối'}`, 'error');
        }
    };

    const startEditPartner = (p: Partner) => {
        setEditingId(p._id);
        setPartnerName(p.name);
        setPartnerImage(p.imageUrl);
        setPartnerSector(p.sector);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePartnerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE}/partners/${editingId}` : `${API_BASE}/partners`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: partnerName, imageUrl: partnerImage, sector: partnerSector })
            });
            if (res.ok) {
                showNotification(editingId ? 'Cập nhật đối tác thành công' : 'Thêm đối tác thành công', 'success');
                resetPartnerForm();
                fetchData();
            }
        } catch (error) {
            showNotification('Lỗi khi lưu đối tác', 'error');
        }
    };

    const deleteItem = async (type: TabType, id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa không?')) return;
        try {
            const res = await fetch(`${API_BASE}/${type}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showNotification('Đã xóa thành công', 'success');
                fetchData();
            }
        } catch (error) {
            showNotification('Lỗi khi xóa', 'error');
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/contacts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'read' })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            showNotification('Lỗi khi cập nhật trạng thái', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent"
                        >
                            Admin Dashboard Latio AI
                        </motion.h1>
                        <p className="text-gray-400 mt-2">Quản lý bài viết Blog, đối tác và liên hệ</p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10 overflow-x-auto">
                        <button
                            onClick={() => { setActiveTab('blogs'); resetBlogForm(); }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'blogs' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <FileText size={18} />
                            <span>Blogs</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('partners'); resetPartnerForm(); }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'partners' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Users size={18} />
                            <span>Đối tác</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('contacts'); resetBlogForm(); }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'contacts' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <MessageSquare size={18} />
                            <span>Liên hệ</span>
                            {contacts.filter(c => c.status === 'new').length > 0 && (
                                <span className="w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full ml-1 animate-pulse">
                                    {contacts.filter(c => c.status === 'new').length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl h-fit sticky top-24"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                {activeTab === 'contacts' ? (
                                    <>
                                        <MessageSquare size={20} className="text-cyan-400" />
                                        Thống kê liên hệ
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} className={activeTab === 'blogs' ? 'text-blue-400' : 'text-orange-400'} />
                                        {activeTab === 'blogs'
                                            ? (editingId ? 'Sửa Bài Viết' : 'Viết Bài Mới')
                                            : (editingId ? 'Sửa Đối Tác' : 'Thêm Đối Tác')}
                                    </>
                                )}
                            </h2>
                            {editingId && (
                                <button onClick={resetBlogForm} className="text-gray-500 hover:text-white transition-colors p-1">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {activeTab === 'blogs' && (
                            <form onSubmit={handleBlogSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tiêu đề bài viết</label>
                                    <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ví dụ: ROI Cam Kết 1:5..." required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Danh mục</label>
                                    <select value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
                                        <option value="AI MARKETING" className="bg-gray-900">AI MARKETING</option>
                                        <option value="Dịch vụ chạy quảng cáo" className="bg-gray-900">Dịch vụ chạy quảng cáo</option>
                                        <option value="Kiến thức Marketing" className="bg-gray-900">Kiến thức Marketing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Link ảnh banner</label>
                                    <input type="text" value={blogImage} onChange={(e) => setBlogImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://images.unsplash.com/..." required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Mô tả ngắn (Excerpt)</label>
                                    <textarea value={blogExcerpt} onChange={(e) => setBlogExcerpt(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors h-20" placeholder="Tóm tắt bài viết..." required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Nội dung chi tiết (Có thể Paste bảng, ảnh vào đây)</label>
                                    <div
                                        contentEditable
                                        onBlur={(e) => setBlogContent(e.currentTarget.innerHTML)}
                                        dangerouslySetInnerHTML={{ __html: blogContent }}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors min-h-[300px] max-h-[600px] overflow-y-auto prose prose-invert prose-sm"
                                        onPaste={() => {
                                            // Optional: Handle clean paste if needed, but for tables we want to keep HTML
                                        }}
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">* Bạn có thể copy bảng từ Word/Excel và dán trực tiếp vào đây.</p>
                                </div>
                                <button type="submit" className={`w-full ${editingId ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'} py-3 rounded-lg font-medium transition-all transform active:scale-95`}>
                                    {editingId ? 'Cập Nhật Bài Viết' : 'Xuất Bản Bài Viết'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={resetBlogForm} className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-lg font-medium transition-all">Hủy Chỉnh Sửa</button>
                                )}
                            </form>
                        )}

                        {activeTab === 'partners' && (
                            <form onSubmit={handlePartnerSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tên đối tác</label>
                                    <input type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="Ví dụ: Hasaki" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Lĩnh vực đối tác</label>
                                    <input type="text" value={partnerSector} onChange={(e) => setPartnerSector(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="Ví dụ: Làm đẹp" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Link Logo (Ảnh)</label>
                                    <input type="text" value={partnerImage} onChange={(e) => setPartnerImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="https://..." required />
                                </div>
                                <button type="submit" className={`w-full ${editingId ? 'bg-green-600 hover:bg-green-500' : 'bg-orange-600 hover:bg-orange-500'} py-3 rounded-lg font-medium transition-all transform active:scale-95`}>
                                    {editingId ? 'Cập Nhật Đối Tác' : 'Lưu Đối Tác'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={resetPartnerForm} className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-lg font-medium transition-all">Hủy Chỉnh Sửa</button>
                                )}
                            </form>
                        )}

                        {activeTab === 'contacts' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1 font-bold">Tổng số yêu cầu</p>
                                    <p className="text-3xl font-black text-cyan-400">{contacts.length}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1 font-bold">Yêu cầu mới</p>
                                    <p className="text-3xl font-black text-red-500">{contacts.filter(c => c.status === 'new').length}</p>
                                </div>
                                <p className="text-xs text-gray-500 italic">* Các yêu cầu liên hệ được gửi từ trang Liên hệ trên website sẽ hiển thị tại đây.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                                    {activeTab === 'contacts' ? (
                                        contacts.length === 0 ? (
                                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                <p className="text-gray-500">Chưa có yêu cầu liên hệ nào.</p>
                                            </div>
                                        ) : (
                                            contacts.map((contact) => (
                                                <motion.div
                                                    key={contact._id}
                                                    layout
                                                    className={`bg-white/5 p-6 rounded-2xl border transition-all ${contact.status === 'new' ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/10 opacity-70 hover:opacity-100'}`}
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${contact.status === 'new' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-gray-500'}`}>
                                                                <User size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-bold text-lg">{contact.name}</h3>
                                                                    {contact.status === 'new' && (
                                                                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">MỚI</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                                                                    <span className="flex items-center gap-1"><Phone size={12} /> {contact.phone}</span>
                                                                    <span className="flex items-center gap-1"><Mail size={12} /> {contact.email}</span>
                                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(contact.createdAt).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 h-fit">
                                                            {contact.status === 'new' && (
                                                                <button
                                                                    onClick={() => markAsRead(contact._id)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-900/20"
                                                                >
                                                                    <Eye size={14} />
                                                                    Đã đọc
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteItem('contacts', contact._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )
                                    ) : (
                                        (activeTab === 'blogs' ? blogs : partners).length === 0 ? (
                                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                <p className="text-gray-500">Chưa có bài viết hoặc đối tác nào.</p>
                                            </div>
                                        ) : (
                                            (activeTab === 'blogs' ? blogs : partners).map((item: any) => (
                                                <motion.div key={item._id} layout className={`group bg-white/5 p-4 rounded-2xl border transition-all flex items-center gap-4 ${editingId === item._id ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-white/20'}`}>
                                                    <div className="w-20 h-20 rounded-xl bg-black border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.title || item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="text-gray-600" size={24} />
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                            {item.title || item.name}
                                                            {activeTab === 'blogs' && (
                                                                <span className="text-[10px] uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded text-blue-400 border border-blue-500/20">
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                            {activeTab === 'partners' && (
                                                                <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded text-orange-400 border border-orange-500/20">
                                                                    {item.sector}
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-gray-400 text-xs mt-1 line-clamp-1">{item.excerpt || item.sector || 'Không có mô tả'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => activeTab === 'blogs' ? startEditBlog(item) : startEditPartner(item)}
                                                            className={`p-2 rounded-lg transition-colors ${editingId === item._id ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => deleteItem(activeTab, item._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }} className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border ${notification.type === 'success' ? 'bg-green-500/20 border-green-500/20 text-green-400' : 'bg-red-500/20 border-red-500/20 text-red-400'}`}>
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span className="font-medium text-sm">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
