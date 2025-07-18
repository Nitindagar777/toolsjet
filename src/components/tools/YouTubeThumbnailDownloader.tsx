import React, { useState } from 'react';
import { Youtube, Download, Search, ExternalLink, AlertCircle } from 'lucide-react';

const YouTubeThumbnailDownloader: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (url: string): string | null => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/[^\/]+\/\?v=([^&]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setError(null);
    setVideoId('');
  };

  const handleSubmit = () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }

    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
      setError(null);
    } else {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL');
      setVideoId('');
    }
  };

  const thumbnailTypes = [
    { name: 'Max Resolution', code: 'maxresdefault', quality: 'HD (1280x720)' },
    { name: 'High Quality', code: 'hqdefault', quality: 'HQ (480x360)' },
    { name: 'Medium Quality', code: 'mqdefault', quality: 'MQ (320x180)' },
    { name: 'Standard Quality', code: 'sddefault', quality: 'SD (640x480)' },
    { name: 'Default', code: 'default', quality: 'Default (120x90)' }
  ];

  const downloadThumbnail = (quality: string) => {
    if (!videoId) return;
    
    const url = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `youtube-thumbnail-${videoId}-${quality}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">YouTube Thumbnail Downloader</h2>
        <p className="text-slate-300">Download thumbnails from any YouTube video</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Youtube className="w-6 h-6 text-red-500" />
          <span className="text-white font-medium">Enter YouTube URL</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="flex-1 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="text-slate-300 text-sm">
            <p>Supported formats:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>https://www.youtube.com/shorts/VIDEO_ID</li>
            </ul>
          </div>
        </div>
      </div>

      {videoId && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Available Thumbnails</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Video Thumbnail"
                className="w-full h-auto rounded-lg border-2 border-slate-600"
                onError={(e) => {
                  // If maxresdefault fails, fallback to hqdefault
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                <h3 className="text-white font-medium mb-2">Video Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 text-sm">Video ID:</span>
                    <span className="text-white font-mono text-sm ml-2">{videoId}</span>
                  </div>
                  <div>
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Video
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {thumbnailTypes.map((type) => (
                  <button
                    key={type.code}
                    onClick={() => downloadThumbnail(type.code)}
                    className="w-full flex items-center justify-between bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>{type.name}</span>
                    </div>
                    <span className="text-slate-300 text-sm">{type.quality}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About YouTube Thumbnails</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• YouTube automatically generates several thumbnail images for each video</p>
          <p>• The highest quality thumbnail (maxresdefault) may not be available for older videos</p>
          <p>• Thumbnails can be used for blog posts, presentations, or social media</p>
          <p>• Always respect copyright and fair use when using thumbnails</p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeThumbnailDownloader; 