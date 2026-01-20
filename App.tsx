
import React, { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { ProfileView } from './components/ProfileView';
import { ScheduleView } from './components/ScheduleView';
import { OrgChartView } from './components/OrgChartView';
import { CreatorManagerView } from './components/CreatorManagerView';
import { AttendanceView } from './components/AttendanceView';
import { HRDashboardView } from './components/HRDashboardView';
import { TeamView } from './components/TeamView';
import { User, UserProfile, UserRole, VacationLog, Team, Employee } from './types';
import { 
    EMPLOYEE_PROFILE_DATA, ADMIN_PROFILE_DATA, INITIAL_VACATION_LOGS, 
    INITIAL_TEAMS, INITIAL_EMPLOYEES 
} from './constants';
import { Creator, INITIAL_CREATORS, HealthRecord, IssueLog, CreatorEvent, INITIAL_EVENTS } from './components/CreatorShared';
import { Bot, X, Maximize2, Minimize2, Send, MessageCircle, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift, BrainCircuit, CheckCircle2 } from 'lucide-react';

const INITIAL_CREATOR_HEALTH: HealthRecord[] = [
    { id: '1', name: '슈카월드', lastCheck: '2023-12-10', score: 95, result: '양호', status: '재직중' },
    { id: '2', name: '침착맨', lastCheck: '2023-11-05', score: 65, result: '주의', status: '재직중' },
    { id: '3', name: '요리보고', lastCheck: '2024-01-05', score: 88, result: '양호', status: '대기중' },
    { id: '4', name: '여행가제이', lastCheck: '2023-09-20', score: 92, result: '양호', status: '재직중' },
    { id: '6', name: '치즈냥이', lastCheck: '-', score: 0, result: '미수검', status: '재직중' },
];

const INITIAL_CREATOR_ISSUES: IssueLog[] = [
    { id: 1, creator: '침착맨', date: '2024-01-15', category: '경미', description: '최근 방송 중 피로감 호소, 가벼운 번아웃 증상', status: '상담중' },
    { id: 2, creator: '치즈냥이', date: '2024-01-18', category: '중등도', description: '불면증 및 무기력증 호소, 전문 상담 권고', status: '휴식권고' },
    { id: 3, creator: '슈카월드', date: '2023-12-20', category: '정상', description: '정기 심리 상담 결과 양호, 특이사항 없음', status: '모니터링' },
];

// PHQ-9 Questions
const PHQ9_QUESTIONS = [
    "기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다.",
    "평소 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못했다.",
    "잠들기가 어렵거나 자주 깼다/혹은 너무 많이 잤다.",
    "평소보다 식욕이 줄었다/혹은 평소보다 많이 먹었다.",
    "다른 사람들이 눈치 챌 정도로 평소보다 말과 행동이 느려졌다/혹은 너무 안절부절 못해서 가만히 앉아 있을 수 없었다.",
    "피곤하고 기운이 없었다.",
    "내가 잘못 했거나, 실패했다는 생각이 들었다/ 혹은 자신과 가족을 실망시켰다고 생각했다.",
    "신문을 읽거나 TV를 보는 것과 같은 일상적인 일에도 집중 할 수가 없었다.",
    "차라리 죽는 것이 더 낫겠다고 생각했다/혹은 자해할 생각을 했다."
];

// PHQ-9 Answer Options (Labels)
const PHQ9_OPTIONS = ["없음", "2-6일", "7-12일", "거의 매일"];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('mypage');
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPLOYEE_PROFILE_DATA);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [creators, setCreators] = useState<Creator[]>(INITIAL_CREATORS);
  const [vacationLogs, setVacationLogs] = useState<VacationLog[]>(INITIAL_VACATION_LOGS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [creatorHealthRecords, setCreatorHealthRecords] = useState<HealthRecord[]>(INITIAL_CREATOR_HEALTH);
  const [creatorIssueLogs, setCreatorIssueLogs] = useState<IssueLog[]>(INITIAL_CREATOR_ISSUES);
  const [creatorEvents, setCreatorEvents] = useState<CreatorEvent[]>(INITIAL_EVENTS); // Hoisted Events
  
  // Chat & Global Modal States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);

  // PHQ-9 Survey State
  const [isPhqModalOpen, setIsPhqModalOpen] = useState(false);
  const [phqStep, setPhqStep] = useState(0); // 0: Confirm, 1: Survey, 2: Result
  const [phqAnswers, setPhqAnswers] = useState<number[]>(new Array(9).fill(0));

  // Global Vacation Form State
  const [vacationForm, setVacationForm] = useState({
      type: '연차', startDate: '', endDate: '', reason: '',
      location: '', emergencyContact: '', workGoals: '', handover: '',
      relationship: '', eventType: '', symptoms: '', hospital: ''
  });

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === UserRole.ADMIN) {
        setUserProfile(ADMIN_PROFILE_DATA);
        setCurrentView('mypage');
    } else if (loggedInUser.role === UserRole.CREATOR) {
        // Creator uses partial profile data or we can have a specific profile constant
        setUserProfile({
            ...EMPLOYEE_PROFILE_DATA,
            name: loggedInUser.name,
            job: 'Creator',
            org: 'MCN',
            rank: '-',
            avatarUrl: loggedInUser.avatarUrl
        });
        setCurrentView('creator-schedule');
    } else {
        setUserProfile(EMPLOYEE_PROFILE_DATA);
        setCurrentView('mypage');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsChatOpen(false);
  };

  // Synchronize profile updates with the Employee list
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
      setUserProfile(updatedProfile);
      
      // Update matching employee record to keep Team View in sync
      setEmployees(prevEmployees => prevEmployees.map(emp => 
          emp.id === updatedProfile.employeeId
          ? { 
              ...emp, 
              name: updatedProfile.name,
              engName: updatedProfile.engName,
              nickname: updatedProfile.nickname,
              email: updatedProfile.email,
              personalEmail: updatedProfile.personalEmail,
              phone: updatedProfile.phone,
              avatarUrl: updatedProfile.avatarUrl,
              coverUrl: updatedProfile.coverUrl // Sync coverUrl
            }
          : emp
      ));
  };

  const handleUpdateCreators = (updatedCreators: Creator[]) => {
      setCreators(updatedCreators);
  };

  const handleVacationSubmit = () => {
      if(!vacationForm.startDate || !vacationForm.endDate) return alert('날짜를 선택해주세요.');
      
      const newLog: VacationLog = {
          id: Date.now(),
          name: userProfile.name,
          type: vacationForm.type,
          startDate: vacationForm.startDate,
          endDate: vacationForm.endDate,
          days: 1, // Simple mock calculation
          status: '대기중',
          reason: vacationForm.reason || `${vacationForm.type} 신청`
      };

      setVacationLogs([newLog, ...vacationLogs]);
      setIsVacationModalOpen(false);
      alert(`${vacationForm.type} 신청이 완료되었습니다.`);
      setVacationForm({ 
          type: '연차', startDate: '', endDate: '', reason: '', 
          location: '', emergencyContact: '', workGoals: '', handover: '',
          relationship: '', eventType: '', symptoms: '', hospital: ''
      });
  };

  // PHQ-9 Logic
  const handleOpenPhqModal = () => {
      setPhqStep(0);
      setPhqAnswers(new Array(9).fill(0));
      setIsPhqModalOpen(true);
  };

  const handlePhqAnswerChange = (index: number, value: number) => {
      const newAnswers = [...phqAnswers];
      newAnswers[index] = value;
      setPhqAnswers(newAnswers);
  };

  const calculatePhqScore = () => {
      return phqAnswers.reduce((a, b) => a + b, 0);
  };

  const getPhqResult = (score: number) => {
      if (score <= 4) return { category: '정상', description: '유의한 수준의 우울감이 시사되지 않습니다.', status: '모니터링' };
      if (score <= 9) return { category: '경미', description: '다소 경미한 수준의 우울감이 있으나 일상생활에 지장을 줄 정도는 아닙니다.', status: '모니터링' };
      if (score <= 19) return { category: '중등도', description: '중간정도 수준의 우울감이 시사됩니다. 전문상담이 권장됩니다.', status: '상담권고' };
      return { category: '심각', description: '심한 수준의 우울감이 시사됩니다. 전문기관의 치료적 개입이 필요합니다.', status: '치료필요' };
  };

  const handlePhqSubmit = () => {
      const score = calculatePhqScore();
      const result = getPhqResult(score);
      
      // Update Creator Issue Logs
      const newLog: IssueLog = {
          id: Date.now(),
          creator: userProfile.name, // Creator's name
          date: new Date().toISOString().split('T')[0],
          category: `${result.category} (${score}점)`,
          description: `PHQ-9 자가 검진 결과: ${result.description}`,
          status: result.status
      };
      
      setCreatorIssueLogs([newLog, ...creatorIssueLogs]);
      setPhqStep(2); // Show Result Step
  };

  const pendingApprovals = vacationLogs.filter(log => log.status === '대기중').length;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-white relative">
      <Sidebar 
        user={user} 
        userProfile={userProfile}
        onLogout={handleLogout} 
        currentView={currentView}
        onNavigate={setCurrentView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        pendingApprovals={pendingApprovals}
        onOpenVacationModal={() => setIsVacationModalOpen(true)}
        onOpenPhqModal={handleOpenPhqModal}
      />
      
      {currentView === 'mypage' && (
        <ProfileView 
          profile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          vacationLogs={vacationLogs}
        />
      )}
      
      {currentView === 'schedule' && (
        <ScheduleView 
          user={user}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      )}

      {currentView === 'attendance' && (
        <AttendanceView 
            vacationLogs={vacationLogs} 
            onUpdateVacationLogs={setVacationLogs}
            userName={userProfile.name}
        />
      )}

      {(currentView === 'hr-staff' || currentView === 'hr-attendance' || currentView === 'hr-health' || currentView === 'hr-vacation' || currentView === 'hr-teams') && (
        <HRDashboardView 
            vacationLogs={vacationLogs} 
            onUpdateVacationLogs={setVacationLogs}
            teams={teams}
            onUpdateTeams={setTeams}
            employees={employees}
            onUpdateEmployees={setEmployees}
            creators={creators}
            initialTab={
                currentView === 'hr-staff' ? 'staff' :
                currentView === 'hr-attendance' ? 'attendance' :
                currentView === 'hr-health' ? 'health' :
                currentView === 'hr-vacation' ? 'vacation' : 'teams'
            }
        />
      )}

      {currentView === 'org-chart' && (
        <OrgChartView />
      )}
      
      {currentView === 'team' && (
        <TeamView 
            user={user} 
            teams={teams}
            employees={employees}
        />
      )}

      {(currentView === 'creator' || currentView === 'my-creator' || currentView === 'creator-schedule' || currentView === 'creator-health') && (
        <CreatorManagerView 
            user={user} 
            creators={creators}
            onUpdateCreators={handleUpdateCreators}
            healthRecords={creatorHealthRecords}
            onUpdateHealthRecords={setCreatorHealthRecords}
            issueLogs={creatorIssueLogs}
            onUpdateIssueLogs={setCreatorIssueLogs}
            employees={employees}
            events={creatorEvents}
            onUpdateEvents={setCreatorEvents}
            currentView={currentView}
        />
      )}

      {/* Vacation Request Global Modal */}
      {isVacationModalOpen && (
          <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsVacationModalOpen(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 bg-white z-10">
                      <h3 className="font-bold text-gray-900">휴가 신청</h3>
                      <button onClick={() => setIsVacationModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-5">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">휴가 종류</label>
                          <div className="grid grid-cols-3 gap-2">
                              {['연차', '반차', '경조사', '병가', '워케이션'].map(type => (
                                  <button
                                      key={type}
                                      onClick={() => setVacationForm({...vacationForm, type})}
                                      className={`py-2 rounded-lg text-sm border transition-all ${vacationForm.type === type ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                  >
                                      {type}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {vacationForm.type === '워케이션' && (
                          <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100 animate-[fadeIn_0.2s]">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><MapPin size={12} /> 근무 장소</label>
                                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="예: 제주 오피스" value={vacationForm.location} onChange={e => setVacationForm({...vacationForm, location: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><Phone size={12} /> 비상 연락망</label>
                                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="예: 010-0000-0000" value={vacationForm.emergencyContact} onChange={e => setVacationForm({...vacationForm, emergencyContact: e.target.value})} />
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><Target size={12} /> 업무 계획</label>
                                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white resize-none" rows={2} placeholder="주요 업무 목표를 입력하세요" value={vacationForm.workGoals} onChange={e => setVacationForm({...vacationForm, workGoals: e.target.value})} />
                              </div>
                          </div>
                      )}

                      {vacationForm.type === '경조사' && (
                          <div className="space-y-4 p-4 bg-purple-50/30 rounded-lg border border-purple-100 animate-[fadeIn_0.2s]">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">대상(관계)</label>
                                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 본인, 부모 등" value={vacationForm.relationship} onChange={e => setVacationForm({...vacationForm, relationship: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">경조 내용</label>
                                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 결혼, 장례 등" value={vacationForm.eventType} onChange={e => setVacationForm({...vacationForm, eventType: e.target.value})} />
                                  </div>
                              </div>
                          </div>
                      )}

                      {vacationForm.type === '병가' && (
                          <div className="space-y-4 p-4 bg-green-50/30 rounded-lg border border-green-100 animate-[fadeIn_0.2s]">
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><Stethoscope size={14} /> 증상 및 사유</label>
                              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 독감으로 인한 고열 등" value={vacationForm.symptoms} onChange={e => setVacationForm({...vacationForm, symptoms: e.target.value})} />
                          </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">시작일</label>
                              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" value={vacationForm.startDate} onChange={e => setVacationForm({...vacationForm, startDate: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">종료일</label>
                              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" value={vacationForm.endDate} onChange={e => setVacationForm({...vacationForm, endDate: e.target.value})} />
                          </div>
                      </div>

                      {/* 공통 사유 필드 */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">상세 사유 (선택)</label>
                          <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-black" rows={3} placeholder="추가적인 사유가 있다면 입력하세요" value={vacationForm.reason} onChange={e => setVacationForm({...vacationForm, reason: e.target.value})} />
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0">
                      <button onClick={() => setIsVacationModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">취소</button>
                      <button onClick={handleVacationSubmit} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-bold shadow-sm transition-colors">신청 완료</button>
                  </div>
              </div>
          </div>
      )}

      {/* PHQ-9 Survey Modal (Notion Style) */}
      {isPhqModalOpen && (
          <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsPhqModalOpen(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col font-sans" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">설문</span>
                          <h3 className="font-semibold text-gray-800">우울증 건강설문 (PHQ-9)</h3>
                      </div>
                      <button onClick={() => setIsPhqModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={20}/>
                      </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 overflow-y-auto flex-1">
                      {phqStep === 0 && (
                          <div className="text-center py-12">
                              <div className="text-5xl mb-6">📝</div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-3">설문을 시작할까요?</h2>
                              <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed text-sm">
                                  지난 2주 동안의 상태를 가장 잘 나타내는 답변을 선택해주세요.<br/>
                                  솔직한 답변이 정확한 진단에 도움이 됩니다.
                              </p>
                              <button 
                                  onClick={() => setPhqStep(1)} 
                                  className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all text-sm"
                              >
                                  시작하기
                              </button>
                          </div>
                      )}

                      {phqStep === 1 && (
                          <div className="space-y-10 animate-[fadeIn_0.3s_ease-out] max-w-3xl mx-auto px-4 pb-10">
                              <div className="bg-gray-50 p-4 rounded-md border-l-4 border-black text-sm text-gray-700 mb-8">
                                  지난 2주 동안, 다음과 같은 문제들로 인해서 얼마나 자주 방해를 받았습니까?
                              </div>
                              
                              {PHQ9_QUESTIONS.map((q, idx) => (
                                  <div key={idx} className="group">
                                      <div className="flex items-baseline gap-3 mb-3">
                                          <span className="text-gray-400 font-mono text-sm">{String(idx + 1).padStart(2, '0')}</span>
                                          <p className="text-gray-900 font-medium text-base">{q}</p>
                                      </div>
                                      <div className="grid grid-cols-4 gap-2">
                                          {PHQ9_OPTIONS.map((opt, val) => (
                                              <label 
                                                  key={val} 
                                                  className={`
                                                      cursor-pointer py-3 px-2 text-center rounded-md text-sm transition-all border
                                                      ${phqAnswers[idx] === val 
                                                          ? 'bg-[#00C471]/10 border-[#00C471] text-[#00C471] font-semibold shadow-sm' 
                                                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                                      }
                                                  `}
                                              >
                                                  <input 
                                                      type="radio" 
                                                      name={`q-${idx}`} 
                                                      className="hidden" 
                                                      checked={phqAnswers[idx] === val} 
                                                      onChange={() => handlePhqAnswerChange(idx, val)}
                                                  />
                                                  {opt}
                                              </label>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                              
                              <div className="pt-8 flex justify-center border-t border-gray-100">
                                  <button 
                                      onClick={handlePhqSubmit}
                                      className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg text-sm w-full md:w-auto"
                                  >
                                      결과 제출하기
                                  </button>
                              </div>
                          </div>
                      )}

                      {phqStep === 2 && (
                          <div className="text-center py-12 animate-[fadeIn_0.5s_ease-out]">
                              <div className="text-5xl mb-6">✅</div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-2">검사가 완료되었습니다</h2>
                              <p className="text-gray-500 mb-10 text-sm">
                                  결과가 건강 관리 기록에 저장되었습니다.
                              </p>
                              
                              {/* Result Card Notion Style */}
                              <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm mx-auto shadow-sm text-left">
                                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Score</div>
                                  <div className="text-4xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-6">
                                      {calculatePhqScore()} <span className="text-lg text-gray-400 font-normal">/ 27</span>
                                  </div>
                                  
                                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Result</div>
                                  <div className={`inline-block px-2 py-1 rounded text-sm font-bold mb-2 ${
                                      calculatePhqScore() <= 4 ? 'bg-green-100 text-green-700' :
                                      calculatePhqScore() <= 9 ? 'bg-blue-100 text-blue-700' :
                                      calculatePhqScore() <= 19 ? 'bg-orange-100 text-orange-700' :
                                      'bg-red-100 text-red-700'
                                  }`}>
                                      {getPhqResult(calculatePhqScore()).category}
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                      {getPhqResult(calculatePhqScore()).description}
                                  </p>
                              </div>

                              <div className="mt-10">
                                  <button 
                                      onClick={() => setIsPhqModalOpen(false)} 
                                      className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
                                  >
                                      닫기
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Floating Chat Assistant */}
      {isChatOpen ? (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50 transition-all duration-300 ease-in-out ${isChatExpanded ? 'w-[360px] h-[calc(100vh-3rem)]' : 'w-80 h-[500px]'}`}>
            <div className="bg-[#00C471] p-4 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-2 font-bold"><Bot size={20} /> AI Assistant</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsChatExpanded(!isChatExpanded)} className="p-1 hover:bg-white/20 rounded transition-colors">{isChatExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
                    <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded transition-colors"><X size={18} /></button>
                </div>
            </div>
            <div className="flex-1 bg-[#F9F9F9] p-4 overflow-y-auto space-y-4">
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00C471] flex items-center justify-center text-white shrink-0"><Bot size={16} /></div>
                    <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 text-sm text-gray-700 shadow-sm max-w-[85%]">
                        안녕하세요! 무엇을 도와드릴까요? HR 관리 기능이나 휴가 신청에 대해 궁금한 점이 있으시면 말씀해주세요.
                    </div>
                </div>
            </div>
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                <div className="relative">
                    <input type="text" placeholder="메시지를 입력하세요..." className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 transition-all"/>
                    <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#00C471] text-white p-1.5 rounded-full hover:bg-[#00b065] transition-colors shadow-sm"><Send size={14} /></button>
                </div>
            </div>
        </div>
      ) : (
        <div className="fixed bottom-8 right-8 z-50 animate-[fadeIn_0.5s_ease-out]">
            <button onClick={() => setIsChatOpen(true)} className="bg-[#00C471] text-white p-3.5 rounded-full shadow-lg hover:bg-[#00b065] cursor-pointer transition-all hover:scale-110 active:scale-95 group">
                <Bot size={28} className="group-hover:rotate-12 transition-transform" />
            </button>
        </div>
      )}
    </div>
  );
}

export default App;
