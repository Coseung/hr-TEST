
import React, { useState, useEffect } from 'react';
import { 
  User, CalendarIcon, Users, Plus, User as UserIcon, X, Search, CheckCircle2, ChevronDown, Hash, FileText, ImageIcon, Monitor, Smartphone, ChevronLeft, CheckSquare, Megaphone, DollarSign, Ban, AlertCircle, Link as LinkIcon, Trash2, Activity, Scale, FileSpreadsheet, ShieldCheck, Send, Check
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { 
    Creator, Task, CreatorEvent, AdProposal, INITIAL_TASKS, INITIAL_EVENTS, INITIAL_AD_PROPOSALS,
    renderPlatformIcon, CreatorCalendar, CreatorHealthView, HealthRecord, IssueLog
} from './CreatorShared';

// --- Sub-component: Creator Detail View ---
const CreatorDetailView = ({ 
    creator, 
    tasks, 
    events, 
    onBack, 
    onAddEvent,
    onEventClick,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    onDisconnect
}: { 
    creator: Creator, 
    tasks: Task[], 
    events: CreatorEvent[], 
    onBack: () => void,
    onAddEvent: (date: string) => void,
    onEventClick: (event: CreatorEvent) => void,
    onAddTask: (title: string) => void,
    onToggleTask: (taskId: string) => void,
    onDeleteTask: (taskId: string) => void,
    onDisconnect: () => void
}) => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    
    const handleTaskSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            onAddTask(newTaskTitle.trim());
            setNewTaskTitle('');
        }
    };

    return (
        <div className="bg-white relative animate-[fadeIn_0.2s_ease-out]">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-gray-600">목록으로 돌아가기</span>
                </div>
                
                <button 
                    onClick={() => {
                        if(window.confirm(`${creator.name} 크리에이터와의 담당 연결을 취소하시겠습니까?`)) {
                            onDisconnect();
                        }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                >
                    <Trash2 size={14} /> 담당 연결 취소
                </button>
            </div>

            {/* Cover Image */}
            <div className="h-48 w-full bg-gray-100 relative group flex items-center justify-center rounded-xl overflow-hidden mb-12">
                {creator.coverUrl ? (
                    <img src={creator.coverUrl} alt="cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                        <ImageIcon size={32} />
                        <span className="text-xs mt-2">커버 이미지 없음</span>
                    </div>
                )}
                <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-xs px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">커버 변경</button>
                
                 {/* Avatar */}
                <div className="absolute -bottom-10 left-8">
                     <div className="w-24 h-24 rounded-lg border-4 border-white shadow-sm overflow-hidden bg-white">
                        {creator.avatarUrl ? (
                            <img src={creator.avatarUrl} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <UserIcon size={40} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

             {/* Header Info (Removed Management Period & Team Permissions) */}
             <div className="pl-36 mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{creator.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><Monitor size={14}/> {creator.platform}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><Users size={14}/> {creator.subscribers}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className={`text-xs font-bold ${creator.status === '활동중' ? 'text-[#00C471]' : 'text-gray-500'}`}>
                            {creator.status}
                        </span>
                        {creator.contactInfo && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-500 flex items-center gap-1"><Smartphone size={12}/> {creator.contactInfo}</span>
                            </>
                        )}
                    </div>
                </div>
             </div>

             <div className="h-px bg-gray-200 w-full mb-8"></div>

             {/* Tasks Section */}
             <div className="animate-[fadeIn_0.2s_ease-out]">
                {/* ... Task rendering code ... */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <CheckSquare size={20} className="text-gray-700"/>
                        업무 현황
                        <span className="text-sm font-normal text-gray-500 ml-1">({tasks.length})</span>
                    </h3>
                    <div className="flex gap-4 text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#00C471]"></div>
                            진행중 <span className="font-bold text-gray-900 ml-1">{tasks.filter(t => t.status === '진행중').length}</span>
                        </span>
                        <span className="text-gray-600 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            완료됨 <span className="font-bold text-gray-900 ml-1">{tasks.filter(t => t.status === '완료됨').length}</span>
                        </span>
                    </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                   <div className="flex items-center bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-500">
                      <div className="flex-1">이름</div>
                      <div className="w-24">상태</div>
                      <div className="w-24">담당자</div>
                   </div>
                   <div className="divide-y divide-gray-100">
                      {tasks.map(task => (
                         <div key={task.id} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer text-sm">
                            <div className="flex-1 text-gray-800 flex items-center gap-2">
                               <button 
                                    onClick={() => onToggleTask(task.id)}
                                    className={`${task.status === '완료됨' ? 'text-[#00C471]' : 'text-gray-300 hover:text-gray-500'}`}
                               >
                                   <CheckSquare size={16} />
                               </button>
                               <span className={task.status === '완료됨' ? 'text-gray-400 line-through' : ''}>
                                   {task.title}
                               </span>
                            </div>
                            <div className="w-24">
                               <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                                   task.status === '진행중' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                   task.status === '완료됨' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                   'bg-blue-50 text-blue-700 border-blue-200'
                               }`}>
                                  {task.status}
                               </span>
                            </div>
                            <div className="w-24 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-[9px] font-bold">
                                    {task.assignee.charAt(0)}
                                    </div>
                                    <span className="text-gray-600 text-xs">{task.assignee}</span>
                                </div>
                                {task.status === '완료됨' && (
                                    <button 
                                        onClick={() => onDeleteTask(task.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="삭제"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                         </div>
                      ))}
                      
                      {!isAddingTask ? (
                           <div 
                                onClick={() => setIsAddingTask(true)}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-gray-400 text-sm group"
                           >
                              <Plus size={14} className="mr-2 group-hover:text-gray-600" /> 
                              <span className="group-hover:text-gray-600">새로 만들기...</span>
                           </div>
                      ) : (
                           <div className="flex items-center px-4 py-3 bg-gray-50/50">
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="text-gray-400"><CheckSquare size={16} /></div>
                                    <input 
                                        autoFocus
                                        className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="업무 내용을 입력하고 Enter를 누르세요"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={handleTaskSubmit}
                                        onBlur={() => {
                                            if (!newTaskTitle.trim()) setIsAddingTask(false);
                                        }}
                                    />
                                </div>
                           </div>
                      )}
                   </div>
                </div>
             </div>
        </div>
    );
}

// --- Main Employee Component ---
interface EmployeeCreatorViewProps {
    user: UserType;
    creators: Creator[];
    onUpdateCreators: (creators: Creator[]) => void;
    // Health Props
    healthRecords: HealthRecord[];
    onUpdateHealthRecords: (records: HealthRecord[]) => void;
    issueLogs: IssueLog[];
    onUpdateIssueLogs: (logs: IssueLog[]) => void;
    // Event Props
    events: CreatorEvent[];
    onUpdateEvents: (events: CreatorEvent[]) => void;
}

export const EmployeeCreatorView = ({ 
    user, 
    creators, 
    onUpdateCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
    events,
    onUpdateEvents
}: EmployeeCreatorViewProps) => {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'calendar' | 'list' | 'ads' | 'health' | 'support'>('calendar'); 
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [adProposals, setAdProposals] = useState<AdProposal[]>(INITIAL_AD_PROPOSALS);
  const [adFilter, setAdFilter] = useState<'all' | 'pending' | 'history'>('pending');

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
      const flatList: Task[] = [];
      Object.entries(INITIAL_TASKS).forEach(([cId, tasks]) => {
          tasks.forEach(t => flatList.push({ ...t, creatorId: cId }));
      });
      return flatList;
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false); 
  const [supportModal, setSupportModal] = useState<{ open: boolean, type: 'legal' | 'tax' }>({ open: false, type: 'legal' });
  
  const [selectedEvent, setSelectedEvent] = useState<CreatorEvent | null>(null);
  const [selectedCreatorToAssign, setSelectedCreatorToAssign] = useState<string>('');
  const [managementPeriod, setManagementPeriod] = useState<{start: string, end: string}>({
      start: new Date().toISOString().split('T')[0],
      end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  // Support Modal Form
  const [supportForm, setSupportForm] = useState({ title: '', content: '' });

  const [newEventData, setNewEventData] = useState<{
      creatorId: string;
      title: string;
      date: string;
      type: 'live' | 'content' | 'meeting' | 'other' | 'joint';
      content: string;
      partnerCreators: string[];
  }>({
      creatorId: '',
      title: '',
      date: '',
      type: 'content',
      content: '',
      partnerCreators: []
  });

  const [newAdData, setNewAdData] = useState<{
      brandName: string;
      campaignTitle: string;
      budget: string;
      creatorId: string;
      description: string;
  }>({
      brandName: '',
      campaignTitle: '',
      budget: '',
      creatorId: '',
      description: ''
  });

  const selectedCreator = creators.find(c => c.id === selectedCreatorId);
  const creatorEvents = selectedCreatorId ? events.filter(e => e.creatorId === selectedCreatorId) : [];

  const myCreators = creators.filter(c => c.manager === user.name || user.role === UserRole.ADMIN);
  const myCreatorsMap = myCreators.reduce((acc, c) => ({...acc, [c.id]: c}), {} as Record<string, Creator>);
  const allMyEvents = events.filter(e => myCreatorsMap[e.creatorId]);
  const hasCreators = myCreators.length > 0;

  // Filter for Assign Creator Modal: Only show creators who have NO manager or are '담당자 없음'
  // This prevents picking creators already assigned to someone else.
  const availableCreators = creators.filter(c => !c.manager || c.manager === '담당자 없음' || c.manager === '미배정');
  const filteredAvailableCreators = availableCreators.filter(c => c.name.includes(searchQuery));

  // Partner selection list (All creators except the currently selected one)
  const potentialPartners = creators.filter(c => c.id !== newEventData.creatorId && c.name.includes(partnerSearchQuery));

  // Auto redirect to calendar if no creators assigned
  useEffect(() => {
      if (!hasCreators && activeMainTab !== 'calendar') {
          setActiveMainTab('calendar');
      }
  }, [hasCreators, activeMainTab]);

  const handleBack = () => setSelectedCreatorId(null);
  const handleEventClick = (event: CreatorEvent) => setSelectedEvent(event);

  const handleDeleteEvent = (eventId: string) => {
      if (window.confirm('이 일정을 삭제하시겠습니까?')) {
          onUpdateEvents(events.filter(e => e.id !== eventId));
          setSelectedEvent(null);
          showToastMessage('일정이 삭제되었습니다.');
      }
  };

  const handleAddTask = (title: string) => {
      if (!selectedCreatorId) return;
      const newTask: Task = {
          id: Date.now().toString(),
          title,
          status: '진행중',
          assignee: user.name,
          creatorId: selectedCreatorId
      };
      setAllTasks([...allTasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
      setAllTasks(prev => prev.map(t => 
          t.id === taskId 
          ? { ...t, status: t.status === '진행중' ? '완료됨' : '진행중' } 
          : t
      ));
  };

  const handleDeleteTask = (taskId: string) => {
      if(window.confirm('업무를 삭제하시겠습니까?')) {
          setAllTasks(prev => prev.filter(t => t.id !== taskId));
      }
  };

  const handleAddCreator = () => {
    if (!selectedCreatorToAssign) {
        alert('등록할 크리에이터를 선택해주세요.');
        return;
    }
    if (!managementPeriod.start || !managementPeriod.end) {
        alert('담당 기간을 모두 입력해주세요.');
        return;
    }

    const updatedCreators = creators.map(c => 
        c.id === selectedCreatorToAssign 
        ? { 
            ...c, 
            manager: user.name,
            managementStartDate: managementPeriod.start,
            managementEndDate: managementPeriod.end
          } 
        : c
    );
    onUpdateCreators(updatedCreators);
    
    setIsAddModalOpen(false);
    setSelectedCreatorToAssign('');
    setSearchQuery('');
    showToastMessage('담당 크리에이터가 등록되었습니다.');
  };

  const handleDisconnectCreator = (targetCreatorId: string) => {
      const updatedCreators = creators.map(c => 
          c.id === targetCreatorId 
          ? { 
              ...c, 
              manager: '담당자 없음',
              managementStartDate: undefined,
              managementEndDate: undefined
            } 
          : c
      );
      onUpdateCreators(updatedCreators);
      setSelectedCreatorId(null);
      showToastMessage('담당 연결이 취소되었습니다.', 'error');
  };

  const handleOpenEventModal = (date?: string) => {
      if (myCreators.length === 0) return;
      setNewEventData({
          creatorId: selectedCreatorId || (myCreators[0] ? myCreators[0].id : ''),
          title: '',
          date: date || new Date().toISOString().split('T')[0],
          type: 'content',
          content: '',
          partnerCreators: []
      });
      setPartnerSearchQuery('');
      setIsEventModalOpen(true);
  };

  const togglePartnerCreator = (creatorId: string) => {
      setNewEventData(prev => {
          const exists = prev.partnerCreators.includes(creatorId);
          return {
              ...prev,
              partnerCreators: exists 
                  ? prev.partnerCreators.filter(id => id !== creatorId)
                  : [...prev.partnerCreators, creatorId]
          };
      });
  };

  const handleSaveEvent = () => {
      if (!newEventData.title || !newEventData.creatorId) {
          alert('제목과 크리에이터를 모두 입력해주세요.');
          return;
      }
      
      if (newEventData.type === 'joint' && newEventData.partnerCreators.length === 0) {
          alert('합방할 크리에이터를 최소 1명 이상 선택해주세요.');
          return;
      }

      const newEvent: CreatorEvent = {
          id: Date.now().toString(),
          creatorId: newEventData.creatorId,
          title: newEventData.title,
          date: newEventData.date,
          type: newEventData.type,
          content: newEventData.content,
          partnerCreators: newEventData.type === 'joint' ? newEventData.partnerCreators : []
      };
      onUpdateEvents([...events, newEvent]);
      setIsEventModalOpen(false);
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ show: true, message, type });
      setTimeout(() => {
          setToast(prev => ({ ...prev, show: false }));
      }, 3000);
  };

  const handleAdDecision = (id: string, decision: 'accepted' | 'rejected') => {
      setAdProposals(prev => prev.map(p => p.id === id ? { ...p, status: decision } : p));
      
      if (decision === 'accepted') {
          showToastMessage('제안이 수락되었습니다. 처리 내역 탭으로 이동되었습니다.');
      } else {
          showToastMessage('제안이 거절되었습니다. 처리 내역 탭으로 이동되었습니다.', 'error');
      }
  };

  const handleAddAd = () => {
      if (!newAdData.brandName || !newAdData.campaignTitle || !newAdData.budget || !newAdData.creatorId) {
          alert('필수 정보를 모두 입력해주세요.');
          return;
      }

      const newAd: AdProposal = {
          id: Date.now().toString(),
          creatorId: newAdData.creatorId,
          brandName: newAdData.brandName,
          campaignTitle: newAdData.campaignTitle,
          budget: newAdData.budget,
          status: 'pending',
          requestDate: new Date().toISOString().split('T')[0],
          description: newAdData.description || '내용 없음'
      };

      setAdProposals([newAd, ...adProposals]);
      setIsAdModalOpen(false);
      setNewAdData({ brandName: '', campaignTitle: '', budget: '', creatorId: '', description: '' });
      showToastMessage('새로운 캠페인이 등록되었습니다.');
  };

  const handleSupportRequest = () => {
      if (!supportForm.title || !supportForm.content) {
          alert('제목과 내용을 모두 입력해주세요.');
          return;
      }
      showToastMessage(`${supportModal.type === 'legal' ? '법률' : '세무'} 상담 신청이 완료되었습니다.`);
      setSupportModal({ ...supportModal, open: false });
      setSupportForm({ title: '', content: '' });
  };

  const myCreatorIds = myCreators.map(c => c.id);
  const myAdProposals = adProposals.filter(ad => myCreatorIds.includes(ad.creatorId));
  const filteredAds = myAdProposals.filter(ad => {
      if (adFilter === 'all') return true;
      if (adFilter === 'pending') return ad.status === 'pending';
      if (adFilter === 'history') return ad.status !== 'pending';
      return true;
  });

  const EVENT_TYPES = [
      { id: 'content', label: '콘텐츠' },
      { id: 'live', label: '라이브' },
      { id: 'meeting', label: '미팅' },
      { id: 'joint', label: '합방' },
      { id: 'other', label: '기타' },
  ];

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col bg-white relative">
        {/* Header & Main Tabs */}
        <div className="px-8 pt-8 pb-0 shrink-0 border-b border-gray-100">
             <div className="max-w-[1600px] mx-auto">
                 <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <User className="text-gray-800" size={32} /> 나의 크리에이터
                 </h1>
                 <div className="flex items-center gap-6 overflow-x-auto">
                    <button 
                        onClick={() => { setActiveMainTab('calendar'); setSelectedCreatorId(null); }}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeMainTab === 'calendar' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <CalendarIcon size={16} /> 일정 캘린더
                        {activeMainTab === 'calendar' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                    <button 
                        onClick={() => hasCreators && setActiveMainTab('list')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeMainTab === 'list' ? 'text-black' : 'text-gray-400 hover:text-gray-600'} ${!hasCreators ? 'opacity-40 cursor-not-allowed' : ''}`}
                        disabled={!hasCreators}
                    >
                        <Users size={16} /> 내 담당 크리에이터
                        {activeMainTab === 'list' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                    <button 
                        onClick={() => hasCreators && setActiveMainTab('ads')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeMainTab === 'ads' ? 'text-black' : 'text-gray-400 hover:text-gray-600'} ${!hasCreators ? 'opacity-40 cursor-not-allowed' : ''}`}
                        disabled={!hasCreators}
                    >
                        <Megaphone size={16} /> 광고 캠페인 관리
                        {activeMainTab === 'ads' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                    <button 
                        onClick={() => hasCreators && setActiveMainTab('health')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeMainTab === 'health' ? 'text-black' : 'text-gray-400 hover:text-gray-600'} ${!hasCreators ? 'opacity-40 cursor-not-allowed' : ''}`}
                        disabled={!hasCreators}
                    >
                        <Activity size={16} /> 크리에이터 건강관리
                        {activeMainTab === 'health' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                    <button 
                        onClick={() => hasCreators && setActiveMainTab('support')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeMainTab === 'support' ? 'text-black' : 'text-gray-400 hover:text-gray-600'} ${!hasCreators ? 'opacity-40 cursor-not-allowed' : ''}`}
                        disabled={!hasCreators}
                    >
                        <LinkIcon size={16} /> 법률/세무 연결
                        {activeMainTab === 'support' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                 </div>
             </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
            <div className="max-w-[1600px] mx-auto min-h-full">
                {activeMainTab === 'calendar' && (
                    <div className="animate-[fadeIn_0.2s_ease-out] relative">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">전체 일정</h2>
                                <p className="text-sm text-gray-500">담당하는 모든 크리에이터의 일정을 한눈에 확인하세요.</p>
                            </div>
                            <button 
                                onClick={() => handleOpenEventModal()} 
                                className={`flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors ${myCreators.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={myCreators.length === 0}
                            >
                                <Plus size={16} /> 일정 추가
                            </button>
                        </div>
                        
                        <div className="relative">
                            <div className={myCreators.length === 0 ? "blur-sm pointer-events-none select-none opacity-50 transition-all duration-500" : ""}>
                                <CreatorCalendar 
                                    events={allMyEvents} 
                                    creatorsMap={myCreatorsMap}
                                    currentDate={currentDate}
                                    onDateChange={setCurrentDate}
                                    onAddEvent={handleOpenEventModal}
                                    onEventClick={handleEventClick}
                                />
                            </div>
                            
                            {myCreators.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <div className="bg-white/90 backdrop-blur p-8 rounded-2xl border border-gray-200 shadow-xl text-center max-w-sm">
                                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <User size={28} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">담당 중인 크리에이터가 없습니다</h3>
                                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                            아직 담당 크리에이터가 배정되지 않았거나<br/>
                                            등록된 크리에이터가 없습니다.<br/>
                                            인사 운영자 또는 관리자에게 배정을 요청하세요.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* List Tab, Ads Tab, Health Tab content remain same, skipping specific render logic for brevity, keeping surrounding structure... */}
                {activeMainTab === 'list' && (
                     <>
                        {selectedCreator ? (
                            <CreatorDetailView 
                                creator={selectedCreator}
                                tasks={allTasks.filter(t => t.creatorId === selectedCreator.id)}
                                events={creatorEvents}
                                onBack={handleBack}
                                onAddEvent={handleOpenEventModal}
                                onEventClick={handleEventClick}
                                onAddTask={handleAddTask}
                                onToggleTask={handleToggleTask}
                                onDeleteTask={handleDeleteTask}
                                onDisconnect={() => handleDisconnectCreator(selectedCreator.id)}
                            />
                        ) : (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                     {myCreators.map(creator => (
                                       <div 
                                         key={creator.id}
                                         onClick={() => setSelectedCreatorId(creator.id)}
                                         className="group border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white relative"
                                       >
                                         <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                                            {creator.coverUrl ? (
                                                <img src={creator.coverUrl} alt="cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-300">
                                                   <ImageIcon size={32} />
                                                </div>
                                            )}
                                            <div className="absolute top-0 left-0 w-full h-full bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                         </div>
                                         <div className="p-5 relative">
                                            <div className="w-16 h-16 rounded-lg border-4 border-white shadow-sm overflow-hidden absolute -top-10 left-5 bg-white">
                                               {creator.avatarUrl ? (
                                                   <img src={creator.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                               ) : (
                                                   <div className="w-full h-full bg-gray-5 flex items-center justify-center text-gray-400">
                                                       <User size={32} />
                                                   </div>
                                               )}
                                            </div>
                                            <div className="mt-6">
                                               <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                                  {creator.name}
                                                  {renderPlatformIcon(creator.platform, 16)}
                                               </h3>
                                               <p className="text-sm text-gray-500 mb-3">{creator.subscribers}</p>
                                               <div className="flex gap-2">
                                                  <span className={`text-[10px] font-bold ${creator.status === '활동중' ? 'text-[#00C471]' : 'text-gray-500'}`}>
                                                     {creator.status}
                                                  </span>
                                               </div>
                                            </div>
                                         </div>
                                       </div>
                                     ))}
                                </div>
                            </div>
                        )}
                     </>
                )}

                {/* Ads Tab Content */}
                {activeMainTab === 'ads' && (
                    <div className="animate-[fadeIn_0.2s_ease-out]">
                        {/* ... Existing Ads Content ... */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">광고 캠페인 제안</h2>
                                <p className="text-sm text-gray-500">담당 크리에이터에게 들어온 광고 제안을 검토하고 연결해주세요.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <button onClick={() => setAdFilter('pending')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'pending' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>대기중인 제안 ({myAdProposals.filter(a => a.status === 'pending').length})</button>
                                    <button onClick={() => setAdFilter('history')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'history' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>처리 내역</button>
                                    <button onClick={() => setAdFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>전체 보기</button>
                                </div>
                                <button onClick={() => setIsAdModalOpen(true)} className="ml-2 flex items-center gap-1 bg-[#00C471] hover:bg-[#00b065] text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors"><Plus size={14} /> 캠페인 등록</button>
                            </div>
                        </div>
                        {filteredAds.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAds.map(ad => {
                                    const creator = creators.find(c => c.id === ad.creatorId);
                                    return (
                                        <div key={ad.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="text-xs font-bold text-gray-500">{ad.brandName}</div>
                                                <div className="text-[10px] text-gray-400">{ad.requestDate}</div>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">{ad.campaignTitle}</h3>
                                            <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {creator?.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-full h-full object-cover"/> : <UserIcon className="p-1 text-gray-400"/>}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-xs font-bold text-gray-800 truncate">{creator?.name || '알 수 없음'}</div>
                                                    <div className="text-[10px] text-gray-500 truncate">구독자 {creator?.subscribers}</div>
                                                </div>
                                            </div>
                                            <div className="mb-4 flex-1">
                                                <div className="text-xs text-gray-500 mb-1">제안 금액</div>
                                                <div className="text-xl font-bold text-[#00C471] flex items-center gap-1"><DollarSign size={18} /> {ad.budget}</div>
                                                <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3">{ad.description}</div>
                                            </div>
                                            <div className="pt-4 border-t border-gray-100 mt-auto">
                                                {ad.status === 'pending' ? (
                                                    <div className="space-y-3">
                                                        <div className="text-center"><span className="text-sm font-bold text-orange-600">제안 검토중</span></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleAdDecision(ad.id, 'rejected')} className="flex-1 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"><Ban size={14} /> 거절</button>
                                                            <button onClick={() => handleAdDecision(ad.id, 'accepted')} className="flex-1 py-2 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"><CheckCircle2 size={14} /> 수락</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`text-center py-2 text-xs font-bold rounded-lg ${ad.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{ad.status === 'accepted' ? '수락됨' : '거절됨'}</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                                <Megaphone size={48} className="mb-4 opacity-50" />
                                <div className="text-lg font-medium text-gray-500">해당하는 광고 제안이 없습니다.</div>
                                <p className="text-sm mt-1">새로운 제안이 들어오면 이곳에 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Health Management Tab */}
                {activeMainTab === 'health' && (
                    <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900">크리에이터 건강 관리</h2>
                            <p className="text-sm text-gray-500">담당 크리에이터의 건강 상태 및 이슈를 기록하고 관리합니다.</p>
                        </div>
                        <CreatorHealthView 
                            creators={myCreators}
                            records={healthRecords}
                            onUpdateRecords={onUpdateHealthRecords}
                            logs={issueLogs}
                            onUpdateLogs={onUpdateIssueLogs}
                        />
                    </div>
                )}

                {/* Support (Legal/Tax) Tab */}
                {activeMainTab === 'support' && (
                    <div className="animate-[fadeIn_0.2s_ease-out] grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Legal */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Scale size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">법률 자문 연결</h3>
                                    <p className="text-sm text-gray-500">전속 계약서 검토 및 저작권 분쟁 상담</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                                    <p className="mb-2 font-bold">주요 지원 항목:</p>
                                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                        <li>신규/갱신 계약서 법률 검토</li>
                                        <li>악성 댓글 및 명예훼손 고소 대행</li>
                                        <li>저작권 및 초상권 침해 대응</li>
                                    </ul>
                                </div>
                                <button 
                                    onClick={() => setSupportModal({ open: true, type: 'legal' })}
                                    className="w-full py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    법률 상담 신청하기
                                </button>
                            </div>
                        </div>

                        {/* Tax */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">세무/회계 지원</h3>
                                    <p className="text-sm text-gray-500">종합소득세 신고 및 정산 내역 관리</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                                    <p className="mb-2 font-bold">주요 지원 항목:</p>
                                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                        <li>월별 수익 정산서 검토 및 발행</li>
                                        <li>종합소득세/부가가치세 신고 대행 연결</li>
                                        <li>비용 처리 및 절세 가이드 제공</li>
                                    </ul>
                                </div>
                                <button 
                                    onClick={() => setSupportModal({ open: true, type: 'tax' })}
                                    className="w-full py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    세무 상담 신청하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* ... (Other Modals: Add, Ad, Support, Toast) ... */}
        {/* Simplified for brevity, assume existing modals are here, adding delete logic to Event Detail Modal */}
        
        {selectedEvent && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900">일정 상세 정보</h3>
                        <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                    </div>
                    {/* ... Existing Event Details ... */}
                    <div className="p-6 space-y-4">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">제목</div>
                            <div className="text-lg font-bold text-gray-900">{selectedEvent.title}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1">날짜</div>
                                <div className="text-sm text-gray-800">{selectedEvent.date}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1">유형</div>
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200">
                                    {EVENT_TYPES.find(t => t.id === selectedEvent.type)?.label || selectedEvent.type}
                                </span>
                            </div>
                        </div>
                        {selectedEvent.type === 'joint' && selectedEvent.partnerCreators && selectedEvent.partnerCreators.length > 0 && (
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1">합방 파트너</div>
                                <div className="flex flex-wrap gap-1">
                                    {selectedEvent.partnerCreators.map(pid => {
                                        const partner = creators.find(c => c.id === pid);
                                        return partner ? (
                                            <span key={pid} className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-xs">
                                                <UserIcon size={10} /> {partner.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">크리에이터</div>
                            <div className="text-sm text-gray-800 font-medium">
                                {creators.find(c => c.id === selectedEvent.creatorId)?.name || '알 수 없음'}
                            </div>
                        </div>
                        {selectedEvent.content && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 font-bold mb-1">상세 내용</div>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEvent.content}</div>
                            </div>
                        )}
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between">
                        <button 
                            onClick={() => handleDeleteEvent(selectedEvent.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded text-sm hover:bg-red-100 flex items-center gap-1"
                        >
                            <Trash2 size={14} /> 삭제
                        </button>
                        <button onClick={() => setSelectedEvent(null)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 shadow-sm">닫기</button>
                    </div>
                </div>
            </div>
        )}

        {isEventModalOpen && (
            <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]" onClick={() => setIsEventModalOpen(false)}>
                {/* ... Event Add Modal ... */}
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-900">일정 추가</span>
                        <button onClick={() => setIsEventModalOpen(false)}><X size={18} className="text-gray-400"/></button>
                    </div>
                    <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                        <input type="text" placeholder="일정 제목" value={newEventData.title} onChange={(e) => setNewEventData({...newEventData, title: e.target.value})} className="w-full text-3xl font-bold text-gray-900 focus:outline-none placeholder-gray-300" autoFocus />
                        <div className="space-y-4">
                            <select value={newEventData.creatorId} onChange={(e) => setNewEventData({...newEventData, creatorId: e.target.value})} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5">
                                {myCreators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <input type="date" value={newEventData.date} onChange={(e) => setNewEventData({...newEventData, date: e.target.value})} className="text-sm border border-gray-200 rounded px-2 py-1.5" />
                            
                            {/* Type Selection */}
                            <div className="flex gap-2 flex-wrap">
                                {EVENT_TYPES.map((type) => (
                                    <button key={type.id} onClick={() => setNewEventData({...newEventData, type: type.id as any})} className={`px-2 py-1 rounded text-xs border transition-colors ${newEventData.type === type.id ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{type.label}</button>
                                ))}
                            </div>

                            {/* Joint Partner Selection */}
                            {newEventData.type === 'joint' && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                                    <h4 className="text-xs font-bold text-gray-700 mb-2">합방 파트너 선택</h4>
                                    <div className="relative mb-2">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="크리에이터 검색..." 
                                            value={partnerSearchQuery} 
                                            onChange={(e) => setPartnerSearchQuery(e.target.value)} 
                                            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded bg-white p-1">
                                        {potentialPartners.length > 0 ? potentialPartners.map(partner => (
                                            <div 
                                                key={partner.id} 
                                                onClick={() => togglePartnerCreator(partner.id)}
                                                className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs transition-colors ${newEventData.partnerCreators.includes(partner.id) ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${newEventData.partnerCreators.includes(partner.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                                                    {newEventData.partnerCreators.includes(partner.id) && <Check size={10} className="text-white" />}
                                                </div>
                                                {partner.avatarUrl ? <img src={partner.avatarUrl} className="w-5 h-5 rounded-full object-cover"/> : <div className="w-5 h-5 rounded-full bg-gray-200"></div>}
                                                <span className="font-medium">{partner.name}</span>
                                                <span className="text-[10px] text-gray-400 ml-auto">{renderPlatformIcon(partner.platform, 10)}</span>
                                            </div>
                                        )) : (
                                            <div className="text-center py-4 text-xs text-gray-400">검색 결과가 없습니다.</div>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1 min-h-[20px]">
                                        {newEventData.partnerCreators.map(pid => {
                                            const p = creators.find(c => c.id === pid);
                                            return p ? (
                                                <span key={pid} className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px]">
                                                    {p.name} <button onClick={() => togglePartnerCreator(pid)} className="hover:text-purple-900"><X size={10}/></button>
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}

                            <textarea rows={3} placeholder="내용" value={newEventData.content} onChange={(e) => setNewEventData({...newEventData, content: e.target.value})} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 resize-none" />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                        <button onClick={handleSaveEvent} className="px-4 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800">등록 완료</button>
                    </div>
                </div>
            </div>
        )}

        {/* ... (Other Modals: Add, Ad, Support, Toast) ... */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                {/* ... (Same Add Modal content as before) ... */}
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                    {/* ... content ... */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">담당 크리에이터 배정</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    {/* ... Search & List & Date inputs ... */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="크리에이터 이름 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"/>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 bg-gray-50 p-2 rounded">
                            ※ 담당자가 배정되지 않은 크리에이터만 목록에 표시됩니다.
                        </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2 border-b border-gray-100">
                        {filteredAvailableCreators.length > 0 ? filteredAvailableCreators.map(creator => (
                            <div key={creator.id} onClick={() => setSelectedCreatorToAssign(creator.id)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${selectedCreatorToAssign === creator.id ? 'bg-[#E5F9F0] border-[#00C471] ring-1 ring-[#00C471]' : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-300'}`}>
                                {/* ... Creator Item ... */}
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                    {creator.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-400"><UserIcon size={18}/></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5"><span className="font-bold text-sm text-gray-900 truncate">{creator.name}</span>{renderPlatformIcon(creator.platform, 12)}</div>
                                </div>
                                {selectedCreatorToAssign === creator.id && <div className="text-[#00C471]"><CheckCircle2 size={18} fill="currentColor" className="text-white"/></div>}
                            </div>
                        )) : (
                            <div className="py-8 text-center text-gray-400 text-sm">
                                배정 가능한 크리에이터가 없습니다.
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-gray-50/50">
                        <h4 className="text-xs font-bold text-gray-500 mb-3">담당 기간 설정</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" value={managementPeriod.start} onChange={(e) => setManagementPeriod({...managementPeriod, start: e.target.value})} />
                            <input type="date" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" value={managementPeriod.end} onChange={(e) => setManagementPeriod({...managementPeriod, end: e.target.value})} />
                        </div>
                    </div>
                    <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-2">
                        <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                        <button onClick={handleAddCreator} disabled={!selectedCreatorToAssign} className={`px-4 py-2 text-sm text-white rounded-lg transition-colors font-medium ${!selectedCreatorToAssign ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}>등록하기</button>
                    </div>
                </div>
            </div>
        )}

        {isAdModalOpen && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAdModalOpen(false)}>
                {/* ... Ad Modal Content (same as previous) ... */}
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">광고 캠페인 등록</h3>
                        <button onClick={() => setIsAdModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="광고주 (브랜드명)" value={newAdData.brandName} onChange={e => setNewAdData({...newAdData, brandName: e.target.value})} />
                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="제품 / 캠페인명" value={newAdData.campaignTitle} onChange={e => setNewAdData({...newAdData, campaignTitle: e.target.value})} />
                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="제안 단가" value={newAdData.budget} onChange={e => setNewAdData({...newAdData, budget: e.target.value})} />
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={newAdData.creatorId} onChange={e => setNewAdData({...newAdData, creatorId: e.target.value})}>
                            <option value="">담당 크리에이터 선택</option>
                            {myCreators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" rows={3} placeholder="상세 내용" value={newAdData.description} onChange={e => setNewAdData({...newAdData, description: e.target.value})} />
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                        <button onClick={() => setIsAdModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                        <button onClick={handleAddAd} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">등록하기</button>
                    </div>
                </div>
            </div>
        )}

        {/* Support Request Modal */}
        {supportModal.open && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSupportModal({ ...supportModal, open: false })}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">{supportModal.type === 'legal' ? '법률 자문 신청' : '세무 상담 신청'}</h3>
                        <button onClick={() => setSupportModal({ ...supportModal, open: false })} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                            {supportModal.type === 'legal' 
                                ? '전속 계약서 검토, 저작권 분쟁, 악성 댓글 고소 등 법률적인 지원이 필요한 내용을 작성해주세요.'
                                : '세금 신고, 정산서 발행, 비용 처리 등 세무/회계 관련 문의 사항을 작성해주세요.'
                            }
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">제목</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                placeholder="상담 제목을 입력하세요"
                                value={supportForm.title}
                                onChange={e => setSupportForm({...supportForm, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">상담 요청 내용</label>
                            <textarea 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none h-32 focus:outline-none focus:border-black transition-colors"
                                placeholder="구체적인 내용을 입력해주세요."
                                value={supportForm.content}
                                onChange={e => setSupportForm({...supportForm, content: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                        <button onClick={() => setSupportModal({ ...supportModal, open: false })} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                        <button onClick={handleSupportRequest} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-1">
                            <Send size={14} /> 신청하기
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-[fadeIn_0.2s_ease-out]">
                {toast.type === 'success' ? (
                    <CheckCircle2 size={20} className="text-[#00C471]" />
                ) : (
                    <AlertCircle size={20} className="text-red-400" />
                )}
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
        )}
    </div>
  );
};
