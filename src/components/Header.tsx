import React, { useState } from 'react';
import { Wrench, Menu, X, Mail } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                Tools<span className="text-blue-400">Jet</span>
              </h1>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('tools');
              }}
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Tools
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('about');
              }}
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              About
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              Contact
            </a>
            <a 
              href="mailto:kinghunter0800@gmail.com" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              title="Email us directly"
            >
              kinghunter0800@gmail.com
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('tools');
                }}
                className="text-slate-300 hover:text-white transition-colors duration-200 py-2"
              >
                Tools
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about');
                }}
                className="text-slate-300 hover:text-white transition-colors duration-200 py-2"
              >
                About
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('contact');
                }}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-fit"
              >
                <Mail className="w-4 h-4" />
                Contact
              </a>
              <a 
                href="mailto:kinghunter0800@gmail.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 py-2"
              >
                kinghunter0800@gmail.com
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;