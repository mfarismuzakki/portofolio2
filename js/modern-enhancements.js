// Reveal on scroll for .reveal elements
(function() {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
})();
// Modern Portfolio Enhancements JavaScript

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Add smooth reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.modern-card, .tech-item, .portfolio-item, .tool-card, .timeline-block');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Add typing effect to intro position text
    const typingElements = document.querySelectorAll('.typing-text');
    if (typingElements.length > 0) {
        let currentIndex = 0;
        
        function showNextText() {
            typingElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
            });
            
            setTimeout(() => {
                typingElements[currentIndex].style.opacity = '1';
                typingElements[currentIndex].style.transform = 'translateY(0)';
                currentIndex = (currentIndex + 1) % typingElements.length;
            }, 200);
        }
        
        // Start typing animation
        showNextText();
        setInterval(showNextText, 3000);
    }

    // Enhanced navbar scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(15, 23, 42, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Add particle animation to intro section
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer) {
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 6000);
        }
    }

    // Create particles periodically
    setInterval(createParticle, 2000);

    // Add hover effects to timeline blocks
    const timelineBlocks = document.querySelectorAll('.timeline-block');
    timelineBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Add stagger animation to tech items
    function animateTechItems() {
        const techSections = document.querySelectorAll('#tech-stack .row.section-intro');
        
        techSections.forEach((section, sectionIndex) => {
            const techItems = section.querySelectorAll('.tech-item');
            
            const sectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        techItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                                item.classList.add('fade-in-up');
                            }, index * 100);
                        });
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            sectionObserver.observe(section);
        });
    }

    // Initialize tech items animation
    animateTechItems();

    // Add portfolio filter animation (if needed in the future)
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.animationDelay = (index * 0.1) + 's';
    });

    // Tool cards hover effect enhancement
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.tool-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.tool-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Add scroll progress indicator
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '0%';
        progressBar.style.height = '3px';
        progressBar.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
        progressBar.style.zIndex = '9999';
        progressBar.style.transition = 'width 0.1s ease';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    createScrollProgress();

    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn-modern, .button, .tool-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add dynamic stats counter (for intro section)
    function animateStats() {
        const stats = document.querySelectorAll('.stat-item div:first-child');
        
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.textContent);
                    let current = 0;
                    const increment = target / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.ceil(current) + '+';
                        }
                    }, 50);
                    
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });
        
        stats.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    animateStats();

    // Add smooth scroll for navigation links
    document.querySelectorAll('a.smoothscroll').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });

    console.log('🚀 Modern portfolio enhancements loaded successfully!');
});

// Add CSS for animations if not already present
if (!document.querySelector('#modern-animations-css')) {
    const style = document.createElement('style');
    style.id = 'modern-animations-css';
    style.textContent = `
        /* Initial state for animated elements */
        .modern-card, .tech-item, .portfolio-item, .tool-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .modern-card.fade-in-up, .tech-item.fade-in-up, 
        .portfolio-item.fade-in-up, .tool-card.fade-in-up {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Smooth transitions for all interactive elements */
        * {
            transition: all 0.3s ease;
        }
        
        /* Disable transitions for reduced motion users */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}