import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryPage from './pages/CategoryPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import DictionaryPage from './pages/DictionaryPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import HistoryPage from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';
import ConversationalAIPage from './pages/ConversationalAIPage';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';

// Component Layout có Navbar
const MainLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex-1 ml-0 md:ml-56 mt-12">
      {children}
      <Footer />
    </div>
  </div>
);

// Component Layout không có Navbar cho trang Authentication
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />; //mở lại để thực hiện đăng nhập 
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route cho landing page - không cần đăng nhập */}
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
          
          {/* Route cho trang login - không có Navbar */}
          <Route 
            path="/login" 
            element={
              <AuthLayout>
                <AuthPage />
              </AuthLayout>
            } 
          />
          
          {/* Các route khác - có Navbar */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dictionary"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DictionaryPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PracticePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProgressPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HistoryPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/conversational-ai"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ConversationalAIPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/category/:category"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CategoryPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 
