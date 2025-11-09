/**
 * Mobile Helper for Capacitor Integration
 * Provides native features for IslamHub mobile app
 */

class MobileHelper {
    constructor() {
        this.isNative = false;
        this.capacitor = null;
        this.init();
    }

    async init() {
        // Check if running in Capacitor
        if (window.Capacitor) {
            this.isNative = true;
            this.capacitor = window.Capacitor;
            await this.setupNativeFeatures();
        }
    }

    async setupNativeFeatures() {
        try {
            // Setup Status Bar
            if (this.capacitor.Plugins.StatusBar) {
                await this.capacitor.Plugins.StatusBar.setStyle({ style: 'DARK' });
                await this.capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#0a0e27' });
            }

            // Setup Splash Screen
            if (this.capacitor.Plugins.SplashScreen) {
                setTimeout(async () => {
                    await this.capacitor.Plugins.SplashScreen.hide();
                }, 2000);
            }

            // Setup Network Listener
            if (this.capacitor.Plugins.Network) {
                this.capacitor.Plugins.Network.addListener('networkStatusChange', status => {
                    console.log('Network status changed', status);
                    if (window.islamHub) {
                        window.islamHub.handleNetworkChange(status.connected);
                    }
                });
            }

            // Setup App State Listener
            if (this.capacitor.Plugins.App) {
                this.capacitor.Plugins.App.addListener('appStateChange', ({ isActive }) => {
                    console.log('App state changed. Is active?', isActive);
                    if (isActive && window.islamHub) {
                        // Refresh prayer times when app becomes active
                        if (window.islamHub.adzanApp) {
                            window.islamHub.adzanApp.updatePrayerTimes();
                        }
                    }
                });
            }

        } catch (error) {
            console.error('Error setting up native features:', error);
        }
    }

    // Schedule Adzan Notification
    async scheduleAdzanNotification(prayerName, time) {
        if (!this.isNative || !this.capacitor.Plugins.LocalNotifications) {
            return false;
        }

        try {
            const notifTime = new Date(time);
            const id = this.getPrayerNotificationId(prayerName);

            await this.capacitor.Plugins.LocalNotifications.schedule({
                notifications: [
                    {
                        id: id,
                        title: `Waktu ${prayerName}`,
                        body: `Sudah masuk waktu sholat ${prayerName}`,
                        schedule: { at: notifTime },
                        sound: 'adzan.mp3',
                        channelId: 'adzan-channel',
                        extra: {
                            prayerName: prayerName
                        }
                    }
                ]
            });

            console.log(`Scheduled ${prayerName} notification for ${notifTime}`);
            return true;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return false;
        }
    }

    // Cancel specific notification
    async cancelNotification(prayerName) {
        if (!this.isNative || !this.capacitor.Plugins.LocalNotifications) {
            return false;
        }

        try {
            const id = this.getPrayerNotificationId(prayerName);
            await this.capacitor.Plugins.LocalNotifications.cancel({ notifications: [{ id }] });
            return true;
        } catch (error) {
            console.error('Error canceling notification:', error);
            return false;
        }
    }

    // Cancel all notifications
    async cancelAllNotifications() {
        if (!this.isNative || !this.capacitor.Plugins.LocalNotifications) {
            return false;
        }

        try {
            const pending = await this.capacitor.Plugins.LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await this.capacitor.Plugins.LocalNotifications.cancel({ 
                    notifications: pending.notifications 
                });
            }
            return true;
        } catch (error) {
            console.error('Error canceling all notifications:', error);
            return false;
        }
    }

    // Get notification ID for prayer
    getPrayerNotificationId(prayerName) {
        const ids = {
            'Subuh': 1,
            'Dzuhur': 2,
            'Ashar': 3,
            'Maghrib': 4,
            'Isya': 5
        };
        return ids[prayerName] || 0;
    }

    // Request notification permission
    async requestNotificationPermission() {
        if (!this.isNative || !this.capacitor.Plugins.LocalNotifications) {
            return false;
        }

        try {
            const result = await this.capacitor.Plugins.LocalNotifications.requestPermissions();
            return result.display === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Check notification permission
    async checkNotificationPermission() {
        if (!this.isNative || !this.capacitor.Plugins.LocalNotifications) {
            return false;
        }

        try {
            const result = await this.capacitor.Plugins.LocalNotifications.checkPermissions();
            return result.display === 'granted';
        } catch (error) {
            console.error('Error checking notification permission:', error);
            return false;
        }
    }

    // Share content
    async share(title, text, url) {
        if (!this.isNative || !this.capacitor.Plugins.Share) {
            // Fallback to Web Share API
            if (navigator.share) {
                try {
                    await navigator.share({ title, text, url });
                    return true;
                } catch (error) {
                    console.error('Error sharing:', error);
                    return false;
                }
            }
            return false;
        }

        try {
            await this.capacitor.Plugins.Share.share({
                title: title,
                text: text,
                url: url,
                dialogTitle: 'Bagikan IslamHub'
            });
            return true;
        } catch (error) {
            console.error('Error sharing:', error);
            return false;
        }
    }

    // Haptic feedback
    async haptic(type = 'light') {
        if (!this.isNative || !this.capacitor.Plugins.Haptics) {
            return false;
        }

        try {
            const impactStyles = {
                'light': 'LIGHT',
                'medium': 'MEDIUM',
                'heavy': 'HEAVY'
            };

            await this.capacitor.Plugins.Haptics.impact({ 
                style: impactStyles[type] || 'LIGHT' 
            });
            return true;
        } catch (error) {
            console.error('Error haptic feedback:', error);
            return false;
        }
    }

    // Get network status
    async getNetworkStatus() {
        if (!this.isNative || !this.capacitor.Plugins.Network) {
            return { connected: navigator.onLine };
        }

        try {
            const status = await this.capacitor.Plugins.Network.getStatus();
            return status;
        } catch (error) {
            console.error('Error getting network status:', error);
            return { connected: navigator.onLine };
        }
    }

    // Keep screen awake (for Qibla compass)
    async keepAwake() {
        if (!this.isNative || !this.capacitor.Plugins.KeepAwake) {
            return false;
        }

        try {
            await this.capacitor.Plugins.KeepAwake.keepAwake();
            return true;
        } catch (error) {
            console.error('Error keeping awake:', error);
            return false;
        }
    }

    // Allow screen to sleep
    async allowSleep() {
        if (!this.isNative || !this.capacitor.Plugins.KeepAwake) {
            return false;
        }

        try {
            await this.capacitor.Plugins.KeepAwake.allowSleep();
            return true;
        } catch (error) {
            console.error('Error allowing sleep:', error);
            return false;
        }
    }

    // Get app info
    async getAppInfo() {
        if (!this.isNative || !this.capacitor.Plugins.App) {
            return {
                name: 'IslamHub',
                version: '1.0.0',
                build: '1'
            };
        }

        try {
            const info = await this.capacitor.Plugins.App.getInfo();
            return info;
        } catch (error) {
            console.error('Error getting app info:', error);
            return {
                name: 'IslamHub',
                version: '1.0.0',
                build: '1'
            };
        }
    }

    // Exit app (Android only)
    async exitApp() {
        if (!this.isNative || !this.capacitor.Plugins.App) {
            return false;
        }

        try {
            await this.capacitor.Plugins.App.exitApp();
            return true;
        } catch (error) {
            console.error('Error exiting app:', error);
            return false;
        }
    }
}

// Initialize mobile helper globally
window.mobileHelper = new MobileHelper();
