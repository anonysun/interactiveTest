import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Firebase 초기화
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2vo6NxwVTgbiAHHynESsEZxikGV73XO8",
  authDomain: "interactivepagesample.firebaseapp.com",
  projectId: "interactivepagesample",
  storageBucket: "interactivepagesample.firebasestorage.app",
  messagingSenderId: "278394005121",
  appId: "1:278394005121:web:af481a73df013400e94f80",
  measurementId: "G-PBZVQWPGF8"
};

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
