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
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full">
        <GetUser
          token={token}
          refreshToken={refreshToken}
          provider={provider}
          copyToken={copyToken}
          setCopyToken={setCopyToken}
          copyRefreshToken={copyRefreshToken}
          setCopyRefreshToken={setCopyRefreshToken}
        />
      </div>
      <div className="w-full mt-4">
        <SignOutButton setAuth={setAuth} firebaseApp={provider.firebaseApp} />
      </div>
      <div className="flex-1 flex items-center justify-center w-full mt-6">
        <div className="box">
          <div className="loader"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthSection;
