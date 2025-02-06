// panel.js

/**
 * Fügt einem Panel (div) die Drag- und Resize-Logik hinzu.
 * @param {HTMLElement} panel 
 */
function addDragAndResize(panel) {
  let isDragging = false;
  let offsetX, offsetY;
  const inner = panel.querySelector('.panel-inner');
  
  // Dragging
  inner.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('resize-handle')) return;
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    // Bringe das Panel nach vorn
    panel.style.zIndex = Date.now().toString();
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      panel.style.left = (e.clientX - offsetX) + 'px';
      panel.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  // Resizing
  const resizeHandle = panel.querySelector('.resize-handle');
  let isResizing = false;
  let startWidth, startHeight, startX, startY;
  const baseWidth = parseFloat(panel.dataset.baseWidth);
  const baseHeight = parseFloat(panel.dataset.baseHeight);
  
  resizeHandle.addEventListener('mousedown', function(e) {
    isResizing = true;
    startWidth = panel.offsetWidth;
    startHeight = panel.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;
    e.stopPropagation();
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (isResizing) {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      panel.style.width = newWidth + 'px';
      panel.style.height = newHeight + 'px';

      // Proportionale Skalierung
      const scaleX = newWidth / baseWidth;
      const scaleY = newHeight / baseHeight;
      const scale = Math.min(scaleX, scaleY);
      inner.style.transform = `scale(${scale})`;
    }
  });

  document.addEventListener('mouseup', function() {
    isResizing = false;
  });
}

/**
 * Erzeugt ein (generisches) Panel mit Titel und Inhalt.
 * @param {string} title 
 * @param {string} content Optionaler HTML-Inhalt
 */
function createPanel(title, content = '') {
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
  header.innerHTML = `<span>${title}</span>`;

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  closeButton.onclick = () => panel.remove();
  header.appendChild(closeButton);

  // Body
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.innerHTML = content || `<p>${title} Panel – Funktion nicht implementiert.</p>`;

  // Zusammenbauen
  inner.appendChild(header);
  inner.appendChild(body);
  panel.appendChild(inner);

  // Resize-Handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  panel.appendChild(resizeHandle);

  // Panel ins DOM
  document.body.appendChild(panel);

  // Drag & Resize aktivieren
  addDragAndResize(panel);
}
