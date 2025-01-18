document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tickerInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const ticker = this.value.trim().toUpperCase();
            const selection = document.getElementById('selection').value;

            if (!ticker) {
                alert('Bitte einen gültigen Ticker eingeben.');
                return;
            }

            if (selection === 'chart') {
                ChartComponent.create(ticker);
            } else if (selection === 'box') {
                BoxComponent.create(ticker);
            }
        }
    });
});
