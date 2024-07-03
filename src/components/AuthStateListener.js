import { useEffect, useState } from 'react';
import { cmsFirebase, platformFirebase } from '../config/firebaseConfig';
import { ProviderType, providers } from '../constants';

const AuthStateListener = ({ setAuth, setToken, setProvider }) => {
  const [authStateInitialized, setAuthStateInitialized] = useState(false);

  useEffect(() => {
    platformFirebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('Signed in Platform');
        // User is signed in
        setAuth(true);
        setProvider(
          providers.find((provider) => provider.type === ProviderType.PLATFORM),
        );
        window.localStorage.setItem('auth', 'true');
        const token = await user.getIdToken();
        const userEmail = user.email;
        console.log("user's email: ", userEmail);
        setToken(token);
      } else {
        // User is signed out
        console.log('User is signed out Platform');
        setAuth(false);
      }

      // Mark authentication state as initialized after the first callback
      if (!authStateInitialized) {
        setAuthStateInitialized(true);
      }
    });

    cmsFirebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('Signed in CMS');
        // User is signed in
        setAuth(true);
        setProvider(providers.find((provider) => provider.type === ProviderType.CMS));
        window.localStorage.setItem('auth', 'true');
        const token = await user.getIdToken();
        const userEmail = user.email;
        console.log("user's email: ", userEmail);
        setToken(token);
      } else {
        // User is signed out
        console.log('User is signed out CMS');
        setAuth(false);
      }

      // Mark authentication state as initialized after the first callback
      if (!authStateInitialized) {
        setAuthStateInitialized(true);
      }
    });
  }, [setAuth, authStateInitialized, setToken]); // Include authStateInitialized in the dependency array

  // Render nothing until the authentication state is initialized
  if (!authStateInitialized) {
    return null;
  }

  return null;
};

export default AuthStateListener;
