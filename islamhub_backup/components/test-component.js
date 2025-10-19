/**
 * Test Component - Simple test untuk debugging
 */

export default class TestComponent {
    constructor({ container, eventBus, sharedData, storageManager }) {
        this.container = container;
        this.eventBus = eventBus;
        this.sharedData = sharedData;
        this.storageManager = storageManager;
    }

    async init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <h2>✅ Test Component Berhasil Dimuat!</h2>
                <p>Jika Anda melihat pesan ini, berarti system loading component berfungsi dengan baik.</p>
                <div style="margin: 2rem 0;">
                    <div style="background: var(--gradient-primary); 
                                width: 80px; height: 80px; 
                                border-radius: 50%; 
                                margin: 0 auto; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center;">
                        <i class="fas fa-check" style="color: var(--dark-bg); font-size: 2rem;"></i>
                    </div>
                </div>
                <p style="color: var(--text-secondary);">
                    Komponen lainnya mungkin membutuhkan file eksternal atau dependensi tertentu.
                </p>
            </div>
        `;
    }
}