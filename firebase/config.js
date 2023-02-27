import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD0j5jTZZchkQ3agI077uQAcRhRw1SH5w0",
  authDomain: "mobilechat-43aae.firebaseapp.com",
  projectId: "mobilechat-43aae",
  storageBucket: "mobilechat-43aae.appspot.com",
  messagingSenderId: "492622801191",
  appId: "1:492622801191:web:ff066769f672f2c923e102",
  measurementId: "G-BVK53CTZRV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
