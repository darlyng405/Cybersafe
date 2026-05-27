// Mensaje de Darlyng para futuro dev
// El JS no esta cumpliendo ninguna funcion de generar codigo, solo cumple funcion de animaciones
// Al ser una pagina estatica todo el texto esta dentro del HTML
// Todo tiene comentarios para que se sepa que hace cada bloque de codigo


// ── Partículas conectadas para las animaciones (Canvas) ──
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.8 + 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
}
animateParticles();

// efecto scroll de la navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile toggle 
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
    } else {
        icon.className = 'fa-solid fa-bars';
    }
});


// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
});

// ── volver arriba ──
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Intersection Observer para animaciones 
const fadeElements = document.querySelectorAll('.fade-in');
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
fadeElements.forEach(el => observer.observe(el));

// Animación de contadores de estadísticas
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);
                el.textContent = current;
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.4 });
statNumbers.forEach(el => statsObserver.observe(el));

// Efecto parallax suave en el hero al mover el mouse 
const hero = document.querySelector('.hero');
if (hero && window.innerWidth > 768) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
            heroContent.style.transition = 'transform 0.15s ease-out';
        }
    });
    hero.addEventListener('mouseleave', () => {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = 'translate(0, 0)';
            heroContent.style.transition = 'transform 0.5s ease-out';
        }
    });
}

console.log('%c🛡️ CyberSafe %c— Página cargada correctamente',
    'font-weight:bold;color:#00d4ff;font-size:1.1rem;',
    'color:#a0a0bc;');
console.log('%c🔐 La ciberseguridad es responsabilidad de todos. Mantente informado.',
    'color:#7b61ff;');