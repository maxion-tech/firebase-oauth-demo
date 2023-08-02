import { useEffect, useState } from "react";
import firebase from "../config/firebaseConfig";

const AuthStateListener = ({ setAuth, setToken }) => {
  const [authStateInitialized, setAuthStateInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          // User is signed in
          setAuth(true);
          console.log("User is signed in:", user);
          window.localStorage.setItem('auth', 'true');
          const token = await user.getIdToken();
          const userEmail = user.email;
          console.log("user's email: ", userEmail);
          setToken(token);
          console.log(`token = ${token}`);
          
        } else {
          // User is signed out
          console.log("User is signed out");
          setAuth(false);
        }

        // Mark authentication state as initialized after the first callback
        if (!authStateInitialized) {
          setAuthStateInitialized(true);
        }
      });

    return () => unsubscribe();
  }, [setAuth, authStateInitialized]); // Include authStateInitialized in the dependency array

  // Render nothing until the authentication state is initialized
  if (!authStateInitialized) {
    return null;
  }

  return null;
};

export default AuthStateListener;
