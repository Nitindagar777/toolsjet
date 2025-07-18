import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Gift } from 'lucide-react';

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<any>(null);

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return null;

    const birth = new Date(birthDateString);
    const today = new Date();

    if (birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days lived
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate hours, minutes, seconds
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Calculate weeks
    const totalWeeks = Math.floor(totalDays / 7);

    // Calculate months (approximate)
    const totalMonths = years * 12 + months;

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilBirthday,
      nextBirthday
    };
  };

  useEffect(() => {
    const calculatedAge = calculateAge(birthDate);
    setAge(calculatedAge);
  }, [birthDate]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getZodiacSign = (birthDateString: string) => {
    if (!birthDateString) return '';
    
    const birth = new Date(birthDateString);
    const month = birth.getMonth() + 1;
    const day = birth.getDate();

    const zodiacSigns = [
      { name: 'Capricorn', start: [12, 22], end: [1, 19] },
      { name: 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', start: [2, 19], end: [3, 20] },
      { name: 'Aries', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', start: [6, 21], end: [7, 22] },
      { name: 'Leo', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', start: [8, 23], end: [9, 22] },
      { name: 'Libra', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth === 12 && month === 1 && day <= endDay)
      ) {
        return sign.name;
      }
    }
    
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Age Calculator</h2>
        <p className="text-slate-300">Calculate your exact age and get interesting statistics</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-400" />
          <span className="text-white font-medium">Enter Your Birth Date</span>
        </div>
        
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-slate-900 text-white rounded-lg p-4 border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {age && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-6 h-6 text-green-400" />
              <span className="text-white font-medium">Your Age</span>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {age.years} years, {age.months} months, {age.days} days
              </div>
              <div className="text-slate-300">
                Next birthday in {age.daysUntilBirthday} days
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {formatNumber(age.totalDays)}
                </div>
                <div className="text-slate-300 text-sm">Total Days</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {formatNumber(age.totalWeeks)}
                </div>
                <div className="text-slate-300 text-sm">Total Weeks</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {formatNumber(age.totalMonths)}
                </div>
                <div className="text-slate-300 text-sm">Total Months</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {formatNumber(age.totalHours)}
                </div>
                <div className="text-slate-300 text-sm">Total Hours</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400 mb-1">
                  {formatNumber(age.totalMinutes)}
                </div>
                <div className="text-slate-300 text-sm">Total Minutes</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {formatNumber(age.totalSeconds)}
                </div>
                <div className="text-slate-300 text-sm">Total Seconds</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Additional Information</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Birth Date:</span>
                  <span className="text-white">{new Date(birthDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Day of Week:</span>
                  <span className="text-white">{new Date(birthDate).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Zodiac Sign:</span>
                  <span className="text-white">{getZodiacSign(birthDate)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Next Birthday:</span>
                  <span className="text-white">{age.nextBirthday.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Days Until Birthday:</span>
                  <span className="text-white">{age.daysUntilBirthday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Age Next Birthday:</span>
                  <span className="text-white">{age.years + 1} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;