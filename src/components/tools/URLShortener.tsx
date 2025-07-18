import React, { useState } from 'react';
import { Link, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import axios from 'axios';

const URLShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateShortUrl = async () => {
    setError(null);
    
    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      // Using TinyURL API for URL shortening
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`);
      
      if (response.data) {
        setShortUrl(response.data);
      } else {
        throw new Error('Failed to generate short URL');
      }
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError('Failed to generate short URL. Please try again.');
      
      // Fallback to local generation if API fails
      const shortCode = Math.random().toString(36).substring(2, 8);
      const shortened = `https://toolsjet.co/${shortCode}`;
      setShortUrl(shortened);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">URL Shortener</h2>
        <p className="text-slate-300">Create short, shareable links from long URLs</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Link className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Enter Long URL</span>
        </div>
        
        <div className="space-y-4">
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none"
            placeholder="https://example.com/very/long/url/path"
          />
          
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            onClick={generateShortUrl}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Shortening URL...
              </>
            ) : (
              <>
                <Link className="w-5 h-5" />
                Shorten URL
              </>
            )}
          </button>
        </div>
      </div>

      {shortUrl && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <ExternalLink className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Shortened URL</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-900 rounded-lg p-4 border border-slate-600">
              <div className="text-white font-mono break-all">{shortUrl}</div>
            </div>
            <button
              onClick={copyToClipboard}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="mt-4">
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 w-full"
            >
              <ExternalLink className="w-4 h-4" />
              Open URL
            </a>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">Benefits of Short URLs</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Easier to share on social media and messaging platforms</p>
          <p>• Better for print materials and presentations</p>
          <p>• Cleaner appearance in emails and documents</p>
          <p>• Track clicks and engagement (with analytics)</p>
        </div>
      </div>
    </div>
  );
};

export default URLShortener;