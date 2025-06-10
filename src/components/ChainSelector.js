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

const ChainSelector = ({ chain, setChain, chains, operator, setOperator, operators }) => {
  return (
    <div className="flex space-x-3">
      <Listbox value={chain} onChange={setChain}>
        <div className="relative w-1/2">
          <ListboxButton className="h-12 w-full flex justify-between items-center p-3 px-5 cursor-pointer rounded-lg border border-buttonBorder bg-subBackground">
            <span className="block truncate">{chain.name}</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-10 mt-2 w-full rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md">
              {chains.map((chain, index) => (
                <ListboxOption
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none p-3 px-5 ${
                      active ? 'bg-[#222325] text-white' : 'text-white'
                    }`
                  }
                  value={chain}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {chain.name}
                      </span>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      <Listbox value={operator} onChange={setOperator}>
        <div className="relative w-1/2">
          <ListboxButton className="h-12 w-full flex justify-between items-center p-3 px-5 cursor-pointer rounded-lg border border-buttonBorder bg-subBackground">
            <span className="block truncate">{operator?.name}</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute mt-2 w-full overflow-auto rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md">
              {operators[chain.chainId].map((operator, index) => (
                <ListboxOption
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none p-3 px-5 ${
                      active ? 'bg-[#222325] text-white' : 'text-white'
                    }`
                  }
                  value={operator}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {operator.name}
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
  );
};

export default ChainSelector;
