import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Settings, LogOut, Search, Bell, Menu, ChevronLeft } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Candidates', path: '/admin/candidates', end: false, icon: Users },
    { name: 'Settings', path: '#', end: false, icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white transition p-2 rounded-lg hover:bg-slate-800"
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center rounded-lg transition-colors p-3 ${
                  isActive && item.name !== 'Settings'
                    ? 'bg-primary text-white shadow' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`
              }
              title={item.name}
            >
              <item.icon size={22} className="shrink-0" />
              {isSidebarOpen && <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center text-slate-400 hover:bg-red-500/10 hover:text-red-500 p-3 rounded-lg transition-colors ${
              isSidebarOpen ? 'justify-start' : 'justify-center'
            }`}
            title="Logout"
          >
            <LogOut size={22} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm relative">
          
          {/* Global Search - Let's stick it to the left */}
          <div className="flex items-center w-1/3">
             <div className="relative w-full max-w-md hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="search" 
                 placeholder="Search globally..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
               />
             </div>
          </div>

          {/* Absolute Center Title - ATS bold font styling */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
             <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight font-sans">
                Faculty ATS
             </h1>
          </div>

          {/* Right Area */}
          <div className="flex items-center space-x-4 w-1/3 justify-end">
            <button className="text-gray-400 hover:text-gray-600 relative p-2">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800 leading-none mb-1 group-hover:text-primary transition">{user?.fullName || 'Administrator'}</span>
                <span className="text-[10px] uppercase tracking-wide font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Admin</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 shadow-sm">
                 {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Outlet */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
