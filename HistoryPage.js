import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ChevronLeft, ChevronRight, Eye, Filter, X, Edit, Trash2 } from 'lucide-react';

// Định nghĩa BASE_URL cho API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HistoryPage = () => {
  const [date, setDate] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activities, setActivities] = useState([]); // Dữ liệu lịch sử từ backend
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    exerciseId: '',
    correctAnswers: '',
    totalQuestions: '',
    type: 'dienkhuyet',
    topicId: '',
    topicName: '',
    id: null,
  });

  // Ánh xạ hiển thị các loại bài tập
  const typeDisplayNames = {
    flashcard: 'Flashcard',
    dienkhuyet: 'Fill in the blanks',
    nghenoi: 'Listening and speaking',
    viet: 'Writing',
  };

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'flashcard', label: 'Flashcard' },
    { value: 'dienkhuyet', label: 'Fill in the blanks' },
    { value: 'nghenoi', label: 'Listening and speaking' },
    { value: 'viet', label: 'Writing' },
  ];

  // Hàm lấy lịch sử làm bài từ backend
  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(`${BASE_URL}/api/history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setActivities(response.data.data); // Lưu dữ liệu lịch sử vào state
      } else {
        setError(response.data.message || 'Failed to fetch history');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Cập nhật lịch sử làm bài
  const handleUpdateHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        id: selectedActivity.id,
        score: formData.correctAnswers,
        totalQuestions: formData.totalQuestions,
        exercise_id: formData.exerciseId,
      };
      const response = await axios.put(`${BASE_URL}/api/history/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setActivities((prev) =>
          prev.map((item) =>
            item.id === selectedActivity.id
              ? { ...item, ...formData, score: `${formData.correctAnswers}/${formData.totalQuestions}` }
              : item
          )
        );
        setShowDetailModal(false);
        setEditMode(false);
        resetForm();
        fetchHistory(); // Làm mới danh sách sau khi cập nhật
      } else {
        setError(response.data.message || 'Failed to update history');
      }
    } catch (err) {
      console.error('Error updating history:', err);
      setError(err.response?.data?.message || 'Error updating history');
    } finally {
      setLoading(false);
    }
  };

  // Xóa lịch sử làm bài
  const handleDeleteHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/history/delete/${selectedActivity.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setActivities((prev) => prev.filter((item) => item.id !== selectedActivity.id));
        setShowDeleteConfirm(false);
        setShowDetailModal(false);
      } else {
        setError(response.data.message || 'Failed to delete history');
      }
    } catch (err) {
      console.error('Error deleting history:', err);
      setError(err.response?.data?.message || 'Error deleting history');
    } finally {
      setLoading(false);
    }
  };

  // Đánh giá mức độ
  const getScoreColor = (scoreStr) => {
    const [score, total] = scoreStr.split('/').map(Number);
    if (isNaN(score) || isNaN(total) || total === 0) return 'bg-gray-100 text-gray-800';
    const percentage = (score / total) * 100;
    if (percentage >= 85) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };


  // Hiển thị số mục cần hiển thị cho người dùng
  const itemsPerPage = 5;
  const filteredActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.datetime).toISOString().split('T')[0];
    const matchesType = activityType === 'all' || activity.type === activityType;
    const matchesDate = !date || activityDate === date;
    return matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const viewActivityDetails = (activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      exerciseId: '',
      correctAnswers: '',
      totalQuestions: '',
      type: 'dienkhuyet',
      topicId: '',
      topicName: '',
      id: null,
    });
  };

  // Datetime
  const generateCalendarDays = () => {
    const today = date ? new Date(date) : new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];
    let dayCount = 1;

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
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const selectDate = (day) => {
    if (!day) return;
    const selectedDate = new Date(date || new Date());
    selectedDate.setDate(day);
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

  const currentDate = date ? new Date(date) : new Date();
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const calendarDays = generateCalendarDays();

  // Đánh số trang
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">History</h1>
        <p className="text-gray-500">ChauQuocKiet 29/03/2025</p>
      </div>

      {loading && <div className="text-center text-gray-600 mb-4">Loading...</div>}
      {error && <div className="text-center text-red-600 mb-4">Error: {error}</div>}

      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <select
            className="w-full sm:w-1/3 p-2 border rounded-lg text-sm"
            value={activityType}
            onChange={(e) => {
              setActivityType(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              className="w-full p-2 border rounded-lg cursor-pointer text-sm"
              value={date ? new Date(date).toLocaleDateString() : ''}
              onClick={() => setShowDatePicker(!showDatePicker)}
              placeholder="Select a date"
              readOnly
              disabled={loading}
            />
            <Calendar
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              size={18}
              onClick={() => setShowDatePicker(!showDatePicker)}
            />
            {showDatePicker && (
              <div className="absolute z-10 mt-1 w-full sm:w-64 bg-white rounded-lg shadow-lg border">
                <div className="p-2 border-b flex justify-between items-center">
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => changeMonth(-1)}
                    disabled={loading}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="font-medium text-sm">
                    {currentMonth} {currentYear}
                  </div>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => changeMonth(1)}
                    disabled={loading}
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
                        const isToday = date && day ? new Date(date).getDate() === day : false;
                        return (
                          <div key={j} className="h-8 flex items-center justify-center">
                            {day ? (
                              <button
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                                  ${isToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                onClick={() => selectDate(day)}
                                disabled={loading}
                              >
                                {day}
                              </button>
                            ) : (
                              <div className="w-8 h-8"></div>
                            )}
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
                    disabled={loading}
                  >
                    Clear
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => setShowDatePicker(false)}
                    disabled={loading}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            onClick={() => {
              setDate('');
              setActivityType('all');
              setCurrentPage(1);
              setShowDatePicker(false);
            }}
            disabled={loading}
          >
            <Filter size={18} />
            Reset
          </button>
        </div>
      </div>

      {/* Danh sách hoạt động */}
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedActivities.length > 0 ? (
          paginatedActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-3">
                <h3 className="font-medium text-sm sm:text-base">{activity.topicName}</h3>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mb-3">
                <div>Type: {typeDisplayNames[activity.type] || activity.type}</div>
                <div>{new Date(activity.datetime).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 text-xs sm:text-sm flex items-center gap-1"
                  onClick={() => viewActivityDetails(activity)}
                  disabled={loading}
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  className="text-yellow-600 text-xs sm:text-sm flex items-center gap-1"
                  onClick={() => {
                    setSelectedActivity(activity);
                    setFormData({
                      exerciseId: activity.exerciseId,
                      correctAnswers: activity.score.split('/')[0],
                      totalQuestions: activity.score.split('/')[1],
                      type: activity.type,
                      topicId: activity.topicId,
                      topicName: activity.topicName,
                    });
                    setEditMode(true);
                    setShowDetailModal(true);
                  }}
                  disabled={loading}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  className="text-red-600 text-xs sm:text-sm flex items-center gap-1"
                  onClick={() => {
                    setSelectedActivity(activity);
                    setShowDeleteConfirm(true);
                  }}
                  disabled={loading}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow p-6 text-center text-gray-500">
            {loading ? 'Loading...' : 'Sorry, no activities match your filters.'}
          </div>
        )}
      </div>

      {/* Phân trang */}
      {filteredActivities.length > 0 && (
        <div className="flex flex-col items-center mt-6 gap-4">
          <div className="text-gray-600 text-sm">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of{' '}
            {filteredActivities.length} activities
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronLeft size={20} className="rotate-180" />
            </button>
            <button
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={20} />
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg border text-sm ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage(page)}
                disabled={loading}
              >
                {page}
              </button>
            ))}
            <button
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight size={20} />
            </button>
            <button
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Chi tiết/Sửa */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-y-auto max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-sm sm:text-base">
                {editMode ? 'Edit History' : (typeDisplayNames[selectedActivity.type] || selectedActivity.type)}
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setEditMode(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 text-sm sm:text-base">
              {editMode ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Exercise ID"
                    value={formData.exerciseId}
                    onChange={(e) => setFormData({ ...formData, exerciseId: e.target.value })}
                    disabled={loading}
                  />
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Correct Answers"
                    value={formData.correctAnswers}
                    onChange={(e) => setFormData({ ...formData, correctAnswers: e.target.value })}
                    disabled={loading}
                  />
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Total Questions"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                    disabled={loading}
                  />
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    disabled={loading}
                  >
                    {activityTypes.slice(1).map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Topic ID"
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                    disabled={loading}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Topic Name"
                    value={formData.topicName}
                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Topic:</span>
                    <span>{selectedActivity.topicName}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Type:</span>
                    <span>{typeDisplayNames[selectedActivity.type] || selectedActivity.type}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Score:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getScoreColor(selectedActivity.score)}`}>
                      {selectedActivity.score}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Date & Time:</span>
                    <span>{new Date(selectedActivity.datetime).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              {editMode ? (
                <button
                  onClick={handleUpdateHistory}
                  className="w-full p-2 bg-yellow-600 text-white rounded-lg text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setFormData({
                        exerciseId: selectedActivity.exerciseId,
                        correctAnswers: selectedActivity.score.split('/')[0],
                        totalQuestions: selectedActivity.score.split('/')[1],
                        type: selectedActivity.type,
                        topicId: selectedActivity.topicId,
                        topicName: selectedActivity.topicName,
                      });
                      setEditMode(true);
                    }}
                    className="w-full p-2 bg-yellow-600 text-white rounded-lg text-sm sm:text-base"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full p-2 bg-red-600 text-white rounded-lg text-sm sm:text-base"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setEditMode(false);
                  resetForm();
                }}
                className="w-full p-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base"
                disabled={loading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
      {showDeleteConfirm && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-auto p-4">
            <div className="mb-4">
              <h3 className="font-medium text-sm sm:text-base">Confirm Delete</h3>
              <p className="text-gray-700 text-sm mt-2">
                Are you sure you want to delete this history for "{selectedActivity.topicName}"?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteHistory}
                className="w-full p-2 bg-red-600 text-white rounded-lg text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full p-2 bg-gray-600 text-white rounded-lg text-sm sm:text-base"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;