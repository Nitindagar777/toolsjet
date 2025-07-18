import React, { useState } from 'react';
import { FileSpreadsheet, FileJson, Copy, Check, RefreshCw, Trash } from 'lucide-react';

const CSVtoJSON: React.FC = () => {
  const [csvInput, setCsvInput] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>(',');
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Convert CSV to JSON
  const convertToJSON = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Split the CSV into rows
      const rows = csvInput.trim().split('\n').map(row => 
        row.split(delimiter).map(cell => 
          cell.trim().replace(/(^"|"$)/g, '') // Remove surrounding quotes if present
        )
      );
      
      if (rows.length === 0) {
        throw new Error('No data found in CSV');
      }
      
      let headers: string[] = [];
      let startRow = 0;
      
      // If CSV has headers, use the first row as headers
      if (hasHeader) {
        headers = rows[0];
        startRow = 1;
      } else {
        // Generate default headers (Column1, Column2, etc.)
        headers = Array.from({ length: rows[0].length }, (_, i) => `Column${i + 1}`);
      }
      
      // Map each row to an object
      const jsonData = rows.slice(startRow).map(row => {
        const obj: Record<string, string> = {};
        headers.forEach((header, i) => {
          if (i < row.length) {
            obj[header] = row[i];
          }
        });
        return obj;
      });
      
      setJsonOutput(JSON.stringify(jsonData, null, 2));
    } catch (err) {
      setError(`Failed to convert CSV to JSON: ${(err as Error).message}`);
      setJsonOutput('');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy JSON to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Clear all inputs and outputs
  const clearAll = () => {
    setCsvInput('');
    setJsonOutput('');
    setError(null);
  };

  // Example CSV data
  const loadExample = () => {
    setCsvInput('Name,Age,Email\nJohn Doe,30,john@example.com\nJane Smith,25,jane@example.com\nBob Johnson,45,bob@example.com');
    setDelimiter(',');
    setHasHeader(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">CSV to JSON Converter</h2>
        <p className="text-slate-300">Convert CSV data to JSON format</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Delimiter
            </label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={() => setHasHeader(!hasHeader)}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${hasHeader ? 'bg-blue-600' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${hasHeader ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="ml-3 text-slate-300">First row is header</span>
            </label>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={convertToJSON}
              disabled={!csvInput || isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileJson className="w-5 h-5" />
                  Convert
                </>
              )}
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200"
              title="Clear all"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CSV Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-white font-medium">
              CSV Input
            </label>
            <button
              onClick={loadExample}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none font-mono"
            placeholder="Paste your CSV data here..."
          />
        </div>

        {/* JSON Output */}
        {(jsonOutput || error) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white font-medium">
                JSON Output
              </label>
              {jsonOutput && (
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
                      Copy JSON
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
              <pre className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 overflow-auto font-mono text-sm">
                {jsonOutput}
              </pre>
            )}
          </div>
        )}

        {!jsonOutput && !error && (
          <div className="bg-slate-900 rounded-lg p-8 border border-slate-700 flex flex-col items-center justify-center text-center">
            <FileJson className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-slate-400 text-lg font-medium mb-1">No JSON output yet</h3>
            <p className="text-slate-500">
              Paste your CSV data and click "Convert" to generate JSON
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVtoJSON; 