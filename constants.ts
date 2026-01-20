
import { User, UserRole, UserProfile, VacationLog, Employee, Team, HealthRecord } from './types';

// Updated IDs to match Employee Records
export const USERS: Record<string, User> = {
  employee: {
    id: 'LP125', // Sophia Lee's ID
    username: 'qwer',
    name: '이채연',
    role: UserRole.EMPLOYEE,
    jobTitle: 'Product Owner',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    status: '재직중',
    tags: ['플랫폼팀', '재직중']
  },
  admin: {
    id: 'HR001', // Jenny Kim's ID
    username: 'admin',
    name: '김유연',
    role: UserRole.ADMIN,
    jobTitle: 'Senior HR Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: '재직중',
    tags: ['인사팀', '재직중']
  },
  creator: {
    id: '5', // Matches '겜돌이' ID in INITIAL_CREATORS
    username: 'gamedol',
    name: '겜돌이',
    role: UserRole.CREATOR,
    jobTitle: 'Creator',
    avatarUrl: 'https://picsum.photos/id/4/200/200',
    status: '재직중',
    tags: ['크리에이터', '계약중']
  }
};

export const EMPLOYEE_PROFILE_DATA: UserProfile = {
  name: '이채연',
  engName: 'Sophia Lee', // Synced
  nickname: '소피아',
  email: 'sophia@company.com',
  personalEmail: 'sophia@gmail.com',
  phone: '010-9876-5432',
  employeeId: 'LP125',
  joinDate: '2022년 01월 10일',
  tenure: '2년 1개월 재직',
  groupJoinDate: '2022년 01월 10일',
  org: 'Platform Squad',
  job: 'Product Owner',
  rank: '매니저 / Level 3',
  avatarUrl: 'https://picsum.photos/id/64/400/400',
  coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
};

export const ADMIN_PROFILE_DATA: UserProfile = {
  name: '김유연',
  engName: 'Jenny Kim', // Synced
  nickname: '제니',
  email: 'jenny@company.com',
  personalEmail: 'jenny@naver.com',
  phone: '010-1234-5678',
  employeeId: 'HR001',
  joinDate: '2019년 03월 15일',
  tenure: '5년 재직',
  groupJoinDate: '2019년 03월 15일',
  org: 'People & Culture',
  job: 'Senior HR Manager',
  rank: '팀장 / Level 5',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
};

export const INITIAL_VACATION_LOGS: VacationLog[] = [
  // 대기중 (Pending) - To be approved/rejected
  { id: 101, name: '손흥민', type: '연차', startDate: '2026-02-14', endDate: '2026-02-15', days: 2, status: '대기중', reason: '개인 사정으로 인한 휴가' },
  { id: 102, name: '김민재', type: '워케이션', startDate: '2026-02-20', endDate: '2026-02-24', days: 5, status: '대기중', reason: '제주도 워케이션', location: '제주 오피스', emergencyContact: '010-1111-2222', workGoals: '백엔드 마이그레이션 기획' },
  { id: 103, name: '박지성', type: '반차', startDate: '2026-02-10', endDate: '2026-02-10', days: 0.5, status: '대기중', reason: '오후 병원 진료' },
  { id: 104, name: '이강인', type: '경조사', startDate: '2026-02-18', endDate: '2026-02-18', days: 1, status: '대기중', reason: '사촌 결혼식', relationship: '사촌', eventType: '결혼' },
  
  // 승인됨 (Approved) - Future & Recent
  { id: 201, name: '이채연', type: '연차', startDate: '2026-01-20', endDate: '2026-01-22', days: 3, status: '승인됨', reason: '겨울 가족 여행' },
  { id: 202, name: '김유연', type: '워케이션', startDate: '2026-01-15', endDate: '2026-01-17', days: 3, status: '승인됨', reason: '부산 워케이션', location: '부산 공유오피스' },
  { id: 203, name: '박지성', type: '병가', startDate: '2026-01-05', endDate: '2026-01-07', days: 3, status: '승인됨', reason: '독감', symptoms: '고열 및 근육통', hospital: '서울대병원' },
  { id: 204, name: '손흥민', type: '반차', startDate: '2026-01-12', endDate: '2026-01-12', days: 0.5, status: '승인됨', reason: '은행 업무' },
  
  // 반려됨 (Rejected)
  { id: 301, name: '이강인', type: '워케이션', startDate: '2026-01-08', endDate: '2026-01-12', days: 5, status: '반려됨', reason: '강릉 워케이션', rejectionReason: '해당 기간 팀 내 주요 프로젝트 런칭 일정과 겹쳐 부재가 불가능합니다.' },
  { id: 302, name: '김민재', type: '연차', startDate: '2025-12-24', endDate: '2025-12-31', days: 6, status: '반려됨', reason: '연말 휴가', rejectionReason: '연말 서버 트래픽 대응 인원 부족으로 인해 일정 조정이 필요합니다.' },
  
  // 사용완료 (Used/Archived) - Past
  { id: 401, name: '김유연', type: '연차', startDate: '2025-12-20', endDate: '2025-12-22', days: 3, status: '사용완료', reason: '크리스마스 휴가' },
  { id: 402, name: '이채연', type: '병가', startDate: '2025-11-10', endDate: '2025-11-10', days: 1, status: '사용완료', reason: '장염', symptoms: '복통', hospital: '강남내과' },
  { id: 403, name: '박지성', type: '반차', startDate: '2025-10-15', endDate: '2025-10-15', days: 0.5, status: '사용완료', reason: '개인 사정' },
  { id: 404, name: '손흥민', type: '경조사', startDate: '2025-09-01', endDate: '2025-09-03', days: 3, status: '사용완료', reason: '조부상', relationship: '조부', eventType: '장례' },
  { id: 405, name: '이채연', type: '연차', startDate: '2025-08-01', endDate: '2025-08-05', days: 5, status: '사용완료', reason: '여름 휴가' },
];

// --- Shared Data for HR Dashboard and Team View ---

export const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: 'HR001', name: '김유연', engName: 'Jenny Kim', dept: 'People & Culture', role: 'Senior Manager', 
    workStatus: '출근', clockInTime: '08:55', email: 'jenny@company.com', phone: '010-1234-5678', 
    joinDate: '2019-03-15', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    nickname: '제니', rank: '팀장 / Level 5'
  },
  { 
    id: 'LP125', name: '이채연', engName: 'Sophia Lee', dept: 'Platform Squad', role: 'Product Owner', 
    workStatus: '출근', clockInTime: '09:10', email: 'sophia@company.com', phone: '010-9876-5432', 
    joinDate: '2022-01-10', avatarUrl: 'https://picsum.photos/id/64/200/200',
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    nickname: '소피아', rank: '매니저 / Level 3'
  },
  { 
    id: 'DV022', name: '박지성', engName: 'Jisung Park', dept: 'Engineering', role: 'Frontend Dev', 
    workStatus: '휴가', email: 'park@company.com', phone: '010-1111-2222', 
    joinDate: '2021-05-20', avatarUrl: 'https://picsum.photos/id/10/200/200',
    coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    nickname: '지성', rank: '시니어 / Level 4'
  },
  { 
    id: 'DV023', name: '손흥민', engName: 'Sonny', dept: 'Engineering', role: 'Backend Dev', 
    workStatus: '퇴근', email: 'son@company.com', phone: '010-3333-4444', 
    joinDate: '2021-06-01', avatarUrl: 'https://picsum.photos/id/55/200/200',
    coverUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    nickname: '쏘니', rank: '시니어 / Level 4'
  },
  { 
    id: 'MK005', name: '이강인', engName: 'Kangin Lee', dept: 'Marketing', role: 'Marketer', 
    workStatus: '병가', email: 'lee@company.com', phone: '010-5555-6666', 
    joinDate: '2023-01-01', avatarUrl: 'https://picsum.photos/id/33/200/200',
    coverUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    nickname: '강인', rank: '주니어 / Level 2'
  },
  { 
    id: 'DV024', name: '김민재', engName: 'Minjae Kim', dept: 'Engineering', role: 'DevOps', 
    workStatus: '출근', clockInTime: '09:30', email: 'kim@company.com', phone: '010-7777-8888', 
    joinDate: '2022-08-15', avatarUrl: 'https://picsum.photos/id/100/200/200',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    nickname: '몬스터', rank: '매니저 / Level 3'
  },
];

export const INITIAL_TEAMS: Team[] = [
    { id: 't1', name: 'Platform Squad', description: '핵심 서비스 플랫폼 개발 및 운영', leaderId: 'LP125', memberIds: ['LP125', 'DV022', 'DV023', 'DV024'] },
    { id: 't2', name: 'People & Culture', description: '인사, 조직문화, 채용 관리', leaderId: 'HR001', memberIds: ['HR001'] },
    { id: 't3', name: 'Marketing', description: '브랜드 마케팅 및 퍼포먼스 마케팅', leaderId: '', memberIds: ['MK005'] },
];

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  { id: 1, name: '김유연', lastCheck: '2023-10-15', hospital: 'KMI 여의도', result: '정상 (양호)', nextCheck: '2024-10-15', bp: '120/80', sugar: '95', chol: '180', bmi: '22.5' },
  { id: 2, name: '이채연', lastCheck: '2023-11-20', hospital: '강북삼성병원', result: '정상 (경미)', nextCheck: '2024-11-20', bp: '130/85', sugar: '100', chol: '210', bmi: '24.0' },
  { id: 3, name: '박지성', lastCheck: '2023-09-10', hospital: '서울대병원', result: '유소견 (주의)', nextCheck: '2024-03-10', bp: '145/95', sugar: '110', chol: '240', bmi: '28.5' },
  { id: 4, name: '손흥민', lastCheck: '-', hospital: '-', result: '미수검', nextCheck: '2024-02-28', bp: '-', sugar: '-', chol: '-', bmi: '-' },
  { id: 5, name: '이강인', lastCheck: '-', hospital: '-', result: '미수검', nextCheck: '2024-03-15', bp: '-', sugar: '-', chol: '-', bmi: '-' },
];
