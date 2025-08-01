/**
 * @File Name      : page.js
 * @File path      : src/app/test/calendar-demo/page.js
 * @author         : 정선우
 * @Description    : 캘린더 컴포넌트 데모 페이지
 *                   - 캘린더의 다양한 기능들을 테스트할 수 있는 페이지
 *                   - 이벤트 추가/삭제, 날짜 선택 등의 기능 제공
 *                   - 다양한 크기의 캘린더 표시
 * @History        : 20250701  최초 신규
 **/

'use client';

import Calendar from '@/app/shared/components/Calendar';
import { useState } from 'react';

/**
 * 캘린더 데모 페이지 컴포넌트
 * 캘린더의 다양한 기능들을 테스트할 수 있는 페이지
 */
export default function CalendarDemoPage() {
  // 선택된 날짜 상태
  const [selectedDate, setSelectedDate] = useState(null);

  // 이벤트 목록 상태
  const [events, setEvents] = useState([
    {
      date: '2025-01-15',
      title: '신년회',
      type: 'event'
    },
    {
      date: '2025-01-01',
      title: '신정',
      type: 'holiday'
    },
    {
      date: '2025-02-09',
      title: '설날',
      type: 'holiday'
    },
    {
      date: '2025-02-10',
      title: '설날',
      type: 'holiday'
    },
    {
      date: '2025-02-11',
      title: '설날',
      type: 'holiday'
    },
    {
      date: '2025-03-01',
      title: '삼일절',
      type: 'holiday'
    },
    {
      date: '2025-05-05',
      title: '어린이날',
      type: 'holiday'
    },
    {
      date: '2025-06-06',
      title: '현충일',
      type: 'holiday'
    },
    {
      date: '2025-08-15',
      title: '광복절',
      type: 'holiday'
    },
    {
      date: '2025-10-03',
      title: '개천절',
      type: 'holiday'
    },
    {
      date: '2025-10-09',
      title: '한글날',
      type: 'holiday'
    },
    {
      date: '2025-12-25',
      title: '크리스마스',
      type: 'holiday'
    },
    {
      date: '2025-07-16',
      title: '팀 미팅',
      type: 'event'
    },
    {
      date: '2025-07-20',
      title: '프로젝트 마감',
      type: 'event'
    },
    {
      date: '2025-07-25',
      title: '점심 약속',
      type: 'etc'
    }
  ]);

  // 새 이벤트 추가 상태
  const [newEvent, setNewEvent] = useState({
    date: '',
    title: '',
    type: 'event'
  });

  /**
   * 날짜 선택 처리
   * @param {Date} date - 선택된 날짜
   */
  const handleDateSelect = (date) => {
    setSelectedDate(date);

    // 새 이벤트의 날짜를 선택된 날짜로 설정
    const dateString = formatDate(date);
    setNewEvent(prev => ({ ...prev, date: dateString }));
  };

  /**
   * 날짜 포맷팅 함수
   * @param {Date} date - 날짜 객체
   * @returns {string} YYYY-MM-DD 형식의 문자열
   */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * 새 이벤트 추가
   */
  const addEvent = () => {
    if (!newEvent.date || !newEvent.title) {
      alert('날짜와 제목을 입력해주세요.');
      return;
    }

    setEvents(prev => [...prev, { ...newEvent }]);
    setNewEvent({ date: '', title: '', type: 'event' });
  };

  /**
   * 이벤트 삭제
   * @param {number} index - 삭제할 이벤트 인덱스
   */
  const removeEvent = (index) => {
    setEvents(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * 선택된 날짜의 이벤트 조회
   * @returns {Array} 선택된 날짜의 이벤트 배열
   */
  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    const dateString = formatDate(selectedDate);
    return events.filter(event => event.date === dateString);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">캘린더 컴포넌트 데모</h1>
          <p className="text-gray-600">캘린더의 다양한 기능들과 크기 옵션을 테스트해보세요.</p>
        </div>

        {/* 다양한 크기의 캘린더 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">다양한 크기의 캘린더</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large 캘린더 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Large Size</h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
                size="large"
                showNavigation={true}
                showTodayButton={true}
                showEvents={true}
                showLegend={true}
              />
            </div>

            {/* Medium 캘린더 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Medium Size</h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
                size="medium"
                showNavigation={true}
                showTodayButton={true}
                showEvents={true}
                showLegend={true}
              />
            </div>

            {/* Small 캘린더 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Small Size</h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
                size="small"
                showNavigation={true}
                showTodayButton={true}
                showEvents={true}
                showLegend={true}
              />
            </div>
          </div>
        </div>

        {/* 기능별 캘린더 예시 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">기능별 캘린더 예시</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 이벤트 없는 캘린더 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">이벤트 없음</h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={[]}
                size="medium"
                showNavigation={true}
                showTodayButton={true}
                showEvents={false}
                showLegend={false}
              />
            </div>

            {/* 네비게이션 없는 캘린더 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">네비게이션 없음</h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
                size="medium"
                showNavigation={false}
                showTodayButton={false}
                showEvents={true}
                showLegend={true}
              />
            </div>

            {/* 범례 없는 캘린더 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">범례 없음</h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
                size="medium"
                showNavigation={true}
                showTodayButton={true}
                showEvents={true}
                showLegend={false}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 캘린더 컴포넌트 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">메인 캘린더 (Large)</h2>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
                size="large"
                showNavigation={true}
                showTodayButton={true}
                showEvents={true}
                showLegend={true}
              />
            </div>
          </div>

          {/* 사이드바 - 이벤트 관리 */}
          <div className="space-y-6">
            {/* 선택된 날짜 정보 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">선택된 날짜</h3>
              {selectedDate ? (
                <div>
                  <p className="text-gray-700 mb-2">
                    {selectedDate.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </p>

                  {/* 선택된 날짜의 이벤트 */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">이벤트</h4>
                    {getSelectedDateEvents().length > 0 ? (
                      <div className="space-y-2">
                        {getSelectedDateEvents().map((event, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{event.title}</span>
                            <button
                              onClick={() => removeEvent(events.findIndex(e => e === event))}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">등록된 이벤트가 없습니다.</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">날짜를 선택해주세요.</p>
              )}
            </div>

            {/* 새 이벤트 추가 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">새 이벤트 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    날짜
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="이벤트 제목을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    타입
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="event">일반 이벤트</option>
                    <option value="holiday">휴일</option>
                    <option value="etc">기타</option>
                  </select>
                </div>

                <button
                  onClick={addEvent}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  이벤트 추가
                </button>
              </div>
            </div>

            {/* 전체 이벤트 목록 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">전체 이벤트 목록</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <button
                      onClick={() => removeEvent(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
