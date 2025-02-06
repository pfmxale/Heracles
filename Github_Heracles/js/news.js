// news.js

/**
 * Erzeugt ein Panel, das aktuelle BBC-News anzeigt (RSS).
 * Nutzt allorigins-Proxy, um CORS-Fehler zu vermeiden.
 */
async function createNews() {
  // 1) Panel erstellen (wie bei Box/Chart)
  const panel = document.createElement('div');
  panel.className = 'panel';
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
  header.innerHTML = `<span>News: BBC</span>`;

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

  // Drag & Resize-Funktion (aus panel.js)
  addDragAndResize(panel);

  // 2) BBC-Feed-URL und Proxy
  const originalFeedUrl = 'https://feeds.bbci.co.uk/news/rss.xml';
  const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(originalFeedUrl);

  try {
    // 3) Via Proxy anfragen, um CORS zu umgehen
    const response = await fetch(proxyUrl);
    const data = await response.json();
    // "contents" enthält den eigentlichen RSS-Text
    const rssText = data.contents;

    // 4) RSS-Text parsen
    const parser = new DOMParser();
    const rssXml = parser.parseFromString(rssText, 'application/xml');

    // 5) <item>-Elemente (Titel, Link usw.)
    const items = rssXml.querySelectorAll('item');
    if (!items.length) {
      body.innerHTML = `<p>Keine News gefunden.</p>`;
      return;
    }

    // 6) Eine Liste bauen (z.B. die ersten 8 Einträge)
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
    body.innerHTML = `<p>Fehler beim Laden der News (CORS?).<br>${error.message}</p>`;
  }
}
