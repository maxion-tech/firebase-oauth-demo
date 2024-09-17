import { useEffect, useState } from 'react';
import { cmsFirebase, platformFirebase } from '../config/firebaseConfig';
import { ProviderType, providers } from '../constants';

const AuthStateListener = ({ setAuth, setToken, setRefreshToken, setProvider }) => {
  const [authStateInitialized, setAuthStateInitialized] = useState(false);

  useEffect(() => {
    const platformSubscribed = platformFirebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          console.log('Signed in Platform');
          // User is signed in
          setAuth(true);
          const provider = providers.find(
            (provider) => provider.type === ProviderType.PLATFORM,
          );
          setProvider(provider);
          window.localStorage.setItem('auth', 'true');
          const token = await user.getIdToken();
          const userEmail = user.email;
          console.log("user's email: ", userEmail);
          setToken(token);
          setRefreshToken(user.refreshToken);
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

    const cmsSubscribed = cmsFirebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('Signed in CMS');
        // User is signed in
        setAuth(true);
        const provider = providers.find((provider) => provider.type === ProviderType.CMS);
        setProvider(provider);
        window.localStorage.setItem('auth', 'true');
        const token = await user.getIdToken();
        const userEmail = user.email;
        console.log("user's email: ", userEmail);
        setToken(token);
        setRefreshToken(user.refreshToken);
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

    platformSubscribed();
    cmsSubscribed();
  }, [setAuth, authStateInitialized, setToken, setRefreshToken, setProvider]); // Include authStateInitialized in the dependency array

  // Render nothing until the authentication state is initialized
  if (!authStateInitialized) {
    return null;
  }

  return null;
};

export default AuthStateListener;
