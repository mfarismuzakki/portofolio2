// Cache Manager untuk Sirah Nabi App
// Sistem cache yang efisien untuk database besar dengan localStorage

class SirahCacheManager {
    constructor() {
        this.cacheVersion = '1.0.0';
        this.cachePrefix = 'sirah_';
        this.maxCacheAge = 10 * 60 * 1000; // 10 menit
        this.compressionEnabled = true;
        
        // Daftar semua file database
        this.dataFiles = {
            // Nabi dan Rasul
            'nabi_part1': './data/nabi-part1.js',
            'nabi_part2': './data/nabi-part2.js', 
            'nabi_part3': './data/nabi-part3.js',
            'nabi_part4': './data/nabi-part4.js',
            'nabi_part5': './data/nabi-part5.js',
            'nabi_disputed': './data/nabi-disputed.js',
            
            // Sahabat
            'sahabat_khulafa': './data/sahabat-khulafa.js',
            'sahabat_asharah': './data/sahabat-asharah.js',
            'sahabat_muhajirin_anshar': './data/sahabat-muhajirin-anshar.js',
            'sahabiyat': './data/sahabiyat.js',
            'sahabat_terkenal': './data/sahabat-terkenal.js'
        };
        
        // Status cache untuk setiap file
        this.cacheStatus = {};
        
        this.initializeCache();
    }
    
    // Inisialisasi cache system
    initializeCache() {
        try {
            // Cek versi cache, reset jika berbeda
            const cachedVersion = localStorage.getItem(this.cachePrefix + 'version');
            if (cachedVersion !== this.cacheVersion) {
                this.clearAllCache();
                localStorage.setItem(this.cachePrefix + 'version', this.cacheVersion);
            }
            
            // Load status cache
            this.loadCacheStatus();
            
        } catch (error) {
            console.error('Error initializing cache:', error);
        }
    }
    
    // Load status cache dari localStorage
    loadCacheStatus() {
        try {
            const status = localStorage.getItem(this.cachePrefix + 'status');
            this.cacheStatus = status ? JSON.parse(status) : {};
        } catch (error) {
            console.error('Error loading cache status:', error);
            this.cacheStatus = {};
        }
    }
    
    // Simpan status cache ke localStorage
    saveCacheStatus() {
        try {
            localStorage.setItem(this.cachePrefix + 'status', JSON.stringify(this.cacheStatus));
        } catch (error) {
            console.error('Error saving cache status:', error);
        }
    }
    
    // Cek apakah data sudah di cache dan masih valid
    isCached(key) {
        const cacheKey = this.cachePrefix + key;
        const statusKey = key;
        
        // Cek apakah ada di localStorage
        if (!localStorage.getItem(cacheKey)) {
            return false;
        }
        
        // Cek apakah masih dalam batas waktu
        if (this.cacheStatus[statusKey]) {
            const cacheTime = this.cacheStatus[statusKey].timestamp;
            const now = Date.now();
            
            if (now - cacheTime > this.maxCacheAge) {
                // Cache expired, hapus
                this.removeFromCache(key);
                return false;
            }
            
            return true;
        }
        
        return false;
    }
    
    // Simpan data ke cache
    saveToCache(key, data) {
        try {
            const cacheKey = this.cachePrefix + key;
            let dataToStore = data;
            
            // Kompresi sederhana (stringify)
            if (this.compressionEnabled) {
                dataToStore = JSON.stringify(data);
            }
            
            // Simpan ke localStorage
            localStorage.setItem(cacheKey, dataToStore);
            
            // Update status
            this.cacheStatus[key] = {
                timestamp: Date.now(),
                size: dataToStore.length,
                compressed: this.compressionEnabled
            };
            
            this.saveCacheStatus();
            
            
            return true;
        } catch (error) {
            console.error(`Error caching ${key}:`, error);
            return false;
        }
    }
    
    // Ambil data dari cache
    getFromCache(key) {
        try {
            const cacheKey = this.cachePrefix + key;
            let data = localStorage.getItem(cacheKey);
            
            if (!data) {
                return null;
            }
            
            // Decompress jika perlu
            if (this.compressionEnabled && this.cacheStatus[key]?.compressed) {
                data = JSON.parse(data);
            }
            
            return data;
        } catch (error) {
            console.error(`Error getting ${key} from cache:`, error);
            return null;
        }
    }
    
    // Hapus item dari cache
    removeFromCache(key) {
        try {
            const cacheKey = this.cachePrefix + key;
            localStorage.removeItem(cacheKey);
            
            if (this.cacheStatus[key]) {
                delete this.cacheStatus[key];
                this.saveCacheStatus();
            }
            
        } catch (error) {
            console.error(`Error removing ${key} from cache:`, error);
        }
    }
    
    // Bersihkan semua cache
    clearAllCache() {
        try {
            // Hapus semua item dengan prefix
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.cachePrefix)) {
                    localStorage.removeItem(key);
                }
            });
            
            this.cacheStatus = {};
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
    
    // Load data dengan cache
    async loadData(key) {
        // Cek cache dulu
        if (this.isCached(key)) {
            return this.getFromCache(key);
        }
        
        // Jika tidak ada di cache, load dari file
        const filePath = this.dataFiles[key];
        if (!filePath) {
            throw new Error(`Data file not found for key: ${key}`);
        }
        
        try {
            
            // Load script dan ambil data dari window
            const data = await this.loadScriptAndExtractData(key, filePath);
            
            // Simpan ke cache
            this.saveToCache(key, data);
            
            return data;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            
            // Fallback: coba load script secara dinamis
            return this.loadDataFallback(key, filePath);
        }
    }
    
    // Fallback method untuk load data
    async loadDataFallback(key, filePath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = filePath;
            script.onload = () => {
                try {
                    let data;
                    
                    // Ambil data berdasarkan key
                    switch (key) {
                        case 'nabi_part1':
                            data = window.nabiPart1 || [];
                            break;
                        case 'nabi_part2':
                            data = window.nabiPart2 || [];
                            break;
                        case 'nabi_part3':
                            data = window.nabiPart3 || [];
                            break;
                        case 'nabi_part4':
                            data = window.nabiPart4 || [];
                            break;
                        case 'nabi_part5':
                            data = window.nabiPart5 || [];
                            break;
                        case 'nabi_disputed':
                            data = window.nabiDisputed || [];
                            break;
                        case 'sahabat_khulafa':
                            data = window.sahabatKhulafa || [];
                            break;
                        case 'sahabat_asharah':
                            data = window.sahabatAsharah || [];
                            break;
                        case 'sahabat_muhajirin_anshar':
                            data = window.sahabatMuhajirinAnshar || [];
                            break;
                        case 'sahabiyat':
                            data = window.sahabiyat || [];
                            break;
                        default:
                            data = [];
                    }
                    
                    // Simpan ke cache
                    this.saveToCache(key, data);
                    
                    // Hapus script setelah load
                    document.head.removeChild(script);
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            
            script.onerror = () => {
                document.head.removeChild(script);
                reject(new Error(`Failed to load ${filePath}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Extract data dari konten file JavaScript
    // Load script dan extract data dari window variable
    async loadScriptAndExtractData(key, filePath) {
        return new Promise((resolve, reject) => {
            // Cek apakah script sudah pernah dimuat
            const existingScript = document.querySelector(`script[src="${filePath}"]`);
            if (existingScript) {
                // Jika sudah dimuat, ambil data langsung dari window
                const data = this.getWindowData(key);
                resolve(data || []);
                return;
            }

            const script = document.createElement('script');
            script.src = filePath;
            script.onload = () => {
                try {
                    const data = this.getWindowData(key);
                    resolve(data || []);
                } catch (error) {
                    console.error(`Error getting data for ${key}:`, error);
                    resolve([]);
                }
            };
            script.onerror = (error) => {
                console.error(`Error loading script ${filePath}:`, error);
                reject(error);
            };
            
            document.head.appendChild(script);
        });
    }

    // Ambil data dari window berdasarkan key
    getWindowData(key) {
        switch (key) {
            case 'nabi_part1':
                return window.nabiPart1 || [];
            case 'nabi_part2':
                return window.nabiPart2 || [];
            case 'nabi_part3':
                return window.nabiPart3 || [];
            case 'nabi_part4':
                return window.nabiPart4 || [];
            case 'nabi_part5':
                return window.nabiPart5 || [];
            case 'nabi_disputed':
                return window.nabiDisputed || [];
            case 'sahabat_khulafa':
                return window.sahabatKhulafa || [];
            case 'sahabat_asharah':
                return window.sahabatAsharah || [];
            case 'sahabat_muhajirin_anshar':
                return window.sahabatMuhajirinAnshar || [];
            case 'sahabiyat':
                return window.sahabiyat || [];
            default:
                return [];
        }
    }

    extractDataFromJS(content, key) {
        try {
            // Hapus komentar dan export
            let cleanContent = content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Hapus /* */ comments
                .replace(/\/\/.*$/gm, '') // Hapus // comments
                .replace(/if\s*\(\s*typeof\s+module[\s\S]*?}[\s\S]*?$/, ''); // Hapus module.exports
            
            // Extract array data
            const arrayMatch = cleanContent.match(/const\s+\w+\s*=\s*(\[[\s\S]*?\]);/);
            if (arrayMatch) {
                // Evaluate array secara aman
                const arrayString = arrayMatch[1];
                return JSON.parse(arrayString);
            }
            
            return [];
        } catch (error) {
            console.error('Error extracting data:', error);
            return [];
        }
    }
    
    // Load beberapa data sekaligus
    async loadMultipleData(keys) {
        const promises = keys.map(key => this.loadData(key));
        const results = await Promise.all(promises);
        
        const data = {};
        keys.forEach((key, index) => {
            data[key] = results[index];
        });
        
        return data;
    }
    
    // Pre-load data untuk performa
    async preloadEssentialData() {
        const essentialKeys = ['nabi_part1', 'sahabat_khulafa', 'sahabiyat'];
        
        
        try {
            await this.loadMultipleData(essentialKeys);
        } catch (error) {
            console.error('Error pre-loading data:', error);
        }
    }

    // Pre-load SEMUA data untuk pengalaman yang lebih baik
    async preloadAllData() {
        const allKeys = [
            'nabi_part1', 'nabi_part2', 'nabi_part3', 'nabi_part4', 'nabi_part5', 'nabi_disputed',
            'sahabat_khulafa', 'sahabat_asharah', 'sahabat_muhajirin_anshar', 'sahabiyat'
        ];
        
        
        try {
            await this.loadMultipleData(allKeys);
        } catch (error) {
            console.error('Error pre-loading all data:', error);
        }
    }
    
    // Dapatkan info cache
    getCacheInfo() {
        const info = {
            version: this.cacheVersion,
            totalItems: Object.keys(this.cacheStatus).length,
            totalSize: 0,
            items: {}
        };
        
        Object.entries(this.cacheStatus).forEach(([key, status]) => {
            info.totalSize += status.size;
            info.items[key] = {
                size: this.formatBytes(status.size),
                age: this.formatAge(Date.now() - status.timestamp),
                compressed: status.compressed
            };
        });
        
        info.totalSizeFormatted = this.formatBytes(info.totalSize);
        
        return info;
    }
    
    // Format ukuran file
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Format umur cache
    formatAge(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}

// Export untuk digunakan
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SirahCacheManager;
}

// Auto-initialize jika di browser
if (typeof window !== 'undefined') {
    window.SirahCacheManager = SirahCacheManager;
}