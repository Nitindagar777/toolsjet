import React from 'react';
import { FileText, Shield, Type, Code, Calendar, Shuffle, QrCode, Image, FileCog as FileConversion, Download, Link, Palette, Calculator, Hash, Clock, Search, DollarSign, FileCode, FileSpreadsheet, FileJson, Globe, Timer, StickyNote, AlertTriangle, ArrowLeftRight } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  available: boolean;
}

const tools: Tool[] = [
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, and paragraphs in your text',
    icon: <FileText className="w-6 h-6" />,
    category: 'Text',
    available: true
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords with custom options',
    icon: <Shield className="w-6 h-6" />,
    category: 'Security',
    available: true
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text to different cases (upper, lower, title)',
    icon: <Type className="w-6 h-6" />,
    category: 'Text',
    available: true
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: <Code className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate age in years, months, days, and more',
    icon: <Calendar className="w-6 h-6" />,
    category: 'Calculator',
    available: true
  },
  {
    id: 'random-number-picker',
    name: 'Random Number Picker',
    description: 'Generate random numbers within specified ranges',
    icon: <Shuffle className="w-6 h-6" />,
    category: 'Generator',
    available: true
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for text, URLs, and more',
    icon: <QrCode className="w-6 h-6" />,
    category: 'Generator',
    available: true
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images while maintaining quality',
    icon: <Image className="w-6 h-6" />,
    category: 'Image',
    available: true
  },
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    description: 'Create short, shareable links from long URLs',
    icon: <Link className="w-6 h-6" />,
    category: 'Utility',
    available: true
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and get values in different formats',
    icon: <Palette className="w-6 h-6" />,
    category: 'Design',
    available: true
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    icon: <Calculator className="w-6 h-6" />,
    category: 'Calculator',
    available: true
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, minify, and validate JSON data',
    icon: <Code className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate cryptographic hashes (MD5, SHA-1, SHA-256)',
    icon: <Hash className="w-6 h-6" />,
    category: 'Security',
    available: true
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs and layouts',
    icon: <FileText className="w-6 h-6" />,
    category: 'Text',
    available: true
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Write and preview Markdown in real-time',
    icon: <FileText className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between timestamps and human-readable dates',
    icon: <Clock className="w-6 h-6" />,
    category: 'Utility',
    available: true
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    description: 'Convert PDF files to Word documents',
    icon: <FileConversion className="w-6 h-6" />,
    category: 'Converter',
    available: true
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail Downloader',
    description: 'Download YouTube video thumbnails',
    icon: <Download className="w-6 h-6" />,
    category: 'Downloader',
    available: true
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    description: 'Convert between world currencies with live rates',
    icon: <DollarSign className="w-6 h-6" />,
    category: 'Calculator',
    available: true
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    icon: <Search className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'code-beautifier',
    name: 'Code Beautifier',
    description: 'Format and beautify code in various languages',
    icon: <FileCode className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Convert CSV data to JSON format',
    icon: <FileSpreadsheet className="w-6 h-6" />,
    category: 'Converter',
    available: true
  },
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    description: 'Check how strong your password is',
    icon: <Shield className="w-6 h-6" />,
    category: 'Security',
    available: true
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two texts and find the differences',
    icon: <ArrowLeftRight className="w-6 h-6" />,
    category: 'Text',
    available: true
  },
  {
    id: 'text-translator',
    name: 'Text Translator',
    description: 'Translate text between different languages',
    icon: <Globe className="w-6 h-6" />,
    category: 'Text',
    available: true
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Boost productivity with timed work sessions',
    icon: <Timer className="w-6 h-6" />,
    category: 'Productivity',
    available: true
  },
  {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Create, edit, and organize your notes',
    icon: <StickyNote className="w-6 h-6" />,
    category: 'Productivity',
    available: true
  },
  {
    id: 'html-entity-encoder',
    name: 'HTML Entity Encoder',
    description: 'Convert text to HTML entities and vice versa',
    icon: <Code className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 encoded strings',
    icon: <Image className="w-6 h-6" />,
    category: 'Converter',
    available: true
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs/GUIDs',
    icon: <Hash className="w-6 h-6" />,
    category: 'Generator',
    available: true
  },
  {
    id: 'cron-expression-generator',
    name: 'Cron Expression Generator',
    description: 'Create and validate cron expressions',
    icon: <Clock className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Minify CSS code to reduce file size',
    icon: <FileCode className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'js-minifier',
    name: 'JavaScript Minifier',
    description: 'Minify JavaScript code to reduce file size',
    icon: <FileCode className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format SQL queries for better readability',
    icon: <FileCode className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format XML documents for better readability',
    icon: <FileCode className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'yaml-validator',
    name: 'YAML Validator',
    description: 'Validate and format YAML documents',
    icon: <FileCode className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens',
    icon: <FileJson className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'url-parser',
    name: 'URL Parser',
    description: 'Parse and analyze URL components',
    icon: <Link className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'text-diff',
    name: 'Text Diff Visualizer',
    description: 'Visualize differences between text snippets',
    icon: <ArrowLeftRight className="w-6 h-6" />,
    category: 'Developer',
    available: true
  },
  {
    id: 'error-lookup',
    name: 'HTTP Error Lookup',
    description: 'Look up HTTP status codes and error messages',
    icon: <AlertTriangle className="w-6 h-6" />,
    category: 'Developer',
    available: true
  }
];

interface ToolGridProps {
  onToolSelect: (toolId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ onToolSelect, searchQuery, onSearchChange }) => {
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const categories = Array.from(new Set(tools.map(tool => tool.category)));
  const filteredCategories = categories.filter(category =>
    filteredTools.some(tool => tool.category === category)
  );

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors duration-200"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 text-center text-slate-400 text-sm">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
      
      {searchQuery ? (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <div
                key={tool.id}
                onClick={() => tool.available && onToolSelect(tool.id)}
                className={`bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all duration-200 group ${
                  tool.available 
                    ? 'cursor-pointer hover:bg-slate-700' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tool.available 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-600 text-slate-400'
                  }`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                </div>
                <p className="text-slate-300 text-sm">{tool.description}</p>
                <div className="mt-2">
                  <span className="inline-block bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                    {tool.category}
                  </span>
                </div>
                {!tool.available && (
                  <div className="mt-3">
                    <span className="inline-block bg-slate-700 text-slate-400 text-xs px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No tools found</h3>
              <p className="text-slate-500">Try searching with different keywords</p>
            </div>
          )}
        </div>
      ) : (
        filteredCategories.map(category => (
        <div key={category}>
          <h2 className="text-2xl font-semibold text-white mb-4">{category} Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(tool => tool.category === category)
              .map(tool => (
                <div
                  key={tool.id}
                  onClick={() => tool.available && onToolSelect(tool.id)}
                  className={`bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all duration-200 group ${
                    tool.available 
                      ? 'cursor-pointer hover:bg-slate-700' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tool.available 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-600 text-slate-400'
                    }`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                  </div>
                  <p className="text-slate-300 text-sm">{tool.description}</p>
                  {!tool.available && (
                    <div className="mt-3">
                      <span className="inline-block bg-slate-700 text-slate-400 text-xs px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
        ))
      )}
    </div>
  );
};

export default ToolGrid;