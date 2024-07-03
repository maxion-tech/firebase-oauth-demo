import React from 'react';
import firebase from 'firebase/compat/app';

const FacebookSignInButton = ({ setAuth, setToken, firebaseApp }) => {
  const handleSignIn = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');

    try {
      const result = await firebaseApp.auth().signInWithPopup(provider);
      const user = result.user;
      setAuth(true);
      setToken(user.accessToken);
      window.localStorage.setItem('auth', 'true');

      const idTokenResult = await user.getIdTokenResult();
      const userEmail = idTokenResult.claims.email;
      console.log('User signed in:', user);
      console.log('token: ', user.accessToken);
      console.log('idTokenResult: ', idTokenResult);
      console.log('email: ', userEmail);
      console.log('end test log');
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <button
      className="w-full p-3 rounded-lg border flex justify-center items-center space-x-3 border-buttonBorder bg-[#0d0d0d] text-white"
      onClick={handleSignIn}
    >
      <img
        src="https://account.maxion.gg/images/icons/Facebook.svg"
        alt="facebook"
        className="h-5"
      />
      <p> Continue with Facebook</p>
    </button>
  );
};

export default FacebookSignInButton;
