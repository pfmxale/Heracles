// chart.js

/**
 * Erzeugt ein Panel mit TradingView-Chart für einen gegebenen Ticker.
 * @param {string} ticker 
 */
function createChart(ticker) {
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
  header.innerHTML = `<span>Chart: ${ticker}</span>`;

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  closeButton.onclick = () => panel.remove();
  header.appendChild(closeButton);

  // Body mit Chart-Div
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.style.padding = '0';
  
  const chartDiv = document.createElement('div');
  const chartId = 'chart_' + ticker + '_' + Date.now();
  chartDiv.id = chartId;
  chartDiv.style.width = '100%';
  chartDiv.style.height = '100%';

  body.appendChild(chartDiv);
  inner.appendChild(header);
  inner.appendChild(body);
  panel.appendChild(inner);

  // Resize-Handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  panel.appendChild(resizeHandle);

  document.body.appendChild(panel);

  // Standardfunktion aus panel.js
  addDragAndResize(panel);

  // TradingView-Widget
  new TradingView.widget({
    container_id: chartId,
    symbol: ticker,
    interval: '1',
    theme: 'dark',
    style: '1',
    locale: 'de',
    toolbar_bg: '#000',
    enable_publishing: false,
    hide_top_toolbar: true,
    withdateranges: true,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    studies: []
  });
}
