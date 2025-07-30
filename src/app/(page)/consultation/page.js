'use client';


import { setMoveTo } from '@/common/store/pageMoveStore';
import { alert } from '@/common/ui_com';
import Board from '@/components/Board';
import ConsultationButton from '@/components/ConsultationButton';
import EmpNameDisplay from '@/components/EmpNameDisplay';
import PageWrapper from '@/components/layout/PageWrapper';
import { CmpButton, CmpInput, CmpSelect } from '@/components/ui';
import { commonCodeAPI } from '@/lib/api/commonCodeAPI';
import { consultationAPI } from '@/lib/api/consultationAPI';
import { useEffect, useState } from 'react';

const ConsultationPage = () => {
    // 상태 관리
    const [consultationList, setConsultationList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    // 검색 조건
    const [searchType, setSearchType] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categoryCd, setCategoryCd] = useState('');
    const [stsCd, setStsCd] = useState('');

    // 정렬
    const [sortKey, setSortKey] = useState('regDate');
    const [sortOrder, setSortOrder] = useState('DESC');

    // 카테고리 코드 목록
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);

    // 상담 상세 모달
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
        fetchConsultationList();
        fetchCommonCodes();
    }, []);

    // 페이지 변경 시 목록 조회
    useEffect(() => {
        fetchConsultationList();
    }, [currentPage, sortKey, sortOrder]);

    // 상담 목록 조회
    const fetchConsultationList = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                size: pageSize,
                sortBy: sortKey,
                sortDirection: sortOrder,
                searchType,
                searchKeyword,
                categoryCd,
                stsCd
            };

            const response = await consultationAPI.getConsultationList(params);

            if (response.success) {
                setConsultationList(response.data.content || []);
                setTotalCount(response.data.totalElements || 0);
            } else {
                alert.AlertOpen('조회 실패', response.message || '상담 목록 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('상담 목록 조회 오류:', error);
            alert.AlertOpen('조회 오류', '상담 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 공통 코드 조회
    const fetchCommonCodes = async () => {
        try {
            const [categoryResponse, statusResponse, priorityResponse] = await Promise.all([
                commonCodeAPI.getDetailList({ grpCd: 'CNSL_CAT' }),
                commonCodeAPI.getDetailList({ grpCd: 'CNSL_STS' }),
                commonCodeAPI.getDetailList({ grpCd: 'CNSL_PRI' })
            ]);

            if (categoryResponse.success) {
                const categoryContent = categoryResponse.data?.content || categoryResponse.data || [];
                setCategoryOptions(categoryContent);
            }
            if (statusResponse.success) {
                const statusContent = statusResponse.data?.content || statusResponse.data || [];
                setStatusOptions(statusContent);
            }
            if (priorityResponse.success) {
                const priorityContent = priorityResponse.data?.content || priorityResponse.data || [];
                setPriorityOptions(priorityContent);
            }
        } catch (error) {
            console.error('공통 코드 조회 오류:', error);
        }
    };

    // 상담 상세 조회
    const fetchConsultationDetail = async (seq) => {
        try {
            const response = await consultationAPI.getConsultationDetail(seq);

            if (response.success) {
                setSelectedConsultation(response.data);
                setShowDetailModal(true);
            } else {
                alert.AlertOpen('조회 실패', response.message || '상담 상세 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('상담 상세 조회 오류:', error);
            alert.AlertOpen('조회 오류', '상담 상세 조회 중 오류가 발생했습니다.');
        }
    };

    // 검색
    const handleSearch = () => {
        setCurrentPage(1);
        fetchConsultationList();
    };

    // 검색 조건 초기화
    const handleReset = () => {
        setSearchType('all');
        setSearchKeyword('');
        setCategoryCd('');
        setStsCd('');
        setCurrentPage(1);
        fetchConsultationList();
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 정렬 변경
    const handleSortChange = (key, order) => {
        setSortKey(key);
        setSortOrder(order);
    };

    // 상담 신청 성공 시 목록 새로고침
    const handleConsultationSuccess = () => {
        fetchConsultationList();
    };

    // 상태별 스타일
    const getStatusStyle = (status) => {
        switch (status) {
            case 'STS001': return { color: '#ff6b6b', fontWeight: 'bold' };
            case 'STS002': return { color: '#51cf66', fontWeight: 'bold' };
            case 'STS003': return { color: '#868e96', fontWeight: 'bold' };
            default: return { color: '#495057' };
        }
    };

    // 카테고리별 스타일
    const getCategoryStyle = (category) => {
        switch (category) {
            case 'CAT001': return { backgroundColor: '#e3f2fd', color: '#1976d2' };
            case 'CAT002': return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
            case 'CAT003': return { backgroundColor: '#e8f5e8', color: '#388e3c' };
            default: return { backgroundColor: '#f5f5f5', color: '#616161' };
        }
    };

    // 우선순위별 스타일
    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'PRI001': return { color: '#51cf66' };
            case 'PRI002': return { color: '#ffd43b' };
            case 'PRI003': return { color: '#ff6b6b' };
            default: return { color: '#495057' };
        }
    };

    // 테이블 컬럼 정의
    const columns = [
        { key: 'seq', label: '번호', width: '80px' },
        { key: 'ttl', label: '제목', width: 'auto' },
        { key: 'categoryCd', label: '카테고리', width: '120px' },
        { key: 'stsCd', label: '상태', width: '100px' },
        { key: 'priorityCd', label: '우선순위', width: '100px' },
        { key: 'urgentYn', label: '긴급', width: '80px' },
        { key: 'regDate', label: '등록일', width: '120px' },
        { key: 'answerDate', label: '답변일', width: '120px' }
    ];

    // 셀 렌더링 함수
    const renderCell = (row, col) => {
        switch (col.key) {
            case 'seq':
                return row.seq;
            case 'ttl':
                return (
                    <div className="text-left">
                        <span
                            className="cursor-pointer hover:text-blue-600 hover:underline"
                            onClick={() => fetchConsultationDetail(row.seq)}
                        >
                            {row.anonymousYn === 'Y' ?
                                (row.nickname ? `[익명(${row.nickname})] ` : '[익명] ') :
                                <span>[                                <EmpNameDisplay
                                    empId={row.regEmpId}
                                    empName={row.regEmpNm}
                                    showId={true}
                                    separator=" "
                                    fallback={`직원(${row.regEmpId})`}
                                    loading={true}
                                />] </span>
                            }{row.ttl}
                        </span>
                        {row.urgentYn === 'Y' && (
                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                긴급
                            </span>
                        )}
                        {row.anonymousYn === 'Y' && row.nickname && (
                            <div className="text-xs text-gray-500 mt-1">
                                닉네임: {row.nickname}
                            </div>
                        )}
                    </div>
                );
            case 'categoryCd':
                const category = categoryOptions.find(cat => cat.dtlCd === row.categoryCd);
                return (
                    <span
                        className="px-2 py-1 text-xs rounded"
                        style={getCategoryStyle(row.categoryCd)}
                    >
                        {category ? category.dtlCdNm : row.categoryCd}
                    </span>
                );
            case 'stsCd':
                const status = statusOptions.find(sts => sts.dtlCd === row.stsCd);
                return (
                    <span style={getStatusStyle(row.stsCd)}>
                        {status ? status.dtlCdNm : row.stsCd}
                    </span>
                );
            case 'priorityCd':
                const priority = priorityOptions.find(pri => pri.dtlCd === row.priorityCd);
                return (
                    <span style={getPriorityStyle(row.priorityCd)}>
                        {priority ? priority.dtlCdNm : row.priorityCd}
                    </span>
                );
            case 'urgentYn':
                return row.urgentYn === 'Y' ? '긴급' : '일반';
            case 'regDate':
                return row.regDate ? new Date(row.regDate).toLocaleDateString() : '-';
            case 'answerDate':
                return row.answerDate ? new Date(row.answerDate).toLocaleDateString() : '-';
            default:
                return row[col.key];
        }
    };

    return (
        <PageWrapper>
            <div className="p-6">
                {/* 헤더 */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">상담신청</h1>
                            <p className="text-gray-600">상담을 신청하고 답변을 확인할 수 있습니다.</p>
                        </div>
                        <CmpButton
                            onClick={() => setMoveTo('/consultation/selection')}
                            styleType="primary"
                        >
                            새로운 상담 신청
                        </CmpButton>
                    </div>
                </div>

                {/* 검색 영역 */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                검색 조건
                            </label>
                            <CmpSelect
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="all">전체</option>
                                <option value="ttl">제목</option>
                                <option value="cntn">내용</option>
                            </CmpSelect>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                검색어
                            </label>
                            <CmpInput
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="검색어를 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                카테고리
                            </label>
                            <CmpSelect
                                value={categoryCd}
                                onChange={(e) => setCategoryCd(e.target.value)}
                            >
                                <option value="">전체</option>
                                {categoryOptions && categoryOptions.length > 0 ? (
                                    categoryOptions.map(option => (
                                        <option key={option.dtlCd} value={option.dtlCd}>
                                            {option.dtlCdNm}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>카테고리를 불러오는 중...</option>
                                )}
                            </CmpSelect>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                상태
                            </label>
                            <CmpSelect
                                value={stsCd}
                                onChange={(e) => setStsCd(e.target.value)}
                            >
                                <option value="">전체</option>
                                {statusOptions && statusOptions.length > 0 ? (
                                    statusOptions.map(option => (
                                        <option key={option.dtlCd} value={option.dtlCd}>
                                            {option.dtlCdNm}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>상태를 불러오는 중...</option>
                                )}
                            </CmpSelect>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <CmpButton
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            검색
                        </CmpButton>
                        <CmpButton
                            onClick={handleReset}
                            className="bg-gray-500 hover:bg-gray-600"
                        >
                            초기화
                        </CmpButton>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                        총 {totalCount}건의 상담이 있습니다.
                    </div>
                    <ConsultationButton
                        variant="success"
                        onSuccess={handleConsultationSuccess}
                    >
                        상담 신청
                    </ConsultationButton>
                </div>

                {/* 상담 목록 */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <Board
                        data={consultationList}
                        columns={columns}
                        page={currentPage}
                        totalPages={Math.ceil(totalCount / pageSize)}
                        onPageChange={handlePageChange}
                        onSortChange={handleSortChange}
                        renderCell={renderCell}
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                    />
                </div>

                {/* 상담 상세 모달 */}
                {showDetailModal && selectedConsultation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">상담 상세</h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* 작성자 신상 정보 */}
                                <div className="lg:col-span-1">
                                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                            <span className="mr-2">👤</span>
                                            작성자 정보
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-blue-800 mb-2">작성자</label>
                                                <div className="bg-white p-3 rounded border border-blue-300">
                                                                                                        {selectedConsultation.anonymousYn === 'Y' ?
                                                        (selectedConsultation.nickname ?
                                                            <span className="text-lg font-medium text-gray-900">
                                                                익명({selectedConsultation.nickname})
                                                            </span> :
                                                            <span className="text-lg font-medium text-gray-900">익명</span>
                                                        ) :
                                                                                                                                                                <div className="text-lg font-medium text-gray-900">
                                                    <EmpNameDisplay
                                                        empId={selectedConsultation.regEmpId}
                                                        empName={selectedConsultation.regEmpNm}
                                                        showId={true}
                                                        separator=" "
                                                        fallback={`직원(${selectedConsultation.regEmpId})`}
                                                        loading={true}
                                                        className="text-lg font-medium"
                                                    />
                                                </div>
                                                    }
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-blue-800 mb-2">카테고리</label>
                                                <div className="bg-white p-3 rounded border border-blue-300">
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {categoryOptions.find(cat => cat.dtlCd === selectedConsultation.categoryCd)?.dtlCdNm || selectedConsultation.categoryCd}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-blue-800 mb-2">우선순위</label>
                                                <div className="bg-white p-3 rounded border border-blue-300">
                                                    <span className="text-lg font-medium" style={getPriorityStyle(selectedConsultation.priorityCd)}>
                                                        {priorityOptions.find(pri => pri.dtlCd === selectedConsultation.priorityCd)?.dtlCdNm || selectedConsultation.priorityCd}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-blue-800 mb-2">상태</label>
                                                <div className="bg-white p-3 rounded border border-blue-300">
                                                    <span className="text-lg font-medium" style={getStatusStyle(selectedConsultation.stsCd)}>
                                                        {statusOptions.find(sts => sts.dtlCd === selectedConsultation.stsCd)?.dtlCdNm || selectedConsultation.stsCd}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-blue-800 mb-2">등록일</label>
                                                <div className="bg-white p-3 rounded border border-blue-300">
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {selectedConsultation.regDate ? new Date(selectedConsultation.regDate).toLocaleString() : '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-blue-800 mb-2">조회수</label>
                                                <div className="bg-white p-3 rounded border border-blue-300">
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {selectedConsultation.viewCnt || 0}회
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 내용 및 답변 */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* 제목 */}
                                    <div className="bg-gray-50 p-6 rounded-lg border">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <span className="mr-2">📝</span>
                                            제목
                                        </h3>
                                        <div className="bg-white p-4 rounded border">
                                            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                                                {selectedConsultation.anonymousYn === 'Y' ?
                                                    (selectedConsultation.nickname ? `[익명(${selectedConsultation.nickname})] ` : '[익명] ') :
                                                    ''
                                                }
                                                {selectedConsultation.ttl}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* 상담 내용 */}
                                    <div className="bg-gray-50 p-6 rounded-lg border">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <span className="mr-2">💬</span>
                                            상담 내용
                                        </h3>
                                        <div className="bg-white p-6 rounded border min-h-[200px]">
                                            <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-900">
                                                {selectedConsultation.cntn}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 답변 */}
                                    {selectedConsultation.answer ? (
                                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                                                <span className="mr-2">✅</span>
                                                답변
                                            </h3>
                                            <div className="mb-4">
                                                <label className="block text-sm font-semibold text-green-800 mb-2">답변일</label>
                                                <div className="bg-white p-3 rounded border border-green-300">
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {selectedConsultation.answer.regDate ? new Date(selectedConsultation.answer.regDate).toLocaleString() : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-green-800 mb-2">답변 내용</label>
                                                <div className="bg-white p-6 rounded border border-green-300 min-h-[200px]">
                                                    <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-900">
                                                        {selectedConsultation.answer.cntn}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                            <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center">
                                                <span className="mr-2">⏳</span>
                                                답변
                                            </h3>
                                            <div className="bg-white p-6 rounded border border-yellow-300 min-h-[100px] flex items-center justify-center">
                                                <div className="text-lg text-gray-500">
                                                    답변이 없습니다.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <CmpButton
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 px-6 py-3 text-lg"
                                >
                                    닫기
                                </CmpButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default ConsultationPage;
