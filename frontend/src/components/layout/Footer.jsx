import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">FundConnect AI</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6 md:order-2">
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
              Privacy
            </Link>
            <a href="https://github.com/AyushDey1029/FundConnect_AI" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
              GitHub
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1 text-center md:text-left">
            &copy; {new Date().getFullYear()} FundConnect AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
