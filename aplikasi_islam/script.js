// ===== Islamic Applications Hub - Interactive Features =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start animations immediately
    startAnimations();
});

// Start page animations
function startAnimations() {
    // Animate hero elements
    animateHeroElements();
    
    // Start counter animations
    animateCounters();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add floating particles
    createFloatingParticles();
}

// Hero elements animation
function animateHeroElements() {
    const heroTitle = document.querySelector('.hero-title');
    const heroHadith = document.querySelector('.hero-hadith');
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 1s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }
    
    if (heroHadith) {
        heroHadith.style.opacity = '0';
        heroHadith.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroHadith.style.transition = 'all 0.8s ease';
            heroHadith.style.opacity = '1';
            heroHadith.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroStats) {
        heroStats.style.opacity = '0';
        heroStats.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroStats.style.transition = 'all 0.8s ease';
            heroStats.style.opacity = '1';
            heroStats.style.transform = 'translateY(0)';
        }, 600);
    }
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe app cards
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Create floating particles
function createFloatingParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(hero, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--primary-cyan);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: 0.6;
        animation: floatParticle ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// Add particle animation styles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
        }
        25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 1;
        }
        50% {
            transform: translateY(-40px) rotate(180deg);
            opacity: 0.8;
        }
        75% {
            transform: translateY(-20px) rotate(270deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(particleStyle);

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(10, 10, 15, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
    
    lastScrollTop = scrollTop;
});

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.classList.toggle('active');
    
    // Add mobile menu functionality here if needed
    console.log('Mobile menu toggled');
}

// App card interactions
document.addEventListener('DOMContentLoaded', function() {
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add hover sound effect (optional)
            playHoverSound();
        });
        
        card.addEventListener('click', function(e) {
            if (!e.target.matches('a, button')) {
                // Click on card but not on button/link
                const link = this.querySelector('.btn-app.primary');
                if (link) {
                    // Add click animation
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                        window.location.href = link.href;
                    }, 150);
                }
            }
        });
    });
});

// Optional: Add subtle sound effects
function playHoverSound() {
    // Create a subtle beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Ignore if audio context is not supported
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + A = Go to Available Apps
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        document.getElementById('available-apps')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + C = Go to Coming Soon
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        document.getElementById('coming-soon')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + H = Go to Home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Performance optimizations
// Debounce scroll events
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

// Apply debounce to scroll handler
window.addEventListener('scroll', debounce(function() {
    // Scroll-based animations here
}, 16));

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        '../__favicon.png'
        // Add other image URLs if needed
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
preloadImages();