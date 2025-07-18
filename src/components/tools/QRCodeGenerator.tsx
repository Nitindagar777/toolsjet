import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import QRCode from 'react-qr-code';

const QRCodeGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [size, setSize] = useState(200);
  const [copied, setCopied] = useState(false);

  const downloadQRCode = () => {
    if (!inputText.trim()) return;
    
    const svg = document.getElementById('qr-code');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qrcode-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const presetTexts = [
    { label: 'Website URL', value: 'https://toolsjet.com' },
    { label: 'Email', value: 'mailto:contact@toolsjet.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'SMS', value: 'sms:+1234567890' },
    { label: 'WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:password;;' },
    { label: 'Location', value: 'geo:37.7749,-122.4194' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">QR Code Generator</h2>
        <p className="text-slate-300">Create QR codes for text, URLs, contacts, and more</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <QrCode className="w-6 h-6 text-blue-400" />
              <span className="text-white font-medium">Input Data</span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-32 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Enter text, URL, email, phone number, or any data..."
            />
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-slate-400 text-sm">
                {inputText.length} characters
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors duration-200"
                disabled={!inputText}
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
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-white font-medium mb-3">Quick Presets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetTexts.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(preset.value)}
                  className="text-left p-3 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors duration-200"
                >
                  <div className="font-medium">{preset.label}</div>
                  <div className="text-xs text-slate-500 truncate">{preset.value}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-white font-medium mb-3">Size</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Size: {size}x{size} pixels</span>
                <span className="text-slate-400 text-sm">{size}px</span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>100px</span>
                <span>250px</span>
                <span>400px</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <QrCode className="w-6 h-6 text-green-400" />
                <span className="text-white font-medium">Generated QR Code</span>
              </div>
              <button
                onClick={downloadQRCode}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                disabled={!inputText.trim()}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                {inputText.trim() ? (
                  <QRCode
                    id="qr-code"
                    value={inputText}
                    size={size}
                    level="H"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 ${size} ${size}`}
                  />
                ) : (
                  <div 
                    className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300"
                    style={{ width: size, height: size }}
                  >
                    <div className="text-center text-gray-400">
                      <QrCode className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Enter text to generate QR code</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-white font-medium mb-3">QR Code Types</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>• <strong>URL:</strong> https://example.com</p>
              <p>• <strong>Email:</strong> mailto:user@example.com</p>
              <p>• <strong>Phone:</strong> tel:+1234567890</p>
              <p>• <strong>SMS:</strong> sms:+1234567890</p>
              <p>• <strong>WiFi:</strong> WIFI:T:WPA;S:NetworkName;P:password;;</p>
              <p>• <strong>Location:</strong> geo:latitude,longitude</p>
              <p>• <strong>vCard:</strong> Contact information</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-white font-medium mb-3">Tips</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>• Higher resolution QR codes are better for printing</p>
              <p>• Test your QR code with different scanners</p>
              <p>• Keep URLs short for better scanning</p>
              <p>• Add error correction for damaged codes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;