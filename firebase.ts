
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Hardcoded Firebase configuration.
 * Note: If you see 'auth/configuration-not-found', ensure that:
 * 1. Firebase Authentication is enabled in the Firebase Console.
 * 2. Google Sign-In is enabled as a sign-in provider.
 * 3. The domain you are running on is added to 'Authorized domains' in Firebase Auth settings.
 */
const firebaseConfig = {
  apiKey: "AIzaSyA6LRQGF_w2aubdfDzKkIYmfFONUHPptMM",
  authDomain: "wdc-sheet-reader-leads.firebaseapp.com",
  projectId: "wdc-sheet-reader-leads",
  storageBucket: "wdc-sheet-reader-leads.firebasestorage.app",
  messagingSenderId: "501740200455",
  appId: "1:501740200455:web:e6aa7a574377e339dac0a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure and export Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
