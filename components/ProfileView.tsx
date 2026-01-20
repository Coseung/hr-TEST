
import React, { useState, useRef } from 'react';
import { UserProfile, VacationLog } from '../types';
import { Bot, Pencil, UserCircle, Activity, Calendar, ChevronLeft, X, Mail, Hash, Briefcase, Building, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift, FileText, Upload, CheckCircle2, AlertCircle, Lock, HelpCircle, Camera, BellRing, ChevronRight, Download } from 'lucide-react';

interface ProfileViewProps {
    profile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
    readOnly?: boolean;
    onBack?: () => void;
    vacationLogs?: VacationLog[]; // Added prop
}

// Mock DB for Cover Images
const MOCK_COVER_IMAGES = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
];

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile, readOnly = false, onBack, vacationLogs = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('정보');
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  
  // Image Update State
  const [imageModalState, setImageModalState] = useState<{ isOpen: boolean; type: 'avatar' | 'cover' }>({ isOpen: false, type: 'cover' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Change State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Vacation Modal State
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [vacationForm, setVacationForm] = useState({
      type: '연차',
      startDate: '',
      endDate: '',
      reason: '',
      // Workation
      location: '', 
      emergencyContact: '', 
      workGoals: '', 
      handover: '',
      // Condolences (경조사)
      relationship: '',
      eventType: '',
      // Sick Leave (병가)
      symptoms: '',
      hospital: ''
  });

  // Health Upload State
  const [healthStatus, setHealthStatus] = useState('정상');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Health History State
  const [checkupHistory, setCheckupHistory] = useState([
      { id: 1, year: '2023', type: '일반 건강검진', date: '2023. 10. 15', result: '정상A' },
      { id: 2, year: '2022', type: '채용 건강검진', date: '2022. 01. 05', result: '정상B (경미한 소견)' },
  ]);

  const handleChange = (field: string, value: string) => {
    onUpdateProfile({
      ...profile,
      [field]: value
    });
  };

  const handlePasswordChange = () => {
      if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
          alert('모든 필드를 입력해주세요.');
          return;
      }
      if (passwordForm.new !== passwordForm.confirm) {
          alert('새 비밀번호가 일치하지 않습니다.');
          return;
      }
      // Here you would typically call an API to change the password
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsPasswordModalOpen(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleVacationSubmit = () => {
      if(!vacationForm.startDate || !vacationForm.endDate) {
          alert('날짜를 선택해주세요.');
          return;
      }

      // Validation per type
      if (vacationForm.type === '워케이션') {
          if (!vacationForm.location) return alert('워케이션 근무 장소를 입력해주세요.');
          if (!vacationForm.emergencyContact) return alert('비상 연락망을 입력해주세요.');
          if (!vacationForm.workGoals) return alert('업무 계획 및 목표를 입력해주세요.');
          if (!vacationForm.handover) return alert('업무 인계 사항을 입력해주세요.');
      } else if (vacationForm.type === '경조사') {
          if (!vacationForm.relationship) return alert('대상(관계)을 입력해주세요. (예: 본인, 부모, 형제 등)');
          if (!vacationForm.eventType) return alert('경조 내용을 입력해주세요. (예: 결혼, 칠순, 장례 등)');
      } else if (vacationForm.type === '병가') {
          if (!vacationForm.symptoms) return alert('증상 및 사유를 입력해주세요.');
          if (!vacationForm.hospital) return alert('진료 병원명을 입력해주세요.');
      }

      let message = `${vacationForm.type} 신청이 완료되었습니다.\n기간: ${vacationForm.startDate} ~ ${vacationForm.endDate}`;
      
      if (vacationForm.type === '워케이션') {
          message += `\n장소: ${vacationForm.location}`;
      } else if (vacationForm.type === '경조사') {
          message += `\n내용: ${vacationForm.relationship} ${vacationForm.eventType}`;
      } else if (vacationForm.type === '병가') {
          message += `\n사유: ${vacationForm.symptoms}`;
      }

      alert(message);
      setIsVacationModalOpen(false);
      
      // Reset Form
      setVacationForm({ 
          type: '연차', 
          startDate: '', 
          endDate: '', 
          reason: '', 
          location: '', 
          emergencyContact: '', 
          workGoals: '', 
          handover: '',
          relationship: '',
          eventType: '',
          symptoms: '',
          hospital: ''
      }); 
  };

  const handleHealthUpload = () => {
      if (!uploadedFile) {
          alert('검진 결과 PDF 파일을 업로드해주세요.');
          return;
      }

      // Add to history
      const today = new Date();
      const newRecord = {
          id: Date.now(),
          year: today.getFullYear().toString(),
          type: '정기 건강검진',
          date: `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`,
          result: healthStatus
      };

      setCheckupHistory([newRecord, ...checkupHistory]);

      alert('검진 결과가 성공적으로 업로드되었습니다.');
      setIsResultModalOpen(false);
      setUploadedFile(null);
      setHealthStatus('정상');
  };

  // Image Upload Handler (Avatar)
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdateProfile({ ...profile, avatarUrl: reader.result as string });
              setImageModalState({ ...imageModalState, isOpen: false });
          };
          reader.readAsDataURL(file);
      }
  };

  // Cover Select Handler
  const handleCoverSelect = (url: string) => {
      onUpdateProfile({ ...profile, coverUrl: url });
      setImageModalState({ ...imageModalState, isOpen: false });
  };

  // Hide Health tab if readOnly (viewing others)
  const tabs = readOnly ? ['정보'] : ['정보', '건강'];

  // Check for rejected vacation logs
  const rejectedLogs = vacationLogs.filter(log => log.name === profile.name && log.status === '반려됨');

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white relative animate-[fadeIn_0.3s_ease-out]">
      {onBack && (
        <div className="absolute top-4 left-4 z-20">
            <button 
                onClick={onBack}
                className="bg-white/90 backdrop-blur text-gray-600 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center gap-1 text-xs font-medium transition-colors"
            >
                <ChevronLeft size={14} /> 돌아가기
            </button>
        </div>
      )}
      
      {!readOnly && (
        <div className="absolute top-4 right-4 z-10">
            <button 
                onClick={() => setImageModalState({ isOpen: true, type: 'cover' })}
                className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 bg-white/80 backdrop-blur-sm flex items-center gap-1"
            >
                <Camera size={12} /> 커버 변경
            </button>
        </div>
      )}
      
      {/* Cover Image */}
      <div 
        className="h-48 bg-gray-50 w-full relative group cursor-pointer"
        onClick={() => !readOnly && setImageModalState({ isOpen: true, type: 'cover' })}
      >
         {profile.coverUrl ? (
             <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
         ) : (
             <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200"></div>
         )}
         {!readOnly && (
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                 <Camera size={24} />
             </div>
         )}
      </div>

      <div className="px-12 pb-20 max-w-[1600px] mx-auto">
        
        {/* Avatar - Clickable */}
        <div className="-mt-16 mb-6 relative z-10 inline-block group">
            <div 
                className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm cursor-pointer relative"
                onClick={() => !readOnly && setImageModalState({ isOpen: true, type: 'avatar' })}
            >
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                {!readOnly && (
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera size={20} />
                    </div>
                )}
            </div>
        </div>

        {/* Header Info */}
        <div className="mb-8">
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
           </div>
        </div>

        {/* Rejection Notification Alert */}
        {!readOnly && rejectedLogs.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-[pulse_2s_infinite]">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-800 mb-1">휴가 신청 반려 알림</h4>
                    <ul className="list-disc pl-4 text-xs text-red-700 space-y-1">
                        {rejectedLogs.map(log => (
                            <li key={log.id}>
                                <strong>{log.type}</strong> ({log.startDate} ~ {log.endDate}) 신청이 반려되었습니다.
                                {log.rejectionReason && <span className="block text-red-600/80 mt-0.5">사유: {log.rejectionReason}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
           <div className="flex gap-6">
              {tabs.map((tab) => (
                 <div 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm cursor-pointer transition-colors ${
                        activeTab === tab 
                        ? 'font-bold text-black border-b-2 border-black' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                 >
                    {tab}
                 </div>
              ))}
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* Left Column: Content Area */}
           <div className="flex-1 space-y-10 min-h-[400px]">
              
              {/* === INFORMATION TAB === */}
              {activeTab === '정보' && (
                 <>
                    {/* HR Info - Visible to Everyone */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-400">인사 정보</h3>
                        </div>
                        
                        <div className="space-y-5">
                            {/* Org */}
                            <div className="flex items-start">
                                <div className="w-6 text-gray-400 mr-4 mt-0.5"><Building size={16} /></div>
                                <div className="w-16 text-sm text-gray-500 font-medium">조직</div>
                                <div className="flex-1 text-sm text-gray-800">
                                    <span className="text-gray-400 mr-2">소속</span> {profile.org}
                                    {profile.rank.includes('팀장') && <span className="bg-gray-100 text-[10px] px-1 rounded ml-2">조직장</span>}
                                </div>
                            </div>
                            
                            {/* Job */}
                            <div className="flex items-start">
                                <div className="w-6 text-gray-400 mr-4 mt-0.5"><Briefcase size={16} /></div> 
                                <div className="w-16 text-sm text-gray-500 font-medium">직무</div>
                                <div className="flex-1 text-sm text-gray-800">
                                    <span className="text-gray-400 mr-2">수행 직무</span> {profile.job}
                                </div>
                            </div>

                            {/* Basic Info (Email, Nickname, ID) - Moved here */}
                            <div className="flex items-start">
                                <div className="w-6 text-gray-400 mr-4 mt-0.5"><UserCircle size={16} /></div> 
                                <div className="w-16 text-sm text-gray-500 font-medium">기본 정보</div>
                                <div className="flex-1 text-sm text-gray-800 space-y-2">
                                    <div className="flex">
                                        <span className="text-gray-400 inline-block w-20 shrink-0">닉네임</span> 
                                        <span>{profile.nickname}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-400 inline-block w-20 shrink-0">사내 메일</span> 
                                        <span>{profile.email}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-400 inline-block w-20 shrink-0">사번</span> 
                                        <span>{profile.employeeId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info - Visible to Self (!readOnly) OR ReadOnly View (Team View) - Adjusted Visibility */}
                    <div>
                        <div className="flex justify-between items-start mb-4 border-t border-gray-100 pt-8">
                            <h3 className="text-xs font-bold text-gray-400 mt-1">개인정보</h3>
                            {!readOnly && (
                                <div className="flex flex-col items-end gap-2">
                                    <button 
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`flex items-center gap-1 text-xs hover:text-gray-600 transition-colors ${isEditing ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
                                    >
                                        <Pencil size={12} /> {isEditing ? '저장' : '정보 수정'}
                                    </button>
                                    <button 
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Lock size={12} /> 비밀번호 변경
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-5">
                            {/* Name - Hidden in ReadOnly mode (Team View) */}
                            {!readOnly && (
                                <div className="flex items-start">
                                    <div className="w-6 text-gray-400 mr-4"><UserCircle size={18} /></div>
                                    <div className="w-16 text-sm text-gray-500 font-medium pt-1">이름</div>
                                    <div className="flex-1 text-sm text-gray-800">
                                        {isEditing ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-blue-100 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">본명</label>
                                                    <input 
                                                        value={profile.name} 
                                                        onChange={(e) => handleChange('name', e.target.value)}
                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 font-medium">영문 이름</label>
                                                    <input 
                                                        value={profile.engName} 
                                                        onChange={(e) => handleChange('engName', e.target.value)}
                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-1 animate-[fadeIn_0.2s_ease-out]">
                                                <span className="text-gray-400 mr-2">본명</span> {profile.name}
                                                <span className="mx-3 text-gray-400 mr-2">영문 이름</span> {profile.engName}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Contact (Personal Email & Phone) - Always visible */}
                            <div className="flex items-start">
                                <div className="w-6 text-gray-400 mr-4 pt-1"><Mail size={16} /></div>
                                <div className="w-16 text-sm text-gray-500 font-medium pt-1">연락처</div>
                                <div className="flex-1 text-sm text-gray-800">
                                    {isEditing && !readOnly ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-blue-100 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                                            <div>
                                                <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">개인 이메일</label>
                                                <input 
                                                    value={profile.personalEmail} 
                                                    onChange={(e) => handleChange('personalEmail', e.target.value)}
                                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 font-medium">휴대전화</label>
                                                <input 
                                                    value={profile.phone} 
                                                    onChange={(e) => handleChange('phone', e.target.value)}
                                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-1 animate-[fadeIn_0.2s_ease-out] space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 w-20 shrink-0">개인 이메일</span> {profile.personalEmail}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 w-20 shrink-0">휴대전화</span> {profile.phone}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Join Info - Hidden in ReadOnly mode (Team View) */}
                            {!readOnly && (
                                <div className="flex items-start">
                                    <div className="w-6 text-gray-400 mr-4 pt-1"><Calendar size={16} /></div>
                                    <div className="w-16 text-sm text-gray-500 font-medium pt-1">입사 정보</div>
                                    <div className="flex-1 text-sm text-gray-800">
                                        <div className="flex flex-wrap gap-y-2 py-1 animate-[fadeIn_0.2s_ease-out]">
                                            <span className="text-gray-400 mr-2">입사일</span> {profile.joinDate}
                                            <span className="ml-4 text-gray-400 mr-2">입사 유형</span> 경력
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </>
              )}

              {/* === HEALTH TAB (Redesigned) === */}
              {activeTab === '건강' && (
                 <div className="space-y-8 animate-[fadeIn_0.2s_ease-in-out]">
                    
                    {/* Notification Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded inline-block mb-3">
                                    대상자 알림
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    <span className="text-blue-600">{profile.name}</span>님, <br/>
                                    2024년 정기 건강검진 대상자입니다.
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    올해 12월 31일까지 일반 건강검진을 완료해야 합니다.<br/>
                                    검진 후 결과를 업로드하여 DB에 저장해주세요.
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-1"
                                        onClick={() => setIsResultModalOpen(true)}
                                    >
                                        <Upload size={16} /> 결과 제출하기
                                    </button>
                                </div>
                            </div>
                            <div className="hidden md:block p-4 bg-white/50 rounded-full border border-blue-100">
                                <BellRing className="text-blue-500" size={48} />
                            </div>
                        </div>
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    {/* History */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 px-1">
                            <Calendar size={16} className="text-gray-500"/> 지난 검진 이력
                        </h3>
                        <div className="space-y-3">
                            {checkupHistory.map((checkup, i) => (
                                <div key={checkup.id} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow bg-white group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-gray-900">{checkup.year}년 {checkup.type}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${checkup.result.includes('정상') || checkup.result.includes('양호') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                                                {checkup.result}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                            <span>{checkup.date}</span>
                                        </div>
                                    </div>
                                    <button className="text-gray-300 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="결과지 다운로드">
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}
           </div>

           {/* Right Column: Widgets */}
           <div className="w-full lg:w-[320px] space-y-4 shrink-0">
              {/* Vacation Card */}
              <div className="bg-[#F9F9F9] rounded-xl p-5 border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-800">휴가 사용 현황</h3>
                    {!readOnly && (
                        <button 
                            onClick={() => setIsVacationModalOpen(true)}
                            className="bg-white border border-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-50 shadow-sm"
                        >
                            휴가 신청
                        </button>
                    )}
                 </div>
                 <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">12.5</span>
                    <span className="text-sm text-gray-500 ml-1">일 남음</span>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>연차</span>
                          <span>2.5/15</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          {/* Changed from bg-gray-300 to bg-green-500 */}
                          <div className="h-full bg-green-500 w-[16%]"></div>
                       </div>
                    </div>
                    {/* Removed Monthly Leave (월차) Section */}
                    <div>
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>반차</span>
                          <span>2회</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 w-[40%]"></div>
                       </div>
                    </div>
                 </div>
              </div>
              {/* Work Time Card Removed */}
           </div>
        </div>
      </div>

      {/* Image Update Modal */}
      {imageModalState.isOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setImageModalState({ ...imageModalState, isOpen: false })}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-900">
                          {imageModalState.type === 'cover' ? '커버 이미지 변경' : '프로필 사진 변경'}
                      </h3>
                      <button onClick={() => setImageModalState({ ...imageModalState, isOpen: false })} className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100">
                          <X size={20}/>
                      </button>
                  </div>
                  <div className="p-6">
                      {imageModalState.type === 'cover' ? (
                          <div className="grid grid-cols-2 gap-3">
                              {MOCK_COVER_IMAGES.map((url, i) => (
                                  <div 
                                    key={i}
                                    onClick={() => handleCoverSelect(url)}
                                    className="aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all hover:opacity-90"
                                  >
                                      <img src={url} alt={`Cover ${i}`} className="w-full h-full object-cover" />
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                              <div className="w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden mb-6 bg-gray-50">
                                  <img src={profile.avatarUrl} alt="Current" className="w-full h-full object-cover" />
                              </div>
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                              >
                                  <Upload size={16} /> 사진 업로드
                              </button>
                              <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  ref={fileInputRef} 
                                  onChange={handleAvatarUpload}
                              />
                              <p className="text-xs text-gray-400 mt-3">JPG, PNG 파일 (최대 5MB)</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setIsPasswordModalOpen(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-900">비밀번호 변경</h3>
                      <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100">
                          <X size={20}/>
                      </button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">현재 비밀번호</label>
                          <input 
                              type="password"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                              placeholder="현재 비밀번호 입력"
                              value={passwordForm.current}
                              onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">새 비밀번호</label>
                          <input 
                              type="password"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                              placeholder="새 비밀번호 입력"
                              value={passwordForm.new}
                              onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">새 비밀번호 확인</label>
                          <input 
                              type="password"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                              placeholder="새 비밀번호 재입력"
                              value={passwordForm.confirm}
                              onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                      <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                      <button onClick={handlePasswordChange} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm">
                          변경하기
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Health Result Upload/Edit Modal */}
      {isResultModalOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setIsResultModalOpen(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-900">검진 결과 등록</h3>
                      <button onClick={() => setIsResultModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded p-1">
                          <X size={20}/>
                      </button>
                  </div>
                  <div className="p-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                          <FileText size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                              <h4 className="font-bold text-blue-800 text-sm">결과지 업로드 안내</h4>
                              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                  병원에서 발급받은 건강검진 결과표(PDF)를 업로드하여 DB에 저장합니다.
                              </p>
                          </div>
                      </div>

                      <div className="space-y-5">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">종합 판정 상태 선택</label>
                              <select 
                                  value={healthStatus}
                                  onChange={(e) => setHealthStatus(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                              >
                                  <option value="정상">정상 (A/B)</option>
                                  <option value="주의">주의 (식생활 습관 개선 필요)</option>
                                  <option value="위험">위험 (질환 의심/치료 필요)</option>
                                  <option value="재검">재검 필요</option>
                              </select>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">결과 파일 업로드</label>
                              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                                  <input 
                                      id="file-upload" 
                                      type="file" 
                                      className="hidden" 
                                      accept=".pdf"
                                      onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                                  />
                                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                                      <Upload size={24} />
                                  </div>
                                  {uploadedFile ? (
                                      <div>
                                          <p className="text-sm font-bold text-gray-800">{uploadedFile.name}</p>
                                          <p className="text-xs text-green-600 mt-1">파일이 선택되었습니다.</p>
                                      </div>
                                  ) : (
                                      <div>
                                          <p className="text-sm font-bold text-gray-700">PDF 파일을 드래그하거나 클릭하여 업로드</p>
                                          <p className="text-xs text-gray-400 mt-1">최대 10MB</p>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-4 mt-6">
                          <span>검진일: 2023. 10. 15</span>
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                      <button onClick={() => setIsResultModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                      <button onClick={handleHealthUpload} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm flex items-center gap-1">
                          <CheckCircle2 size={14} /> 저장하기
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Vacation Request Modal */}
      {isVacationModalOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setIsVacationModalOpen(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 bg-white z-10">
                      <h3 className="font-bold text-gray-900">휴가 신청</h3>
                      <button onClick={() => setIsVacationModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100">
                          <X size={20}/>
                      </button>
                  </div>
                  <div className="p-6 space-y-5">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">휴가 종류</label>
                          <div className="grid grid-cols-3 gap-2">
                              {['연차', '반차', '경조사', '병가', '워케이션'].map(type => (
                                  <button
                                      key={type}
                                      onClick={() => setVacationForm({
                                          ...vacationForm, 
                                          type, 
                                          // Reset other specific fields when switching
                                          location: type === '워케이션' ? vacationForm.location : '',
                                          emergencyContact: type === '워케이션' ? vacationForm.emergencyContact : '',
                                          workGoals: type === '워케이션' ? vacationForm.workGoals : '',
                                          handover: type === '워케이션' ? vacationForm.handover : '',
                                          relationship: type === '경조사' ? vacationForm.relationship : '',
                                          eventType: type === '경조사' ? vacationForm.eventType : '',
                                          symptoms: type === '병가' ? vacationForm.symptoms : '',
                                          hospital: type === '병가' ? vacationForm.hospital : ''
                                      })}
                                      className={`
                                          py-2 rounded-lg text-sm border transition-all
                                          ${vacationForm.type === type 
                                              ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium shadow-sm' 
                                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                                      `}
                                  >
                                      {type}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Workation Specific Fields */}
                      {vacationForm.type === '워케이션' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
                              <h4 className="text-xs font-bold text-blue-700 mb-2">워케이션 필수 입력 사항</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                          <MapPin size={12} /> 근무 장소
                                      </label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                          placeholder="예: 제주 오피스"
                                          value={vacationForm.location}
                                          onChange={e => setVacationForm({...vacationForm, location: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                          <Phone size={12} /> 비상 연락망
                                      </label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                          placeholder="예: 010-0000-0000"
                                          value={vacationForm.emergencyContact}
                                          onChange={e => setVacationForm({...vacationForm, emergencyContact: e.target.value})}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                      <Target size={12} /> 업무 계획 및 목표
                                  </label>
                                  <textarea 
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none bg-white"
                                      rows={3}
                                      placeholder="워케이션 기간 동안 달성할 주요 업무 목표와 일정을 상세히 기재해주세요."
                                      value={vacationForm.workGoals}
                                      onChange={e => setVacationForm({...vacationForm, workGoals: e.target.value})}
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                      <ClipboardList size={12} /> 업무 인계 사항 (비상 시)
                                  </label>
                                  <textarea 
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none bg-white"
                                      rows={2}
                                      placeholder="부재 중 이슈 발생 시 대응할 담당자 및 인계 사항을 입력해주세요."
                                      value={vacationForm.handover}
                                      onChange={e => setVacationForm({...vacationForm, handover: e.target.value})}
                                  />
                              </div>
                          </div>
                      )}

                      {/* Condolences Specific Fields */}
                      {vacationForm.type === '경조사' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4 p-4 bg-purple-50/30 rounded-lg border border-purple-100">
                              <h4 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">
                                  <Gift size={14} /> 경조사 필수 입력 사항
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">대상 (관계)</label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors bg-white"
                                          placeholder="예: 본인, 부모, 형제 등"
                                          value={vacationForm.relationship}
                                          onChange={e => setVacationForm({...vacationForm, relationship: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">경조 내용</label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors bg-white"
                                          placeholder="예: 결혼, 칠순, 장례 등"
                                          value={vacationForm.eventType}
                                          onChange={e => setVacationForm({...vacationForm, eventType: e.target.value})}
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Sick Leave Specific Fields */}
                      {vacationForm.type === '병가' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4 p-4 bg-green-50/30 rounded-lg border border-green-100">
                              <h4 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                                  <Stethoscope size={14} /> 병가 필수 입력 사항
                              </h4>
                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5">증상 및 사유</label>
                                  <input 
                                      type="text"
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors bg-white"
                                      placeholder="예: 독감으로 인한 고열, 입원 치료 등"
                                      value={vacationForm.symptoms}
                                      onChange={e => setVacationForm({...vacationForm, symptoms: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5">진료/입원 병원명</label>
                                  <input 
                                      type="text"
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors bg-white"
                                      placeholder="예: 강남세브란스병원"
                                      value={vacationForm.hospital}
                                      onChange={e => setVacationForm({...vacationForm, hospital: e.target.value})}
                                  />
                              </div>
                          </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">시작일</label>
                              <input 
                                  type="date"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                  value={vacationForm.startDate}
                                  onChange={e => setVacationForm({...vacationForm, startDate: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">종료일</label>
                              <input 
                                  type="date"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                  value={vacationForm.endDate}
                                  onChange={e => setVacationForm({...vacationForm, endDate: e.target.value})}
                              />
                          </div>
                      </div>
                      
                      {/* Standard Reason Field (Hide if Workation has specific fields, or keep as optional note) */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">
                              {['워케이션', '경조사', '병가'].includes(vacationForm.type) ? '기타 비고 (선택)' : '사유 (선택)'}
                          </label>
                          <textarea 
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                              rows={2}
                              placeholder={['워케이션', '경조사', '병가'].includes(vacationForm.type) ? "추가 요청사항이 있다면 입력해주세요." : "휴가 사유를 입력하세요 (선택)"}
                              value={vacationForm.reason}
                              onChange={e => setVacationForm({...vacationForm, reason: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0">
                      <button onClick={() => setIsVacationModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                      <button onClick={handleVacationSubmit} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm">
                          신청하기
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
