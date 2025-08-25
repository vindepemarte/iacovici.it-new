import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Workflow, 
  Smartphone,
  Database,
  Shield,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Download,
  User,
  Award,
  Clock
} from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: 'Alexandru Iacovici',
      role: 'Founder & Lead Developer',
      bio: 'Full-stack developer with 8+ years of experience in automation and web technologies. Specializes in n8n workflows, React applications, and AI integrations.',
      image: '/images/team/alex.jpg'
    }
  ];

  const values = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Innovation',
      description: 'We stay at the forefront of technology to deliver cutting-edge solutions that give you a competitive advantage.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Reliability',
      description: 'Our solutions are built to last with robust architecture, thorough testing, and proactive monitoring.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Results',
      description: 'We focus on measurable outcomes that drive business growth and operational efficiency.'
    }
  ];

  const stats = [
    { value: '5000+', label: 'Businesses Automated' },
    { value: '100%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support' },
    { value: '50+', label: 'Workflow Templates' }
  ];

  return (
    <>
      <Helmet>
        <title>About Iacovici.it - Automation Experts | Iacovici.it</title>
        <meta name="description" content="Learn about Iacovici.it, automation experts specializing in n8n workflows, AI integration, and custom web development solutions for business growth." />
        <meta name="keywords" content="about us, automation experts, n8n workflows, AI integration, web development, business automation" />
        <meta property="og:title" content="About Iacovici.it - Automation Experts | Iacovici.it" />
        <meta property="og:description" content="Learn about Iacovici.it, automation experts specializing in n8n workflows, AI integration, and custom web development solutions for business growth." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iacovici.it/about" />
        <meta property="og:image" content="/logos/ia-logo-web.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Iacovici.it - Automation Experts | Iacovici.it" />
        <meta name="twitter:description" content="Learn about Iacovici.it, automation experts specializing in n8n workflows, AI integration, and custom web development solutions for business growth." />
        <meta name="twitter:image" content="/logos/ia-logo-web.png" />
        <link rel="canonical" href="https://iacovici.it/about" />
      </Helmet>
      
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">About Iacovici.it</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                We help businesses automate repetitive tasks, integrate systems, and leverage AI 
                to work smarter, not harder.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-gradient-to-b from-primary-dark to-black">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-300 mb-6">
                  Founded in 2020, Iacovici.it began as a passion project to solve common business 
                  automation challenges. What started as helping a few local businesses automate 
                  their workflows has grown into a full-service automation consultancy.
                </p>
                <p className="text-gray-300 mb-6">
                  Today, we've helped over 5,000 businesses streamline their operations with 
                  custom n8n workflows, AI integrations, and modern web applications. Our mission 
                  remains the same: to make powerful automation accessible to businesses of all sizes.
                </p>
                <p className="text-gray-300">
                  We believe that technology should work for you, not the other way around. 
                  That's why we focus on creating solutions that are not only powerful but also 
                  intuitive and maintainable.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-primary-gray rounded-2xl p-8 shadow-2xl">
                  <img 
                    src="/logos/ia-presentation-picture.png" 
                    alt="Iacovici.it Team" 
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">Our Values</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="text-accent-gold mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-gradient-to-b from-black to-primary-dark">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-accent-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">Meet Our Team</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The experts behind our automation solutions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="bg-primary-gray rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <User className="w-12 h-12 text-accent-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-accent-gold mb-4">{member.role}</p>
                  <p className="text-gray-400">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-accent-gold/20 to-accent-blue/20 rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses that have automated their workflows 
                and accelerated their growth with our solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://cal.iacovici.it" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Book Free Consultation
                </a>
                <Link to="/templates" className="btn-secondary text-lg px-8 py-4">
                  <Download className="w-5 h-5 mr-2 inline" />
                  Browse Free Templates
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;