
import React, { useState } from 'react';
import { 
  Youtube, Twitch, Instagram, Smartphone, Monitor, ChevronLeft, ChevronRight, Plus,
  Stethoscope, ClipboardList, X, Activity, HeartPulse, AlertTriangle, BrainCircuit
} from 'lucide-react';

// --- Types ---
export type PlatformType = 'YouTube' | 'Instagram' | 'TikTok' | 'Twitch' | 'Chzzk';

export interface Creator {
  id: string;
  name: string;
  platform: PlatformType;
  status: '활동중' | '휴식중' | '계약만료' | '대기중' | '종료';
  subscribers: string;
  avatarUrl: string;
  coverUrl: string;
  tags: string[];
  category?: string;
  manager?: string;
  managementStartDate?: string; // 담당 시작일
  managementEndDate?: string;   // 담당 종료일
  channelName?: string;
  contactInfo?: string;
  contractStatus: 'Signed' | 'Drafting' | 'Expired' | 'None';
  // New fields for login credentials
  loginId?: string;
  password?: string;
}

export interface Task {
  id: string;
  title: string;
  status: '진행중' | '완료됨' | '대기중';
  assignee: string;
  creatorId?: string;
}

export interface CreatorEvent {
    id: string;
    creatorId: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'live' | 'content' | 'meeting' | 'other' | 'joint';
    content?: string;
    partnerCreators?: string[]; // List of Creator IDs for joint broadcasts
}

export interface AdProposal {
  id: string;
  creatorId: string;
  brandName: string;
  campaignTitle: string;
  budget: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
  description: string;
}

export interface HealthRecord {
    id: string;
    name: string;
    lastCheck: string;
    score: number; // 0-100
    result: string;
    status: string;
}

export interface IssueLog {
    id: number;
    creator: string;
    date: string;
    category: string;
    description: string;
    status: string;
}

// --- Mock Data ---
export const INITIAL_CREATORS: Creator[] = [
  {
    id: '1',
    name: '슈카월드',
    platform: 'YouTube',
    status: '활동중',
    subscribers: '300.0만명',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k2A0y_2y0aFhVj7V9VjB0jVjVjVjVjVjVjVjVj=s176-c-k-c0x00ffffff-no-rj',
    coverUrl: 'https://picsum.photos/id/1/1200/300',
    tags: ['경제', '토크', '지식'],
    category: '경제/시사',
    manager: '이채연',
    managementStartDate: '2023-01-01',
    managementEndDate: '2025-12-31',
    channelName: '슈카월드',
    contactInfo: '010-1234-5678',
    contractStatus: 'Signed',
    loginId: 'syuka',
    password: 'password'
  },
  {
    id: '2',
    name: '침착맨',
    platform: 'Twitch',
    status: '활동중',
    subscribers: '250.0만명',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    coverUrl: 'https://picsum.photos/id/64/1200/300',
    tags: ['토크', '게임'],
    category: '토크/게임',
    manager: '이채연',
    managementStartDate: '2023-03-15',
    managementEndDate: '2024-03-14',
    channelName: '침착맨',
    contactInfo: '010-9876-5432',
    contractStatus: 'Signed',
    loginId: 'chim',
    password: 'password'
  },
  {
    id: '3',
    name: '요리보고',
    platform: 'YouTube',
    status: '대기중',
    subscribers: '85.0만명',
    avatarUrl: 'https://picsum.photos/id/2/200/200',
    coverUrl: 'https://picsum.photos/id/2/1200/300',
    tags: ['요리', '레시피', '일상'],
    category: '요리',
    manager: '김유연',
    managementStartDate: '2024-01-01',
    managementEndDate: '2024-12-31',
    channelName: 'CookWithMe',
    contactInfo: 'cooking@email.com',
    contractStatus: 'Drafting'
  },
  {
    id: '4',
    name: '여행가제이',
    platform: 'Instagram',
    status: '활동중',
    subscribers: '45.0만명',
    avatarUrl: 'https://picsum.photos/id/3/200/200',
    coverUrl: 'https://picsum.photos/id/3/1200/300',
    tags: ['여행', '브이로그'],
    category: '여행',
    manager: '김유연',
    managementStartDate: '2023-06-01',
    managementEndDate: '2025-05-31',
    channelName: 'JayTrip',
    contactInfo: '010-5555-4444',
    contractStatus: 'Signed'
  },
  {
    id: '5',
    name: '겜돌이',
    platform: 'Twitch',
    status: '활동중',
    subscribers: '12.0만명',
    avatarUrl: 'https://picsum.photos/id/4/200/200',
    coverUrl: 'https://picsum.photos/id/4/1200/300',
    tags: ['게임'],
    category: '게임',
    manager: '이채연',
    managementStartDate: '2024-02-01',
    managementEndDate: '2025-02-01',
    channelName: 'GameZone',
    contactInfo: 'game@email.com',
    contractStatus: 'Signed',
    loginId: 'gamedol',
    password: '1234'
  },
  {
    id: '6',
    name: '치즈냥이',
    platform: 'Chzzk',
    status: '활동중',
    subscribers: '5.5만명',
    avatarUrl: 'https://picsum.photos/id/40/200/200',
    coverUrl: 'https://picsum.photos/id/40/1200/300',
    tags: ['게임', '소통'],
    category: '게임',
    manager: '김유연',
    managementStartDate: '2024-01-15',
    managementEndDate: '2024-07-15',
    channelName: 'CheeseCat',
    contactInfo: 'cat@email.com',
    contractStatus: 'None'
  },
  {
    id: '7',
    name: '철수',
    platform: 'YouTube',
    status: '활동중',
    subscribers: '50.0만명',
    avatarUrl: 'https://picsum.photos/id/100/200/200',
    coverUrl: 'https://picsum.photos/id/100/1200/300',
    tags: ['일상', '브이로그'],
    category: '일상',
    manager: '김유연',
    managementStartDate: '2024-01-01',
    managementEndDate: '2024-12-31',
    channelName: 'CheolsuVlog',
    contactInfo: 'cheolsu@email.com',
    contractStatus: 'Signed'
  }
];

export const INITIAL_TASKS: Record<string, Task[]> = {
  '1': [
    { id: 't1', title: '다음 주 콘텐츠 기획안 피드백', status: '진행중', assignee: '이채연' },
    { id: 't2', title: '유튜브 채널 아트 리뉴얼 시안 확인', status: '진행중', assignee: '이채연' },
    { id: 't3', title: '6월 정산서 발송', status: '진행중', assignee: '이채연' },
    { id: 't4', title: '구독자 이벤트 당첨자 취합', status: '완료됨', assignee: '박지성' },
    { id: 't5', title: '신규 굿즈 샘플 확인', status: '완료됨', assignee: '이채연' },
  ],
  '2': [
    { id: 't6', title: '밀키트 콜라보 미팅', status: '대기중', assignee: '최현석' },
  ]
};

export const INITIAL_EVENTS: CreatorEvent[] = [
    { id: 'e1', creatorId: '1', title: '라이브 방송', date: '2026-01-10', type: 'live', content: '저녁 8시 정규 라이브 방송입니다. 주제: 경제 뉴스 정리' },
    { id: 'e2', creatorId: '1', title: '유튜브 업로드', date: '2026-01-12', type: 'content', content: '편집본 업로드 예정. 썸네일 컨펌 필요.' },
    { id: 'e3', creatorId: '3', title: '광고 미팅', date: '2026-01-15', type: 'meeting', content: '주방용품 브랜드 A사 미팅 (강남역 2시)' },
    { id: 'e4', creatorId: '4', title: '출국 (일본)', date: '2026-01-20', type: 'other', content: '3박 4일 도쿄 브이로그 촬영 일정' },
    { id: 'e5', creatorId: '6', title: '정기 방송', date: '2026-01-05', type: 'live', content: '치지직 이적 후 첫 정기 방송' },
    { id: 'e6', creatorId: '1', title: '브랜드 미팅', date: '2026-01-22', type: 'meeting', content: '금융 앱 B사 연간 계약 논의' },
];

export const INITIAL_AD_PROPOSALS: AdProposal[] = [
    {
        id: 'ad-dummy-1',
        creatorId: '7',
        brandName: '테크월드',
        campaignTitle: '게이밍 마우스 G-100 리뷰',
        budget: '300만원',
        status: 'pending',
        requestDate: '2024-01-25',
        description: '신제품 게이밍 마우스 상세 리뷰 및 게임 플레이 시연 영상 1편.'
    },
    {
        id: 'ad-1',
        creatorId: '1',
        brandName: '삼성전자',
        campaignTitle: '갤럭시 S24 울트라 기능 리뷰 및 시연',
        budget: '2,500만원',
        status: 'pending',
        requestDate: '2024-01-20',
        description: '신제품 출시 기념 메인 기능(AI) 집중 리뷰 영상 제작 요청드립니다. 엠바고 준수 필수.'
    },
    {
        id: 'ad-2',
        creatorId: '1',
        brandName: '미래에셋증권',
        campaignTitle: '2024년 하반기 경제 전망 세미나',
        budget: '1,000만원',
        status: 'accepted',
        requestDate: '2024-01-15',
        description: '오프라인 세미나 연사 초청 및 유튜브 라이브 송출 건입니다.'
    },
    {
        id: 'ad-3',
        creatorId: '2',
        brandName: '넥슨',
        campaignTitle: '신작 게임 찍먹 플레이',
        budget: '1,500만원',
        status: 'pending',
        requestDate: '2024-01-21',
        description: '캐주얼하게 게임을 즐기는 모습을 담은 라이브 방송 2시간 진행 요청.'
    },
    {
        id: 'ad-4',
        creatorId: '4',
        brandName: '대한항공',
        campaignTitle: '취항지 홍보 브이로그 (유럽)',
        budget: '800만원 + 항공권',
        status: 'rejected',
        requestDate: '2024-01-10',
        description: '신규 취항지 홍보를 위한 여행 브이로그 2편 제작.'
    }
];

// --- Helper Functions ---
export const renderPlatformIcon = (platform: PlatformType, size: number = 16) => {
    switch (platform) {
        case 'YouTube': return <Youtube size={size} className="text-black" />;
        case 'Twitch': return <Twitch size={size} className="text-black" />;
        case 'Instagram': return <Instagram size={size} className="text-black" />;
        case 'TikTok': return <Smartphone size={size} className="text-black" />;
        case 'Chzzk': return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 11.5L15.5 2.5L13.5 10.5H21.5L11.5 21.5L13.5 11.5H5.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        );
        default: return <Monitor size={size} className="text-gray-500" />;
    }
};

export const PALETTE = [
    { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-200', dot: 'bg-gray-600' },
    { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-[#00C471]' },
    { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', dot: 'bg-blue-600' },
    { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-200', dot: 'bg-purple-600' },
];

export const getCreatorColorStyles = (id: string) => {
    const idx = parseInt(id) || 0;
    return PALETTE[idx % PALETTE.length];
};

// --- Shared Components ---
interface CalendarProps {
    events: CreatorEvent[];
    creatorsMap: Record<string, Creator>;
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onAddEvent: (date?: string) => void;
    onEventClick: (event: CreatorEvent) => void; 
    readOnly?: boolean;
}

export const CreatorCalendar: React.FC<CalendarProps> = ({ events, creatorsMap, currentDate, onDateChange, onAddEvent, onEventClick, readOnly = false }) => {
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };
    
    const goToToday = () => {
        onDateChange(new Date());
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-white border-r border-b border-gray-200"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = new Date().toISOString().split('T')[0] === dateStr;
        const dayEvents = events.filter(e => e.date === dateStr);

        days.push(
            <div key={d} className="min-h-[120px] bg-white border-r border-b border-gray-200 p-1 relative group hover:bg-gray-50 transition-colors">
                 {/* Date Header */}
                <div className="flex justify-between items-start mb-1 p-1">
                     <span 
                        className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-[4px]
                        ${isToday ? 'bg-[#00C471] text-white' : 'text-gray-500'}`}
                     >
                        {d}
                     </span>
                     {!readOnly && (
                         <button 
                             onClick={() => onAddEvent(dateStr)}
                             className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black transition-opacity p-0.5"
                         >
                             <Plus size={14} />
                         </button>
                     )}
                </div>
                
                {/* Events */}
                <div className="space-y-1 px-1">
                    {dayEvents.map(evt => {
                        const creator = creatorsMap[evt.creatorId];
                        const styles = creator ? getCreatorColorStyles(creator.id) : PALETTE[0];
                        
                        return (
                            <div 
                                key={evt.id} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick(evt);
                                }}
                                className={`
                                    px-2 py-1 rounded-[3px] text-xs flex justify-between items-center group/item cursor-pointer shadow-sm
                                    transition-all hover:brightness-95 border
                                    ${styles.bg} ${styles.text} ${styles.border}
                                `}
                            >
                                <div className="truncate font-medium flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`}></div>
                                    <span className="truncate">{creator?.name} - {evt.title}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button onClick={() => changeMonth(-1)} className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"><ChevronLeft size={18} /></button>
                        <span className="text-lg font-bold text-gray-800 min-w-[120px] text-center">
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"><ChevronRight size={18} /></button>
                    </div>
                    <button 
                        onClick={goToToday}
                        className="text-xs text-gray-500 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                    >
                        오늘
                    </button>
                </div>
                
                {/* Creator Legend */}
                <div className="flex gap-3 text-xs overflow-x-auto max-w-[500px] py-1 scrollbar-hide">
                     {Object.values(creatorsMap).map((c: Creator) => {
                         const style = getCreatorColorStyles(c.id);
                         return (
                             <div key={c.id} className="flex items-center gap-1 text-gray-600 shrink-0">
                                 <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                                 {c.name}
                             </div>
                         )
                     })}
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <div key={day} className={`py-2 text-center text-xs font-medium ${i === 0 ? 'text-[#00C471]' : 'text-gray-500'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7">
                {days}
            </div>
        </div>
    );
};

// Updated CreatorHealthView to accept props and sync state
interface CreatorHealthViewProps {
    creators: Creator[];
    records: HealthRecord[];
    onUpdateRecords: (records: HealthRecord[]) => void;
    logs: IssueLog[];
    onUpdateLogs: (logs: IssueLog[]) => void;
    readOnly?: boolean;
}

export const CreatorHealthView: React.FC<CreatorHealthViewProps> = ({ 
    creators, 
    records, 
    onUpdateRecords, 
    logs, 
    onUpdateLogs,
    readOnly = false
}) => {
    // Filter records to only show passed creators
    const creatorNames = creators.map(c => c.name);
    const filteredRecords = records.filter(r => creatorNames.includes(r.name));
    const filteredLogs = logs.filter(l => creatorNames.includes(l.creator));

    // Modal States
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

    // Form States
    const [newCheckup, setNewCheckup] = useState({
        creatorName: '',
        date: new Date().toISOString().split('T')[0],
        score: 80,
        result: '양호'
    });

    const [newIssue, setNewIssue] = useState({
        creatorName: '',
        date: new Date().toISOString().split('T')[0],
        category: '정상',
        description: '',
        status: '모니터링'
    });

    // Helper for Bar Color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-[#00C471]';
        if (score >= 50) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    const handleAddCheckup = () => {
        if (!newCheckup.creatorName) return alert('크리에이터를 선택해주세요.');
        const newRecord: HealthRecord = {
            id: Date.now().toString(),
            name: newCheckup.creatorName,
            lastCheck: newCheckup.date,
            score: newCheckup.score,
            result: newCheckup.result,
            status: '업데이트됨'
        };
        // Replace old record for same creator or add new
        const otherRecords = records.filter(r => r.name !== newCheckup.creatorName);
        onUpdateRecords([newRecord, ...otherRecords]);
        setIsCheckModalOpen(false);
    };

    const handleAddIssue = () => {
        if (!newIssue.creatorName || !newIssue.description) return alert('필수 정보를 입력해주세요.');
        const newLog: IssueLog = {
            id: Date.now(),
            creator: newIssue.creatorName,
            date: newIssue.date,
            category: newIssue.category,
            description: newIssue.description,
            status: newIssue.status
        };
        onUpdateLogs([newLog, ...logs]);
        setIsIssueModalOpen(false);
    };

    return (
        <div className="animate-[fadeIn_0.2s_ease-out] relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: General Health Checkup */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <Stethoscope size={20} className="text-[#00C471]" />
                                크리에이터 건강 현황
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">정기 건강 검진 및 의료 지원 기록입니다.</p>
                        </div>
                        {!readOnly && (
                            <button 
                                onClick={() => setIsCheckModalOpen(true)}
                                className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                            >
                                + 검진 기록 추가
                            </button>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">크리에이터</th>
                                    <th className="px-6 py-3">최근 검진일</th>
                                    <th className="px-6 py-3 w-48">종합 점수</th>
                                    <th className="px-6 py-3">판정</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredRecords.length > 0 ? filteredRecords.map(rec => (
                                    <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{rec.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{rec.lastCheck}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${getScoreColor(rec.score)}`} 
                                                        style={{ width: `${rec.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-700 w-8 text-right">{rec.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold ${
                                                rec.score >= 80 ? 'text-[#00C471]' : 
                                                rec.score >= 50 ? 'text-yellow-600' : 'text-red-500'
                                            }`}>
                                                {rec.result}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                                            등록된 건강 기록이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Depression Test Status (Renamed from Issue Log) */}
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <BrainCircuit size={20} className="text-gray-700" />
                                우울증 검사 현황
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">정기 정신 건강 검진 및 상담 기록</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredLogs.map(log => (
                            <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-gray-900">{log.creator}</span>
                                    <span className="text-xs text-gray-400">{log.date}</span>
                                </div>
                                <div className="mb-2">
                                    <span className={`text-xs px-1.5 py-0.5 rounded border mr-2 ${
                                        log.category.includes('정상') ? 'bg-green-50 text-green-700 border-green-100' :
                                        log.category.includes('경미') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        log.category.includes('중등') ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>{log.category}</span>
                                    <span className="text-sm text-gray-700">{log.description}</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className={`text-xs font-bold ${
                                        log.status === '진료중' || log.status === '상담중' ? 'text-yellow-600' :
                                        log.status === '휴식권고' || log.status === '치료필요' ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {filteredLogs.length === 0 && (
                            <div className="py-8 text-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                기록된 검사 내역이 없습니다.
                            </div>
                        )}
                        {!readOnly && (
                            <button 
                                onClick={() => setIsIssueModalOpen(true)}
                                className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                + 우울증 검사 기록 추가
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkup Modal */}
            {isCheckModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsCheckModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">건강 검진 기록 추가</h3>
                            <button onClick={() => setIsCheckModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">크리에이터</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newCheckup.creatorName}
                                    onChange={e => setNewCheckup({...newCheckup, creatorName: e.target.value})}
                                >
                                    <option value="">선택하세요</option>
                                    {creators.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">검진일</label>
                                <input 
                                    type="date" 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newCheckup.date}
                                    onChange={e => setNewCheckup({...newCheckup, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">종합 점수 (0~100)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="range" min="0" max="100" 
                                        className="flex-1 accent-[#00C471]"
                                        value={newCheckup.score}
                                        onChange={e => {
                                            const score = parseInt(e.target.value);
                                            let result = '양호';
                                            if (score < 50) result = '위험';
                                            else if (score < 80) result = '주의';
                                            setNewCheckup({...newCheckup, score, result});
                                        }}
                                    />
                                    <span className="text-sm font-bold w-8 text-right">{newCheckup.score}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">판정 결과</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newCheckup.result}
                                    onChange={e => setNewCheckup({...newCheckup, result: e.target.value})}
                                >
                                    <option value="양호">양호</option>
                                    <option value="주의">주의</option>
                                    <option value="위험">위험</option>
                                    <option value="재검필요">재검필요</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setIsCheckModalOpen(false)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">취소</button>
                            <button onClick={handleAddCheckup} className="px-3 py-1.5 bg-[#00C471] text-white rounded text-sm hover:bg-[#00b065]">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Depression Test Record Modal (Renamed from Issue Modal) */}
            {isIssueModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsIssueModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">우울증 검사 기록 추가</h3>
                            <button onClick={() => setIsIssueModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">크리에이터</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.creatorName}
                                    onChange={e => setNewIssue({...newIssue, creatorName: e.target.value})}
                                >
                                    <option value="">선택하세요</option>
                                    {creators.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">검사일</label>
                                <input 
                                    type="date" 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.date}
                                    onChange={e => setNewIssue({...newIssue, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">검사 결과 (단계)</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.category}
                                    onChange={e => setNewIssue({...newIssue, category: e.target.value})}
                                >
                                    <option value="정상">정상</option>
                                    <option value="경미">경미 (가벼운 우울)</option>
                                    <option value="중등도">중등도 (상담 권장)</option>
                                    <option value="심각">심각 (치료 필요)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">전문의 소견 / 비고</label>
                                <textarea 
                                    rows={3}
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm resize-none"
                                    placeholder="검사 결과에 대한 소견을 입력하세요"
                                    value={newIssue.description}
                                    onChange={e => setNewIssue({...newIssue, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">조치 상태</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.status}
                                    onChange={e => setNewIssue({...newIssue, status: e.target.value})}
                                >
                                    <option value="모니터링">모니터링</option>
                                    <option value="상담중">상담중</option>
                                    <option value="치료중">치료중</option>
                                    <option value="휴식권고">휴식권고</option>
                                    <option value="조치완료">조치완료</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setIsIssueModalOpen(false)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">취소</button>
                            <button onClick={handleAddIssue} className="px-3 py-1.5 bg-[#00C471] text-white rounded text-sm hover:bg-[#00b065]">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
