document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader (Only runs if element exists) ---
    const preloader = document.getElementById('preloader');
    if(preloader) {
        const progressBar = document.querySelector('.progress-fill');
        let load = 0;
        const interval = setInterval(() => {
            load += Math.random() * 20;
            if(load > 100) load = 100;
            progressBar.style.width = `${load}%`;
            
            if(load === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.remove(), 500);
                    document.body.classList.remove('loading');
                }, 500);
            }
        }, 150);
    } else {
        document.body.classList.remove('loading');
    }

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.style.background = 'rgba(24, 23, 23, 0.98)';
        else navbar.style.background = 'rgba(24, 23, 23, 0.8)';
    });

    // --- Scroll Reveal Animations ---
    const reveals = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(el => observer.observe(el));

    // --- Background Canvas Animation ---
    const canvas = document.getElementById('bg-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

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
                this.x += this.vx; this.y += this.vy;
                if(this.x < 0) this.x = width;
                if(this.x > width) this.x = 0;
                if(this.y < 0) this.y = height;
                if(this.y > height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            for(let i=0; i<50; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0,0,width,height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            // Draw lines
            ctx.strokeStyle = 'rgba(202, 19, 15, 0.1)';
            for(let i=0; i<particles.length; i++) {
                for(let j=i+1; j<particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx+dy*dy);
                    if(dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => { resize(); init(); });
        resize();
        init();
        animate();
    }
});
