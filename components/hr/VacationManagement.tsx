
import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, AlertCircle, Calendar, ArrowRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { VacationLog } from '../../types';

interface VacationManagementProps {
    vacationLogs: VacationLog[];
    onUpdateVacationLogs: (logs: VacationLog[]) => void;
}

export const VacationManagement: React.FC<VacationManagementProps> = ({ vacationLogs, onUpdateVacationLogs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'unapproved'>('all');

    // Date Filter State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: keyof VacationLog; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: keyof VacationLog) => {
        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                setSortConfig({ key, direction: 'desc' });
            } else {
                setSortConfig(null); // Reset to default
            }
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    };

    const getSortIcon = (key: keyof VacationLog) => {
        if (sortConfig?.key !== key) return <ArrowUpDown size={12} className="text-gray-400 opacity-50 ml-1" />;
        return sortConfig.direction === 'asc' 
            ? <ArrowUp size={12} className="text-black ml-1" /> 
            : <ArrowDown size={12} className="text-black ml-1" />;
    };

    // Calculate Statistics
    // Note: For demo purposes, we align "This Month" with the mock data timeline (2026-01)
    const DEMO_CURRENT_MONTH_PREFIX = '2026-01'; 
    
    const stats = {
        vacationers: vacationLogs.filter(v => 
            v.status === '승인됨' && v.type !== '병가' && v.type !== '워케이션' && 
            (v.startDate.startsWith(DEMO_CURRENT_MONTH_PREFIX) || v.endDate.startsWith(DEMO_CURRENT_MONTH_PREFIX))
        ).length,
        pending: vacationLogs.filter(v => v.status === '대기중' && v.type !== '워케이션').length,
        sickLeave: vacationLogs.filter(v => 
            v.type === '병가' && v.status === '승인됨' && 
            (v.startDate.startsWith(DEMO_CURRENT_MONTH_PREFIX) || v.endDate.startsWith(DEMO_CURRENT_MONTH_PREFIX))
        ).length
    };

    const filteredAndSorted = vacationLogs.filter(v => {
        // Base filter: exclude '사용완료' (Used/Archived) and '워케이션' (Workation)
        if (v.status === '사용완료') return false;
        if (v.type === '워케이션') return false;
        
        // Search Filter
        if (!v.name.includes(searchQuery)) return false;

        // Date Range Filter (Overlap Logic)
        if (startDate && v.endDate < startDate) return false;
        if (endDate && v.startDate > endDate) return false;

        // Tab Filter
        if (activeTab === 'approved') return v.status === '승인됨';
        if (activeTab === 'unapproved') return v.status === '대기중' || v.status === '반려됨';
        
        return true;
    }).sort((a, b) => {
        if (sortConfig) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            
            if (aValue === undefined || bValue === undefined) return 0;

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }
        // Default sort by startDate descending
        return b.startDate.localeCompare(a.startDate);
    });

    // Counts for Tabs (excluding Workation)
    const activeLogs = vacationLogs.filter(v => v.status !== '사용완료' && v.type !== '워케이션');
    const countAll = activeLogs.length;
    const countApproved = activeLogs.filter(v => v.status === '승인됨').length;
    const countUnapproved = activeLogs.filter(v => v.status === '대기중' || v.status === '반려됨').length;

    const handleApproval = (approved: boolean) => {
        if (!approved && !rejectionReason.trim()) return alert('반려 사유를 입력해주세요.');
        onUpdateVacationLogs(vacationLogs.map(log => 
            log.id === selectedId ? { ...log, status: approved ? '승인됨' : '반려됨', rejectionReason: approved ? undefined : rejectionReason } : log
        ));
        setSelectedId(null);
        setRejectionReason('');
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setActiveTab('all');
        setSortConfig(null);
    };

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm text-gray-500 font-bold mb-2">이번달 휴가자</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.vacationers}</h3>
                        <span className="text-base text-gray-400 font-medium">명</span>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm text-gray-500 font-bold mb-2">미승인(대기) 신청</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
                        <span className="text-base text-gray-400 font-medium">건</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm text-gray-500 font-bold mb-2">이번달 병가자</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.sickLeave}</h3>
                        <span className="text-base text-gray-400 font-medium">명</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === 'all' ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    전체
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{countAll}</span>
                    {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('approved')}
                    className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === 'approved' ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    승인
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{countApproved}</span>
                    {activeTab === 'approved' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('unapproved')}
                    className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === 'unapproved' ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    미승인
                    <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{countUnapproved}</span>
                    {activeTab === 'unapproved' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="신청자 검색..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-black transition-colors" 
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-600" 
                        />
                        <ArrowRight size={12} className="text-gray-300 mx-1" />
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-600" 
                        />
                    </div>
                </div>

                <button 
                    onClick={resetFilters}
                    className="text-xs text-gray-400 hover:text-black transition-colors font-bold uppercase tracking-widest"
                >
                    필터 초기화
                </button>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase select-none">
                        <tr>
                            <th 
                                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-1">신청자 {getSortIcon('name')}</div>
                            </th>
                            <th 
                                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('type')}
                            >
                                <div className="flex items-center gap-1">유형 {getSortIcon('type')}</div>
                            </th>
                            <th 
                                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('startDate')}
                            >
                                <div className="flex items-center gap-1">시작일 {getSortIcon('startDate')}</div>
                            </th>
                            <th 
                                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('endDate')}
                            >
                                <div className="flex items-center gap-1">종료일 {getSortIcon('endDate')}</div>
                            </th>
                            <th className="px-6 py-3">일수</th>
                            <th className="px-6 py-3">상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredAndSorted.length > 0 ? filteredAndSorted.map(vac => (
                            <tr 
                                key={vac.id} 
                                className={`transition-colors ${vac.status === '대기중' ? 'hover:bg-orange-50 cursor-pointer' : 'hover:bg-gray-50'}`} 
                                onClick={() => vac.status === '대기중' && setSelectedId(vac.id)}
                            >
                                <td className="px-6 py-4 font-bold text-gray-900">{vac.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${
                                        vac.type === '반차' ? 'bg-purple-50 border-purple-100 text-purple-700' : 
                                        vac.type === '병가' ? 'bg-red-50 border-red-100 text-red-700' :
                                        'bg-blue-50 border-blue-100 text-blue-700'
                                    }`}>
                                        {vac.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-xs">{vac.startDate}</td>
                                <td className="px-6 py-4 text-gray-600 text-xs">{vac.endDate}</td>
                                <td className="px-6 py-4">{vac.days}일</td>
                                <td className="px-6 py-4">
                                    {vac.status === '승인됨' && <span className="text-green-600 text-xs font-medium flex items-center gap-1"><CheckCircle2 size={12}/> 승인됨</span>}
                                    {vac.status === '대기중' && <span className="text-orange-600 text-xs font-bold flex items-center gap-1 bg-orange-100 px-2 py-1 rounded w-fit">⚡ 결재 대기</span>}
                                    {vac.status === '반려됨' && <span className="text-red-500 text-xs flex items-center gap-1"><XCircle size={12}/> 반려됨</span>}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">
                                    해당하는 휴가 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedId && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedId(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 p-6 text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4"><AlertCircle size={24} /></div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">휴가 결재 처리</h3>
                        <p className="text-gray-500 text-sm mb-6">{vacationLogs.find(v => v.id === selectedId)?.name}님의 휴가를 결재하시겠습니까?</p>
                        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 h-20 resize-none focus:outline-none focus:border-black" placeholder="반려 시 사유를 입력하세요" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                        <div className="flex gap-2">
                            <button onClick={() => handleApproval(false)} className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">반려</button>
                            <button onClick={() => handleApproval(true)} className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">승인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
