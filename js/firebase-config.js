// =============================================================================
// Firebase Configuration & Service Initialization for ArtDrop
// =============================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyB46vmZ1vnKn_GkYK_lMU5bFTYUvLzPLhw",
  authDomain: "artdrop-vault.firebaseapp.com",
  projectId: "artdrop-vault",
  storageBucket: "artdrop-vault.firebasestorage.app",
  messagingSenderId: "993090650515",
  appId: "1:993090650515:web:d7e1e91b1f75f88842a866",
  measurementId: "G-EX0RGT1HGC"
};

// Import modular Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  deleteDoc,
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Initialize Services
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  ref,
  uploadBytesResumable,
  getDownloadURL
};

console.log("ArtDrop Firebase connected successfully!");
