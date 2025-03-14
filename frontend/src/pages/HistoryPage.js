import React, { useState } from 'react';


const HistoryPage = () => {
  const [activityType, setActivityType] = useState('Vocabulary');
  const [selectedDate, setSelectedDate] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [activities, setActivities] = useState([
    {
      id: 1,
      activity: 'Vocabulary Practice',
      date: '2023-07-15',
      time: '10:30 AM',
      duration: '15 min',
      score: '85%',
    },
    {
      id: 2,
      activity: 'Grammar Quiz',
      date: '2023-07-14',
      time: '2:45 PM',
      duration: '20 min',
      score: '70%',
    },
    {
      id: 3,
      activity: 'Reading Comprehension',
      date: '2023-07-13',
      time: '9:15 AM',
      duration: '25 min',
      score: '90%',
    },
    {
      id: 4,
      activity: 'Listening Exercise',
      date: '2023-07-12',
      time: '5:30 PM',
      duration: '18 min',
      score: '75%',
    }
  ]);
  
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFilterClick = () => {
    let filtered = [...activities];
    
    if (activityType !== 'All') {
      filtered = filtered.filter(item => 
        item.activity.toLowerCase().includes(activityType.toLowerCase())
      );
    }
    
    if (selectedDate) {
      filtered = filtered.filter(item => item.date === selectedDate);
    }
    
    setFilteredActivities(filtered);
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  const handleDateInputClick = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'dd/mm/yyyy';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const clearDate = () => {
    setSelectedDate('');
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Your Activity History - Chưa update 
        </h1>
        <p className="text-lg text-gray-600 text-red-500">
        Đây là DEMO mẫu ae xem qua để biết rồi tiến hành xóa và code như đã thống nhất ở FIGMA.
        </p>

      </div>

      <div className="flex">
        {/* Phần chính */}
        <div className="flex-1 p-6">
          {/* Lọc hoạt động */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-auto">
              <select 
                className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500border rounded p-2 w-48"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
              >
                <option value="All">All Activities</option>
                <option value="Vocabulary">Vocabulary</option>
                <option value="Grammar">Grammar</option>
                <option value="Reading">Reading</option>
                <option value="Listening">Listening</option>
              </select>
              </div>
              <div className="w-full md:w-aut">
                <div 
                  className="border rounded p-2 w-48 flex items-center justify-between cursor-pointer"
                  onClick={handleDateInputClick}
                >
                  <span className={selectedDate ? "text-black" : "text-gray-400"}>
                    {formatDisplayDate(selectedDate)}
                  </span>
                  <div className="flex items-center">
                    {selectedDate && (
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearDate();
                        }}
                      >
                        ✕
                      </button>
                    )}
                    <Calendar className="text-gray-400" size={18} />
                  </div>
                </div>
                
                {datePickerOpen && (
                  <div className="absolute mt-1 bg-white rounded shadow-lg p-4 z-10">
                    <div className="mb-2 font-medium">Select Date</div>
                    <input 
                      type="date" 
                      className="border rounded p-2 w-full"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setDatePickerOpen(false);
                      }}
                    />
                    <div className="flex justify-between mt-3">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setDatePickerOpen(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setDatePickerOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Nút Filter new*/}
              <button 
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={handleFilterClick}
              >
              Filter
             </button>
            </div>
          </div>
          
          {/* Bảng hoạt động */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bbg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">ACTIVITY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">DATE & TIME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">DURATION</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">SCORE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{activity.activity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.date}<br />
                      <span className="text-gray-500">{activity.time}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{activity.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded ${
                        parseInt(activity.score) >= 80 ? 'bg-green-100 text-green-800' : 
                        parseInt(activity.score) >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleViewDetails(activity)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Showing <span className="font-medium">1</span> to {filteredActivities.length} of {filteredActivities.length} results</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Previous</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Next</button>
              </div>
            </div>
        </div>
      </div>
      
      {/* Hộp thoại mô tả */}
      {showDetails && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedActivity.activity} Details</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeDetails}
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-500">Date</h3>
                  <p>{selectedActivity.date}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Time</h3>
                  <p>{selectedActivity.time}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Duration</h3>
                  <p>{selectedActivity.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Score</h3>
                  <p className={`font-bold ${
                    parseInt(selectedActivity.score) >= 80 ? 'text-green-600' : 
                    parseInt(selectedActivity.score) >= 70 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {selectedActivity.score}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Tóm tắt hoạt động</h3>
                <p className="text-gray-700">
                  This {selectedActivity.activity.toLowerCase()} was completed on {selectedActivity.date} 
                   &nbsp;and took {selectedActivity.duration} to complete. You scored {selectedActivity.score} which 
                  {parseInt(selectedActivity.score) >= 80 ? ' Thật xuất sắc!' : 
                   parseInt(selectedActivity.score) >= 70 ? ' Làm tốt lắm, giữ lửa nhé!' : 
                   ' Cần cải thiện một chút. Sớm thử lại nhé!.'}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                  onClick={closeDetails}
                >
                  Đóng
                </button>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
