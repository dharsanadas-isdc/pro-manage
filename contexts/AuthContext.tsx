
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { dbService } from '../services/db';
import { AuthState, UserProfile } from '../types';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null, profile: null, loading: true, error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, profile: null, loading: false, error: null });
        return;
      }

      try {
        let profile = await dbService.getUserProfile(user.uid);
        
        if (!profile) {
          const invite = await dbService.checkInvite(user.email!);
          if (invite) {
            profile = {
              uid: user.uid,
              name: user.displayName || 'Guest',
              email: user.email!,
              photoURL: user.photoURL || '',
              companyId: invite.companyId,
              role: invite.role,
              createdAt: null
            };
            await dbService.createUserProfile(profile);
            await dbService.acceptInvite(invite.id);
          } else {
            const companyId = await dbService.createCompany(`${user.displayName || 'New'}'s Team`, user.uid);
            profile = {
              uid: user.uid,
              name: user.displayName || 'Guest',
              email: user.email!,
              photoURL: user.photoURL || '',
              companyId,
              role: 'Owner',
              createdAt: null
            };
            await dbService.createUserProfile(profile);
          }
        }
        setState({ user, profile, loading: false, error: null });
      } catch (err: any) {
        console.error("Profile Sync Error:", err);
        setState(prev => ({ ...prev, loading: false, error: "Authenticated, but profile data could not be synced. Check Firestore rules." }));
      }
    }, (err) => {
      console.error("Auth State Observer Error:", err);
      setState({ user: null, profile: null, loading: false, error: err.message });
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login Procedure Failed:", err);
      let friendlyError = err.message;
      
      // Handle specific Firebase configuration errors
      if (err.code === 'auth/configuration-not-found') {
        friendlyError = "Firebase Auth is not enabled for this project. Please enable 'Google' in the Firebase Console > Authentication > Sign-in method.";
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyError = "Google Sign-In is disabled in your Firebase settings. Please enable it in the console.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        friendlyError = "Login window was closed before completion.";
      } else if (err.code === 'auth/unauthorized-domain') {
        friendlyError = "This domain is not authorized for Firebase Auth. Add it to 'Authorized domains' in the Firebase Console.";
      }
      
      setState(prev => ({ ...prev, loading: false, error: friendlyError }));
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
