import React from 'react';
import { LayoutDashboard, CheckSquare, LogOut, User as UserIcon, Mountain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden md:flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg shadow-primary-500/30">
            <Mountain className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Pathfinder</span>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
          <button
            onClick={() => setView(ViewState.DASHBOARD)}
            className={`flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
              currentView === ViewState.DASHBOARD
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 mr-3 transition-colors ${currentView === ViewState.DASHBOARD ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            Dashboard
          </button>
          <button
            onClick={() => setView(ViewState.MILESTONES)}
            className={`flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
              currentView === ViewState.MILESTONES
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CheckSquare className={`w-5 h-5 mr-3 transition-colors ${currentView === ViewState.MILESTONES ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            Milestones
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4 group transition-colors hover:bg-slate-100 cursor-default">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-primary-600 font-bold text-sm">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 truncate font-medium">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col relative bg-[#f8fafc]">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none z-0" />

        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30">
           <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-600 rounded-lg">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Pathfinder</span>
          </div>
          <button onClick={logout} className="text-slate-500 hover:text-slate-700 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>
        
        {/* Mobile Navigation */}
        <div className="md:hidden bg-white border-b border-slate-200 flex justify-around p-2 sticky top-[65px] z-20 shadow-sm">
           <button
            onClick={() => setView(ViewState.DASHBOARD)}
            className={`flex-1 flex justify-center py-2.5 rounded-xl transition-colors ${currentView === ViewState.DASHBOARD ? 'bg-primary-50 text-primary-700' : 'text-slate-500'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView(ViewState.MILESTONES)}
            className={`flex-1 flex justify-center py-2.5 rounded-xl transition-colors ${currentView === ViewState.MILESTONES ? 'bg-primary-50 text-primary-700' : 'text-slate-500'}`}
          >
            <CheckSquare className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;