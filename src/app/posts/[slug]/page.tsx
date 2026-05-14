import { getPostData, getSortedPostsData } from '../../../lib/blog';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return (
    <article className="min-h-screen bg-[#0a0a0b] text-gray-200 selection:bg-blue-500/30">
      {/* Header / Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Quay lại trang chủ
          </Link>
        </div>
      </nav>

      {/* Hero Image */}
      {postData.image && (
        <div className="w-full h-[40vh] md:h-[60vh] relative mt-16">
          <img 
            src={postData.image} 
            alt={postData.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className={`max-w-3xl mx-auto px-6 pb-24 ${!postData.image ? 'pt-32' : 'pt-10'}`}>
        <header className="mb-12">
          <div className="text-blue-500 font-medium mb-4 text-sm tracking-wider uppercase">
            {new Date(postData.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.2]">
            {postData.title}
          </h1>
          <p className="text-xl text-gray-400 italic leading-relaxed">
            {postData.description}
          </p>
        </header>

        <div 
          className="prose prose-invert prose-blue max-w-none 
          prose-headings:text-white prose-headings:font-bold
          prose-p:text-gray-300 prose-p:leading-8 prose-p:text-lg
          prose-a:text-blue-400 hover:prose-a:text-blue-300
          prose-strong:text-white
          prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#111112] prose-pre:border prose-pre:border-white/5
          prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} 
        />
      </div>

      {/* Newsletter / CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Bạn thích bài viết này?</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Đừng bỏ lỡ các tin tức và hướng dẫn giao dịch mới nhất từ Midman247.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all active:scale-95">
            Theo dõi bản tin
          </button>
        </div>
      </section>
    </article>
  );
}
