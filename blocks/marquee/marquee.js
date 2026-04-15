export default function decorate(block) {
  const inner = block.querySelector(':scope > div > div');
  if (!inner) return;

  inner.classList.add('marquee-track');

  // Duplicate content for seamless loop
  const clone = inner.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');

  inner.parentElement.appendChild(clone);
}