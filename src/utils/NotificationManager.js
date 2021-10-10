import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from 'react-native'

class NotificationManager {
    configure = (onRegister, onNotification, onOpenNotification,) => {
        // Must be outside of any component LifeCycle (such as `componentDidMount`).
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                console.log("[NotificationManager] onRegister token:", token);
                onRegister(token)
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                console.log("[NotificationManager] onNotification:", notification)

                // process the notification

                // if (Platform.OS === 'ios') {
                //     if (notification.foreground) {
                //         notification.userInteraction = true
                //     }
                // } else {
                //     notification.userInteraction = true
                // }

                if (notification.userInteraction) {
                    onOpenNotification(notification)
                } else {
                    onNotification(notification)
                }

                // (required) Called when a remote is received or opened, or local notification is opened
                if (Platform.OS === 'ios') {
                    if (!notification.foreground) {
                        notification.finish('backgroundFetchResultNoData');
                    }
                } else {
                    notification.finish('backgroundFetchResultNoData');
                }
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);

                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error(err.message, err);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        })
    }

    _buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || "view",
            category: options.category || "",
            userInfo: {
                id: id,
                item: data
            }
        }
    }

    _buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autocancel: true,
            largeIcon: options.largeIcon || "ic_launcher",
            smallIcon: options.smallIcon || "ic_launcher",
            bigText: message || '',
            subText: title || '',
            vibrate: options.vibrate || false,
            vibration: options.vibration || 300,
            priority: options.priority || 'high',
            importance: options.importance || "high",
            data: data
        }
    }

    showNotification = (id, title, message, data, options) => {
        PushNotification.localNotification({
            // Only Android Properties
            ...this._buildAndroidNotification(id, title, message, data, options),
            // Only IOS Properties
            ...this._buildIOSNotification(id, title, message, data, options),
            // IOS and Android Properties
            title: title,
            message: message,
            playSound: options.playSound || false,
            soundName: options.soundName || "default",
            userInteraction: false,
        })
    }

    showNotificationSchedule = (id, title, message, date,data, options) => {
        PushNotification.localNotificationSchedule({
            // Only Android Properties
            ...this._buildAndroidNotification(id, title, message, data, options),
            // Only IOS Properties
            ...this._buildIOSNotification(id, title, message, data, options),
            // IOS and Android Properties
            title: title,
            message: message,
            date: new Date(new Date(date).getTime() + 15 * 1000), // in 60 secs
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            playSound: options.playSound || false,
            soundName: options.soundName || "default",
            userInteraction: false,
        })
    }

    cancelAllLocalNotification = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications()
        } else {
            PushNotification.cancelAllLocalNotifications()
        }
    }

    unregister = () => {
        PushNotification.unregister();
    }
}

export const notificationManager = new NotificationManager()