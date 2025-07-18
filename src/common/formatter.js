
/**
 * @File Name      : formatter.js
 * @File path      : src/common/formatter.js
 * @author         : 정선우
 * @Description    : 데이터 포매팅 유틸리티
 *                   - 숫자, 날짜, 시간, 계좌번호 등의 포매팅 함수
 *                   - 다양한 형식의 데이터를 사용자 친화적인 형태로 변환
 *                   - 은행별 계좌번호 포맷팅 및 마스킹 기능
 * @History        : 20250701  최초 신규
 **/

import { util } from "@/common/com_util";

/**
 * 데이터 포매팅 유틸리티 객체
 * 다양한 데이터 형식을 사용자 친화적인 형태로 변환하는 함수들을 제공
 */
const formatter = {
    /**
     * 초기화 함수
     */
    init: () => {

    },

    /**
     * 숫자 포매팅 (천단위 콤마)
     * 1234567.908의 숫자를 "1,234,567.908"형식으로 포매팅
     * @param {string|number} dat - 포매팅할 숫자
     * @returns {string} 천단위 콤마가 포함된 문자열
     */
    number: (dat) => {
        if (typeof dat == "string") dat = Number(dat);
        if (typeof dat == "number") dat = String(dat);

        let signflag = "";
        if (String(dat).substring(0, 1) == "+") {
            dat = String(dat).substring(1);
        } else if (String(dat).substring(0, 1) == "-") {
            signFlag = "-";
            dat = String(dat).substring(1);
        }

        let eg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                         // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌
            // 값으로 변환시킴
        }

        return signflag + dat;                          // 바뀐 dat 값을 반환
    },

    /**
     * 소수점 포매팅
     * @param {string|number} dat - 포매팅할 숫자
     * @param {number} point_size - 소수점 자리수
     * @param {number} fix_size - 고정 소수점 자리수
     * @returns {string} 포매팅된 소수점 문자열
     */
    decimal: function (dat, point_size, fix_size) {
        if (typeof dat == "number") dat = String(dat);
        if (dat == "") {
            return "";
        }
        if (dat == "0") {
            dat = util.lpad(dat, point_size, '0');
        }
        var signflag = "";
        if (String(dat).substring(0, 1) == "+") {
            dat = String(dat).substring(1);
            dat = util.lpad(String(dat).substring(1), dat.length, "0");
        } else if (String(dat).substring(0, 1) == "-") {
            signflag = "-";
            dat = util.lpad(String(dat).substring(1), dat.length, "0");
        }

        // 소숫점 자리수 FIX
        if (fix_size != null && fix_size != undefined) {
            if (dat.length < point_size) {
                var zero = "";
                for (var i = 0; i < point_size - dat.length; i++) {
                    zero += "0";
                }
                var _data = zero + dat;
                dat = "0." + _data.substring(0, fix_size);
            } else {
                dat = Number(dat.substring(0, dat.length - point_size)) + "." + String(dat.substring(dat.length - point_size).substring(0, fix_size));
            }
        } else {
            if (dat.length < point_size) {
                var zero = "";
                for (var i = 0; i < point_size - dat.length; i++) {
                    zero += "0";
                }
                dat = "0." + zero + dat;
            } else {
                dat = Number(dat.substring(0, dat.length - point_size)) + "." + String(dat.substring(dat.length - point_size));
            }
        }
        var reg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                         // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌
            // 값으로 변환시킴
        }
        return signflag + dat;                          // 바뀐 dat 값을 반환.
    },

    /**
     * 날짜 포매팅 (점 구분자)
     * "yyyymmdd" 형식의 문자열을 "yyyy.mm.dd"로 포매팅
     * @param {string} dat - 포매팅할 날짜 문자열
     * @returns {string} 포매팅된 날짜 문자열
     */
    date: function (dat) {
        if (!dat) return dat;

        if (dat.length == 4) dat = dat.substring(0, 2) + "." + dat.substring(2, 4);  // 20180103 추가
        if (dat.length == 6) dat = dat.substring(0, 4) + "." + dat.substring(4, 6);
        if (dat.length == 8) dat = dat.substring(0, 4) + "." + dat.substring(4, 6) + "." + dat.substring(6, 8);

        return dat;
    },

    /**
     * 시간 포매팅 (콜론 구분자)
     * "hhmmss" 형식의 문자열을 "hh:mm:ss"로 포매팅
     * @param {string} dat - 포매팅할 시간 문자열
     * @returns {string} 포매팅된 시간 문자열
     */
    time: function (dat) {

        if (!dat) return dat;

        if (dat.length == 8) dat = dat.substring(0, 2) + ":" + dat.substring(2, 4) + ":" + dat.substring(4, 6) + "." + dat.substring(6, 8);
        if (dat.length == 6) dat = dat.substring(0, 2) + ":" + dat.substring(2, 4) + ":" + dat.substring(4, 6);
        if (dat.length == 4) dat = dat.substring(0, 2) + ":" + dat.substring(2, 4);		// fellowe
        // 추가.
        // 2012.12.17

        return dat;
    },

    /**
     * 날짜 포매팅 (한글 형식)
     * "yyyymmdd" 형식의 문자열을 "mm월dd일"로 포매팅
     * @param {string} dat - 포매팅할 날짜 문자열
     * @returns {string} 한글 형식의 날짜 문자열
     */
    date1: function (dat) {
        if (!dat) return dat;

        if (dat.length == 6) dat = dat.substring(4, 6) + "월";
        if (dat.length == 8) dat = dat.substring(4, 6) + "월" + dat.substring(6, 8) + "일";

        return dat;
    },

    /**
     * 시간 포매팅 (한글 형식)
     * "hhmmss" 형식의 문자열을 "hh시mm분"로 포매팅
     * @param {string} dat - 포매팅할 시간 문자열
     * @returns {string} 한글 형식의 시간 문자열
     */
    time1: function (dat) {

        if (!dat) return dat;

        if (dat.length == 8) dat = dat.substring(0, 2) + "시" + dat.substring(2, 4) + "분";
        if (dat.length == 6) dat = dat.substring(0, 2) + "시" + dat.substring(2, 4) + "분";
        if (dat.length == 4) dat = dat.substring(0, 2) + "시" + dat.substring(2, 4) + "분";

        return dat;
    },

    /**
     * 날짜+시간 포매팅
     * @param {string} date - 포매팅할 날짜+시간 문자열
     * @param {string} format - 포맷 형식 (기본값: "yyyy.mm.dd hh24:mi:ss")
     * @returns {string} 포매팅된 날짜+시간 문자열
     */
    datetime: function (date, format) {
        if (!format) {
            format = "yyyy.mm.dd hh24:mi:ss";
        }

        if (!date) {
            return "";
        }

        // 이미 포맷팅 되어있는값을 삭제한다.
        date = date.replace(/[^0-9]/g, "");
        if (date.length == 8) {
            return formatter.date(date);
        }

        // 입력된 날짜의 길이가 포맷팅되어야 하는 길이보다 작으면 뒤에 0을 붙인다.
        var formatLength = format.replace(/[^a-z]/g, "").length;
        var dateLength = date.length;
        for (var i = 0; i < formatLength - dateLength; i++) {
            date += '0';
        }

        if (format.replace(/[^a-z]/g, "") == "hhmiss" && date.length == 6) {
            date = "00000000" + date;
        }

        var idx = format.indexOf("yyyy");
        if (idx > -1) {
            format = format.replace("yyyy", date.substring(0, 4));
        }
        idx = format.indexOf("yy");
        if (idx > -1) {
            format = format.replace("yy", date.substring(2, 4));
        }
        idx = format.indexOf("mm");
        if (idx > -1) {
            format = format.replace("mm", date.substring(4, 6));
        }
        idx = format.indexOf("dd");
        if (idx > -1) {
            format = format.replace("dd", date.substring(6, 8));
        }
        idx = format.indexOf("hh24");
        if (idx > -1) {
            format = format.replace("hh24", date.substring(8, 10));
        }
        idx = format.indexOf("hh");
        if (idx > -1) {
            var hours = date.substring(8, 10);
            hours = parseInt(hours, 10) <= 12 ? hours : "0" + String(parseInt(hours, 10) - 12);
            format = format.replace("hh", hours);
        }
        idx = format.indexOf("mi");
        if (idx > -1) {
            format = format.replace("mi", date.substring(10, 12));
        }
        idx = format.indexOf("ss");
        if (idx > -1) {
            format = format.replace("ss", date.substring(12));
        }
        idx = format.indexOf("EEE");
        if (idx > -1) {
            var weekstr = '일월화수목금토'; // 요일 스트링

            var day = weekstr.substr(new Date(date.substring(0, 4), new Number(date.substring(4, 6)) - 1, date.substring(6, 8)).getDay(), 1);
            format = format.replace("EEE", day);
        }

        return format;
    },

    /**
     * 계좌번호 포매팅
     * 이미 포매팅 되어있을경우 제거후 다시 포매팅함
     * @param {string} dat - 계좌번호
     * @param {Array} arg - Array형식의 계좌번호 자리수를 입력한다. 해당 자리수별로 파싱해서 포매팅함
     * @param {string} bankcd - 은행코드
     * @param {boolean} isMask - 마스킹 여부
     * @returns {string} 포매팅된 계좌번호
     *
     * 사용예)
     * formatter.account( "0000516210427933") ==> 결과 : "516-21-0427933"
     * formatter.account( "0001516210427933") ==> 결과 : "1516-21-0427933"
     * formatter.account( "0123456789", [3,3,4]) ==> 결과 : "012-345-6789"
     * formatter.account( "01234567890", [3,3,4]) ==> 결과 : "012-345-6789-0"
     * formatter.account( "0123456", [3,3,4]) ==> 결과 : "012-345-6"
     */
    account: function (dat, arg, bankcd, isMask) {
        if (typeof arg != "string") arg = null;
        if (!dat) return dat;

        if (bankcd != null && bankcd != undefined && bankcd != "" && bankcd.length == 3) {
            if (!util.getJbBankYn(bankcd)) {
                if (typeof isMask == "boolean" && isMask == true) {
                    return dat.substring(0, dat.length - 4) + "***" + dat.substring(dat.length - 1);
                } else {
                    return dat;
                }
            }
        }

        var str = "";
        if (arg == null || arg == undefined || arg == "") {        // || !arg
            // 포맷이 없는 경우 Default 로 처리한다. 기본 처리
            if (dat.length == 16) {
                if (dat.substring(0, 3) == "000") {
                    // 신계좌번호
                    if (dat.substring(3, 4) != "0") {
                        str = dat.substring(3, 7) + "-" + dat.substring(7, 9) + "-" + dat.substring(9, 16);
                        // 구계좌번호
                    } else {
                        str = dat.substring(4, 7) + "-" + dat.substring(7, 9) + "-" + dat.substring(9, 16);
                    }
                } else {
                    // 카드번호 [4-4-4-4]
                    // str = dat.substring(0,4) + "-" + dat.substring(4,8) + "-"
                    // + dat.substring(8,12) + "-" + dat.substring(12, 16);
                    str = dat.substring(0, 4) + "-" + "****" + "-" + "****" + "-" + dat.substring(12, 16);
                }
            } else if (dat.length == 12) {
                str = dat.substring(0, 3) + "-" + dat.substring(3, 5) + "-" + dat.substring(5);
            } else if (dat.length == 13) {
                str = dat.substring(0, 4) + "-" + dat.substring(4, 6) + "-" + dat.substring(6);
            } else {
                if (dat.substring(0, 1) == "0" && dat.length >= 9 && dat.length <= 11) {   // 편리한계좌
                    str = dat;
                } else {
                    if (dat.substring(0, 3) == "000") {
                        if (dat.substring(0, 4) == "0000") {
                            str = dat.substring(4);
                        } else {
                            str = dat.substring(3);
                        }
                    } else {
                        str = dat;
                    }

                }
            }

            if (typeof isMask == "boolean" && isMask == true) {
                return str.substring(0, str.length - 4) + "***" + str.substring(str.length - 1);
            }

            return str;
        }


        // number 타입이면 String 타입으로 변경
        if (typeof dat == "number") {
            dat = String(dat);
            // 이미 포매팅되어있을경우 제거한다.
        } else if (/[^0-9]/g.test(dat)) {
            dat = dat.replace(/[^0-9]/g, "");
        }

        var rArr = [];
        var startIdx = 0;
        for (var i = 0; i < arg.length; i++) {
            if (!!dat.substr(startIdx, arg[i])) {
                rArr.push(dat.substr(startIdx, arg[i]));
            }

            startIdx += arg[i];
        }

        if (!!dat.substr(startIdx)) {
            rArr.push(dat.substr(startIdx));
        }

        for (var i = 0; i < rArr.length; i++) {
            if (i == 0) { str = rArr[i]; }
            else { str += "-" + rArr[i]; }
        }

        return str;
    },
    accountMask: function (dat, arg, bankcd, isMask) {
        //return formatter.account(dat, arg, bankcd, true);

        // 위의 account 의 마스킹 버전입니다.
        // 마스킹 포멧이 기존 NNNN-NN-NNN***N 에서 NNNN-NN-***NNNN 으로 변경 됩니다.
        // 본 메소드 추가는 util.makeOption와 같이 argument를 별도로 받을 수 없는 경우에 쓰기 위하여 만들어 졌습니다.

        isMask = true; // 추후  위 account 메소드와 다른점을 없애기 위하여 isMask를 그냥 true로 선언하고 사용합니다.

        if (typeof arg != "string") arg = null;
        if (!dat) return dat;

        if (bankcd != null && bankcd != undefined && bankcd != "" && bankcd.length == 3) {
            if (!util.getJbBankYn(bankcd)) {
                if (typeof isMask == "boolean" && isMask == true) {
                    // alert(dat.substring(0,dat.length-4) + "***" + dat.substring(dat.length-1));
                    //return dat.substring(0,dat.length-4) + "***" + dat.substring(dat.length-1);
                    return dat.substring(0, dat.length - 7) + "***" + dat.substring(dat.length - 4);
                } else {
                    return dat;
                }
            }
        }

        var str = "";
        if (arg == null || arg == undefined || arg == "") {        // || !arg
            // 포맷이 없는 경우 Default 로 처리한다. 기본 처리
            if (dat.length == 16) {
                if (dat.substring(0, 3) == "000") {
                    // 신계좌번호
                    if (dat.substring(3, 4) != "0") {
                        str = dat.substring(3, 7) + "-" + dat.substring(7, 9) + "-" + dat.substring(9, 16);
                        // 구계좌번호
                    } else {
                        str = dat.substring(4, 7) + "-" + dat.substring(7, 9) + "-" + dat.substring(9, 16);
                    }
                } else {
                    // 카드번호 [4-4-4-4]
                    // str = dat.substring(0,4) + "-" + dat.substring(4,8) + "-"
                    // + dat.substring(8,12) + "-" + dat.substring(12, 16);
                    str = dat.substring(0, 4) + "-" + "****" + "-" + "****" + "-" + dat.substring(12, 16);
                }
            } else if (dat.length == 12) {
                str = dat.substring(0, 3) + "-" + dat.substring(3, 5) + "-" + dat.substring(5);
            } else if (dat.length == 13) {
                str = dat.substring(0, 4) + "-" + dat.substring(4, 6) + "-" + dat.substring(6);
            } else {
                if (dat.substring(0, 3) == "000") {
                    if (dat.substring(0, 4) == "0000") {
                        str = dat.substring(4);
                    } else {
                        str = dat.substring(3);
                    }
                } else {
                    str = dat;
                }
            }

            if (typeof isMask == "boolean" && isMask == true) {
                //return str.substring(0,str.length-4) + "***" + str.substring(str.length-1);
                return str.substring(0, str.length - 7) + "***" + str.substring(str.length - 4);
            }

            return str;
        }


        // number 타입이면 String 타입으로 변경
        if (typeof dat == "number") {
            dat = String(dat);
            // 이미 포매팅되어있을경우 제거한다.
        } else if (/[^0-9]/g.test(dat)) {
            dat = dat.replace(/[^0-9]/g, "");
        }

        var rArr = [];
        var startIdx = 0;
        for (var i = 0; i < arg.length; i++) {
            if (!!dat.substr(startIdx, arg[i])) rArr.push(dat.substr(startIdx, arg[i]));

            startIdx += arg[i];
        }
        if (!!dat.substr(startIdx)) {
            rArr.push(dat.substr(startIdx));
        }

        for (var i = 0; i < rArr.length; i++) {
            if (i == 0) str = rArr[i];
            else str += "-" + rArr[i];
        }

        return str;

    }
    , numberNonPoint: function (dat) {
        var data = String(dat);
        if (data.indexOf(".") > -1) {
            data = data.substring(0, data.indexOf("."));
        }
        return formatter.number(data);
    }

    // 금액
    // 1234567.908의 숫자를 "12,345,67.908"형식으로 포매팅한다.
    , currency: function (dat) {
        if (typeof dat == "string") dat = Number(dat);	// fellowe 추가.
        // 2012.12.17
        if (typeof dat == "number") dat = String(dat);

        if (jex.isNull(dat)) dat = "0";

        var reg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                          // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌
            // 값으로 변환시킴
        }
        var won_disp = " 원";
        if (!(_LANG_TYPE_ == "DF" || _LANG_TYPE_ == "KO" || _LANG_TYPE_ == "KR")) {
            won_disp = " KRW";
        }

        return dat + won_disp;                              // 바뀐 dat 값을 반환.
    }

    , div100: function (dat) {
        if (typeof dat == "string") { dat = Number(dat); }	// fellowe 추가.

        if (dat < 100) {
            return dat;
        }

        dat = formatter.number(dat / 100);
        return dat;
    }

    , div100000: function (dat) {
        if (typeof dat == "string") { dat = Number(dat); }

        if (dat < 100000) {
            return dat;
        }

        dat = formatter.number(dat / 100000);
        return dat;
    }

    // 퍼센트
    // 1234567.908의 숫자를 "12,345,67.908%"형식으로 포매팅한다.
    , percent: function (dat) {
        if (typeof dat == "string") { dat = Number(dat); }	// fellowe 추가.
        if (typeof dat == "number") { dat = String(dat); }

        var reg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                          // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌
            // 값으로 변환시킴
        }

        return dat + " %";                               // 바뀐 dat 값을 반환.
    }

    // 01011111111의 숫자를 "010-1111-****"형식으로 포매팅한다.
    // 0632222323의 숫자를 "063-222-****"형식으로 포매팅한다.
    // "0505"국번 추가되어 4-4-4 형태 포매팅
    , phone: (dat, donMask) => {
        if (dat == null || dat == "") return "";
        if (dat.length > 12 || dat.length < 9) return dat;
        let len = dat.length;

        // 마스킹하지 않음
        if (donMask) {
            if (dat.substring(0, 2) == "02") {
                if (len == 9) return dat.substring(0, 2) + "-" + dat.substring(2, 5) + "-" + dat.substring(5);
                else if (len == 10) return dat.substring(0, 2) + "-" + dat.substring(2, 6) + "-" + dat.substring(6);
            } else if (dat.substring(0, 4) == "0505") {
                if (len == 11) return dat.substring(0, 4) + "-" + dat.substring(4, 7) + "-" + dat.substring(7);
                else if (len == 12) return dat.substring(0, 4) + "-" + dat.substring(4, 8) + "-" + dat.substring(8);
            } else {
                if (len == 11) return dat.substring(0, 3) + "-" + dat.substring(3, 7) + "-" + dat.substring(7, dat.length);
                else if (len == 10) return dat.substring(0, 3) + "-" + dat.substring(3, 6) + "-" + dat.substring(6, dat.length);
            }
        } else {
            if (dat.substring(0, 2) == "02") {
                if (len == 9) return dat.substring(0, 2) + "-" + dat.substring(2, 5) + "-****";
                else if (len == 10) return dat.substring(0, 2) + "-" + dat.substring(2, 6) + "-****";
            } else if (dat.substring(0, 4) == "0505") {
                if (len == 11) return dat.substring(0, 4) + "-" + dat.substring(4, 7) + "-****";
                else if (len == 12) return dat.substring(0, 4) + "-" + dat.substring(4, 8) + "-****";
            } else {
                if (len == 11) return dat.substring(0, 3) + "-" + dat.substring(3, 7) + "-****";
                else if (len == 10) return dat.substring(0, 3) + "-" + dat.substring(3, 6) + "-****";
            }
        }
    }
    , phone2: function (dat, donMask) {
        if (dat == null || dat == "") return "";
        dat = String(dat).replaceAll("-", "");
        if (dat.length > 11 || dat.length < 9) return dat;

        var len = dat.length;

        // 마스킹하지 않음
        if (donMask) {
            return dat.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
        } else {
            if (dat.substring(0, 2) == "02") {
                if (len == 9) return dat.substring(0, 2) + "-" + dat.substring(2, 5) + "-" + dat.substring(5, 7) + "**";
                else if (len == 10) return dat.substring(0, 2) + "-" + dat.substring(2, 6) + "-" + dat.substring(6, 8) + "**";
            } else {
                if (len == 11) return dat.substring(0, 3) + "-" + dat.substring(3, 7) + "-" + dat.substring(7, 9) + "**";
                else if (len == 10) return dat.substring(0, 3) + "-" + dat.substring(3, 6) + "-" + dat.substring(6, 8) + "**";
            }
        }
    }
    // 주민등록번호 포매팅
    , jumin: function (dat) {

        if (dat == null) return "";
        dat = util.trim(dat);
        // if ( dat.length == 14 || dat.length == 13 ) { return
        // dat.substring(0,6) + "-*******"; }

        dat = formatter.juminBsno(dat);

        return dat;
    }
    // 사업자번호 포매팅
    , bsno: function (dat) {

        if (dat == null) return "";
        dat = util.trim(dat);
        if (dat.length == 10 || dat.length == 12) {
            dat = $.trim(dat);
            dat = dat.replaceAll("-", "");
            return dat.substring(0, 3) + "-" + dat.substring(3, 5) + "-*****";
        }
        return dat;
    }

    , juminBsno: function (dat) {

        if (dat == null) return "";
        dat = util.trim(dat);
        if (dat.length == 14 || dat.length == 13) {
            dat = dat.replaceAll("-", "");
            return dat.substring(0, 6) + "-*******";
        }

        if (dat.length == 10 || dat.length == 12) {
            dat = $.trim(dat);
            dat = dat.replaceAll("-", "");
            return dat.substring(0, 3) + "-" + dat.substring(3, 5) + "-*****";
        }
        return dat;
    }

    // 사업자번호 포매팅
    , bsnonotmasking: function (dat) {

        if (dat == null) return "";
        if (dat.length == 10 || dat.length == 12) {
            dat = $.trim(dat);
            dat = dat.replaceAll("-", "");
            return dat.substring(0, 3) + "-" + dat.substring(3, 5) + "-" + dat.substring(5);
        }
        return dat;
    }

    // 전자어음
    , noteno: function (dat) {
        if (dat == null) return "";
        if (dat.length == 20) {
            dat = $.trim(dat);
            dat = dat.replaceAll("-", "");
            return dat.substring(0, 3) + "-" + dat.substring(3, 11) + "-" + dat.substring(11);
        }
        return dat;
    }

    // 발행번호
    , issuno: function (dat) {
        if (dat == null) return "";
        if (dat.length == 7 || dat.length == 8) {
            dat = $.trim(dat);
            dat = dat.replaceAll("-", "");
            return dat.substring(0, 3) + "-" + dat.substring(3);
        }
        return dat;
    }


    // 가맹점 포매팅
    , merc: function (dat) {

        if (dat == null) return "";
        if (dat.length == 12) {
            dat = dat.replaceAll("-", "");
            return dat.substring(0, 3) + "-" + dat.substring(3, 6) + "-" + dat.substring(6);
        }

        return dat;
    }
    // 카드 포매팅
    , card: function (dat, ismask) {
        if (dat == null) return "";
        dat = dat.replaceAll("-", "");
        if (dat.length == 16) {
            if (ismask) {
                return dat.substring(0, 4) + "-" + "****" + "-" + "****" + "-" + dat.substring(12, 16);
            } else {
                return dat.substring(0, 4) + "-" + dat.substring(4, 8) + "-" + dat.substring(8, 12) + "-" + dat.substring(12, 16);
            }

        }

        return dat;
    }
    // 우편형식
    // "123456" 형식의 문자열을 "123-456"로 포매팅한다.
    , adrsNo: function (dat) {
        if (!dat) return dat;
        dat = String(dat).replaceAll("-", "");
        dat = dat.substring(0, 3) + "-" + dat.substring(3, 6);
        return dat;
    }
    // 보안매체일련번호 masking
    , secumedianomasking: function (dat) {
        if (dat == null) return "";

        var rtndat = "";
        if (dat.length > 6) {
            rtndat = dat.substring(0, 2);

            for (var i = 0; i < dat.length - 6; i++) {
                rtndat += "*";
            }

            rtndat += dat.substring(dat.length - 4);

            return rtndat;
        } else {

            return dat;

        }

    },
    emailMasking: function (email) {
        if (email === null || email === undefined || email.trim() === "") {
            return "";
        }

        if (email.indexOf("@") === -1) {
            return "";
        }

        var subEmail = email.split("@");

        var frontEmail = subEmail[0];

        var maskEmail = frontEmail.substring(0, 2);

        for (var i = 0; i < frontEmail.length - 2; i++) {
            maskEmail += "*";
        }

        maskEmail = maskEmail + "@" + subEmail[1];

        return maskEmail;
    }
}

export { formatter };
