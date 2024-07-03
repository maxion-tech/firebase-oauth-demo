import React from 'react';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignOutButton = ({ setAuth, firebaseApp }) => {
  const handleSignOut = async () => {
    try {
      await firebaseApp.auth().signOut();
      console.log('User signed out');
      setAuth(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <button
      className="w-full p-3 rounded-lg border flex justify-center items-center space-x-3 border-buttonBorder text-[#ff6c3e]"
      onClick={handleSignOut}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
      <p>Sign Out</p>
    </button>
  );
};

export default SignOutButton;
