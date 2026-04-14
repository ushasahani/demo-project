/*
 * Story Block (Edge Delivery Services)
 * - Left image
 * - Right content wrapper
 * - Multiple story-content sections
 * - Optional left/right split when UL exists
 * - Count-up animation for numeric content in story-right
 */

export default function decorate(block) {
  let imageColumn;

  /* ---------------------------------------------------
   * Create RIGHT wrapper (contains all story-content)
   * --------------------------------------------------- */
  const rightWrapper = document.createElement('div');
  rightWrapper.className = 'story-content right';

  /* ---------------------------------------------------
   * Process original columns
   * --------------------------------------------------- */
  [...block.children].forEach((column) => {
    /* -------- IMAGE COLUMN -------- */
    if (column.querySelector('picture, img')) {
      column.classList.add('story-image', 'left');
      imageColumn = column;
      return;
    }

    /* -------- CONTENT COLUMN -------- */
    const storyContent = document.createElement('div');
    storyContent.className = 'story-content';

    const storyLeft = document.createElement('div');
    storyLeft.className = 'story-left';

    const storyRight = document.createElement('div');
    storyRight.className = 'story-right';

    let hasUL = false;

    column.querySelectorAll(':scope > div > *').forEach((el) => {
      // Ignore empty / junk nodes
      if (
        el.tagName === 'P' &&
        !el.textContent.trim()
      ) return;

      if (el.tagName === 'UL') {
        hasUL = true;
        storyRight.appendChild(el);
      } else {
        storyLeft.appendChild(el);
      }
    });

    /* Build correct structure */
    if (hasUL) {
      if (storyLeft.children.length) {
        storyContent.appendChild(storyLeft);
      }
      if (storyRight.children.length) {
        storyContent.appendChild(storyRight);
      }
    } else {
      [...storyLeft.children].forEach((el) =>
        storyContent.appendChild(el)
      );
    }

    rightWrapper.appendChild(storyContent);
    column.remove();
  });

  /* ---------------------------------------------------
   * Rebuild block
   * --------------------------------------------------- */
  block.innerHTML = '';
  if (imageColumn) block.appendChild(imageColumn);
  block.appendChild(rightWrapper);
  block.classList.add('story-layout');

  /* ---------------------------------------------------
   * Init count-up animation
   * --------------------------------------------------- */
  initStoryRightCounters(block);
}

/* ===================================================
 * COUNT-UP ANIMATION (NO HTML CHANGES REQUIRED)
 * =================================================== */

function initStoryRightCounters(block) {
  const storyRights = block.querySelectorAll('.story-right');
  if (!storyRights.length) return;

  const animated = new WeakSet();

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const numberEls = [...entry.target.querySelectorAll('*')].filter((el) =>
          /^\d+$/.test(el.textContent.trim())
        );

        numberEls.forEach((el) => {
          if (animated.has(el)) return;
          animated.add(el);
          animateCountUp(el);
        });

        obs.unobserve(entry.target); // run once
      });
    },
    { threshold: 0.3 }
  );

  storyRights.forEach((el) => observer.observe(el));
}

function animateCountUp(el, duration = 1200) {
  const endValue = Number(el.textContent.trim());
  if (!endValue || endValue <= 0) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = endValue;
    return;
  }

  let start = 0;
  const startTime = performance.now();
  el.textContent = '0';

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out
    const value = Math.floor(eased * endValue);

    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = endValue; // ensure exact
    }
  }

  requestAnimationFrame(update);
}