export default function decorate(block) {
  const track = block.querySelector(':scope > div');
  const content = track?.querySelector(':scope > div');

  // Safety checks
  if (!track || !content || track.dataset.cloned === 'true') return;

  // Clone only once for seamless loop
  const clone = content.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');

  track.appendChild(clone);
  track.dataset.cloned = 'true';

  // Optional classes (for clarity/debugging)
  track.classList.add('marquee-track');
  content.classList.add('marquee-content');
  clone.classList.add('marquee-content');
}
