const loader = document.getElementById('loader');
const loaderProgress = document.getElementById('loaderProgress');
const navbar = document.getElementById('navbar');
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const cursor = document.getElementById('cursor');
const revealItems = document.querySelectorAll('.reveal, .service-card, .gallery__item, .testimonial-card, .about__text, .about__image-wrap');
const counters = document.querySelectorAll('.stat__number');

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('load', () => {
  loaderProgress.style.width = '100%';
  setTimeout(() => loader.classList.add('is-hidden'), 700);
});

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  navbar.classList.toggle('is-scrolled', scrollTop > 40);
});

burgerBtn?.addEventListener('click', () => {
  const expanded = burgerBtn.getAttribute('aria-expanded') === 'true';
  burgerBtn.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.classList.toggle('is-open');
  mobileMenu.setAttribute('aria-hidden', expanded ? 'true' : 'false');
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.remove('is-open');
    burgerBtn?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  });
});

if (window.matchMedia('(hover: hover)').matches) {
  cursor?.classList.add('is-active');
  window.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('a, button, .gallery__item, .service-card, .testimonial-card, .btn').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor?.classList.add('is-active'));
    element.addEventListener('mouseleave', () => cursor?.classList.remove('is-active'));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.16
});

revealItems.forEach((item) => observer.observe(item));

counters.forEach((counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = 1100;
  const startTime = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    counter.textContent = value.toString();
    if (progress < 1) requestAnimationFrame(tick);
  };

  const section = counter.closest('section, .about__stats');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(tick);
        sectionObserver.disconnect();
      }
    });
  }, { threshold: 0.6 });

  sectionObserver.observe(section);
});

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const productCards = Array.from(document.querySelectorAll('.gallery__item'));

searchForm?.addEventListener('submit', (event) => event.preventDefault());
searchInput?.addEventListener('input', (event) => {
  const term = event.target.value.trim().toLowerCase();
  productCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(term) ? '' : 'none';
  });
});
