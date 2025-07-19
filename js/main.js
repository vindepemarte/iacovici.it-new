// Main JavaScript Functions for Iacovici.it

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("B7K1wbag_l9sz5D0D"); // Replace with your actual EmailJS public key
    
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initForms();
    initScrollSpy();
    initTypewriter();
    initIntersectionObserver();
    initPerformanceOptimizations();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    // Show loading notification
    showNotification('Sito caricato con successo!', 'success');
});

// EmailJS Configuration - REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
const EMAILJS_CONFIG = {
    serviceID: 'service_4yiu7ts',    // Replace with your EmailJS service ID
    templateID: 'template_vect5fp',  // Replace with your EmailJS template ID
    publicKey: 'B7K1wbag_l9sz5D0D'     // Replace with your EmailJS public key
};

// Main App Initialization
function initializeApp() {
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initForms();
    initScrollSpy();
    initTypewriter();
    initIntersectionObserver();
    initPerformanceOptimizations();
    
    // Add loading complete class
    document.body.classList.add('loaded');
}

// Navigation Functions
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 968) {
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background opacity based on scroll
        const opacity = Math.min(scrollTop / 100, 0.95);
        navbar.style.background = `rgba(15, 23, 42, ${opacity})`;
        
        lastScrollTop = scrollTop;
    });
}

function toggleMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Smooth Scrolling Functions
function initSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                scrollToSection(targetId);
            }
        });
    });
}

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;
    
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Close mobile menu if open
    closeMobileMenu();
}

// Form Handling Functions
function initForms() {
    // Quick quote form
    const quickQuoteForm = document.getElementById('quick-quote-form');
    if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', handleQuickQuoteSubmit);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Form validation
    initFormValidation();
}

// Handle Quick Quote Form Submission
async function handleQuickQuoteSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.btn-form');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Invio in corso...';
    submitBtn.disabled = true;
    
    try {
        // Prepare email parameters
        const templateParams = {
            to_email: 'iacovici95@gmail.com',
            from_name: formData.get('nome'),
            from_email: formData.get('email'),
            phone: formData.get('telefono') || 'Non fornito',
            service: getServiceName(formData.get('servizio')),
            message: formData.get('messaggio') || 'Nessun messaggio aggiuntivo',
            form_type: 'Preventivo Rapido'
        };
        
        // Send email using EmailJS
        await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );
        
        // Success - show notification and reset form
        showNotification('Richiesta inviata con successo! Ti contatteremo entro 24 ore.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        showNotification('Si è verificato un errore. Riprova o contattaci direttamente.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Contact Form Submission
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.btn-submit');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Invio in corso...';
    submitBtn.disabled = true;
    
    try {
        // Prepare email parameters
        const templateParams = {
            to_email: 'iacovici95@gmail.com',
            from_name: `${formData.get('nome')} ${formData.get('cognome')}`,
            from_email: formData.get('email'),
            phone: formData.get('telefono') || 'Non fornito',
            service: getServiceName(formData.get('servizio')),
            message: formData.get('messaggio'),
            form_type: 'Richiesta Completa'
        };
        
        // Send email using EmailJS
        await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );
        
        // Success - show notification and reset form
        showNotification('Richiesta inviata con successo! Ti contatteremo entro 24 ore.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        showNotification('Si è verificato un errore. Riprova o contattaci direttamente.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function getServiceName(serviceValue) {
    const serviceNames = {
        'vetrina': 'Vetrina Base (300-500€)',
        'standard': 'Standard Plus (600-1.200€)',
        'ecommerce': 'E-commerce (1.500-2.500€)',
        'consulenza': 'Solo Consulenza'
    };
    
    return serviceNames[serviceValue] || serviceValue;
}

function initFormValidation() {
    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
                showFieldError(this, 'Inserisci un indirizzo email valido');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });
    });
    
    // Phone number validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                this.classList.add('error');
                showFieldError(this, 'Inserisci un numero di telefono valido');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(field, message) {
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('field-error')) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    errorElement.textContent = message;
}

function hideFieldError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.remove();
    }
}

// Scroll Spy Functions
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typing-text');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    let index = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Add blinking cursor
            typewriterElement.innerHTML += '<span class="cursor">|</span>';
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Intersection Observer for Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate stats numbers
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
                
                // Animate progress bars if any
                if (entry.target.classList.contains('progress-bar')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => observer.observe(el));
}

// Number Animation
function animateNumber(element) {
    const finalNumber = parseInt(element.textContent);
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.floor(finalNumber * easeOut);
        
        element.textContent = currentNumber + (element.textContent.includes('+') ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = element.textContent; // Ensure final value
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(handleScroll);
    });
}

function handleScroll() {
    // Handle scroll-related animations and effects
    const scrolled = window.scrollY;
    const rate = scrolled * -0.5;
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection && scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

// Resize handler
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize
    if (window.innerWidth > 968) {
        closeMobileMenu();
    }
}, 250));

// Export functions for global use
window.scrollToSection = scrollToSection;
window.showNotification = showNotification; 