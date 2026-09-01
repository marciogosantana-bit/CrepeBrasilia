/* =========================================================
   CREPE BRASÍLIA — script.js
   Interações principais do site (sem carrinho/compra).
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- BOTÃO VOLTAR AO TOPO ---------- */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop(){
    backToTop.classList.toggle('show', window.scrollY > 500);
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  /* ---------- LOADING SCREEN ---------- */
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 900);
  });
  document.body.style.overflow = 'hidden';
  // Safety net: never trap the user on the loader.
  setTimeout(() => loadingScreen.classList.add('hidden'), 3500);

  /* ---------- NAVBAR: fundo sólido ao rolar ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- MENU MOBILE (hambúrguer) ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- LINK ATIVO CONFORME SEÇÃO VISÍVEL ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(sec => sectionObserver.observe(sec));

  /* ---------- MODO CLARO / ESCURO ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('crepe-theme', theme);
  };
  const savedTheme = localStorage.getItem('crepe-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- CARDÁPIO: filtro por categoria ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      menuCards.forEach(card => {
        const match = filter === 'todos' || card.dataset.category === filter;
        if (window.gsap) {
          if (match) {
            card.classList.remove('is-hidden');
            gsap.fromTo(card, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' });
          } else {
            gsap.to(card, {
              opacity: 0, y: 12, scale: 0.96, duration: 0.25, ease: 'power2.in',
              onComplete: () => card.classList.add('is-hidden')
            });
          }
        } else {
          card.classList.toggle('is-hidden', !match);
        }
      });
    });
  });

  /* ---------- AGENDA: destaca o dia atual + troca o mapa ---------- */
  const agendaCards = document.querySelectorAll('.agenda-card[data-day]');
  const todayIndex = new Date().getDay(); // 0=domingo ... 6=sábado
  let firstToday = null;

  agendaCards.forEach(card => {
    if (parseInt(card.dataset.day, 10) === todayIndex) {
      card.classList.add('is-today');
      if (!firstToday) firstToday = card;
    }
  });

  const mapFrame = document.getElementById('mapFrame');
  const setMap = (query) => {
    if (!query) return;
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  };

  agendaCards.forEach(card => {
    const mapQuery = card.dataset.map;
    if (!mapQuery) return;
    card.addEventListener('click', () => setMap(mapQuery));

    const mapLink = card.querySelector('[data-map-link]');
    if (mapLink) {
      mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
      mapLink.target = '_blank';
      mapLink.rel = 'noopener';
      mapLink.addEventListener('click', (e) => e.stopPropagation());
    }
  });

  // Ao carregar, mostra automaticamente a feira de hoje no mapa (se houver).
  if (firstToday && firstToday.dataset.map) setMap(firstToday.dataset.map);


  /* ---------- ANO NO RODAPÉ ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
