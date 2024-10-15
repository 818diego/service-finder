import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Our Website</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">This is the home page of our React + Vite + Tailwind project.</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Feature</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">React Router for navigation</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Styling</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Tailwind CSS for responsive design</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Build Tool</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Vite for fast development and building</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default HomePage;