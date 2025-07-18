/**
 * @File Name      : Calendar.js
 * @File path      : src/components/Calendar.js
 * @author         : 정선우
 * @Description    : 캘린더 컴포넌트
 *                   - 월별 캘린더 표시
 *                   - 오늘 날짜 하이라이트 기능
 *                   - 일요일 빨간색 표시
 *                   - 날짜 선택 기능
 *                   - 이벤트 표시 기능
 *                   - 월 이동 기능
 *                   - 오늘 날짜로 이동 기능
 *                   - 크기 조절 기능 (large, medium, small)
 * @History        : 20250701  최초 신규
 **/

import { useEffect, useState } from 'react';

/**
 * 캘린더 매트릭스 생성 함수
 * 지정된 년월의 캘린더를 2차원 배열로 생성
 * @param {number} year - 년도
 * @param {number} month - 월 (1~12)
 * @returns {Array} 2차원 배열 형태의 캘린더 매트릭스
 */
function getCalendarMatrix(year, month) {
  // month: 1~12
  const firstDay = new Date(year, month - 1, 1);  // 해당 월의 첫째 날
  const lastDay = new Date(year, month, 0);       // 해당 월의 마지막 날
  const matrix = [];
  let week = [];
  let day = 1 - firstDay.getDay(); // Sunday 기준 시작 (첫째 날의 요일에 따라 시작일 조정)

  while (day <= lastDay.getDate()) {
    week = [];
    for (let i = 0; i < 7; i++, day++) {
      if (day < 1 || day > lastDay.getDate()) {
        week.push(null);  // 해당 월이 아닌 날짜는 null로 표시
      } else {
        week.push(day);   // 해당 월의 날짜
      }
    }
    matrix.push(week);
  }
  return matrix;
}

/**
 * 날짜 포맷팅 함수
 * @param {Date} date - 날짜 객체
 * @returns {string} YYYY-MM-DD 형식의 문자열
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 캘린더 크기별 스타일 클래스 반환
 * @param {string} size - 캘린더 크기 ('large', 'medium', 'small')
 * @returns {Object} 크기별 스타일 객체
 */
function getSizeStyles(size) {
  switch (size) {
    case 'small':
      return {
        container: 'p-3',
        header: 'text-sm mb-2',
        title: 'text-base',
        navButton: 'p-1',
        navIcon: 'w-3 h-3',
        todayButton: 'px-2 py-1 text-xs',
        table: 'text-xs',
        th: 'py-1',
        td: 'p-0.5 min-h-[40px]',
        dateCircle: 'w-6 h-6 text-xs',
        event: 'text-xs px-0.5 py-0.5',
        legend: 'text-xs gap-1',
        legendItem: 'text-xs'
      };
    case 'medium':
      return {
        container: 'p-4',
        header: 'text-base mb-3',
        title: 'text-lg',
        navButton: 'p-1.5',
        navIcon: 'w-4 h-4',
        todayButton: 'px-2.5 py-1 text-sm',
        table: 'text-sm',
        th: 'py-1.5',
        td: 'p-1 min-h-[50px]',
        dateCircle: 'w-7 h-7 text-sm',
        event: 'text-xs px-1 py-0.5',
        legend: 'text-xs gap-2',
        legendItem: 'text-xs'
      };
    case 'large':
    default:
      return {
        container: 'p-6',
        header: 'text-lg mb-4',
        title: 'text-xl',
        navButton: 'p-2',
        navIcon: 'w-4 h-4',
        todayButton: 'px-3 py-1 text-sm',
        table: 'text-sm',
        th: 'py-2',
        td: 'p-1 min-h-[60px]',
        dateCircle: 'w-8 h-8 text-sm',
        event: 'text-xs px-1 py-0.5',
        legend: 'text-xs gap-2',
        legendItem: 'text-xs'
      };
  }
}

/**
 * 캘린더 컴포넌트
 * 월별 캘린더를 표시하는 React 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.year - 표시할 년도 (기본값: 현재 년도)
 * @param {number} props.month - 표시할 월 (기본값: 현재 월)
 * @param {Date} props.selectedDate - 선택된 날짜
 * @param {Function} props.onDateSelect - 날짜 선택 콜백 함수
 * @param {Array} props.events - 이벤트 배열 [{date: 'YYYY-MM-DD', title: '이벤트명', type: 'event|holiday|etc'}]
 * @param {boolean} props.showNavigation - 네비게이션 표시 여부 (기본값: true)
 * @param {boolean} props.showTodayButton - 오늘 버튼 표시 여부 (기본값: true)
 * @param {string} props.size - 캘린더 크기 ('large', 'medium', 'small', 기본값: 'large')
 * @param {boolean} props.showEvents - 이벤트 표시 여부 (기본값: true)
 * @param {boolean} props.showLegend - 범례 표시 여부 (기본값: true)
 * @returns {JSX.Element} 캘린더 컴포넌트
 */
export default function Calendar({
  year: initialYear,
  month: initialMonth,
  selectedDate: externalSelectedDate,
  onDateSelect,
  events = [],
  showNavigation = true,
  showTodayButton = true,
  size = 'large',
  showEvents = true,
  showLegend = true
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(initialYear || today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialMonth || today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate || null);

  // 크기별 스타일 가져오기
  const styles = getSizeStyles(size);

  // 외부에서 선택된 날짜가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(externalSelectedDate);
    }
  }, [externalSelectedDate]);

  const weeks = getCalendarMatrix(currentYear, currentMonth);  // 캘린더 매트릭스 생성
  const isThisMonth = today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;  // 현재 월인지 확인
  const todayDate = isThisMonth ? today.getDate() : null;  // 오늘 날짜 (현재 월이 아닌 경우 null)

  /**
   * 이전 월로 이동
   */
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  /**
   * 다음 월로 이동
   */
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * 오늘 날짜로 이동
   */
  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
    const todayDateObj = new Date();
    setSelectedDate(todayDateObj);
    if (onDateSelect) {
      onDateSelect(todayDateObj);
    }
  };

  /**
   * 날짜 선택 처리
   * @param {number} day - 선택된 날짜
   */
  const handleDateClick = (day) => {
    if (day === null) return;

    const selectedDateObj = new Date(currentYear, currentMonth - 1, day);
    setSelectedDate(selectedDateObj);

    if (onDateSelect) {
      onDateSelect(selectedDateObj);
    }
  };

  /**
   * 특정 날짜의 이벤트 조회
   * @param {number} day - 날짜
   * @returns {Array} 해당 날짜의 이벤트 배열
   */
  const getEventsForDate = (day) => {
    if (day === null || !showEvents) return [];

    const dateString = formatDate(new Date(currentYear, currentMonth - 1, day));
    return events.filter(event => event.date === dateString);
  };

  /**
   * 이벤트 타입별 스타일 클래스 반환
   * @param {string} type - 이벤트 타입
   * @returns {string} CSS 클래스명
   */
  const getEventStyle = (type) => {
    switch (type) {
      case 'holiday':
        return 'bg-red-100 text-red-700';
      case 'event':
        return 'bg-blue-100 text-blue-700';
      case 'etc':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow ${styles.container}`}>
      {/* 캘린더 헤더 */}
      <div className={`flex items-center justify-between ${styles.header}`}>
        <div className={`font-bold ${styles.title}`}>{`${currentYear}년 ${currentMonth.toString().padStart(2, '0')}월`}</div>

        {showNavigation && (
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPreviousMonth}
              className={`rounded-lg hover:bg-gray-100 transition-colors ${styles.navButton}`}
              title="이전 월"
            >
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {showTodayButton && (
              <button
                onClick={goToToday}
                className={`bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${styles.todayButton}`}
                title="오늘로 이동"
              >
                오늘
              </button>
            )}

            <button
              onClick={goToNextMonth}
              className={`rounded-lg hover:bg-gray-100 transition-colors ${styles.navButton}`}
              title="다음 월"
            >
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 캘린더 테이블 */}
      <table className={`w-full text-center select-none ${styles.table}`}>
        <thead>
          <tr className="text-gray-500 border-b">
            <th className={`text-red-400 ${styles.th}`}>Sun</th>  {/* 일요일은 빨간색 */}
            <th className={styles.th}>Mon</th>
            <th className={styles.th}>Tue</th>
            <th className={styles.th}>Wed</th>
            <th className={styles.th}>Thu</th>
            <th className={styles.th}>Fri</th>
            <th className={styles.th}>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i} className="border-b">
              {week.map((day, j) => {
                const dateEvents = getEventsForDate(day);
                const isSelected = selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth - 1 &&
                  selectedDate.getFullYear() === currentYear;

                return (
                  <td
                    key={j}
                    className={`relative align-top ${
                      day === null
                        ? 'text-gray-300'           // 해당 월이 아닌 날짜는 회색
                        : j === 0
                        ? 'text-red-400'            // 일요일은 빨간색
                        : 'text-black'              // 나머지는 검은색
                    } ${styles.td}`}
                  >
                    {day !== null && (
                      <div className="relative">
                        {/* 날짜 표시 */}
                        <div
                          className={`inline-block rounded-full cursor-pointer transition-colors ${
                            day === todayDate
                              ? 'bg-blue-100 text-blue-700 font-bold'  // 오늘 날짜
                              : isSelected
                              ? 'bg-blue-500 text-white font-bold'     // 선택된 날짜
                              : 'hover:bg-gray-100'                    // 호버 효과
                          } ${styles.dateCircle}`}
                          onClick={() => handleDateClick(day)}
                        >
                          {day}
                        </div>

                        {/* 이벤트 표시 */}
                        {showEvents && dateEvents.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {dateEvents.slice(0, size === 'small' ? 1 : 2).map((event, index) => (
                              <div
                                key={index}
                                className={`rounded truncate ${getEventStyle(event.type)} ${styles.event}`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dateEvents.length > (size === 'small' ? 1 : 2) && (
                              <div className={`text-gray-500 ${styles.event}`}>
                                +{dateEvents.length - (size === 'small' ? 1 : 2)}개
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 이벤트 범례 */}
      {showLegend && showEvents && events.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className={`font-medium text-gray-700 mb-2 ${styles.legendItem}`}>범례</div>
          <div className={`flex flex-wrap ${styles.legend}`}>
            <div className={`flex items-center ${styles.legendItem}`}>
              <div className="w-2 h-2 bg-blue-100 rounded mr-1"></div>
              <span>일반</span>
            </div>
            <div className={`flex items-center ${styles.legendItem}`}>
              <div className="w-2 h-2 bg-red-100 rounded mr-1"></div>
              <span>휴일</span>
            </div>
            <div className={`flex items-center ${styles.legendItem}`}>
              <div className="w-2 h-2 bg-gray-100 rounded mr-1"></div>
              <span>기타</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
