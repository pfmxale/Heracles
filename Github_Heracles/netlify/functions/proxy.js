// netlify/functions/proxy.js

// 1. Netlify Functions brauchen diesen Handler-Export
exports.handler = async (event, context) => {
  // a) URL aus Query Param lesen, z. B. /?url=FEED_URL
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      body: 'Fehler: Keine URL angegeben (?url=...)',
    };
  }

  try {
    // b) Holen der externen Ressource (RSS-Feed)
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Fehler beim Abrufen: ${response.statusText}`,
      };
    }
    const text = await response.text();

    // c) Proxy-Antwort mit CORS-Header
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',           // <-- Wichtig
        'Content-Type': 'application/xml; charset=utf-8',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Serverfehler: ${err.message}`,
    };
  }
};
