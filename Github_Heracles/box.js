// box.js

/**
 * Erzeugt ein Panel mit Basis-Info zu einem Ticker (z.B. Finnhub Quote).
 * @param {string} ticker 
 */
async function createBox(ticker) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.width = '300px';
  panel.style.height = '200px';
  panel.dataset.baseWidth = "300";
  panel.dataset.baseHeight = "200";

  const inner = document.createElement('div');
  inner.className = 'panel-inner';
  inner.style.width = '300px';
  inner.style.height = '200px';

  // Header
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `<span>Box: ${ticker}</span>`;

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  closeButton.onclick = () => panel.remove();
  header.appendChild(closeButton);

  // Body
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.innerHTML = `<p>Laden...</p>`;

  inner.appendChild(header);
  inner.appendChild(body);
  panel.appendChild(inner);

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  panel.appendChild(resizeHandle);

  document.body.appendChild(panel);

  // Drag & Resize
  addDragAndResize(panel);

  // Daten via Finnhub laden
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=DEIN_APITOKEN_HIER`
    );
    const data = await response.json();
    if (data.c) {
      const price = `$${data.c.toFixed(2)}`;
      const diff = data.c - data.pc;
      const changePercent = ((diff / data.pc) * 100).toFixed(2) + '%';
      const changeColor = diff >= 0 ? 'green' : 'red';

      body.innerHTML = `
        <p style="font-size:18px;">${ticker}</p>
        <p style="font-size:16px;">Preis: ${price}</p>
        <p style="font-size:14px; color:${changeColor};">Veränderung: ${changePercent}</p>
      `;
    } else {
      body.innerHTML = `<p>Keine Daten verfügbar.</p>`;
    }
  } catch (error) {
    body.innerHTML = `<p>Fehler beim Laden der Daten.</p>`;
  }
}
