/**
 * BUFFALO SIX RACING TEAM - 2026 OFFICIAL SITE SCRIPT
 * Developed for High Performance Web Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 1. SYSTEM INITIALIZATION & PRELOADER
    // ======================================================
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-fill');
    const body = document.body;
    
    // Simulate system loading sequence
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress > 100) loadProgress = 100;
        
        progressBar.style.width = `${loadProgress}%`;
        
        if (loadProgress === 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                body.classList.remove('loading');
                
                // Trigger intro animations
                triggerIntro();
            }, 500);
        }
    }, 200);

    function triggerIntro() {
        // Force trigger of first section animations
        const heroElements = document.querySelectorAll('#hero [data-reveal]');
        heroElements.forEach(el => el.classList.add('reveal-active'));
    }

    // ======================================================
    // 2. NAVBAR LOGIC & MOBILE MENU
    // ======================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        if(body.classList.contains('loading')) return;
        
        // Toggle body scroll lock
        if (mobileNav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // ======================================================
    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ======================================================
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply delay if specified in data-delay attribute
                const delay = entry.target.getAttribute('data-delay');
                
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('reveal-active');
                    }, delay);
                } else {
                    entry.target.classList.add('reveal-active');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ======================================================
    // 4. TECH SPECS ANIMATION
    // ======================================================
    const techSection = document.querySelector('.tech-specs');
    const specBars = document.querySelectorAll('.spec-bar .fill');

    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                specBars.forEach(bar => {
                    // Reset width to 0 via inline style then animate to defined width
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
                        bar.style.width = targetWidth;
                    }, 100);
                });
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (techSection) {
        techObserver.observe(techSection);
    }

    // ======================================================
    // 5. CANVAS BACKGROUND ANIMATION (Starfield/Speed Effect)
    // ======================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Configuration
    const particleCount = 60; // Optimized for performance
    const connectionDistance = 150;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        ctx.strokeStyle = 'rgba(202, 19, 15, 0.15)'; // Buffalo Red low opacity
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateCanvas);
    }
    
    // Init Canvas
    resize();
    initParticles();
    animateCanvas();
    
    window.addEventListener('resize', () => {
        resize();
        initParticles(); // Reset particles on resize to prevent distortion
    });

    // ======================================================
    // 6. ACTIVE LINK ON SCROLL
    // ======================================================
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('data-link') === current) {
                li.classList.add('active');
            }
        });
    });

    // ======================================================
    // 7. BUTTON HOVER EFFECTS (MAGNETIC FEEL - Optional)
    // ======================================================
    // Simple implementation for premium feel on desktop only
    if (window.matchMedia("(min-width: 992px)").matches) {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Subtle glow effect following mouse
                // Since we use ::before for hover slide, we can use box-shadow or similar here if needed
                // keeping it simple for performance
            });
        });
    }

    // ======================================================
    // 8. CONSOLE SIGNATURE
    // ======================================================
    console.log(
        "%c BUFFALO SIX %c 2026 READY ",
        "background:#CA130F; color:#fff; font-weight:bold; padding: 5px;",
        "background:#181717; color:#fff; padding: 5px;"
    );
});
