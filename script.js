document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SYSTEM LOADER & SCRAMBLE TEXT ---
    const preloader = document.getElementById('preloader');
    const scrambleTexts = document.querySelectorAll('.scramble-text');
    
    // Characters for hacker effect
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    class Scrambler {
        constructor(el) {
            this.el = el;
            this.originalText = el.innerText;
            this.update = this.update.bind(this);
        }
        
        start() {
            this.frame = 0;
            this.queue = [];
            for (let i = 0; i < this.originalText.length; i++) {
                const from = this.originalText[i];
                const to = this.originalText[i];
                const start = Math.floor(Math.random() * 20);
                const end = start + Math.floor(Math.random() * 20);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return this;
        }
        
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0; i < this.queue.length; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = chars[Math.floor(Math.random() * chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                // Done
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    // Initialize Preloader
    if(preloader) {
        const bar = document.querySelector('.progress-bar');
        const percent = document.querySelector('.percentage');
        let load = 0;

        const interval = setInterval(() => {
            load += Math.random() * 5;
            if(load > 100) load = 100;
            
            if(bar) bar.style.width = `${load}%`;
            if(percent) percent.innerText = `${Math.floor(load)}%`;

            if(load === 100) {
                clearInterval(interval);
                // Trigger Text Scrambles
                scrambleTexts.forEach(el => {
                    new Scrambler(el).start();
                });
                
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.remove();
                        document.body.classList.remove('loading');
                    }, 500);
                }, 800);
            }
        }, 50);
    } else {
        document.body.classList.remove('loading');
    }

    // --- 2. CUSTOM CURSOR ---
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    // Check if device supports hover (desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows instantly
            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;
            
            // Outline follows with lag (handled by CSS transition or simple JS)
            // Using simple JS for smooth trailing
            outline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Interactive Elements Hover
        const interactives = document.querySelectorAll('a, button, .hamburger, .hotspot, .member-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
        });
    } else {
        if(dot) dot.style.display = 'none';
        if(outline) outline.style.display = 'none';
    }

    // --- 3. SCROLL REVEAL (Intersection Observer) ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const observerConfig = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                    // Retrigger scramble if inside
                    const innerScramble = entry.target.querySelector('.scramble-text');
                    if(innerScramble) new Scrambler(innerScramble).start();
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerConfig);

    revealElements.forEach(el => observer.observe(el));

    // --- 4. NAVIGATION LOGIC ---
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navbar = document.getElementById('navbar');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Sticky Nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.style.background = 'rgba(24,23,23,0.95)';
        else navbar.style.background = 'rgba(24,23,23,0.8)';
    });

    // --- 5. TECH SECTION INTERACTION (Simple Tabs/Visuals) ---
    // (Optional: Add click logic for hotspots if detailed info is needed elsewhere)
    
    // --- 6. BACKGROUND CANVAS (Simplified Particles) ---
    const canvas = document.getElementById('bg-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const particleCount = 40;

        for(let i=0; i<particleCount; i++){
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2
            });
        }

        function animateCanvas() {
            ctx.clearRect(0,0,width,height);
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if(p.x < 0) p.x = width;
                if(p.x > width) p.x = 0;
                if(p.y < 0) p.y = height;
                if(p.y > height) p.y = 0;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                ctx.fill();
            });
            requestAnimationFrame(animateCanvas);
        }
        
        animateCanvas();
        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });
    }
});
