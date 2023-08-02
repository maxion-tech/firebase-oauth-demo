import React from "react";
import firebase from "../config/firebaseConfig";

const FacebookSignInButton = ({ setAuth, setToken }) => {
  const handleSignIn = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');

    try {
      console.log("Test log")
      const result = await firebase
        .auth()
        .signInWithPopup(provider);
      const user = result.user;
      setAuth(true);
      setToken(user.accessToken);
      window.localStorage.setItem('auth', 'true');

      const idTokenResult = await user.getIdTokenResult();
      const userEmail = idTokenResult.claims.email;
      console.log("User signed in:", user);
      console.log("token: ", user.accessToken);
      console.log("idTokenResult: ", idTokenResult);
      console.log('email: ', userEmail);
      console.log("end test log");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return <button onClick={handleSignIn}>Sign in with Facebook</button>;
};

export default FacebookSignInButton;
