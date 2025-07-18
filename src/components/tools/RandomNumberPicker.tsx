import React, { useState } from 'react';
import { Shuffle, Settings, History } from 'lucide-react';

const RandomNumberPicker: React.FC = () => {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<Array<{ numbers: number[], timestamp: Date }>>([]);

  const generateNumbers = () => {
    if (minValue > maxValue) {
      alert('Minimum value cannot be greater than maximum value');
      return;
    }

    if (!allowDuplicates && quantity > (maxValue - minValue + 1)) {
      alert('Cannot generate more unique numbers than available in the range');
      return;
    }

    const numbers: number[] = [];
    const availableNumbers = [];

    // If duplicates are not allowed, create array of available numbers
    if (!allowDuplicates) {
      for (let i = minValue; i <= maxValue; i++) {
        availableNumbers.push(i);
      }
    }

    for (let i = 0; i < quantity; i++) {
      let randomNumber: number;
      
      if (allowDuplicates) {
        randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      } else {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        randomNumber = availableNumbers[randomIndex];
        availableNumbers.splice(randomIndex, 1);
      }
      
      numbers.push(randomNumber);
    }

    setGeneratedNumbers(numbers);
    
    // Add to history
    const newEntry = { numbers: [...numbers], timestamp: new Date() };
    setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Random Number Picker</h2>
        <p className="text-slate-300">Generate random numbers within your specified range</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Generator Settings</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Minimum Value
            </label>
            <input
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Maximum Value
            </label>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300">Allow Duplicates</span>
            </label>
          </div>
        </div>

        <button
          onClick={generateNumbers}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          <Shuffle className="w-5 h-5" />
          Generate Random Numbers
        </button>
      </div>

      {generatedNumbers.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Shuffle className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Generated Numbers</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {generatedNumbers.map((number, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-lg p-4 border border-slate-600 text-center"
              >
                <div className="text-2xl font-bold text-white">{number}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-slate-300 text-sm">
            {generatedNumbers.length === 1 ? '1 number' : `${generatedNumbers.length} numbers`} generated
            {!allowDuplicates && ' (unique)'}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-purple-400" />
              <span className="text-white font-medium">Generation History</span>
            </div>
            <button
              onClick={clearHistory}
              className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
            >
              Clear History
            </button>
          </div>
          
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-400 text-sm">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {entry.numbers.length} numbers
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.numbers.map((number, numIndex) => (
                    <span
                      key={numIndex}
                      className="bg-slate-700 text-white px-2 py-1 rounded text-sm"
                    >
                      {number}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">Tips & Uses</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Perfect for games, raffles, and random selections</p>
          <p>• Use "Allow Duplicates" for situations where numbers can repeat</p>
          <p>• Generate lottery numbers, passwords, or random samples</p>
          <p>• History keeps track of your last 10 generations</p>
        </div>
      </div>
    </div>
  );
};

export default RandomNumberPicker;