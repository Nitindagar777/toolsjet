import React, { useState } from 'react';
import { Globe, ArrowLeftRight, RefreshCw, Copy, Check, Trash } from 'lucide-react';

const TextTranslator: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [sourceLanguage, setSourceLanguage] = useState<string>('en');
  const [targetLanguage, setTargetLanguage] = useState<string>('es');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'pl', name: 'Polish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' }
  ];

  // Mock translations - in a real app, you would use a translation API
  const mockTranslations: Record<string, Record<string, string>> = {
    'en': {
      'es': 'Hola mundo',
      'fr': 'Bonjour le monde',
      'de': 'Hallo Welt',
      'it': 'Ciao mondo',
      'pt': 'Olá mundo',
      'ru': 'Привет, мир',
      'zh': '你好，世界',
      'ja': 'こんにちは世界',
      'ko': '안녕하세요 세계',
      'ar': 'مرحبا بالعالم',
      'hi': 'नमस्ते दुनिया',
      'nl': 'Hallo wereld',
      'sv': 'Hej världen',
      'tr': 'Merhaba Dünya',
      'pl': 'Witaj świecie',
      'vi': 'Xin chào thế giới',
      'th': 'สวัสดีชาวโลก'
    }
  };

  // Translate text
  const translateText = () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // In a real app, you would call a translation API
        // This is just a mock that returns predefined text for "Hello World" or adds language markers
        if (sourceText.toLowerCase() === 'hello world' && sourceLanguage === 'en' && mockTranslations.en[targetLanguage]) {
          setTranslatedText(mockTranslations.en[targetLanguage]);
        } else {
          // For any other text, we'll just add language markers to simulate translation
          setTranslatedText(`[${targetLanguage}] ${sourceText}`);
        }
      } catch (err) {
        setError('Failed to translate text. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // Swap languages
  const swapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    
    // Also swap texts if there's translated text
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  // Copy translated text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Clear all text
  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Text Translator</h2>
        <p className="text-slate-300">Translate text between different languages</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* Language Selection */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-slate-300 text-sm mb-2">
              From
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={`source-${lang.code}`} value={lang.code}>
                  {lang.name} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end pb-2">
            <button
              onClick={swapLanguages}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200"
              title="Swap languages"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-slate-300 text-sm mb-2">
              To
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={`target-${lang.code}`} value={lang.code}>
                  {lang.name} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Source Text */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-white font-medium">
              Text to Translate
            </label>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-300 text-sm"
                title="Clear all"
              >
                <Trash className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full h-32 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
            placeholder={`Type or paste text in ${languages.find(l => l.code === sourceLanguage)?.name}...`}
          />
        </div>

        {/* Translate Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={translateText}
            disabled={!sourceText.trim() || isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                Translate
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Translation Result */}
        {translatedText && !error && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-white font-medium">
                Translation ({languages.find(l => l.code === targetLanguage)?.name})
              </label>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
              <p className="text-white whitespace-pre-wrap">{translatedText}</p>
            </div>
          </div>
        )}

        {!translatedText && !error && !isLoading && (
          <div className="bg-slate-900 rounded-lg p-8 border border-slate-700 flex flex-col items-center justify-center text-center">
            <Globe className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-slate-400 text-lg font-medium mb-1">No translation yet</h3>
            <p className="text-slate-500">
              Enter text and click "Translate" to see the translation
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Note: This is a demo translator. In a real application, it would connect to a translation API.
          <br />
          Currently only "Hello World" will show actual translations.
        </div>
      </div>
    </div>
  );
};

export default TextTranslator; 