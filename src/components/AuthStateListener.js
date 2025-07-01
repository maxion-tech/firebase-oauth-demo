import { useEffect, useState } from 'react';
import { platformFirebase } from '../config/firebaseConfig';
import { ProviderType, providers } from '../constants';

const AuthStateListener = ({ setAuth, setToken, setRefreshToken, setProvider, setEmail }) => {
  const [authStateInitialized, setAuthStateInitialized] = useState(false);

  useEffect(() => {
    platformFirebase.auth().onAuthStateChanged(async (user) => {
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
        setToken(token);
        setRefreshToken(user.refreshToken);
        setEmail(user.email);
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
  }, [setAuth, authStateInitialized, setToken, setRefreshToken, setProvider, setEmail]); // Include authStateInitialized in the dependency array

  // Render nothing until the authentication state is initialized
  if (!authStateInitialized) {
    return null;
  }

  return null;
};

export default AuthStateListener;
