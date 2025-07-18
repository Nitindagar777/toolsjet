import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle, Check, Info } from 'lucide-react';

const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [strength, setStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({
    score: 0,
    label: 'None',
    color: 'bg-slate-700'
  });
  const [feedback, setFeedback] = useState<string[]>([]);

  // Check password strength when password changes
  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        label: 'None',
        color: 'bg-slate-700'
      });
      setFeedback([]);
      return;
    }

    // Calculate password strength
    const strengthScore = calculatePasswordStrength(password);
    setStrength(strengthScore);
    
    // Generate feedback
    setFeedback(generateFeedback(password, strengthScore.score));
  }, [password]);

  // Calculate password strength
  const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Patterns and repetition penalties
    if (/(.)\1\1/.test(password)) score -= 1; // Three or more identical characters in a row
    if (/^[a-zA-Z]+$/.test(password) || /^[0-9]+$/.test(password)) score -= 1; // Only letters or only numbers
    if (/password/i.test(password) || /123/.test(password)) score -= 1; // Common patterns
    
    // Ensure score is between 0 and 5
    score = Math.max(0, Math.min(5, score));
    
    // Map score to label and color
    const strengthMap = [
      { label: 'Very Weak', color: 'bg-red-600' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
      { label: 'Very Strong', color: 'bg-green-600' }
    ];
    
    return {
      score,
      label: strengthMap[score].label,
      color: strengthMap[score].color
    };
  };

  // Generate feedback based on password and score
  const generateFeedback = (password: string, score: number): string[] => {
    const feedback: string[] = [];
    
    // Length feedback
    if (password.length < 8) {
      feedback.push('Add more characters (at least 8 characters recommended)');
    }
    
    // Character variety feedback
    if (!/[a-z]/.test(password)) {
      feedback.push('Add lowercase letters');
    }
    if (!/[A-Z]/.test(password)) {
      feedback.push('Add uppercase letters');
    }
    if (!/[0-9]/.test(password)) {
      feedback.push('Add numbers');
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push('Add special characters (e.g., !@#$%^&*)');
    }
    
    // Pattern feedback
    if (/(.)\1\1/.test(password)) {
      feedback.push('Avoid repeated characters (e.g., "aaa")');
    }
    if (/^[a-zA-Z]+$/.test(password)) {
      feedback.push('Avoid using only letters');
    }
    if (/^[0-9]+$/.test(password)) {
      feedback.push('Avoid using only numbers');
    }
    if (/password/i.test(password)) {
      feedback.push('Avoid using the word "password"');
    }
    if (/123/.test(password)) {
      feedback.push('Avoid common sequences like "123"');
    }
    
    // If score is high enough and we still have feedback, limit it
    if (score >= 4 && feedback.length > 0) {
      return feedback.slice(0, 1);
    }
    
    return feedback;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Password Strength Checker</h2>
        <p className="text-slate-300">Check how strong your password is</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Enter Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg p-3 pr-10 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="Type your password here..."
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-white font-medium">
              Password Strength
            </label>
            <span className={`text-sm font-medium ${
              strength.score <= 1 ? 'text-red-400' : 
              strength.score <= 2 ? 'text-yellow-400' : 
              strength.score <= 3 ? 'text-blue-400' : 'text-green-400'
            }`}>
              {strength.label}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${strength.color} transition-all duration-300 ease-out`}
              style={{ width: `${(strength.score / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Strength Analysis */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h3 className="text-white font-medium mb-3">Analysis</h3>
          
          {password ? (
            <>
              {/* Feedback */}
              {feedback.length > 0 ? (
                <div className="space-y-2 mb-4">
                  <h4 className="text-slate-300 text-sm font-medium">Suggestions to improve:</h4>
                  <ul className="space-y-1">
                    {feedback.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-400">Your password looks good!</span>
                </div>
              )}

              {/* Password Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Length</div>
                  <div className="text-white font-medium">{password.length} characters</div>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Character Types</div>
                  <div className="text-white font-medium">
                    {[
                      /[a-z]/.test(password) ? 'a-z' : '',
                      /[A-Z]/.test(password) ? 'A-Z' : '',
                      /[0-9]/.test(password) ? '0-9' : '',
                      /[^a-zA-Z0-9]/.test(password) ? '#$&' : ''
                    ].filter(Boolean).join(', ') || 'None'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-6 text-slate-400">
              <Info className="w-5 h-5 mr-2" />
              Enter a password to see analysis
            </div>
          )}
        </div>

        {/* Password Tips */}
        <div className="mt-6 bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
          <h3 className="text-blue-300 font-medium mb-2">Tips for Strong Passwords</h3>
          <ul className="space-y-1 text-sm text-blue-200/80">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              Use at least 12 characters, ideally more
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              Mix uppercase letters, lowercase letters, numbers, and symbols
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              Avoid common words, phrases, or personal information
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              Use a different password for each account
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              Consider using a password manager to generate and store passwords
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker; 