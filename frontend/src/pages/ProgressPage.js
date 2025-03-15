import React from 'react';

const ProgressPage = () => {
  // Placeholder data (to be replaced by actual data from API) - Dữ liệu giả lập
  const placeholderProgress = {
    overallScore: 72,
    vocabulary: 80,
    grammar: 65,
    reading: 75,
    listening: 68,
    badges: 77,
  };
  
  return (
    <div className="flex flex-col items-center gap-5 p-5">
      <div className="grid grid-cols-3 gap-5">
        <ProgressCard title="Total Word" total={placeholderProgress.vocabulary} />
        <ProgressCard title="Total Work" total={placeholderProgress.listening} />
        <ProgressCard title="Accurate" total={placeholderProgress.grammar} />
      </div>
      <div className="grid grid-cols-2 gap-5 p-5">
        <ProgressCard title="Daily" total="0/5" />
        <ProgressCard title="Badges" total={placeholderProgress.badges} />
      </div>
    </div>
  );
}

function ProgressCard({ title, total }) {
  return (
    <div className="w-[260px] h-[330px] bg-[#056D99] flex flex-col rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-1">
        <span className="text-[#DAA520] font-bold text-2xl italic">{title}</span>
        <span className="text-white font-bold text-2xl italic">Progress</span>
      </div>
      {/* Chuyển đổi số sang phần trăm */}
      <p className="text-white text-lg italic mt-2">{total}%</p>
      <div className="flex flex-col items-center mt-auto "></div>
      <div className="w-[99%] h-3 bg-gray-300 bg-opacity-40 rounded-full relative mt-2"></div>
    </div>
  );
}

export default ProgressPage; 
