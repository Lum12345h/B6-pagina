document.addEventListener('DOMContentLoaded', () => {
    console.log("Buffalo Six System Online");
    
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-nav');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    const glitchTexts = document.querySelectorAll('.big-glitch');
    glitchTexts.forEach(text => {
        text.addEventListener('mouseover', () => {
            text.style.color = 'var(--color-red)';
        });
        text.addEventListener('mouseout', () => {
            text.style.color = '#fff';
        });
    });
});