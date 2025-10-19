/**
 * Sirah Component - Wrapper for Sirah Nabi & Sahabat App
 */
export default class SirahComponent {
    constructor({ container, eventBus, sharedData, storageManager }) {
        this.container = container;
        this.eventBus = eventBus;
        this.sharedData = sharedData;
        this.storageManager = storageManager;
        this.iframe = null;
    }

    async init() {
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="component-wrapper sirah-wrapper">
                <iframe 
                    class="component-iframe"
                    src="../sirah_nabi/index.html"
                    title="Sirah Nabi & Sahabat"
                    loading="lazy"
                ></iframe>
            </div>
        `;
        
        this.iframe = this.container.querySelector('iframe');
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'iframe-loading-overlay';
        loadingDiv.innerHTML = `
            <div class="component-loading">
                <div class="loading-spinner small">
                    <div class="spinner-ring"></div>
                </div>
                <p>Memuat Sirah Nabi & Sahabat...</p>
            </div>
        `;
        
        this.container.querySelector('.sirah-wrapper').appendChild(loadingDiv);
        
        // Remove loading when iframe loads
        this.iframe.addEventListener('load', () => {
            setTimeout(() => {
                loadingDiv.style.opacity = '0';
                setTimeout(() => loadingDiv.remove(), 300);
            }, 500);
        });
    }

    destroy() {
        if (this.iframe) {
            this.iframe.src = 'about:blank';
        }
    }
}
