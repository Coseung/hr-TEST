
import React, { useState } from 'react';
import { User, UserProfile, Employee, Team } from '../types';
import { ProfileView } from './ProfileView';
import { LayoutGrid, List, Search, Users, Mail, Phone, MoreHorizontal, Hash, ChevronLeft, ArrowRight } from 'lucide-react';

interface TeamViewProps {
  user: User;
  teams: Team[];
  employees: Employee[];
}

export const TeamView: React.FC<TeamViewProps> = ({ user, teams, employees }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find the team(s) the current user belongs to
  const myTeams = teams.filter(team => team.memberIds.includes(user.id));

  // Helper to convert Employee to UserProfile for display
  const mapEmployeeToProfile = (emp: Employee): UserProfile => ({
      name: emp.name,
      engName: emp.engName,
      nickname: emp.nickname || emp.name,
      email: emp.email,
      personalEmail: emp.personalEmail || '',
      phone: emp.phone,
      employeeId: emp.id,
      joinDate: emp.joinDate,
      tenure: '계산 필요',
      groupJoinDate: emp.joinDate,
      org: emp.dept,
      job: emp.role,
      rank: emp.rank || '직급 정보 없음',
      avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${emp.name}&background=random`,
      coverUrl: emp.coverUrl // Map coverUrl
  });

  // Level 3: Profile Detail
  if (selectedMember) {
    return (
      <ProfileView 
        profile={selectedMember} 
        onUpdateProfile={() => {}} 
        readOnly={true}
        onBack={() => setSelectedMember(null)}
      />
    );
  }

  // Level 2: Team Members Detail
  if (selectedTeam) {
      const teamMemberIds = selectedTeam.memberIds;
      const teamMembers = teamMemberIds
        .map(id => employees.find(e => e.id === id))
        .filter((e): e is Employee => e !== undefined);

      const filteredMembers = teamMembers.filter(member => 
        member.name.includes(searchQuery) || 
        member.role.includes(searchQuery) ||
        (member.nickname && member.nickname.includes(searchQuery))
      );

      return (
        <div className="flex-1 h-screen overflow-y-auto bg-white p-8 animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <button 
                    onClick={() => { setSelectedTeam(null); setSearchQuery(''); }}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ChevronLeft size={16} /> 팀 목록으로 돌아가기
                </button>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  {selectedTeam.name}
                </h1>
                <p className="text-sm text-gray-500">
                    {selectedTeam.description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                 {/* Search */}
                 <div className="relative group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600" />
                    <input 
                        type="text" 
                        placeholder="이름, 직무 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                    />
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
              </div>
            </div>

            {/* Content: Grid/List of Members */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredMembers.map((member) => (
                        <div 
                            key={member.id}
                            onClick={() => setSelectedMember(mapEmployeeToProfile(member))}
                            className="group border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white"
                        >
                            <div className="h-24 bg-gray-50 relative overflow-hidden">
                                 {member.coverUrl ? (
                                     <img src={member.coverUrl} alt="cover" className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-gray-100"></div>
                                 )}
                            </div>
                            <div className="px-5 pb-5 relative">
                                 <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm overflow-hidden absolute -top-8 left-1/2 -translate-x-1/2 bg-white">
                                    {member.avatarUrl ? (
                                        <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xl font-bold text-gray-400">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                 </div>
                                 <div className="mt-10 text-center">
                                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1">{member.role}</p>
                                    <div className="flex justify-center items-center gap-2 mb-4 mt-2">
                                        <span className="bg-gray-100 text-gray-800 text-sm px-2 py-0.5 rounded border border-gray-200 font-medium">{member.nickname || member.name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${member.workStatus === '출근' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                            {member.workStatus}
                                        </span>
                                    </div>
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">프로필</th>
                                <th className="px-6 py-3">직무/직급</th>
                                <th className="px-6 py-3">연락처</th>
                                <th className="px-6 py-3">상태</th>
                                <th className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredMembers.map((member) => (
                                <tr 
                                    key={member.id} 
                                    onClick={() => setSelectedMember(mapEmployeeToProfile(member))}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900 flex items-center gap-2">
                                                    {member.name} 
                                                    <span className="text-gray-500 font-normal text-sm">({member.nickname || member.name})</span>
                                                </div>
                                                <div className="text-xs text-gray-500">{member.engName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{member.role}</div>
                                        <div className="text-xs text-gray-400">{member.rank || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Mail size={12} className="text-gray-400" /> {member.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Phone size={12} /> {member.phone}
                                            <span className="mx-1">|</span>
                                            <Hash size={12} /> {member.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded border font-medium ${member.workStatus === '출근' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                            {member.workStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
      );
  }

  // Level 1: Team List (Empty State or List)
  if (myTeams.length === 0) {
      return (
          <div className="flex-1 h-screen flex items-center justify-center bg-white">
              <div className="text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <h2 className="text-lg font-bold text-gray-700 mb-1">소속된 팀이 없습니다.</h2>
                  <p className="text-sm">관리자에게 팀 배정을 요청해주세요.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Users className="text-gray-800" size={32} /> 팀 현황
            </h1>
            <p className="text-sm text-gray-500">
                소속된 팀을 선택하여 구성원 정보를 확인하세요.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.2s_ease-out]">
            {myTeams.map(team => (
                <div 
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 border border-blue-100">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                        <p className="text-sm text-gray-500 mb-6 h-10 line-clamp-2">{team.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users size={16} className="text-gray-400" />
                                <span className="font-medium">{team.memberIds.length}명</span>
                            </div>
                            <div className="text-blue-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                팀원 조회 <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
