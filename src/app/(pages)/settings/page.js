"use client";

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import CmpButton from '@/app/shared/components/button/cmp_button';
import { useState } from 'react';

import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import PageWrapper from '@/app/shared/layouts/PageWrapper';

const initialGoals = [
  { checked: false, content: '하루 1가지 감사한 일 기록하기', unit: '일별', start: '2025.03.01', end: '2025.05.01' },
  { checked: false, content: '한달에 1권 독서하기', unit: '월별', start: '2025.01.01', end: '2025.12.31' },
  { checked: false, content: '골프 배우기', unit: '연간', start: '2025.02.20', end: '2025.05.01' },
  { checked: false, content: '아침 7시 기상하기', unit: '일별', start: '2025.03.01', end: '2025.05.01' },
  { checked: false, content: '칼퇴근 하기', unit: '일별', start: '2025.03.01', end: '2025.05.01' },
  { checked: false, content: '전화 영어 일주일 1번', unit: '일별', start: '2025.03.01', end: '2025.05.01' },
  { checked: false, content: '좋은 문장 필사하기', unit: '일별', start: '2025.03.01', end: '2025.05.01' },
];

const unitOptions = ['일별', '월별', '연간'];

export default function SettingsPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

  const [activeTab, setActiveTab] = useState('personal');
  const [goals, setGoals] = useState(initialGoals);
  const [loading, setLoading] = useState(false);

  const handleCheck = (idx) => {
    setGoals(goals.map((g, i) => i === idx ? { ...g, checked: !g.checked } : g));
  };

  const handleChange = (idx, key, value) => {
    setGoals(goals.map((g, i) => i === idx ? { ...g, [key]: value } : g));
  };

  const handleAdd = () => {
    setGoals([...goals, { checked: false, content: '', unit: '일별', start: '', end: '' }]);
  };

  const handleDelete = () => {
    setGoals(goals.filter(g => !g.checked));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API 호출 로직
      console.log('Saving goals:', goals);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.Open('#settingsSuccessToast');
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.Open('#settingsErrorToast');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setGoals(initialGoals);
    setActiveTab('personal');
  };

  const handleBack = () => {
    setMove('/dashboard');
  };

  const toastClose = () => {
    console.log('Toast closed');
  };

  // Draw functions
  const drawSettingsForm = () => {
    return (
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow p-8">
        <div className="flex border-b mb-8">
          <button
            className={`px-6 py-2 font-bold border-b-4 ${activeTab === 'personal' ? 'border-orange-400 text-orange-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('personal')}
          >
            개인 목표 설정
          </button>
          <button
            className={`px-6 py-2 font-bold border-b-4 ${activeTab === 'group' ? 'border-orange-400 text-orange-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('group')}
          >
            그룹 목표 설정
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center bg-gray-50 rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-2 w-12"></th>
                <th className="py-3 px-2">목표 내용</th>
                <th className="py-3 px-2">목표달성단위</th>
                <th className="py-3 px-2">목표달성기간</th>
                <th className="py-3 px-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, idx) => (
                <tr key={idx} className="bg-white border-b last:border-b-0">
                  <td>
                    <input
                      type="checkbox"
                      checked={goal.checked}
                      onChange={() => handleCheck(idx)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={goal.content}
                      onChange={e => handleChange(idx, 'content', e.target.value)}
                    />
                  </td>
                  <td>
                    <CmpSelect
                      value={goal.unit}
                      onChange={(value) => handleChange(idx, 'unit', value)}
                      options={unitOptions.map(opt => ({ value: opt, label: opt }))}
                      size="sm"
                      className="w-full"
                    />
                  </td>
                  <td className="flex items-center gap-2 justify-center">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28"
                      value={goal.start}
                      onChange={e => handleChange(idx, 'start', e.target.value)}
                      placeholder="YYYY.MM.DD"
                    />
                    <span>-</span>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-28"
                      value={goal.end}
                      onChange={e => handleChange(idx, 'end', e.target.value)}
                      placeholder="YYYY.MM.DD"
                    />
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 my-4">
          <CmpButton label="추가" click={handleAdd} />
          <CmpButton label="삭제" click={handleDelete} />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <CmpButton
            label="등록"
            click={handleSave}
            disabled={loading}
          />
          <CmpButton
            label="취소"
            click={handleCancel}
            styleType="secondary"
          />
          <CmpButton
            label="뒤로가기"
            click={handleBack}
            styleType="textUnLine"
          />
        </div>
      </div>
    );
  };

  const toasts = [
    {
      id: 'settingsSuccessToast',
      message: '설정이 성공적으로 저장되었습니다.',
      type: 'success',
      onClose: toastClose
    },
    {
      id: 'settingsErrorToast',
      message: '설정 저장에 실패했습니다. 다시 시도해주세요.',
      type: 'error',
      onClose: toastClose
    }
  ];

  return (
    <PageWrapper
      title="IBK 직원권익보호 포탈"
      subtitle="설정"
      showCard={false}
    >
      {drawSettingsForm()}
    </PageWrapper>
  );
}
