'use client'

import { bottomSheet } from '@/app/shared/utils/ui_com';
import React, { useEffect, useRef, useState } from 'react';
import { StyledDropDown } from '../select/cmp_dropdown';
import { StyledBottomSheets } from './cmp_bottomSheets_style';
//바텀시트
const CmpBsArea = (props) => {
    const { id, className, popType, children, callback } = props;

    const renderChildren = () => {
        return React.Children.map(props.children, (child) => {
            return React.cloneElement(child, {
                id: id,
            });
        });
    };

    const addedChildren = renderChildren;

    const bottomClick = (e) => {
        if (e.target.classList.contains("CmpBottomSheetArea")) {
            e.preventDefault();
            e.stopPropagation();
            callback !== undefined ? bottomSheet.Closed("#" + id, callback) : bottomSheet.Closed("#" + id);
        }
    }

    return (
        <StyledBottomSheets id={id} className={`CmpBottomSheetArea ${className}`} data-poptype={popType} onClick={bottomClick}>
            <div className="bottomSheetContArea">
                <div className="innerCont">
                    <>{addedChildren()}</>
                </div>
            </div>
        </StyledBottomSheets>
    );
};

//바텀시트 타이틀
const CmpBsTitle = (props) => {
    const { popTitle, click, id, callback } = props;

    let touchStartVal = useRef(0);     // 터치 시작값
    let touchMoveVal = useRef(0);      // 터치 무브값
    let touchMoveMax = useRef(0);      // 바텀시트 y축 이동값
    let touchStartTime = useRef(0);    // 터치 시작점
    let touchEndTime = useRef(0);      // 터치 끝나는점
    let touchTime = useRef(0);         // 터치 지속시간

    const buttonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!id) {
            console.warn('CmpBsTitle: id가 없습니다. 닫기 동작을 수행하지 않습니다.');
            return;
        }
        if (click !== undefined) {
            click(e.currentTarget);
        }
        callback !== undefined ? bottomSheet.Closed("#" + id, callback) : bottomSheet.Closed("#" + id);
    }

    const touchStart = (e) => {

        touchStartVal.current = Math.ceil(e.changedTouches[0].screenY);   // 시작 터치값 저장
        touchStartTime.current = bottomSheet.timeCheck();              // 터치 시작시간 저장
    }

    const touchMove = (e) => {

        touchMoveVal.current = Math.ceil(e.changedTouches[0].screenY) - touchStartVal.current;  // 터치시 팝업컨텐츠  실제 포지션 Y값 추출
        touchMoveMax.current = Math.max(0, touchMoveVal.current);                            // Y축 최소값 0 설정

        document.querySelector("#" + id + " .innerCont").style.top = touchMoveMax.current + "px";  // 터치시 팝업 top값 위치이동

    }

    const touchEnd = (e) => {

        touchEndTime.current = bottomSheet.timeCheck();  // 터치 종료시간 저장 (시작시간 - 종료시간 = 지속시간)
        touchTime.current = Number(touchEndTime.current - touchStartTime.current);  // 터치 지속시간 추출

        const popColsedPosVal = document.querySelector("#" + id + " .innerCont").offsetHeight / 3;  // 터치 다운일경우 팝업 컨텐츠 높이의 3/1지점 이하일때 팝업 클로즈

        if (touchMoveMax.current !== 0) {
            // 터치지속시간이 1초미만일경우 짤은 터치 감지
            if (touchTime.current === 0) {
                if (touchMoveMax.current < 150) {
                    //console.log("짧은 터치");
                    bottomSheet.Closed("#" + id);
                } else {
                    if (popColsedPosVal > touchMoveMax.current) {
                        //console.log("3/1 이상")
                        document.querySelector("#" + id + " .innerCont").style.top = "0px";
                    } else {
                        //console.log("3/1 이하")
                        bottomSheet.Closed("#" + id);
                    }
                }
            } else {
                if (popColsedPosVal > touchMoveMax.current) {
                    //console.log("3/1 이상")
                    document.querySelector("#" + id + " .innerCont").style.top = "0px";
                } else {
                    //console.log("3/1 이하");
                    bottomSheet.Closed("#" + id);
                }
            }
        }
    }

    return (
        <div className="bottomSheetTitle" onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd}>
            <button type="button" className="bottomSheetClosed" onClick={buttonClick}><span className="hidden">닫기</span></button>
            <p>{popTitle}</p>
        </div>
    );
};

//바텀시트 타이틀(편집모드)
const CmpBsTitleEdit = (props) => {
    const { popTitle, click, id } = props;

    let touchStartVal = useRef(0);     // 터치 시작값
    let touchMoveVal = useRef(0);      // 터치 무브값
    let touchMoveMax = useRef(0);      // 바텀시트 y축 이동값
    let touchStartTime = useRef(0);    // 터치 시작점
    let touchEndTime = useRef(0);      // 터치 끝나는점
    let touchTime = useRef(0);         // 터치 지속시간

    const buttonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        bottomSheet.Closed("#" + id);
        if (click !== undefined) {
            click(e.currentTarget);
        }
    }

    const touchStart = (e) => {

        touchStartVal.current = Math.ceil(e.changedTouches[0].screenY);   // 시작 터치값 저장
        touchStartTime.current = bottomSheet.timeCheck();              // 터치 시작시간 저장
    }

    const touchMove = (e) => {

        touchMoveVal.current = Math.ceil(e.changedTouches[0].screenY) - touchStartVal.current;  // 터치시 팝업컨텐츠  실제 포지션 Y값 추출
        touchMoveMax.current = Math.max(0, touchMoveVal.current);                            // Y축 최소값 0 설정

        document.querySelector("#" + id + " .innerCont").style.top = touchMoveMax.current + "px";  // 터치시 팝업 top값 위치이동

    }

    const touchEnd = (e) => {

        touchEndTime.current = bottomSheet.timeCheck();  // 터치 종료시간 저장 (시작시간 - 종료시간 = 지속시간)
        touchTime.current = Number(touchEndTime.current - touchStartTime.current);  // 터치 지속시간 추출

        const popColsedPosVal = document.querySelector("#" + id + " .innerCont").offsetHeight / 3;  // 터치 다운일경우 팝업 컨텐츠 높이의 3/1지점 이하일때 팝업 클로즈

        if (touchMoveMax.current !== 0) {
            // 터치지속시간이 1초미만일경우 짤은 터치 감지
            if (touchTime.current === 0) {
                if (touchMoveMax.current < 150) {
                    //console.log("짧은 터치");
                    bottomSheet.Closed("#" + id);
                } else {
                    if (popColsedPosVal > touchMoveMax.current) {
                        //console.log("3/1 이상")
                        document.querySelector("#" + id + " .innerCont").style.top = "0px";
                    } else {
                        //console.log("3/1 이하")
                        bottomSheet.Closed("#" + id);
                    }
                }
            } else {
                if (popColsedPosVal > touchMoveMax.current) {
                    //console.log("3/1 이상")
                    document.querySelector("#" + id + " .innerCont").style.top = "0px";
                } else {
                    //console.log("3/1 이하");
                    bottomSheet.Closed("#" + id);
                }
            }
        }
    }

    return (
        <>
            <p className='itemEditModeMsg'>{popTitle}</p>
            <p className='itemEditModeClosedArea'><button type='button' className='bottomSheetClosed' onClick={buttonClick}><span className='hidden' >닫기</span></button></p>
            <div className='bottomSheetTitle' onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd}>
                <button className='action_handler' aria-hidden="true"><span className='hidden'>내려서 닫기</span></button>
            </div>
        </>
    );
};


//바텀시트 컨텐츠
const CmpBsCont = (props) => {
    const { children } = props;

    return (
        <div className="bottomSheetCont">
            <div className="innerScroll">
                {children}
            </div>
        </div>
    );
};

//캘린더
const Calendar = ({ option }) => {
    const { setDay, start, end, closedcb, setcb, ID, title, multi, weekend = true, holidays = [] } = option;

    const today = new Date();

    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);

    const [currentDate, setCurrentDate] = useState(new Date(setDay ? new Date(setDay.slice(0, 4), setDay.slice(4, 6) - 1, setDay.slice(6, 8)) : new Date()));
    const [selectedDate, setSelectedDate] = useState(setDay || `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`);

    useEffect(() => {
        if (!setcb) return;

        // 다중 선택 모드일 경우
        if (multi) {
            if (setDay) {
                const dateObj = new Date(setDay.slice(0, 4), setDay.slice(4, 6) - 1, setDay.slice(6, 8));
                setSelectedStartDate(setDay); // 상태 세팅
                setcb({
                    ID,
                    startDate: setDay,
                    startYear: dateObj.getFullYear(),
                    startMonth: String(dateObj.getMonth() + 1).padStart(2, "0"),
                    startDay: String(dateObj.getDate()).padStart(2, "0"),
                    endDate: null,
                    endYear: null,
                    endMonth: null,
                    endDay: null,
                });
            } else {
                setcb({
                    ID,
                    startDate: null,
                    startYear: null,
                    startMonth: null,
                    startDay: null,
                    endDate: null,
                    endYear: null,
                    endMonth: null,
                    endDay: null,
                });
            }
        } else {
            // 단일 선택 모드
            if (selectedDate) {
                const dateObj = new Date(
                    selectedDate.slice(0, 4),
                    selectedDate.slice(4, 6) - 1,
                    selectedDate.slice(6, 8)
                );

                setcb({
                    ID,
                    full: selectedDate,
                    year: dateObj.getFullYear(),
                    month: String(dateObj.getMonth() + 1).padStart(2, "0"),
                    day: String(dateObj.getDate()).padStart(2, "0"),
                });
            }
        }
    }, []);




    const startDate = start ? new Date(start.slice(0, 4), start.slice(4, 6) - 1, start.slice(6, 8)) : new Date(-8640000000000000);
    const endDate = end ? new Date(end.slice(0, 4), end.slice(4, 6) - 1, end.slice(6, 8)) : new Date(8640000000000000);

    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextMonth);
    };

    const handlePrevYear = () => {
        const prevYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);

        if (
            prevYear.getFullYear() > startDate.getFullYear() ||
            (prevYear.getFullYear() === startDate.getFullYear() && prevYear.getMonth() >= startDate.getMonth())
        ) {
            setCurrentDate(prevYear);
        }
    };

    const handleNextYear = () => {
        const nextYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1);

        if (
            nextYear.getFullYear() < endDate.getFullYear() ||
            (nextYear.getFullYear() === endDate.getFullYear() && nextYear.getMonth() <= endDate.getMonth())
        ) {
            setCurrentDate(nextYear);
        }
    };

    const handleToday = () => {
        const todayFormatted = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
        setCurrentDate(new Date()); // 현재 날짜로 설정
        setSelectedDate(todayFormatted); // 오늘 날짜 선택

        if (multi == true) {
            // multi가 true일 때만, startDate와 selectedStartDate 초기화 후 오늘 날짜로 설정
            setSelectedStartDate(todayFormatted);
            setSelectedEndDate("");  // 종료일은 초기화
        }
    };

    const handleDateSelect = (date) => {
        const dateObj = new Date(date.slice(0, 4), date.slice(4, 6) - 1, date.slice(6, 8));

        if (multi == true) {
            //다중 날짜 선택 모드 (시작일 → 종료일 선택)
            if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                // 시작일 선택 (또는 초기화)
                setSelectedStartDate(date);
                setSelectedEndDate(null);
            }
            else if (selectedStartDate && !selectedEndDate) {
                // 종료일 선택 (시작일보다 이후 날짜만 가능)
                if (date > selectedStartDate) {
                    setSelectedEndDate(date);

                    const startYear = selectedStartDate.slice(0, 4);
                    const startMonth = selectedStartDate.slice(4, 6);
                    const startDay = selectedStartDate.slice(6, 8);

                    const endYear = date.slice(0, 4);
                    const endMonth = date.slice(4, 6);
                    const endDay = date.slice(6, 8);

                    closedcb && closedcb({
                        ID: ID,
                        startDate: selectedStartDate,
                        startYear,
                        startMonth,
                        startDay,
                        endDate: date,
                        endYear,
                        endMonth,
                        endDay,
                    });

                    bottomSheet.Closed(`#CalendarPop_${ID}`);
                }
                else {
                    alert("시작일 이전으로 선택이 불가능합니다")
                }
            }
        } else {
            //단일 날짜 선택
            setSelectedDate(date);
            closedcb && closedcb({
                ID: ID,
                full: date,
                year: dateObj.getFullYear(),
                month: String(dateObj.getMonth() + 1).padStart(2, "0"),
                day: String(dateObj.getDate()).padStart(2, "0"),
            });
            bottomSheet.Closed(`#CalendarPop_${ID}`);
        }


    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const daysArray = Array.from({ length: firstDay }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    return (
        <CmpBsArea id={`CalendarPop_${ID}`} popType="calendar">
            <CmpBsTitle popTitle={title || "날짜선택"} />
            <CmpBsCont>
                <div className="calendarArea">
                    <div className="controlsArea">

                        <div className="yearMonthChage">
                            {/* 이전 연도 버튼 */}
                            <button type="button" className="prevM ic20 ic_arrow_20" onClick={handlePrevYear}
                                disabled={
                                    year - 1 < startDate.getFullYear() ||
                                    (year - 1 === startDate.getFullYear() && month < startDate.getMonth())
                                }
                            >
                                <span className="hidden">이전 년도</span>
                            </button>

                            {/* 현재 연 표시 */}
                            <p className="date">{year}</p>

                            {/* 다음 연도 버튼 */}
                            <button type="button" className="nextM ic20 ic_arrow_20" onClick={handleNextYear}
                                disabled={
                                    year + 1 > endDate.getFullYear() ||
                                    (year + 1 === endDate.getFullYear() && month > endDate.getMonth())
                                }
                            >
                                <span className="hidden">다음 년도</span>
                            </button>


                            {/* 이전 월 버튼 */}
                            <button type="button" className="prevM ic20 ic_arrow_20" onClick={handlePrevMonth}
                                disabled={year < startDate.getFullYear() || (year === startDate.getFullYear() && month <= startDate.getMonth())}
                            >
                                <span className="hidden">이전 월</span>
                            </button>


                            {/* 현재 월 표시 */}
                            <p className="date">{String(month + 1).padStart(2, "0")}</p>

                            {/* 다음 월 버튼 */}
                            <button type="button" className="nextM ic20 ic_arrow_20" onClick={handleNextMonth}
                                disabled={year > endDate.getFullYear() || (year === endDate.getFullYear() && month >= endDate.getMonth())}
                            >
                                <span className="hidden">다음 월</span>
                            </button>
                        </div>


                        <button type="button" className="today cmp_button h28" onClick={handleToday}><span className="base">오늘</span></button>
                    </div>
                    <div className="monthArea">
                        <table>
                            <caption className="hidden">캘린더</caption>
                            <thead>
                                <tr>
                                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                                        <th key={day}>{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: Math.ceil(daysArray.length / 7) }, (_, row) => (
                                    <tr key={row}>
                                        {daysArray.slice(row * 7, row * 7 + 7).map((day, index) => {
                                            if (!day) return <td key={index}></td>;
                                            const dateValue = `${year}${String(month + 1).padStart(2, "0")}${String(day).padStart(2, "0")}`;
                                            const dateObject = new Date(year, month, day);

                                            const dayOfWeek = dateObject.getDay(); //주말구분
                                            const isWeekend = (dayOfWeek == 0 || dayOfWeek == 6);
                                            const isHolidays = holidays.includes(dateValue);
                                            const isDisabled = dateObject < startDate || dateObject > endDate || (weekend == false && isWeekend || isHolidays);

                                            return (
                                                <td key={index} className={`${selectedStartDate && selectedEndDate && dateValue > selectedStartDate && dateValue < selectedEndDate ? "rangeDay" : ""}`}>
                                                    <button
                                                        type="button"
                                                        className={`dayBtn
                                                            ${multi ? "" : selectedDate === dateValue ? "selectDay" : ""}
                                                            ${selectedStartDate === dateValue ? "selectDay" : ""}
                                                            ${selectedEndDate === dateValue ? "selectDay" : ""}

                                                            ${selectedStartDate && selectedEndDate && dateValue === selectedStartDate ? "selectDay startDay" : ""}
                                                            ${selectedStartDate && selectedEndDate && dateValue === selectedEndDate ? "selectDay endDay" : ""}
                                                            ${(selectedStartDate && selectedEndDate && dateValue > selectedStartDate && dateValue < selectedEndDate) ? "inRange" : ""}`
                                                        }


                                                        value={dateValue}
                                                        onClick={() => handleDateSelect(dateValue)}
                                                        disabled={isDisabled}
                                                    >
                                                        <span className="base">{String(day)}</span>
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CmpBsCont>
        </CmpBsArea>
    );
};


const CalendarSet = ({ option }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleButtonClick = (e) => {
        e.preventDefault();
        setIsOpen(true);
        bottomSheet.Open(`#CalendarPop_${option.ID}`)
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <StyledDropDown
                type="button"
                id={option.ID}
                className="ub_calendar"
                aria-expanded={isOpen ? "true" : "false"}
                onClick={handleButtonClick}
            >
                <span className="guideText">{option.title}</span>
                <p className="valData"></p>
            </StyledDropDown>

            <Calendar
                option={{
                    ...option,
                    closedcb: (data) => {
                        option.closedcb(data);
                        handleClose();
                    },
                    setcb: option.setcb
                }}
            />
        </>
    );
};

export { Calendar, CalendarSet, CmpBsArea, CmpBsCont, CmpBsTitle, CmpBsTitleEdit };
