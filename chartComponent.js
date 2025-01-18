class ChartComponent {
    static create(ticker) {
        const container = document.createElement('div');
        container.className = 'chart-container';
        container.style.width = '600px';
        container.style.height = '400px';
        
        container.innerHTML = `
            <div class="close-button">X</div>
            <div class="resize-handle top-left"></div>
            <div class="resize-handle top-right"></div>
            <div class="resize-handle bottom-left"></div>
            <div class="resize-handle bottom-right"></div>
            <div id="chart_${ticker}" style="width: 100%; height: 100%;"></div>
        `;
        document.body.appendChild(container);

        new TradingView.widget({
            container_id: `chart_${ticker}`,
            symbol: ticker,
            interval: '1',
            theme: 'dark',
            style: '1',
            locale: 'de',
            toolbar_bg: '#1e222d',
            enable_publishing: false,
            withdateranges: true,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            studies: [],
            width: '100%',
            height: '100%'
        });

        WindowManager.addDragAndResizeFunctionality(container);
    }
}
