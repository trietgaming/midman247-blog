import Link from 'next/link';
import { getSortedPostsData } from '../lib/blog';

export const revalidate = 60; // Revalidate every 60 seconds for near-instant updates

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="Midman247 Logo" className="w-8 h-8 transition-transform group-hover:scale-110" />
            <span className="font-bold text-lg tracking-tight">
              Midman247 <span className="text-blue-500">Blog</span>
            </span>
          </Link>
          <a 
            href="https://midman247.com" 
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            Về website chính
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Midman247 Blog
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Nơi chia sẻ kiến thức, hướng dẫn giao dịch an toàn và các bản cập nhật mới nhất từ hệ sinh thái Midman247.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPostsData.map(({ slug, date, title, description, image }) => (
            <Link 
              href={`/posts/${slug}`} 
              key={slug}
              className="group relative bg-[#111112] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
            >
              <div className="aspect-video bg-gray-800 overflow-hidden">
                {image ? (
                  <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                    {new Date(date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {allPostsData.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500">Chưa có bài viết nào được đăng tải.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Midman247. All rights reserved.</p>
      </footer>
    </main>
  );
}
