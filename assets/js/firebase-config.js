// ============================================================
// firebase-config.js
//
// 1. Vào https://console.firebase.google.com → tạo project mới (miễn phí).
// 2. Trong project, chọn biểu tượng "</>" (Web app) để đăng ký 1 web app.
// 3. Firebase sẽ đưa cho bạn một object "firebaseConfig" — copy toàn bộ
//    và dán đè vào biến bên dưới.
// 4. Đây là các khóa "public" (apiKey ở đây KHÔNG phải bí mật cần giấu —
//    quyền truy cập thật sự được kiểm soát bởi Firestore Security Rules
//    trong file firestore.rules, không phải bởi việc giấu khóa này).
// 5. Bật Authentication → Sign-in method → Email/Password.
// 6. Bật Firestore Database → Create database → chọn chế độ Production.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyA6d_o0_POZpxyzWRC5Qy49SWxNRE38Q-M",
  authDomain: "petcarecenter-34a0f.firebaseapp.com",
  projectId: "petcarecenter-34a0f",
  storageBucket: "petcarecenter-34a0f.firebasestorage.app",
  messagingSenderId: "540755624756",
  appId: "1:540755624756:web:3723dea3e153bb23ae9b61",
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app, auth, db,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile,
  doc, setDoc, getDoc, addDoc, updateDoc, deleteDoc, collection, query, where, orderBy, onSnapshot, serverTimestamp,
};
