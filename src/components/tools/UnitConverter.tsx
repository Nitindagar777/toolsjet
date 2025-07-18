import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRightLeft } from 'lucide-react';

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('feet');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  const conversions = {
    length: {
      name: 'Length',
      units: {
        meter: { name: 'Meter', factor: 1 },
        kilometer: { name: 'Kilometer', factor: 1000 },
        centimeter: { name: 'Centimeter', factor: 0.01 },
        millimeter: { name: 'Millimeter', factor: 0.001 },
        inch: { name: 'Inch', factor: 0.0254 },
        feet: { name: 'Feet', factor: 0.3048 },
        yard: { name: 'Yard', factor: 0.9144 },
        mile: { name: 'Mile', factor: 1609.34 }
      }
    },
    weight: {
      name: 'Weight',
      units: {
        kilogram: { name: 'Kilogram', factor: 1 },
        gram: { name: 'Gram', factor: 0.001 },
        pound: { name: 'Pound', factor: 0.453592 },
        ounce: { name: 'Ounce', factor: 0.0283495 },
        ton: { name: 'Ton', factor: 1000 },
        stone: { name: 'Stone', factor: 6.35029 }
      }
    },
    temperature: {
      name: 'Temperature',
      units: {
        celsius: { name: 'Celsius', factor: 1 },
        fahrenheit: { name: 'Fahrenheit', factor: 1 },
        kelvin: { name: 'Kelvin', factor: 1 }
      }
    },
    volume: {
      name: 'Volume',
      units: {
        liter: { name: 'Liter', factor: 1 },
        milliliter: { name: 'Milliliter', factor: 0.001 },
        gallon: { name: 'Gallon (US)', factor: 3.78541 },
        quart: { name: 'Quart', factor: 0.946353 },
        pint: { name: 'Pint', factor: 0.473176 },
        cup: { name: 'Cup', factor: 0.236588 },
        fluid_ounce: { name: 'Fluid Ounce', factor: 0.0295735 }
      }
    },
    area: {
      name: 'Area',
      units: {
        square_meter: { name: 'Square Meter', factor: 1 },
        square_kilometer: { name: 'Square Kilometer', factor: 1000000 },
        square_centimeter: { name: 'Square Centimeter', factor: 0.0001 },
        square_inch: { name: 'Square Inch', factor: 0.00064516 },
        square_feet: { name: 'Square Feet', factor: 0.092903 },
        acre: { name: 'Acre', factor: 4046.86 },
        hectare: { name: 'Hectare', factor: 10000 }
      }
    }
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    
    // Convert to Celsius first
    let celsius = value;
    if (from === 'fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'kelvin') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (to === 'kelvin') {
      return celsius + 273.15;
    }
    
    return celsius;
  };

  const convert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setToValue('');
      return;
    }

    if (category === 'temperature') {
      const result = convertTemperature(value, fromUnit, toUnit);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      const categoryData = conversions[category as keyof typeof conversions];
      const fromFactor = categoryData.units[fromUnit as keyof typeof categoryData.units].factor;
      const toFactor = categoryData.units[toUnit as keyof typeof categoryData.units].factor;
      
      const result = (value * fromFactor) / toFactor;
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  useEffect(() => {
    const categoryData = conversions[category as keyof typeof conversions];
    const units = Object.keys(categoryData.units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue('1');
    setToValue('');
  }, [category]);

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, category]);

  const currentCategory = conversions[category as keyof typeof conversions];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Unit Converter</h2>
        <p className="text-slate-300">Convert between different units of measurement</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Select Category</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(conversions).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`p-3 rounded-lg font-medium transition-colors duration-200 ${
                category === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {data.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-medium mb-4">From</h3>
          <div className="space-y-4">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              {Object.entries(currentCategory.units).map(([key, unit]) => (
                <option key={key} value={key}>{unit.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter value"
            />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-medium mb-4">To</h3>
          <div className="space-y-4">
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              {Object.entries(currentCategory.units).map(([key, unit]) => (
                <option key={key} value={key}>{unit.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={toValue}
              readOnly
              className="w-full bg-slate-900 text-white rounded-lg p-3 border border-slate-600"
              placeholder="Converted value"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={swapUnits}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          <ArrowRightLeft className="w-5 h-5" />
          Swap Units
        </button>
      </div>
    </div>
  );
};

export default UnitConverter;