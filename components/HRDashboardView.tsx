
import React, { useState, useEffect } from 'react';
import { VacationLog, Team, Employee } from '../types';
import { Creator } from './CreatorShared';
import { StaffManagement } from './hr/StaffManagement';
import { AttendanceManagement } from './hr/AttendanceManagement';
import { HealthManagement } from './hr/HealthManagement';
import { VacationManagement } from './hr/VacationManagement';
import { TeamManagement } from './hr/TeamManagement';

interface HRDashboardViewProps {
    vacationLogs?: VacationLog[];
    onUpdateVacationLogs?: (logs: VacationLog[]) => void;
    teams: Team[];
    onUpdateTeams: (teams: Team[]) => void;
    employees: Employee[];
    onUpdateEmployees: (employees: Employee[]) => void;
    creators?: Creator[];
    initialTab?: 'staff' | 'health' | 'vacation' | 'teams' | 'attendance';
}

export const HRDashboardView: React.FC<HRDashboardViewProps> = ({ 
    vacationLogs = [], 
    onUpdateVacationLogs,
    teams,
    onUpdateTeams,
    employees,
    onUpdateEmployees,
    creators = [],
    initialTab = 'staff'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const renderContent = () => {
      switch (activeTab) {
          case 'staff':
              return <StaffManagement employees={employees} onUpdateEmployees={onUpdateEmployees} vacationLogs={vacationLogs} />;
          case 'attendance':
              return <AttendanceManagement employees={employees} />;
          case 'health':
              return <HealthManagement />;
          case 'vacation':
              return <VacationManagement vacationLogs={vacationLogs} onUpdateVacationLogs={onUpdateVacationLogs || (() => {})} />;
          case 'teams':
              return <TeamManagement teams={teams} onUpdateTeams={onUpdateTeams} employees={employees} creators={creators} />;
          default:
              return <StaffManagement employees={employees} onUpdateEmployees={onUpdateEmployees} vacationLogs={vacationLogs} />;
      }
  };

  const getTitle = () => {
      switch (activeTab) {
          case 'staff': return '직원 관리';
          case 'attendance': return '근태 관리';
          case 'health': return '건강 관리';
          case 'vacation': return '휴가 관리';
          case 'teams': return '팀 관리';
          default: return '인사 관리';
      }
  };

  const getDescription = () => {
      switch (activeTab) {
          case 'staff': return '전체 임직원의 인적 정보 및 인사 현황을 관리합니다.';
          case 'attendance': return '직원들의 실시간 근태 및 업무 상태를 모니터링합니다.';
          case 'health': return '직원들의 건강검진 수검 현황 및 이력을 관리합니다.';
          case 'vacation': return '휴가 신청 내역 검토 및 승인 프로세스를 진행합니다.';
          case 'teams': return '조직 내 팀 구성 및 멤버 배정을 관리합니다.';
          default: return '';
      }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white relative">
      <div className="max-w-[1600px] mx-auto">
        <div className="px-8 pt-8 mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
            <p className="text-gray-500 text-sm">{getDescription()}</p>
        </div>

        <div className="p-8 pt-2">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};
