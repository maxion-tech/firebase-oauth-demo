import React from 'react';
import GetUser from './GetUser';
import SignOutButton from './SignOutButton';

const AuthSection = ({
  token,
  refreshToken,
  provider,
  copyToken,
  setCopyToken,
  copyRefreshToken,
  setCopyRefreshToken,
  setAuth,
}) => {
  return (
    <div className="space-y-3 p-3">
      <GetUser
        token={token}
        refreshToken={refreshToken}
        provider={provider}
        copyToken={copyToken}
        setCopyToken={setCopyToken}
        copyRefreshToken={copyRefreshToken}
        setCopyRefreshToken={setCopyRefreshToken}
      />
      <SignOutButton setAuth={setAuth} firebaseApp={provider.firebaseApp} />
      <div className="h-80 w-full flex items-center justify-center">
        <div className="box">
          <div className="loader"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthSection;
