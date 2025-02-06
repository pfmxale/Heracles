// news.js

// Hier dein API-Key rein (Achtung: für Demo reicht's,
// in Produktion sollte man den Key nicht offen legen)
const NEWS_API_KEY = 'DEIN_KEY_HIER';

// createNews() wird aufgerufen, wenn du auf den "News" Button klickst.
async function createNews() {
  // 1) Panel erstellen
  const panel = document.createElement('div');
  panel.className = 'panel';
  // etwas größere Standardmaße
  panel.style.width = '600px';
  panel.style.height = '400px';
  panel.dataset.baseWidth = "600";
  panel.dataset.baseHeight = "400";

  const inner = document.createElement('div');
  inner.className = 'panel-inner';
  inner.style.width = '600px';
  inner.style.height = '400px';

  // 2) Header
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `<span>News (NewsAPI)</span>`;

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  closeButton.onclick = () => panel.remove();
  header.appendChild(closeButton);

  // 3) Body (dort schreiben wir später unsere Headlines rein)
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.innerHTML = `<p>Lade News...</p>`;

  inner.appendChild(header);
  inner.appendChild(body);
  panel.appendChild(inner);

  // 4) Resize-Handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  panel.appendChild(resizeHandle);

  // 5) Panel ins DOM einfügen
  document.body.appendChild(panel);

  // 6) Drag & Resize aktivieren (aus panel.js)
  addDragAndResize(panel);

  // 7) News via NewsAPI abrufen
  // Beispiel: Top-Headlines in den USA, Sprache Englisch
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // 8) Checken, ob wir validen Status haben
    if (data.status !== 'ok' || !data.articles) {
      body.innerHTML = '<p>Fehler oder keine Daten.</p>';
      return;
    }

    // 9) Headlines ausgeben
    let html = '<ul style="list-style:none; padding:0;">';
    data.articles.forEach(article => {
      // title, url
      const title = article.title || 'Ohne Titel';
      const link = article.url || '#';

      html += `
        <li style="margin-bottom: 8px;">
          <a href="${link}" target="_blank" style="color: #FFA500; text-decoration: none;">
            ${title}
          </a>
        </li>
      `;
    });
    html += '</ul>';

    body.innerHTML = html;

  } catch (error) {
    console.error('Fehler beim Laden der News:', error);
    body.innerHTML = `<p>Fehler beim Laden: ${error.message}</p>`;
  }
}
