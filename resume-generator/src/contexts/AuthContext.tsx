import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  UserCredential,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signInWithFacebook: () => Promise<User>;
  signInWithGithub: () => Promise<User>;
  signInWithTwitter: () => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // If user just signed in, make sure they have a profile in Firestore
      if (currentUser && !loading) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Create basic user profile in Firestore
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'User',
              email: currentUser.email,
              photoURL: currentUser.photoURL || null,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              provider: currentUser.providerData[0]?.providerId || 'unknown'
            });
          } else {
            // Update last login time
            await setDoc(userDocRef, {
              lastLogin: serverTimestamp()
            }, { merge: true });
          }
        } catch (error) {
          console.error("Error managing user profile:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Handle authentication errors
  const handleAuthError = (error: any): string => {
    let errorMessage = 'An error occurred during authentication';
    
    if (error.code) {
      switch (error.code) {
        // Email/Password errors
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email address is already in use';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 6 characters';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with the same email address but different sign-in credentials';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in popup closed before completing the sign in';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'This sign-in method is not enabled for this project';
          break;
        default:
          errorMessage = error.message || 'Authentication failed';
      }
    }
    
    return errorMessage;
  }

  // Process successful authentication
  const processAuthentication = async (userCredential: UserCredential): Promise<User> => {
    const user = userCredential.user;
    
    // Update user profile in Firestore
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user profile
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          provider: user.providerData[0]?.providerId || 'unknown'
        });
      } else {
        // Update last login time
        await setDoc(userDocRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error creating/updating user profile:", error);
    }
    
    return user;
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      // Set persistent session
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return await processAuthentication(userCredential);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<User> => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      return await processAuthentication(result);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Sign in with Facebook
  const signInWithFacebook = async (): Promise<User> => {
    try {
      setError(null);
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await processAuthentication(result);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Sign in with GitHub
  const signInWithGithub = async (): Promise<User> => {
    try {
      setError(null);
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await processAuthentication(result);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Sign in with Twitter
  const signInWithTwitter = async (): Promise<User> => {
    try {
      setError(null);
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await processAuthentication(result);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
    try {
      setError(null);
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with display name
      if (userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: displayName.trim()
          });
          
          // Send verification email
          await sendEmailVerification(userCredential.user);
          
          // Process authentication to update Firestore
          await processAuthentication(userCredential);
        } catch (profileError) {
          console.error("Error updating profile:", profileError);
          // Continue since the account was created, even if profile update failed
        }
      }
      
      return userCredential.user;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      // Explicitly clear user state after signout
      setUser(null);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      console.error("Logout error:", error);
      throw new Error(errorMessage);
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Update user profile
  const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    try {
      if (!user) throw new Error("No user is logged in");
      
      const updateData: {displayName: string, photoURL?: string} = {
        displayName
      };
      
      if (photoURL) {
        updateData.photoURL = photoURL;
      }
      
      await updateProfile(user, updateData);
      
      // Update in Firestore as well
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, updateData, { merge: true });
      
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Send email verification
  const sendVerificationEmail = async (): Promise<void> => {
    try {
      if (!user) throw new Error("No user is logged in");
      await sendEmailVerification(user);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send verification email";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    signInWithTwitter,
    signOut,
    resetPassword,
    updateUserProfile,
    sendVerificationEmail,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};
