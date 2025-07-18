import React, { useState } from 'react';
import { FileText, Eye, Copy, Check } from 'lucide-react';

const MarkdownPreview: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Preview

## Features
- **Bold text** and *italic text*
- [Links](https://example.com)
- \`inline code\` and code blocks

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists
1. First item
2. Second item
3. Third item

- Bullet point
- Another bullet
- Last bullet

> This is a blockquote
> It can span multiple lines

---

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`);
  const [copied, setCopied] = useState(false);

  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mb-3 mt-6">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-blue-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 border border-slate-600 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-green-400 font-mono text-sm">$2</code></pre>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-slate-700/30 text-slate-300 italic">$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="border-slate-600 my-6">');

    // Lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="text-slate-300 mb-1">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="text-slate-300 mb-1">$1</li>');
    
    // Wrap consecutive list items
    html = html.replace(/(<li.*<\/li>\s*)+/g, (match) => {
      if (match.includes('1.')) {
        return `<ol class="list-decimal list-inside space-y-1 my-4 ml-4">${match}</ol>`;
      } else {
        return `<ul class="list-disc list-inside space-y-1 my-4 ml-4">${match}</ul>`;
      }
    });

    // Tables
    const tableRegex = /^\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm;
    html = html.replace(tableRegex, (match, header, rows) => {
      const headerCells = header.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
      const headerRow = headerCells.map((cell: string) => `<th class="border border-slate-600 px-3 py-2 bg-slate-700 text-white font-medium">${cell}</th>`).join('');
      
      const bodyRows = rows.trim().split('\n').map((row: string) => {
        const cells = row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
        return `<tr>${cells.map((cell: string) => `<td class="border border-slate-600 px-3 py-2 text-slate-300">${cell}</td>`).join('')}</tr>`;
      }).join('');
      
      return `<table class="w-full border-collapse border border-slate-600 my-4 rounded-lg overflow-hidden"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    });

    // Paragraphs
    html = html.replace(/^(?!<[h|u|o|p|b|t])(.*$)/gim, '<p class="text-slate-300 mb-4 leading-relaxed">$1</p>');

    // Clean up empty paragraphs
    html = html.replace(/<p class="text-slate-300 mb-4 leading-relaxed"><\/p>/g, '');

    return html;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const loadSample = () => {
    setMarkdown(`# My Project Documentation

## Overview
This is a **comprehensive guide** to using our *amazing* project.

### Getting Started
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run dev\`

### Features
- ✅ Fast and lightweight
- ✅ Easy to use
- ✅ Well documented

### Code Example
\`\`\`javascript
// Hello World example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### API Reference
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/users | Get all users |
| POST   | /api/users | Create user |
| PUT    | /api/users/:id | Update user |

> **Note:** Remember to include authentication headers in your requests.

---

For more information, visit our [documentation](https://example.com).
`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Markdown Preview</h2>
        <p className="text-slate-300">Write and preview Markdown in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              <span className="text-white font-medium">Markdown Editor</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadSample}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                Load Sample
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors duration-200"
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
          
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-96 bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
            placeholder="Enter your Markdown here..."
          />
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Preview</span>
          </div>
          
          <div 
            className="h-96 bg-slate-900 rounded-lg p-4 border border-slate-600 overflow-y-auto prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">Markdown Syntax Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded"># Header 1</code>
              <span className="ml-2">Large heading</span>
            </div>
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">**bold**</code>
              <span className="ml-2">Bold text</span>
            </div>
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">*italic*</code>
              <span className="ml-2">Italic text</span>
            </div>
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">`code`</code>
              <span className="ml-2">Inline code</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">[link](url)</code>
              <span className="ml-2">Link</span>
            </div>
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">- item</code>
              <span className="ml-2">Bullet list</span>
            </div>
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">1. item</code>
              <span className="ml-2">Numbered list</span>
            </div>
            <div className="text-slate-300">
              <code className="bg-slate-700 px-2 py-1 rounded">{"> quote"}</code>
              <span className="ml-2">Blockquote</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreview;