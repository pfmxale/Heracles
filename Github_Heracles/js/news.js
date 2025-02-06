// news.js

/**
 * Erzeugt ein Panel, das aktuelle News von Yahoo Finance (RSS-Feed) anzeigt.
 * ACHTUNG: Kann durch CORS-Blockaden unterbunden werden, 
 * wenn Yahoo das Abrufen per fetch() nicht zulässt.
 */
async function createNews() {
  // Panel wie bei Box oder Chart
  const panel = document.createElement('div');
  panel.className = 'panel';
  // etwas größer, damit mehr Platz für News
  panel.style.width = '500px';
  panel.style.height = '400px';
  panel.dataset.baseWidth = "500";
  panel.dataset.baseHeight = "400";

  const inner = document.createElement('div');
  inner.className = 'panel-inner';
  inner.style.width = '500px';
  inner.style.height = '400px';
  
  // Header
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `<span>News: Yahoo Finance</span>`;

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  closeButton.onclick = () => panel.remove();
  header.appendChild(closeButton);

  // Body
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.innerHTML = `<p>Lade News...</p>`;

  inner.appendChild(header);
  inner.appendChild(body);
  panel.appendChild(inner);

  // Resize-Handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  panel.appendChild(resizeHandle);

  // Panel ins DOM
  document.body.appendChild(panel);

  // Drag & Resize
  addDragAndResize(panel);

  // **RSS-Feed von Yahoo Finance**
  // Beispiel: https://finance.yahoo.com/news/rssindex
  // Kann je nach Rubrik anders sein.
  const feedUrl = 'https://finance.yahoo.com/news/rssindex';

  try {
    // Wir holen das RSS (XML) als reinen Text
    const response = await fetch(feedUrl);
    const rssText = await response.text();

    // Mit DOMParser in ein XML-Dokument parsen
    const parser = new DOMParser();
    const rssXml = parser.parseFromString(rssText, 'application/xml');

    // Alle <item>-Elemente (typischerweise enthalten sie <title>, <link>, <description> etc.)
    const items = rssXml.querySelectorAll('item');
    if (!items.length) {
      body.innerHTML = `<p>Keine News gefunden.</p>`;
      return;
    }

    // Wir bauen eine Liste der Top-N News
    // (z.B. nur die ersten 8 Einträge, damit das Panel nicht zu voll wird)
    let html = `<ul style="margin:0; padding:0; list-style-type:none;">`;
    const maxItems = 8;
    for (let i = 0; i < items.length && i < maxItems; i++) {
      const title = items[i].querySelector('title')?.textContent || 'Ohne Titel';
      const link = items[i].querySelector('link')?.textContent || '#';
      html += `
        <li style="margin-bottom:8px;">
          <a href="${link}" target="_blank" style="color:#FFA500; text-decoration:none;">
            ${title}
          </a>
        </li>`;
    }
    html += `</ul>`;

    body.innerHTML = html;
  } catch (error) {
    body.innerHTML = `<p>Fehler beim Laden der News (CORS?).</p>`;
  }
}
