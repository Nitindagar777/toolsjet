import React, { useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import Header from './components/Header';
import ToolGrid from './components/ToolGrid';
import WordCounter from './components/tools/WordCounter';
import PasswordGenerator from './components/tools/PasswordGenerator';
import TextCaseConverter from './components/tools/TextCaseConverter';
import Base64Converter from './components/tools/Base64Converter';
import AgeCalculator from './components/tools/AgeCalculator';
import RandomNumberPicker from './components/tools/RandomNumberPicker';
import QRCodeGenerator from './components/tools/QRCodeGenerator';
import ImageCompressor from './components/tools/ImageCompressor';
import URLShortener from './components/tools/URLShortener';
import ColorPicker from './components/tools/ColorPicker';
import UnitConverter from './components/tools/UnitConverter';
import JSONFormatter from './components/tools/JSONFormatter';
import HashGenerator from './components/tools/HashGenerator';
import LoremGenerator from './components/tools/LoremGenerator';
import MarkdownPreview from './components/tools/MarkdownPreview';
import TimestampConverter from './components/tools/TimestampConverter';
import YouTubeThumbnailDownloader from './components/tools/YouTubeThumbnailDownloader';
import PDFToWordConverter from './components/tools/PDFToWordConverter';
import CurrencyConverter from './components/tools/CurrencyConverter';
import RegexTester from './components/tools/RegexTester';
import CodeBeautifier from './components/tools/CodeBeautifier';
import CSVtoJSON from './components/tools/CSVtoJSON';
import PasswordStrengthChecker from './components/tools/PasswordStrengthChecker';
import DiffChecker from './components/tools/DiffChecker';
import TextTranslator from './components/tools/TextTranslator';
import PomodoroTimer from './components/tools/PomodoroTimer';
import NoteTaker from './components/tools/NoteTaker';

function App() {
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSection, setCurrentSection] = useState<string>('home');

  const handleToolSelect = (toolId: string) => {
    setCurrentTool(toolId);
    setSearchQuery(''); // Clear search when selecting a tool
  };

  const handleBackToHome = () => {
    setCurrentTool(null);
    setCurrentSection('home');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    setCurrentTool(null);
  };

  const renderTool = () => {
    switch (currentTool) {
      case 'word-counter':
        return <WordCounter />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'text-case-converter':
        return <TextCaseConverter />;
      case 'base64-converter':
        return <Base64Converter />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'random-number-picker':
        return <RandomNumberPicker />;
      case 'qr-code-generator':
        return <QRCodeGenerator />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'url-shortener':
        return <URLShortener />;
      case 'color-picker':
        return <ColorPicker />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'json-formatter':
        return <JSONFormatter />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'lorem-generator':
        return <LoremGenerator />;
      case 'markdown-preview':
        return <MarkdownPreview />;
      case 'timestamp-converter':
        return <TimestampConverter />;
      case 'youtube-thumbnail':
        return <YouTubeThumbnailDownloader />;
      case 'pdf-to-word':
        return <PDFToWordConverter />;
      case 'currency-converter':
        return <CurrencyConverter />;
      case 'regex-tester':
        return <RegexTester />;
      case 'code-beautifier':
        return <CodeBeautifier />;
      case 'csv-to-json':
        return <CSVtoJSON />;
      case 'password-strength-checker':
        return <PasswordStrengthChecker />;
      case 'diff-checker':
        return <DiffChecker />;
      case 'text-translator':
        return <TextTranslator />;
      case 'pomodoro-timer':
        return <PomodoroTimer />;
      case 'note-taker':
        return <NoteTaker />;
      // For the remaining tools, we'll show a "Coming Soon" message
      case 'html-entity-encoder':
      case 'image-to-base64':
      case 'uuid-generator':
      case 'cron-expression-generator':
      case 'css-minifier':
      case 'js-minifier':
      case 'sql-formatter':
      case 'xml-formatter':
      case 'yaml-validator':
      case 'jwt-decoder':
      case 'url-parser':
      case 'text-diff':
      case 'error-lookup':
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-blue-500/20 p-4 rounded-full mb-4">
              <Home className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-slate-300 max-w-md">
              This tool is currently under development and will be available soon. 
              Check back later for updates!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSection = () => {
    if (currentTool) {
  return (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Tools
            </button>
            {renderTool()}
          </div>
      );
    }

    switch (currentSection) {
      case 'about':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">About ToolsJet</h2>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-300 mb-4">
                ToolsJet is a comprehensive collection of free online utilities designed to make your digital life easier.
                Our platform provides a wide range of tools for various purposes - from text manipulation to file conversion,
                all accessible in one place with a clean, user-friendly interface.
              </p>
              <p className="text-slate-300 mb-4">
                Whether you're a developer looking for quick utilities like Base64 encoding or JSON formatting,
                a designer needing color pickers and lorem ipsum generators, or just someone who wants to compress
                images or generate QR codes, ToolsJet has you covered.
              </p>
              <p className="text-slate-300">
                All tools are completely free to use and run directly in your browser, with no need to install
                additional software. We're constantly adding new tools and improving existing ones to better serve your needs.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-300 mb-3">
                Have questions, suggestions, or feedback? We'd love to hear from you!
              </p>
              <p className="text-slate-300 mb-6 flex items-center justify-center">
                <span className="text-blue-400">Email:</span> 
                <a href="mailto:kinghunter0800@gmail.com" className="ml-2 text-white hover:text-blue-400 transition-colors">
                  kinghunter0800@gmail.com
                </a>
              </p>
              
              <form 
                className="space-y-4"
                action="mailto:kinghunter0800@gmail.com" 
                method="post" 
                encType="text/plain"
              >
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Name</label>
                  <input 
                    type="text"
                    name="name"
                    className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Message</label>
                  <textarea 
                    name="message"
                    className="w-full h-32 bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Your message"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Tools<span className="text-blue-400">Jet</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Your go-to hub for free, fast, and useful online tools. 
                Simple utilities to make your digital life easier.
              </p>
            </div>
            
            <ToolGrid 
              onToolSelect={handleToolSelect} 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header onNavigate={handleNavigate} />
      
      <main className="container mx-auto px-4 py-8">
        {renderSection()}
      </main>

      <footer className="border-t border-slate-700 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-3 md:mb-0">
              &copy; {new Date().getFullYear()} ToolsJet. All tools are free to use.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Contact:</span>
              <a 
                href="mailto:kinghunter0800@gmail.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                kinghunter0800@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;