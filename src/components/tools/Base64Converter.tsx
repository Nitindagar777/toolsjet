import React, { useState } from 'react';
import { Code, ArrowUpDown, Copy, Check } from 'lucide-react';

const Base64Converter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText)));
        setOutputText(decoded);
      }
    } catch (err) {
      setError('Invalid input for Base64 decoding');
      setOutputText('');
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (value.trim() === '') {
      setOutputText('');
      setError(null);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    
    // Swap input and output
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setError(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Auto-convert as user types
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleConvert();
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText, mode]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Base64 Encoder/Decoder</h2>
        <p className="text-slate-300">Encode and decode Base64 strings with ease</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-slate-800 rounded-lg p-1 border border-slate-700">
          <div className="flex">
            <button
              onClick={() => {
                if (mode !== 'encode') {
                  setMode('encode');
                  setInputText('');
                  setOutputText('');
                  setError(null);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                mode === 'encode' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => {
                if (mode !== 'decode') {
                  setMode('decode');
                  setInputText('');
                  setOutputText('');
                  setError(null);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                mode === 'decode' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="text-white font-medium">
              {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            </span>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full h-48 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
            placeholder={mode === 'encode' ? 'Enter plain text to encode...' : 'Enter Base64 string to decode...'}
          />
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-green-400" />
              <span className="text-white font-medium">
                {mode === 'encode' ? 'Base64 String' : 'Plain Text'}
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
              disabled={!outputText}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={outputText}
              readOnly
              className="w-full h-48 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 resize-none font-mono text-sm"
              placeholder={mode === 'encode' ? 'Encoded Base64 will appear here...' : 'Decoded text will appear here...'}
            />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 rounded-lg">
                <div className="text-red-400 text-center">
                  <Code className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={toggleMode}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          <ArrowUpDown className="w-5 h-5" />
          Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About Base64</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Base64 is a binary-to-text encoding scheme that represents binary data as ASCII text</p>
          <p>• Commonly used for encoding data in email, web pages, and data transfer</p>
          <p>• Base64 encoded data is approximately 33% larger than the original</p>
          <p>• Safe for transmission over text-based protocols like HTTP and email</p>
        </div>
      </div>
    </div>
  );
};

export default Base64Converter;