/**
 * @File Name      : com_util.js
 * @File path      : src/common/com_util.js
 * @author         : 정선우
 * @Description    : 공통 유틸리티 함수들을 정의
 *                   - HTTP 상태 코드 매핑 및 에러 메시지 관리
 *                   - 은행 정보 및 코드 관리 (전국 은행/증권사 정보)
 *                   - 계좌번호 포맷팅 및 마스킹 기능
 *                   - 로컬 스토리지 관리 및 데이터 저장/조회
 *                   - 날짜/시간 포맷팅 및 유효성 검증
 *                   - 문자열 처리 및 데이터 변환 함수들
 * @History        : 20250701  최초 신규
 **/

import storage from "@/app/shared/utils/storage";

// 첫 로드 여부 체크 변수
let loadedFirstTime = null;

/**
 * HTTP 상태 코드 매핑 객체
 * - 각 HTTP 상태 코드에 대한 한글 메시지 제공
 * - 네트워크 에러, 클라이언트 에러, 서버 에러 등 분류
 * - 사용자 친화적인 에러 메시지로 변환하여 표시
 */
var httpStatus = {
    //Network Error
    '0': '일시적으로 통신이 원할하지 않습니다. <br>잠시 후 시도해 주세요.',
    // 1XX Infomational
    '100': 'Continue',
    '101': 'Switching Protcols',
    '102': 'Processing',
    '122': 'Request-URI too long',
    //2XX Success
    '200': 'OK',
    '201': 'Created',
    '203': 'Non-Authoritative Information',	//HTTP 1.1
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    //3XX Redirection
    '300': 'Multiple Choice',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Switch Proxy',
    '307': 'Temporary Redirect',

    //4XX Client Error
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Percondition Failed',
    '413': 'Request Entity Too Large',
    '414': 'Request-URI too long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '422': 'Unprocessable Entity',
    '423': 'Locked',
    '424': 'Failed Dependency',
    '425': 'Unordered Collection',
    '426': 'Upgrade Required',
    '449': 'Retry With',
    '450': 'Blocked',

    //5XX Server Error
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Server Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported',
    '506': 'Variant Also Negotiates',
    '507': 'Insufficient Storage',
    '509': 'Bandwidth Limit Exceeded',
    '510': 'Not Extended',

    //Unknown Error
    'error': 'Unknown'
};

/**
 * 은행 정보 배열
 * - 은행 코드, 은행명, 별칭, 제거 문자열 등을 포함
 * - 계좌번호 포맷팅 시 은행별 처리에 사용
 * - 전국 은행 및 증권사 정보를 체계적으로 관리
 * - 은행명 검색 및 코드 매핑에 활용
 */
var bankInfo = [
    { bankCode: "002", bankName: "산업은행", bankAlias: ["산업", "산은", "산업은"], delStr: [""] }
    , { bankCode: "003", bankName: "기업은행", bankAlias: ["IBK기업", "기업", "기업은"], delStr: [""] }
    , { bankCode: "004", bankName: "국민은행", bankAlias: ["KB국민", "국민", "KB"], delStr: [""] }
    , { bankCode: "007", bankName: "수협중앙회", bankAlias: ["수협"], delStr: ["중앙회", "중앙"] }
    , { bankCode: "011", bankName: "농협은행", bankAlias: ["농협은행", "농협", "NH"], delStr: ["중앙회", "중앙", "지역농축협", "농축협", "지역", "축협", "단위"] }
    , { bankCode: "020", bankName: "우리은행", bankAlias: ["우리", "WOORI"], delStr: [""] }
    , { bankCode: "023", bankName: "SC은행", bankAlias: ["SC은행", "SC", "제일"], delStr: [""] }
    , { bankCode: "027", bankName: "한국시티은행", bankAlias: ["시티", "CITI"], delStr: [""] }
    , { bankCode: "031", bankName: "대구은행", bankAlias: ["대구", "DGB"], delStr: [""] }
    , { bankCode: "032", bankName: "부산은행", bankAlias: ["부산"], delStr: [""] }
    , { bankCode: "034", bankName: "광주은행", bankAlias: ["광주", "KJB"], delStr: [""] }
    , { bankCode: "035", bankName: "제주은행", bankAlias: ["제주"], delStr: [""] }
    , { bankCode: "037", bankName: "전북은행", bankAlias: ["전북", "JB"], delStr: [""] }
    , { bankCode: "039", bankName: "경남은행", bankAlias: ["경남"], delStr: [""] }
    , { bankCode: "045", bankName: "새마을금고중앙회", bankAlias: ["MG금고", "MG", "새마을", "금고"], delStr: ["새마을금고중앙회", "새마을중앙회", "새마을중앙", "새마을금고"] }
    , { bankCode: "048", bankName: "신용협동조합중앙회", bankAlias: ["신협", "신용"], delStr: ["신용협동조합중앙회", "신용협동조합", "신용협동중앙회", "신용중앙회", "신협중앙회", "중앙회"] }
    , { bankCode: "050", bankName: "상호저축은행", bankAlias: ["저축은", "저축", "상호"], delStr: ["상호저축"] }
    , { bankCode: "054", bankName: "HSBC", bankAlias: ["HSBC"], delStr: [""] }
    , { bankCode: "055", bankName: "도이치은행", bankAlias: ["도이치"], delStr: [""] }
    , { bankCode: "056", bankName: "알비에스은행", bankAlias: ["RBS"], delStr: [""] }
    , { bankCode: "057", bankName: "JP모간체이스", bankAlias: ["JP모간"], delStr: [""] }
    , { bankCode: "058", bankName: "미즈호코퍼레이트", bankAlias: ["미즈호"], delStr: [""] }
    , { bankCode: "059", bankName: "미쓰비시도쿄UFJ은행", bankAlias: ["BTMUSL"], delStr: [""] }
    , { bankCode: "060", bankName: "뱅크오브아메리카", bankAlias: ["BOA"], delStr: [""] }
    , { bankCode: "061", bankName: "비엔피파리바은행", bankAlias: ["BNPP"], delStr: [""] }
    , { bankCode: "062", bankName: "중국공상은행", bankAlias: ["ICBC", "공상"], delStr: [""] }
    , { bankCode: "063", bankName: "중국은행", bankAlias: ["중국은행"], delStr: [""] }
    , { bankCode: "064", bankName: "산림조합중앙회", bankAlias: ["산림"], delStr: ["산림조합중앙회", "산림중앙회"] }
    , { bankCode: "067", bankName: "중국건설은행", bankAlias: ["CCB"], delStr: [""] }
    , { bankCode: "071", bankName: "우체국", bankAlias: ["우체국"], delStr: [""] }
    , { bankCode: "081", bankName: "하나은행", bankAlias: ["하나", "KEB", "외환"], delStr: [""] }
    , { bankCode: "088", bankName: "신한은행", bankAlias: ["신한"], delStr: [""] }
    , { bankCode: "089", bankName: "케이뱅크", bankAlias: ["K뱅크", "케이뱅"], delStr: [""] }
    , { bankCode: "090", bankName: "카카오뱅크", bankAlias: ["카뱅", "카카오", "카카오뱅크"], delStr: ["뱅크"] }
    , { bankCode: "092", bankName: "토스뱅크", bankAlias: ["토스뱅크", "토스은행", "토스"], delStr: [""] }
    , { bankCode: "209", bankName: "유안타증권", bankAlias: ["유안타"], delStr: [""] }
    , { bankCode: "218", bankName: "KB증권", bankAlias: ["KB증권"], delStr: [""] }
    , { bankCode: "224", bankName: "BNK투자증권", bankAlias: ["BNK투자증권", "BNK투자"], delStr: [""] }
    , { bankCode: "225", bankName: "IBK투자증권", bankAlias: ["IBK투자증권", "IBK투자"], delStr: [""] }
    , { bankCode: "226", bankName: "KB투자", bankAlias: ["KB투자"], delStr: [""] }
    , { bankCode: "227", bankName: "KTB투자증권", bankAlias: ["KTB"], delStr: [""] }
    , { bankCode: "238", bankName: "미래에셋대우", bankAlias: ["미래DW"], delStr: [""] }
    , { bankCode: "240", bankName: "삼성증권", bankAlias: ["삼성"], delStr: [""] }
    , { bankCode: "243", bankName: "한국투자증권", bankAlias: ["한투"], delStr: [""] }
    , { bankCode: "247", bankName: "NH투자증권", bankAlias: ["NH투자"], delStr: [""] }
    , { bankCode: "261", bankName: "교보증권", bankAlias: ["교증"], delStr: [""] }
    , { bankCode: "262", bankName: "하이증권", bankAlias: ["하이증"], delStr: [""] }
    , { bankCode: "263", bankName: "현대차증권", bankAlias: ["현차증"], delStr: [""] }
    , { bankCode: "264", bankName: "키움증권", bankAlias: ["키움"], delStr: [""] }
    , { bankCode: "265", bankName: "이트레이드증권", bankAlias: ["EBEST"], delStr: [""] }
    , { bankCode: "266", bankName: "에스케이증권", bankAlias: ["SK증권"], delStr: [""] }
    , { bankCode: "267", bankName: "대신증권", bankAlias: ["대신"], delStr: [""] }
    , { bankCode: "269", bankName: "한화증권", bankAlias: ["한화투"], delStr: [""] }
    , { bankCode: "270", bankName: "하나금융증권", bankAlias: ["하나투"], delStr: [""] }
    , { bankCode: "278", bankName: "신한투자증권", bankAlias: ["신한투"], delStr: [""] }
    , { bankCode: "279", bankName: "DB금융투자", bankAlias: ["DB금투", "DB금"], delStr: [""] }
    , { bankCode: "280", bankName: "유진투자증권", bankAlias: ["유진"], delStr: [""] }
    , { bankCode: "287", bankName: "메리츠증권", bankAlias: ["메리츠"], delStr: [""] }
    , { bankCode: "288", bankName: "카카오페이증권", bankAlias: ["카카오페이증권"], delStr: [""] }
    , { bankCode: "290", bankName: "부국증권", bankAlias: ["부국"], delStr: [""] }
    , { bankCode: "291", bankName: "신영증권", bankAlias: ["신영"], delStr: [""] }
    , { bankCode: "292", bankName: "케이프투자증권", bankAlias: ["케이프"], delStr: [""] }
    , { bankCode: "294", bankName: "한국포스증권", bankAlias: ["한국포스증권", "한국포스"], delStr: [""] }
];

/**
 * 공통 유틸리티 객체
 * - 다양한 유틸리티 함수들을 포함하는 메인 객체
 * - 은행 관련, 데이터 포맷팅, 스토리지 관리 등 다양한 기능 제공
 */
const util = {

    /**
     * 당/타행여부 리턴
     * - 전북은행(037)인지 여부를 확인하여 당행/타행 구분
     * - 계좌번호 포맷팅 시 당행/타행에 따른 다른 처리 적용
     * @param {string} bankcd - 은행코드 (3자리)
     * @returns {boolean} true : 당행(전북은행), false : 타행
     * @example jc.util.getJbBankYn("037") // true (당행)
     * @example jc.util.getJbBankYn("004") // false (타행)
     */
    getJbBankYn: function (bankcd) {
        var isBank = true;
        if (bankcd == "037" || bankcd == "37") {
            isBank = true;
        } else {
            isBank = false;
        }
        return isBank;
    },

    /**
     * 계좌번호 포맷팅
     * - 계좌번호를 은행별 표준 형식으로 변환
     * - 이미 포매팅되어 있을 경우 제거 후 다시 포맷팅
     * - 타행 계좌의 경우 마스킹 옵션 지원
     * @param {string} dat - 원본 계좌번호
     * @param {Array} arg - 계좌번호 자리수 배열 (예: [3,3,4])
     * @param {string} bankcd - 은행코드 (3자리)
     * @param {boolean} isMask - 마스킹 여부 (타행 계좌용)
     * @returns {string} 포맷팅된 계좌번호
     *
     * @example
     * formatter.account("0000516210427933") // "516-21-0427933"
     * formatter.account("0001516210427933") // "1516-21-0427933"
     * formatter.account("0123456789", [3,3,4]) // "012-345-6789"
     * formatter.account("01234567890", [3,3,4]) // "012-345-6789-0"
     * formatter.account("0123456", [3,3,4]) // "012-345-6"
     */
    account: function (dat, arg, bankcd, isMask) {
        if (typeof arg != "string") arg = null;
        if (!dat) return dat;

        // 타행 계좌 마스킹 처리
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
                    // 카드번호 [4-4-4-4] - 보안을 위해 중간 부분 마스킹
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
    },
    number: function (dat) {
        if (dat != null && String(dat).indexOf(',') > -1) dat = util.strReplaceAll(String(dat), ",", "");

        if (typeof dat == "string") dat = Number(dat);	// fellowe 추가. 2012.12.17
        if (typeof dat == "number") dat = String(dat);


        var signflag = "";
        if (String(dat).substring(0, 1) == "+") {
            dat = String(dat).substring(1);
        } else if (String(dat).substring(0, 1) == "-") {
            signflag = "-";
            dat = String(dat).substring(1);
        }

        var reg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                         // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌 값으로 변환시킴
        }

        return signflag + dat;                          // 바뀐 dat 값을 반환.
    },

    roundNumber: function (dat) {
        if (dat != null && dat != "") dat = dat.slice(0, -2);
        if (dat != null && String(dat).indexOf(',') > -1) dat = util.strReplaceAll(String(dat), ",", "");
        if (typeof dat == "string") dat = Number(dat);	// fellowe 추가. 2012.12.17
        if (typeof dat == "number") dat = String(dat);

        var signflag = "";
        if (String(dat).substring(0, 1) == "+") {
            dat = String(dat).substring(1);
        } else if (String(dat).substring(0, 1) == "-") {
            signflag = "-";
            dat = String(dat).substring(1);
        }

        var reg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                         // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌 값으로 변환시킴
        }

        return signflag + dat;                          // 바뀐 dat 값을 반환.


    },

    // jb_fomatter 함수
    currency: function (dat) {
        if (typeof dat == "string") dat = Number(dat);	// fellowe 추가.
        // 2012.12.17
        if (typeof dat == "number") dat = String(dat);

        if (util.isNull(dat)) dat = "0";

        var reg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                          // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌
            // 값으로 변환시킴
        }
        var won_disp = " 원";


        return dat + won_disp;                              // 바뀐 dat 값을 반환.
    },

    // 카드 마스킹
    card: function (dat, ismask) {
        if (dat == null) return "";
        // dat = dat.replaceAll("-", "");
        dat = this.strReplaceAll(dat, "-", "");
        if (dat.length == 16) {
            if (ismask) {
                return dat.substring(0, 4) + "-" + "****" + "-" + "****" + "-" + dat.substring(12, 16);
            } else {
                return dat.substring(0, 4) + "-" + dat.substring(4, 8) + "-" + dat.substring(8, 12) + "-" + dat.substring(12, 16);
            }

        }

        return dat;
    },

    // 혜택 탭 JMoney jb_fomatter 함수
    currencyNoWon: function (dat) {
        if (typeof dat == "string") dat = Number(dat);	// fellowe 추가.
        // 2012.12.17
        if (typeof dat == "number") dat = String(dat);

        if (util.isNull(dat)) dat = "0";

        var reg = /(^[+-]?\d+)(\d{3})/;                 // 정규식(3자리마다 ,를 붙임)
        dat += '';                                      // ,를 찍기 위해 숫자를 문자열로 변환
        while (reg.test(dat)) {                          // dat값의 첫째자리부터 마지막자리까지
            dat = dat.replace(reg, '$1' + ',' + '$2');  // 인자로 받은 dat 값을 ,가 찍힌
            // 값으로 변환시킴
        }

        // if(!(_LANG_TYPE_ == "DF" || _LANG_TYPE_ == "KO" || _LANG_TYPE_ == "KR")){
        //     won_disp = " KRW";
        // }

        return dat;                              // 바뀐 dat 값을 반환.
    },


    // jexJs 함수
    isNull: function (data) {
        if (data === null || data === undefined) {
            return true;
        }
        return false;
    },


    // 빈값 여부를 리턴한다
    // param pValue
    // return {boolean} true / false

    isEmpty: function (pValue) {
        return (pValue == undefined || pValue == null || pValue == "undefined" || pValue == "null" || util.null2void(String(pValue)).replace(/ /g, "") == "");
    },



    null2voidTest: (v, r) => {
        return (v == undefined || v == "undefined") ? (r == undefined || r == "undefined") ? "" : r : v;
    },

    /**
     * 변수가 undefined 일 경우 대체
     * @param v : 원본값
     * @param r : 대체값
     * @example : jc.util.null2void(JQ("#metaId").val(), "");
     */
    null2void: function (v, r) {
        if (v == undefined || v == "undefined") {
            if (r == undefined || r == "undefined") {
                v = "";
            } else {
                v = r;
            }
        }
        return v
    },
    toDateObject: function (strDateTime) {
        var year = strDateTime.substring(0, 4);
        var month = strDateTime.substring(4, 6) - 1; // 1월=0,12월=11
        var day = strDateTime.substring(6, 8);
        var hour = strDateTime.substring(8, 10);
        var min = strDateTime.substring(10, 12);
        return new Date(year, month, day, hour, min);
    },

    /**
     * 문자열 좌우 공백제거
     * @param str : 대상 데이터
     * @returns : 공백 제거된 데이터
     * @example : util.trim(str)
     */
    trim: function (str) {
        if (typeof str == "boolean") {
            return str;
        } else {
            if (util.null2void(str) == "") {
                return str;
            } else {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }
        }

    },

    /**
     * @설명 OS 버전 정보를 가져온다
     * @returns
     * @예제 util.getOsType();
     */
    getOsType: function () {
        if (typeof window != "undefined") {
            if (_IS_APP_ == "Y") {
                var appInfo = window.navigator.userAgent.substring(navigator.userAgent.indexOf("JBNativeApp"), navigator.userAgent.length).split(";")
                return appInfo[2].trim()
            }
        }
        return ""
    },
    /**
     * @설명 OS version  버전 정보를 가져온다
     * @returns
     * @예제 util.getOsVersion();
     */
    getOsVersion: function () {
        if (typeof window != "undefined") {
            if (_IS_APP_ == "Y") {
                var appInfo = window.navigator.userAgent.substring(navigator.userAgent.indexOf("JBNativeApp"), navigator.userAgent.length).split(";")
                return appInfo[3].trim()
            }
        }
        return ""
    },

    /**
     * @설명 앱 버전 정보를 가져온다
     * @returns
     * @예제 util.getAppVersion();
     */
    getAppVersion: function () {
        if (typeof window != "undefined") {
            const userAgent = window.navigator.userAgent;
            const isApp = userAgent.includes("JBNativeApp");
            if (_IS_APP_ == "Y") {
                var appInfo = userAgent.substring(userAgent.indexOf("JBNativeApp"), userAgent.length).split(";")
                return appInfo[1].trim()
            }

            return ""
        }

    },

    /**
     * @설명 현재 브라우저를 알기 위한 함수
     * MSIE/Chrome/Firefox/Mozilla/Opera/Safari/Mac
     * @returns 브라우저 이름 or ""
     * @예제 jbutil.getUserBrowser();
     */
    getUserBrowser: function () {
        if (typeof window != "undefined") {
            if ((window.navigator.userAgent.indexOf("MSIE") != -1) || (window.navigator.appName == "Netscape" && window.navigator.userAgent.indexOf("Trident") != -1)) {
                return "MSIE";
            } else if (window.navigator.userAgent.indexOf("Chrome") != -1) {
                return "Chrome";
            } else if (window.navigator.userAgent.indexOf("Firefox") != -1) {
                return "Firefox";
            } else if (window.navigator.userAgent.indexOf("Mozilla") != -1) {
                return "Mozilla";
            } else if (window.navigator.userAgent.indexOf("Opera") != -1) {
                return "Opera";
            } else if (window.navigator.userAgent.indexOf("Safari") != -1) {
                return "Safari";
            } else if (window.navigator.userAgent.indexOf("Mac") != -1) {
                return "Mac";
            } else {
                return "";
            }
        }
        return "";

    },
    /**
     * @설명 브라우전 버전을 가져옴
     * @returns version 브라우저 버전 ex) 8.0
     * @예제 jbutil.getBrowserVersion();
     */
    getBrowserVersion: function () {
        var version = -1;
        var ua = "";
        var re = null;
        var ver = "";

        if (typeof window != "undefined") {
            version = -1;
            ua = window.navigator.userAgent;
            ver = util.getUserBrowser();
            if (ver == "MSIE") {
                if (window.navigator.appName == "Netscape" && window.navigator.userAgent.indexOf("Trident") != -1) {
                    re = new RegExp("rv:" + "([0-9]{1,}[\.0-9]{0,})");
                } else {
                    re = new RegExp(ver + " ([0-9]{1,}[\.0-9]{0,})");
                }
            } else {
                re = new RegExp(ver + "/([0-9]{1,}[\.0-9]{0,})");
            }
            if (re.exec(ua) != null) {
                version = parseFloat(RegExp.$1);
            }
        }
        return version;
    },

    /**
     * @설명 플렛폼 정보를 가져온다
     * @returns ios : ios , and : android , etc : 기타
     * @예제 jbutil.getMobileOS();
     */
    getMobileOS: function () {
        if (typeof window != "undefined") {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isApp = userAgent.includes("jbnativeapp") ? "Y" : "N";

            var isIos = userAgent.indexOf("iphone") > -1 ? true : false	//iOS
            var isAos = userAgent.indexOf("android") > -1 ? true : false	//Android

            if (isApp == "Y") {
                if (isIos)
                    return "ios";
                if (isAos)
                    return "and";
            }

            return "etc";
        }

    },

    /**
     * @설명 Device Manufacturer  버전 정보를 가져온다
     * @returns
     * @예제 jbutil.getDeviceManufacturer();
     */
    getDeviceManufacturer: function () {
        if (typeof window != "undefined") {
            const userAgent = window.navigator.userAgent;
            const isApp = userAgent.includes("JBNativeApp");
            if (isApp) {
                var appInfo = userAgent.substring(userAgent.indexOf("JBNativeApp"), userAgent.length).split(";")
                return appInfo[5].trim()
            }
        }
        return ""
    },

    /**
     * @설명 Device Model  버전 정보를 가져온다
     * @returns
     * @예제 jbutil.getDeviceModel();
     */
    getDeviceModel: function () {
        if (typeof window != "undefined") {
            const userAgent = window.navigator.userAgent;
            const isApp = userAgent.includes("JBNativeApp");
            if (isApp) {
                var appInfo = userAgent.substring(userAgent.indexOf("JBNativeApp"), userAgent.length).split(";");
                return appInfo[4].trim();
            }
        }
        return ""
    },
    // 날짜형식
    // "yyyymmdd" 형식의 문자열을 "mm월dd일"로 포매팅한다.
    date1: function (dat) {
        if (!dat) return dat;

        if (dat.length == 4) dat = dat.substring(1, 2) + "월" + " " + dat.substring(3, 4) + "일";
        if (dat.length == 6) dat = dat.substring(4, 6) + "월";
        if (dat.length == 8) dat = dat.substring(4, 6) + "월" + " " + dat.substring(6, 8) + "일";

        return dat;
    },

    /**
     * 날짜시간포멧 리턴 함수
     * @param format:    yyyymmdd or hh24miss or hh12miss 를 이용
     * @param datetime   임시 용도
     * @param isRealTime true/false 서버시간을 사용할지의 여부. 사용하면 true 아니면 false
     * @returns : 포멧된 날짜 시간
     * @example : util.getDateTime("yyyy.mm.dd"); or util.getDateTime("hh24:mi:ss","20120302111658")
     */
    getDateTime: function (format, datetime) {
        var today = util.getToday();
        var yyyy = "";
        var mm = "";
        var dd = "";

        var time = util.getTime();
        var hh24 = "";
        var mi = "";
        var ss = "";

        if (datetime == undefined || util.trim(datetime) == "") {
            yyyy = today.substring(0, 4);
            mm = util.lpad(today.substring(4, 6), 2, "0");
            dd = util.lpad(today.substring(6, 8), 2, "0");

            hh24 = time.substring(0, 2);
            mi = time.substring(2, 4);
            ss = time.substring(4);
        } else {
            if (datetime.length == 6) {
                hh24 = util.lpad(datetime.substring(0, 2), 2, "0");
                mi = util.lpad(datetime.substring(2, 4), 2, "0");
                ss = util.lpad(datetime.substring(4, 6), 2, "0");
            } else if (datetime.length == 8) {
                yyyy = datetime.substring(0, 4);
                mm = util.lpad(datetime.substring(4, 6), 2, "0");
                dd = util.lpad(datetime.substring(6, 8), 2, "0");
            } else if (datetime.length == 14) {
                yyyy = datetime.substring(0, 4);
                mm = util.lpad(datetime.substring(4, 6), 2, "0");
                dd = util.lpad(datetime.substring(6, 8), 2, "0");
                hh24 = util.lpad(datetime.substring(8, 10), 2, "0");
                mi = util.lpad(datetime.substring(10, 12), 2, "0");
                ss = util.lpad(datetime.substring(12, 14), 2, "0");
            }
        }

        if (format.indexOf("yyyy") > -1) {
            format = util.strReplaceAll(format, "yyyy", yyyy);
        }
        if (format.indexOf("mm") > -1) {
            format = util.strReplaceAll(format, "mm", mm);
        }
        if (format.indexOf("dd") > -1) {
            format = util.strReplaceAll(format, "dd", dd);
        }
        if (format.indexOf("hh24") > -1) {
            format = util.strReplaceAll(format, "hh24", hh24);
        }
        if (format.indexOf("hh12") > -1) {
            if (hh24 > 12) {
                hh24 = hh24 - 12;
                hh24 = util.lpad(hh24, 2, "0");
            }
            format = util.strReplaceAll(format, "hh12", hh24);
        }
        if (format.indexOf("mi") > -1) {
            format = util.strReplaceAll(format, "mi", mi);
        }
        if (format.indexOf("ss") > -1) {
            format = util.strReplaceAll(format, "ss", ss);
        }
        return format;
    },
    /**
     * 오늘로 부터 입력된 년월일을 계산하여 "yyyymmdd"로 리턴
     * @param  Number : 년
     * @param  Number : 월
     * @param  Number : 일
     * @returns : yyyymmdd
     * @example : util.getBoundDate( 1, 0, 0);  // 1년후
     * @example : util.getBoundDate(-1, 0, 0);  // 1년전
     * @example : util.getBoundDate( 0,  1, 0); // 1달후
     * @example : util.getBoundDate( 0, -1, 0); // 1달전
     * @example : util.getBoundDate( 0, 0, 1);  // 1일후
     * @example : util.getBoundDate( 0, 0, -1); // 1일전
     * 년월일 음수 인경우 dd+1 로직으로 util.getBoundDate( 0, 0, -1) 인 경우 getToday와 동일해짐
     */
    getBoundDate: function (yy, mm, dd, basedate) {
        let today = util.getToday();
        if (basedate) {
            today = basedate;
        }
        if (Number(yy) < 0 || Number(mm) < 0 || Number(dd) < 0) {
            dd = Number(dd) + 1;
        }
        var date = new Date(today.substring(0, 4), Number(today.substring(4, 6)) - 1, today.substring(6, 8));
        var t_yy = util.lpad(String(date.getFullYear()), 4, '0');
        var t_mm = util.lpad(String(date.getMonth() + 1), 2, '0');
        var t_dd = util.lpad(String(date.getDate()), 2, '0');
        yy = Number(yy);
        mm = Number(mm);
        dd = Number(dd);
        var from = "";
        if (yy != 0) {
            from = date.getFullYear() + yy;
            date.setYear(from);
        }
        if (mm != 0) {
            var lastDate = "";
            var day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            for (var i = 0; i < 12; i++) {
                day.setMonth(i, 1);
                if (date.getMonth() == day.getMonth()) {
                    lastDate = util.getLastDay(day.getFullYear(), (day.getMonth() + 1), day.getDate());
                }
            }
            if (date.getDate() == lastDate) {
                t_yy = date.getFullYear();
                t_mm = (date.getMonth());
                t_dd = date.getDate();
                t_mm = t_mm + mm;
                if (t_mm > 12) {
                    t_yy = t_yy + 1;
                    t_mm = t_mm - 12;
                } else if (t_mm < 0) {
                    t_yy = t_yy - 1;
                    t_mm = t_mm + 12;
                } else {
                    t_yy = t_yy;
                }
                var lastDate2 = "";
                var day2 = new Date(t_yy, t_mm, 1);
                for (var i = 0; i < 12; i++) {
                    day2.setMonth(i, 1);// modified on 2009.10.26
                    if (i == (t_mm)) {
                        lastDate2 = util.getLastDay(day2.getFullYear(), (day2.getMonth() + 1), day2.getDate());
                    }
                }
                t_dd = lastDate2;
                date = new Date(t_yy, t_mm, lastDate2);
            } else {
                from = date.getMonth() + mm;
                date.setMonth(from);
            }
        }
        if (dd != 0) {
            from = date.getDate() + dd;
            date.setDate(from);
        }
        return util.lpad(String(date.getFullYear()), 4, '0') + util.lpad(String(date.getMonth() + 1), 2, '0') + util.lpad(String(date.getDate()), 2, '0');
    },
    /**
     * 오늘날짜 반환
     * @param 없음
     * @returns : yyyymmdd : 오늘날짜
     * @example : jc.util.getToday();
     */
    getToday: function () {
        return _TODAY_;
    },

    /**
     * 입력받은 날에 해당하는 달의 말일이 몇일인지 알려줌.
     * 아래의 예제를 실행하면 1월이 31일까지 있기 때문에 31을 return
     * @param yy : 년
     * @param mm : 월
     * @param dd : 일
     * @returns : 해당월의 마지막 날짜
     * @example : jc.util.getLastDay("2012","01","27");
     */
    getLastDay: function (yy, mm, dd) {
        var lastDay = new Date(yy, mm - 1, dd);
        lastDay.setMonth(lastDay.getMonth() + 1, 0);
        return lastDay.getDate();
    },

    /**
    * Left 빈자리 만큼 str 을 붙인다.
    * @param src : Right에 붙을 원본 데이터
    * @param len : str붙힐 데이터 길이
    * @param str : 대상 데이터
    * @returns : str과 src가 붙은 데이터
    * @example : jbutil.lpad("123123", 10, " ");
    */
    lpad: function (src, len, str) {
        var retStr = "";
        var padCnt = Number(len) - String(src).length;
        for (var i = 0; i < padCnt; i++) {
            retStr += String(str);
        }
        return retStr + src;
    },
    /**
     * 특정날짜의 요일을 구한다.
     * @param strDate : 요일을 구할 날짜(형식"20010231")
     * @returns : 요일명 (월,화,수,목,금,토)
     * @example : util.getDayOfWeek(strDate)
     */
    getDayOfWeek: function (strDate) {
        var now = util.toDateObject(strDate);
        var day = now.getDay(); // 일요일=0, 월요일=1, ..., 토요일=6
        var week = ["일", "월", "화", "수", "목", "금", "토"];
        return week[day];
    },
    /**
     * 현재시각 반환
     * @param 없음
     * @returns : hh24miss : 현재시각
     * @example : util.getTime();
     */
    getTime: function () {

        let vt = util.getTimeS();
        if (vt == undefined) {
            let tmpvt = new Date();
            var hours = tmpvt.getHours();
            if (hours.toString().length == 1) {
                hours = "0" + hours;
            }
            var minutes = tmpvt.getMinutes();
            if (minutes.toString().length == 1) {
                minutes = "0" + minutes;
            }
            var seconds = tmpvt.getSeconds();
            if (seconds.toString().length == 1) {
                seconds = "0" + seconds;
            }
            vt = hours + "" + minutes + "" + seconds;
        }

        return vt;
    },
    getTimeS: function () {
        var returnVal = "";
        if (loadedFirstTime == null) {
            var time = "";
            //  fnFetch("CURRENT_TIME", (res) =>  {

            //     return new Promise(function(resolve, reject) { time = res.ACPL_TIME_S6;
            //     loadedFirstTime = new Date();
            //     loadedFirstTime.setFullYear(_TODAY_.substr(0,4));
            //     loadedFirstTime.setMonth(_TODAY_.substr(4,2)-1);
            //     loadedFirstTime.setDate(_TODAY_.substr(6,2));
            //     loadedFirstTime.setHours(time.substr(0,2));
            //     loadedFirstTime.setMinutes(time.substr(2,2));
            //     loadedFirstTime.setSeconds(time.substr(4,2));

            //     var progressTimerCheck;
            //     let progressTimerId = setInterval(function(){
            //         loadedFirstTime = new Date(loadedFirstTime.getTime() + 1000);

            //             if (progressTimerCheck > 60) {
            //                 loadedFirstTime = null;
            //                 progressTimerCheck = 0;
            //                 clearInterval(progressTimerId);
            //             } else {
            //                 progressTimerCheck++;
            //             }

            //         }, 1000);
            //     return time
            //     });
            // },{params : {}});


        } else {
            var hours = loadedFirstTime.getHours();
            if (hours.toString().length == 1) {
                hours = "0" + hours;
            }
            var minutes = loadedFirstTime.getMinutes();
            if (minutes.toString().length == 1) {
                minutes = "0" + minutes;
            }
            var seconds = loadedFirstTime.getSeconds();
            if (seconds.toString().length == 1) {
                seconds = "0" + seconds;
            }
            returnVal = hours + "" + minutes + "" + seconds;
            return returnVal;
        }

    },
    // "yyyymmdd" 형식의 문자열을 "yyyy.mm.dd"로 포매팅한다.
    date: function (dat) {
        if (!dat) return dat;

        if (dat.length == 4) dat = dat.substring(0, 2) + "." + dat.substring(2, 4);  // 20180103 추가
        if (dat.length == 6) dat = dat.substring(0, 4) + "." + dat.substring(4, 6);
        if (dat.length == 8) dat = dat.substring(0, 4) + "." + dat.substring(4, 6) + "." + dat.substring(6, 8);

        return dat;
    },
    // 시간
    // "hhmmdd" 형식의 문자열을 "hh:mm:dd"로 포매팅한다.
    timeSS: function (dat) {

        if (!dat) return dat;

        if (dat.length == 8) dat = dat.substring(0, 2) + ":" + dat.substring(2, 4) + ":" + dat.substring(4, 6) + "." + dat.substring(6, 8);
        if (dat.length == 6) dat = dat.substring(0, 2) + ":" + dat.substring(2, 4) + ":" + dat.substring(4, 6);
        if (dat.length == 4) dat = dat.substring(0, 2) + ":" + dat.substring(2, 4);		// fellowe
        // 추가.
        // 2012.12.17

        return dat;
    },

    /**
     * @설명 Device Serial  버전 정보를 가져온다
     * @returns
     * @예제 util.getDeviceUuid();
     */
    getDeviceUuid: function () {
        if (_IS_APP_ == "Y") {
            var appInfo = navigator.userAgent.substring(navigator.userAgent.indexOf("JBNativeApp"), navigator.userAgent.length).split(";")
            return appInfo[7].trim();
        }

        return ""
    },

    getDeviceId: function () {
        if (_IS_APP_ == "Y") {
            var appInfo = navigator.userAgent.substring(navigator.userAgent.indexOf("JBNativeApp"), navigator.userAgent.length).split(";")
            return appInfo[8].trim();
        }

        return ""
    },

    /**
     * Right 빈자리 만큼 str 을 붙인다.
     * @param src : Left에 붙을 원본 데이터
     * @param len : str붙힐 데이터 길이
     * @param str : 대상 데이터
     * @returns : str과 src가 붙은 데이터
     * @example : jbutil.rpad("123123", 10, " ");
     */
    rpad: function (src, len, str) {
        var retStr = "";
        var padCnt = Number(len) - String(src).length;
        for (var i = 0; i < padCnt; i++) {
            retStr += String(str);
        }
        return src + retStr;
    },


    /**
     * 금액 4단위 한글 변환
     * 185692 -> 18만5,692원
     * @param num : 금액
     * @param comma : true = 금액 콤마 처리
     *
     */
    transAmt: function (num, comma) {
        var inputNum = "";
        var minusFlag = "";
        if (num < 0) {
            minusFlag = true;
            inputNum = num.toString().replace("-", "");
        } else {
            minusFlag = false;
            inputNum = num;
        }

        var unitWords = ["", "만", "억", "조", "경"]
        var splitUnit = 10000
        var splitCount = unitWords.length;
        var resultArray = []
        var resultString = ""

        for (var i = 0; i < splitCount; i++) {
            var unitResult = (inputNum % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
            unitResult = Math.floor(unitResult);

            if (unitResult > 0) {
                resultArray[i] = unitResult
            }
        }

        for (var i = 0; i < resultArray.length; i++) {
            if (!resultArray[i]) continue

            if (comma) {
                resultString = String(util.number(String(resultArray[i])) + unitWords[i] + resultString)
            } else {
                resultString = String(resultArray[i] + unitWords[i] + resultString)
            }
        }

        if (minusFlag == true) {
            return "-" + resultString;
        } else {
            return resultString;
        }
    },
    /**
     * 금액 만원 단위 한글 변환
     * 185692 -> 18만
     * @param num : 금액
     * @param comma : true = 금액 콤마 처리
     */
    transAmtMan: function (num, comma) {
        var inputNum = "";
        var minusFlag = "";
        if (num < 0) {
            minusFlag = true;
            inputNum = num.toString().replace("-", "");
        } else {
            minusFlag = false;
            inputNum = num;
        }

        var unitWords = ["만", "억", "조", "경"];
        var splitUnit = 10000;
        var splitCount = unitWords.length;
        var resultArray = [];
        var resultString = "";

        for (var i = 0; i < splitCount; i++) {
            var unitResult = (inputNum % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
            unitResult = Math.floor(unitResult);

            if (unitResult > 0) {

                resultArray[i] = unitResult
            }
        }

        for (var i = 0; i < resultArray.length; i++) {
            if (!resultArray[i]) continue;

            if (comma) {
                resultString = String(util.number(String(resultArray[i])) + unitWords[i] + resultString)
            } else {
                resultString = String(resultArray[i] + unitWords[i] + resultString)
            }
        }

        if (minusFlag == true) {
            return "-" + resultString;
        } else {
            return resultString;
        }
    },

    /**
     * 숫자에 콤마(,)를 3자리마다 추가
     * @param val
     * @example : jbutil.addComma("123,123,123");
     */
    addComma: function (num) {
        var num_amount = typeof (num) == "number" ? num.toString() : num
        var fmt_amount = "";
        var minus_flag = "";
        var num_sosu = "";
        var split_position = -1;

        num_amount = num_amount.replace(/,/g, "");

        for (var i = 0; i < num_amount.length; i++) {
            if (num_amount.charAt(i) == ".") split_position = i;
        }

        if (split_position != -1) {
            num_sosu = num_amount.substring(split_position);
            num_amount = num_amount.substring(0, split_position);
        }

        if (num_amount.charAt(0) == "-") {
            minus_flag = "Y";
            num_amount = num_amount.substring(1);
        }

        if (num_amount.length > 3) {
            var str1 = num_amount.substring(0, num_amount.length % 3);
            var str2 = num_amount.substring(num_amount.length % 3, num_amount.length);

            if (str1.length != 0) str1 += ",";
            fmt_amount += str1;

            for (var i = 0; i < str2.length; i++) {
                if (i % 3 == 0 && i != 0) fmt_amount += ",";
                fmt_amount += str2.charAt(i);
            }
        } else {
            fmt_amount = num_amount;
        }

        if (minus_flag == "Y") fmt_amount = "-" + fmt_amount;
        if (split_position != -1) fmt_amount = fmt_amount + "" + num_sosu;
        return fmt_amount;
    },
    /**
     * UserAppVersion check
     */
    getUserAppVersionCheck: function (checkAppVersion) {
        let isUseFlag = true;
        var userAppVersion = util.getAppVersion();    // userAppversion
        var xUseVersionDetail = userAppVersion.split(".");
        var xAppVersionDetail = checkAppVersion.split(".");

        if (Number(xUseVersionDetail[0]) < Number(xAppVersionDetail[0])) {
            isUseFlag = false;
        } else if (Number(xUseVersionDetail[0]) > Number(xAppVersionDetail[0])) {
        } else if (Number(xUseVersionDetail[1]) < Number(xAppVersionDetail[1])) {
            isUseFlag = false;
        } else if (Number(xUseVersionDetail[1]) > Number(xAppVersionDetail[1])) {
        } else if (Number(xUseVersionDetail[2]) < Number(xAppVersionDetail[2])) {
            isUseFlag = false;
        }

        return isUseFlag;
    },
    /*
    * 문자열에서 계좌포멧 추출
    * @ param : xBasestr
    */
    getInBankInfo: function (xBaseStr) {
        var xResultData = {
            bankName: ""
            , bankCode: ""
            , account: ""
        };

        var xFindPos = -1;
        if (bankInfo.length == 0) {
            return xResultData;
        }
        else {
            for (var Loop = 0; Loop < bankInfo.length; Loop++) {
                for (var LoopTwo = 0; LoopTwo < bankInfo[Loop].bankAlias.length; LoopTwo++) {
                    if (xBaseStr.indexOf(bankInfo[Loop].bankAlias[LoopTwo]) > -1) {
                        xFindPos = Loop;
                        break;
                    }
                }
                if (xFindPos > -1) {
                    //찾기 성공
                    break;
                }
            }
        }
        //계좌정보 추출
        if (xFindPos > -1) {
            xBaseStr = xBaseStr.toLowerCase();
            //DelStr 1차 제거
            for (var Loop = 0; Loop < bankInfo[xFindPos].delStr.length; Loop++) {
                xBaseStr = util.strReplaceAll(xBaseStr, bankInfo[xFindPos].delStr[Loop], "");
            }
            for (var Loop = 0; Loop < bankInfo[xFindPos].bankAlias.length; Loop++) {
                xBaseStr = util.strReplaceAll(xBaseStr, bankInfo[xFindPos].bankAlias[Loop], "");
            }
            xBaseStr = util.strReplaceAll(xBaseStr, "은행", "");
            xBaseStr = util.strReplaceAll(xBaseStr, "-", "");
            xBaseStr = util.strReplaceAll(xBaseStr, " ", "");

            if (isNaN(xBaseStr) == false) {
                //계좌번호 확인
                xResultData.bankName = bankInfo[xFindPos].bankName;
                xResultData.bankCode = bankInfo[xFindPos].bankCode;
                xResultData.account = xBaseStr;
            }
            else {
                return xResultData;
            }
        }
        return xResultData;
    },

    getReqData: function (key) {
        return reqData[key]
    },
    setReqData: function (key, value) {
        reqData[key] = value
    },
    delReqData: function (key) {
        delete reqData[key]
    },
    clearReqData: function () {
        reqData = {}
    },
    setDpAcno(acno, bankCd) {
        dpAcno = { WHBN_CD: bankCd, WDL_ACCO_NO: acno }
    },
    getDpAcno() {
        return dpAcno
    },
    setFexAcno(acno, bankCd) {
        fexAcno = { WHBN_CD: bankCd, WDL_ACCO_NO: acno }
    },
    getFexAcno() {
        return fexAcno
    },
    setInAcno(acno, bankCd) {
        inAcno = { MNRC_BANK_CD: bankCd, MNRC_ACNO: acno }
    },
    getInAcno() {
        return inAcno
    },
    setLnAcno(acno) {
        lnAcno = acno
    },
    getLnAcno() {
        return lnAcno
    },
    setCardNo(cano) {
        cardNo = cano
    },
    getCardNo() {
        return cardNo
    },
    /**
     * 에러팝업 출력
     * @param mainId		에러 메인코드
     * @param subId			에러 서브코드
     * @param errorSrvcId 	에러발생 웹서비스ID
     * @param errorMsg 		에러 메시지
     * @param cb 			콜백함수
     */
    errorMsgPopup: function (mainId, subId, errorSrvcId, errorMsg, cb) {
        if (cb == null) {
            cb = function () { }
        }

        if (mainId == "HTTP") {
            var errorArr = [];
            errorArr.push({
                INBN_ERR_DVCD: mainId || '',
                INBN_ERR_CD: subId || '',
                SRVC_ID: errorSrvcId,
                ERR_CTNT: httpStatus[subId] == "" ? errorMsg : httpStatus[subId],
            });
            // 동적으로 alert import
            import('@/app/shared/utils/ui_com').then(({ alert }) => {
                alert.ErrorAlert("오류", errorMsg, cb);
            }).catch(() => {
                console.error("오류", errorMsg);
                if (cb) cb();
            });
        } else {
            var params = {
                INBN_ERR_DVCD: mainId,
                INBN_ERR_CD: subId,
                SRVC_ID: errorSrvcId,
            };
            // fnFetch("M_COM_ERROR_MSG", function(data) {

            //     var errorArr = data.GRID;
            //     if (errorArr == null) {
            //         errorArr = [];
            //         errorArr.push({
            //             INBN_ERR_DVCD : mainId || '',
            //             INBN_ERR_CD : subId || '',
            //             SRVC_ID : errorSrvcId,
            //             LINK : "",
            //             URL :"",
            //             ERR_CTNT : errorMsg,
            //             BTN_CTNT : "",
            //             CCEN_INFO_MRK_YN : "",
            //             LNKN_TX_CTNT : "",
            //             LNKN_TX_URL :"",
            //             PRCD : "",
            //             CTNT : "",
            //             IMG_CTNT : "",
            //             IMG_URL_ADDR : "",
            //         });
            //     }

            //     alert.callCommonErrorAlert("오류", errorArr,cb );

            // }, {params : params } );
        }
    },
    strReplaceAll: function (tg, tgStr, rmStr) {

        let exTg = tg.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\$&');
        let exTgStr = tgStr.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\\$&');
        let regExp = new RegExp(exTgStr, 'gi');
        var rsStr = exTg.replace(regExp, rmStr)
        return rsStr;
    },
    /**nc.
     * 사용자 로그아웃 액션 처리 이후 로그인 사용자 관련 전역변수를 초기화 시킨다.
     */
    initUser: function () {
        BT_HEADER.ELFN_CUST_TYCD = null;
        /*
         *	로그아웃 후 계좌 정보 및 카드정보 클리어
         */
        util.setDpAcno("", "");
        util.setInAcno("", "");
        util.setFexAcno("", "");
        util.setLnAcno("");
        util.setCardNo("");

        //--------------------------------------
        //사용자 세션 관련 전역변수 초기화 처리
        //--------------------------------------
        _ISLOGIN_ = false;
        _ISLOGIN_GBN_ = '';
        _USER_NAME_ = '';
        _CST_NO_ = '';
        _AGE_ = '';
        window.LAST_ACCES_DATE = '';

        util.clearHeader();


    },
    goLogin: function (actionId, params) {
        const { getItem, setItem } = storage();

        let loginType = getItem("LOGIN_TYPE");
        var loginPage = "";

        var Lgurl = "";
        Lgurl = util.strReplaceAll(location.pathname, "JBN/", "");
        Lgurl = util.strReplaceAll(Lgurl, "/", "");

        if (_IS_APP_ == "Y") {
            const { setItem } = storage();
            setItem("FirstLoginYn", "N", "session");
            if (util.isEmpty(loginType)) {
                nc.nativeGetValue("LoginType", function (result) {
                    setItem("LOGIN_TYPE", result["value"].trim());
                    loginType = util.null2void(result["value"].trim());
                });
            }

            if (_ISLOGIN_) {
                util.goMain();
            } else {

                if (util.null2void(mLoginType) !== "") {
                    loginType = window.mLoginType;
                }

                loginType = (loginType === "1317") ? "17" : loginType;

                if (loginType != window.mLoginType) {
                    nc.getMLoginType();
                }

                if (util.null2void(loginType) == "" && util.null2void(window.mLoginType) != "") {
                    loginType = window.mLoginType;
                }

                switch (loginType) {
                    case "01":
                    case "02":
                        loginPage = "M_COM_LOGIN_CMN_AUTH_NTV";
                        break;
                    case "12":
                        loginPage = "M_COM_LOGIN_SELECT_NTV";
                        break;
                    case "13":
                        loginPage = "M_COM_LOGIN_BIO";
                        break;
                    case "15":
                        loginPage = "M_COM_LOGIN_SELECT_NTV";
                        break;
                    case "16":
                        loginPage = "M_COM_LOGIN_NUMBER";
                        break;
                    case "15":
                        loginPage = "M_COM_LOGIN_SELECT_NTV";
                        break;
                    case "17":
                        loginPage = "M_COM_LOGIN_PATTERN";
                        break;
                    case "18":
                        loginPage = "M_COM_LOGIN_FNNC_AUTH_NTV";
                        break;
                    case "20":
                        loginPage = "M_COM_LOGIN_BANK_ID_NTV";
                        break;
                    case "21":
                        loginPage = "M_COM_LOGIN_TOSS";
                        break;
                    case "99":    // 네이티브 패턴 닫기 클릭 시
                        loginPage = "M_COM_LOGIN_SELECT_NTV";
                        break;
                    case "1317":
                        loginPage = "M_COM_LOGIN_JBCERT_NTV";
                        break;
                    case "77":
                        loginPage = "M_COM_LOGIN_SELECT_NTV";
                        break;
                    default:
                        loginPage = "M_COM_LOGIN_SELECT_NTV";
                        break;
                }
            }

            if (loginType == "99") {
                nc.nativeGetValue("LoginType", function (dat) {
                    if (dat.RESULT_CODE == "0000") {
                        loginType = dat.value.trim();
                    }
                });
                return false;
            }

            if (!util.isEmpty(actionId)) {
                setItem("LOGIN_NEXT_URL", util.null2void(actionId), "local");
                BT_HEADER.LOGIN_NEXT_URL = util.null2void(actionId) || '';
                setItem("jexToUrl", util.null2void(actionId));
            } else if (!util.isEmpty(Lgurl)) {
                setItem("LOGIN_NEXT_URL", util.null2void(Lgurl), "local");
                BT_HEADER.LOGIN_NEXT_URL = util.null2void(Lgurl) || '';
                setItem("toUrl", util.null2void(Lgurl));
            } else {
                BT_HEADER.LOGIN_NEXT_URL = '';
            }

            if (!util.isEmpty(params)) {
                setItem("jexUrlParams", util.null2void(params));
            }

            window.history.pushState({}, "", "/JBN/" + loginPage);
            window.history.go();

        } else {
            // nc.callScheme("", Lgurl);
        }
    },
    goMain: function () {
        window.history.pushState(data, "", "/JBN/P_SMB_MAIN");
        window.history.go();
    },
    goMove: function (actionId, params, isAsIs) {
        if (isAsIs) {
            let paramStr = params;
            let pathurl = `${process.env.NEXT_PUBLIC_PT_URL}JBbank.act?TRGT_URL=${actionId}`;
            if (typeof paramStr != "undefined") {
                if (typeof paramStr == 'object') {
                    paramStr = btoa((encodeURIComponent(JSON.stringify(paramStr))));
                }
                else {
                    paramStr = btoa((encodeURIComponent(paramStr)));
                }

                if (paramStr.length > 2000) {
                    const { setItem } = storage();
                    setItem("TRGT_PARAM", paramStr, "session");
                } else {
                    pathurl = pathurl + "&TRGT_PARAM=" + paramStr;
                }

            }
            // window.history.pushState({},"", pathurl);
            // window.history.go();
            util.jexFormMove(actionId, paramStr);
        } else {
            window.history.pushState({}, "", "/JBN/" + actionId);
            window.history.go();
        }

    },
    goLogout: function (callback) {

        const cb = function (dat) {
            /*-----------------------------------------
            사용자 세션 데이터 클리어 및 invalidate 성공 이후 스크립트 전역 초기화 처리
            -----------------------------------------*/
            _ISLOGIN_ = false;

            util.initUser();

            /* 자동 로그아웃 세션 체크 중지 */
            var param = { "state": "N" };
            nc.nativeCall("", "JBNativeUIBR", "doNSessionTime", param);
            callback();
        };

        // fnFetch("M_COM_LOGOUT_ACTION", cb
        //             ,{params:{}, header:{}}
        //         );

    },
    /**
     * 유량제어
     * @param id   유량제어 액션 아이디
     * @param scb  정상 호출 callback
     * @param ecb  오류 호출 callback
     */
    callNetFunnel: function (id, scb, ecb) {
        let actId = id;

        if (_NETFUNNEL_USE_YN_ == "Y") {
            // jbform.backBtnbreak = true;
            let loginTimeCount = 0;

            NetFunnel_Action({ action_id: actId }, {
                success: function () {
                    // jbform.backBtnbreak = false;
                    if (typeof scb == "function") {
                        scb();
                    }
                },
                continued: function (ev, ret) {
                    if (_IS_APP_ === "Y" && _ISLOGIN_) {
                        if (loginTimeCount === 60) {
                            // fnFetch("M_COM_SESS_TIME_CHK",function(result) {
                            //     autoLogoutTimeCheck = 99999999;

                            //     if (interval != null) {
                            //         clearInterval(interval);
                            //     }

                            //     if(timeoutObj != null) {
                            //         clearTimeout(timeoutObj);
                            //     }

                            //     intervalTime = 120;
                            //     timeoutObj = setTimeout("LogoutTimer", intervalTime);

                            //     nc.nativeCall(function(dat) {}, "JBNativeUIBR", "doNSessionTime", {"state" : "Y"});
                            // }, {} );

                            loginTimeCount = 0;
                        } else {
                            loginTimeCount++;
                        }
                    }
                },
                error: function () {
                    // jbform.backBtnbreak = false;
                    if (typeof ecb == "function") {
                        ecb();
                    }
                },
            });
        } else {
            // jbform.backBtnbreak = false;
            if (typeof scb == "function") {
                scb();
            }
        }
    },
    /**
     * 유효하는(존재하는) Date 인지 체크
     * @param strDate : 검증할 string형식의 날짜(날짜형식"20090101") yyyymmdd
     * @returns : true, false
     * @example : if(!jc.util.isValidDate(strDate)) alert("올바른 날짜가 아닙니다.");
     */
    isValidDate: function (strDate) {
        var year = "";
        var month = "";
        var day = "";

        if (strDate.length == 8) {
            year = strDate.substring(0, 4);
            month = strDate.substring(4, 6);
            day = strDate.substring(6, 8);
            if (Number(year, 10) >= 1900 && util.isValidMonth(month) && util.isValidDay(year, month, day)) {
                return true;
            }
        } else if (strDate.length == 6) {
            year = strDate.substring(0, 4);
            month = strDate.substring(4, 6);
            if (Number(year, 10) >= 1900 && util.isValidMonth(month)) {
                return true;
            }
        }
        return false;
    },
    /**
     * 유효한(존재하는) 월(月)인지 체크
     * @param mm : 검증할 월(형식"01" ~ "12")
     * @returns : true, false
     * @example : jc.util.isValidMonth(mm)
     */
    isValidMonth: function (mm) {
        var m = Number(mm, 10);
        return (m >= 1 && m <= 12);
    },
    /**
     * 유효한(존재하는) 일(日)인지 체크
     * @param yyyy : 검증할 년(형식"2009")
     * @param mm : 검증할 월(형식"01" ~ "12")
     * @param dd : 검증할 일(형식"01" ~ "31")
     * @returns : true, false
     * @example : jc.util.isValidDay(yyyy, mm, dd)
     */
    isValidDay: function (yyyy, mm, dd) {
        var m = Number(mm, 10) - 1;
        var d = Number(dd, 10);
        var end = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
            end[1] = 29;
        }
        return (d >= 1 && d <= end[m]);
    },
    /**
     * 유효한(존재하는) 시(時)인지 체크
     * @param hh : 검증할 시(형식"0" ~ "23")
     * @returns : true, false
     * @example : jc.util.isValidHour(hh)
     */
    isValidHour: function (hh) {
        var h = Number(hh, 10);
        return (h >= 0 && h <= 23);
    },
    /**
     * 유효한(존재하는) 분(分)인지 체크
     * @param mi : 검증할 분(형식"00" ~ "59")
     * @returns : true, false
     * @example : jbutil.isValidMin(min)
     */
    isValidMin: function (min) {
        var m = Number(min, 10);
        return (m >= 0 && m <= 59);
    },
    /**
     * 유효시간초 검증
     * @param hh24miss : 검증시간분초[6자리여야함.]
     * @returns : true, false
     * @example : jc.util.isValidTime(hh24miss)
     */
    isValidTime: function (hh24miss) {
        if (util.isValidHour(hh24miss.substring(0, 2)) && util.isValidMin(hh24miss.substring(2, 4)) && util.isValidMin(hh24miss.substring(4, 6))) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 유효하는(존재하는) 날짜와시간 인지 체크
     * @param strDateTime : 검증할 날짜와시간(형식"200102310000") yyyymmddhhmi
     * @returns : true, false
     * @example : if(!jc.util.isValidDateTime(strDateTime)) alert("올바른 날짜/시간 형식이 아닙니다.")
     */
    isValidDateTime: function (strDateTime) {
        var year = strDateTime.substring(0, 4);
        var month = strDateTime.substring(4, 6);
        var day = strDateTime.substring(6, 8);
        var hour = strDateTime.substring(8, 10);
        var min = strDateTime.substring(10, 12);
        if (Number(year, 10) >= 1900 && util.isValidMonth(month) && util.isValidDay(year, month, day) && util.isValidHour(hour) && util.isValidMin(min)) {
            return true;
        }
        return false;
    },
    isValidServiceTime: function (menuInfo) {
        let msg = "";
        let isValid = true;
        let today = util.getToday();
        let currentTime = util.getTime();

        if (util.isValidDate(menuInfo.START_DATE) && menuInfo.START_DATE.localeCompare(today) > 0) {
            isValid = false;
        }

        if (util.isValidDate(menuInfo.END_DATE) && menuInfo.END_DATE.localeCompare(today) < 0) {
            isValid = false;
        }

        if (util.isValidTime(menuInfo.START_TIME) && menuInfo.START_TIME.localeCompare(currentTime) > 0) {
            isValid = false;
        }

        if (util.isValidTime(menuInfo.END_TIME) && menuInfo.END_TIME.localeCompare(currentTime) < 0) {
            isValid = false;
        }

        if (!isValid) {
            msg = "거래가능 시간 : "
                + (util.isValidDate(menuInfo.START_DATE) ? util.getDateTime("yyyy-mm-dd", menuInfo.START_DATE) : "")
                + " "
                + (util.isValidTime(menuInfo.START_TIME) ? util.getDateTime("hh24:mi:ss", menuInfo.START_TIME) : "")
                + " ~ "
                + (util.isValidDate(menuInfo.END_DATE) ? util.getDateTime("yyyy-mm-dd", menuInfo.END_DATE) : "")
                + " "
                + (util.isValidTime(menuInfo.END_TIME) ? util.getDateTime("hh24:mi:ss", menuInfo.END_TIME) : "");
        }
        return { valid: isValid, message: msg };
    },

    clearHeader: () => {
        for (var k in BT_HEADER) {
            if (_ISLOGIN_) {
                if (k != "ELFN_CUST_TYCD") {
                    BT_HEADER[k] = null;
                }
            } else {
                if (k != "LOGIN_NEXT_URL") {
                    BT_HEADER[k] = null;
                }
            }
        }

        const { setItem } = storage();
        setItem("BT_HEADER", JSON.stringify(BT_HEADER), "session");
    },
    getAppVerUseYn: function (chkAppVer) {
        let userAppVer = this.getAppVersion();
        let appVer = this.strReplaceAll(chkAppVer, ".", "");
        userAppVer = this.strReplaceAll(userAppVer, ".", "");

        return userAppVer >= appVer;
    },
    finCertloadScript: function () {
        return new Promise(function (resolve, reject) {
            var vToday = new Date();
            var vdateStr = vToday.getFullYear() + ("0" + (vToday.getMonth() + 1)).slice(-2) + ("0" + (vToday.getDate())).slice(-2)

            let opt = {
                cache: 'no-store',
                method: "get",
                dataType: "script",
            }

            fetch(`${process.env.NEXT_PUBLIC_FINCERT_DOMAIN}?dt=${vdateStr}`, opt)
                .then((res) => {
                    if (!res.ok) {
                        return false;
                    }

                    return res.blob();
                })
                .then((scriptBlob) => {
                    var objUrl = URL.createObjectURL(scriptBlob);
                    var scriptTag = document.createElement("script");
                    scriptTag.setAttribute("src", objUrl);
                    scriptTag.setAttribute("type", "text/javascript");
                    document.head.appendChild(scriptTag);

                    setTimeout(() => {
                        resolve("Y");
                    }, 500);
                })
                .catch((err) => {
                    console.log(err)
                    reject("N");
                });
        });
    },
    delay: (dTime) => {
        return new Promise(resolve => setTimeout(resolve, dTime));
    },
    jexFormMove: (actionId, paramStr) => {

        //2024-11-21 정선우 리액트 웹서비스인 경우 jexFormMove 우회 처리
        //2024-12-17 개발인 경우 전계좌일때 파라매터에 따라 이동 로직 변경
        let inqChk = false;
        if (TSTCL_DV == "DEVL" && typeof _WS_DATA_[actionId] != "undefined") {
            inqChk = true;

            if (actionId == "P_M_INQ009011_10") {
                try {
                    let vData = JSON.parse(decodeURIComponent(atob(paramStr)));
                    if (typeof vData.REACT_YN != "undefined") {
                        if (vData.REACT_YN == "N") {
                            inqChk = false;
                        }
                    }

                    if (typeof vData.param == "string") {
                        let vParam = JSON.parse(vData.param);
                        if (typeof vParam.REACT_YN != "undefined") {
                            if (vParam.REACT_YN == "N") {
                                inqChk = false;
                                paramStr = btoa((encodeURIComponent(JSON.stringify({ REACT_YN: "N" }))));
                            }
                        }
                    }

                } catch {

                }
            }


        } else if (typeof _WS_DATA_[actionId] != "undefined") {
            inqChk = true;
        }

        if (inqChk) {
            // 2025-02-28
            // {} 로 decodeURIComponent(atob(paramStr)) 실행 시 오류 발생으로 페이지 이동이 되지 않는 현상을 발견
            // const vStrParse = decodeURIComponent(atob(paramStr));
            let vStrParse;
            try {
                vStrParse = decodeURIComponent(atob(paramStr));
            } catch {
                vStrParse = {};
            }

            let vJsonParse = vStrParse;
            try {
                vJsonParse = JSON.parse(vStrParse);
            } catch {
                vJsonParse = vStrParse;
            }

            let vStatue =
            {
                movePath: actionId,
                isAsIs: false,
                moveParam: null,
            };

            if (typeof vJsonParse == "object") {
                vStatue.moveParam = vJsonParse;
            }

            // usePageMoveStore.setState(vStatue);
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_PT_URL}JBbank.act?TRGT_URL=${actionId}`;
        const encoder = new TextEncoder();
        const paramLenth = encoder.encode(paramStr).length;

        if (paramLenth < 4 * 1024) {
            if (!util.isEmpty(paramStr)) {
                location.replace(url + "&TRGT_PARAM=" + paramStr);
            } else {
                location.replace(url);
            }
            return;
        }

        const jexForm = document.createElement("form");
        jexForm.method = "POST";
        jexForm.action = url;
        jexForm.onSubmit = function () { location.href = url };

        if (!util.isEmpty(paramStr)) {
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = "TRGT_PARAM";
            input.value = paramStr;
            jexForm.appendChild(input);
        }

        document.body.appendChild(jexForm);
        jexForm.submit();
    },
    reactFormMove: (actionId, paramStr) => {
        const { setParam } = storage();

        setParam(paramStr);
        window.history.pushState({}, "", "/JBN/" + actionId);
        window.history.go();

    },
    callChatBot: () => {

        if (_IS_APP_ == "N") {
            var os = util.getMobileOS();
            if (os == "ios") {
                os = "Ios"
            } else {
                os = "Android"
            }

            // fnFetch("CHT_ADVICE_CONN", (data) => {

            //         if (data.SCS_YN == "Y") {
            //             if (SERVERTYPE == 'real') {
            //                 data.URL_S160=('https://jbbchatbot.jbbank.co.kr/chat/new/P2QAfRZnXhdMCczYE');
            //             }else{
            //                 data.URL_S160=('https://jbbchatbot.jbbank.co.kr/chat/new/P2QAfRZnXhdMCczYE');
            //             }

            //             let pathurl = data.URL_S160
            //             let now = new Date();
            //             var params = "?customerNo="  +encodeURI(data.CUSTOMERNO);
            //             params+=     "&customerFlag="+encodeURI(data.CUSTOMERFLAG);
            //             params+=     "&inChannelId=" +encodeURI(data.INCHANNELID);
            //             params+=     "&pageName="    +encodeURI(data.PAGENAME);
            //             params+=     "&menuDepth1="  +encodeURI(data.MENUDEPTH1);
            //             params+=     "&menuDepth2="  +encodeURI(data.MENUDEPTH2);
            //             params+=     "&menuDepth3="  +encodeURI(data.MENUDEPTH3);
            //             params+=     "&menuDepth4="  +encodeURI(data.MENUDEPTH4);
            //             params+=     "&os="          +encodeURI(data.OS);
            //             params+=     "&domainId="    +encodeURI(data.DOMAINID)
            //             params+=     "&parentId="    +encodeURI(data.PARENTID);
            //             params+=     "&header: window.BT_HEADER,
            //             params: {
            //                 'INCHANNELID': 'SMB',
            //                 'PAGENAME': '챗봇상담',
            //                 'MENUDEPTH1': SVCNM,
            //                 'MENUDEPTH2': '',
            //                 'MENUDEPTH3': '',
            //                 'MENUDEPTH4': '',
            //                 'OS': os,
            //                 'PARENTID': '',
            //                 'INCODE': '',
            //                 'INNAME': '',
            //             },
            //         }
            //     );
        } else {
            let menuText = {
                "txtMenu1": "",
                "txtMenu2": "",
                "txtMenu3": "",
                "txtMenu4": "",
                "txtMenu5": "",
                "currTitle": "챗봇상담",
            };

            const chatMenuTxt = util.getReqData("chat_menu_txt");

            if (chatMenuTxt !== undefined) {
                menuText = chatMenuTxt;
            }
            const gdsInfo = util.getReqData("GDS_INFO");

            let mobileOS = util.getMobileOS();
            if (mobileOS === "and") {
                mobileOS = "Android";
            } else {
                mobileOS = "Ios";
            }

            const chatParam = {
                "INCHANNELID": _IS_APP_ === "Y" ? "SMB" : "WEB",
                "PAGENAME": util.null2void(menuText.currTitle),
                "MENUDEPTH1": util.null2void(menuText.txtMenu1),
                "MENUDEPTH2": util.null2void(menuText.txtMenu2),
                "MENUDEPTH3": util.null2void(menuText.txtMenu3),
                "MENUDEPTH4": util.null2void(menuText.txtMenu4),
                "OS": mobileOS,
                "PARENTID": util.isEmpty(gdsInfo) ? "" : util.null2void(gdsInfo.PARENTID),
                "INCODE": util.isEmpty(gdsInfo) ? "" : util.null2void(gdsInfo.GDS_CD),
                "INNAME": util.isEmpty(gdsInfo) ? "" : util.null2void(gdsInfo.GDS_NM),
            };


            // fnFetch("CHT_ADVICE_CONN", (res) => {
            //         let url = "";

            //         if (res.SCS_YN === "Y") {
            //             if (SERVERTYPE == 'real') {
            //                 res.URL_S160 = ('https://jbbchatbot.jbbank.co.kr/chat/new/P2QAfRZnXhdMCczYE');
            //             } else {
            //                 res.URL_S160 = ('https://njbbchatbot.jbbank.co.kr:8443/chat/new/P25hSDLiGAwn6qfCd');
            //             }

            //             url = res.URL_S160;
            //             var params = "?customerNo=" + encodeURI(res.CUSTOMERNO);
            //             params += "&customerFlag=" + encodeURI(res.CUSTOMERFLAG);
            //             params += "&inChannelId=" + encodeURI(res.INCHANNELID);
            //             params += "&pageName=" + encodeURI(res.PAGENAME);
            //             params += "&menuDepth1=" + encodeURI(res.MENUDEPTH1);
            //             params += "&menuDepth2=" + encodeURI(res.MENUDEPTH2);
            //             params += "&menuDepth3=" + encodeURI(res.MENUDEPTH3);
            //             params += "&menuDepth4=" + encodeURI(res.MENUDEPTH4);
            //             params += "&os=" + encodeURI(res.OS);
            //             params += "&domainId=" + encodeURI(res.DOMAINID)
            //             params += "&parentId=" + encodeURI(res.PARENTID);
            //             params += "&inCode=" + encodeURI(res.INCODE);
            //             params += "&inName=" + encodeURI(res.INNAME);
            //             params += "&onlyTalk=" + encodeURI(res.ONLYTALK);

            //             let chatUrl = url + params;

            //             if (_IS_APP_ === "Y") {
            //                 nc.doNOpenWebView({
            //                     loadURL: chatUrl
            //                 }, (dat) => {
            //                 });
            //             } else {
            //                 window.open(chatUrl);
            //             }
            //         }
            //     },{ params : chatParam});
        }
    },
    Dateformat: (date, pattern) => {
        var year = null,
            month = null,
            day = null,
            hour = null,
            minute = null,
            second = null,
            ampm = null;
        var formattedDate = pattern;

        if (typeof formattedDate !== 'string') return formattedDate;

        // year
        if (/(YYYY|yyyy)/.test(formattedDate)) {
            year = date.getFullYear();

            formattedDate = formattedDate.replace(/(YYYY|yyyy)/g, year);
        }
        // year
        if (/(YY|yy)/.test(formattedDate)) {
            year = ('' + date.getFullYear()).substring(2);

            formattedDate = formattedDate.replace(/(YY|yy)/g, year);
        }
        // year
        if (/(Y|y)/.test(formattedDate)) {
            year = parseInt(('' + date.getFullYear()).substring(2), 10);

            formattedDate = formattedDate.replace(/(Y|y)/g, year);
        }

        // month
        if (/MM/.test(formattedDate)) {
            month = date.getMonth() + 1;

            if (month < 10) {
                month = '0' + month;
            }

            formattedDate = formattedDate.replace(/MM/g, month);
        }
        // month
        if (/M/.test(formattedDate)) {
            month = date.getMonth() + 1;
            formattedDate = formattedDate.replace(/M/g, month);
        }

        // day
        if (/dd/.test(formattedDate)) {
            day = date.getDate();

            if (day < 10) {
                day = '0' + day;
            }

            formattedDate = formattedDate.replace(/dd/g, day);
        }
        // day
        if (/d/.test(formattedDate)) {
            day = date.getDate();
            formattedDate = formattedDate.replace(/d/g, day);
        }

        // hour : 00 ~ 23
        if (/HH/.test(formattedDate)) {
            hour = date.getHours();

            if (hour < 10) {
                hour = '0' + hour;
            }

            formattedDate = formattedDate.replace(/HH/g, hour);
        }
        // hour : 0 ~ 23
        if (/H/.test(formattedDate)) {
            hour = date.getHours();
            formattedDate = formattedDate.replace(/H/g, hour);
        }

        // hour (am)00 01 02 ... 11, (pm)12 01 02 03 ... 11
        if (/hh/.test(formattedDate)) {
            hour = date.getHours();
            if (hour > 12) {
                hour -= 12;
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            formattedDate = formattedDate.replace(/hh/g, hour);
        }
        // hour (am)0 1 2 ... 11, (pm)12 1 2 3 ... 11
        if (/h/.test(formattedDate)) {
            hour = date.getHours();
            if (hour > 12) {
                hour -= 12;
            }
            formattedDate = formattedDate.replace(/h/g, hour);
        }

        // minute
        if (/mm/.test(formattedDate)) {
            minute = date.getMinutes();
            if (minute < 10) {
                minute = '0' + minute;
            }

            formattedDate = formattedDate.replace(/mm/g, minute);
        }
        // minute
        if (/m/.test(formattedDate)) {
            minute = date.getMinutes();
            formattedDate = formattedDate.replace(/m/g, minute);
        }

        // second
        if (/ss/.test(formattedDate)) {
            second = date.getSeconds();
            if (second < 10) {
                second = '0' + second;
            }

            formattedDate = formattedDate.replace(/ss/g, second);
        }
        // second
        if (/s/.test(formattedDate)) {
            second = date.getSeconds();
            formattedDate = formattedDate.replace(/s/g, second);
        }

        // 오전, 오후
        if (/(AA|aa)/.test(formattedDate)) {
            ampm = (date.getHours() < 12) ? '오전' : '오후';
            formattedDate = formattedDate.replace(/(AA|aa)/g, ampm);
        }

        // am, pm
        if (/A/.test(formattedDate)) {
            ampm = (date.getHours() < 12) ? 'AM' : 'PM';
            formattedDate = formattedDate.replace(/A/g, ampm);
        }
        // am, pm
        if (/a/.test(formattedDate)) {
            ampm = (date.getHours() < 12) ? 'am' : 'pm';
            formattedDate = formattedDate.replace(/a/g, ampm);
        }

        return formattedDate;
    },
    xorEncrypt: () => {
        return new Promise((resolve) => {
            const logCstno = window._CST_NO_;
            let logId = logCstno === "16" ? logCstno.substring(5).replace(/-/g, "") : logCstno.substring(5).replace(/-/g, "");
            let ran = Math.ceil(Math.random() * 9);
            let cipher = "";

            for (let idx = 0; idx < logId.length; ++idx) {
                cipher += String.fromCharCode(ran ^ logId.charCodeAt(idx));
            }

            _JB_WEB_ID_ = btoa(String(ran) + cipher);

            resolve();
        });
    },
    xorDecrypt: () => {
        let dec = "";
        let text = atob(_JB_WEB_ID_);
        let cipher = text.substring(1, text.length);
        let ran = text.substring(0, 1);
        for (let idx = 0; idx < cipher.length; idx++) {
            dec += String.fromCharCode(ran ^ cipher.charCodeAt(idx));
        }

        let str = "";
        let retStr = "";
        let padCnt = Number(16) - String(dec).length;
        for (let i = 0; i < padCnt; i++) {
            retStr += String(str);
        }

        return retStr + dec;
    },
    escapeHtml: (text) => {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot",
            "'": "&#039"
        };

        return text.replace(/[*<>"']/g, function (match) {
            return map[match];
        });
    },
    // React 에서는 html 코드표를 사용하지 못하여 unescape 처리를 직접 해줘야 한다고함
    unescapeHtml: (text) => {
        const map = {
            "&#039;": "'",
            "&quot;": '"',
            "&gt;": ">",
            "&lt;": "<",
            "&amp;": "&"
        };

        return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function (match) {
            return map[match];
        });
    },
    // 코드 약어명 리스트 조회
    // lcode : 코드
    // cb : 성공 콜백
    // ecb : 실패 골백
    // async : 비동기 호출
    // async : Progress bar 표출 여부
    getCodeList: (lcode, cb, ecb, async) => {
        var params = {
            INBN_LCCD: lcode
        }

        lookupCodeCallback = cb

        // fnFetch("M_COMMON_CODE_LIST", cmmLookupCodeCallback, { "params" : params }, ecb, async)
    },
    /**
     *
     * @param pValue
     * @returns {boolean}
     */
    isNotEmpty: (pValue) => {
        return !util.isEmpty(pValue);
    },
}

/**
 * Toast 메시지 표시 함수
 * @param {string} message - 표시할 메시지
 */
const displayToast = (message) => {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.callCommonToastOpen(message);
  } else {
    console.log('Toast:', message);
  }
};

export { displayToast, util };

var lookupCodeCallback = null;

function cmmLookupCodeCallback(data) {
    let result = {};

    if (data) {
        result["CODE_LIST"] = data.hasOwnProperty("GRID") && data["GRID"];
        result["CODE_CCNT"] = data.hasOwnProperty("GRID_CCNT") && data["GRID_CCNT"];
        result["NAME"] = data.hasOwnProperty("NAME") && data["NAME"];
    }

    if (checkFunctioType(lookupCodeCallback)) {
        lookupCodeCallback(result);
        lookupCodeCallback = null;
    }
}

function checkFunctioType(func) {
    return typeof func === "function" ? true : false;
}
