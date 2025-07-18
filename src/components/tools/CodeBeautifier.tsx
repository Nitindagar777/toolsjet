import React, { useState } from 'react';
import { Code, Copy, Check, RefreshCw, Trash, FileCode } from 'lucide-react';

const CodeBeautifier: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [beautifiedCode, setBeautifiedCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('json');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const languageOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'xml', label: 'XML' }
  ];

  const indentSizeOptions = [2, 4, 8];

  // Beautify code function
  const beautifyCode = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result = '';
      
      // Simple beautification based on language
      switch (language) {
        case 'json':
          // Parse and stringify JSON with indentation
          const parsedJson = JSON.parse(code);
          result = JSON.stringify(parsedJson, null, indentSize);
          break;
          
        case 'javascript':
        case 'typescript':
          // Basic JS formatting (this is a simplified version)
          // In a real app, you would use a library like prettier or js-beautify
          result = formatJavaScript(code, indentSize);
          break;
          
        case 'html':
        case 'xml':
          // Basic HTML/XML formatting
          result = formatHTML(code, indentSize);
          break;
          
        case 'css':
          // Basic CSS formatting
          result = formatCSS(code, indentSize);
          break;
          
        case 'sql':
          // Basic SQL formatting
          result = formatSQL(code);
          break;
          
        default:
          result = code; // Return as-is for unsupported languages
      }
      
      setBeautifiedCode(result);
    } catch (err) {
      setError(`Failed to beautify ${language.toUpperCase()} code: ${(err as Error).message}`);
      setBeautifiedCode('');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple JavaScript formatter (for demonstration purposes)
  const formatJavaScript = (code: string, indent: number): string => {
    try {
      // This is a very basic implementation
      // In a real app, use a proper library
      const indentStr = ' '.repeat(indent);
      let formatted = '';
      let indentLevel = 0;
      let inString = false;
      let stringChar = '';
      
      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const nextChar = code[i + 1] || '';
        
        // Handle strings
        if ((char === '"' || char === "'" || char === '`') && 
            (i === 0 || code[i - 1] !== '\\')) {
          if (inString && char === stringChar) {
            inString = false;
            stringChar = '';
          } else if (!inString) {
            inString = true;
            stringChar = char;
          }
        }
        
        if (!inString) {
          // Handle brackets
          if (char === '{' || char === '[') {
            formatted += char + '\n' + indentStr.repeat(++indentLevel);
            continue;
          }
          
          if (char === '}' || char === ']') {
            formatted += '\n' + indentStr.repeat(--indentLevel) + char;
            continue;
          }
          
          // Handle semicolons
          if (char === ';') {
            formatted += char + '\n' + indentStr.repeat(indentLevel);
            continue;
          }
          
          // Handle commas in objects/arrays
          if (char === ',' && (nextChar !== ' ' || (nextChar === ' ' && code[i + 2] !== '\n'))) {
            formatted += char + '\n' + indentStr.repeat(indentLevel);
            continue;
          }
        }
        
        formatted += char;
      }
      
      return formatted;
    } catch {
      return code; // Return original if formatting fails
    }
  };

  // Simple HTML formatter (for demonstration purposes)
  const formatHTML = (code: string, indent: number): string => {
    try {
      // This is a very basic implementation
      // In a real app, use a proper library
      const indentStr = ' '.repeat(indent);
      let formatted = '';
      let indentLevel = 0;
      let inTag = false;
      let inContent = false;
      let tagBuffer = '';
      
      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        
        if (char === '<' && code[i + 1] !== '/') {
          // Opening tag
          if (inContent) {
            formatted += '\n' + indentStr.repeat(indentLevel);
            inContent = false;
          }
          inTag = true;
          tagBuffer = char;
        } else if (char === '<' && code[i + 1] === '/') {
          // Closing tag
          inTag = true;
          indentLevel = Math.max(0, indentLevel - 1);
          formatted += '\n' + indentStr.repeat(indentLevel);
          tagBuffer = char;
        } else if (char === '>' && inTag) {
          // End of tag
          inTag = false;
          inContent = true;
          tagBuffer += char;
          formatted += tagBuffer;
          if (tagBuffer.includes('/>') || tagBuffer.includes('</')) {
            inContent = false;
          } else {
            indentLevel++;
          }
          tagBuffer = '';
        } else if (inTag) {
          // Inside tag
          tagBuffer += char;
        } else {
          // Content
          formatted += char;
        }
      }
      
      return formatted;
    } catch {
      return code; // Return original if formatting fails
    }
  };

  // Simple CSS formatter (for demonstration purposes)
  const formatCSS = (code: string, indent: number): string => {
    try {
      const indentStr = ' '.repeat(indent);
      let formatted = '';
      let indentLevel = 0;
      let inSelector = true;
      let inProperty = false;
      
      // Replace multiple whitespaces with a single space
      code = code.replace(/\s+/g, ' ').trim();
      
      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        
        if (char === '{') {
          formatted += ' ' + char + '\n' + indentStr.repeat(++indentLevel);
          inSelector = false;
          inProperty = true;
        } else if (char === '}') {
          formatted += '\n' + indentStr.repeat(--indentLevel) + char + '\n';
          inSelector = true;
          inProperty = false;
        } else if (char === ';' && inProperty) {
          formatted += char + '\n' + indentStr.repeat(indentLevel);
        } else if (char === ':' && inProperty) {
          formatted += char + ' ';
        } else {
          formatted += char;
        }
      }
      
      return formatted;
    } catch {
      return code; // Return original if formatting fails
    }
  };

  // Simple SQL formatter (for demonstration purposes)
  const formatSQL = (code: string): string => {
    try {
      // Replace keywords with uppercase versions
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 
        'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE',
        'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'AND', 'OR', 'AS'
      ];
      
      let formatted = code.replace(/\s+/g, ' ').trim();
      
      // Uppercase keywords (simple implementation)
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
      });
      
      // Add newlines after common clauses
      formatted = formatted
        .replace(/\bSELECT\b/gi, 'SELECT\n  ')
        .replace(/\bFROM\b/gi, '\nFROM\n  ')
        .replace(/\bWHERE\b/gi, '\nWHERE\n  ')
        .replace(/\bGROUP BY\b/gi, '\nGROUP BY\n  ')
        .replace(/\bORDER BY\b/gi, '\nORDER BY\n  ')
        .replace(/\bHAVING\b/gi, '\nHAVING\n  ')
        .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN\n  ')
        .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN\n  ')
        .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN\n  ')
        .replace(/\bJOIN\b/gi, '\nJOIN\n  ');
      
      return formatted;
    } catch {
      return code; // Return original if formatting fails
    }
  };

  // Copy beautified code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(beautifiedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Clear all code
  const clearCode = () => {
    setCode('');
    setBeautifiedCode('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Code Beautifier</h2>
        <p className="text-slate-300">Format and beautify your code</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Language Selection */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Indent Size */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Indent Size
            </label>
            <div className="flex gap-2">
              {indentSizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setIndentSize(size)}
                  className={`flex-1 py-3 rounded-lg text-center ${
                    indentSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={beautifyCode}
              disabled={!code || isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Code className="w-5 h-5" />
                  Beautify
                </>
              )}
            </button>
            <button
              onClick={clearCode}
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200"
              title="Clear code"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input Code */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Input Code
          </label>
          <div className="relative">
            <div className="absolute top-0 left-0 p-2 bg-slate-700 text-slate-300 text-xs rounded-tl-lg">
              {languageOptions.find(l => l.value === language)?.label || language}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 pt-8 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none font-mono"
              placeholder={`Paste your ${language} code here...`}
            />
          </div>
        </div>

        {/* Output Code */}
        {(beautifiedCode || error) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white font-medium">
                Beautified Code
              </label>
              {beautifiedCode && (
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
                      Copy Code
                    </>
                  )}
                </button>
              )}
            </div>

            {error ? (
              <div className="bg-red-900/30 rounded-lg p-4 border border-red-700 text-red-200">
                {error}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-0 left-0 p-2 bg-slate-700 text-slate-300 text-xs rounded-tl-lg">
                  {languageOptions.find(l => l.value === language)?.label || language}
                </div>
                <pre className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 pt-8 border border-slate-600 overflow-auto font-mono text-sm">
                  {beautifiedCode}
                </pre>
              </div>
            )}
          </div>
        )}

        {!beautifiedCode && !error && (
          <div className="bg-slate-900 rounded-lg p-8 border border-slate-700 flex flex-col items-center justify-center text-center">
            <FileCode className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-slate-400 text-lg font-medium mb-1">No beautified code yet</h3>
            <p className="text-slate-500">
              Paste your code and click "Beautify" to format it
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About Code Beautifier</h3>
        <p className="text-slate-300 mb-3">
          This tool helps you format and beautify code in various programming languages. 
          It improves code readability by adding proper indentation and spacing.
        </p>
        <p className="text-slate-300">
          For more advanced formatting options or language support, consider using dedicated 
          tools like Prettier, ESLint, or language-specific formatters.
        </p>
      </div>
    </div>
  );
};

export default CodeBeautifier; 