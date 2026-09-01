/* =========================================================
   CREPE BRASÍLIA — animations.js
   GSAP + AOS: entrada do Hero, parallax e partículas.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- AOS (Scroll Reveal) ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Entrada animada do texto do Hero ---------- */
    const heroTimeline = gsap.timeline({ delay: 0.6 });
    heroTimeline
      .from('.hero-logo', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.hero-title .line', {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out'
      }, '-=0.4');

    /* ---------- Parallax no Hero (imagem de fundo) ---------- */
    gsap.to('.hero-bg img', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    /* ---------- Parallax leve na seção Sobre ---------- */
    gsap.to('.about-image img', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ---------- PARTÍCULAS DISCRETAS NO HERO ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const COUNT = window.innerWidth < 768 ? 22 : 40;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        speedY: Math.random() * 0.35 + 0.08,
        drift: Math.random() * 0.3 - 0.15,
        alpha: Math.random() * 0.4 + 0.15
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,154,61,${p.alpha})`;
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.drift;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

});
