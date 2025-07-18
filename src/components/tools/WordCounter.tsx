import React, { useState, useEffect } from 'react';
import { FileText, Hash, Type, Clock } from 'lucide-react';

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
      const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
      const readingTime = Math.ceil(words / 200); // Average reading speed

      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        readingTime
      });
    };

    calculateStats();
  }, [text]);

  const statCards = [
    { label: 'Characters', value: stats.characters, icon: <Type className="w-5 h-5" /> },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces, icon: <Type className="w-5 h-5" /> },
    { label: 'Words', value: stats.words, icon: <FileText className="w-5 h-5" /> },
    { label: 'Sentences', value: stats.sentences, icon: <Hash className="w-5 h-5" /> },
    { label: 'Paragraphs', value: stats.paragraphs, icon: <Hash className="w-5 h-5" /> },
    { label: 'Reading Time (min)', value: stats.readingTime, icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Word Counter</h2>
        <p className="text-slate-300">Analyze your text with detailed statistics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-blue-400">{stat.icon}</div>
              <span className="text-slate-300 text-sm">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <label className="block text-white font-medium mb-3">
          Enter your text:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Start typing or paste your text here..."
        />
      </div>
    </div>
  );
};

export default WordCounter;