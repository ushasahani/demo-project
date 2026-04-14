import { loadCSS, loadScript } from '../../scripts/aem.js';
export default async function decorate(block) {
  /* 1. Load Swiper only for this block */
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  /* 2. Create Swiper container */
  const swiperEl = document.createElement('div');
  swiperEl.className = 'swiper hero-carousel-swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  /* 3. Convert each authored slide */
  [...block.children].forEach((slide) => {
    const [imageCol, textCol] = slide.children;
    if (!imageCol || !textCol) return;

    // Slide structure
    const swiperSlide = document.createElement('div');
    swiperSlide.className = 'swiper-slide';

    const heroSlide = document.createElement('div');
    heroSlide.className = 'hero-slide';

    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'hero-media';
    mediaWrapper.append(...imageCol.children);

    const textWrapper = document.createElement('div');
    textWrapper.className = 'hero-text-wrapper';
    textWrapper.append(...textCol.children);

    heroSlide.append(mediaWrapper, textWrapper);
    swiperSlide.append(heroSlide);
    swiperWrapper.append(swiperSlide);
  });

  /* 4. Pagination & navigation */
  swiperEl.append(
    swiperWrapper,
    createDiv('swiper-pagination'),
    createDiv('swiper-button-prev'),
    createDiv('swiper-button-next'),
  );

  /* 5. Replace block content */
  block.innerHTML = '';
  block.append(swiperEl);

  /* 6. Initialize Swiper */
  new window.Swiper(swiperEl, {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    a11y: {
      enabled: true,
    },
  });
}

/* Utility */
function createDiv(className) {
  const div = document.createElement('div');
  div.className = className;
  return div;
}