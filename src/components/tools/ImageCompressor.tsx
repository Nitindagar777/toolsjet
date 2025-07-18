import React, { useState, useCallback } from 'react';
import { Image, Upload, Download, Compass as Compress } from 'lucide-react';

const ImageCompressor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalImage(file);
      setOriginalSize(file.size);
      setCompressedImage(null);
      setCompressedSize(0);
    }
  }, []);

  const compressImage = useCallback(async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx?.drawImage(img, 0, 0);
        
        // Convert to compressed blob
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedUrl = URL.createObjectURL(blob);
            setCompressedImage(compressedUrl);
            setCompressedSize(blob.size);
          }
          setIsProcessing(false);
        }, 'image/jpeg', quality / 100);
      };
      
      img.src = URL.createObjectURL(originalImage);
    } catch (error) {
      console.error('Error compressing image:', error);
      setIsProcessing(false);
    }
  }, [originalImage, quality]);

  const downloadCompressedImage = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-${originalImage?.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (): number => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Image Compressor</h2>
        <p className="text-slate-300">Reduce image file size while maintaining quality</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Upload Image</span>
        </div>
        
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <Image className="w-12 h-12 text-slate-400" />
            <div className="text-slate-300">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <div className="text-slate-400 text-sm">
              PNG, JPG, GIF up to 10MB
            </div>
          </label>
        </div>

        {originalImage && (
          <div className="mt-4 p-4 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{originalImage.name}</div>
                <div className="text-slate-400 text-sm">{formatFileSize(originalSize)}</div>
              </div>
              <div className="text-slate-300 text-sm">
                Original
              </div>
            </div>
          </div>
        )}
      </div>

      {originalImage && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Compress className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Compression Settings</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-slate-300">Quality: {quality}%</label>
                <span className="text-slate-400 text-sm">
                  {quality >= 90 ? 'Excellent' : quality >= 70 ? 'Good' : quality >= 50 ? 'Fair' : 'Poor'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <button
              onClick={compressImage}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              <Compress className="w-5 h-5" />
              {isProcessing ? 'Compressing...' : 'Compress Image'}
            </button>
          </div>
        </div>
      )}

      {compressedImage && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-green-400" />
              <span className="text-white font-medium">Compressed Image</span>
            </div>
            <button
              onClick={downloadCompressedImage}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {formatFileSize(originalSize)}
                </div>
                <div className="text-slate-300 text-sm">Original Size</div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {formatFileSize(compressedSize)}
                </div>
                <div className="text-slate-300 text-sm">Compressed Size</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {getCompressionRatio()}%
            </div>
            <div className="text-slate-300 text-sm">Size Reduction</div>
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src={compressedImage}
              alt="Compressed preview"
              className="max-w-full max-h-64 rounded-lg border border-slate-600"
            />
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">Tips for Better Compression</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Higher quality settings preserve more detail but result in larger files</p>
          <p>• JPEG format is best for photos, PNG for graphics with transparency</p>
          <p>• Consider your use case: web images can be more compressed than print images</p>
          <p>• Test different quality levels to find the best balance for your needs</p>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;