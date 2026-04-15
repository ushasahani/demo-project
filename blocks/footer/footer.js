import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  const fragment = await loadFragment(footerPath);

  // Clear existing content
  block.textContent = '';

  const footer = document.createElement('div');
  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  block.append(footer);

  // ✅ ADD CLASSES BASED ON TEXT CONTENT
  decorateFooterColumns(block);
}

/**
 * Adds semantic classes to footer columns based on heading text
 */
function decorateFooterColumns(block) {
  const columnsBlock = block.querySelector('.columns');
  if (!columnsBlock) return;

  columnsBlock.classList.add('footer-columns');

  const cols = columnsBlock.querySelectorAll(':scope > div > div');

  cols.forEach((col) => {
    col.classList.add('footer-col');

    const heading = col.querySelector('h2, h3, h4');
    const headingText = heading?.textContent.toLowerCase() || '';

    if (headingText.includes('address')) {
      col.classList.add('footer-address');
    } else if (headingText.includes('quick')) {
      col.classList.add('footer-links');
    } else if (headingText.includes('service')) {
      col.classList.add('footer-services');
    } else {
      col.classList.add('footer-brand');
    }
  });
}