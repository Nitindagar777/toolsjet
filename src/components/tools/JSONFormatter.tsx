import React, { useState } from 'react';
import { Code, Copy, Check, FileText } from 'lucide-react';

const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    setError(null);
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  const minifyJSON = () => {
    setError(null);
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  const validateJSON = () => {
    setError(null);
    
    if (!input.trim()) {
      setError('Please enter JSON to validate');
      return;
    }

    try {
      JSON.parse(input);
      setError(null);
      setOutput('✅ Valid JSON');
    } catch (err) {
      setError(`❌ Invalid JSON: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  },
  "isActive": true
}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">JSON Formatter</h2>
        <p className="text-slate-300">Format, minify, and validate JSON data</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="text-white font-medium">JSON Input</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInput(sampleJSON)}
              className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
            >
              Load Sample
            </button>
            <button
              onClick={clearAll}
              className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
          placeholder="Paste your JSON here..."
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <label className="text-slate-300 text-sm">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="bg-slate-900 text-white rounded px-2 py-1 border border-slate-600 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
          
          <div className="flex gap-2 ml-auto">
            <button
              onClick={formatJSON}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Format
            </button>
            <button
              onClick={minifyJSON}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Minify
            </button>
            <button
              onClick={validateJSON}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Validate
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Output</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
            disabled={!output}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}
        
        <textarea
          value={output}
          readOnly
          className="w-full h-48 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 resize-none font-mono text-sm"
          placeholder="Formatted JSON will appear here..."
        />
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">JSON Tools</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• <strong>Format:</strong> Pretty-print JSON with proper indentation</p>
          <p>• <strong>Minify:</strong> Remove whitespace to reduce file size</p>
          <p>• <strong>Validate:</strong> Check if JSON syntax is correct</p>
          <p>• Perfect for API responses, configuration files, and data exchange</p>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;