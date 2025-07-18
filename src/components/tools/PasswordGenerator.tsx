import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Shield } from 'lucide-react';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let characters = '';
    if (options.uppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) characters += '0123456789';
    if (options.symbols) characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (options.excludeSimilar) {
      characters = characters.replace(/[il1Lo0O]/g, '');
    }

    if (!characters) return '';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGenerate = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Strong', color: 'bg-green-500' };
  };

  useEffect(() => {
    handleGenerate();
  }, [length, options]);

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Password Generator</h2>
        <p className="text-slate-300">Generate secure passwords with custom options</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Generated Password</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-slate-900 rounded-lg p-4 border border-slate-600">
            <div className="font-mono text-white text-lg break-all">
              {password || 'Click Generate to create a password'}
            </div>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            disabled={!password}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {password && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">Password Strength</span>
              <span className={`text-sm font-medium ${strength.color.replace('bg-', 'text-')}`}>
                {strength.level}
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} transition-all duration-300`} 
                   style={{ width: `${(getPasswordStrength().level === 'Weak' ? 33 : getPasswordStrength().level === 'Medium' ? 66 : 100)}%` }}>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5" />
          Generate New Password
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-4">Password Options</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={(e) => setOptions(prev => ({...prev, uppercase: e.target.checked}))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300">Uppercase Letters (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) => setOptions(prev => ({...prev, lowercase: e.target.checked}))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300">Lowercase Letters (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => setOptions(prev => ({...prev, numbers: e.target.checked}))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => setOptions(prev => ({...prev, symbols: e.target.checked}))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300">Symbols (!@#$%^&*)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer md:col-span-2">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => setOptions(prev => ({...prev, excludeSimilar: e.target.checked}))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300">Exclude Similar Characters (i, l, 1, L, o, 0, O)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;