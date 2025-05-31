import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../firebase-config";
import { authApis, endpoints } from "../configs/Apis";
import cookie from "react-cookies";

// Replace this with your actual VAPID key from Firebase Console
const VAPID_KEY = "BHfe8ORebbXnALTw0uhesGufW_a9cXBYlqDrG_Ajjj-scl2NFpZgXeUVwSmLSlWAZnhill8heB0hnKskZ0f5vmE"; // TODO: Replace with your actual VAPID key

class NotificationService {
    constructor() {
        this.messaging = null;
        this.initializeMessaging();
    }

    async initializeMessaging() {
        try {
            // Check if token exists
            const token = cookie.load('token');
            if (!token) {
                console.error("No authentication token found");
                return;
            }

            // Register service worker first
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/'
                });
                console.log('Service Worker registered with scope:', registration.scope);
            }

            this.messaging = getMessaging(app);
            await this.requestPermission();
            await this.setupMessageListener();
        } catch (error) {
            console.error("Error initializing messaging:", error);
            if (error.code === 'messaging/permission-blocked') {
                console.log("Notification permission blocked by user");
            }
        }
    }

    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                const token = await getToken(this.messaging, {
                    vapidKey: VAPID_KEY
                });
                
                // Save the token to your backend
                await this.saveTokenToServer(token);
                console.log("FCM Token:", token);
                return token;
            } else {
                console.log("Notification permission denied");
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
        }
    }

    async saveTokenToServer(token) {
        try {
            const authToken = cookie.load('token');
            if (!authToken) {
                console.error("No authentication token found");
                return;
            }

            await authApis().post(endpoints["save-fcm-token"], { token });
            console.log("FCM token saved successfully");
        } catch (error) {
            console.error("Error saving token:", error);
            if (error.response && error.response.status === 403) {
                console.error("Authentication token expired or invalid");
            }
        }
    }

    setupMessageListener() {
        onMessage(this.messaging, (payload) => {
            console.log("Message received:", payload);
            // Create and show notification
            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
                icon: "/logo192.png",
                badge: "/logo192.png",
                data: payload.data,
                requireInteraction: true,
                actions: [
                    {
                        action: 'open',
                        title: 'Open'
                    },
                    {
                        action: 'close',
                        title: 'Close'
                    }
                ]
            };

            new Notification(notificationTitle, notificationOptions);
        });
    }
}

export const notificationService = new NotificationService(); 