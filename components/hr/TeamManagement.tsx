
import React, { useState } from 'react';
import { Search, Plus, Briefcase, X, User, Trash2, UserPlus, CheckCircle2, Monitor } from 'lucide-react';
import { Team, Employee } from '../../types';
import { Creator } from '../CreatorShared';

interface TeamManagementProps {
    teams: Team[];
    onUpdateTeams: (teams: Team[]) => void;
    employees: Employee[];
    creators?: Creator[];
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ teams, onUpdateTeams, employees, creators = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [managingTeam, setManagingTeam] = useState<Team | null>(null);
    
    // Form States
    const [teamForm, setTeamForm] = useState({ name: '', description: '', memberIds: [] as string[] });
    const [addMemberSearch, setAddMemberSearch] = useState('');
    
    // Tab State for "Add Member" Pane
    const [activeAddTab, setActiveAddTab] = useState<'employee' | 'creator'>('employee');

    const filteredTeams = teams.filter(t => t.name.includes(searchQuery) || t.description.includes(searchQuery));

    // Combine employees and creators for selection logic reference
    const allMembers: (Employee | Creator)[] = [...employees, ...creators];

    const openModal = (team?: Team) => {
        if (team) {
            setManagingTeam(team);
            setTeamForm({ 
                name: team.name, 
                description: team.description,
                memberIds: [...team.memberIds] 
            });
        } else {
            setManagingTeam(null);
            setTeamForm({ name: '', description: '', memberIds: [] });
        }
        setAddMemberSearch('');
        setActiveAddTab('employee'); // Default to employee tab
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!teamForm.name) return alert('팀 이름을 입력해주세요.');
        
        const updatedData = {
            name: teamForm.name,
            description: teamForm.description,
            memberIds: teamForm.memberIds
        };

        if (managingTeam) {
            onUpdateTeams(teams.map(t => t.id === managingTeam.id ? { ...t, ...updatedData } : t));
        } else {
            onUpdateTeams([...teams, { id: `t${Date.now()}`, ...updatedData }]);
        }
        setIsModalOpen(false);
    };

    // Member Management Handlers
    const addMember = (id: string) => {
        if (!teamForm.memberIds.includes(id)) {
            setTeamForm(prev => ({ ...prev, memberIds: [...prev.memberIds, id] }));
        }
    };

    const removeMember = (id: string) => {
        setTeamForm(prev => ({ ...prev, memberIds: prev.memberIds.filter(mid => mid !== id) }));
    };

    // Derived Lists for Modal
    const currentMembers = teamForm.memberIds
        .map(id => allMembers.find(m => m.id === id))
        .filter((m): m is Employee | Creator => m !== undefined);
        
    // Separate lists for filtering
    const availableEmployees = employees.filter(e => 
        !teamForm.memberIds.includes(e.id) && 
        (e.name.includes(addMemberSearch) || e.dept.includes(addMemberSearch) || e.role.includes(addMemberSearch))
    );

    const availableCreators = creators.filter(c => 
        !teamForm.memberIds.includes(c.id) && 
        (c.name.includes(addMemberSearch) || (c.category || '').includes(addMemberSearch))
    );

    const renderMemberInfo = (member: Employee | Creator) => {
        if ('dept' in member) {
            // It's an Employee
            return (
                <div>
                    <div className="text-sm font-bold text-gray-900">{member.name}</div>
                    <div className="text-[10px] text-gray-500">{member.dept} · {member.role}</div>
                </div>
            );
        } else {
            // It's a Creator - Badge Removed
            return (
                <div>
                    <div className="text-sm font-bold text-gray-900">{member.name}</div>
                    <div className="text-[10px] text-gray-500">{member.platform} · {member.category}</div>
                </div>
            );
        }
    };

    const getMemberAvatar = (member: Employee | Creator) => {
        if (member.avatarUrl) {
            return <img src={member.avatarUrl} className="w-full h-full object-cover" alt={member.name} />;
        }
        if ('dept' in member) {
            return <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{member.name[0]}</div>;
        } else {
            return <div className="w-full h-full flex items-center justify-center text-purple-400"><Monitor size={14} /></div>;
        }
    };

    const renderMemberItem = (member: Employee | Creator) => (
        <div key={member.id} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-white hover:border-black transition-all group cursor-pointer" onClick={() => addMember(member.id)}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                    {getMemberAvatar(member)}
                </div>
                {renderMemberInfo(member)}
            </div>
            <div className="text-gray-300 group-hover:text-black transition-colors">
                <Plus size={16} />
            </div>
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="팀 이름 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-black transition-colors" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map(team => (
                    <div key={team.id} onClick={() => openModal(team)} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-3"><div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Briefcase size={20} /></div></div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{team.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{team.description}</p>
                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-500">멤버 {team.memberIds.length}명</span>
                            <div className="flex -space-x-2">
                                {team.memberIds.slice(0, 3).map(id => {
                                    const mem = allMembers.find(m => m.id === id);
                                    return (
                                        <div key={id} className="w-6 h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center overflow-hidden text-[8px] text-gray-500">
                                            {mem?.avatarUrl ? <img src={mem.avatarUrl} alt="" className="w-full h-full object-cover"/> : mem?.name?.[0]}
                                        </div>
                                    )
                                })}
                                {team.memberIds.length > 3 && <div className="w-6 h-6 rounded-full border border-white bg-gray-50 flex items-center justify-center text-[9px] text-gray-500">+{team.memberIds.length - 3}</div>}
                            </div>
                        </div>
                    </div>
                ))}
                <div onClick={() => openModal()} className="border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-gray-600"><Plus size={32} className="mb-2" /><span className="text-sm font-medium">새 팀 추가</span></div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                            <h3 className="font-bold text-gray-900">{managingTeam ? '팀 정보 및 멤버 관리' : '새 팀 생성'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Team Info & Current Members */}
                            <div className="p-6 overflow-y-auto border-r border-gray-100">
                                <h4 className="text-xs font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
                                    <Briefcase size={14} /> 팀 기본 정보
                                </h4>
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">팀 이름</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} placeholder="팀 이름을 입력하세요" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">팀 설명</label>
                                        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:border-black" value={teamForm.description} onChange={e => setTeamForm({...teamForm, description: e.target.value})} placeholder="팀에 대한 설명을 입력하세요" />
                                    </div>
                                </div>

                                <h4 className="text-xs font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
                                    <User size={14} /> 현재 팀원 ({currentMembers.length})
                                </h4>
                                <div className="space-y-2">
                                    {currentMembers.length > 0 ? currentMembers.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:border-red-100 hover:bg-red-50/30 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {getMemberAvatar(member)}
                                                </div>
                                                {renderMemberInfo(member)}
                                            </div>
                                            <button 
                                                onClick={() => removeMember(member.id)}
                                                className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors"
                                                title="팀에서 제외"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                                            등록된 팀원이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Add Members (Tabs & Search) */}
                            <div className="p-6 bg-gray-50/30 overflow-y-auto flex flex-col">
                                <h4 className="text-xs font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
                                    <UserPlus size={14} /> 팀원 추가
                                </h4>
                                
                                {/* Tabs */}
                                <div className="flex border-b border-gray-200 mb-4 bg-white/50 rounded-t-lg px-2 pt-2">
                                    <button 
                                        className={`flex-1 pb-2 text-sm font-medium transition-colors border-b-2 ${activeAddTab === 'employee' ? 'text-black border-black font-bold' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                        onClick={() => setActiveAddTab('employee')}
                                    >
                                        직원 ({availableEmployees.length})
                                    </button>
                                    <button 
                                        className={`flex-1 pb-2 text-sm font-medium transition-colors border-b-2 ${activeAddTab === 'creator' ? 'text-black border-black font-bold' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                        onClick={() => setActiveAddTab('creator')}
                                    >
                                        크리에이터 ({availableCreators.length})
                                    </button>
                                </div>

                                <div className="relative mb-4">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder={activeAddTab === 'employee' ? "직원 이름, 부서 검색..." : "크리에이터 이름, 카테고리 검색..."}
                                        value={addMemberSearch} 
                                        onChange={(e) => setAddMemberSearch(e.target.value)} 
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black bg-white"
                                    />
                                </div>
                                
                                <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
                                    {/* Employees Tab Content */}
                                    {activeAddTab === 'employee' && (
                                        availableEmployees.length > 0 ? (
                                            availableEmployees.map(member => renderMemberItem(member))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400 text-sm">
                                                {addMemberSearch ? '검색 결과가 없습니다.' : '추가 가능한 직원이 없습니다.'}
                                            </div>
                                        )
                                    )}

                                    {/* Creators Tab Content */}
                                    {activeAddTab === 'creator' && (
                                        availableCreators.length > 0 ? (
                                            availableCreators.map(member => renderMemberItem(member))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400 text-sm">
                                                {addMemberSearch ? '검색 결과가 없습니다.' : '추가 가능한 크리에이터가 없습니다.'}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">취소</button>
                            <button onClick={handleSave} className="px-6 py-2 text-sm bg-black text-white rounded-lg font-bold shadow-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                                <CheckCircle2 size={16} /> 저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
