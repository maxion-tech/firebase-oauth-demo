import React from "react";
import firebase from "../config/firebaseConfig";

const GoogleSignInButton = ({ setAuth, setToken }) => {
  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await firebase
        .auth()
        .signInWithPopup(provider);
      const user = result.user;
      setAuth(true);
      await setToken(user.accessToken);
      window.localStorage.setItem('auth', 'true');
      console.log("User signed in:", user);
      console.log("token: ", user.accessToken);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default GoogleSignInButton;
