import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, 
  ArrowRight,
  Calendar, 
  Clock, 
  Share2, 
  BookOpen, 
  CheckCircle,
  ExternalLink,
  Download,
  Loader
} from 'lucide-react';
import { getBlogPostBySlug, getBlogPosts } from '../utils/api';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific blog post
        const fetchedPost = await getBlogPostBySlug(slug);
        
        // Transform the data to match the expected format
        const transformedPost = {
          id: fetchedPost.id,
          title: fetchedPost.title,
          slug: fetchedPost.slug,
          content: fetchedPost.content_markdown,
          excerpt: fetchedPost.excerpt,
          author: fetchedPost.author,
          publicationDate: fetchedPost.publication_date,
          featuredImage: fetchedPost.featured_image,
          tags: fetchedPost.tags || [],
          readTime: Math.ceil((fetchedPost.content_markdown?.length || 0) / 1000) || 5, // Estimate read time
          seoTitle: fetchedPost.seo_title,
          seoDescription: fetchedPost.seo_description
        };
        
        setPost(transformedPost);
        
        // Fetch all posts to find related ones
        const allPosts = await getBlogPosts();
        const related = allPosts
          .filter(p => p.id !== fetchedPost.id && 
                      p.tags && transformedPost.tags.some(tag => p.tags.includes(tag)))
          .slice(0, 3)
          .map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            tags: p.tags || []
          }));
        
        setRelatedPosts(related);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy link to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Article - Iacovici.it</title>
        </Helmet>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-accent-gold animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading article...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Helmet>
          <title>Article Not Found - Iacovici.it</title>
        </Helmet>
        <div className="min-h-screen pt-16">
          <div className="max-w-4xl mx-auto container-padding text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">
              {error ? 'Error Loading Article' : 'Article Not Found'}
            </h1>
            <p className="text-gray-400 mb-8">
              {error 
                ? 'There was an error loading the article. Please try again later.' 
                : "The article you're looking for doesn't exist or has been moved."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog" className="btn-primary">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Blog
              </Link>
              {error && (
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-secondary"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title}</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://iacovici.it/blog/${post.slug}`} />
        <meta property="og:image" content={post.featuredImage || "/logos/ia-logo-web.png"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seoTitle || post.title} />
        <meta name="twitter:description" content={post.seoDescription || post.excerpt} />
        <meta name="twitter:image" content={post.featuredImage || "/logos/ia-logo-web.png"} />
        <link rel="canonical" href={`https://iacovici.it/blog/${post.slug}`} />
      </Helmet>
      
      <div className="min-h-screen pt-16">
        {/* Article Header */}
        <section className="section-padding bg-gradient-to-b from-primary-dark to-black">
          <div className="max-w-4xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/blog" className="inline-flex items-center text-accent-gold hover:text-accent-gold/80 mb-6">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Blog
              </Link>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="mr-6">{new Date(post.publicationDate).toLocaleDateString()}</span>
                <Clock className="w-4 h-4 mr-1" />
                <span className="mr-6">{post.readTime} min read</span>
                <span>By {post.author}</span>
              </div>

              {/* Article Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-primary-gray px-3 py-1 rounded-full text-sm text-accent-gold border border-accent-gold/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Share Button */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-8 mb-8">
                <p className="text-gray-300 text-lg">{post.excerpt}</p>
                <button 
                  onClick={handleShare}
                  className="btn-secondary ml-4 flex-shrink-0"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-16">
          <div className="max-w-4xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              <div className="article-content text-gray-300 leading-relaxed">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({children}) => (
                      <h1 className="text-3xl font-bold text-primary-light mb-6 mt-12 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-2xl font-bold text-primary-light mb-4 mt-10">
                        {children}
                      </h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-xl font-bold text-primary-light mb-3 mt-8">
                        {children}
                      </h3>
                    ),
                    p: ({children}) => (
                      <p className="mb-6 text-gray-300 leading-relaxed">
                        {children}
                      </p>
                    ),
                    code: ({children, className}) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <pre className="bg-primary-gray p-4 rounded-lg overflow-x-auto mb-6">
                          <code className={className}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-primary-gray px-2 py-1 rounded text-sm">{children}</code>
                      );
                    },
                    ul: ({children}) => (
                      <ul className="mb-6 space-y-2">{children}</ul>
                    ),
                    ol: ({children}) => (
                      <ol className="mb-6 space-y-2 list-decimal list-inside">{children}</ol>
                    ),
                    li: ({children}) => (
                      <li className="text-gray-300 pl-2">{children}</li>
                    ),
                    a: ({children, href}) => (
                      <a 
                        href={href} 
                        className="text-accent-gold hover:text-accent-gold/80 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-accent-gold pl-4 py-2 my-6 text-gray-400">
                        {children}
                      </blockquote>
                    ),
                    img: ({src, alt}) => (
                      <img 
                        src={src} 
                        alt={alt} 
                        className="rounded-lg my-6 w-full h-auto"
                        loading="lazy"
                      />
                    )
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black/30">
          <div className="max-w-4xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-primary-gray to-primary-gray/50 rounded-3xl p-8 md:p-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-accent-gold mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Implement This Solution?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Get the complete workflow template and start automating today. 
                Need customization? Our experts can build it for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/templates" className="btn-primary text-lg px-8 py-4">
                  <Download className="w-5 h-5 mr-2" />
                  Get Free Template
                </Link>
                <Link to="/contact" className="btn-secondary text-lg px-8 py-4">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Request Custom Build
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="section-padding bg-black/30">
            <div className="max-w-7xl mx-auto container-padding">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold mb-2">Related Articles</h2>
                <p className="text-gray-400">You might also find these interesting</p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card hover:scale-105 transition-transform duration-300"
                  >
                    <Link to={`/blog/${relatedPost.slug}`} className="block group">
                      <div className="bg-primary-dark rounded-lg mb-4 h-32 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-accent-gold" />
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-accent-gold transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-accent-gold text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogPost;