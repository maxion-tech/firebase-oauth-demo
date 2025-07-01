import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { camelCase, capitalize, snakeCase } from 'lodash';
import React, { Fragment, useRef, useState } from 'react';
import { DEFAULT_TEXT_CASE, TEXT_CASE_OPTIONS, TEXT_CASES } from '../constants/textCases';

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

/**
 * TextFormatterTab renders the TextFormatter UI for a specific mode.
 * @param {Object} props
 * @param {'delimiters'|'json'|'env'} props.mode
 */
const TextFormatterTab = ({ mode }) => {
  // Map mode to tab id
  const tabId = mode === 'delimiters' ? 'delimiters' : mode === 'json' ? 'json' : 'env';

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [selectedBracket, setSelectedBracket] = useState(brackets[0]);
  const [selectedTextCase, setSelectedTextCase] = useState(
    TEXT_CASE_OPTIONS.find((option) => option.value === DEFAULT_TEXT_CASE),
  );
  const [isString, setIsString] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [convertToLines, setConvertToLines] = useState(false);
  const [splitByLines, setSplitByLines] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const inputTextRef = useRef(null);
  const inputLinesRef = useRef(null);
  const outputTextRef = useRef(null);
  const outputLinesRef = useRef(null);

  const isJsonMode = tabId === 'json';
  const isEnvMode = tabId === 'env';

  const applyTextCase = (text) => {
    switch (selectedTextCase.value) {
      case TEXT_CASES.LOWERCASE:
        return text.toLowerCase();
      case TEXT_CASES.UPPERCASE:
        return text.toUpperCase();
      case TEXT_CASES.CAPITALIZE:
        return capitalize(text);
      case TEXT_CASES.SNAKE_CASE:
        return snakeCase(text);
      case TEXT_CASES.CAMEL_CASE:
        return camelCase(text);
      case TEXT_CASES.RESPECT_CASE:
      default:
        return text;
    }
  };

  const handleConvert = () => {
    if (isJsonMode) {
      try {
        // Parse the input as JSON and then stringify it as a string literal with escaped quotes
        const parsedJson = JSON.parse(input);
        setOutput(JSON.stringify(JSON.stringify(parsedJson)));
      } catch (error) {
        setOutput('Error: Invalid JSON format');
      }
      return;
    }

    if (isEnvMode) {
      try {
        // Check if input looks like JSON or ENV format
        const trimmedInput = input.trim();
        if (trimmedInput.startsWith('{') || trimmedInput.startsWith('[')) {
          // Convert JSON to ENV
          const parsedJson = JSON.parse(trimmedInput);
          const envLines = [];

          const processObject = (obj, prefix = '') => {
            Object.entries(obj).forEach(([key, value]) => {
              // Remove spaces from key
              const cleanKey = key.replace(/\s+/g, '');
              const envKey = prefix
                ? `${prefix}_${cleanKey.toUpperCase()}`
                : cleanKey.toUpperCase();

              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                processObject(value, envKey);
              } else if (Array.isArray(value)) {
                envLines.push(`${envKey}=${JSON.stringify(value)}`);
              } else {
                envLines.push(`${envKey}=${value}`);
              }
            });
          };

          processObject(parsedJson);
          setOutput(envLines.join('\n'));
        } else {
          // Convert ENV to JSON
          const lines = trimmedInput
            .split('\n')
            .filter((line) => line.trim() && line.includes('='));
          const result = {};

          lines.forEach((line) => {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=').trim();

            // Remove spaces from key and value
            const cleanKey = key.trim().replace(/\s+/g, '');
            const cleanValue = value.replace(/\s+/g, '');

            // Try to parse as JSON, otherwise use as string
            let parsedValue;
            try {
              parsedValue = JSON.parse(cleanValue);
            } catch {
              parsedValue = cleanValue;
            }

            // Use the key as-is without splitting or nesting
            result[cleanKey] = parsedValue;
          });

          setOutput(JSON.stringify(result, null, 2));
        }
      } catch (error) {
        setOutput('Error: Invalid format. Please check your input.');
      }
      return;
    }

    let numbers = splitByLines
      ? input.split('\n').filter(Boolean)
      : input.split(/\s+|,/).filter(Boolean);

    if (removeDuplicates) {
      numbers = Array.from(new Set(numbers));
    }

    // Apply text case transformation to each number
    numbers = numbers.map((num) => applyTextCase(num));

    if (convertToLines) {
      const joined = numbers.map((num) => (isString ? `"${num}"` : num)).join('\n');
      setOutput(joined);
      return;
    }

    const joined = numbers
      .map((num) => (isString ? `"${num}"` : num))
      .join(selectedSymbol.value);

    const leftBracket = selectedBracket.symbols[0];
    const rightBracket = selectedBracket.symbols[1];
    setOutput(leftBracket + joined + rightBracket);
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
      // ignore
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col gap-6 h-full">
        <div className="flex h-full">
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
                    {isJsonMode
                      ? 'Enter (or paste) your JSON here'
                      : isEnvMode
                      ? 'Enter JSON or ENV format here'
                      : 'Enter (or paste) your column of data here'}
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
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center justify-center space-y-4 min-w-[120px] max-w-48">
            {/* Delimiters Mode Controls */}
            {!isJsonMode && !isEnvMode && (
              <>
                <Listbox value={selectedSymbol} onChange={setSelectedSymbol}>
                  <div className="relative w-full">
                    <ListboxButton className="h-10 w-full flex justify-between items-center p-3 px-5 cursor-pointer rounded-lg border border-buttonBorder bg-subBackground text-white">
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
                              `relative cursor-default select-none p-2.5 px-5 ${
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
                  <div className="relative w-full">
                    <ListboxButton className="h-10 w-full flex justify-between items-center p-3 px-5 cursor-pointer rounded-lg border border-buttonBorder bg-subBackground text-white">
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
                              `relative cursor-default select-none p-2.5 px-5 ${
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

                <Listbox value={selectedTextCase} onChange={setSelectedTextCase}>
                  <div className="relative w-full">
                    <ListboxButton className="h-10 w-full flex justify-between items-center p-3 px-5 cursor-pointer rounded-lg border border-buttonBorder bg-subBackground text-white">
                      <span className="block truncate">{selectedTextCase.label}</span>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </ListboxButton>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ListboxOptions className="absolute mt-2 w-56 overflow-auto rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md z-10">
                        {TEXT_CASE_OPTIONS.map((textCase) => (
                          <ListboxOption
                            key={textCase.value}
                            className={({ active }) =>
                              `relative cursor-default select-none p-2.5 px-5 ${
                                active ? 'bg-[#222325] text-white' : 'text-white'
                              }`
                            }
                            value={textCase}
                          >
                            {({ selected }) => (
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {textCase.label}
                              </span>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </div>
                </Listbox>

                {/* Split by Lines */}
                <div className="flex items-center justify-between w-full space-x-3">
                  <span className="text-customGrayLight">Split by Lines</span>
                  <button
                    onClick={() => setSplitByLines(!splitByLines)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      splitByLines ? 'bg-primary' : 'bg-[#3f3f3f]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        splitByLines ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Add Quotes */}
                <div className="flex items-center justify-between w-full space-x-3">
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

                {/* Remove Duplicates */}
                <div className="flex items-center justify-between w-full space-x-3">
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

                {/* Convert to Lines */}
                <div className="flex items-center justify-between w-full space-x-3">
                  <span className="text-customGrayLight">Convert to Lines</span>
                  <button
                    onClick={() => setConvertToLines(!convertToLines)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      convertToLines ? 'bg-primary' : 'bg-[#3f3f3f]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        convertToLines ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <button
              onClick={handleConvert}
              disabled={!input.trim()}
              className={`h-10 w-full p-3 rounded-lg flex justify-center items-center space-x-3 ${
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
              className="h-10 w-full p-3 rounded-lg flex justify-center items-center bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
            >
              Clear
            </button>

            {output.length > 0 && (
              <button
                onClick={handleCopy}
                disabled={!output.trim()}
                className={`h-10 w-full p-3 rounded-lg flex justify-center items-center space-x-3 ${
                  !output.trim()
                    ? 'text-white bg-[#3f3f3f] cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } transition-all duration-300`}
              >
                Copy Output
              </button>
            )}
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
                    {isJsonMode
                      ? 'Your JSON string will appear here'
                      : isEnvMode
                      ? 'Your converted format will appear here'
                      : 'Your converted list will appear here'}
                  </span>
                </div>
              )}
              <textarea
                ref={outputTextRef}
                value={output}
                readOnly
                onScroll={() => syncScroll(outputTextRef, outputLinesRef)}
                className="w-full h-full p-4 bg-transparent text-white resize-none"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Toast */}
      {showToast && (
        <div className="absolute bottom-10 right-10 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Copied!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextFormatterTab;
