import React from 'react';

const HomePage = () => {
  return (
    <div className="p-3 md:p-5">
      <div className="mb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
          Welcome to English Learning HDPTAK
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-3 text-red-500">
          Đây là DEMO mẫu ae xem qua để biết rồi tiến hành xóa và code như đã thống nhất ở FIGMA.
        </p>    
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Quick access cards */}
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 hover:shadow-lg transition duration-200">
          <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-2">Dictionary</h2>
          <p className="text-gray-600 mb-3">Access our comprehensive dictionary for word lookup.</p>
          <div className="mt-auto pt-1">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Explore Dictionary →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 hover:shadow-lg transition duration-200">
          <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-2">Practice</h2>
          <p className="text-gray-600 mb-3">Practice your English skills with interactive exercises.</p>
          <div className="mt-auto pt-1">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Start Practice →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 hover:shadow-lg transition duration-200">
          <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-2">Progress Tracking</h2>
          <p className="text-gray-600 mb-3">Track your learning progress and achievements.</p>
          <div className="mt-auto pt-1">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View Progress →
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-3 md:p-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Recent Activities</h2>
        <p className="text-gray-600 italic">Content to be implemented by frontend developers</p>
      </div>
    </div>
  );
};

export default HomePage; 