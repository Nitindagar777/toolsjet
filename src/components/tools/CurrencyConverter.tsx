import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, ArrowRight } from 'lucide-react';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];
  
  const allCurrencies = [
    ...popularCurrencies,
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AWG', 'AZN', 'BAM', 
    'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BSD', 'BTN', 
    'BWP', 'BYN', 'BZD', 'CDF', 'CLP', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 
    'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'FJD', 'GEL', 'GHS', 
    'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 
    'ILS', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'KES', 'KGS', 'KHR', 'KMF', 
    'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 
    'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 
    'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 
    'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 
    'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 
    'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 
    'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 
    'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF', 'XPF', 'YER', 
    'ZAR', 'ZMW', 'ZWL'
  ].sort();

  // Mock exchange rates - in a real app, you would fetch these from an API
  const mockExchangeRates: Record<string, number> = {
    USD: 1,
    EUR: 0.91,
    GBP: 0.78,
    JPY: 149.5,
    CAD: 1.35,
    AUD: 1.51,
    CHF: 0.87,
    CNY: 7.23,
    INR: 83.12,
    BRL: 5.04,
    // Add more mock rates for other currencies
  };

  const convertCurrency = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // In a real app, you would get the exchange rate from an API
        const fromRate = mockExchangeRates[fromCurrency] || 1;
        const toRate = mockExchangeRates[toCurrency] || 1;
        
        // Convert to USD first (as base), then to target currency
        const inUSD = amount / fromRate;
        const result = inUSD * toRate;
        
        setConvertedAmount(result);
        setLastUpdated(new Date().toLocaleString());
        setIsLoading(false);
      } catch (err) {
        setError('Failed to convert currency. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Convert when component mounts or when currencies/amount change
  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Currency Converter</h2>
        <p className="text-slate-300">Convert between world currencies</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Amount Input */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* From Currency */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <optgroup label="Popular Currencies">
                {popularCurrencies.map(currency => (
                  <option key={`popular-${currency}`} value={currency}>{currency}</option>
                ))}
              </optgroup>
              <optgroup label="All Currencies">
                {allCurrencies.map(currency => (
                  <option key={`all-${currency}`} value={currency}>{currency}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* To Currency */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 text-sm mb-2">To</label>
              <button 
                onClick={handleSwapCurrencies}
                className="text-blue-400 hover:text-blue-300 mb-2 flex items-center text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Swap
              </button>
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <optgroup label="Popular Currencies">
                {popularCurrencies.map(currency => (
                  <option key={`popular-${currency}`} value={currency}>{currency}</option>
                ))}
              </optgroup>
              <optgroup label="All Currencies">
                {allCurrencies.map(currency => (
                  <option key={`all-${currency}`} value={currency}>{currency}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={convertCurrency}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Convert
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-700 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {convertedAmount !== null && !error && (
          <div className="mt-8 text-center">
            <div className="text-slate-300 mb-2">Result</div>
            <div className="text-3xl font-bold text-white mb-2">
              {amount.toLocaleString()} {fromCurrency} = {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
            </div>
            <div className="text-slate-400 text-sm">
              Last updated: {lastUpdated}
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Note: Exchange rates are for demonstration purposes only.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter; 