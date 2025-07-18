import React, { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';

const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [copiedCase, setCopiedCase] = useState<string | null>(null);

  const convertToCase = (inputText: string, caseType: string) => {
    switch (caseType) {
      case 'uppercase':
        return inputText.toUpperCase();
      case 'lowercase':
        return inputText.toLowerCase();
      case 'title':
        return inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'sentence':
        return inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
      case 'camel':
        return inputText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
      case 'pascal':
        return inputText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
          return word.toUpperCase();
        }).replace(/\s+/g, '');
      case 'snake':
        return inputText.replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
      case 'kebab':
        return inputText.replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
      case 'alternating':
        return inputText.split('').map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('');
      case 'inverse':
        return inputText.split('').map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join('');
      default:
        return inputText;
    }
  };

  const copyToClipboard = async (convertedText: string, caseType: string) => {
    try {
      await navigator.clipboard.writeText(convertedText);
      setCopiedCase(caseType);
      setTimeout(() => setCopiedCase(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const caseTypes = [
    { id: 'uppercase', name: 'UPPERCASE', description: 'Convert to all uppercase letters' },
    { id: 'lowercase', name: 'lowercase', description: 'Convert to all lowercase letters' },
    { id: 'title', name: 'Title Case', description: 'Capitalize the first letter of each word' },
    { id: 'sentence', name: 'Sentence case', description: 'Capitalize only the first letter' },
    { id: 'camel', name: 'camelCase', description: 'First word lowercase, others capitalized' },
    { id: 'pascal', name: 'PascalCase', description: 'All words capitalized, no spaces' },
    { id: 'snake', name: 'snake_case', description: 'Lowercase with underscores' },
    { id: 'kebab', name: 'kebab-case', description: 'Lowercase with hyphens' },
    { id: 'alternating', name: 'aLtErNaTiNg CaSe', description: 'Alternating upper and lower case' },
    { id: 'inverse', name: 'iNVERSE cASE', description: 'Reverse the case of each letter' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Text Case Converter</h2>
        <p className="text-slate-300">Convert your text to different cases instantly</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Type className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Input Text</span>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Enter your text here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseTypes.map((caseType) => {
          const convertedText = convertToCase(text, caseType.id);
          return (
            <div key={caseType.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{caseType.name}</h3>
                <button
                  onClick={() => copyToClipboard(convertedText, caseType.id)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
                  disabled={!text}
                >
                  {copiedCase === caseType.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-slate-400 text-xs mb-3">{caseType.description}</p>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-600 min-h-[60px]">
                <div className="text-white font-mono text-sm break-all">
                  {convertedText || 'Converted text will appear here...'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TextCaseConverter;