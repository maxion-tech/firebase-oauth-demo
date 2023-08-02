import React from "react";
import firebase from "../config/firebaseConfig";

const SignOutButton = () => {
  const handleSignOut = async ({ setAuth, setUser, setToken, setWalletToken }) => {
    try {
      await firebase.auth().signOut();
      console.log("User signed out");
      setAuth(false); 
      setUser(null);
      setToken(null);
      setWalletToken(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <button onClick={handleSignOut}>
      Sign out
    </button>
  );
};

export default SignOutButton;
