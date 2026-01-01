
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Send, Plus, Search, RefreshCw, Download, FileText, ChevronRight, ShieldAlert, BookOpen, Globe, Briefcase, Calendar, ChevronLeft, Save, Trash2, Check, Lightbulb, Printer, Settings as SettingsIcon, MessageCircle, Mail, X, Bell, Database, Upload, Pin, PinOff, BarChart2, Sparkles, Copy, Lock, ShieldCheck, Fingerprint, ExternalLink, SendHorizonal, BrainCircuit, TrendingUp, History } from 'lucide-react';
import Navigation from './components/Navigation';
import MarkdownRenderer from './components/MarkdownRenderer';
import ShareButton from './components/ShareButton';
import IncidentChart from './components/IncidentChart';
import { View, ChatMessage, Template, SecurityRole, StoredReport, WeeklyTip, UserProfile, KnowledgeDocument } from './types';
import { STATIC_TEMPLATES } from './constants';
import { generateAdvisorResponseStream, generateTrainingModule, analyzeReport, fetchBestPractices, generateWeeklyTip, generateOperationalInsights } from './services/geminiService';

const AntiRiskLogo = ({ className = "w-24 h-24", light = false }: { className?: string; light?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 L95 85 L5 85 Z" fill={light ? "#1e293b" : "#000000"} />
    <path d="M50 15 L85 80 L15 80 Z" fill={light ? "#334155" : "#000000"} />
    <path d="M5 L85 L25 85 L15 65 Z" fill="#dc2626" />
    <path d="M95 85 L75 85 L85 65 Z" fill="#dc2626" />
    <circle cx="50" cy="55" r="30" fill="white" />
    <text x="50" y="68" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="bold" fill="black" textAnchor="middle">AR</text>
    <rect x="0" y="85" width="100" height="15" fill={light ? "#000000" : "black"} />
    <text x="50" y="96" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">ANTI-RISK SECURITY</text>
  </svg>
);

function App() {
  const [appState, setAppState] = useState<'SPLASH' | 'PIN_ENTRY' | 'PIN_SETUP' | 'READY'>('SPLASH');
  const [pinInput, setPinInput] = useState('');
  const [setupStep, setSetupStep] = useState(1);
  const [tempPin, setTempPin] = useState('');
  const [isPinError, setIsPinError] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);
  const [storedPin, setStoredPin] = useState<string | null>(() => localStorage.getItem('security_app_vault_pin'));

  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('security_app_profile');
    return saved ? JSON.parse(saved) : { name: 'Executive Director', phoneNumber: '', email: '' };
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('security_app_chat');
    return saved ? JSON.parse(saved) : [{
      id: 'welcome',
      role: 'model',
      text: "Welcome, Director. I am the AntiRisk Strategy Unit. Our protocols are currently aligned with ISO 18788 and Nigerian private security regulations. How can I assist with your operational oversight today?",
      timestamp: Date.now(),
      isPinned: false
    }];
  });

  const [storedReports, setStoredReports] = useState<StoredReport[]>(() => {
    const saved = localStorage.getItem('security_app_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [weeklyTips, setWeeklyTips] = useState<WeeklyTip[]>(() => {
    const saved = localStorage.getItem('security_app_weekly_tips');
    return saved ? JSON.parse(saved) : [];
  });

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeDocument[]>(() => {
    const saved = localStorage.getItem('security_app_kb');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isAdvisorThinking, setIsAdvisorThinking] = useState(false);
  const [showKbModal, setShowKbModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [reportText, setReportText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [operationalInsights, setOperationalInsights] = useState<string>(() => localStorage.getItem('security_app_insights') || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isTipLoading, setIsTipLoading] = useState(false);

  const [bpSearchQuery, setBpSearchQuery] = useState('');
  const [isBpLoading, setIsBpLoading] = useState(false);
  const [bpResult, setBpResult] = useState<{ text: string, sources?: any[] } | null>(null);

  const [trainingRole, setTrainingRole] = useState<string>(SecurityRole.GUARD);
  const [trainingTopic, setTrainingTopic] = useState('');
  const [trainingContent, setTrainingContent] = useState('');
  const [isTrainingLoading, setIsTrainingLoading] = useState(false);

  // Auto-Dispatch States
  const [showDispatchOverlay, setShowDispatchOverlay] = useState(false);
  const [pendingDispatchTip, setPendingDispatchTip] = useState<WeeklyTip | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('security_app_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('security_app_chat', JSON.stringify(messages)); chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { localStorage.setItem('security_app_reports', JSON.stringify(storedReports)); }, [storedReports]);
  useEffect(() => { localStorage.setItem('security_app_weekly_tips', JSON.stringify(weeklyTips)); }, [weeklyTips]);
  useEffect(() => { localStorage.setItem('security_app_kb', JSON.stringify(knowledgeBase)); }, [knowledgeBase]);
  useEffect(() => { localStorage.setItem('security_app_insights', operationalInsights); }, [operationalInsights]);

  /**
   * Bi-Weekly Automated Check
   */
  useEffect(() => {
    if (appState === 'READY') {
      const checkBiWeeklyDispatch = async () => {
        const BI_WEEKLY_MS = 14 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const lastGenerated = weeklyTips.length > 0 ? weeklyTips[0].timestamp : 0;

        if (now - lastGenerated > BI_WEEKLY_MS) {
          console.log("Bi-weekly intelligence cycle due. Initiating generation...");
          setIsTipLoading(true);
          const content = await generateWeeklyTip();
          const newTip: WeeklyTip = { 
            id: Date.now().toString(), 
            timestamp: Date.now(), 
            weekDate: new Date().toLocaleDateString(), 
            topic: 'Bi-Weekly Strategy Briefing', 
            content, 
            isAutoGenerated: true 
          };
          setWeeklyTips(prev => [newTip, ...prev]);
          setPendingDispatchTip(newTip);
          setShowDispatchOverlay(true);
          setIsTipLoading(false);
        }
      };
      checkBiWeeklyDispatch();
    }
  }, [appState]);

  useEffect(() => {
    if (appState === 'SPLASH') {
      const startTime = Date.now();
      const duration = 2000;
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setSplashProgress(progress);
        if (progress >= 100) {
          clearInterval(timer);
          setAppState(storedPin ? 'PIN_ENTRY' : 'PIN_SETUP');
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [appState, storedPin]);

  const handlePinDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    const newPin = pinInput + digit;
    setPinInput(newPin);
    setIsPinError(false);
    if (newPin.length === 4) {
      if (appState === 'PIN_ENTRY') {
        if (newPin === storedPin) setAppState('READY');
        else { setIsPinError(true); setTimeout(() => setPinInput(''), 500); }
      } else {
        if (setupStep === 1) { setTempPin(newPin); setSetupStep(2); setPinInput(''); }
        else {
          if (newPin === tempPin) { localStorage.setItem('security_app_vault_pin', newPin); setStoredPin(newPin); setAppState('READY'); }
          else { setIsPinError(true); setSetupStep(1); setPinInput(''); alert("Mismatch."); }
        }
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAdvisorThinking(true);
    const aiMsgId = (Date.now() + 1).toString() + 'ai';
    let fullAiText = "";
    setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: "", timestamp: Date.now() }]);
    await generateAdvisorResponseStream(messages, inputMessage, knowledgeBase, (chunk) => {
      setIsAdvisorThinking(false);
      fullAiText += chunk;
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullAiText } : m));
    });
  };

  const handleFetchBP = async (forceQuery?: string) => {
    const query = forceQuery || bpSearchQuery;
    if (!query.trim()) return;
    setIsBpLoading(true);
    try {
      const result = await fetchBestPractices(query);
      setBpResult(result);
    } catch (err) {
      console.error("BP Fetch Error:", err);
    } finally {
      setIsBpLoading(false);
    }
  };

  const handleDashboardUpdateClick = (topic: string) => {
    setBpSearchQuery(topic);
    setCurrentView(View.BEST_PRACTICES);
    handleFetchBP(topic);
  };

  const handleGenerateTraining = async () => {
    if (!trainingTopic.trim()) return;
    setIsTrainingLoading(true);
    const content = await generateTrainingModule(trainingRole, trainingTopic);
    setTrainingContent(content);
    setIsTrainingLoading(false);
  };

  const handleAnalyzeReport = async () => {
    if (!reportText) return;
    setIsAnalyzing(true);
    const result = await analyzeReport(reportText, storedReports);
    setAnalysisResult(result);
    setStoredReports(prev => [{ id: Date.now().toString(), timestamp: Date.now(), dateStr: new Date().toLocaleDateString(), content: reportText, analysis: result }, ...prev]);
    setIsAnalyzing(false);
    setReportText(''); // Clear for next log
  };

  const handleGenerateInsights = async () => {
    if (storedReports.length < 2) {
      alert("At least 2 reports are required for operational pattern detection.");
      return;
    }
    setIsGeneratingInsights(true);
    const insights = await generateOperationalInsights(storedReports);
    setOperationalInsights(insights);
    setIsGeneratingInsights(false);
  };

  const handleGenerateWeeklyTip = async (isAuto: boolean) => {
    setIsTipLoading(true);
    const content = await generateWeeklyTip();
    const newTip: WeeklyTip = { id: Date.now().toString(), timestamp: Date.now(), weekDate: new Date().toLocaleDateString(), topic: 'Intelligence Briefing', content, isAutoGenerated: isAuto };
    setWeeklyTips(prev => [newTip, ...prev]);
    setIsTipLoading(false);
  };

  const handleAddKbDocument = () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    const newDoc: KnowledgeDocument = { id: Date.now().toString(), title: newDocTitle, content: newDocContent, dateAdded: new Date().toLocaleDateString() };
    setKnowledgeBase(prev => [newDoc, ...prev]);
    setNewDocTitle('');
    setNewDocContent('');
  };

  const handleRemoveKbDocument = (id: string) => { setKnowledgeBase(prev => prev.filter(doc => doc.id !== id)); };

  const triggerDispatch = (type: 'WHATSAPP' | 'EMAIL') => {
    if (!pendingDispatchTip) return;
    const { topic, content } = pendingDispatchTip;
    if (type === 'WHATSAPP') {
      const text = encodeURIComponent(`*AntiRisk Bi-Weekly Intelligence: ${topic}*\n\n${content}`);
      const phone = userProfile.phoneNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    } else {
      const subject = encodeURIComponent(`AntiRisk Intelligence: ${topic}`);
      const body = encodeURIComponent(content);
      window.open(`mailto:${userProfile.email}?subject=${subject}&body=${body}`, '_blank');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 max-w-2xl mx-auto pb-24 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-[#1e40af] to-[#1e1b4b] border border-blue-500/20 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <ShieldCheck size={280} strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Welcome, CEO</h2>
          <p className="text-blue-100/80 text-lg mb-10 leading-relaxed max-w-md">
            Your executive dashboard is active. Global threat levels are being monitored. 
            Recent analysis suggests reviewing patrol protocols this week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setCurrentView(View.ADVISOR)} className="flex-1 bg-white text-[#1e1b4b] py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 active:scale-95 transition-all shadow-xl">
              Consult Advisor
            </button>
            <button onClick={() => setCurrentView(View.REPORT_ANALYZER)} className="flex-1 bg-[#2563eb] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-xl border border-blue-400/30">
              Analyze Reports
            </button>
          </div>
        </div>
      </div>

      <div onClick={() => setCurrentView(View.WEEKLY_TIPS)} className="bg-[#1a2232] border border-slate-700/40 rounded-[2rem] p-8 cursor-pointer hover:bg-[#202b3f] transition-all group shadow-xl flex items-center gap-8">
        <div className="w-20 h-20 bg-yellow-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Lightbulb className="text-yellow-500" size={36} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Weekly Training</h3>
          <p className="text-slate-400 text-lg">View or generate this week's team focus.</p>
        </div>
      </div>

      <div className="bg-[#1a2232] border border-slate-700/40 rounded-[2rem] p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <RefreshCw className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white tracking-wide">System Updates</h3>
        </div>
        <div className="space-y-8">
          <div onClick={() => handleDashboardUpdateClick('Drone Defense in Private Sectors')} className="flex items-start gap-5 cursor-pointer group">
            <div className="mt-2 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            <div>
              <p className="text-lg font-medium text-slate-200 leading-snug">Global Best Practices updated: "Drone Defense in Private Sectors".</p>
              <span className="text-sm font-bold text-slate-600 mt-2 block uppercase tracking-widest">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBestPractices = () => (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 animate-in fade-in duration-500">
      <div className="bg-[#1b2537] rounded-[2.5rem] p-10 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500">
            <Globe size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Intelligence Hub</h2>
            <p className="text-slate-400 text-lg">Real-time global standards and regulatory grounding.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <input 
            value={bpSearchQuery} 
            onChange={(e) => setBpSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchBP()}
            placeholder="Search ISO standards, regional laws, or tactical updates..." 
            className="flex-1 bg-slate-950/50 border border-slate-700 rounded-2xl px-8 py-5 text-white outline-none focus:border-blue-500 transition-all text-lg shadow-inner"
          />
          <button 
            onClick={() => handleFetchBP()}
            disabled={isBpLoading || !bpSearchQuery.trim()}
            className="bg-[#2962ff] hover:bg-blue-700 p-5 rounded-2xl text-white shadow-xl active:scale-95 disabled:opacity-50 min-w-[70px] flex items-center justify-center"
          >
            {isBpLoading ? <RefreshCw className="animate-spin" size={24} /> : <Search size={28} />}
          </button>
        </div>
      </div>

      {isBpLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <RefreshCw className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Synthesizing Global Grounding Data...</p>
        </div>
      ) : bpResult && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#1b2537] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <ShieldCheck size={24} className="text-blue-500" />
              Strategic Briefing
            </h3>
            <MarkdownRenderer content={bpResult.text} />
          </div>
          <div className="bg-[#1b2537] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl h-fit">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <Database size={20} className="text-emerald-500" />
              Intelligence Sources
            </h3>
            <div className="space-y-4">
              {bpResult.sources && bpResult.sources.length > 0 ? bpResult.sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors group"
                >
                  <p className="text-sm font-bold text-slate-200 line-clamp-2 mb-1 group-hover:text-blue-400">{source.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    <ExternalLink size={10} /> Validated Source
                  </div>
                </a>
              )) : (
                <div className="p-6 border border-dashed border-slate-700 rounded-2xl text-center">
                   <p className="text-slate-500 italic text-sm">Grounding data generated from direct model knowledge.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTrainingBuilder = () => (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in slide-in-from-bottom-6 duration-500">
      <div className="bg-[#1b2537] p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
          <BookOpen size={32} className="text-blue-500" />
          Tactical Module Builder
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Target Audience</label>
            <select 
              value={trainingRole} 
              onChange={(e) => setTrainingRole(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500"
            >
              <option value={SecurityRole.GUARD}>Field Guard Force</option>
              <option value={SecurityRole.SUPERVISOR}>Site Supervisor</option>
              <option value={SecurityRole.GEN_SUPERVISOR}>General Supervisor</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Training Topic</label>
            <input 
              value={trainingTopic} 
              onChange={(e) => setTrainingTopic(e.target.value)}
              placeholder="e.g. Hostile Recognition at Night..." 
              className="w-full bg-slate-950/50 border border-slate-700 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button 
          onClick={handleGenerateTraining}
          disabled={isTrainingLoading || !trainingTopic}
          className="w-full bg-[#2962ff] hover:bg-blue-700 py-6 rounded-3xl font-black text-xl text-white shadow-xl active:scale-95 disabled:opacity-50 transition-all"
        >
          {isTrainingLoading ? <RefreshCw className="animate-spin" /> : "Synthesize Training Module"}
        </button>
      </div>

      {trainingContent && (
        <div className="bg-[#1b2537] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">Generated Syllabus</h3>
            <ShareButton title={`AntiRisk Training: ${trainingTopic}`} content={trainingContent} />
          </div>
          <MarkdownRenderer content={trainingContent} />
        </div>
      )}
    </div>
  );

  const renderOpsToolkit = () => (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 pb-24 animate-in fade-in duration-500">
      {STATIC_TEMPLATES.map(template => (
        <div key={template.id} className="bg-[#1b2537] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400">
              <Briefcase size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white leading-tight">{template.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{template.description}</p>
            </div>
          </div>
          <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 font-mono text-[13px] text-slate-400 overflow-y-auto max-h-48 mb-8">
            <pre className="whitespace-pre-wrap">{template.content}</pre>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(template.content);
                alert("Copied to clipboard.");
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all"
            >
              <Copy size={18} /> Copy Template
            </button>
            <ShareButton title={template.title} content={template.content} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderAdvisor = () => (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-[#0d1421] rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl max-w-5xl mx-auto w-full">
      <div className="p-5 bg-slate-900/40 border-b border-slate-700 flex justify-between items-center px-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Strategy Engine Online</span>
        </div>
        <button onClick={() => setShowKbModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl border border-blue-600/20 transition-all text-xs font-black uppercase tracking-wider">
          <Database size={14} />
          Knowledge Manager
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] rounded-[1.5rem] p-6 ${msg.role === 'user' ? 'bg-[#2962ff] text-white shadow-xl shadow-blue-900/20' : 'bg-[#1a2232] text-slate-100 border border-white/5'}`}>
              <MarkdownRenderer content={msg.text} />
              {msg.text === "" && <span className="animate-pulse">|</span>}
            </div>
          </div>
        ))}
        {isAdvisorThinking && <div className="text-slate-500 italic flex items-center gap-3 ml-2"><RefreshCw size={18} className="animate-spin text-blue-500" /> <span className="text-sm font-medium tracking-wide">Synthesizing...</span></div>}
        <div ref={chatEndRef} />
      </div>
      <div className="p-6 bg-slate-900/40 border-t border-slate-800 flex gap-4 backdrop-blur-xl">
        <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Request strategic guidance..." className="flex-1 bg-slate-950/50 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-colors shadow-inner" />
        <button onClick={handleSendMessage} className="bg-[#2962ff] hover:bg-blue-700 p-5 rounded-2xl text-white shadow-xl active:scale-90 transition-all"><Send size={24} /></button>
      </div>
    </div>
  );

  if (appState === 'SPLASH') {
    return (
      <div className="fixed inset-0 bg-[#0a0f1a] flex flex-col items-center justify-center p-8 z-[100]">
        <AntiRiskLogo className="w-32 h-32 mb-10 animate-pulse" light={true} />
        <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#2962ff] transition-all duration-300" style={{ width: `${splashProgress}%` }}></div>
        </div>
      </div>
    );
  }

  if (appState === 'PIN_ENTRY' || appState === 'PIN_SETUP') {
    return (
      <div className="fixed inset-0 bg-[#0a0f1a] flex flex-col items-center justify-center p-6 z-[100] animate-in fade-in duration-700">
        <div className="mb-10 text-center">
          <AntiRiskLogo className="w-20 h-20 mb-8 mx-auto" />
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">{appState === 'PIN_SETUP' ? 'Initialize PIN' : 'Executive Access'}</h2>
        </div>
        <div className="flex gap-8 mb-16">
          {[...Array(4)].map((_, i) => <div key={i} className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${pinInput.length > i ? 'bg-[#2962ff] border-[#2962ff]' : 'border-slate-800'}`} />)}
        </div>
        <div className="grid grid-cols-3 gap-8 w-full max-w-xs">
          {[1,2,3,4,5,6,7,8,9].map(num => <button key={num} onClick={() => handlePinDigit(num.toString())} className="aspect-square bg-slate-900/50 border border-slate-800 rounded-[1.5rem] text-4xl font-black text-white active:scale-90 transition-all">{num}</button>)}
          <div />
          <button onClick={() => handlePinDigit('0')} className="aspect-square bg-slate-900/50 border border-slate-800 rounded-[1.5rem] text-4xl font-black text-white active:scale-90 transition-all">0</button>
          <button onClick={() => setPinInput('')} className="text-red-500 font-black uppercase tracking-[0.1em] text-xs">Reset</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1a] text-slate-100 selection:bg-blue-600/30">
      <Navigation currentView={currentView} setView={setCurrentView} isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} onOpenSettings={() => setShowSettings(true)} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="lg:hidden p-6 border-b border-slate-800/40 flex justify-between items-center bg-[#0d1421]">
          <div className="flex items-center gap-3">
            <AntiRiskLogo className="w-10 h-10 rounded-lg" />
            <h1 className="font-black text-2xl text-white tracking-tighter uppercase">AntiRisk</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 text-white bg-slate-800/50 rounded-2xl active:scale-90 transition-transform"><Menu size={28} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide">
          {currentView === View.DASHBOARD && renderDashboard()}
          {currentView === View.ADVISOR && renderAdvisor()}
          {currentView === View.BEST_PRACTICES && renderBestPractices()}
          {currentView === View.TRAINING && renderTrainingBuilder()}
          {currentView === View.TOOLKIT && renderOpsToolkit()}
          
          {currentView === View.REPORT_ANALYZER && (
            <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Side: Active Log Upload */}
                <div className="w-full lg:w-1/3 bg-[#1b2537] p-8 rounded-[2rem] border border-slate-700/50 flex flex-col shadow-2xl sticky top-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-white">Log Upload</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">Input daily operational logs for standard AI audit and pattern detection storage.</p>
                  <textarea 
                    value={reportText} 
                    onChange={(e) => setReportText(e.target.value)} 
                    className="w-full min-h-[200px] bg-slate-950/40 border border-slate-700 rounded-2xl p-6 text-white outline-none resize-none focus:border-blue-500 transition-colors shadow-inner text-sm leading-relaxed mb-6" 
                    placeholder="Paste field logs here..." 
                  />
                  <button 
                    onClick={handleAnalyzeReport} 
                    disabled={isAnalyzing || !reportText} 
                    className="w-full bg-[#2962ff] hover:bg-blue-700 py-4 rounded-2xl font-black text-lg text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isAnalyzing ? <RefreshCw className="animate-spin" /> : <ShieldCheck size={20} />}
                    {isAnalyzing ? 'Auditing...' : 'Run Analysis'}
                  </button>
                </div>

                {/* Right Side: Analysis Results & Insights */}
                <div className="flex-1 space-y-8 w-full">
                  {/* Strategic Intelligence Header */}
                  <div className="bg-[#1b2537] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                       <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500">
                           <BrainCircuit size={32} />
                         </div>
                         <div>
                           <h3 className="text-2xl font-black text-white">Operational Insights</h3>
                           <p className="text-slate-500 text-sm">Strategic pattern detection across all stored logs.</p>
                         </div>
                       </div>
                       <button 
                         onClick={handleGenerateInsights} 
                         disabled={isGeneratingInsights || storedReports.length < 2}
                         className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center gap-2 text-sm"
                       >
                         {isGeneratingInsights ? <RefreshCw className="animate-spin" /> : <TrendingUp size={18} />}
                         Generate Insights
                       </button>
                    </div>

                    {operationalInsights ? (
                      <div className="bg-slate-950/40 border border-emerald-500/20 rounded-2xl p-8 animate-in slide-in-from-top-4 duration-500">
                         <MarkdownRenderer content={operationalInsights} />
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-slate-700 rounded-3xl opacity-50">
                        <History size={48} className="mx-auto mb-4 text-slate-500" />
                        <p className="text-slate-400 font-medium">Insufficient data. Analysis requires at least 2 logs.</p>
                      </div>
                    )}
                  </div>

                  {/* Frequency Chart */}
                  {storedReports.length > 0 && <IncidentChart reports={storedReports} />}

                  {/* Audit Stream */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Recent Audit Stream</h4>
                    {storedReports.length > 0 ? (
                      storedReports.slice(0, 5).map(report => (
                        <div key={report.id} className="bg-[#1b2537] p-8 rounded-[2rem] border border-white/5 shadow-xl animate-in fade-in duration-300">
                          <div className="flex justify-between items-center mb-6">
                            <span className="bg-blue-600/10 text-blue-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{report.dateStr}</span>
                            <ShareButton title={`AntiRisk Audit: ${report.dateStr}`} content={report.analysis} />
                          </div>
                          <MarkdownRenderer content={report.analysis} />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
                        <ShieldAlert size={64} className="mx-auto text-slate-700 mb-6" />
                        <h4 className="text-slate-500 font-bold text-xl">Operational Vault Empty</h4>
                        <p className="text-slate-600 max-w-xs mx-auto mt-2">Upload field logs to begin building your operational intelligence database.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === View.WEEKLY_TIPS && (
             <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-800/20 p-10 rounded-[2.5rem] border border-slate-700/50 gap-6 shadow-2xl">
                   <div>
                     <h2 className="text-4xl font-black text-white tracking-tight">Standard of Excellence</h2>
                   </div>
                   <button onClick={() => handleGenerateWeeklyTip(true)} disabled={isTipLoading} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 px-10 py-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 active:scale-95 shadow-xl">
                     {isTipLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />} New Intelligence
                   </button>
                </div>
                <div className="space-y-10">
                  {weeklyTips.map(tip => (
                    <div key={tip.id} className="bg-[#1b2537] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-3 block">{tip.weekDate}</span>
                          <h4 className="text-3xl font-black text-white leading-tight">{tip.topic}</h4>
                        </div>
                        <ShareButton title={`AntiRisk Intelligence: ${tip.topic}`} content={tip.content} />
                      </div>
                      <MarkdownRenderer content={tip.content} />
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </main>

      {/* AUTO-DISPATCH OVERLAY */}
      {showDispatchOverlay && pendingDispatchTip && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6 animate-in zoom-in-95 duration-300">
          <div className="bg-[#111827] border-2 border-blue-500/50 rounded-[3rem] p-10 w-full max-w-lg shadow-[0_0_50px_rgba(37,99,235,0.3)] text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Bell size={48} className="text-white animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Bi-Weekly Alert Ready</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              New Intelligence synthesized: <span className="text-blue-400 font-bold">"{pendingDispatchTip.topic}"</span>.
              Dispatch protocols are active for your registered WhatsApp and Email.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => triggerDispatch('WHATSAPP')}
                className="w-full bg-[#25d366] hover:bg-green-600 py-6 rounded-3xl font-black text-xl text-white flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl"
              >
                <MessageCircle size={28} /> Execute WhatsApp Dispatch
              </button>
              <button 
                onClick={() => triggerDispatch('EMAIL')}
                className="w-full bg-[#2962ff] hover:bg-blue-700 py-6 rounded-3xl font-black text-xl text-white flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl"
              >
                <Mail size={28} /> Execute Email Dispatch
              </button>
              <button 
                onClick={() => setShowDispatchOverlay(false)}
                className="w-full text-slate-500 font-bold uppercase tracking-widest text-sm pt-4"
              >
                Dismiss Protocols
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI KNOWLEDGE BASE MODAL */}
      {showKbModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0a0f1a]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#111827] rounded-[2rem] border border-white/5 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 pb-6 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                  <Database size={32} />
                </div>
                <div>
                  <h2 className="text-[22px] font-bold text-white leading-tight tracking-tight">Knowledge Base Manager</h2>
                  <p className="text-slate-400 text-[13px] mt-1 opacity-80">Upload policies and reports.</p>
                </div>
              </div>
              <button onClick={() => setShowKbModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 pt-2 space-y-10 scrollbar-hide">
              <div className="bg-[#1f2937] rounded-3xl p-6 border border-white/5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-white font-bold text-[13px]">
                  <Upload size={16} className="text-blue-400" />
                  Add New Document
                </div>
                <input value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} placeholder="Title" className="w-full bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-colors text-[14px]" />
                <textarea value={newDocContent} onChange={(e) => setNewDocContent(e.target.value)} placeholder="Content" className="w-full bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors h-36 resize-none text-[14px]" />
                <div className="flex justify-end pt-2">
                  <button onClick={handleAddKbDocument} disabled={!newDocTitle.trim() || !newDocContent.trim()} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 disabled:opacity-30 text-white px-7 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                    <Plus size={18} /> Add to Memory
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest">STORED ({knowledgeBase.length})</h4>
                {knowledgeBase.map(doc => (
                  <div key={doc.id} className="bg-[#1f2937]/50 border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <FileText size={22} />
                      </div>
                      <h5 className="text-[15px] font-bold text-white leading-tight">{doc.title}</h5>
                    </div>
                    <button onClick={() => handleRemoveKbDocument(doc.id)} className="p-3 text-slate-500 hover:text-red-500 active:scale-90 transition-all"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile & Alert Settings */}
      {showSettings && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-in fade-in duration-300">
          <div className="bg-[#0d1421] rounded-[3rem] border border-slate-700/50 p-12 w-full max-w-md shadow-2xl h-[85vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Executive Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-3 bg-slate-800/50 rounded-full active:scale-90"><X size={24} /></button>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Profile Credentials</h4>
                <input value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700 p-6 rounded-2xl outline-none text-white font-bold text-lg" placeholder="CEO Full Name" />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Dispatch Protocols</h4>
                <div className="space-y-3">
                   <div className="relative">
                     <MessageCircle className="absolute left-6 top-6 text-slate-500" size={20} />
                     <input value={userProfile.phoneNumber} onChange={(e) => setUserProfile({...userProfile, phoneNumber: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700 p-6 pl-14 rounded-2xl outline-none text-white font-bold text-lg" placeholder="+234 WhatsApp Number" />
                   </div>
                   <div className="relative">
                     <Mail className="absolute left-6 top-6 text-slate-500" size={20} />
                     <input value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700 p-6 pl-14 rounded-2xl outline-none text-white font-bold text-lg" placeholder="Executive Email" />
                   </div>
                </div>
              </div>

              <div className="bg-slate-800/20 border border-white/5 p-6 rounded-3xl">
                 <div className="flex items-center gap-3 mb-2">
                   <Bell size={18} className="text-blue-400" />
                   <h5 className="text-white font-bold">Bi-Weekly Synthesis</h5>
                 </div>
                 <p className="text-slate-500 text-sm leading-relaxed">The AI will automatically generate and alert you to new tactical standards every 14 days.</p>
              </div>

              <button onClick={() => setShowSettings(false)} className="w-full bg-[#2962ff] hover:bg-blue-700 py-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all">Save Protocols</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
