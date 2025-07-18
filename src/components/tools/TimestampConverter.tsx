import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Copy, Check } from 'lucide-react';

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const convertTimestampToDate = (ts: string) => {
    if (!ts) return '';
    
    const num = parseInt(ts);
    if (isNaN(num)) return 'Invalid timestamp';
    
    // Handle both seconds and milliseconds
    const date = new Date(num.toString().length === 10 ? num * 1000 : num);
    
    if (isNaN(date.getTime())) return 'Invalid timestamp';
    
    return date.toISOString();
  };

  const convertDateToTimestamp = (dt: string) => {
    if (!dt) return '';
    
    const date = new Date(dt);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return Math.floor(date.getTime() / 1000).toString();
  };

  const formatDate = (date: Date) => {
    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      timestamp: Math.floor(date.getTime() / 1000),
      timestampMs: date.getTime(),
      date: date.toDateString(),
      time: date.toTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const copyToClipboard = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(type);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy value:', err);
    }
  };

  const setCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    setDateTime(now.toISOString().slice(0, 16));
  };

  const timestampDate = timestamp ? new Date(parseInt(timestamp) * (timestamp.length === 10 ? 1000 : 1)) : null;
  const dateTimeTimestamp = dateTime ? new Date(dateTime) : null;
  const currentFormatted = formatDate(currentTime);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Timestamp Converter</h2>
        <p className="text-slate-300">Convert between timestamps and human-readable dates</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Current Time</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {currentFormatted.timestamp}
              </div>
              <div className="text-slate-300 text-sm">Unix Timestamp</div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
            <div className="text-center">
              <div className="text-lg font-medium text-white mb-1">
                {currentFormatted.local}
              </div>
              <div className="text-slate-300 text-sm">Local Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Timestamp to Date</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="flex-1 bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter timestamp (seconds or milliseconds)"
              />
              <button
                onClick={setCurrentTimestamp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
              >
                Now
              </button>
            </div>
            
            {timestampDate && !isNaN(timestampDate.getTime()) && (
              <div className="space-y-3">
                {Object.entries(formatDate(timestampDate)).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-600">
                    <div>
                      <div className="text-slate-300 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-white font-mono text-sm">{value}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(value.toString(), `timestamp-${key}`)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
                    >
                      {copiedValue === `timestamp-${key}` ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-400" />
            <span className="text-white font-medium">Date to Timestamp</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="flex-1 bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={setCurrentDateTime}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
              >
                Now
              </button>
            </div>
            
            {dateTimeTimestamp && !isNaN(dateTimeTimestamp.getTime()) && (
              <div className="space-y-3">
                {Object.entries(formatDate(dateTimeTimestamp)).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-600">
                    <div>
                      <div className="text-slate-300 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-white font-mono text-sm">{value}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(value.toString(), `datetime-${key}`)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
                    >
                      {copiedValue === `datetime-${key}` ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About Unix Timestamps</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Unix timestamp represents seconds since January 1, 1970 (UTC)</p>
          <p>• Commonly used in databases, APIs, and programming languages</p>
          <p>• Can be in seconds (10 digits) or milliseconds (13 digits)</p>
          <p>• Universal format that works across different time zones</p>
        </div>
      </div>
    </div>
  );
};

export default TimestampConverter;