
import React from 'react';
import { View } from '../types';
import { LayoutDashboard, ShieldAlert, Globe, BookOpen, FileText, Briefcase, Lightbulb, Settings, X } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
  onOpenSettings: () => void;
  bestPracticesBadge?: number;
}

const AntiRiskLogo = ({ className = "w-11 h-11" }: { className?: string }) => (
  <div className={`${className} bg-[#c62828] rounded-xl flex items-center justify-center shadow-lg`}>
    <span className="text-white font-black text-xl tracking-tighter">AR</span>
  </div>
);

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setView, 
  isMobileMenuOpen, 
  closeMobileMenu, 
  onOpenSettings,
  bestPracticesBadge = 0
}) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.ADVISOR, label: 'AI Advisor', icon: ShieldAlert },
    { id: View.WEEKLY_TIPS, label: 'Weekly Training Tips', icon: Lightbulb },
    { id: View.BEST_PRACTICES, label: 'Global Best Practices', icon: Globe },
    { id: View.TRAINING, label: 'Training Builder', icon: BookOpen },
    { id: View.REPORT_ANALYZER, label: 'Report Analyzer', icon: FileText },
    { id: View.TOOLKIT, label: 'Ops Toolkit', icon: Briefcase },
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-[60] w-[85vw] sm:w-[320px] bg-[#0d1421] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none h-screen flex flex-col";
  const mobileClasses = isMobileMenuOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in"
          onClick={closeMobileMenu}
        />
      )}

      <div className={`${baseClasses} ${mobileClasses}`}>
        {/* Header Section: Logo + Text Stack */}
        <div className="p-8 pb-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <AntiRiskLogo />
            <div>
              <h1 className="font-bold text-[24px] text-white leading-none tracking-tight">AntiRisk</h1>
              <p className="text-[12px] text-[#ff7272] font-semibold tracking-[0.05em] mt-1 uppercase">MANAGEMENT</p>
            </div>
          </div>
          <button 
            onClick={closeMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Navigation Items: Precise Spacing & Styles */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  closeMobileMenu();
                }}
                className={`w-full flex items-center justify-between px-5 py-[14px] rounded-[18px] transition-all duration-200 group active:scale-[0.98] ${
                  isActive 
                    ? 'bg-[#2962ff] text-white shadow-lg shadow-[#2962ff]/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon 
                    size={22} 
                    className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} 
                    strokeWidth={isActive ? 2.5 : 1.8} 
                  />
                  <span className={`text-[17px] transition-colors ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                </div>
                {item.id === View.BEST_PRACTICES && bestPracticesBadge > 0 && (
                  <span className="bg-[#ff1744] text-white text-[10px] font-black px-2 py-1 rounded-lg">
                    {bestPracticesBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section: Alert Settings & System Status Box */}
        <div className="p-4 pt-4 space-y-4 bg-[#0d1421] border-t border-white/5">
          <button 
            onClick={() => { onOpenSettings(); closeMobileMenu(); }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[18px] text-slate-400 hover:text-white transition-all active:scale-[0.98]"
          >
            <Settings size={22} strokeWidth={1.8} />
            <span className="font-semibold text-[17px]">Alert Settings</span>
          </button>
          
          <div className="bg-[#1a2232] rounded-[24px] p-6 mx-1 border border-white/5">
            <h4 className="text-[12px] font-bold text-slate-500 uppercase mb-3 tracking-[0.12em] leading-tight">SYSTEM STATUS</h4>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.5)]"></span>
              <span className="text-[14px] font-semibold text-slate-300">AntiRisk AI Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
