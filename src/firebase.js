import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";
// const user_info = JSON.parse(localStorage.getItem("user_info"));
var firebaseConfig = {
  apiKey: "AIzaSyAgaeSeRcOqy7jZdEujk1LF-IXmRzkZV1Y",
  authDomain: "capstone-project-2102c.firebaseapp.com",
  projectId: "capstone-project-2102c",
  storageBucket: "capstone-project-2102c.appspot.com",
  messagingSenderId: "926714664421",
  appId: "1:926714664421:web:51a390b3cb103a082c8b0c",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = async (setTokenFound, setFcmToken) => {
  return getToken(messaging, {
    vapidKey:
      "BO6NLoPKyB3M4jF414YmtQ95HwM-o2cvkaovfMAY78O4uKxykm3PQ_l1dnSd722kMFqUyPNPydD951Jxx8OMkaI",
  })
    .then((currentToken) => {
      subscribeTokenToTopic(
        currentToken,
        "abc"
        // user_info.role.roleName + "/" + user_info.email
      );
      if (currentToken) {
        setTokenFound(true);
        console.log(currentToken);
        setFcmToken(currentToken);
      } else {
        console.log("No token found");
        setTokenFound(false);
        setFcmToken("");
      }
    })
    .catch((error) => {
      console.log("Error" + error);
    });
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log(payload);
      resolve(payload);
    });
  });
function subscribeTokenToTopic(token, topic) {
  fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: "POST",
    headers: new Headers({
      Authorization: `key=AAAA18R_leU:APA91bFs4IswdpTTW64y8Y5YyhZ43JAMr74vDjdnC1no4wWPraCQsgK5s4kfxT_BB1OIb2TeOibIIwno-mf5RtUp_88aoOQzj3lFG9EXiONntpxV0eEMMAbk-oKlt6ZKoikyG-ET5BOE`,
    }),
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 400) {
        console.log(response.status, response);
      }
      console.log(`"${topic}" is subscribed`);
    })
    .catch((error) => {
      console.error(error.result);
    });
  return true;
}
