class BoxComponent {
    static async create(ticker) {
        const container = document.createElement('div');
        container.className = 'draggable';
        container.style.width = '300px';
        container.style.height = '150px';
        
        container.innerHTML = `
            <div class="close-button">X</div>
            <div class="resize-handle top-left"></div>
            <div class="resize-handle top-right"></div>
            <div class="resize-handle bottom-left"></div>
            <div class="resize-handle bottom-right"></div>
            <div class="stock-info">
                <div class="stock-ticker">${ticker}</div>
                <div class="stock-price">Laden...</div>
                <div class="stock-change">Laden...</div>
            </div>
        `;
        document.body.appendChild(container);
        WindowManager.addDragAndResizeFunctionality(container);

        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=IHR_API_KEY`);
            const data = await response.json();

            if (data.c) {
                const priceElement = container.querySelector('.stock-price');
                const changeElement = container.querySelector('.stock-change');
                
                priceElement.textContent = `$${data.c.toFixed(2)}`;
                
                const changePercent = ((data.c - data.pc) / data.pc * 100).toFixed(2);
                const changeClass = changePercent >= 0 ? 'positive-change' : 'negative-change';
                changeElement.textContent = `${changePercent}%`;
                changeElement.className = `stock-change ${changeClass}`;
            }
        } catch (error) {
            container.querySelector('.stock-price').textContent = 'Fehler beim Laden';
            container.querySelector('.stock-change').textContent = 'Nicht verfügbar';
        }
    }
}
