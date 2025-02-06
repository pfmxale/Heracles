// main.js

// Liest den Ticker aus dem Input-Feld und erzeugt ein Chart
function createChartFromInput() {
  const ticker = document.getElementById('tickerInput').value.trim().toUpperCase();
  if (ticker) {
    createChart(ticker);
  }
}

// Liest den Ticker aus dem Input-Feld und erzeugt eine Box
function createBoxFromInput() {
  const ticker = document.getElementById('tickerInput').value.trim().toUpperCase();
  if (ticker) {
    createBox(ticker);
  }
}

// Standard-Event: Enter im Ticker-Feld -> Box
document.getElementById('tickerInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    createBoxFromInput();
    document.getElementById('tickerInput').value = '';
  }
});

// Weitere globale Aktionen könntest du ebenfalls hier ablegen,
// oder direkt über onClick im HTML auf createPanel(...) verweisen.
