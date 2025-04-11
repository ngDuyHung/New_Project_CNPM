import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CategoryPage = () => {
  const { category } = useParams();
  const [content, setContent] = useState('');
  const [categoryData, setCategoryData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryContent = async () => {
      try {
        setLoading(true);
        // Đầu tiên lấy danh sách các danh mục
        const categoriesResponse = await axiosInstance.get('/api/categories');
        const categories = categoriesResponse.data;
        
        // Tìm danh mục phù hợp với tham số URL
        const foundCategory = categories.find(cat => 
          cat.name.toLowerCase() === category.toLowerCase() || 
          cat.id.toString() === category
        );
        
        if (!foundCategory) {
          setError('Danh mục không tồn tại');
          setLoading(false);
          return;
        }
        
        // Sau đó lấy nội dung của danh mục đó
        const contentResponse = await axiosInstance.get(`/api/categories/${foundCategory.id}/content`);
        setCategoryData(contentResponse.data.category);
        setContent(contentResponse.data.content);
        setEditContent(contentResponse.data.content);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category content:', error);
        setError('Không thể tải nội dung danh mục');
        setLoading(false);
      }
    };

    fetchCategoryContent();
  }, [category]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditContent(content);
  };

  const handleContentChange = (e) => {
    setEditContent(e.target.value);
  };

  const handleSaveContent = async () => {
    try {
      await axiosInstance.put(`/api/categories/${categoryData.id}/content`, {
        content: editContent
      });
      setContent(editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating content:', error);
      setError('Không thể cập nhật nội dung');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full p-8">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => navigate('/')}
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {categoryData ? categoryData.name : `Danh mục ${category}`}
        </h1>
        
        {user && (
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Hủy' : 'Sửa nội dung'}
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="mb-6">
          <textarea
            value={editContent}
            onChange={handleContentChange}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveContent}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 