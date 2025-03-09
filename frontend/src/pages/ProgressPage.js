import React from 'react';

const ProgressPage = () => {
  // Placeholder data (to be replaced by actual data from API)
  const placeholderProgress = {
    overallScore: 72,
    vocabulary: 80,
    grammar: 65,
    reading: 75,
    listening: 68,
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Your Progress
        </h1>
        <p className="text-lg text-gray-600 text-red-500">
        Đây là DEMO mẫu ae xem qua để biết rồi tiến hành xóa và code như đã thống nhất ở FIGMA.
        </p>
      </div>

      {/* Overall progress card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Progress</h2>
        <div className="flex items-center justify-between">
          <div className="w-full max-w-xs">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Overall Score
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {placeholderProgress.overallScore}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${placeholderProgress.overallScore}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                ></div>
              </div>
            </div>
          </div>
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">{placeholderProgress.overallScore}%</span>
            </div>
            {/* This would be replaced with an actual chart by frontend devs */}
            <div className="w-full h-full rounded-full border-8 border-blue-200">
              <div 
                className="h-full rounded-full bg-blue-600" 
                style={{ 
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                  width: `${placeholderProgress.overallScore}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills progress section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vocabulary</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {placeholderProgress.vocabulary}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${placeholderProgress.vocabulary}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You've mastered {placeholderProgress.vocabulary}% of vocabulary exercises.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Grammar</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {placeholderProgress.grammar}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div
                  style={{ width: `${placeholderProgress.grammar}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You've mastered {placeholderProgress.grammar}% of grammar exercises.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reading</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    {placeholderProgress.reading}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                <div
                  style={{ width: `${placeholderProgress.reading}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You've mastered {placeholderProgress.reading}% of reading exercises.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Listening</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-amber-600">
                    {placeholderProgress.listening}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200">
                <div
                  style={{ width: `${placeholderProgress.listening}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-600"
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You've mastered {placeholderProgress.listening}% of listening exercises.
            </p>
          </div>
        </div>
      </div>

      {/* Achievements section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">
            Your achievements will be displayed here. To be implemented by frontend developers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 