importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAgaeSeRcOqy7jZdEujk1LF-IXmRzkZV1Y",
  authDomain: "capstone-project-2102c.firebaseapp.com",
  projectId: "capstone-project-2102c",
  storageBucket: "capstone-project-2102c.appspot.com",
  messagingSenderId: "926714664421",
  appId: "1:926714664421:web:51a390b3cb103a082c8b0c",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message:" + payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = { body: payload.notification.body };
  self.ServiceWorkerRegistration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
