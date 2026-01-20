
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

// TODO: 이 URL을 실제 업로드하신 이미지 경로로 변경해주세요. (예: '/assets/office-bg.png')
// 현재는 분위기가 유사한 고화질 오피스 이미지를 임시로 적용했습니다.
const BACKGROUND_IMAGE_URL = "assets/MCN.png";

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for employee
    if (id === 'qwer' && password === '1234') {
      onLogin(USERS.employee);
      return;
    }

    // Check for admin
    if (id === 'admin' && password === '1234') {
      onLogin(USERS.admin);
      return;
    }

    // Check for creator (gamedol)
    if (id === 'gamedol' && password === '1234') {
      onLogin(USERS.creator);
      return;
    }

    setError('아이디 또는 비밀번호를 확인해주세요.');
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gray-100 relative overflow-hidden"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 relative z-10 transition-all">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-black text-white text-2xl font-bold flex items-center justify-center rounded-xl mb-4 shadow-md">
            N
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">HR Workspace</h1>
          <p className="text-gray-500 text-sm">Notion 스타일의 인사 관리 시스템</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">아이디</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center">
              <p className="text-red-500 text-xs font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 active:scale-[0.99] transition-all shadow-md mt-2"
          >
            로그인
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2 font-medium">테스트 계정 정보</p>
          <div className="flex justify-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="px-2 py-1 bg-gray-100 rounded">직원: qwer / 1234</span>
            <span className="px-2 py-1 bg-gray-100 rounded">관리자: admin / 1234</span>
            <span className="px-2 py-1 bg-gray-100 rounded">크리에이터: gamedol / 1234</span>
          </div>
        </div>
      </div>
    </div>
  );
};
