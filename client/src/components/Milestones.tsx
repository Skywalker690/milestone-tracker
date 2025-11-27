import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Milestone, CreateMilestoneRequest, UpdateMilestoneRequest } from '../types';
import { Plus, Calendar as CalendarIcon, CheckCircle, Trash2, Edit2, Sparkles, Loader2, X, AlertCircle, ArrowRight, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import { geminiService, SuggestedMilestone } from '../services/geminiService';

interface MilestonesProps {
  milestones: Milestone[];
  onCreate: (data: CreateMilestoneRequest) => Promise<void>;
  onUpdate: (id: number, data: UpdateMilestoneRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

// --- Custom Calendar Component ---
const CustomDatePicker = ({ value, onChange, label }: { value: string, onChange: (date: string) => void, label: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); // Controls the month currently being viewed
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial value or default to today for the view
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      // Create date object preventing timezone shifts
      const date = new Date(y, m - 1, d);
      if (!isNaN(date.getTime())) {
        setViewDate(date);
      }
    }
  }, [isOpen]); // Reset view when opening

  // Update position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate position: align bottom of calendar with top of input (drop-up)
      // We use fixed positioning relative to viewport
      setPosition({
        top: rect.top - 8, // 8px gap
        left: rect.left
      });
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleScroll = () => { if (isOpen) setIsOpen(false); };
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const calendarEl = document.getElementById('portal-calendar-root');
      if (
        containerRef.current && 
        !containerRef.current.contains(target) && 
        calendarEl && 
        !calendarEl.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true); 
      window.addEventListener('resize', handleScroll);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    // Format: YYYY-MM-DD
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1; // 1-based
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysArray = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of current month
    const today = new Date();
    const [selY, selM, selD] = value ? value.split('-').map(Number) : [0,0,0];

    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = selY === year && (selM - 1) === month && selD === d;
      const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

      daysArray.push(
        <button
          key={d}
          onClick={(e) => { e.preventDefault(); handleDateSelect(d); }}
          className={`h-9 w-9 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center
            ${isSelected 
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30 transform scale-105' 
              : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'}
            ${!isSelected && isToday ? 'border border-primary-600 text-primary-700 font-bold' : ''}
          `}
        >
          {d}
        </button>
      );
    }
    return daysArray;
  };

  const calendarContent = (
    <div 
      id="portal-calendar-root"
      className="fixed z-[9999] p-4 bg-white rounded-2xl shadow-xl border border-slate-100 w-[320px] animate-fade-in ring-1 ring-slate-900/5"
      style={{ 
        top: position.top, 
        left: position.left,
        transform: 'translateY(-100%)' // Shift up to sit above the top coordinate
      }}
    >
       <div className="flex items-center justify-between mb-4">
            <button onClick={(e) => { e.preventDefault(); handlePrevMonth(); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-slate-900">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={(e) => { e.preventDefault(); handleNextMonth(); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-400 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 gap-x-1 place-items-center">
            {renderCalendarDays()}
          </div>
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl flex items-center cursor-pointer hover:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all bg-white group"
      >
        <CalendarIcon className="w-5 h-5 text-slate-400 group-hover:text-primary-500 mr-3 transition-colors" />
        <span className={`flex-1 font-medium ${value ? 'text-slate-900' : 'text-slate-400'}`}>
          {value || 'Select a date'}
        </span>
      </div>

      {isOpen && createPortal(calendarContent, document.body)}
    </div>
  );
};

const Milestones: React.FC<MilestonesProps> = ({ milestones, onCreate, onUpdate, onDelete, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  
  // AI Generator State
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedMilestone[]>([]);

  const filteredMilestones = milestones.filter(m => {
    if (filter === 'COMPLETED') return m.completed;
    if (filter === 'PENDING') return !m.completed;
    return true;
  });

  const handleEdit = (m: Milestone, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMilestone(m);
    setIsModalOpen(true);
    setIsAiMode(false);
  };

  const handleCreate = () => {
    setEditingMilestone(null);
    setIsModalOpen(true);
    setIsAiMode(false);
    setSuggestions([]);
    setAiPrompt('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMilestone(null);
    setSuggestions([]);
  };

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmationId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmationId !== null) {
      await onDelete(deleteConfirmationId);
      setDeleteConfirmationId(null);
    }
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const results = await geminiService.suggestBreakdown(aiPrompt);
      setSuggestions(results);
    } catch (e) {
      alert("Failed to generate suggestions. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptSuggestion = async (s: SuggestedMilestone) => {
    const achieveDate = new Date();
    achieveDate.setDate(achieveDate.getDate() + s.daysFromNow);
    
    await onCreate({
      title: s.title,
      description: s.description,
      achieveDate: achieveDate.toISOString().split('T')[0]
    });
  };

  const toggleMilestone = async (m: Milestone) => {
    const isCompleted = !m.completed;
    await onUpdate(m.id, {
      title: m.title || "Untitled Milestone",
      description: m.description,
      achieveDate: m.achieveDate,
      completed: isCompleted,
      completedDate: isCompleted ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Milestones</h1>
          <p className="text-slate-500 mt-1 font-medium">Track and manage your strategic goals</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Milestone
        </button>
      </div>

      {!isLoading && milestones.length > 0 && (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
             onClick={() => setFilter('ALL')}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All
          </button>
          <button 
             onClick={() => setFilter('PENDING')}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'PENDING' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pending
          </button>
          <button 
             onClick={() => setFilter('COMPLETED')}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'COMPLETED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Completed
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-5">
          {milestones.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flag className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No milestones yet</h3>
              <p className="text-slate-500 mb-6 mt-2 max-w-sm mx-auto">Create your first milestone manually or use our AI assistant to break down your big goals.</p>
              <button onClick={handleCreate} className="text-primary-600 font-bold hover:text-primary-700 hover:underline">Create Now</button>
            </div>
          ) : filteredMilestones.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No {filter.toLowerCase()} milestones found.</p>
              {filter !== 'ALL' && (
                <button onClick={() => setFilter('ALL')} className="text-primary-600 text-sm font-bold hover:underline mt-2">View all milestones</button>
              )}
            </div>
          ) : (
            filteredMilestones.map((m) => (
              <div 
                key={m.id} 
                className={`group relative bg-white p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  m.completed 
                    ? 'border-slate-100 bg-slate-50/50' 
                    : 'border-slate-100 hover:border-primary-200'
                }`}
              >
                <div className="flex items-start gap-5">
                  <button
                    onClick={() => toggleMilestone(m)}
                    className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      m.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200' 
                        : 'border-slate-300 text-transparent hover:border-primary-500 bg-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" strokeWidth={3} />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-lg font-bold truncate pr-2 ${m.completed ? 'text-slate-600' : 'text-slate-900'}`}>
                          {m.title || <span className="text-red-400 italic text-base flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Untitled</span>}
                        </h3>
                        {m.description && (
                          <p className={`mt-1.5 text-sm leading-relaxed ${m.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                            {m.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-slate-100 sm:static sm:bg-transparent sm:shadow-none sm:border-none sm:p-0">
                        <button 
                          onClick={(e) => handleEdit(m, e)} 
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(m.id, e)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-4 mt-4">
                       {m.achieveDate && (
                        <div className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md ${
                          !m.completed && new Date(m.achieveDate) < new Date() 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                          {m.achieveDate}
                        </div>
                       )}
                       {m.completed && m.completedDate && (
                         <div className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600">
                           <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                           Done on {m.completedDate}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId !== null && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 animate-slide-up ring-1 ring-slate-900/5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Milestone?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                This action is permanent and cannot be undone. Are you sure?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 rounded-xl text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-slide-up ring-1 ring-slate-900/5">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
              <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl">
                <button 
                  onClick={() => setIsAiMode(false)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${!isAiMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Manual
                </button>
                {!editingMilestone && (
                  <button 
                    onClick={() => setIsAiMode(true)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${isAiMode ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Assist
                  </button>
                )}
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              {isAiMode ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 block">What is your main goal?</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., Run a marathon in 6 months"
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                        autoFocus
                      />
                      <button 
                        onClick={handleGenerate} 
                        disabled={isGenerating || !aiPrompt}
                        className="bg-violet-600 text-white px-5 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-violet-500/20 transition-all"
                      >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Powered by Gemini AI • Generates 3-5 actionable steps</p>
                  </div>

                  {suggestions.length > 0 && (
                    <div className="space-y-3 mt-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Breakdown</p>
                         <button onClick={() => setSuggestions([])} className="text-xs text-red-500 hover:underline">Clear</button>
                      </div>
                      
                      {suggestions.map((s, idx) => (
                        <div key={idx} className="group border border-slate-100 rounded-2xl p-4 hover:border-violet-200 hover:bg-violet-50/30 transition-all flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-slate-900">{s.title}</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{s.description}</p>
                            <p className="text-xs text-violet-600 mt-2 font-medium flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              +{s.daysFromNow} days
                            </p>
                          </div>
                          <button 
                            onClick={() => acceptSuggestion(s)}
                            className="flex-shrink-0 p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-violet-600 hover:border-violet-200 hover:shadow-md transition-all"
                            title="Add this milestone"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <MilestoneForm 
                  initialData={editingMilestone} 
                  onSubmit={async (data) => {
                    if (editingMilestone) {
                      await onUpdate(editingMilestone.id, data);
                    } else {
                      await onCreate(data as CreateMilestoneRequest);
                    }
                    closeModal();
                  }} 
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const MilestoneForm = ({ initialData, onSubmit }: { initialData: Milestone | null, onSubmit: (data: any) => Promise<void> }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [achieveDate, setAchieveDate] = useState(initialData?.achieveDate || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ title, description, achieveDate });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Milestone Title</label>
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          placeholder="e.g., Complete Project Alpha"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 resize-none"
          placeholder="Add details about your goal..."
        />
      </div>
      
      {/* Custom Date Picker Replacement */}
      <CustomDatePicker 
        label="Target Completion Date"
        value={achieveDate}
        onChange={setAchieveDate}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-3.5 rounded-xl hover:bg-primary-700 font-bold text-sm tracking-wide transition-all shadow-lg shadow-primary-500/25 disabled:opacity-70 flex justify-center items-center hover:-translate-y-0.5"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'Save Changes' : 'Create Milestone')}
      </button>
    </form>
  );
};

export default Milestones;