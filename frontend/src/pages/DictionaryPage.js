import React, { useState } from 'react';

const DictionaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-3 md:p-5">
      <div className="mb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
          English Dictionary
        </h1>
        <p className="text-base md:text-lg text-gray-600 text-red-500">
        Đây là DEMO mẫu ae xem qua để biết rồi tiến hành xóa và code như đã thống nhất ở FIGMA.
        </p>
      </div>

      {/* Search section */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a word..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
            Search
          </button>
        </div>
        <div className="mt-1 text-sm text-gray-500">
          Example: adventure, knowledge, experience
        </div>
      </div>

      {/* Dictionary content */}
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
        <div className="mb-3 pb-3 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            [Word will appear here]
          </h2>
          <div className="text-gray-600 italic">
            /pronunciation/ • part of speech
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">Definitions</h3>
          <div className="space-y-1 text-gray-600">
            <p>1. Primary definition will appear here</p>
            <p>2. Secondary definition will appear here</p>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">Examples</h3>
          <div className="space-y-1 text-gray-600">
            <p>• Example sentence will appear here</p>
            <p>• Another example sentence will appear here</p>
          </div>
        </div>

        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">Synonyms</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">synonym1</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">synonym2</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">synonym3</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-500 text-sm">
        <p>Search functionality to be implemented by frontend developers</p>
      </div>
    </div>
  );
};

export default DictionaryPage; 