import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Check, Copy, Info } from 'lucide-react';

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('');
  const [flags, setFlags] = useState<string>('g');
  const [testString, setTestString] = useState<string>('');
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Flag options
  const flagOptions = [
    { value: 'g', label: 'Global', description: 'Find all matches' },
    { value: 'i', label: 'Case Insensitive', description: 'Case-insensitive matching' },
    { value: 'm', label: 'Multiline', description: 'Multiline mode' },
    { value: 's', label: 'Dot All', description: 'Dot matches newlines' },
    { value: 'u', label: 'Unicode', description: 'Unicode support' },
    { value: 'y', label: 'Sticky', description: 'Match from lastIndex only' }
  ];

  // Toggle flag
  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  // Test the regex
  useEffect(() => {
    if (!pattern) {
      setMatches(null);
      setIsValid(true);
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const allMatches = testString.matchAll(regex);
      const matchesArray = Array.from(allMatches);
      setMatches(matchesArray.length > 0 ? matchesArray : null);
      setIsValid(true);
      setError(null);
    } catch (err) {
      setMatches(null);
      setIsValid(false);
      setError((err as Error).message);
    }
  }, [pattern, flags, testString]);

  // Copy regex to clipboard
  const copyToClipboard = () => {
    const regexString = `/${pattern}/${flags}`;
    navigator.clipboard.writeText(regexString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Highlight matches in the test string
  const highlightMatches = () => {
    if (!matches || !isValid || !pattern) {
      return testString;
    }

    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      return testString.replace(regex, match => `<span class="bg-blue-700/40 text-blue-200 px-1 rounded">${match}</span>`);
    } catch {
      return testString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Regex Tester</h2>
        <p className="text-slate-300">Test and debug regular expressions</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* Regex Pattern Input */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Regular Expression Pattern
          </label>
          <div className="flex">
            <div className="bg-slate-700 text-slate-300 px-3 py-2 rounded-l-lg border-y border-l border-slate-600 flex items-center">
              /
            </div>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className={`flex-grow bg-slate-900 text-white py-2 px-3 border-y border-slate-600 focus:outline-none ${
                !isValid && pattern ? 'border-red-500 text-red-300' : ''
              }`}
              placeholder="Enter regex pattern..."
            />
            <div className="bg-slate-700 text-slate-300 px-3 py-2 rounded-r-lg border-y border-r border-slate-600 flex items-center">
              /{flags}
            </div>
          </div>
          {!isValid && error && (
            <div className="mt-2 text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
        </div>

        {/* Flags Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Flags
          </label>
          <div className="flex flex-wrap gap-2">
            {flagOptions.map((flag) => (
              <button
                key={flag.value}
                onClick={() => toggleFlag(flag.value)}
                className={`px-3 py-1.5 rounded text-sm flex items-center ${
                  flags.includes(flag.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
                title={flag.description}
              >
                {flags.includes(flag.value) && <Check className="w-3 h-3 mr-1" />}
                {flag.label} ({flag.value})
              </button>
            ))}
          </div>
        </div>

        {/* Test String Input */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full h-32 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Enter text to test against the regex..."
          />
        </div>

        {/* Copy Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={copyToClipboard}
            disabled={!pattern}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Regex
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">Results</h3>
            {matches && (
              <span className="text-sm text-slate-300">
                {matches.length} match{matches.length !== 1 ? 'es' : ''}
              </span>
            )}
          </div>

          {pattern ? (
            isValid ? (
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                {testString ? (
                  matches ? (
                    <>
                      <div 
                        className="text-white whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                      />
                      
                      <div className="mt-4 border-t border-slate-700 pt-4">
                        <h4 className="text-white font-medium mb-2">Match Details</h4>
                        <div className="space-y-2">
                          {matches.map((match, index) => (
                            <div key={index} className="bg-slate-800 p-3 rounded border border-slate-700">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-300">Match {index + 1}</span>
                                <span className="text-slate-400">Index: {match.index}</span>
                              </div>
                              <div className="text-blue-400 font-mono break-all">{match[0]}</div>
                              
                              {match.length > 1 && (
                                <div className="mt-2 pt-2 border-t border-slate-700">
                                  <div className="text-sm text-slate-300 mb-1">Groups:</div>
                                  {match.slice(1).map((group, groupIndex) => (
                                    <div key={groupIndex} className="text-sm">
                                      <span className="text-slate-400">Group {groupIndex + 1}:</span>{' '}
                                      <span className="text-green-400 font-mono">{group}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-300 flex items-center">
                      <Search className="w-5 h-5 mr-2 text-slate-400" />
                      No matches found
                    </div>
                  )
                ) : (
                  <div className="text-slate-300 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-slate-400" />
                    Enter some text to test your regex
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-900/30 rounded-lg p-4 border border-red-700 text-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Invalid regular expression
                </div>
                {error && <div className="mt-1 text-sm">{error}</div>}
              </div>
            )
          ) : (
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 text-slate-300 flex items-center">
              <Info className="w-5 h-5 mr-2 text-slate-400" />
              Enter a regular expression pattern to get started
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">Regex Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-blue-400 text-sm font-medium mb-2">Character Classes</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-slate-300"><span className="text-white font-mono">\d</span> - Digit (0-9)</li>
              <li className="text-slate-300"><span className="text-white font-mono">\w</span> - Word character (a-z, A-Z, 0-9, _)</li>
              <li className="text-slate-300"><span className="text-white font-mono">\s</span> - Whitespace</li>
              <li className="text-slate-300"><span className="text-white font-mono">.</span> - Any character except newline</li>
              <li className="text-slate-300"><span className="text-white font-mono">[abc]</span> - Any of a, b, or c</li>
              <li className="text-slate-300"><span className="text-white font-mono">[^abc]</span> - Not a, b, or c</li>
            </ul>
          </div>
          <div>
            <h4 className="text-blue-400 text-sm font-medium mb-2">Quantifiers</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-slate-300"><span className="text-white font-mono">*</span> - 0 or more</li>
              <li className="text-slate-300"><span className="text-white font-mono">+</span> - 1 or more</li>
              <li className="text-slate-300"><span className="text-white font-mono">?</span> - 0 or 1</li>
              <li className="text-slate-300"><span className="text-white font-mono">{'{n}'}</span> - Exactly n times</li>
              <li className="text-slate-300"><span className="text-white font-mono">{'{n,}'}</span> - n or more times</li>
              <li className="text-slate-300"><span className="text-white font-mono">{'{n,m}'}</span> - Between n and m times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester; 