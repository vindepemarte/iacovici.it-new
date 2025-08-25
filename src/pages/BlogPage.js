import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Clock, 
  BookOpen, 
  Filter,
  X,
  ArrowRight,
  Loader
} from 'lucide-react';
import { getBlogPosts } from '../utils/api';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await getBlogPosts();
        // Transform the data to match the expected format
        const transformedPosts = posts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          author: post.author,
          publicationDate: post.publication_date,
          featuredImage: post.featured_image,
          tags: post.tags || [],
          readTime: Math.ceil((post.excerpt?.length || 0) / 200) || 5, // Estimate read time
          seoTitle: post.seo_title,
          seoDescription: post.seo_description
        }));
        setBlogPosts(transformedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Extract unique tags
  const allTags = ['All', ...new Set(blogPosts.flatMap(post => post.tags))];

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Featured post (most recent)
  const featuredPost = filteredPosts[0];

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Automation & AI Blog - Iacovici.it</title>
        </Helmet>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-accent-gold animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading blog posts...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Helmet>
          <title>Automation & AI Blog - Iacovici.it</title>
        </Helmet>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Unable to Load Blog Posts</h2>
            <p className="text-gray-400 mb-6">There was an error loading the blog posts. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Automation & AI Blog - Iacovici.it</title>
        <meta name="description" content="Tutorials, guides, and insights on n8n automation, AI integration, and modern business solutions. Learn from real-world implementations." />
        <meta name="keywords" content="n8n, automation, AI, business solutions, tutorials, guides" />
        <meta property="og:title" content="Automation & AI Blog - Iacovici.it" />
        <meta property="og:description" content="Tutorials, guides, and insights on n8n automation, AI integration, and modern business solutions. Learn from real-world implementations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iacovici.it/blog" />
        <meta property="og:image" content="/logos/ia-logo-web.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Automation & AI Blog - Iacovici.it" />
        <meta name="twitter:description" content="Tutorials, guides, and insights on n8n automation, AI integration, and modern business solutions. Learn from real-world implementations." />
        <meta name="twitter:image" content="/logos/ia-logo-web.png" />
        <link rel="canonical" href="https://iacovici.it/blog" />
      </Helmet>
      
      <div className="min-h-screen pt-16">
        {/* Header Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Automation & AI Blog</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Tutorials, guides, and insights on n8n automation, AI integration, 
                and modern business solutions. Learn from real-world implementations.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, tags, or topics..."
                  className="form-input w-full pl-12 pr-4 py-4 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Mobile Filter Button */}
            <div className="md:hidden mb-6">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filter by Tag
              </button>
            </div>

            {/* Filter Tags */}
            <div className={`md:flex justify-center flex-wrap gap-2 mb-8 ${isFilterOpen ? 'block' : 'hidden md:flex'}`}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-accent-gold text-primary-dark'
                      : 'bg-primary-gray text-gray-300 hover:bg-accent-gold/20 hover:text-accent-gold'
                  }`}
                >
                  {tag}
                  {selectedTag === tag && (
                    <X 
                      className="w-4 h-4 inline-block ml-2 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag('All');
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost ? (
          <section className="section-padding bg-gradient-to-b from-primary-dark to-black">
            <div className="max-w-7xl mx-auto container-padding">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold mb-2">Featured Article</h2>
                <p className="text-gray-400">Our latest and most popular content</p>
              </motion.div>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{new Date(featuredPost.publicationDate).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{featuredPost.readTime} min read</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-gray-300 mb-6">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.slice(0, 4).map(tag => (
                        <span 
                          key={tag}
                          className="bg-primary-dark px-3 py-1 rounded-full text-sm text-accent-gold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      to={`/blog/${featuredPost.slug}`} 
                      className="btn-primary inline-flex items-center"
                    >
                      Read Full Article
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                  
                  <div className="bg-primary-gray rounded-lg h-64 md:h-80 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-accent-gold" />
                  </div>
                </div>
              </motion.article>
            </div>
          </section>
        ) : null}

        {/* Articles Grid */}
        <section className="section-padding bg-black/30">
          <div className="max-w-7xl mx-auto container-padding">
            {blogPosts.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold mb-2">
                    {featuredPost ? 'More Articles' : 'Latest Articles'}
                  </h2>
                  <p className="text-gray-400">
                    Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(featuredPost ? filteredPosts.slice(1) : filteredPosts).map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card hover:scale-105 transition-transform duration-300"
                    >
                      <Link to={`/blog/${post.slug}`} className="block group">
                        {/* Article Image Placeholder */}
                        <div className="bg-primary-dark rounded-lg mb-4 h-48 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-accent-gold" />
                        </div>
                        
                        {/* Article Meta */}
                        <div className="flex items-center text-sm text-gray-400 mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="mr-4">{new Date(post.publicationDate).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{post.readTime} min read</span>
                        </div>

                        {/* Article Title */}
                        <h3 className="text-lg font-semibold mb-3 group-hover:text-accent-gold transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Article Excerpt */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag}
                              className="bg-primary-dark px-2 py-1 rounded text-xs text-gray-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center text-accent-gold text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
                    <p className="text-gray-400">Try adjusting your search terms or tag filter.</p>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">No Blog Posts Yet</h2>
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  We're working on creating amazing content about automation, AI, and business solutions. 
                  Check back soon for tutorials, guides, and insights!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/templates" className="btn-primary">
                    Browse Free Templates
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    Get Notified When We Publish
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-primary-gray to-primary-gray/50 rounded-3xl p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Stay Updated with Automation Insights
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Get the latest tutorials, free templates, and automation strategies 
                delivered to your inbox. Join 5,000+ business owners already automating smarter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/templates" className="btn-primary text-lg px-8 py-4">
                  Browse Free Templates
                </Link>
                <Link to="/contact" className="btn-secondary text-lg px-8 py-4">
                  Get Custom Automation
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;