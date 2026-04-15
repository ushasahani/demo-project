/*
 * Portfolio Block (EDS compatible)
 * - Converts simple authored rows into structured portfolio tiles
 * - Produces:
 *   <div class="portfolio row">
 *     <div class="portfolio-tile">...</div>
 *   </div>
 */

export default function decorate(block) {
  // Get the original rows container
  const rowsWrapper = block.querySelector(':scope > div');
  if (!rowsWrapper) return;

  const rows = Array.from(rowsWrapper.children);
  if (!rows.length) return;

  // Create the final row container
  const portfolioRow = document.createElement('div');
  portfolioRow.className = 'portfolio row';

  rows.forEach((row) => {
    const cells = Array.from(row.children);
    if (cells.length < 2) return;

    const numberText = cells[0].textContent.trim();
    const labelText = cells[1].textContent.trim();

    // Create tile
    const tile = document.createElement('div');
    tile.className = 'portfolio-tile';

    // Number
    const numberP = document.createElement('p');
    const numberStrong = document.createElement('strong');
    numberStrong.textContent = numberText;
    numberP.appendChild(numberStrong);

    // Label
    const labelH2 = document.createElement('h2');
    const labelStrong = document.createElement('strong');
    labelStrong.textContent = labelText;
    labelH2.appendChild(labelStrong);

    tile.append(numberP, labelH2);
    portfolioRow.appendChild(tile);
  });

  // Replace authored markup with final structure
  block.innerHTML = '';
  block.appendChild(portfolioRow);
}