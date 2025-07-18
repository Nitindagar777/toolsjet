import React, { useState } from 'react';
import { FileText, Upload, Download, AlertCircle, File, FileCog, Loader2 } from 'lucide-react';

const PDFToWordConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionComplete, setConversionComplete] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setConversionComplete(false);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const convertFile = () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError(null);

    // Simulate conversion process
    setTimeout(() => {
      setIsConverting(false);
      setConversionComplete(true);
    }, 3000);
  };

  const downloadConvertedFile = () => {
    if (!selectedFile || !conversionComplete) return;

    // In a real app, this would download the converted file from a server
    // Here we're just creating a demo file with the same name but .docx extension
    const fileName = selectedFile.name.replace('.pdf', '.docx');
    
    // Create a dummy text file for demo purposes
    const blob = new Blob([`This is a simulated Word document converted from ${selectedFile.name}. 
In a real application, this would be an actual DOCX file converted from your PDF.
    
This is just a demonstration of the user interface.`], 
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">PDF to Word Converter</h2>
        <p className="text-slate-300">Convert PDF files to editable Word documents</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Upload PDF File</span>
        </div>
        
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <FileText className="w-12 h-12 text-slate-400" />
            <div className="text-slate-300">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <div className="text-slate-400 text-sm">
              PDF files up to 10MB
            </div>
          </label>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {selectedFile && (
          <div className="mt-4 p-4 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-white font-medium">{selectedFile.name}</div>
                  <div className="text-slate-400 text-sm">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <div className="text-slate-300 text-sm">
                PDF File
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <FileCog className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Convert PDF to Word</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
              <h3 className="text-white font-medium mb-2">Conversion Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Maintain original formatting</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Extract images</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Convert tables</span>
                </label>
              </div>
            </div>

            {!conversionComplete ? (
              <button
                onClick={convertFile}
                disabled={isConverting}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileCog className="w-5 h-5" />
                    Convert to Word
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={downloadConvertedFile}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                Download Word Document
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About PDF to Word Conversion</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• Converts PDF documents to editable Microsoft Word format</p>
          <p>• Preserves text formatting, images, and layout when possible</p>
          <p>• Perfect for editing documents that are only available as PDFs</p>
          <p>• Note: Complex layouts and scanned PDFs may not convert perfectly</p>
          <p className="text-yellow-400 mt-3">
            <strong>Demo Note:</strong> This is a demonstration interface. In a real application, 
            conversion would be performed by a server-side service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFToWordConverter; 