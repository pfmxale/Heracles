// news.js (Beispiel)

async function createNewsFromTwitterAccounts() {
  // Erzeuge Panel wie gehabt
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.width = '600px';
  panel.style.height = '400px';
  panel.dataset.baseWidth = "600";
  panel.dataset.baseHeight = "400";

  const inner = document.createElement('div');
  inner.className = 'panel-inner';
  inner.style.width = '600px';
  inner.style.height = '400px';

  // Header
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `<span>X-Accounts News</span>`;
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  closeButton.onclick = () => panel.remove();
  header.appendChild(closeButton);

  // Body
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.innerHTML = `<p>Lade Tweets...</p>`;

  inner.appendChild(header);
  inner.appendChild(body);
  panel.appendChild(inner);

  // Resize-Handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  panel.appendChild(resizeHandle);

  // ins DOM
  document.body.appendChild(panel);
  addDragAndResize(panel);

  // **X(Twitter)-RSS-Quellen** via twitrss.me
  const feeds = [
    'https://twitrss.me/twitter_user_to_rss/?user=RadarHits',
    'https://twitrss.me/twitter_user_to_rss/?user=faststocknewss',
    'https://twitrss.me/twitter_user_to_rss/?user=WatcherGuru'
  ];

  // Proxy, z. B. AllOrigins
  // (Wenn es nicht erreichbar ist, probiere corsproxy.io oder eigenen Proxy)
  function toProxyUrl(feedUrl) {
    return 'https://api.allorigins.win/get?url=' + encodeURIComponent(feedUrl);
  }

  try {
    // 1) Alle Feeds parallel laden
    const fetchPromises = feeds.map(url => fetch(toProxyUrl(url)).then(resp => resp.json()));
    const results = await Promise.all(fetchPromises);

    // 2) results[] enthält { contents: '...rss xml...' }
    // Wir parsen jedes RSS
    let allItems = [];
    for (let r of results) {
      const rssText = r.contents;
      const parser = new DOMParser();
      const rssXml = parser.parseFromString(rssText, 'application/xml');
      const items = [...rssXml.querySelectorAll('item')];
      
      // Items in allItems pushen
      // Mit map kannst du dir Title, Link, Datum etc. rausholen
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent || 'Ohne Titel';
        const link = item.querySelector('link')?.textContent || '#';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        // Speichere in allItems
        allItems.push({ title, link, pubDate });
      });
    }

    // 3) Gesamte Liste sortieren nach Datum (optional)
    // pubDate kann man z. B. mit Date.parse() in Unix-Zeit umwandeln
    allItems.sort((a, b) => {
      // neueste zuerst => b - a
      return Date.parse(b.pubDate) - Date.parse(a.pubDate);
    });

    // 4) Beschränke auf x Einträge
    // z.B. 15 Gesamt
    allItems = allItems.slice(0, 15);

    // 5) HTML-Liste bauen
    let html = '<ul style="margin:0; padding:0; list-style:none;">';
    allItems.forEach(item => {
      html += `
      <li style="margin-bottom:8px;">
        <a href="${item.link}" target="_blank" style="color:#FFA500; text-decoration:none;">
          ${item.title}
        </a>
        <br/>
        <small>${item.pubDate}</small>
      </li>
      `;
    });
    html += '</ul>';

    body.innerHTML = html;
    
  } catch (err) {
    console.error(err);
    body.innerHTML = `<p>Fehler beim Laden der Tweets.<br>${err.message}</p>`;
  }
}
