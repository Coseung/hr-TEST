
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { HealthRecord } from '../../types';
import { INITIAL_HEALTH_RECORDS } from '../../constants';

export const HealthManagement: React.FC = () => {
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
    const [searchQuery, setSearchQuery] = useState('');

    const getHealthResultStyle = (result: string) => {
        if (result.includes('양호')) return 'bg-green-50 text-green-700 border-green-200';
        if (result.includes('경미')) return 'bg-blue-50 text-blue-700 border-blue-200';
        if (result.includes('주의') || result.includes('유소견')) return 'bg-orange-50 text-orange-700 border-orange-200';
        if (result.includes('미수검')) return 'bg-gray-50 text-gray-500 border-gray-200';
        return 'bg-red-50 text-red-700 border-red-200';
    };

    const filtered = healthRecords.filter(h => h.name.includes(searchQuery));

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="이름 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-black transition-colors" />
                </div>
                <button className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">+ 기록 추가</button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
                        <tr><th className="px-6 py-3">이름/검진기관</th><th className="px-6 py-3">최근 검진일</th><th className="px-6 py-3">수치 (BP/BS/BMI)</th><th className="px-6 py-3">결과 판정</th><th className="px-6 py-3">다음 검진</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filtered.map(rec => (
                            <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{rec.name}<div className="text-[10px] text-gray-400 font-normal mt-0.5">{rec.hospital}</div></td>
                                <td className="px-6 py-4 text-gray-600">{rec.lastCheck}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{rec.bp && rec.bp !== '-' ? `${rec.bp} / ${rec.sugar} / ${rec.bmi}` : '-'}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-xs border ${getHealthResultStyle(rec.result)}`}>{rec.result}</span></td>
                                <td className="px-6 py-4 text-gray-600">{rec.nextCheck}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
