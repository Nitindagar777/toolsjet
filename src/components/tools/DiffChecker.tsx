import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeftRight, RefreshCw, Trash, Copy, Check } from 'lucide-react';

const DiffChecker: React.FC = () => {
  const [textA, setTextA] = useState<string>('');
  const [textB, setTextB] = useState<string>('');
  const [diffResult, setDiffResult] = useState<{ added: string[]; removed: string[]; unchanged: string[] }>({
    added: [],
    removed: [],
    unchanged: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [diffMode, setDiffMode] = useState<'line' | 'word'>('line');

  // Calculate diff when texts change
  useEffect(() => {
    if (textA.trim() && textB.trim()) {
      calculateDiff();
    } else {
      setDiffResult({ added: [], removed: [], unchanged: [] });
    }
  }, [textA, textB, diffMode]);

  // Calculate differences between two texts
  const calculateDiff = () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        if (diffMode === 'line') {
          const linesA = textA.split('\n');
          const linesB = textB.split('\n');
          
          const added: string[] = [];
          const removed: string[] = [];
          const unchanged: string[] = [];
          
          // Simple line-by-line diff algorithm
          const linesInBoth = new Set<string>();
          
          // Find unchanged lines
          linesA.forEach(line => {
            if (linesB.includes(line)) {
              linesInBoth.add(line);
              unchanged.push(line);
            } else {
              removed.push(line);
            }
          });
          
          // Find added lines
          linesB.forEach(line => {
            if (!linesA.includes(line)) {
              added.push(line);
            }
          });
          
          setDiffResult({ added, removed, unchanged });
        } else {
          // Word-by-word diff (simplified)
          const wordsA = textA.split(/\s+/);
          const wordsB = textB.split(/\s+/);
          
          const added: string[] = [];
          const removed: string[] = [];
          const unchanged: string[] = [];
          
          // Find unchanged words
          wordsA.forEach(word => {
            if (wordsB.includes(word)) {
              unchanged.push(word);
            } else {
              removed.push(word);
            }
          });
          
          // Find added words
          wordsB.forEach(word => {
            if (!wordsA.includes(word)) {
              added.push(word);
            }
          });
          
          setDiffResult({ added, removed, unchanged });
        }
      } catch (error) {
        console.error('Error calculating diff:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Small delay to show loading state
  };

  // Clear both text areas
  const clearTexts = () => {
    setTextA('');
    setTextB('');
    setDiffResult({ added: [], removed: [], unchanged: [] });
  };

  // Swap text A and text B
  const swapTexts = () => {
    const temp = textA;
    setTextA(textB);
    setTextB(temp);
  };

  // Copy diff result to clipboard
  const copyDiffResult = () => {
    const result = `
--- Text A
+++ Text B

${diffResult.removed.map(line => `- ${line}`).join('\n')}
${diffResult.added.map(line => `+ ${line}`).join('\n')}
${diffResult.unchanged.map(line => `  ${line}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Generate HTML for displaying diff
  const renderDiffHTML = () => {
    if (diffMode === 'line') {
      return (
        <div className="font-mono text-sm whitespace-pre-wrap">
          {diffResult.removed.map((line, index) => (
            <div key={`removed-${index}`} className="bg-red-900/30 text-red-200 px-2 py-0.5">
              - {line}
            </div>
          ))}
          {diffResult.added.map((line, index) => (
            <div key={`added-${index}`} className="bg-green-900/30 text-green-200 px-2 py-0.5">
              + {line}
            </div>
          ))}
          {diffResult.unchanged.map((line, index) => (
            <div key={`unchanged-${index}`} className="text-slate-300 px-2 py-0.5">
              &nbsp;&nbsp;{line}
            </div>
          ))}
        </div>
      );
    } else {
      // Word diff view
      return (
        <div className="font-mono text-sm">
          <div className="mb-4">
            <h4 className="text-white text-sm font-medium mb-1">Removed Words:</h4>
            <div className="flex flex-wrap gap-1">
              {diffResult.removed.map((word, index) => (
                <span key={`removed-${index}`} className="bg-red-900/30 text-red-200 px-1.5 py-0.5 rounded">
                  {word}
                </span>
              ))}
              {diffResult.removed.length === 0 && (
                <span className="text-slate-400">None</span>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-white text-sm font-medium mb-1">Added Words:</h4>
            <div className="flex flex-wrap gap-1">
              {diffResult.added.map((word, index) => (
                <span key={`added-${index}`} className="bg-green-900/30 text-green-200 px-1.5 py-0.5 rounded">
                  {word}
                </span>
              ))}
              {diffResult.added.length === 0 && (
                <span className="text-slate-400">None</span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-medium mb-1">Unchanged Words:</h4>
            <div className="flex flex-wrap gap-1">
              {diffResult.unchanged.map((word, index) => (
                <span key={`unchanged-${index}`} className="bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded">
                  {word}
                </span>
              ))}
              {diffResult.unchanged.length === 0 && (
                <span className="text-slate-400">None</span>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  // Summary of differences
  const diffSummary = () => {
    if (!textA.trim() || !textB.trim()) return null;
    
    return (
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-900 p-3 rounded border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Added</div>
          <div className="text-green-400 font-medium">{diffResult.added.length} {diffMode === 'line' ? 'lines' : 'words'}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Removed</div>
          <div className="text-red-400 font-medium">{diffResult.removed.length} {diffMode === 'line' ? 'lines' : 'words'}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Unchanged</div>
          <div className="text-blue-400 font-medium">{diffResult.unchanged.length} {diffMode === 'line' ? 'lines' : 'words'}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Diff Checker</h2>
        <p className="text-slate-300">Compare two texts and find the differences</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-white font-medium mr-3">Diff Mode:</span>
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setDiffMode('line')}
                  className={`px-4 py-2 text-sm ${
                    diffMode === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Line by Line
                </button>
                <button
                  onClick={() => setDiffMode('word')}
                  className={`px-4 py-2 text-sm ${
                    diffMode === 'word'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Word by Word
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={swapTexts}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
              title="Swap texts"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap
            </button>
            <button
              onClick={clearTexts}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
              title="Clear both texts"
            >
              <Trash className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Text A (Original)
            </label>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none font-mono"
              placeholder="Paste your original text here..."
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">
              Text B (Changed)
            </label>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none font-mono"
              placeholder="Paste your modified text here..."
            />
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Differences</h3>
            {(diffResult.added.length > 0 || diffResult.removed.length > 0) && (
              <button
                onClick={copyDiffResult}
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
                    Copy Diff
                  </>
                )}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="bg-slate-900 rounded-lg p-8 border border-slate-700 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mr-3" />
              <span className="text-slate-300">Calculating differences...</span>
            </div>
          ) : (
            <>
              {diffSummary()}
              
              {(textA.trim() && textB.trim()) ? (
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 overflow-auto max-h-96">
                  {renderDiffHTML()}
                </div>
              ) : (
                <div className="bg-slate-900 rounded-lg p-8 border border-slate-700 flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-slate-600 mb-3" />
                  <h3 className="text-slate-400 text-lg font-medium mb-1">No differences to show</h3>
                  <p className="text-slate-500">
                    Enter text in both fields to see the differences
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiffChecker; 