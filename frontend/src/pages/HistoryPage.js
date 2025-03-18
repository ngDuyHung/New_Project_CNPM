import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Eye, Filter, X } from 'lucide-react'; // Thư viện icon

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('activities');
  const [date, setDate] = useState('');
  const [activityType, setActivityType] = useState('All Activities');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // chưa có dữ liệu để thay thế
  const activities = [
    {
      id: 1,
      type: 'Vocabulary Practice',
      date: '2023-07-15',
      time: '10:30 AM',
      duration: '15 min',
      score: '20%',
      details: 'Nothing'
    },
    {
      id: 2,
      type: 'Grammar Quiz',
      date: '2023-07-14',
      time: '2:45 PM',
      duration: '20 min',
      score: '70%',
      details: 'Nothing'
    },
    {
      id: 3,
      type: 'Reading Comprehension',
      date: '2023-07-13',
      time: '9:15 AM',
      duration: '25 min',
      score: '90%',
      details: 'Nothing'
    },
    {
      id: 4,
      type: 'Listening Exercise',
      date: '2023-07-12',
      time: '5:30 PM',
      duration: '18 min',
      score: '75%',
      details: 'Nothing'
    },
    {
      id: 5,
      type: 'Topic Creation',
      date: '2023-07-11',
      time: '3:20 PM',
      duration: '10 min',
      score: '-',
      details: 'Nothing'
    },
    {
      id: 6,
      type: 'Password Change',
      date: '2023-07-10',
      time: '11:45 AM',
      duration: '2 min',
      score: '-',
      details: 'Nothing'
    },
    {
      id: 7,
      type: 'Login',
      date: '2023-07-10',
      time: '11:40 AM',
      duration: '1 min',
      score: '-',
      details: 'Nothing'
    },
    {
      id: 8,
      type: 'Logout',
      date: '2023-07-09',
      time: '6:15 PM',
      duration: '1 min',
      score: '-',
      details: 'Nothing'
    },
  ];

  // Ô lựa chọn mục cần lọc
  const activityTypes = [
    'All Activities',
    'Vocabulary Practice',
    'Grammar Quiz',
    'Reading Comprehension',
    'Listening Exercise',
    'Topic Creation',
    'Login',
    'Logout',
    'Password Change'
  ];

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Màu trực quan theo tiến độ
  const getScoreColor = (score) => {
    if (score === '-') return 'bg-gray-100 text-gray-800';
    const numScore = parseInt(score);
    if (numScore >= 85) return 'bg-green-100 text-green-800';
    if (numScore >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const itemsPerPage = 5;
  const filteredActivities = activities.filter(activity => {
    const matchesType = activityType === 'All Activities' || activity.type === activityType;
    const matchesDate = !date || activity.date === date;
    return matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xem mô tả
  const viewActivityDetails = (activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const generateCalendarDays = () => {
    const today = date ? new Date(date) : new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Lấy ngày đầu tiên của tháng
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // Chỉnh 0 = Chủ Nhật, 1 = Thứ 2, ....
    
    const days = [];
    let dayCount = 1;
    
    // Tạo lưới bố cục cho lịch
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          week.push(null);
        } else if (dayCount > daysInMonth) {
          week.push(null);
        } else {
          week.push(dayCount);
          dayCount++;
        }
      }
      days.push(week);
      if (dayCount > daysInMonth) break;
    }
    
    return days;
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const selectDate = (day) => {
    if (!day) return;
    
    const selectedDate = new Date(date || new Date());
    selectedDate.setDate(day);
    
    // Định dạng date theo YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setDate(formattedDate);
    setShowDatePicker(false);
    setCurrentPage(1);
  };
  
  const changeMonth = (increment) => {
    const currentDate = date ? new Date(date) : new Date();
    currentDate.setMonth(currentDate.getMonth() + increment);
    setDate(currentDate.toISOString().split('T')[0]);
  };
  
  // Tính toán trước khi hiển thị
  const currentDate = date ? new Date(date) : new Date();
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  const calendarDays = generateCalendarDays();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Nội dụng tổng thể */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">History</h1>
        <input className="mb-5" type="text" placeholder="Chau Quoc Kiet update 18/3/2025" size="50"></input>
        {/* Kích thước mô byte =)) */}
        <div className="flex mb-6 border-b lg:hidden">
          <button 
            className={`py-2 px-4 ${activeTab === 'activities' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('activities')}
          >
            Activity Log
          </button>
        </div>
        
        {/* Điều kiện hiển thị */}
        <div className={`lg:hidden ${activeTab === 'activities' ? 'block' : 'hidden'}`}>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={activityType}
                  onChange={(e) => {
                    setActivityType(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg cursor-pointer"
                  value={date ? new Date(date).toLocaleDateString() : ''}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  placeholder="Select a date"
                  readOnly
                />
                <Calendar 
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer" 
                  size={18} 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                />
                
                {/* Custom date picker dropdown */}
                {showDatePicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border">
                    <div className="p-2 border-b flex justify-between items-center">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => changeMonth(-1)}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="font-medium">
                        {currentMonth} {currentYear}
                      </div>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => changeMonth(1)}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    
                    <div className="p-2">
                      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                          <div key={i} className="py-1">{day}</div>
                        ))}
                      </div>
                      
                      {calendarDays.map((week, i) => (
                        <div key={i} className="grid grid-cols-7 gap-1 text-center">
                          {week.map((day, j) => {
                            const isToday = date && day ? 
                              new Date(date).getDate() === day : false;
                            
                            return (
                              <div key={j} className="h-8 flex items-center justify-center">
                                {day ? (
                                  <button
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                                    ${isToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                    onClick={() => selectDate(day)}
                                  >
                                    {day}
                                  </button>
                                ) : <div className="w-8 h-8"></div>}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-2 border-t flex justify-between">
                      <button 
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        onClick={() => {
                          setDate('');
                          setShowDatePicker(false);
                        }}
                      >
                        Clear
                      </button>
                      <button
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <button 
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  onClick={() => {
                    setDate('');
                    setActivityType('All Activities');
                    setCurrentPage(1);
                    setShowDatePicker(false);
                  }}
                >
                  <Filter size={18} />
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {/* Bảng Hoạt động trên kích thước mô byte :_)) */}
          <div className="space-y-4">
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">{activity.type}</h3>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    <div>{activity.date} - {activity.time}</div>
                  </div>
                  <button 
                    className="text-blue-600 text-sm flex items-center gap-1"
                    onClick={() => viewActivityDetails(activity)}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                 Sorry, no activities match your filters.
              </div>
            )}
          </div>

          {/* Chuyển trang trên mô byte */}
          {filteredActivities.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <button 
                className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        {/* Quản lý hồ sơ trên mô byte */}
 
        {/* Nôi dung trên màn hình desktop */}
        <div className="hidden lg:block">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <select
                  className="w-full p-2 border rounded-lg"
                  value={activityType}
                  onChange={(e) => {
                    setActivityType(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg cursor-pointer"
                    value={date ? new Date(date).toLocaleDateString() : ''}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    placeholder="Select a date"
                    readOnly
                  />
                  <Calendar 
                    className="absolute right-3 top-2.5 text-gray-400 cursor-pointer" 
                    size={18} 
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  />
                  
                  {/* Desktop date picker dropdown */}
                  {showDatePicker && (
                    <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border">
                      <div className="p-2 border-b flex justify-between items-center">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => changeMonth(-1)}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <div className="font-medium">
                          {currentMonth} {currentYear}
                        </div>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => changeMonth(1)}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      <div className="p-2">
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                            <div key={i} className="py-1">{day}</div>
                          ))}
                        </div>
                        
                        {calendarDays.map((week, i) => (
                          <div key={i} className="grid grid-cols-7 gap-1 text-center">
                            {week.map((day, j) => {
                              const isToday = date && day ? 
                                new Date(date).getDate() === day : false;
                              
                              return (
                                <div key={j} className="h-8 flex items-center justify-center">
                                  {day ? (
                                    <button
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                                      ${isToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                      onClick={() => selectDate(day)}
                                    >
                                      {day}
                                    </button>
                                  ) : <div className="w-8 h-8"></div>}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-2 border-t flex justify-between">
                        <button 
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                          onClick={() => {
                            setDate('');
                            setShowDatePicker(false);
                          }}
                        >
                          Clear
                        </button>
                        <button
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => setShowDatePicker(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  onClick={() => {
                    setDate('');
                    setActivityType('All Activities');
                    setCurrentPage(1);
                    setShowDatePicker(false);
                  }}
                >
                  <Filter size={18} />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Activity Table - Desktop */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs">
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedActivities.length > 0 ? (
                    paginatedActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">{activity.type}</td>
                        <td className="py-4 px-4">
                          <div>{activity.date}</div>
                          <div className="text-gray-500">{activity.time}</div>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            onClick={() => viewActivityDetails(activity)}
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-gray-500">
                        Sorry, no activities match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chuyển trang */}
          {filteredActivities.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bảng mô tả khi click vào view details */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">{selectedActivity.type}</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Date & Time:</span>
                  <span>{selectedActivity.date} {selectedActivity.time}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Duration:</span>
                  <span>{selectedActivity.duration}</span>
                </div>
                {selectedActivity.score !== '-' && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Score:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getScoreColor(selectedActivity.score)}`}>
                      {selectedActivity.score}
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Details</h4>
                <p className="text-gray-700">{selectedActivity.details}</p>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-full p-2 bg-blue-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
