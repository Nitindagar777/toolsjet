import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check } from 'lucide-react';

const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const generateHash = async (text: string, algorithm: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    try {
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      return 'Error generating hash';
    }
  };

  const generateAllHashes = async () => {
    if (!input.trim()) {
      setHashes({});
      return;
    }

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const newHashes: Record<string, string> = {};

    for (const algorithm of algorithms) {
      newHashes[algorithm] = await generateHash(input, algorithm);
    }

    // Simple MD5-like hash (not cryptographically secure, just for demo)
    newHashes['MD5 (Demo)'] = simpleHash(input);

    setHashes(newHashes);
  };

  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  const copyToClipboard = async (hash: string, algorithm: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(algorithm);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateAllHashes();
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const hashAlgorithms = [
    { name: 'MD5 (Demo)', description: 'Simple hash for demonstration (not secure)' },
    { name: 'SHA-1', description: '160-bit hash function (deprecated for security)' },
    { name: 'SHA-256', description: '256-bit secure hash algorithm' },
    { name: 'SHA-384', description: '384-bit secure hash algorithm' },
    { name: 'SHA-512', description: '512-bit secure hash algorithm' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Hash Generator</h2>
        <p className="text-slate-300">Generate cryptographic hashes for text input</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Input Text</span>
        </div>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Enter text to generate hashes..."
        />
        
        <div className="mt-3 text-slate-400 text-sm">
          Characters: {input.length}
        </div>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          {hashAlgorithms.map((algorithm) => {
            const hash = hashes[algorithm.name];
            if (!hash) return null;

            return (
              <div key={algorithm.name} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-white font-medium">{algorithm.name}</h3>
                    <p className="text-slate-400 text-sm">{algorithm.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(hash, algorithm.name)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
                  >
                    {copiedHash === algorithm.name ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-3 border border-slate-600">
                  <div className="text-white font-mono text-sm break-all">
                    {hash}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About Hash Functions</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Hash functions create fixed-size outputs from variable-size inputs</p>
          <p>• Same input always produces the same hash (deterministic)</p>
          <p>• Small changes in input create completely different hashes</p>
          <p>• Used for data integrity, password storage, and digital signatures</p>
          <p>• SHA-256 and SHA-512 are currently considered secure</p>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;