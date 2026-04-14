/*
 * Custom Accordion Block (EDS compatible)
 * - Builds accordion items
 * - Optional tabs logic
 * - Wraps default content + accordion into one layout wrapper
 */

export default function decorate(block) {
  // ✅ Only apply to custom accordion blocks
  if (!block.classList.contains('custom-accordion')) return;

  /* =================================================
   * STEP 1: CREATE ACCORDION STRUCTURE
   * ================================================= */
  [...block.children].forEach((row) => {
    // Skip non-accordion rows (e.g. header row)
    if (row.children.length !== 2) return;

    // Accordion label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    // Accordion body
    const body = row.children[1];
    body.classList.add('accordion-item-body');

    // Accordion wrapper
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);

    row.replaceWith(details);
  });

  /* =================================================
   * STEP 2: TABS LOGIC (OPTIONAL)
   * ================================================= */
  function initializeTabs(accordionBody, accordionIndex) {
    if (!accordionBody) return;

    const paragraphs = accordionBody.querySelectorAll('p');
    const brochures = accordionBody.querySelectorAll('h3');
    const lists = accordionBody.querySelectorAll('ul');

    if (!paragraphs.length || !lists.length) return;

    const tabTitles = document.createElement('div');
    tabTitles.className = 'tab-titles';

    const tabContents = document.createElement('div');
    const tabButtons = document.createElement('div');
    tabButtons.className = 'tab-button';

    paragraphs.forEach((p, index) => {
      if (!lists[index]) return;

      const title = document.createElement('p');
      title.className = 'tab-title';
      title.textContent = p.textContent;

      const tabId = `tab-${accordionIndex}-${index}`;
      title.dataset.tab = tabId;
      tabTitles.appendChild(title);

      const content = document.createElement('div');
      content.className = 'tab-content';
      content.id = tabId;
      content.appendChild(lists[index].cloneNode(true));
      tabContents.appendChild(content);
    });

    brochures.forEach((h3) => tabButtons.appendChild(h3.cloneNode(true)));

    accordionBody.innerHTML = '';
    accordionBody.append(tabTitles, tabContents, tabButtons);

    // Activate first tab
    tabTitles.querySelector('.tab-title')?.classList.add('active');
    tabContents.querySelector('.tab-content')?.classList.add('active');

    // Tab switching
    tabTitles.addEventListener('click', (e) => {
      const target = e.target.closest('.tab-title');
      if (!target) return;

      tabTitles.querySelectorAll('.tab-title')
        .forEach(t => t.classList.remove('active'));
      tabContents.querySelectorAll('.tab-content')
        .forEach(c => c.classList.remove('active'));

      target.classList.add('active');
      tabContents.querySelector(`#${target.dataset.tab}`)?.classList.add('active');
    });
  }

  block.querySelectorAll('.accordion-item').forEach((item, index) => {
    initializeTabs(item.querySelector('.accordion-item-body'), index);
  });

  /* =================================================
   * STEP 3: WRAP DEFAULT CONTENT + ACCORDION
   * ================================================= */
  const section = block.closest('.section');
  if (!section) return;

  const defaultContent = section.querySelector('.default-content-wrapper');
  const accordionWrapper = section.querySelector('.accordion-wrapper');

  if (!defaultContent || !accordionWrapper) return;

  // Prevent double wrapping
  if (section.querySelector('.accordion-layout-wrapper')) return;

  const layoutWrapper = document.createElement('div');
  layoutWrapper.className = 'accordion-layout-wrapper';

  layoutWrapper.append(defaultContent, accordionWrapper);
  section.appendChild(layoutWrapper);
}