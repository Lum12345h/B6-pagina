document.addEventListener('DOMContentLoaded', () => {
    
    const preloader = document.getElementById('preloader');
    const loadingText = document.getElementById('loading-text');
    const percentDisplay = document.querySelector('.status-percent');
    const progressBar = document.querySelector('.loader-bar-fill');
    
    if (preloader) {
        let loadProgress = 0;
        const totalDuration = 1500; 
        const intervalTime = 20;
        const increment = 100 / (totalDuration / intervalTime);
        
        const loadingMessages =['INITIALIZING', 'LOADING ASSETS', 'CALIBRATING', 'READY'];

        const timer = setInterval(() => {
            loadProgress += increment;
            
            if (Math.random() > 0.8 && loadingText) {
                loadingText.innerText = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
            }

            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(timer);
                
                if(loadingText) loadingText.innerText = 'SYSTEM READY';
                if(percentDisplay) percentDisplay.innerText = '100%';
                if(progressBar) progressBar.style.width = '100%';

                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.remove();
                        document.body.classList.remove('loading-state');
                        triggerIntro();
                    }, 500);
                }, 500);
            } else {
                if(progressBar) progressBar.style.width = `${loadProgress}%`;
                if(percentDisplay) percentDisplay.innerText = `${Math.floor(loadProgress)}%`;
            }
        }, intervalTime);
    } else {
        document.body.classList.remove('loading-state');
        triggerIntro();
    }

    function triggerIntro() {
        const heroReveals = document.querySelectorAll('#hero[data-reveal]');
        heroReveals.forEach(el => el.classList.add('reveal-active'));
        
        const headerReveals = document.querySelectorAll('.subpage-header[data-reveal]');
        headerReveals.forEach(el => el.classList.add('reveal-active'));
    }

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    if(hamburger && mobileMenu) {
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
    }

    const canvas = document.getElementById('warp-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars =[];
        const STAR_COUNT = 150;
        const SPEED = 2;

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
                this.z = Math.random() * width; 
                this.pz = this.z; 
            }

            update() {
                this.z -= SPEED * 5; 
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
                const r = (1 - this.z / width) * 2; 

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
            stars =[];
            for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
        }

        function animate() {
            ctx.fillStyle = 'rgba(24, 23, 23, 0.4)'; 
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

    if (window.matchMedia("(min-width: 992px)").matches) {
        const btns = document.querySelectorAll('.magnetic-btn');
        
        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
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

    console.log("%c BUFFALO SIX 2026 %c SYSTEM ONLINE ", "background:#CA130F; color:#fff; padding:5px;", "background:#000; color:#fff; padding:5px;");
});