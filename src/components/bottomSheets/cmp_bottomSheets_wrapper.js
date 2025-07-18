'use client'

import { bottomSheet } from '@/common/ui_com';
import { CmpBsCont, CmpBsTitle } from '@/components/bottomSheets/cmp_bottomSheets';
import { useEffect, useState } from 'react';
import { StyledBottomSheets } from './cmp_bottomSheets_style';

/*
//바텀시트
const CmpBsArea = (props) => {
    const {id, className, popType, children} = props;
    return (
        <StyledBottomSheets id={id} className={`CmpBottomSheetArea ${className}`} data-poptype={popType}>
            <div className="bottomSheetContArea">
                <div className="innerCont">
                    {children}
                </div>
            </div>
        </StyledBottomSheets>
    );
};

//바텀시트 타이틀
const CmpBsTitle = (props) => {
    const {popTitle} = props;

    return (
        <div className="bottomSheetTitle">
            <button type="button" className="bottomSheetClosed"><span className="hidden">닫기</span></button>
            <p>{popTitle}</p>
        </div>
    );
};

//바텀시트 컨텐츠
const CmpBsCont = (props) => {
    const {children} = props;

    return (
        <div className="bottomSheetCont">
            <div className="innerScroll">
                {children}
            </div>
        </div>
    );
};
*/

//바텀시트 컨텐츠
const CmpBsWrapDefautlCont = (props) => {
    const { popTitle, selectedIdx, disabledItem, sheetData, id, click } = props;

    useEffect(() => {

        if (document.querySelector("[data-callbackid=" + id + "]") !== null) {

            if (selectedIdx !== undefined && selectedIdx > -1) {

                let initObj = document.querySelectorAll("#" + id + " LI[aria-selected=true]")[0];

                document.querySelector("[data-callbackid=" + id + "]").classList.add("active");
                document.querySelector("[data-callbackid=" + id + "] P").innerHTML = initObj.querySelector("P").innerHTML;
            } else {

                document.querySelector("[data-callbackid=" + id + "]").classList.remove("active");
                document.querySelector("[data-callbackid=" + id + "] P").innerHTML = "";

            }
        }

    })

    const checkSelected = (target) => {
        if (selectedIdx === target) {
            return "true";
        } else {
            return "false";
        }
    }

    const optionClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let targetObj = null;
        let clickedIdx = 0;
        let checkedLength = 0;

        targetObj = e.currentTarget;
        if (targetObj !== null) {
            const listItems = document.querySelectorAll("#" + id + " LI");
            clickedIdx = Array.from(listItems).indexOf(targetObj);
            if (clickedIdx === -1) {
                console.warn('바텀쉬트: 선택된 항목을 찾을 수 없습니다.');
                return;
            }
            if (disabledItem !== undefined && disabledItem.idx === clickedIdx) {
                return;
            }
            checkedLength = document.querySelectorAll("#" + id + " LI[aria-selected=true]").length;
            if (checkedLength === 1) {
                const selectedItem = document.querySelectorAll("#" + id + " LI[aria-selected=true]")[0];
                if (selectedItem) {
                    selectedItem.setAttribute("aria-selected", "false");
                }
            }
            const targetListItem = listItems[clickedIdx];
            if (targetListItem) {
                targetListItem.setAttribute("aria-selected", "true");
            } else {
                console.warn('바텀쉬트: 대상 항목을 찾을 수 없습니다. clickedIdx:', clickedIdx);
            }
        }

        if (document.querySelector("[data-callbackid=" + id + "]")) {
            document.querySelector("[data-callbackid=" + id + "]").classList.add("active");
            document.querySelector("[data-callbackid=" + id + "] P").innerHTML = targetObj.querySelector("P").innerHTML;
        }

        let selectedText = targetObj.querySelector("P").innerHTML.replace("<span>", "").replace("</span>", "");
        if (click !== undefined) {
            click({ 'clickedIdx': clickedIdx, 'id': id, 'text': selectedText });
        }

        bottomSheet.Closed("#" + id);
    }

    const disabledItemClass = (target) => {
        if (disabledItem === undefined) return "item";

        if (disabledItem.idx === target) {
            return "item disabled";
        } else {
            return "item";
        }
    }

    const disabledItemText = (target) => {

        if (disabledItem === undefined) return null;

        if (disabledItem.idx === target) {
            return (<p className="errorMsg">예약불가</p>);
        } else {
            return null;
        }
    }

    return (

        <>
            <CmpBsTitle popTitle={popTitle} id={id} />
            <CmpBsCont>
                <ul className="actionSheet_dropDown_list">
                    {
                        sheetData && sheetData.map((item, index) => {
                            return (
                                <li className={disabledItemClass(index)} role="option" aria-selected={checkSelected(index)} data-value={item.dataKey} key={item.dataKey} onClick={optionClick}>
                                    <p className="first_info"><span>{item.dataValue}</span></p>
                                    {disabledItemText(index)}
                                </li>
                            )

                        })
                    }
                </ul>
            </CmpBsCont>
        </>
    );
};

//바텀시트 컨텐츠
const CmpBsWrapDescriptionCont = (props) => {
    const { popTitle, selectedIdx, sheetData, id, click } = props;

    const optionClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let targetObj = null;
        let clickedIdx = 0;
        let checkedLength = 0;

        targetObj = e.currentTarget;

        clickedIdx = Array.from(document.querySelectorAll("#" + id + " LI")).indexOf(targetObj);

        click({ 'clickedIdx': clickedIdx, 'id': id });

        bottomSheet.Closed("#" + id);
    }


    return (

        <>
            <CmpBsTitle popTitle={popTitle} id={id} />
            <CmpBsCont>
                <ul className="actionSheet_dropDown_list">
                    {
                        sheetData && sheetData.map((item, index) => {
                            return (
                                <li className="item" role="option" aria-selected="false" key={index} onClick={optionClick}>
                                    <p className="first_info"><span>{item.dataText}</span></p>
                                    <p className="description">{item.dataDescription}</p>
                                </li>
                            )

                        })
                    }
                </ul>
            </CmpBsCont>
        </>
    );
};

//바텀시트 Linf 컨텐츠(임시)
const CmpBsWrapLinkCont = (props) => {
    const { popTitle, sheetData, id, click } = props;

    const linkClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        click(e.currentTarget.getAttribute("data-dataurl"));
    }
    return (

        <>
            <CmpBsTitle popTitle={popTitle} id={id} />
            <CmpBsCont>
                <ul className="actionSheet_dropDown_list">
                    {
                        sheetData && sheetData.map((item, index) => {
                            return (
                                <li className="item link" role="option" aria-selected="false" key={index}>
                                    <a href="#none" className="first_info linkType" data-dataurl={item.dataUrl} onClick={linkClick}>
                                        <span>{item.dataText}</span><i className="ic16 ic_arrow_16_gray"></i>
                                    </a>
                                </li>
                            )

                        })
                    }
                </ul>
            </CmpBsCont>
        </>
    );
};

//바텀시트 컨텐츠 - 계좌선택용
const CmpBsWrapAccountCont = (props) => {
    const { popTitle, selectedIdx, disabledItem, sheetData, id, click } = props;

    useEffect(() => {
        if (document.querySelector("[data-callbackid=" + id + "]") !== null) {
            console.log('useEffect selectedIdx : ' + selectedIdx)
            if (selectedIdx !== undefined && selectedIdx > -1) {

                if (document.querySelectorAll("#" + id + " li").length > 0) {
                    let initObj = document.querySelectorAll("#" + id + " LI[aria-selected=true]")[0];
                    let initTypeText = initObj?.querySelector(".first_info span")?.textContent;
                    let initValueText = initObj?.querySelector(".description")?.textContent;

                    console.log(initTypeText, initValueText)

                    document.querySelector("[data-callbackid=" + id + "]").classList.add("active");
                    document.querySelector("[data-callbackid=" + id + "] .guideText").textContent = initTypeText;
                    document.querySelector("[data-callbackid=" + id + "] .valData").textContent = initValueText;
                }
            } else {
                document.querySelector("[data-callbackid=" + id + "]").classList.remove("active", "all");
            }
        }

    })

    const checkSelected = (target) => {
        if (selectedIdx === target) {
            return "true";
        } else {
            return "false";
        }
    }

    const optionClick = (e) => {

        let targetObj = null;
        let clickedIdx = 0;
        let checkedLength = 0;

        targetObj = e.currentTarget;
        if (targetObj !== null) {
            const listItems = document.querySelectorAll("#" + id + " LI");
            clickedIdx = Array.from(listItems).indexOf(targetObj);
            if (clickedIdx === -1) {
                console.warn('바텀쉬트: 선택된 항목을 찾을 수 없습니다.');
                return;
            }
            if (disabledItem !== undefined && disabledItem.idx === clickedIdx) {
                return;
            }
            checkedLength = document.querySelectorAll("#" + id + " LI[aria-selected=true]").length;
            if (checkedLength === 1) {
                const selectedItem = document.querySelectorAll("#" + id + " LI[aria-selected=true]")[0];
                if (selectedItem) {
                    selectedItem.setAttribute("aria-selected", "false");
                }
            }
            const targetListItem = listItems[clickedIdx];
            if (targetListItem) {
                targetListItem.setAttribute("aria-selected", "true");
            } else {
                console.warn('바텀쉬트: 대상 항목을 찾을 수 없습니다. clickedIdx:', clickedIdx);
            }
        }

        let selectedTypeText = targetObj.querySelector(".first_info span").textContent;
        let selectedValueText = targetObj.querySelector(".description").textContent;

        if (document.querySelector("[data-callbackid=" + id + "]")) {
            document.querySelector("[data-callbackid=" + id + "]").classList.add("active");

            document.querySelector("[data-callbackid=" + id + "] .guideText").innerHTML = selectedTypeText;
            document.querySelector("[data-callbackid=" + id + "] .valData").innerHTML = selectedValueText;
        }

        if (click !== undefined) {
            click({ 'clickedIdx': clickedIdx, 'id': id, 'typeText': selectedTypeText, 'valueText': selectedValueText });
        }

        bottomSheet.Closed("#" + id);
    }

    const disabledItemClass = (target) => {
        if (disabledItem === undefined) return "item";

        if (disabledItem.idx === target) {
            return "item disabled";
        } else {
            return "item";
        }
    }

    const disabledItemText = (target) => {

        if (disabledItem === undefined) return null;

        if (disabledItem.idx === target) {
            return (<p className="errorMsg">예약불가</p>);
        } else {
            return null;
        }
    }

    return (

        <>
            <CmpBsTitle popTitle={popTitle} id={id} />
            <CmpBsCont>
                <ul className="actionSheet_dropDown_list">
                    {
                        sheetData && sheetData.map((item, index) => {
                            return (
                                <li className={disabledItemClass(index)} role="option" aria-selected={checkSelected(index)} data-value={item.dataKey} key={`${item.dataKey}-${index}`} onClick={optionClick}>
                                    <p className="first_info"><span>{item.dataType}</span></p>
                                    <p className="description">{item.dataValue}</p>
                                    {disabledItemText(index)}
                                </li>
                            )

                        })
                    }
                </ul>
            </CmpBsCont>
        </>
    );
};

//바텀시트 탈력
const CmpBsCalendarArea = (props) => {
    const { id, className, popType, children, popTitle, year, month, dateClick } = props;
    // const {id, className, popType, children, popTitle} = props;

    const [initYear, setInitYear] = useState(null);
    const [initMonth, setInitMonth] = useState(null);
    const [initDate, setInitDate] = useState(null);
    const [today, setToday] = useState(null);
    // const [thisMonthLastDate, setThisMonthLastDate] = useState(null);

    // const [maxWeeks, setMaxWeeks] = useState(null);

    // const [maxDay, setMaxDay] = useState(null);



    useEffect(() => {

        // let initYear = 2024;
        // let initMonth = 2;
        // let initDay = 8;

        if (year === undefined || month === undefined) {
            let tempDate = new Date();
            setInitYear(tempDate.getFullYear());
            setInitMonth(tempDate.getMonth() + 1);
            setInitDate(1);
        } else {
            setInitYear(Number(year));
            setInitMonth(Number(month));
            setInitDate(1);
        }


        setToday(new Date());

    }, [])

    const selectDate = (e) => {
        let targetObj = e.currentTarget;
        console.log(targetObj);

        if (dateClick !== undefined) {
            let returnData = {}
            returnData.year = targetObj.getAttribute("data-year");
            returnData.month = targetObj.getAttribute("data-month");
            returnData.date = targetObj.getAttribute("data-date");
            console.log(returnData);
            dateClick(returnData);
        }
        bottomSheet.Closed("#" + id);
    }

    const drawCalendar = () => {

        if (initYear === null || initMonth === null || initDate === null || today === null) {
            return (
                <></>
            )
        }

        let thisMonthFirst = new Date(initYear, initMonth - 1, 1);
        let nextMonth = new Date(thisMonthFirst.getFullYear(), thisMonthFirst.getMonth() + 1, 1);
        let thisMonthLast = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0);
        let thisMonthLastDate = thisMonthLast.getDate();
        let thisMonthFirstDay = thisMonthFirst.getDay();
        let maxWeeks = Math.ceil((thisMonthFirstDay + thisMonthLastDate) / 7);


        let drawDayIndex = ((thisMonthFirstDay * -1) + 1);

        // console.log(maxWeeks);

        let monthElement = Array();
        let dateElement = null;
        let drawDayText = null;

        const getTodateElement = (paramDrawDayText) => {

            if (Number(initYear) === today.getFullYear() && Number(initMonth) === today.getMonth() + 1 && Number(paramDrawDayText) === today.getDate()) {
                return (<td key={paramDrawDayText}><button type="button" className="dayBtn selectDay" data-year={Number(initYear)} data-month={Number(initMonth)} data-date={Number(paramDrawDayText)} onClick={selectDate}><span className="base">{paramDrawDayText}</span></button></td>)
            } else {
                return (<td key={paramDrawDayText}><button type="button" className="dayBtn" data-year={Number(initYear)} data-month={Number(initMonth)} data-date={Number(paramDrawDayText)} onClick={selectDate}><span className="base">{drawDayText}</span></button></td>)
            }
        }

        const getDateElement = () => {
            dateElement = Array();

            for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
                // console.log(drawDayIndex.current);

                if (drawDayIndex > 0 && thisMonthLastDate >= drawDayIndex) {
                    drawDayText = drawDayIndex;
                    dateElement.push(getTodateElement(drawDayText));
                } else {
                    drawDayText = "";
                    dateElement.push(<td key={drawDayIndex}><button type="button" className="dayBtn"><span className="base">{drawDayText}</span></button></td>)
                }

                drawDayIndex++;
            }
            return (
                dateElement
            )
        }

        let weekIdx = 0;
        for (weekIdx; weekIdx < maxWeeks; weekIdx++) {

            monthElement.push(
                <tr key={weekIdx}>
                    {getDateElement()}
                </tr>
            )

        }

        return (
            monthElement
        )
    }

    const setBeforeMonth = () => {

        let munberYear = Number(initYear);
        let munberMonth = Number(initMonth);

        if (munberMonth === 1) {
            munberYear--;
            munberMonth = 12;
        } else {
            munberMonth--;
        }

        setInitYear(munberYear);
        setInitMonth(munberMonth);
        setInitDate(1);
    }

    const setAfterMonth = () => {

        let munberYear = Number(initYear);
        let munberMonth = Number(initMonth);

        if (munberMonth === 12) {
            munberYear++;
            munberMonth = 1;
        } else {
            munberMonth++;
        }

        setInitYear(munberYear);
        setInitMonth(munberMonth);
        setInitDate(1);

    }

    const setTodate = () => {

        setInitYear(today.getFullYear());
        setInitMonth(today.getMonth() + 1);
        setInitDate(1);

    }

    return (
        <StyledBottomSheets id={id} className={`CmpBottomSheetArea ${className}`} data-poptype={popType}>
            <div className="bottomSheetContArea">
                <div className="innerCont">
                    <CmpBsTitle popTitle={popTitle} id={id} />
                    <CmpBsCont>
                        {/* 팝업 컨텐츠 영역 */}
                        <div className="calendarArea">
                            <div className="controlsArea">
                                <div className="yearMonthChage">
                                    <button type="button" className="prevM ic20 ic_arrow_20" onClick={setBeforeMonth}><span className="hidden">이전 월</span></button>
                                    <p className="date">{initYear}.{(initMonth === null) ? "" : (initMonth < 10) ? "0" + initMonth : initMonth}</p>
                                    <button type="button" className="nextM ic20 ic_arrow_20" onClick={setAfterMonth}><span className="hidden">다음 월</span></button>
                                </div>
                                <button type="button" className="today cmp_button h28" onClick={setTodate}><span className="base">오늘</span></button>
                            </div>
                        </div>
                        <div className="monthArea">
                            <table>
                                <caption className="hidden">캘린더</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">일</th>
                                        <th scope="col">월</th>
                                        <th scope="col">화</th>
                                        <th scope="col">수</th>
                                        <th scope="col">목</th>
                                        <th scope="col">금</th>
                                        <th scope="col">토</th>
                                    </tr>
                                </thead>
                                <tbody>{drawCalendar()}</tbody>
                            </table>
                        </div>
                        {/* 팝업 컨텐츠 영역 */}
                    </CmpBsCont>
                </div>
            </div>
        </StyledBottomSheets>
    );
};

//바텀시트 달력 - 기간조회용
const CmpBsPeriodCalendarArea = (props) => {
    const { id, className, popType, children, popTitle, year, month, dateClick, periodType, selectedDate } = props;

    const [initYear, setInitYear] = useState(null);
    const [initMonth, setInitMonth] = useState(null);
    const [initDate, setInitDate] = useState(null);
    const [today, setToday] = useState(null);
    const [nextMonth, setNextMonth] = useState(true);
    const [chkToday, setChkToday] = useState(false);

    useEffect(() => {
        if (year === undefined || month === undefined) {
            let tempDate = new Date();
            setInitYear(tempDate.getFullYear());
            setInitMonth(tempDate.getMonth() + 1);
            setInitDate(1);
        } else {
            setInitYear(Number(year));
            setInitMonth(Number(month));
            setInitDate(1);
        }
        setToday(new Date());
    }, [])

    useEffect(() => {
        if (periodType && today) {
            const todayMonth = today.getMonth() + 1;
            const todayYear = today.getFullYear();

            if (initYear < todayYear || (initYear === todayYear && initMonth < todayMonth)) {
                setNextMonth(true);
            } else {
                setNextMonth(false);
            }
        } else {
            setNextMonth(true);
        }
    }, [initYear, initMonth, today, periodType])

    const selectDate = (e) => {
        let targetObj = e.currentTarget;
        if (periodType) {
            const currentYear = Number(targetObj.getAttribute("data-year"));
            const currentMonth = Number(targetObj.getAttribute("data-month"));
            const currentDate = Number(targetObj.getAttribute("data-date"));
            const currentDateObj = new Date(currentYear, currentMonth - 1, currentDate);

            if (currentDateObj > today) {
                return;
            }
        }

        if (dateClick !== undefined) {
            let returnData = {}
            returnData.year = targetObj.getAttribute("data-year");
            returnData.month = targetObj.getAttribute("data-month");
            returnData.date = targetObj.getAttribute("data-date");
            dateClick(returnData);
        }

        if (chkToday) {
            setChkToday(false);
        }

        bottomSheet.Closed("#" + id);
    }

    const drawCalendar = () => {

        if (initYear === null || initMonth === null || initDate === null || today === null) {
            return (
                <></>
            )
        }

        let thisMonthFirst = new Date(initYear, initMonth - 1, 1);
        let nextMonth = new Date(thisMonthFirst.getFullYear(), thisMonthFirst.getMonth() + 1, 1);
        let thisMonthLast = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0);
        let thisMonthLastDate = thisMonthLast.getDate();
        let thisMonthFirstDay = thisMonthFirst.getDay();
        let maxWeeks = Math.ceil((thisMonthFirstDay + thisMonthLastDate) / 7);
        let drawDayIndex = ((thisMonthFirstDay * -1) + 1);
        let monthElement = Array();
        let dateElement = null;
        let drawDayText = null;

        const selectedDateObj = selectedDate.split('.');
        const selectedDateObjYear = Number(selectedDateObj[0]);
        const selectedDateObjMonth = Number(selectedDateObj[1]);
        const selectedDateObjDay = Number(selectedDateObj[2]);

        const getTodateElement = (paramDrawDayText) => {
            const isFutureDate = new Date(initYear, initMonth - 1, paramDrawDayText) > today;
            const isDisabled = periodType && isFutureDate;
            const isToday = chkToday && Number(initYear) === today.getFullYear() && Number(initMonth) === today.getMonth() + 1 && Number(paramDrawDayText) === today.getDate();
            const isSelected = !chkToday && Number(initYear) === selectedDateObjYear && Number(initMonth) === selectedDateObjMonth && Number(paramDrawDayText) === selectedDateObjDay;
            const todayClass = isToday ? 'selectToday' : '';
            const todayText = isToday ? paramDrawDayText : drawDayText;
            const selectedClass = isSelected ? 'selectDay' : '';

            return (
                <td key={paramDrawDayText}>
                    <button type="button" className={`dayBtn ${todayClass} ${selectedClass}`} data-year={Number(initYear)} data-month={Number(initMonth)} data-date={Number(paramDrawDayText)} onClick={selectDate} disabled={isDisabled}>
                        <span className="base">{todayText}</span>
                    </button>
                </td>
            )
        }

        const getDateElement = () => {
            dateElement = Array();

            for (let dayIdx = 0; dayIdx < 7; dayIdx++) {

                if (drawDayIndex > 0 && thisMonthLastDate >= drawDayIndex) {
                    drawDayText = drawDayIndex;
                    dateElement.push(getTodateElement(drawDayText));
                } else {
                    drawDayText = "";
                    dateElement.push(<td key={drawDayIndex}><button type="button" className="dayBtn"><span className="base">{drawDayText}</span></button></td>)
                }

                drawDayIndex++;
            }
            return (
                dateElement
            )
        }

        let weekIdx = 0;
        for (weekIdx; weekIdx < maxWeeks; weekIdx++) {
            monthElement.push(
                <tr key={weekIdx}>
                    {getDateElement()}
                </tr>
            )
        }

        return (
            monthElement
        )
    }

    const setBeforeMonth = () => {

        let munberYear = Number(initYear);
        let munberMonth = Number(initMonth);

        if (munberMonth === 1) {
            munberYear--;
            munberMonth = 12;
        } else {
            munberMonth--;
        }

        setInitYear(munberYear);
        setInitMonth(munberMonth);
        setInitDate(1);
    }

    const setAfterMonth = () => {

        let munberYear = Number(initYear);
        let munberMonth = Number(initMonth);

        if (periodType) {
            const todayMonth = today.getMonth() + 1;
            const todayYear = today.getFullYear;

            if (munberYear > todayYear || (munberYear === todayYear && munberMonth >= todayMonth)) {
                return;
            }
        }

        if (munberMonth === 12) {
            munberYear++;
            munberMonth = 1;
        } else {
            munberMonth++;
        }

        setInitYear(munberYear);
        setInitMonth(munberMonth);
        setInitDate(1);
    }

    const setTodate = () => {
        setInitYear(today.getFullYear());
        setInitMonth(today.getMonth() + 1);
        setInitDate(1);
        setChkToday(true);
    }

    return (
        <StyledBottomSheets id={id} className={`CmpBottomSheetArea ${className}`} data-poptype={popType}>
            <div className="bottomSheetContArea">
                <div className="innerCont">
                    <CmpBsTitle popTitle={popTitle} id={id} />
                    <CmpBsCont>
                        {/* 팝업 컨텐츠 영역 */}
                        <div className="calendarArea">
                            <div className="controlsArea">
                                <div className="yearMonthChage">
                                    <button type="button" className="prevM ic20 ic_arrow_20" onClick={setBeforeMonth}><span className="hidden">이전 월</span></button>
                                    <p className="date">{initYear}.{(initMonth === null) ? "" : (initMonth < 10) ? "0" + initMonth : initMonth}</p>
                                    <button type="button" className="nextM ic20 ic_arrow_20" onClick={setAfterMonth} disabled={!nextMonth}><span className="hidden">다음 월</span></button>
                                </div>
                                <button type="button" className="today cmp_button h28" onClick={setTodate}><span className="base">오늘</span></button>
                            </div>
                        </div>
                        <div className="monthArea">
                            <table>
                                <caption className="hidden">캘린더</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">일</th>
                                        <th scope="col">월</th>
                                        <th scope="col">화</th>
                                        <th scope="col">수</th>
                                        <th scope="col">목</th>
                                        <th scope="col">금</th>
                                        <th scope="col">토</th>
                                    </tr>
                                </thead>
                                <tbody>{drawCalendar()}</tbody>
                            </table>
                        </div>
                        {/* 팝업 컨텐츠 영역 */}
                    </CmpBsCont>
                </div>
            </div>
        </StyledBottomSheets>
    );
};

export { CmpBsCalendarArea, CmpBsPeriodCalendarArea, CmpBsWrapAccountCont, CmpBsWrapDefautlCont, CmpBsWrapDescriptionCont, CmpBsWrapLinkCont };
