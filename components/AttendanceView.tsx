
import React, { useState, useMemo } from 'react';
import { 
    Clock, Calendar, AlertCircle, CheckCircle2, XCircle, ChevronLeft, ChevronRight, 
    BarChart3, Plane, Briefcase, Search, Filter, Plus, X,
    MapPin, Phone, Target, ClipboardList, Stethoscope, Gift, Timer, ArrowRight
} from 'lucide-react';
import { VacationLog } from '../types';

interface AttendanceViewProps {
    vacationLogs?: VacationLog[];
    onUpdateVacationLogs?: (logs: VacationLog[]) => void;
    userName: string;
}

// 날짜 포맷 헬퍼
const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const day = dayNames[date.getDay()];
    return `${y}. ${m}. ${d} (${day})`;
};

const getISODate = (date: Date) => date.toISOString().split('T')[0];

export const AttendanceView: React.FC<AttendanceViewProps> = ({ 
    vacationLogs = [], 
    onUpdateVacationLogs,
    userName 
}) => {
  // --- 필터링 상태 ---
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(getISODate(lastWeek));
  const [endDate, setEndDate] = useState(getISODate(today));
  const [activeTab, setActiveTab] = useState<'work' | 'vacation'>('work');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vacationTypeFilter, setVacationTypeFilter] = useState('All');
  
  // 반려 사유 모달 상태
  const [rejectionModalLog, setRejectionModalLog] = useState<VacationLog | null>(null);

  // 휴가 신청 모달 및 폼 상태
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [vacationForm, setVacationForm] = useState({
      type: '연차', startDate: '', endDate: '', reason: '',
      location: '', emergencyContact: '', workGoals: '', handover: '',
      relationship: '', eventType: '', symptoms: '', hospital: ''
  });

  // --- 풍부한 테스트 데이터 (휴가 사용 내역) ---
  const mockVacations: VacationLog[] = [
    { id: 201, name: '이채연', type: '연차', startDate: '2026-01-20', endDate: '2026-01-21', days: 2, status: '승인됨', reason: '가족 여행' },
    { id: 202, name: '이채연', type: '워케이션', startDate: '2026-01-15', endDate: '2026-01-17', days: 3, status: '승인됨', reason: '제주도 워케이션', location: '제주 오피스' },
    { id: 203, name: '이채연', type: '경조사', startDate: '2026-01-12', endDate: '2026-01-12', days: 1, status: '반려됨', reason: '사촌 결혼식', rejectionReason: '경조사 휴가 규정상 본인/부모/조부모/형제자매까지만 유급 휴가 지원이 가능합니다. 연차를 사용하여 신청해주세요.' },
    { id: 204, name: '이채연', type: '병가', startDate: '2026-01-05', endDate: '2026-01-06', days: 2, status: '승인됨', reason: '독감 치료', hospital: '강남내과' },
    { id: 205, name: '이채연', type: '반차', startDate: '2026-01-02', endDate: '2026-01-02', days: 0.5, status: '승인됨', reason: '은행 업무' },
    { id: 206, name: '이채연', type: '연차', startDate: '2025-12-24', endDate: '2025-12-26', days: 3, status: '승인됨', reason: '크리스마스 휴가' },
    { id: 207, name: '이채연', type: '워케이션', startDate: '2025-12-10', endDate: '2025-12-12', days: 3, status: '반려됨', reason: '강원도 워케이션', rejectionReason: '해당 기간에 팀 내 중요 프로젝트 출시 일정이 겹쳐 부재가 어렵습니다. 일정을 1월 이후로 조정 부탁드립니다.' },
    { id: 208, name: '이채연', type: '병가', startDate: '2025-11-20', endDate: '2025-11-20', days: 1, status: '승인됨', reason: '치과 진료' },
    { id: 209, name: '이채연', type: '경조사', startDate: '2025-11-05', endDate: '2025-11-07', days: 3, status: '승인됨', reason: '조부상' },
    { id: 210, name: '이채연', type: '반차', startDate: '2025-10-15', endDate: '2025-10-15', days: 0.5, status: '승인됨', reason: '이사 준비' },
  ];

  const displayVacationLogs = useMemo(() => {
      // userName 프롭을 기반으로 필터링
      const combined = [...mockVacations, ...vacationLogs.filter(v => v.name === userName)];
      // ID 중복 제거 (목 데이터와 실제 데이터가 섞일 수 있으므로)
      return Array.from(new Map(combined.map(item => [item.id, item])).values());
  }, [vacationLogs, userName]);

  // 근태 통계
  const stats = { lateCount: 1, overtimeCount: 3, leaveUsed: 2.5, leaveTotal: 15 };

  // 일별 근무 내역 생성 (최근 40일)
  const workLogs = useMemo(() => {
      const data = [];
      for (let i = 0; i < 40; i++) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          if (!isWeekend) {
              let status = 'normal';
              let inTime = '08:55';
              let outTime = '18:10';
              let hours = '9h 15m';
              if (i === 1) { status = 'late'; inTime = '09:05'; hours = '9h 05m'; }
              if (i === 11) { status = 'overtime'; outTime = '20:30'; hours = '11h 35m'; }
              data.push({
                  id: i,
                  date: formatDate(d),
                  isoDate: getISODate(d),
                  in: inTime,
                  out: outTime,
                  hours: hours,
                  status: status,
                  type: (i % 3 === 0 ? 'wfh' : 'office')
              });
          }
      }
      return data;
  }, []);

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'normal': return '정상 근무';
          case 'late': return '지각';
          case 'overtime': return '초과 근무';
          default: return '-';
      }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'normal': return <span className="text-[#00C471] text-xs font-bold">정상 근무</span>;
        case 'late': return <span className="text-orange-600 text-xs font-bold">지각</span>;
        case 'overtime': return <span className="text-purple-600 text-xs font-bold">초과 근무</span>;
        default: return <span className="text-gray-400 text-xs font-medium">-</span>;
    }
  };

  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'wfh': return <span className="text-xs text-gray-500 flex items-center gap-1"><Briefcase size={12}/> 재택</span>;
          case 'office': return <span className="text-xs text-gray-500 flex items-center gap-1"><Briefcase size={12}/> 출근</span>;
          default: return null;
      }
  }

  // --- 필터링 로직 ---
  const filteredWorkLogs = workLogs.filter(log => {
      const isWithinDateRange = log.isoDate >= startDate && log.isoDate <= endDate;
      const matchesStatus = statusFilter === 'All' || getStatusLabel(log.status) === statusFilter;
      return isWithinDateRange && matchesStatus;
  });

  const filteredVacations = displayVacationLogs.filter(log => {
      const isWithinDateRange = log.startDate >= startDate && log.startDate <= endDate;
      const matchesType = vacationTypeFilter === 'All' || log.type === vacationTypeFilter;
      return isWithinDateRange && matchesType;
  });

  const handleVacationSubmit = () => {
      if(!vacationForm.startDate || !vacationForm.endDate) return alert('날짜를 선택해주세요.');
      
      // 새로운 휴가 객체 생성
      const newLog: VacationLog = {
          id: Date.now(),
          name: userName,
          type: vacationForm.type,
          startDate: vacationForm.startDate,
          endDate: vacationForm.endDate,
          days: 1, // 단순화를 위해 1일로 처리
          status: '대기중',
          reason: vacationForm.reason || `${vacationForm.type} 신청`
      };

      // 상위 컴포넌트 상태 업데이트
      if (onUpdateVacationLogs) {
          onUpdateVacationLogs([newLog, ...vacationLogs]);
      }

      alert(`${vacationForm.type} 신청이 완료되었습니다.`);
      setIsVacationModalOpen(false);
      setVacationForm({ 
          type: '연차', startDate: '', endDate: '', reason: '', location: '', emergencyContact: '', workGoals: '', handover: '', relationship: '', eventType: '', symptoms: '', hospital: ''
      });
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white p-8 animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="text-gray-800" size={32} /> 나의 근태/휴가
            </h1>
        </div>

        {/* Stats Grid - Unified Black Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">지각 횟수</span>
                    <AlertCircle size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">{stats.lateCount}</span>
                    <span className="text-sm text-gray-400 font-medium">회</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">정규 출근 시간 이후 기록된 누적 횟수입니다.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">추가근무 횟수</span>
                    <Timer size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">{stats.overtimeCount}</span>
                    <span className="text-sm text-gray-400 font-medium">회</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">정규 업무 시간을 초과하여 근무한 일수입니다.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">잔여 연차</span>
                    <Plane size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                </div>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-bold text-gray-900">{stats.leaveTotal - stats.leaveUsed}</span>
                    <span className="text-sm text-gray-400 font-medium mb-1.5">일</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">사용 연차 {stats.leaveUsed} / {stats.leaveTotal}</span>
                        <span className="font-bold text-gray-900">{Math.round((stats.leaveUsed/stats.leaveTotal)*100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black" style={{ width: `${(stats.leaveUsed / stats.leaveTotal) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 flex gap-6">
            <button 
                onClick={() => setActiveTab('work')}
                className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'work' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-700'}`}
            >
                <Clock size={16} /> 일별 근무 내역
            </button>
            <button 
                onClick={() => setActiveTab('vacation')}
                className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'vacation' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-700'}`}
            >
                <Plane size={16} /> 휴가 사용 내역
            </button>
        </div>

        {/* Filter Bar & List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Date Range Filter */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mr-1">기간</span>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-sm bg-transparent focus:outline-none cursor-pointer" />
                        <ArrowRight size={14} className="text-gray-300 mx-1" />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-sm bg-transparent focus:outline-none cursor-pointer" />
                    </div>
                    
                    {/* Type Filter */}
                    {activeTab === 'work' ? (
                        <div className="relative">
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-3 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black appearance-none cursor-pointer shadow-sm min-w-[140px]"
                            >
                                <option value="All">모든 상태</option>
                                <option value="정상 근무">정상 근무</option>
                                <option value="지각">지각</option>
                                <option value="초과 근무">초과 근무</option>
                            </select>
                            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    ) : (
                        <div className="relative">
                            <select 
                                value={vacationTypeFilter}
                                onChange={(e) => setVacationTypeFilter(e.target.value)}
                                className="pl-3 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black appearance-none cursor-pointer shadow-sm min-w-[140px]"
                            >
                                <option value="All">모든 유형</option>
                                <option value="연차">연차</option>
                                <option value="반차">반차</option>
                                <option value="경조사">경조사</option>
                                <option value="병가">병가</option>
                                <option value="워케이션">워케이션</option>
                            </select>
                            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                {/* Always show Apply button in Vacation tab */}
                {activeTab === 'vacation' && (
                    <button 
                        onClick={() => setIsVacationModalOpen(true)}
                        className="text-xs bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5 font-bold shadow-sm"
                    >
                        <Plus size={14} /> 휴가 신청
                    </button>
                )}
            </div>

            {activeTab === 'work' ? (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-1/4">날짜</th>
                            <th className="px-6 py-4">근무 유형</th>
                            <th className="px-6 py-4">출근 시간</th>
                            <th className="px-6 py-4">퇴근 시간</th>
                            <th className="px-6 py-4">실제 근무</th>
                            <th className="px-6 py-4 text-right">근태 상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredWorkLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.date}</td>
                                <td className="px-6 py-4">{getTypeIcon(log.type)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.in}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.out}</td>
                                <td className="px-6 py-4 text-sm text-gray-800 font-bold">{log.hours}</td>
                                <td className="px-6 py-4 text-right">{getStatusBadge(log.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">휴가 기간</th>
                            <th className="px-6 py-4">유형</th>
                            <th className="px-6 py-4">사용 일수</th>
                            <th className="px-6 py-4">사유</th>
                            <th className="px-6 py-4 text-center">승인 상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredVacations.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.startDate} ~ {log.endDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${log.type === '반차' ? 'bg-purple-50 border-purple-100 text-purple-700' : log.type === '워케이션' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 font-bold">{log.days}일</td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">{log.reason}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center">
                                        {log.status === '반려됨' ? (
                                            <button 
                                                onClick={() => setRejectionModalLog(log)}
                                                className="text-red-500 text-[11px] font-bold flex items-center gap-1 hover:underline hover:text-red-600 transition-colors"
                                            >
                                                <XCircle size={12}/> 반려됨 (사유보기)
                                            </button>
                                        ) : (
                                            <span className="text-green-600 text-[11px] font-bold flex items-center gap-1">
                                                <CheckCircle2 size={12}/> {log.status}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>

        {/* 반려 사유 모달 */}
        {rejectionModalLog && (
            <div className="fixed inset-0 bg-black/30 z-[110] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setRejectionModalLog(null)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><AlertCircle size={18} className="text-red-500"/> 반려 사유 확인</h3>
                        <button onClick={() => setRejectionModalLog(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">신청 정보</div>
                            <div className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                                {rejectionModalLog.type} | {rejectionModalLog.startDate}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">인사 운영자 반려 사유</div>
                            <div className="text-sm text-gray-700 leading-relaxed bg-red-50/50 p-4 rounded-lg border border-red-100 min-h-[80px]">
                                {rejectionModalLog.rejectionReason}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button onClick={() => setRejectionModalLog(null)} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-bold transition-colors shadow-sm">확인</button>
                    </div>
                </div>
            </div>
        )}

        {/* 휴가 신청 모달 (Smart Dynamic Modal) */}
        {isVacationModalOpen && (
            <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsVacationModalOpen(false)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 bg-white z-10">
                        <h3 className="font-bold text-gray-900">휴가 신청</h3>
                        <button onClick={() => setIsVacationModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-5">
                        {/* 종류 선택 */}
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

                        {/* 워케이션 전용 필드 */}
                        {vacationForm.type === '워케이션' && (
                            <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100 animate-[fadeIn_0.2s]">
                                <h4 className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1"><MapPin size={12}/> 워케이션 필수 정보</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">근무 장소</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="예: 제주 오피스" value={vacationForm.location} onChange={e => setVacationForm({...vacationForm, location: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5">비상 연락망</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="예: 010-0000-0000" value={vacationForm.emergencyContact} onChange={e => setVacationForm({...vacationForm, emergencyContact: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">업무 계획 및 목표</label>
                                    <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white resize-none" rows={2} placeholder="기간 내 달성할 주요 목표를 입력하세요" value={vacationForm.workGoals} onChange={e => setVacationForm({...vacationForm, workGoals: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">업무 인계 사항</label>
                                    <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white resize-none" rows={2} placeholder="부재 시 비상 대응 담당자 및 인계 내용을 입력하세요" value={vacationForm.handover} onChange={e => setVacationForm({...vacationForm, handover: e.target.value})} />
                                </div>
                            </div>
                        )}

                        {/* 경조사 전용 필드 */}
                        {vacationForm.type === '경조사' && (
                            <div className="space-y-4 p-4 bg-purple-50/30 rounded-lg border border-purple-100 animate-[fadeIn_0.2s]">
                                <h4 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1"><Gift size={12}/> 경조사 필수 정보</h4>
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

                        {/* 병가 전용 필드 */}
                        {vacationForm.type === '병가' && (
                            <div className="space-y-4 p-4 bg-green-50/30 rounded-lg border border-green-100 animate-[fadeIn_0.2s]">
                                <h4 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1"><Stethoscope size={14}/> 병가 필수 정보</h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">증상 및 사유</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 독감으로 인한 고열 및 몸살" value={vacationForm.symptoms} onChange={e => setVacationForm({...vacationForm, symptoms: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">진료 예정 병원</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 강남세브란스병원" value={vacationForm.hospital} onChange={e => setVacationForm({...vacationForm, hospital: e.target.value})} />
                                </div>
                            </div>
                        )}

                        {/* 공통 기간 필드 */}
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
    </div>
  );
};
