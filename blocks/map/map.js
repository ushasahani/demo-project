export default function decorate(block) {
  const rows = [...block.children];

  // row[0] = Map (block name)
  const link = rows[1]?.querySelector('a');
  const mapUrl = link?.href;
  const height = rows[2]?.textContent.trim() || '400';

  if (!mapUrl) {
    block.textContent = 'Google Maps URL is missing';
    return;
  }

  block.innerHTML = `
    <div class="map-container" style="height:${height}px">
      <iframe
        src="${mapUrl}"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen>
      </iframe>
    </div>
  `;
}
``