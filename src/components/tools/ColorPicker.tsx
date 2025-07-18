import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const copyToClipboard = async (value: string, format: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const colorFormats = [
    { name: 'HEX', value: color.toUpperCase() },
    { name: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '' },
    { name: 'RGBA', value: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : '' },
    { name: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
    { name: 'HSLA', value: hsl ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` : '' }
  ];

  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Color Picker</h2>
        <p className="text-slate-300">Pick colors and get values in different formats</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Color Selector</span>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-20 h-20 rounded-lg border-2 border-slate-600 cursor-pointer"
          />
          <div className="flex-1">
            <div 
              className="w-full h-20 rounded-lg border-2 border-slate-600"
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </div>

        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none font-mono"
          placeholder="#3b82f6"
        />
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-4">Color Formats</h3>
        <div className="space-y-3">
          {colorFormats.map((format) => (
            <div key={format.name} className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-600">
              <div>
                <div className="text-slate-300 text-sm">{format.name}</div>
                <div className="text-white font-mono">{format.value}</div>
              </div>
              <button
                onClick={() => copyToClipboard(format.value, format.name)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
              >
                {copiedFormat === format.name ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-4">Preset Colors</h3>
        <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              onClick={() => setColor(presetColor)}
              className="w-10 h-10 rounded-lg border-2 border-slate-600 hover:border-white transition-colors duration-200"
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;