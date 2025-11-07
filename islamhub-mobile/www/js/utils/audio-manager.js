/**
 * Audio Manager - Handle audio download and caching
 * Download audio files on-demand from remote server
 */

class AudioManager {
    constructor() {
        this.baseUrl = 'https://mfarismuzakki.id/islamhub';
        this.cachePrefix = 'islamhub_audio_';
        this.downloadQueue = new Map();
        this.downloadedFiles = new Set();
        this.initializeCache();
    }

    async initializeCache() {
        // Load list of downloaded files from localStorage
        try {
            const cached = localStorage.getItem('islamhub_downloaded_audio');
            if (cached) {
                this.downloadedFiles = new Set(JSON.parse(cached));
            }
        } catch (error) {
            console.error('Failed to load audio cache:', error);
        }
    }

    /**
     * Get audio URL - returns local blob URL if cached, or remote URL
     * @param {string} audioPath - Relative path like "assets/audio/dzikir/dzikir_pagi_001.mp3"
     * @returns {Promise<string>} - Audio URL (blob or remote)
     */
    async getAudioUrl(audioPath) {
        if (!audioPath) return null;

        // Check if already downloaded
        const cacheKey = this._getCacheKey(audioPath);
        
        // Try to get from blob cache first (faster)
        const cachedBlob = await this._getFromBlobCache(cacheKey);
        if (cachedBlob) {
            console.log('[AudioManager] Using cached audio:', audioPath);
            return URL.createObjectURL(cachedBlob);
        }

        // Return remote URL (will download in background)
        const remoteUrl = `${this.baseUrl}/${audioPath}`;
        console.log('[AudioManager] Using remote audio:', remoteUrl);
        
        // Start background download for next time
        this._downloadInBackground(audioPath, cacheKey);
        
        return remoteUrl;
    }

    /**
     * Download and cache audio file
     * @param {string} audioPath - Relative path
     * @returns {Promise<string>} - Blob URL of downloaded audio
     */
    async downloadAudio(audioPath) {
        if (!audioPath) return null;

        const cacheKey = this._getCacheKey(audioPath);
        
        // Check if already downloading
        if (this.downloadQueue.has(cacheKey)) {
            return await this.downloadQueue.get(cacheKey);
        }

        // Check if already cached
        const cachedBlob = await this._getFromBlobCache(cacheKey);
        if (cachedBlob) {
            return URL.createObjectURL(cachedBlob);
        }

        // Start download
        const downloadPromise = this._performDownload(audioPath, cacheKey);
        this.downloadQueue.set(cacheKey, downloadPromise);

        try {
            const blobUrl = await downloadPromise;
            this.downloadQueue.delete(cacheKey);
            return blobUrl;
        } catch (error) {
            this.downloadQueue.delete(cacheKey);
            throw error;
        }
    }

    async _performDownload(audioPath, cacheKey) {
        const remoteUrl = `${this.baseUrl}/${audioPath}`;
        
        try {
            console.log('[AudioManager] Downloading:', remoteUrl);
            
            const response = await fetch(remoteUrl);
            if (!response.ok) {
                throw new Error(`Failed to download: ${response.statusText}`);
            }

            const blob = await response.blob();
            
            // Store in IndexedDB (persistent storage)
            await this._saveToBlobCache(cacheKey, blob);
            
            // Mark as downloaded
            this.downloadedFiles.add(audioPath);
            this._saveDownloadedList();
            
            console.log('[AudioManager] Downloaded successfully:', audioPath);
            
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('[AudioManager] Download failed:', error);
            throw error;
        }
    }

    async _downloadInBackground(audioPath, cacheKey) {
        try {
            // Check if already downloaded
            if (this.downloadedFiles.has(audioPath)) {
                return;
            }
            
            // Don't download if already in queue
            if (this.downloadQueue.has(cacheKey)) {
                return;
            }

            await this.downloadAudio(audioPath);
        } catch (error) {
            // Silently fail background downloads
            console.warn('[AudioManager] Background download failed:', error);
        }
    }

    async _getFromBlobCache(key) {
        try {
            const db = await this._openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['audio'], 'readonly');
                const store = transaction.objectStore('audio');
                const request = store.get(key);
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('[AudioManager] Failed to read from cache:', error);
            return null;
        }
    }

    async _saveToBlobCache(key, blob) {
        try {
            const db = await this._openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['audio'], 'readwrite');
                const store = transaction.objectStore('audio');
                const request = store.put(blob, key);
                
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('[AudioManager] Failed to save to cache:', error);
        }
    }

    async _openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('IslamHubAudioCache', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('audio')) {
                    db.createObjectStore('audio');
                }
            };
        });
    }

    _getCacheKey(audioPath) {
        return this.cachePrefix + audioPath.replace(/[^a-zA-Z0-9]/g, '_');
    }

    _saveDownloadedList() {
        try {
            localStorage.setItem(
                'islamhub_downloaded_audio',
                JSON.stringify(Array.from(this.downloadedFiles))
            );
        } catch (error) {
            console.error('[AudioManager] Failed to save downloaded list:', error);
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} - Cache stats
     */
    getStats() {
        return {
            downloadedCount: this.downloadedFiles.size,
            queueSize: this.downloadQueue.size
        };
    }

    /**
     * Clear all cached audio
     */
    async clearCache() {
        try {
            const db = await this._openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['audio'], 'readwrite');
                const store = transaction.objectStore('audio');
                const request = store.clear();
                
                request.onsuccess = () => {
                    this.downloadedFiles.clear();
                    this._saveDownloadedList();
                    console.log('[AudioManager] Cache cleared');
                    resolve();
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('[AudioManager] Failed to clear cache:', error);
        }
    }
}

// Export singleton instance
const audioManager = new AudioManager();
export default audioManager;
