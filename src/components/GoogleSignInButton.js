import React from 'react';
import firebase from 'firebase/compat/app';

const GoogleSignInButton = ({ setAuth, setToken, setRefreshToken, firebaseApp }) => {
  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await firebaseApp.auth().signInWithPopup(provider);
      const user = result.user;
      setAuth(true);
      setToken(await user.getIdToken());
      setRefreshToken(user.refreshToken);
      window.localStorage.setItem('auth', 'true');
      console.log('User signed in:', user);
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
