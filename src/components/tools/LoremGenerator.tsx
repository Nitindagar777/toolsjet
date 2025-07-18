import React, { useState } from 'react';
import { FileText, Copy, Check, RefreshCw } from 'lucide-react';

const LoremGenerator: React.FC = () => {
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
    'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
    'odit', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'ratione',
    'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci',
    'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'quaerat'
  ];

  const getRandomWord = (): string => {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
  };

  const generateWords = (wordCount: number): string => {
    const words: string[] = [];
    
    if (startWithLorem && wordCount > 0) {
      words.push('Lorem');
      wordCount--;
    }
    
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord());
    }
    
    return words.join(' ');
  };

  const generateSentence = (): string => {
    const wordCount = Math.floor(Math.random() * 10) + 8; // 8-17 words
    const sentence = generateWords(wordCount);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
    const sentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  const generateText = () => {
    let result = '';
    
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        const sentences: string[] = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      case 'paragraphs':
        const paragraphs: string[] = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
    }
    
    setGeneratedText(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  React.useEffect(() => {
    generateText();
  }, [type, count, startWithLorem]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Lorem Ipsum Generator</h2>
        <p className="text-slate-300">Generate placeholder text for your designs and layouts</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Generator Options</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'paragraphs' | 'words' | 'sentences')}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm mb-2">Count</label>
            <input
              type="number"
              min="1"
              max={type === 'words' ? 1000 : type === 'sentences' ? 50 : 20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300 text-sm">Start with "Lorem"</span>
            </label>
          </div>
        </div>

        <button
          onClick={generateText}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5" />
          Generate New Text
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Generated Text</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            disabled={!generatedText}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        
        <textarea
          value={generatedText}
          readOnly
          className="w-full h-64 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 resize-none"
          placeholder="Generated lorem ipsum text will appear here..."
        />
        
        <div className="mt-3 flex justify-between text-slate-400 text-sm">
          <span>Words: {generatedText.split(/\s+/).filter(word => word.length > 0).length}</span>
          <span>Characters: {generatedText.length}</span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About Lorem Ipsum</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Lorem Ipsum is placeholder text used in the printing and typesetting industry</p>
          <p>• It's been the industry standard since the 1500s</p>
          <p>• Perfect for mockups, wireframes, and design layouts</p>
          <p>• Helps focus on design without being distracted by readable content</p>
        </div>
      </div>
    </div>
  );
};

export default LoremGenerator;