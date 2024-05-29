import React from 'react';
import firebase from '../config/firebaseConfig';

const GoogleSignInButton = ({ setAuth, setToken }) => {
  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      setAuth(true);
      await setToken(user.accessToken);
      window.localStorage.setItem('auth', 'true');
      console.log('User signed in:', user);
      console.log('token: ', user.accessToken);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <button
      className="w-full p-3 rounded-lg border flex justify-center items-center space-x-3 border-buttonBorder bg-buttonBackground text-white"
      onClick={handleSignIn}
    >
      <img
        src="https://account.maxion.gg/images/icons/Google.svg"
        alt="google"
        className="h-5"
      />
      <p> Continue with Google</p>
    </button>
  );
};

export default GoogleSignInButton;
