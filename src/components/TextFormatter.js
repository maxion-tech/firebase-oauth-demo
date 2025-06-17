import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import React, { Fragment, useRef, useState } from 'react';

const Toast = ({ message, isVisible }) => {
  return (
    <Transition
      show={isVisible}
      enter="transition ease-out duration-300"
      enterFrom="transform translate-y-[50%] opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-[50%] opacity-0"
    >
      <div className="absolute bottom-10 right-10 z-50">
        <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{message}</span>
        </div>
      </div>
    </Transition>
  );
};

const symbols = [
  { value: ',', label: 'Comma (,)' },
  { value: '.', label: 'Period (.)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: ':', label: 'Colon (:)' },
  { value: '|', label: 'Pipe (|)' },
  { value: '/', label: 'Slash (/)' },
  { value: ' ', label: 'Space ( )' },
];

const brackets = [
  { value: 'none', label: 'No Brackets', symbols: ['', ''] },
  { value: 'parentheses', label: 'Parentheses ( )', symbols: ['(', ')'] },
  { value: 'square', label: 'Square Brackets [ ]', symbols: ['[', ']'] },
  { value: 'curly', label: 'Curly Braces { }', symbols: ['{', '}'] },
];

const TextFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [selectedBracket, setSelectedBracket] = useState(brackets[0]);
  const [isString, setIsString] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const inputTextRef = useRef(null);
  const inputLinesRef = useRef(null);
  const outputTextRef = useRef(null);
  const outputLinesRef = useRef(null);

  const handleConvert = () => {
    let numbers = input.split(/\s+|,/).filter(Boolean);

    if (removeDuplicates) {
      numbers = Array.from(new Set(numbers));
    }

    const joined = numbers
      .map((num) => (isString ? `"${num}"` : num))
      .join(selectedSymbol.value);

    const {
      symbols: [open, close],
    } = selectedBracket;

    setOutput(`${open}${joined}${close}`);
  };

  const getLineNumbers = (content) => {
    const currentLines = content.split('\n').length;
    const lineCount = Math.max(30, currentLines);
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  };

  const syncScroll = (sourceRef, targetRef) => {
    if (sourceRef.current && targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <Toast message="Text copied to clipboard!" isVisible={showToast} />
      <div className="flex flex-row w-full flex-grow h-full">
        {/* Left: Input area */}
        <div className="flex flex-row flex-1 bg-[#222324] border border-buttonBorder rounded-lg overflow-hidden mr-4 relative">
          <div
            ref={inputLinesRef}
            className="flex flex-col py-4 bg-[#ededed] text-[#9b9b9b] text-sm select-none min-w-[32px] overflow-hidden"
          >
            {getLineNumbers(input || '').map((line) => (
              <div
                key={line}
                className={`flex items-center justify-center py-0.5 ${
                  line % 2 !== 0 ? 'bg-[#dadada]' : ''
                }`}
              >
                {line}
              </div>
            ))}
          </div>
          <div className="relative flex-1 h-full">
            {input === '' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-customGrayLight text-center select-none">
                  Enter (or paste) your column of data here
                </span>
              </div>
            )}
            <textarea
              ref={inputTextRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onScroll={() => syncScroll(inputTextRef, inputLinesRef)}
              className="w-full h-full p-4 bg-transparent text-white placeholder-customGrayLight focus:outline-none resize-none"
              spellCheck={false}
              style={{ minHeight: '400px' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center space-y-4 mx-4 min-w-[120px]">
          <div className="flex items-center justify-between w-56 space-x-3">
            <span className="text-customGrayLight">Add Quotes</span>
            <button
              onClick={() => setIsString(!isString)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isString ? 'bg-primary' : 'bg-[#3f3f3f]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isString ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between w-56 space-x-3">
            <span className="text-customGrayLight">Remove Duplicates</span>
            <button
              onClick={() => setRemoveDuplicates(!removeDuplicates)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                removeDuplicates ? 'bg-primary' : 'bg-[#3f3f3f]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  removeDuplicates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <Listbox value={selectedSymbol} onChange={setSelectedSymbol}>
            <div className="relative w-56">
              <ListboxButton className="h-12 w-56 flex justify-between items-center p-3 px-5 cursor-pointer rounded-xl border border-buttonBorder bg-subBackground text-white">
                <span className="block truncate">{selectedSymbol.label}</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute mt-2 w-56 overflow-auto rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md z-10">
                  {symbols.map((symbol) => (
                    <ListboxOption
                      key={symbol.value}
                      className={({ active }) =>
                        `relative cursor-default select-none p-3 px-5 ${
                          active ? 'bg-[#222325] text-white' : 'text-white'
                        }`
                      }
                      value={symbol}
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {symbol.label}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>

          <Listbox value={selectedBracket} onChange={setSelectedBracket}>
            <div className="relative w-56">
              <ListboxButton className="h-12 w-56 flex justify-between items-center p-3 px-5 cursor-pointer rounded-xl border border-buttonBorder bg-subBackground text-white">
                <span className="block truncate">{selectedBracket.label}</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute mt-2 w-56 overflow-auto rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md z-10">
                  {brackets.map((bracket) => (
                    <ListboxOption
                      key={bracket.value}
                      className={({ active }) =>
                        `relative cursor-default select-none p-3 px-5 ${
                          active ? 'bg-[#222325] text-white' : 'text-white'
                        }`
                      }
                      value={bracket}
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {bracket.label}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>

          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className={`h-10 w-48 p-3 rounded-lg flex justify-center items-center space-x-3 ${
              !input.trim()
                ? 'text-white bg-[#3f3f3f] cursor-not-allowed'
                : 'text-black bg-primary hover:bg-primary/90'
            } transition-all duration-300`}
          >
            Convert
          </button>

          <button
            onClick={() => {
              setInput('');
              setOutput('');
            }}
            className="h-10 w-48 p-3 rounded-lg flex justify-center items-center bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
          >
            Clear
          </button>

          <button
            onClick={handleCopy}
            disabled={!output.trim()}
            className={`h-10 w-48 p-3 rounded-lg flex justify-center items-center space-x-3 ${
              !output.trim()
                ? 'text-white bg-[#3f3f3f] cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-black'
            } transition-all duration-300`}
          >
            Copy Output
          </button>
        </div>

        {/* Right: Output area */}
        <div className="flex flex-row flex-1 bg-[#222324] border border-buttonBorder rounded-lg overflow-hidden ml-4 relative">
          <div
            ref={outputLinesRef}
            className="flex flex-col py-4 bg-[#ededed] text-[#9b9b9b] text-sm select-none min-w-[32px] overflow-hidden"
          >
            {getLineNumbers(output || '').map((line) => (
              <div
                key={line}
                className={`flex items-center justify-center py-0.5 ${
                  line % 2 !== 0 ? 'bg-[#dadada]' : ''
                }`}
              >
                {line}
              </div>
            ))}
          </div>
          <div className="relative flex-1 h-full">
            {output === '' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-customGrayLight text-center select-none">
                  Your converted list will appear here
                </span>
              </div>
            )}
            <textarea
              ref={outputTextRef}
              value={output}
              readOnly
              onScroll={() => syncScroll(outputTextRef, outputLinesRef)}
              className="w-full h-full p-4 bg-transparent text-white resize-none"
              style={{ minHeight: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextFormatter;
