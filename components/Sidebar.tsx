
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, UserProfile } from '../types';
import { 
  Settings, PanelLeftClose, PanelLeftOpen, LayoutGrid, Calendar, 
  Clock, Users, UserCircle, Briefcase, 
  Plane, Network, Star, LogOut, Activity, Palmtree, BarChart4, ClipboardList
} from 'lucide-react';

interface SidebarProps {
  user: User;
  userProfile: UserProfile;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  pendingApprovals?: number;
  onOpenVacationModal?: () => void;
  onOpenPhqModal?: () => void; // New Prop for Survey
}

interface CalendarWidgetProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ currentDate, onDateChange }) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
     days.push(<span key={`empty-${i}`}></span>);
  }
  for (let d = 1; d <= daysInMonth; d++) {
     const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
     days.push(
        <span 
          key={d} 
          className={`
            ${isToday ? 'bg-[#EB5757] text-white' : 'text-gray-500 hover:bg-gray-100'}
            rounded-[4px] w-6 h-6 flex items-center justify-center mx-auto text-[11px] transition-colors
          `}
        >
            {d}
        </span>
     );
  }

  return (
    <div className="cursor-pointer">
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-xs font-semibold text-gray-700">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </span>
        <div className="flex gap-2">
           <span onClick={handlePrevMonth} className="text-xs text-gray-400 cursor-pointer hover:text-black p-1">&lt;</span>
           <span onClick={handleNextMonth} className="text-xs text-gray-400 cursor-pointer hover:text-black p-1">&gt;</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] text-gray-400 mb-2">
        <span className="text-red-400">일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {days}
      </div>
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, userProfile, onLogout, currentView, onNavigate, currentDate, onDateChange, 
  pendingApprovals = 0, onOpenVacationModal, onOpenPhqModal 
}) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const isCreator = user.role === UserRole.CREATOR;
  
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Timer & Attendance State
  const [workSeconds, setWorkSeconds] = useState(0);
  const [lastWorkRecord, setLastWorkRecord] = useState<string | null>(null);
  
  // New State for Clock times and Day Progress
  const [attendanceState, setAttendanceState] = useState<{
      inTime: string | null;
      outTime: string | null;
      isLate: boolean;
      isEarlyLeave: boolean;
  }>({ inTime: null, outTime: null, isLate: false, isEarlyLeave: false });
  const [dayProgress, setDayProgress] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Timer logic for elapsed work time
  useEffect(() => {
    if (isClockedIn) {
      timerRef.current = window.setInterval(() => {
        setWorkSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isClockedIn]);

  // Day Progress Logic (09:00 - 18:00)
  useEffect(() => {
      const updateDayProgress = () => {
          const now = new Date();
          const start = new Date(now);
          start.setHours(9, 0, 0, 0);
          const end = new Date(now);
          end.setHours(18, 0, 0, 0);

          const total = end.getTime() - start.getTime();
          const current = now.getTime() - start.getTime();
          
          let pct = (current / total) * 100;
          if (pct < 0) pct = 0;
          if (pct > 100) pct = 100;
          setDayProgress(pct);
      };

      updateDayProgress();
      const interval = setInterval(updateDayProgress, 60000); // Update every minute
      return () => clearInterval(interval);
  }, []);

  const handleClockInOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (!isClockedIn) {
      // Clock In
      setWorkSeconds(0);
      setLastWorkRecord(null);
      setIsClockedIn(true);
      
      // Check if late (after 09:00)
      const nineAM = new Date(now);
      nineAM.setHours(9, 0, 0, 0);
      const isLate = now.getTime() > nineAM.getTime();

      setAttendanceState(prev => ({
          ...prev,
          inTime: timeString,
          isLate: isLate,
          outTime: null,
          isEarlyLeave: false
      }));
    } else {
      // Clock Out
      setIsClockedIn(false);
      setLastWorkRecord(formatTime(workSeconds));
      
      // Check if early leave (before 18:00)
      const sixPM = new Date(now);
      sixPM.setHours(18, 0, 0, 0);
      const isEarlyLeave = now.getTime() < sixPM.getTime();

      setAttendanceState(prev => ({
          ...prev,
          outTime: timeString,
          isEarlyLeave: isEarlyLeave
      }));
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getMenuItemClass = (viewName: string) => {
    const isActive = currentView === viewName;
    return `flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors relative ${
      isActive 
        ? 'bg-gray-200 text-gray-900 font-medium' 
        : 'text-gray-600 hover:bg-gray-100'
    } ${isCollapsed ? 'justify-center' : ''}`;
  };

  const handleSettings = () => {
    alert("설정 페이지는 준비 중입니다.");
  };

  return (
    <div className={`${isCollapsed ? 'w-[80px]' : 'w-[280px]'} h-screen bg-[#F7F7F5] border-r border-gray-200 flex flex-col p-4 sidebar-scroll overflow-y-auto shrink-0 transition-all duration-300 ease-in-out`}>
      {/* Top Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4 mb-8' : 'justify-between mb-6'} px-1`}>
        {!isCollapsed && (
            <div className="flex items-center gap-3 text-gray-400">
               <div className="cursor-pointer hover:text-gray-600" onClick={onLogout} title="로그아웃">
                   <LogOut size={16} />
               </div>
               <div className="cursor-pointer hover:text-gray-600" onClick={handleSettings} title="설정">
                   <Settings size={16} />
               </div>
            </div>
        )}
        <div className="text-gray-400">
            {isCollapsed ? (
                <div className="cursor-pointer hover:text-gray-600" onClick={() => setIsCollapsed(false)} title="사이드바 펼치기">
                    <PanelLeftOpen size={16} />
                </div>
            ) : (
                <div className="cursor-pointer hover:text-gray-600" onClick={() => setIsCollapsed(true)} title="사이드바 접기">
                    <PanelLeftClose size={16} />
                </div>
            )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="mb-6">
        {!isCollapsed ? (
            <>
                <h2 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">내 정보</h2>
                <div 
                    onClick={() => onNavigate('mypage')}
                    className="flex items-center gap-3 mb-4 cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-200 transition-colors group"
                >
                  <img src={user.avatarUrl || userProfile.avatarUrl} alt="profile" className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:border-gray-300" />
                  <div>
                    <div className="font-bold text-sm text-gray-800 group-hover:text-black">{user.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{user.jobTitle}</div>
                    <div className="flex gap-1">
                      {user.tags.map((tag, i) => (
                        <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${tag === '재직중' || tag === '계약중' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {!isCreator ? (
                    <div className="flex gap-2 mb-6">
                      <button 
                        onClick={handleClockInOut}
                        className={`flex-1 py-1.5 border rounded text-xs font-medium shadow-sm transition-colors ${
                            isClockedIn 
                            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {isClockedIn ? '퇴근하기' : '출근하기'}
                      </button>
                      <button 
                        onClick={onOpenVacationModal} 
                        className="flex-1 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                      >
                        휴가 신청
                      </button>
                    </div>
                ) : (
                    <div className="mb-6">
                       <button 
                          onClick={onOpenPhqModal}
                          className="w-full py-2.5 bg-[#00C471] hover:bg-[#00b065] text-white rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                       >
                          <ClipboardList size={16} /> 설문조사
                       </button>
                       <p className="text-[10px] text-gray-400 text-center mt-2">정기적인 건강 설문으로 상태를 체크하세요.</p>
                    </div>
                )}

                {!isCreator && (
                    <div className="mb-2">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-gray-700">
                            {isClockedIn ? '현재 근무 시간' : '오늘 근무 기록'}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                         <span className={`text-2xl font-bold font-mono ${isClockedIn ? 'text-blue-600' : 'text-gray-800'}`}>
                             {isClockedIn ? formatTime(workSeconds) : lastWorkRecord || '00:00:00'}
                         </span>
                      </div>
                      {/* Workday Progress Bar (09:00 - 18:00) */}
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2" title="정규 근무 시간 (09:00 ~ 18:00)">
                         <div 
                            className="h-full bg-green-500 transition-all duration-1000 ease-out" 
                            style={{ width: `${dayProgress}%` }}
                         ></div>
                      </div>
                      
                      {/* Clock In/Out Times Display */}
                      <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                              <span className="text-gray-400">출근</span>
                              {attendanceState.inTime ? (
                                  <span className={`font-bold ${attendanceState.isLate ? 'text-red-500' : 'text-blue-600'}`}>
                                      {attendanceState.inTime}
                                  </span>
                              ) : (
                                  <span className="text-gray-300">--:--</span>
                              )}
                          </div>
                          <div className="flex items-center gap-1.5">
                              <span className="text-gray-400">퇴근</span>
                              {attendanceState.outTime ? (
                                  <span className={`font-bold ${attendanceState.isEarlyLeave ? 'text-red-500' : 'text-blue-600'}`}>
                                      {attendanceState.outTime}
                                  </span>
                              ) : (
                                  <span className="text-gray-300">--:--</span>
                              )}
                          </div>
                      </div>
                    </div>
                )}
            </>
        ) : (
            <div className="flex flex-col items-center gap-2 mb-4">
                <div 
                    onClick={() => onNavigate('mypage')}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <img src={user.avatarUrl || userProfile.avatarUrl} alt="profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" title={user.name} />
                </div>
            </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1">
        
        {isAdmin ? (
          /* ============ ADMIN LAYOUT ============ */
          <>
            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-4 px-2 uppercase tracking-wider">개인 업무</div>}
            
            <nav className="space-y-0.5">
              <div onClick={() => onNavigate('mypage')} className={getMenuItemClass('mypage')} title="마이페이지">
                <LayoutGrid size={16} />
                {!isCollapsed && <span className="text-sm">마이페이지</span>}
              </div>
              <div onClick={() => onNavigate('schedule')} className={getMenuItemClass('schedule')} title="나의 일정">
                <Calendar size={16} />
                {!isCollapsed && <span className="text-sm">나의 일정</span>}
              </div>
              <div onClick={() => onNavigate('attendance')} className={getMenuItemClass('attendance')} title="나의 근태/휴가">
                <Clock size={16} />
                {!isCollapsed && <span className="text-sm">나의 근태/휴가</span>}
              </div>
            </nav>

            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-6 px-2 uppercase tracking-wider">인사/운영 관리</div>}

            <nav className="space-y-0.5">
               <div onClick={() => onNavigate('hr-staff')} className={getMenuItemClass('hr-staff')} title="직원 관리">
                  <Users size={16} />
                  {!isCollapsed && <span className="text-sm">직원 관리</span>}
               </div>

               <div onClick={() => onNavigate('hr-attendance')} className={getMenuItemClass('hr-attendance')} title="근태 관리">
                  <BarChart4 size={16} />
                  {!isCollapsed && <span className="text-sm">근태 관리</span>}
               </div>
               
               <div onClick={() => onNavigate('hr-health')} className={getMenuItemClass('hr-health')} title="건강 관리">
                  <Activity size={16} />
                  {!isCollapsed && <span className="text-sm">건강 관리</span>}
               </div>

               <div onClick={() => onNavigate('hr-vacation')} className={getMenuItemClass('hr-vacation')} title="휴가 관리">
                  <Palmtree size={16} />
                  {!isCollapsed && <span className="text-sm">휴가 관리</span>}
                  {pendingApprovals > 0 && (
                      <span className={`absolute ${isCollapsed ? 'top-1 right-1' : 'right-2'} bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm`}>
                        {pendingApprovals}
                      </span>
                  )}
               </div>

               <div onClick={() => onNavigate('hr-teams')} className={getMenuItemClass('hr-teams')} title="팀 관리">
                  <Network size={16} />
                  {!isCollapsed && <span className="text-sm">팀 관리</span>}
               </div>

               <div onClick={() => onNavigate('org-chart')} className={getMenuItemClass('org-chart')} title="회사 조직도">
                  <Briefcase size={16} />
                  {!isCollapsed && <span className="text-sm">회사 조직도</span>}
               </div>

               <div onClick={() => onNavigate('creator')} className={getMenuItemClass('creator')} title="크리에이터 관리">
                  <UserCircle size={16} />
                  {!isCollapsed && <span className="text-sm">크리에이터 관리</span>}
               </div>
            </nav>
            
            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-6 px-2 uppercase tracking-wider">즐겨찾기</div>}
            <nav className="space-y-0.5">
               <div className={`flex items-center gap-2 py-1.5 px-2 text-yellow-600 hover:bg-gray-200 rounded cursor-pointer ${isCollapsed ? 'justify-center' : ''}`} title="특정인원 프로필">
                  <Star size={16} className="fill-current"/>
                  {!isCollapsed && <span className="text-sm font-medium">특정인원 프로필</span>}
               </div>
            </nav>
          </>
        ) : isCreator ? (
            /* ============ CREATOR LAYOUT ============ */
            <>
              {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-4 px-2 uppercase tracking-wider">활동 관리</div>}
              
              <nav className="space-y-0.5">
                <div onClick={() => onNavigate('creator-schedule')} className={getMenuItemClass('creator-schedule')} title="나의 일정">
                   <Calendar size={16} />
                   {!isCollapsed && <span className="text-sm">나의 일정</span>}
                </div>
                <div onClick={() => onNavigate('creator-health')} className={getMenuItemClass('creator-health')} title="건강 관리">
                   <Activity size={16} />
                   {!isCollapsed && <span className="text-sm">건강 관리</span>}
                </div>
              </nav>
            </>
        ) : (
          /* ============ EMPLOYEE LAYOUT ============ */
          <>
            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-4 px-2 uppercase tracking-wider">업무 관리</div>}
            
            <nav className="space-y-0.5">
              <div onClick={() => onNavigate('mypage')} className={getMenuItemClass('mypage')} title="마이페이지">
                 <LayoutGrid size={16} />
                 {!isCollapsed && <span className="text-sm">마이페이지</span>}
              </div>
              <div onClick={() => onNavigate('schedule')} className={getMenuItemClass('schedule')} title="나의 일정">
                <Calendar size={16} />
                {!isCollapsed && <span className="text-sm">나의 일정</span>}
              </div>
              <div onClick={() => onNavigate('attendance')} className={getMenuItemClass('attendance')} title="나의 근태/휴가">
                <Clock size={16} />
                {!isCollapsed && <span className="text-sm">나의 근태/휴가</span>}
              </div>
              
              <div onClick={() => onNavigate('team')} className={getMenuItemClass('team')} title="팀 현황">
                <Users size={16} />
                {!isCollapsed && <span className="text-sm">팀 현황</span>}
              </div>
              <div onClick={() => onNavigate('my-creator')} className={getMenuItemClass('my-creator')} title="나의 크리에이터">
                <UserCircle size={16} />
                {!isCollapsed && <span className="text-sm">나의 크리에이터</span>}
              </div>
            </nav>
          </>
        )}

        {/* Calendar Widget (Common for Employee/Admin) */}
        {!isCreator && !isCollapsed && (
            <div className="mt-6 pb-8" onClick={() => onNavigate('schedule')}>
               <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-300 transition-colors">
                  <CalendarWidget currentDate={currentDate} onDateChange={onDateChange} />
               </div>
            </div>
        )}
      </div>
    </div>
  );
};
