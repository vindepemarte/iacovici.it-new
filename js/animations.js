// Advanced Animations for Iacovici.it

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAdvancedAnimations();
});

// Main animations initialization
function initAdvancedAnimations() {
    initParticleSystem();
    initScrollAnimations();
    initHoverEffects();
    initLoadingAnimations();
    initParallaxEffects();
    initCounterAnimations();
    initCardAnimations();
    initTimelineAnimations();
    initCursorEffects();
}

// Particle System for Background
function initParticleSystem() {
    // Only initialize if device can handle it
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.6;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // Keep particles in bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        const particleCount = Math.min(30, Math.floor(canvas.width * canvas.height / 15000));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) +
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        particles.forEach(particle => {
            const distance = Math.sqrt(
                Math.pow(particle.x - mouse.x, 2) +
                Math.pow(particle.y - mouse.y, 2)
            );
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                const angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x);
                particle.speedX += Math.cos(angle) * force * 0.01;
                particle.speedY += Math.sin(angle) * force * 0.01;
            }
        });
    });
}

// Enhanced Scroll Animations - Progressive Enhancement
function initScrollAnimations() {
    // Skip if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                element.classList.add('visible');
                
                // Enhanced animations for specific elements
                if (element.classList.contains('service-card')) {
                    animateServiceCard(element);
                } else if (element.classList.contains('price-card')) {
                    animatePriceCard(element);
                } else if (element.classList.contains('timeline-item')) {
                    animateTimelineItem(element);
                }
            }
        });
    }, observerOptions);
    
    // Observe all cards and animated elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .price-card, .portfolio-item, .spec-item, .timeline-item, .fade-in, .slide-in-left, .slide-in-right'
    );
    
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
        // Ensure elements are visible immediately on slower devices
        setTimeout(() => {
            if (!el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        }, 100);
    });
}

// Service Card Animation
function animateServiceCard(card) {
    const icon = card.querySelector('.service-icon');
    const features = card.querySelectorAll('.service-features li');
    
    if (icon && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        icon.style.animation = 'bounceIn 0.6s ease-out';
    }
    
    features.forEach((feature, index) => {
        // Ensure features are visible immediately
        feature.style.opacity = '1';
        
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTimeout(() => {
                feature.style.animation = 'slideInLeft 0.4s ease-out forwards';
            }, index * 50);
        }
    });
}

// Price Card Animation
function animatePriceCard(card) {
    const price = card.querySelector('.price-range');
    
    if (price && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const finalValue = price.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        if (numericValue > 0) {
            animateValue(price, 0, numericValue, 1000, (value) => {
                const suffix = finalValue.includes('-') ? '-' + finalValue.split('-')[1] : '€';
                price.textContent = Math.floor(value) + suffix;
            });
        }
    }
}

// Timeline Item Animation
function animateTimelineItem(item) {
    const number = item.querySelector('.timeline-number');
    const content = item.querySelector('.timeline-content');
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (number) {
            number.style.animation = 'scaleIn 0.5s ease-out';
        }
        
        if (content) {
            setTimeout(() => {
                content.style.animation = 'slideInRight 0.6s ease-out';
            }, 200);
        }
    }
}

// Hover Effects
function initHoverEffects() {
    // Skip hover effects on touch devices
    if ('ontouchstart' in window) {
        return;
    }
    
    // Card tilt effect
    const cards = document.querySelectorAll('.service-card, .price-card, .portfolio-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease-out';
        });
        
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -3;
                const rotateY = (x - centerX) / centerX * 3;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-form, .btn-submit');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Simplified Loading Animations
function initLoadingAnimations() {
    // Skip loading animation on slower devices
    if (navigator.connection && navigator.connection.effectiveType && 
        (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g')) {
        return;
    }
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <h2>Iacovici.it</h2>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        </div>
    `;
    
    const loadingStyles = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease-out;
        }
        
        .loading-content {
            text-align: center;
            color: white;
        }
        
        .loading-logo h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            animation: pulse 2s infinite;
        }
        
        .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto;
        }
        
        .loading-progress {
            height: 100%;
            background: white;
            width: 0%;
            animation: loadingProgress 1.5s ease-out forwards;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes loadingProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = loadingStyles;
    document.head.appendChild(styleElement);
    document.body.appendChild(loadingOverlay);
    
    // Remove loading overlay quickly
    const removeLoading = () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.remove();
                }
                if (styleElement.parentNode) {
                    styleElement.remove();
                }
            }, 500);
        }, 800);
    };
    
    if (document.readyState === 'complete') {
        removeLoading();
    } else {
        window.addEventListener('load', removeLoading);
    }
}

// Parallax Effects - Optional
function initParallaxEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
        'ontouchstart' in window) {
        return;
    }
    
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16));
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.counter);
                const suffix = counter.dataset.suffix || '';
                
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    animateValue(counter, 0, target, 1500, (value) => {
                        counter.textContent = Math.floor(value) + suffix;
                    });
                } else {
                    counter.textContent = target + suffix;
                }
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Simplified Card Animations
function initCardAnimations() {
    // Ensure all cards are visible and add subtle stagger
    const cards = document.querySelectorAll('.service-card, .price-card, .portfolio-item, .spec-item');
    
    cards.forEach((card, index) => {
        // Ensure card is visible
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        
        // Add animation class for intersection observer
        if (!card.classList.contains('fade-in')) {
            card.classList.add('fade-in');
        }
        
        // Subtle stagger effect
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.style.animationDelay = `${index * 0.05}s`;
        }
    });
}

// Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-timeline');
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        // Ensure timeline items are visible
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
        
        timelineObserver.observe(item);
    });
}

// Simplified Cursor Effects
function initCursorEffects() {
    // Skip on mobile and tablets
    if (window.innerWidth <= 1024 || 'ontouchstart' in window) {
        return;
    }
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div>';
    
    const cursorStyles = `
        .custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease-out;
        }
        
        .cursor-dot {
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 50%;
            transform: scale(1);
            transition: transform 0.2s ease-out;
        }
        
        .custom-cursor.hover {
            transform: scale(1.5);
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = cursorStyles;
    document.head.appendChild(styleElement);
    document.body.appendChild(cursor);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Utility Functions
function animateValue(element, start, end, duration, callback) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        callback(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced CSS animations
const animationStyles = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-20px);
            opacity: 0.5;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(20px);
            opacity: 0.5;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes scaleIn {
        from {
            transform: scale(0.8);
            opacity: 0.5;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .animate-timeline {
        animation: slideInLeft 0.6s ease-out;
    }
    
    .field-error {
        color: #EF4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: slideInLeft 0.3s ease-out;
    }
    
    .cursor {
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    /* Ensure elements are always visible */
    .service-card,
    .price-card,
    .portfolio-item,
    .spec-item,
    .timeline-item {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

// Add animation styles to document
const animationStyleElement = document.createElement('style');
animationStyleElement.textContent = animationStyles;
document.head.appendChild(animationStyleElement); 