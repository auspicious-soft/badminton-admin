import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDY1COVts8jbneqWcMM9oJznyF7RO2WogA",
  authDomain: "play-app-9c4df.firebaseapp.com",
  projectId: "play-app-9c4df",
  storageBucket: "play-app-9c4df.firebasestorage.app",
  messagingSenderId: "48002840638",
  appId: "1:48002840638:web:7562b4453d2f294fccb96f",
  measurementId: "G-7TK9NBWPDJ"
};

const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const getBrowserToken = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permission not granted");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });

    return token;
  } catch (err) {
    console.error("Token error", err);
    return null;
  }
};

