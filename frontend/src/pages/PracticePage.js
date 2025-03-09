import React from 'react';

const PracticePage = () => {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Practice Your English
        </h1>
        <p className="text-lg text-gray-600 text-red-500">
        Đây là DEMO mẫu ae xem qua để biết rồi tiến hành xóa và code như đã thống nhất ở FIGMA.
        </p>
      </div>

      {/* Practice categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-blue-600 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Vocabulary</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Expand your vocabulary through various word-building exercises.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
              Start Practice
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-green-600 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Grammar</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Improve your understanding of English grammar rules.
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
              Start Practice
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-purple-600 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Reading</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Enhance your reading comprehension with various texts.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200">
              Start Practice
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-amber-600 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Listening</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Test and improve your listening skills with audio exercises.
            </p>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-200">
              Start Practice
            </button>
          </div>
        </div>
      </div>

      {/* Recommended practice */}
      <div className="bg-blue-50 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended for You</h2>
        <p className="text-gray-600 italic mb-4">
          Based on your previous activities and progress, we recommend:
        </p>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-500">Content to be implemented by frontend developers</p>
        </div>
      </div>

      {/* Recent practice */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Recent Practice</h2>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-gray-500 text-center">
            Your recent practice history will appear here. To be implemented by frontend developers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PracticePage; 