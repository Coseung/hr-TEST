import React, { useState } from 'react';
import { Search, Phone, Building, Users, ChevronRight, X, User } from 'lucide-react';

// Types
interface OrgMember {
  id: string;
  name: string;
  engName: string;
  role: string;
  dept: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: '재직중' | '휴가' | '출장' | '외근';
  joinDate: string;
}

interface Department {
    id: string;
    name: string;
    phone: string;
    description: string;
    color: string;
}

// MCN Dummy Data - Expanded
const ORG_MEMBERS: OrgMember[] = [
  // Executive
  {
    id: 'E001', name: '김대표', engName: 'CEO Kim', role: 'CEO (대표이사)', dept: 'Executive',
    email: 'ceo@mcn.com', phone: '010-1111-1111', status: '재직중', joinDate: '2019-01-01',
    avatarUrl: 'https://ui-avatars.com/api/?name=Kim+CEO&background=1e293b&color=fff'
  },
  {
    id: 'E002', name: '이부사장', engName: 'VP Lee', role: 'CSO (전략총괄)', dept: 'Executive',
    email: 'vp.lee@mcn.com', phone: '010-1111-2222', status: '출장', joinDate: '2019-02-01',
    avatarUrl: 'https://ui-avatars.com/api/?name=Lee+VP&background=334155&color=fff'
  },

  // Business Div
  {
    id: 'M001', name: '박이사', engName: 'Park Director', role: 'MCN 사업본부장', dept: 'Business Div',
    email: 'park@mcn.com', phone: '010-2222-2222', status: '재직중', joinDate: '2019-03-15',
    avatarUrl: 'https://ui-avatars.com/api/?name=Park+Director&background=2563eb&color=fff'
  },
  {
    id: 'M002', name: '정팀장', engName: 'Jung Lead', role: '제휴사업 팀장', dept: 'Business Div',
    email: 'jung.biz@mcn.com', phone: '010-2222-3333', status: '외근', joinDate: '2020-05-10',
  },
  {
    id: 'M003', name: '강사원', engName: 'Kang Staff', role: '사업개발 매니저', dept: 'Business Div',
    email: 'kang.biz@mcn.com', phone: '010-2222-4444', status: '재직중', joinDate: '2023-01-05',
  },

  // Creator Mgmt
  {
    id: 'T001', name: '최팀장', engName: 'Choi Lead', role: '매니지먼트 팀장', dept: 'Creator Mgmt',
    email: 'choi@mcn.com', phone: '010-3333-3333', status: '출장', joinDate: '2020-01-10',
    avatarUrl: 'https://ui-avatars.com/api/?name=Choi+Lead&background=10b981&color=fff'
  },
  {
    id: 'T002', name: '이매니저', engName: 'Lee Manager', role: '시니어 매니저', dept: 'Creator Mgmt',
    email: 'lee@mcn.com', phone: '010-4444-4444', status: '재직중', joinDate: '2021-05-20',
    avatarUrl: 'https://ui-avatars.com/api/?name=Lee+Manager&background=random'
  },
  {
    id: 'T003', name: '김매니저', engName: 'Kim Manager', role: '주니어 매니저', dept: 'Creator Mgmt',
    email: 'kim.mgr@mcn.com', phone: '010-4444-5555', status: '재직중', joinDate: '2023-02-01'
  },
  {
    id: 'T004', name: '박신입', engName: 'Park Junior', role: '어시스턴트 매니저', dept: 'Creator Mgmt',
    email: 'park.jr@mcn.com', phone: '010-4444-6666', status: '재직중', joinDate: '2024-01-02'
  },
  {
    id: 'T005', name: '윤케어', engName: 'Yoon Care', role: '크리에이터 케어', dept: 'Creator Mgmt',
    email: 'yoon.care@mcn.com', phone: '010-4444-7777', status: '휴가', joinDate: '2023-06-15'
  },

  // Production
  {
    id: 'P001', name: '정PD', engName: 'Jung PD', role: '콘텐츠 제작 팀장', dept: 'Production',
    email: 'jung@mcn.com', phone: '010-5555-5555', status: '재직중', joinDate: '2020-06-01',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jung+PD&background=a855f7&color=fff'
  },
  {
    id: 'P002', name: '강에딧', engName: 'Kang Editor', role: '영상 편집자', dept: 'Production',
    email: 'kang@mcn.com', phone: '010-6666-6666', status: '휴가', joinDate: '2022-02-15'
  },
  {
    id: 'P003', name: '송썸네일', engName: 'Song Designer', role: '디자이너', dept: 'Production',
    email: 'song@mcn.com', phone: '010-7777-7777', status: '재직중', joinDate: '2022-08-01'
  },
  {
    id: 'P004', name: '윤작가', engName: 'Yoon Writer', role: '구성 작가', dept: 'Production',
    email: 'yoon@mcn.com', phone: '010-1212-3434', status: '재직중', joinDate: '2021-11-11'
  },
  {
    id: 'P005', name: '한촬영', engName: 'Han Camera', role: '촬영 감독', dept: 'Production',
    email: 'han.cam@mcn.com', phone: '010-5555-1234', status: '외근', joinDate: '2021-03-01'
  },
  {
    id: 'P006', name: '오모션', engName: 'Oh Motion', role: '모션 그래픽', dept: 'Production',
    email: 'oh.motion@mcn.com', phone: '010-5555-5678', status: '재직중', joinDate: '2022-09-01'
  },

  // Marketing
  {
    id: 'MK001', name: '한마케터', engName: 'Han Marketer', role: '브랜드 마케터', dept: 'Marketing',
    email: 'han@mcn.com', phone: '010-8888-8888', status: '재직중', joinDate: '2023-01-10',
    avatarUrl: 'https://ui-avatars.com/api/?name=Han+Marketer&background=f97316&color=fff'
  },
  {
    id: 'MK002', name: '서퍼포', engName: 'Seo Performance', role: '퍼포먼스 마케터', dept: 'Marketing',
    email: 'seo.ad@mcn.com', phone: '010-8888-1212', status: '재직중', joinDate: '2023-04-01'
  },
  {
    id: 'MK003', name: '조기획', engName: 'Jo Planner', role: '콘텐츠 기획자', dept: 'Marketing',
    email: 'jo.plan@mcn.com', phone: '010-8888-3434', status: '외근', joinDate: '2023-07-20'
  },

  // Tech Div (New)
  {
    id: 'D001', name: '장CTO', engName: 'Jang CTO', role: 'CTO (최고기술경영자)', dept: 'Tech',
    email: 'jang.cto@mcn.com', phone: '010-9999-0001', status: '재직중', joinDate: '2019-05-01',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jang+CTO&background=4f46e5&color=fff'
  },
  {
    id: 'D002', name: '이프론트', engName: 'Lee Frontend', role: '프론트엔드 리드', dept: 'Tech',
    email: 'lee.fe@mcn.com', phone: '010-9999-0002', status: '재직중', joinDate: '2020-06-01'
  },
  {
    id: 'D003', name: '김백엔드', engName: 'Kim Backend', role: '백엔드 리드', dept: 'Tech',
    email: 'kim.be@mcn.com', phone: '010-9999-0003', status: '재직중', joinDate: '2020-07-15'
  },
  {
    id: 'D004', name: '최데브', engName: 'Choi DevOps', role: 'DevOps 엔지니어', dept: 'Tech',
    email: 'choi.ops@mcn.com', phone: '010-9999-0004', status: '재직중', joinDate: '2021-10-01'
  },

  // HR Team (New)
  {
    id: 'H001', name: '김인사', engName: 'Kim HR', role: '인사 팀장', dept: 'HR',
    email: 'kim.hr@mcn.com', phone: '010-7777-0001', status: '재직중', joinDate: '2019-10-01',
    avatarUrl: 'https://ui-avatars.com/api/?name=Kim+HR&background=e11d48&color=fff'
  },
  {
    id: 'H002', name: '박채용', engName: 'Park Recruiter', role: '채용 매니저', dept: 'HR',
    email: 'park.rc@mcn.com', phone: '010-7777-0002', status: '재직중', joinDate: '2022-03-01'
  },

  // Global Biz (New)
  {
    id: 'G001', name: '제임스', engName: 'James Ryu', role: '글로벌 사업 팀장', dept: 'Global',
    email: 'james@mcn.com', phone: '010-6666-0001', status: '출장', joinDate: '2020-02-01',
    avatarUrl: 'https://ui-avatars.com/api/?name=James+Ryu&background=0891b2&color=fff'
  },
  {
    id: 'G002', name: '소피아', engName: 'Sophia Kim', role: '해외 제휴 매니저', dept: 'Global',
    email: 'sophia.g@mcn.com', phone: '010-6666-0002', status: '재직중', joinDate: '2021-11-01'
  }
];

const DEPARTMENTS: Department[] = [
    { id: 'Executive', name: '경영지원본부 (Executive)', phone: '02-555-0001', description: '회사 경영 전반 및 전략 수립', color: 'bg-slate-800' },
    { id: 'Business Div', name: '사업본부 (Business Div)', phone: '02-555-1000', description: '신규 사업 개발 및 제휴', color: 'bg-blue-600' },
    { id: 'Creator Mgmt', name: '매니지먼트 (Creator Mgmt)', phone: '02-555-2000', description: '크리에이터 케어 및 일정 관리', color: 'bg-emerald-500' },
    { id: 'Production', name: '제작본부 (Production)', phone: '02-555-3000', description: '오리지널 콘텐츠 기획 및 제작', color: 'bg-purple-500' },
    { id: 'Marketing', name: '마케팅팀 (Marketing)', phone: '02-555-4000', description: '브랜드 마케팅 및 홍보', color: 'bg-orange-500' },
    // New Departments
    { id: 'Tech', name: '기술본부 (Tech Div)', phone: '02-555-5000', description: '플랫폼 개발 및 인프라 운영', color: 'bg-indigo-600' },
    { id: 'HR', name: '인사문화팀 (HR Team)', phone: '02-555-6000', description: '채용, 평가, 보상 및 조직문화', color: 'bg-rose-500' },
    { id: 'Global', name: '글로벌사업팀 (Global Biz)', phone: '02-555-7000', description: '해외 크리에이터 발굴 및 사업 확장', color: 'bg-cyan-600' },
];

export const OrgChartView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // 검색 필터링 (부서명 검색)
  const filteredDepartments = DEPARTMENTS.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 선택된 부서의 멤버 필터링
  const getDeptMembers = (deptId: string) => {
      return ORG_MEMBERS.filter(m => m.dept === deptId);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Building className="text-gray-800" size={32} /> 회사 조직도
            </h1>
            <p className="text-sm text-gray-500">
                부서별 연락처 및 구성원을 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-4">
             {/* Search */}
             <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600" />
                <input 
                    type="text" 
                    placeholder="부서명 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                />
            </div>
          </div>
        </div>

        {/* Department Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-[fadeIn_0.2s_ease-out]">
            {filteredDepartments.map((dept) => {
                const memberCount = getDeptMembers(dept.id).length;
                
                return (
                    <div 
                        key={dept.id}
                        onClick={() => setSelectedDept(dept)}
                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full"
                    >
                        {/* Color Bar */}
                        <div className={`h-2 w-full ${dept.color}`}></div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                             <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-gray-50 text-gray-700 group-hover:bg-gray-100 transition-colors`}>
                                    <Building size={24} />
                                </div>
                                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold text-gray-600">
                                    <Users size={12} />
                                    <span>{memberCount}명</span>
                                </div>
                             </div>

                             <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
                             <p className="text-xs text-gray-500 mb-6 line-clamp-2 flex-1">{dept.description}</p>
                             
                             <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} className="text-gray-400" />
                                    <span className="font-mono">{dept.phone}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Member List Modal */}
      {selectedDept && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedDept(null)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  {/* Modal Header */}
                  <div className={`px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50`}>
                      <div>
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              {selectedDept.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1"><Phone size={12}/> {selectedDept.phone}</span>
                              <span className="w-px h-3 bg-gray-300"></span>
                              <span>총 {getDeptMembers(selectedDept.id).length}명</span>
                          </div>
                      </div>
                      <button onClick={() => setSelectedDept(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Modal Body (List) */}
                  <div className="overflow-y-auto p-6 flex-1">
                        {getDeptMembers(selectedDept.id).length > 0 ? (
                            <div className="space-y-3">
                                {getDeptMembers(selectedDept.id).map(member => (
                                    <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors bg-white shadow-sm">
                                        <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="text-gray-400" size={20} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-gray-900">{member.name}</span>
                                                <span className="text-xs text-gray-400">({member.engName})</span>
                                            </div>
                                            <div className="text-sm text-gray-600 font-medium">{member.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                                <Users size={40} className="mb-2 opacity-50"/>
                                <p className="text-sm">소속된 부서원이 없습니다.</p>
                            </div>
                        )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
