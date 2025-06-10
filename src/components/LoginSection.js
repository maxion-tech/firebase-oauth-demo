import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import React, { Fragment } from 'react';
import FacebookSignInButton from './FacebookSignInButton';
import GoogleSignInButton from './GoogleSignInButton';

const LoginSection = ({
  provider,
  setProvider,
  providers,
  setAuth,
  setToken,
  setRefreshToken,
}) => {
  return (
    <div className="h-full w-1/2 flex flex-col space-y-5 items-center justify-center">
      <div className="h-1/2 space-y-7 p-10 rounded-3xl bg-subBackground">
        <div className="flex items-center space-x-5">
          <img src="https://account.maxion.gg/images/icons/Vector.svg" alt="maxion" />
          <span className="h-10 w-[0.5px] bg-[#272d31]"></span>
          <h1 className="text-2xl">Maxion Account</h1>
          <Listbox value={provider} onChange={setProvider}>
            <div className="relative">
              <ListboxButton className="w-56 flex justify-between items-center p-3 px-5 cursor-pointer rounded-xl border border-buttonBorder bg-subBackground">
                <span className="block truncate">{provider.name}</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute mt-14 w-56 overflow-auto rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md">
                  {providers.map((provider, index) => (
                    <ListboxOption
                      key={index}
                      className={({ active }) =>
                        `relative cursor-default select-none p-3 px-5 ${
                          active ? 'bg-[#222325] text-white' : 'text-white'
                        }`
                      }
                      value={provider}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {provider.name}
                          </span>
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>
        <h1 className="text-[#808080]">Continue with</h1>
        <div className="space-y-5 flex flex-col items-center">
          <GoogleSignInButton
            setAuth={setAuth}
            setToken={setToken}
            setRefreshToken={setRefreshToken}
            firebaseApp={provider.firebaseApp}
          />
          <FacebookSignInButton
            setAuth={setAuth}
            setToken={setToken}
            firebaseApp={provider.firebaseApp}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
