
import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Search, Plus, MoreHorizontal, Link as LinkIcon, 
  FileText, ExternalLink, Download, Activity, X, User, Edit3, Check, Lock, Smartphone, Hash, Monitor, ShieldCheck, Mail, Upload, Trash2
} from 'lucide-react';
import { User as UserType, Employee } from '../types';
import { 
    Creator, PlatformType, renderPlatformIcon, 
    CreatorHealthView, HealthRecord, IssueLog
} from './CreatorShared';

// --- Sub-components for Admin View ---

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Signed':
      return <span className="text-xs font-bold text-[#00C471]">체결완료</span>;
    case 'Drafting':
      return <span className="text-xs font-bold text-gray-500">검토중</span>;
    case 'Expired':
      return <span className="text-xs font-bold text-red-500">만료됨</span>;
    default:
      return <span className="text-xs font-bold text-gray-400">미계약</span>;
  }
};

const ContractsView = ({ creators, onOpenUploadModal }: { creators: Creator[], onOpenUploadModal: () => void }) => {
  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.2s_ease-out]">
      {/* Contract List - Full Width */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <div>
              <h3 className="font-bold text-gray-900 text-lg">계약 문서 현황</h3>
              <p className="text-sm text-gray-500">전속 계약 및 광고 계약 문서를 통합 관리합니다.</p>
          </div>
          <button 
            onClick={onOpenUploadModal}
            className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
          >
            + 새 계약서 작성
          </button>
        </div>
        
        <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden shadow-sm">
          {creators.map(creator => (
            <div key={creator.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-black group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-1">
                    {creator.name} 표준 전속 계약서
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="font-medium text-gray-500">
                        {creator.managementStartDate && creator.managementEndDate 
                            ? `${creator.managementStartDate} ~ ${creator.managementEndDate}` 
                            : '기간 미설정'}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{creator.channelName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg" title="다운로드">
                   <Download size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Helper Component for Modal ---
const PlatformOption = ({ platform, selected, onClick }: { platform: PlatformType, selected: boolean, onClick: () => void }) => (
    <div 
       onClick={onClick}
       className={`
          cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border transition-all
          ${selected ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
       `}
    >
        <div className="mb-2">{renderPlatformIcon(platform, 24)}</div>
        <span className={`text-xs font-medium ${selected ? 'text-black' : 'text-gray-500'}`}>
           {platform === 'Chzzk' ? '치지직' : platform}
        </span>
    </div>
);

// --- Main Admin Component ---
interface AdminCreatorViewProps {
    user: UserType;
    creators: Creator[];
    onUpdateCreators: (creators: Creator[]) => void;
    // Health Props
    healthRecords: HealthRecord[];
    onUpdateHealthRecords: (records: HealthRecord[]) => void;
    issueLogs: IssueLog[];
    onUpdateIssueLogs: (logs: IssueLog[]) => void;
    employees: Employee[];
}

export const AdminCreatorView = ({ 
    user, 
    creators, 
    onUpdateCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
    employees
}: AdminCreatorViewProps) => {
  const [adminTab, setAdminTab] = useState<'list' | 'contract' | 'health'>('list');
  
  // Modal & Edit States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCreatorId, setEditingCreatorId] = useState<string | null>(null);
  
  const [isAssignManagerModalOpen, setIsAssignManagerModalOpen] = useState(false);
  const [assignManagerData, setAssignManagerData] = useState<{ creatorId: string, managerName: string }>({ creatorId: '', managerName: '' });
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  
  // Contract Modal State
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractForm, setContractForm] = useState({
      title: '',
      creatorName: '',
      startDate: '',
      endDate: ''
  });
  const fileContractInputRef = useRef<HTMLInputElement>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);

  // Dropdown Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newCreatorData, setNewCreatorData] = useState<{
      name: string;
      platform: PlatformType;
      subscribers: string;
      category: string;
      status: '활동중' | '휴식중' | '대기중';
      avatarUrl: string;
      contactInfo: string;
      loginId: string;
      password: string;
      managerName: string;
  }>({
      name: '',
      platform: 'YouTube',
      subscribers: '',
      category: '',
      status: '대기중',
      avatarUrl: '',
      contactInfo: '',
      loginId: '',
      password: '',
      managerName: ''
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setActiveMenuId(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewCreatorData(prev => ({ ...prev, avatarUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleOpenAddModal = () => {
      setModalMode('create');
      setEditingCreatorId(null);
      setNewCreatorData({
          name: '',
          platform: 'YouTube',
          subscribers: '',
          category: '',
          status: '대기중',
          avatarUrl: '',
          contactInfo: '',
          loginId: '',
          password: '',
          managerName: ''
      });
      setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (creator: Creator) => {
      setModalMode('edit');
      setEditingCreatorId(creator.id);
      setNewCreatorData({
          name: creator.name,
          platform: creator.platform,
          subscribers: creator.subscribers,
          category: creator.category || '',
          status: (creator.status === '계약만료' || creator.status === '종료') ? '대기중' : creator.status,
          avatarUrl: creator.avatarUrl,
          contactInfo: creator.contactInfo || '',
          loginId: creator.loginId || '',
          password: creator.password || '',
          managerName: creator.manager && creator.manager !== '담당자 없음' ? creator.manager : ''
      });
      setIsAddModalOpen(true);
      setActiveMenuId(null);
  };

  const handleSaveCreator = () => {
    if (!newCreatorData.name || !newCreatorData.platform || !newCreatorData.subscribers || !newCreatorData.category || !newCreatorData.contactInfo || !newCreatorData.password) {
        alert('필수 정보를 모두 입력해주세요.');
        return;
    }

    if (modalMode === 'create') {
        const newId = (creators.length + 1).toString();
        const newCreator: Creator = {
            id: newId,
            name: newCreatorData.name,
            platform: newCreatorData.platform,
            status: newCreatorData.status,
            subscribers: newCreatorData.subscribers,
            avatarUrl: newCreatorData.avatarUrl,
            coverUrl: '', 
            tags: [],
            category: newCreatorData.category,
            manager: newCreatorData.managerName || '담당자 없음', 
            channelName: newCreatorData.name + ' Channel',
            contactInfo: newCreatorData.contactInfo,
            contractStatus: 'Drafting',
            loginId: newCreatorData.loginId || newCreatorData.name.toLowerCase(),
            password: newCreatorData.password,
            managementStartDate: newCreatorData.managerName ? new Date().toISOString().split('T')[0] : undefined,
            managementEndDate: newCreatorData.managerName ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] : undefined
        };
        onUpdateCreators([...creators, newCreator]);
    } else if (modalMode === 'edit' && editingCreatorId) {
        const updatedCreators = creators.map(c => 
            c.id === editingCreatorId 
            ? {
                ...c,
                name: newCreatorData.name,
                platform: newCreatorData.platform,
                subscribers: newCreatorData.subscribers,
                category: newCreatorData.category,
                status: newCreatorData.status,
                avatarUrl: newCreatorData.avatarUrl,
                contactInfo: newCreatorData.contactInfo,
                loginId: newCreatorData.loginId,
                password: newCreatorData.password,
                manager: newCreatorData.managerName || '담당자 없음',
                managementStartDate: newCreatorData.managerName ? (c.managementStartDate || new Date().toISOString().split('T')[0]) : undefined,
                managementEndDate: newCreatorData.managerName ? (c.managementEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]) : undefined
              }
            : c
        );
        onUpdateCreators(updatedCreators);
    }

    setIsAddModalOpen(false);
  };

  const openAssignManagerModal = (creator: Creator, e: React.MouseEvent) => {
      e.stopPropagation();
      setAssignManagerData({ creatorId: creator.id, managerName: creator.manager || '담당자 없음' });
      setIsAssignManagerModalOpen(true);
  };

  const handleAssignManager = () => {
      const updatedCreators = creators.map(c => 
          c.id === assignManagerData.creatorId 
          ? { 
              ...c, 
              manager: assignManagerData.managerName,
              managementStartDate: assignManagerData.managerName !== '담당자 없음' ? new Date().toISOString().split('T')[0] : undefined,
              managementEndDate: assignManagerData.managerName !== '담당자 없음' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] : undefined
            } 
          : c
      );
      onUpdateCreators(updatedCreators);
      setIsAssignManagerModalOpen(false);
  };

  const handleContractSubmit = () => {
    alert('계약서가 성공적으로 등록되었습니다.');
    setIsContractModalOpen(false);
    setContractForm({ title: '', creatorName: '', startDate: '', endDate: '' });
    setContractFile(null);
  };

  return (
      <div className="flex-1 h-screen overflow-y-auto bg-white p-8">
          <div className="max-w-[1600px] mx-auto">
              <div className="text-xs text-gray-500 mb-2">HR 관리 / 크리에이터 관리</div>
              <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                       <Users size={24} className="text-gray-600"/>
                    </div>
                    <div>
                       <h1 className="text-xl font-bold text-gray-900">크리에이터 전체 관리 (Admin)</h1>
                       <p className="text-xs text-gray-500">소속 크리에이터의 계약, 성과 및 담당자를 관리합니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 border-b border-gray-200 mt-6">
                      <button onClick={() => setAdminTab('list')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${adminTab === 'list' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                         <Users size={16} /> 목록 관리
                      </button>
                      <button onClick={() => setAdminTab('contract')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${adminTab === 'contract' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                         <FileText size={16} /> 계약 관리
                      </button>
                      <button onClick={() => setAdminTab('health')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${adminTab === 'health' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                         <Activity size={16} /> 건강 관리
                      </button>
                  </div>
              </div>

              {adminTab === 'list' && (
                  <div className="animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                              <div className="relative">
                                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input type="text" placeholder="크리에이터 검색..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md w-64 focus:outline-none focus:border-gray-400 bg-gray-50/50"/>
                              </div>
                              <div className="h-4 w-px bg-gray-300 mx-2"></div>
                              <span className="text-xs text-gray-500 font-medium">총 {creators.length}명</span>
                          </div>
                          <button onClick={handleOpenAddModal} className="flex items-center gap-1 bg-[#00C471] hover:bg-[#00b065] text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-colors">
                              <Plus size={16} /> 등록
                          </button>
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-visible bg-white min-h-[400px]">
                          <table className="w-full text-left">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">크리에이터</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">채널 정보</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">연락처</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">담당 매니저</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">상태</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">관리</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {creators.map(creator => (
                                      <tr 
                                        key={creator.id} 
                                        className="hover:bg-gray-50 transition-colors group cursor-pointer relative"
                                        onClick={() => setSelectedCreator(creator)}
                                      >
                                          <td className="px-4 py-4">
                                              <div className="flex items-center gap-3">
                                                  {creator.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" /> : <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400"><User size={20} /></div>}
                                                  <div>
                                                      <div className="text-sm font-bold text-gray-900">{creator.name}</div>
                                                      <div className="text-[10px] text-gray-400">ID: {creator.loginId || creator.id}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="px-4 py-4">
                                              <div className="flex items-center gap-1.5 mb-0.5">
                                                  {renderPlatformIcon(creator.platform, 12)}
                                                  <span className="text-sm text-gray-700">{creator.channelName}</span>
                                              </div>
                                              <div className="text-[11px] text-gray-400">구독자 {creator.subscribers}</div>
                                          </td>
                                          <td className="px-4 py-4">
                                              {creator.contactInfo ? (
                                                  <span className="text-xs text-gray-600 font-medium">
                                                      {creator.contactInfo}
                                                  </span>
                                              ) : (
                                                  <span className="text-[10px] text-gray-400">-</span>
                                              )}
                                          </td>
                                          <td className="px-4 py-4">
                                              <div className="flex items-center justify-between group/manager">
                                                  <div>
                                                      <div className="text-sm text-gray-800">{creator.manager}</div>
                                                      {creator.manager && creator.manager !== '담당자 없음' ? (
                                                          <div className="text-[10px] text-[#00C471] flex items-center gap-0.5 mt-0.5">
                                                              <LinkIcon size={8} /> 
                                                              <span>연결됨</span>
                                                          </div>
                                                      ) : (
                                                          <div className="text-[10px] text-gray-400 mt-0.5">미배정</div>
                                                      )}
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="px-4 py-4">
                                              {creator.status === '활동중' && <span className="text-xs font-bold text-[#00C471]">활동중</span>}
                                              {creator.status === '대기중' && <span className="text-xs font-bold text-gray-500">대기중</span>}
                                              {creator.status === '종료' && <span className="text-xs font-bold text-red-500">종료</span>}
                                              {creator.status === '휴식중' && <span className="text-xs font-bold text-yellow-600">휴식중</span>}
                                          </td>
                                          <td className="px-4 py-4 text-center relative" onClick={e => e.stopPropagation()}>
                                              <button 
                                                onClick={() => setActiveMenuId(activeMenuId === creator.id ? null : creator.id)}
                                                className={`text-gray-400 hover:bg-gray-200 p-1 rounded transition-colors ${activeMenuId === creator.id ? 'bg-gray-200 text-gray-600' : ''}`}
                                              >
                                                <MoreHorizontal size={16} />
                                              </button>
                                              
                                              {/* Dropdown Menu */}
                                              {activeMenuId === creator.id && (
                                                  <div 
                                                    ref={menuRef}
                                                    className="absolute right-8 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-[fadeIn_0.1s]"
                                                  >
                                                      <button 
                                                        onClick={() => handleOpenEditModal(creator)}
                                                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                      >
                                                          <Edit3 size={12} /> 정보 수정
                                                      </button>
                                                      <button 
                                                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                      >
                                                          <Trash2 size={12} /> 삭제 (미구현)
                                                      </button>
                                                  </div>
                                              )}
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
              
              {adminTab === 'contract' && (
                  <ContractsView creators={creators} onOpenUploadModal={() => setIsContractModalOpen(true)} />
              )}

              {adminTab === 'health' && (
                   <CreatorHealthView 
                        creators={creators}
                        records={healthRecords}
                        onUpdateRecords={onUpdateHealthRecords}
                        logs={issueLogs}
                        onUpdateLogs={onUpdateIssueLogs}
                   />
              )}

              {/* ADMIN ADD/EDIT MODAL */}
              {isAddModalOpen && (
                  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">
                                    {modalMode === 'create' ? '새 크리에이터 등록 (Admin)' : '크리에이터 정보 수정'}
                                </h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Essential Info */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">기본 정보 (필수)</h4>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1.5">이름</label>
                                            <input 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                                placeholder="크리에이터 이름 입력"
                                                value={newCreatorData.name}
                                                onChange={e => setNewCreatorData({...newCreatorData, name: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1.5">플랫폼</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <PlatformOption platform="YouTube" selected={newCreatorData.platform === 'YouTube'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'YouTube'})} />
                                                <PlatformOption platform="Twitch" selected={newCreatorData.platform === 'Twitch'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'Twitch'})} />
                                                <PlatformOption platform="Chzzk" selected={newCreatorData.platform === 'Chzzk'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'Chzzk'})} />
                                                <PlatformOption platform="Instagram" selected={newCreatorData.platform === 'Instagram'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'Instagram'})} />
                                                <PlatformOption platform="TikTok" selected={newCreatorData.platform === 'TikTok'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'TikTok'})} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">구독자 수</label>
                                                <input 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                                    placeholder="예: 10.5만명"
                                                    value={newCreatorData.subscribers}
                                                    onChange={e => setNewCreatorData({...newCreatorData, subscribers: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">카테고리</label>
                                                <input 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                                    placeholder="예: 게임, 먹방"
                                                    value={newCreatorData.category}
                                                    onChange={e => setNewCreatorData({...newCreatorData, category: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1.5">기본 연락망</label>
                                            <input 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                                placeholder="전화번호 또는 이메일"
                                                value={newCreatorData.contactInfo}
                                                onChange={e => setNewCreatorData({...newCreatorData, contactInfo: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column: Account & Optional */}
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2 flex items-center gap-1">
                                                <Lock size={12}/> 계정 정보 (필수)
                                            </h4>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">로그인 ID</label>
                                                <input 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                                    placeholder="영문 소문자 권장"
                                                    value={newCreatorData.loginId}
                                                    onChange={e => setNewCreatorData({...newCreatorData, loginId: e.target.value})}
                                                    disabled={modalMode === 'edit'} // Lock ID on edit
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">비밀번호</label>
                                                <input 
                                                    type="password"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                                    placeholder="비밀번호 입력"
                                                    value={newCreatorData.password}
                                                    onChange={e => setNewCreatorData({...newCreatorData, password: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">추가 정보 (선택)</h4>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">담당 매니저 배정</label>
                                                <select 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                                                    value={newCreatorData.managerName}
                                                    onChange={e => setNewCreatorData({...newCreatorData, managerName: e.target.value})}
                                                >
                                                    <option value="">담당자 없음 (미배정)</option>
                                                    {employees.map(emp => (
                                                        <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept}/{emp.role})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">프로필 이미지 (파일)</label>
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        {newCreatorData.avatarUrl ? (
                                                            <img src={newCreatorData.avatarUrl} alt="preview" className="w-full h-full object-cover"/>
                                                        ) : (
                                                            <Upload size={18} className="text-gray-400"/>
                                                        )}
                                                    </div>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        className="hidden"
                                                        ref={fileInputRef}
                                                        onChange={handleImageUpload}
                                                    />
                                                    <button 
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
                                                    >
                                                        파일 선택
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">상태</label>
                                                <select 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                                                    value={newCreatorData.status}
                                                    onChange={e => setNewCreatorData({...newCreatorData, status: e.target.value as any})}
                                                >
                                                    <option value="대기중">대기중</option>
                                                    <option value="활동중">활동중</option>
                                                    <option value="휴식중">휴식중</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                                <button onClick={handleSaveCreator} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                                    {modalMode === 'create' ? '추가하기' : '수정 완료'}
                                </button>
                            </div>
                      </div>
                  </div>
               )}

               {/* CONTRACT UPLOAD MODAL */}
               {isContractModalOpen && (
                   <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsContractModalOpen(false)}>
                       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                           <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                               <h3 className="font-bold text-gray-900">새 계약서 등록</h3>
                               <button onClick={() => setIsContractModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                           </div>
                           <div className="p-6 space-y-4">
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 mb-1.5">계약서 제목</label>
                                   <input 
                                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                       placeholder="예: 겜돌이 표준 전속 계약서"
                                       value={contractForm.title}
                                       onChange={e => setContractForm({...contractForm, title: e.target.value})}
                                   />
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 mb-1.5">크리에이터 이름</label>
                                   <input 
                                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                       placeholder="크리에이터 이름 입력"
                                       value={contractForm.creatorName}
                                       onChange={e => setContractForm({...contractForm, creatorName: e.target.value})}
                                   />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1.5">계약 시작일</label>
                                       <input 
                                           type="date"
                                           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                           value={contractForm.startDate}
                                           onChange={e => setContractForm({...contractForm, startDate: e.target.value})}
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1.5">계약 종료일</label>
                                       <input 
                                           type="date"
                                           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                           value={contractForm.endDate}
                                           onChange={e => setContractForm({...contractForm, endDate: e.target.value})}
                                       />
                                   </div>
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 mb-1.5">계약서 파일 첨부</label>
                                   <div 
                                       className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                       onClick={() => fileContractInputRef.current?.click()}
                                   >
                                       <Upload size={20} className="mb-2"/>
                                       <span className="text-xs">{contractFile ? contractFile.name : '파일을 선택하세요 (PDF)'}</span>
                                       <input 
                                           type="file" 
                                           className="hidden" 
                                           ref={fileContractInputRef} 
                                           accept=".pdf,.doc,.docx"
                                           onChange={(e) => setContractFile(e.target.files?.[0] || null)}
                                       />
                                   </div>
                               </div>
                           </div>
                           <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                               <button onClick={() => setIsContractModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                               <button onClick={handleContractSubmit} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">등록하기</button>
                           </div>
                       </div>
                   </div>
               )}

               {/* ADMIN ASSIGN MANAGER MODAL */}
               {isAssignManagerModalOpen && (
                   <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAssignManagerModalOpen(false)}>
                       <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                           <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                               <h3 className="font-bold text-gray-900">담당 매니저 배정</h3>
                               <button onClick={() => setIsAssignManagerModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                           </div>
                           <div className="p-6">
                               <div className="text-sm text-gray-500 mb-4">
                                   선택한 크리에이터를 담당할 매니저를 선택해주세요.
                               </div>
                               <select 
                                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                   value={assignManagerData.managerName}
                                   onChange={e => setAssignManagerData({...assignManagerData, managerName: e.target.value})}
                               >
                                   <option value="">담당자 없음 (미배정)</option>
                                   {employees.map(emp => (
                                       <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept}/{emp.role})</option>
                                   ))}
                               </select>
                           </div>
                           <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                               <button onClick={() => setIsAssignManagerModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                               <button onClick={handleAssignManager} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-1">
                                   <Check size={14} /> 저장
                               </button>
                           </div>
                       </div>
                   </div>
               )}

                {/* Creator Detail Modal (Simple View) */}
                {selectedCreator && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedCreator(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div className="relative h-24 bg-gray-100">
                                {selectedCreator.coverUrl && <img src={selectedCreator.coverUrl} className="w-full h-full object-cover opacity-80" />}
                                <button onClick={() => setSelectedCreator(null)} className="absolute top-4 right-4 bg-white/50 hover:bg-white rounded-full p-1 transition-colors"><X size={20} /></button>
                            </div>
                            
                            <div className="px-6 pb-6 -mt-10 relative">
                                <div className="flex justify-between items-end mb-4">
                                    <div className="w-20 h-20 rounded-xl border-4 border-white shadow-md bg-white overflow-hidden">
                                        {selectedCreator.avatarUrl ? <img src={selectedCreator.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50"><User size={32}/></div>}
                                    </div>
                                    <div className="flex gap-2 mb-1">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${selectedCreator.status === '활동중' ? 'bg-green-50 text-[#00C471]' : 'bg-gray-100 text-gray-500'}`}>{selectedCreator.status}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {selectedCreator.name}
                                        {renderPlatformIcon(selectedCreator.platform, 18)}
                                    </h3>
                                    <p className="text-sm text-gray-500">{selectedCreator.channelName}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="text-xs text-gray-500 mb-1">구독자 수</div>
                                            <div className="font-bold text-gray-900">{selectedCreator.subscribers}</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="text-xs text-gray-500 mb-1">카테고리</div>
                                            <div className="font-bold text-gray-900">{selectedCreator.category || '-'}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">상세 정보</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                                <span className="text-gray-500 flex items-center gap-2"><Smartphone size={14}/> 연락처</span>
                                                <span className="text-gray-900 font-medium">{selectedCreator.contactInfo || '-'}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                                <span className="text-gray-500 flex items-center gap-2"><ShieldCheck size={14}/> 담당 매니저</span>
                                                <span className="text-gray-900 font-medium">{selectedCreator.manager || '미배정'}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                                <span className="text-gray-500 flex items-center gap-2"><FileText size={14}/> 계약 상태</span>
                                                <StatusBadge status={selectedCreator.contractStatus} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <h4 className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-1"><Lock size={12}/> 계정 정보 (Admin Only)</h4>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <div className="text-blue-500 mb-0.5">아이디</div>
                                                <div className="font-mono font-medium text-blue-900">{selectedCreator.loginId || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-blue-500 mb-0.5">패스워드</div>
                                                <div className="font-mono font-medium text-blue-900">{selectedCreator.password || '********'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
          </div>
      </div>
  );
};
