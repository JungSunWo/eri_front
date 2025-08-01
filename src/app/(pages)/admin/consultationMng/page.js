'use client';


import { consultationAPI } from '@/app/core/services/api';
import AnonymousIdentityManager from '@/app/shared/components/AnonymousIdentityManager';
import Board from '@/app/shared/components/Board';
import EmpNameDisplay from '@/app/shared/components/EmpNameDisplay';
import CmpButton from '@/app/shared/components/ui/CmpButton';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import CmpTextarea from '@/app/shared/components/ui/CmpTextarea';
import CommonModal from '@/app/shared/components/ui/CommonModal';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert } from '@/app/shared/utils/ui_com';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const CounselingPage = () => {
    const router = useRouter();
    const [consultationList, setConsultationList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    // 검색 조건
    const [searchType, setSearchType] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categoryCd, setCategoryCd] = useState('');
    const [stsCd, setStsCd] = useState('');
    const [anonymousYn, setAnonymousYn] = useState('');
    const [urgentYn, setUrgentYn] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // 모달 상태
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);

    // 익명 사용자 동일성 판단 모달 상태
    const [showIdentityModal, setShowIdentityModal] = useState(false);

    // 답변 모달 상태
    const [answerContent, setAnswerContent] = useState('');
    const [answerFiles, setAnswerFiles] = useState([]);

    // 정렬 상태
    const [sortKey, setSortKey] = useState('regDate');
    const [sortOrder, setSortOrder] = useState('desc');

    // 카테고리 및 상태 코드
    const categoryOptions = [
        { value: '', label: '전체' },
        { value: 'CAT001', label: '업무' },
        { value: 'CAT002', label: '인사' },
        { value: 'CAT003', label: '복지' },
        { value: 'CAT004', label: '기타' }
    ];

    const statusOptions = [
        { value: '', label: '전체' },
        { value: 'STS001', label: '대기' },
        { value: 'STS002', label: '답변완료' },
        { value: 'STS003', label: '종료' }
    ];

    const priorityOptions = [
        { value: 'PRI001', label: '긴급' },
        { value: 'PRI002', label: '높음' },
        { value: 'PRI003', label: '보통' },
        { value: 'PRI004', label: '낮음' }
    ];



    // 상담 목록 조회
    const fetchConsultationList = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page: page,
                size: pageSize,
                sortBy: sortKey,
                sortDirection: sortOrder.toUpperCase()
            };

            if (searchKeyword) {
                params.searchType = searchType;
                params.searchKeyword = searchKeyword;
            }
            if (categoryCd) params.categoryCd = categoryCd;
            if (stsCd) params.stsCd = stsCd;
            if (anonymousYn) params.anonymousYn = anonymousYn;
            if (urgentYn) params.urgentYn = urgentYn;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await consultationAPI.getConsultationList(params);

            if (response.success) {
                setConsultationList(response.data.content);
                setTotalElements(response.data.totalElements);
                setCurrentPage(response.data.currentPage);
            } else {
                alert.AlertOpen('상담 목록 조회 실패', '상담 목록 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('상담 목록 조회 오류:', error);
            alert.AlertOpen('상담 목록 조회 오류', '상담 목록 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
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
                alert.AlertOpen('상담 상세 조회 실패', '상담 상세 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('상담 상세 조회 오류:', error);
            alert.AlertOpen('상담 상세 조회 오류', '상담 상세 조회 중 오류가 발생했습니다.');
        }
    };

    // 익명 사용자 동일성 판단 모달 열기
    const openIdentityModal = () => {
        setShowIdentityModal(true);
    };

    // 답변 저장
    const saveAnswer = async () => {
        if (!answerContent.trim()) {
            alert.AlertOpen('답변 내용 입력', '답변 내용을 입력해주세요.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('consultationSeq', selectedConsultation.seq);
            formData.append('cntn', answerContent);

            answerFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await consultationAPI.saveAnswer(selectedConsultation.seq, formData);

            if (response.success) {
                alert.AlertOpen('답변 저장 완료', '답변이 저장되었습니다.');
                setShowAnswerModal(false);
                setAnswerContent('');
                setAnswerFiles([]);
                fetchConsultationDetail(selectedConsultation.seq);
            } else {
                alert.AlertOpen('답변 저장 실패', response.message || '답변 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('답변 저장 오류:', error);
            alert.AlertOpen('답변 저장 오류', '답변 저장 중 오류가 발생했습니다.');
        }
    };

    // 상담 삭제
    const deleteConsultation = async (seq) => {
        const confirmed = await new Promise((resolve) => {
            alert.ConfirmOpen('삭제 확인', '상담을 삭제하시겠습니까?', {
                okCallback: () => {
                    resolve(true);
                },
                cancelCallback: () => {
                    resolve(false);
                }
            });
        });

        if (!confirmed) return;

        try {
            const response = await consultationAPI.deleteConsultation(seq);

            if (response.success) {
                alert.AlertOpen('상담 삭제 완료', '상담이 삭제되었습니다.');
                fetchConsultationList(currentPage);
            } else {
                alert.AlertOpen('상담 삭제 실패', response.message || '상담 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상담 삭제 오류:', error);
            alert.AlertOpen('상담 삭제 오류', '상담 삭제 중 오류가 발생했습니다.');
        }
    };

    // 검색
    const handleSearch = () => {
        setCurrentPage(1);
        fetchConsultationList(1);
    };

    // 검색 조건 초기화
    const handleReset = () => {
        setSearchType('all');
        setSearchKeyword('');
        setCategoryCd('');
        setStsCd('');
        setAnonymousYn('');
        setUrgentYn('');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
        fetchConsultationList(1);
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchConsultationList(page);
    };

    // 정렬 변경
    const handleSortChange = (key, order) => {
        setSortKey(key);
        setSortOrder(order);
        fetchConsultationList(currentPage);
    };

    // 답변 모달 열기
    const openAnswerModal = () => {
        setAnswerContent(selectedConsultation.answer?.cntn || '');
        setShowAnswerModal(true);
    };

    // 파일 선택
    const handleFileChange = (e) => {
        setAnswerFiles(Array.from(e.target.files));
    };

    // 상태별 스타일
    const getStatusStyle = (status) => {
        switch (status) {
            case 'STS001': return { color: '#ff6b6b', fontWeight: 'bold' };
            case 'STS002': return { color: '#51cf66', fontWeight: 'bold' };
            case 'STS003': return { color: '#868e96', fontWeight: 'bold' };
            default: return {};
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'PRI001': return { color: '#ff6b6b', fontWeight: 'bold' };
            case 'PRI002': return { color: '#ffa726', fontWeight: 'bold' };
            case 'PRI003': return { color: '#42a5f5', fontWeight: 'bold' };
            case 'PRI004': return { color: '#868e96', fontWeight: 'bold' };
            default: return {};
        }
    };



    // Board 컴포넌트용 컬럼 정의
    const columns = [
        {
            key: 'seq',
            label: '번호',
            width: '80px'
        },
        {
            key: 'ttl',
            label: '제목',
            width: '300px'
        },
        {
            key: 'categoryCd',
            label: '카테고리',
            width: '100px'
        },
        {
            key: 'priorityCd',
            label: '우선순위',
            width: '100px'
        },
        {
            key: 'stsCd',
            label: '상태',
            width: '100px'
        },
        {
            key: 'answerYn',
            label: '답변',
            width: '80px'
        },
        {
            key: 'actions',
            label: '관리',
            width: '120px'
        }
    ];

    // 셀 커스텀 렌더링
    const renderCell = (row, col) => {
        switch (col.key) {
            case 'ttl':
                return (
                    <div style={{ cursor: 'pointer' }} onClick={() => fetchConsultationDetail(row.seq)}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            {row.urgentYn === 'Y' && <span style={{ color: '#ff6b6b', marginRight: '8px' }}>[긴급]</span>}
                            {row.ttl}
                        </div>
                        <div style={{ fontSize: '12px', color: '#868e96' }}>
                            {row.anonymousYn === 'Y' ?
                                (row.nickname ? `익명(${row.nickname})` : '익명') :
                                <EmpNameDisplay
                                    empId={row.regEmpId}
                                    empName={row.regEmpNm}
                                    showId={true}
                                    separator=" "
                                    fallback={`직원(${row.regEmpId})`}
                                    loading={true}
                                />
                            } |
                            {new Date(row.regDate).toLocaleDateString()} |
                            조회 {row.viewCnt}
                        </div>
                    </div>
                );
            case 'categoryCd':
                const category = categoryOptions.find(opt => opt.value === row.categoryCd);
                return category ? category.label : row.categoryCd;
            case 'priorityCd':
                const priority = priorityOptions.find(opt => opt.value === row.priorityCd);
                return priority ? <span style={getPriorityStyle(row.priorityCd)}>{priority.label}</span> : row.priorityCd;
            case 'stsCd':
                const status = statusOptions.find(opt => opt.value === row.stsCd);
                return status ? <span style={getStatusStyle(row.stsCd)}>{status.label}</span> : row.stsCd;
            case 'answerYn':
                return (
                    <span style={{ color: row.answerYn === 'Y' ? '#51cf66' : '#ff6b6b', fontWeight: 'bold' }}>
                        {row.answerYn === 'Y' ? '완료' : '대기'}
                    </span>
                );
            case 'actions':
                return (
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <CmpButton
                            size="small"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                fetchConsultationDetail(row.seq);
                            }}
                        >
                            상세
                        </CmpButton>
                        <CmpButton
                            size="small"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteConsultation(row.seq);
                            }}
                        >
                            삭제
                        </CmpButton>
                    </div>
                );
            default:
                return row[col.key];
        }
    };

    useEffect(() => {
        fetchConsultationList();
    }, []);

    return (
        <PageWrapper
            title="상담 게시판 관리"
            subtitle="직원들의 고충상담을 관리하고 답변할 수 있습니다."
        >
            <PageHeader>
                <h1>상담 게시판 관리</h1>
                <p>직원들의 고충상담을 관리하고 답변할 수 있습니다.</p>
            </PageHeader>

            {/* 검색 영역 */}
            <SearchSection>
                <SearchRow>
                    <SearchItem>
                        <label>검색 조건</label>
                        <CmpSelect
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            options={[
                                { value: 'all', label: '전체' },
                                { value: 'title', label: '제목' },
                                { value: 'content', label: '내용' }
                            ]}
                        />
                    </SearchItem>
                    <SearchItem>
                        <label>검색어</label>
                        <CmpInput
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="검색어를 입력하세요"
                        />
                    </SearchItem>
                    <SearchItem>
                        <label>카테고리</label>
                        <CmpSelect
                            value={categoryCd}
                            onChange={(value) => setCategoryCd(value)}
                            options={categoryOptions}
                        />
                    </SearchItem>
                    <SearchItem>
                        <label>상태</label>
                        <CmpSelect
                            value={stsCd}
                            onChange={(value) => setStsCd(value)}
                            options={statusOptions}
                        />
                    </SearchItem>
                </SearchRow>
                <SearchRow>
                    <SearchItem>
                        <label>익명여부</label>
                        <CmpSelect
                            value={anonymousYn}
                            onChange={(value) => setAnonymousYn(value)}
                            options={[
                                { value: '', label: '전체' },
                                { value: 'Y', label: '익명' },
                                { value: 'N', label: '기명' }
                            ]}
                        />
                    </SearchItem>
                    <SearchItem>
                        <label>긴급여부</label>
                        <CmpSelect
                            value={urgentYn}
                            onChange={(value) => setUrgentYn(value)}
                            options={[
                                { value: '', label: '전체' },
                                { value: 'Y', label: '긴급' },
                                { value: 'N', label: '일반' }
                            ]}
                        />
                    </SearchItem>
                    <SearchItem>
                        <label>시작일</label>
                        <CmpInput
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </SearchItem>
                    <SearchItem>
                        <label>종료일</label>
                        <CmpInput
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </SearchItem>
                </SearchRow>
                <SearchButtons>
                    <CmpButton onClick={handleSearch} variant="primary">
                        검색
                    </CmpButton>
                    <CmpButton onClick={handleReset} variant="outline">
                        초기화
                    </CmpButton>
                    <CmpButton onClick={openIdentityModal} variant="secondary">
                        익명 사용자 동일성 판단
                    </CmpButton>
                </SearchButtons>
            </SearchSection>

            {/* 상담 목록 */}
            <TableSection>
                <Board
                    title={`상담 목록 (${totalElements}건)`}
                    columns={columns}
                    data={consultationList}
                    page={currentPage}
                    totalPages={Math.ceil(totalElements / pageSize)}
                    onPageChange={handlePageChange}
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    renderCell={renderCell}
                    loading={loading}
                />
            </TableSection>

            {/* 상담 상세 모달 */}
            {showDetailModal && selectedConsultation && (
                <CommonModal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title="상담 상세"
                    size="full"
                >
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
                                        <label className="block text-sm font-semibold text-blue-800 mb-2">제목</label>
                                        <div className="bg-white p-3 rounded border border-blue-300">
                                            <span className="text-lg font-medium text-gray-900">
                                                {selectedConsultation.ttl}
                                            </span>
                                        </div>
                                    </div>

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
                                                {categoryOptions.find(opt => opt.value === selectedConsultation.categoryCd)?.label || selectedConsultation.categoryCd}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-blue-800 mb-2">우선순위</label>
                                        <div className="bg-white p-3 rounded border border-blue-300">
                                            <span className="text-lg font-medium" style={getPriorityStyle(selectedConsultation.priorityCd)}>
                                                {priorityOptions.find(opt => opt.value === selectedConsultation.priorityCd)?.label || selectedConsultation.priorityCd}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-blue-800 mb-2">상태</label>
                                        <div className="bg-white p-3 rounded border border-blue-300">
                                            <span className="text-lg font-medium" style={getStatusStyle(selectedConsultation.stsCd)}>
                                                {statusOptions.find(opt => opt.value === selectedConsultation.stsCd)?.label || selectedConsultation.stsCd}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-blue-800 mb-2">등록일</label>
                                        <div className="bg-white p-3 rounded border border-blue-300">
                                            <span className="text-lg font-medium text-gray-900">
                                                {new Date(selectedConsultation.regDate).toLocaleString()}
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

                            {/* 첨부파일 */}
                            {selectedConsultation.files && selectedConsultation.files.length > 0 && (
                                <div className="bg-gray-50 p-6 rounded-lg border">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="mr-2">📎</span>
                                        첨부파일
                                    </h3>
                                    <div className="bg-white p-4 rounded border">
                                        <div className="space-y-2">
                                            {selectedConsultation.files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                                    <a
                                                        href={`/api/file/download/${file.fileSeq}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        {file.originalFileName}
                                                    </a>
                                                    <span className="text-sm text-gray-500">
                                                        ({Math.round(file.fileSize / 1024)}KB)
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 답변 */}
                            {selectedConsultation.answer ? (
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                                        <span className="mr-2">✅</span>
                                        답변
                                    </h3>
                                    <div className="mb-4">
                                        <div className="bg-white p-3 rounded border border-green-300">
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>답변자: <EmpNameDisplay empId={selectedConsultation.answer.regEmpId} empName={selectedConsultation.answer.regEmpNm} /></span>
                                                <span>답변일: {new Date(selectedConsultation.answer.regDate).toLocaleString()}</span>
                                            </div>
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
                                    {selectedConsultation.answer.files && selectedConsultation.answer.files.length > 0 && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-green-800 mb-2">답변 첨부파일</label>
                                            <div className="bg-white p-4 rounded border border-green-300">
                                                <div className="space-y-2">
                                                    {selectedConsultation.answer.files.map((file, index) => (
                                                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                                                            <a
                                                                href={`/api/file/download/${file.fileSeq}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                {file.originalFileName}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
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

                    <ModalFooter>
                        <CmpButton onClick={openAnswerModal} variant="primary">
                            {selectedConsultation.answer ? '답변 수정' : '답변 등록'}
                        </CmpButton>
                        <CmpButton onClick={() => setShowDetailModal(false)} variant="outline">
                            닫기
                        </CmpButton>
                    </ModalFooter>
                </CommonModal>
            )}

            {/* 답변 모달 */}
            {showAnswerModal && (
                <CommonModal
                    isOpen={showAnswerModal}
                    onClose={() => setShowAnswerModal(false)}
                    title={selectedConsultation?.answer ? '답변 수정' : '답변 등록'}
                    size="medium"
                >
                    <AnswerForm>
                        <FormGroup>
                            <label>답변 내용 *</label>
                            <CmpTextarea
                                value={answerContent}
                                onChange={(e) => setAnswerContent(e.target.value)}
                                placeholder="답변 내용을 입력하세요"
                                rows={12}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>첨부파일</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={{ marginTop: '8px' }}
                            />
                            {answerFiles.length > 0 && (
                                <FileList style={{ marginTop: '8px' }}>
                                    {answerFiles.map((file, index) => (
                                        <FileItem key={index}>
                                            {file.name} ({(file.size / 1024).toFixed(1)}KB)
                                        </FileItem>
                                    ))}
                                </FileList>
                            )}
                        </FormGroup>
                    </AnswerForm>

                    <ModalFooter>
                        <CmpButton onClick={saveAnswer} variant="primary">
                            저장
                        </CmpButton>
                        <CmpButton onClick={() => setShowAnswerModal(false)} variant="outline">
                            취소
                        </CmpButton>
                    </ModalFooter>
                </CommonModal>
            )}

            {/* 익명 사용자 동일성 판단 모달 */}
            <AnonymousIdentityManager
                isOpen={showIdentityModal}
                onClose={() => setShowIdentityModal(false)}
            />
        </PageWrapper>
    );
};

const PageHeader = styled.div`
    margin-bottom: 32px;

    h1 {
        font-size: 28px;
        font-weight: bold;
        margin: 0 0 8px 0;
        color: #1a1a1a;
    }

    p {
        font-size: 16px;
        color: #666;
        margin: 0;
    }
`;

const SearchSection = styled.div`
    background: #f8f9fa;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
`;

const SearchRow = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const SearchItem = styled.div`
    flex: 1;

    label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        color: #333;
    }
`;

const SearchButtons = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 16px;
`;

const TableSection = styled.div`
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DetailContent = styled.div`
    max-height: 60vh;
    overflow-y: auto;
`;

const DetailSection = styled.div`
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const DetailRow = styled.div`
    display: flex;
    margin-bottom: 12px;
    align-items: center;
`;

const DetailLabel = styled.div`
    font-weight: 600;
    color: #333;
    min-width: 100px;
    margin-right: 16px;
`;

const DetailValue = styled.div`
    color: #666;
    flex: 1;
`;

const DetailContentBox = styled.div`
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 16px;
    margin-top: 8px;
`;

const FileList = styled.div`
    margin-top: 8px;
`;

const FileItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    a {
        color: #007bff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const AnswerContent = styled.div`
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 16px;
    margin-top: 8px;
`;

const AnswerHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #dee2e6;
    font-size: 14px;
    color: #666;
`;

const AnswerBody = styled.div`
    margin-bottom: 16px;
`;

const AnswerFiles = styled.div`
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #dee2e6;
`;

const AnswerForm = styled.div`
    margin-bottom: 24px;
`;

const FormGroup = styled.div`
    margin-bottom: 16px;

    label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        color: #333;
    }
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
`;



export default CounselingPage;
