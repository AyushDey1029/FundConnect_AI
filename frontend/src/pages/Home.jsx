import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="max-w-2xl text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to FundConnect AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          The AI-powered social crowdfunding platform where every campaign is a story.
        </p>
        
        {isAuthenticated ? (
          <div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              Hello, {user?.name}! The Social Feed will be built in Phase 2.
            </p>
            <Link 
              to="/profile" 
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Profile
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="inline-block px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
