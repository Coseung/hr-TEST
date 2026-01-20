

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  jobTitle: string;
  avatarUrl: string;
  status: '재직중' | '휴가중';
  tags: string[];
}

export interface UserProfile {
  name: string;
  engName: string;
  nickname: string;
  email: string;
  personalEmail: string;
  phone: string; // Added phone number
  employeeId: string;
  joinDate: string;
  tenure: string;
  groupJoinDate: string;
  org: string;
  job: string;
  rank: string;
  avatarUrl: string; // Added for synchronization
  coverUrl?: string; // Added for profile cover
}

export interface AttendanceStats {
  usedLeave: number;
  totalLeave: number;
  workHoursCurrent: number;
  workHoursTotal: number;
}

export interface VacationLog {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: '승인됨' | '대기중' | '사용완료' | '반려됨';
  reason: string;
  // Extended fields
  location?: string;
  emergencyContact?: string;
  workGoals?: string;
  handover?: string;
  symptoms?: string;
  hospital?: string;
  relationship?: string;
  eventType?: string;
  rejectionReason?: string;
}

// --- New Shared Interfaces ---

export interface Employee {
  id: string;
  name: string;
  engName: string;
  dept: string;
  role: string;
  workStatus: '출근' | '퇴근' | '휴가' | '병가' | '출장'; 
  clockInTime?: string;
  email: string;
  personalEmail?: string;
  phone: string;
  joinDate: string;
  avatarUrl?: string;
  coverUrl?: string; // Added for profile sync
  // Additional fields for profile compatibility
  nickname?: string;
  rank?: string;
}

export interface Team {
    id: string;
    name: string;
    description: string;
    leaderId?: string;
    memberIds: string[];
}

export interface HealthRecord {
  id: number;
  name: string;
  lastCheck: string;
  hospital: string;
  result: string;
  nextCheck: string;
  bp?: string;   // Blood Pressure
  sugar?: string; // Blood Sugar
  chol?: string; // Cholesterol
  bmi?: string;  // BMI
}