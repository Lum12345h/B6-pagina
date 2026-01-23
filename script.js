document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. SYSTEM INITIALIZATION (Preloader)
    // ==========================================
    const preloader = document.getElementById('preloader');
    const loadingText = document.getElementById('loading-text');
    const percentDisplay = document.querySelector('.status-percent');
    const progressBar = document.querySelector('.loader-bar-fill');
    
    if (preloader) {
        let loadProgress = 0;
        const totalDuration = 1500; // 1.5 seconds loading simulation
        const intervalTime = 20;
        const increment = 100 / (totalDuration / intervalTime);
        
        const loadingMessages = ['INITIALIZING', 'LOADING ASSETS', 'CALIBRATING', 'READY'];

        const timer = setInterval(() => {
            loadProgress += increment;
            
            // Randomly glitch the text
            if (Math.random() > 0.8) {
                loadingText.innerText = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
            }

            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(timer);
                
                loadingText.innerText = 'SYSTEM READY';
                percentDisplay.innerText = '100%';
                progressBar.style.width = '100%';

                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.remove();
                        document.body.classList.remove('loading-state');
                        triggerIntro();
                    }, 500);
                }, 500);
            } else {
                progressBar.style.width = `${loadProgress}%`;
                percentDisplay.innerText = `${Math.floor(loadProgress)}%`;
            }
        }, intervalTime);
    }

    function triggerIntro() {
        const heroReveals = document.querySelectorAll('#hero [data-reveal]');
        heroReveals.forEach(el => el.classList.add('reveal-active'));
    }

    // ==========================================
    // 2. NAVIGATION LOGIC
    // ==========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // 3. WARP SPEED CANVAS
    // ==========================================
    const canvas = document.getElementById('warp-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        const STAR_COUNT = 150;
        const SPEED = 2; // Speed factor

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        }

        class Star {
            constructor() {
                this.x = Math.random() * width - width / 2;
                this.y = Math.random() * height - height / 2;
                this.z = Math.random() * width; // Depth
                this.pz = this.z; // Previous Z
            }

            update() {
                this.z -= SPEED * 5; // Move closer
                if (this.z < 1) {
                    this.z = width;
                    this.x = Math.random() * width - width / 2;
                    this.y = Math.random() * height - height / 2;
                    this.pz = this.z;
                }
            }

            draw() {
                const sx = (this.x / this.z) * width + width / 2;
                const sy = (this.y / this.z) * height + height / 2;

                const r = (1 - this.z / width) * 2; // Size based on depth

                // Draw trail
                const px = (this.x / this.pz) * width + width / 2;
                const py = (this.y / this.pz) * height + height / 2;
                this.pz = this.z;

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - this.z / width})`;
                ctx.lineWidth = r;
                ctx.stroke();
            }
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
        }

        function animate() {
            ctx.fillStyle = 'rgba(24, 23, 23, 0.4)'; // Trails effect
            ctx.fillRect(0, 0, width, height);
            
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // ==========================================
    // 4. SCROLL REVEAL OBSERVER
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // ==========================================
    // 5. MAGNETIC BUTTONS (Desktop Only)
    // ==========================================
    if (window.matchMedia("(min-width: 992px)").matches) {
        const btns = document.querySelectorAll('.magnetic-btn');
        
        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Move button slightly
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                // Move inner content slightly more
                const content = btn.querySelector('.btn-content');
                if(content) content.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
                const content = btn.querySelector('.btn-content');
                if(content) content.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // ==========================================
    // 6. TEXT GLITCH EFFECT (Hover)
    // ==========================================
    const glitchTexts = document.querySelectorAll('.big-glitch');
    
    glitchTexts.forEach(text => {
        text.addEventListener('mouseover', () => {
            let original = text.getAttribute('data-text');
            let iterations = 0;
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            
            const interval = setInterval(() => {
                text.innerText = original.split("")
                    .map((letter, index) => {
                        if(index < iterations) return original[index];
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");
                
                if(iterations >= original.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    });

    console.log("%c BUFFALO SIX 2026 %c SYSTEM ONLINE ", "background:#CA130F; color:#fff; padding:5px;", "background:#000; color:#fff; padding:5px;");
});
