import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const sidebarItems = [
  { name: 'Home', path: '/home', icon: HomeIcon },
  { name: 'Dictionary', path: '/dictionary', icon: BookOpenIcon },
  { name: 'Practice', path: '/practice', icon: AcademicCapIcon },
  { name: 'Progress', path: '/progress', icon: ChartBarIcon },
  { name: 'History', path: '/history', icon: ClockIcon },
];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <header className="bg-blue-600 text-white px-3 py-1.5 flex justify-between items-center fixed w-full z-50">
        <div className="flex items-center space-x-2">
          <button 
            className="md:hidden p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
          <h1 className="text-base md:text-lg font-bold">English VocabMaster</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          <button className="p-1.5 hover:bg-blue-700 rounded-full transition-colors">
            <BellIcon className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-sm">{user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-2 py-1 md:px-3 md:py-1.5 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-xs md:text-sm"
              >
                <UserCircleIcon className="h-3 w-3 md:h-4 md:w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center space-x-1 px-2 py-1 md:px-3 md:py-1.5 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-xs md:text-sm"
            >
              <UserCircleIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      <nav className={`
        w-56 bg-amber-50 fixed left-0 top-12 bottom-0 z-40
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:transition-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        p-3 space-y-1 overflow-y-auto
      `}>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-amber-200 text-amber-900'
                    : 'hover:bg-amber-100 text-gray-700'
                }`
              }
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navbar; 
