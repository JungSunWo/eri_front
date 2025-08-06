'use client';

import { useQuery } from '@/app/shared/hooks/useQuery';
import Board from '@/components/Board';
import EmpNameDisplay from '@/components/EmpNameDisplay';
import CmpInput from '@/components/ui/CmpInput';
import CmpSelect from '@/components/ui/CmpSelect';
import PageWrapper from '@/layouts/PageWrapper';
import { noticeAPI } from '@/services/api';
import { usePageMoveStore } from '@/slices/pageMoveStore';
import { useCallback, useEffect, useState } from 'react';

const columns = [
    { key: 'rowNum', label: '순번' },
    { key: 'ttl', label: '제목' },
    { key: 'writer', label: '작성자' },
    { key: 'regDate', label: '작성일' },
];

export default function NoticePage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [sortKey, setSortKey] = useState('seq');
    const [sortOrder, setSortOrder] = useState('asc');
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('ttl'); // 검색 필드 (ttl: 제목, cntn: 내용)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stsCd, setStsCd] = useState('STS001'); // 직원화면에서는 STS001(활성) 상태만 노출
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

    // 목록 조회 쿼리 파라미터
    const listQueryParams = {
        page,
        size,
        sortKey,
        sortOrder,
        searchKeyword: search,
        searchField,
        startDate,
        endDate,
        stsCd: 'STS001', // 직원화면에서는 STS001(활성) 상태만 노출
    };

    // Zustand Query를 사용한 목록 조회
    const {
        data: listData,
        isLoading: listLoading,
        error: listError,
        refetch: refetchList
    } = useQuery(
        ['notice-list', listQueryParams],
        () => noticeAPI.getNoticePage(listQueryParams),
        {
            cacheTime: 5 * 60 * 1000, // 5분 캐시
            retry: 3,
            refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
        }
    );

    // Zustand Query를 사용한 상세 조회
    const {
        data: detailData,
        isLoading: detailLoading,
        error: detailError,
        refetch: refetchDetail
    } = useQuery(
        ['notice-detail', selected],
        () => noticeAPI.getNoticeDetail(selected),
        {
            cacheTime: 10 * 60 * 1000, // 10분 캐시
            retry: 2,
            enabled: !!selected, // 선택된 항목이 있을 때만 실행
        }
    );

    // 데이터 변환
    const data = listData?.content ? listData.content.map(item => ({
        id: item.rowNum, // rowNum을 id로 사용
        rowNum: item.rowNum,
        seq: item.seq, // seq는 상세 이동 등 내부 용도
        ttl: item.ttl,
        writer: item.regEmpId,
        regDate: item.regDate,
        stsCd: item.stsCd,
        ctnt: item.cntn,
    })) : [];

    const totalPages = listData?.totalPages || 1;

    // 상세 데이터 설정
    useEffect(() => {
        if (detailData) {
            setDetail({
                ttl: detailData.ttl,
                writer: detailData.regEmpId,
                regDate: detailData.regDate,
                ctnt: detailData.cntn,
            });
        }
    }, [detailData]);

    // 검색
    const handleSearch = useCallback((e) => {
        e.preventDefault();
        setPage(1);
        // refetchList() 호출 제거 - 무한 재로딩 방지
    }, []);

    // 정렬
    const handleSortChange = useCallback((key, order) => {
        setSortKey(key);
        setSortOrder(order);
        setPage(1);
    }, []);

    // 행 클릭
    const handleRowClick = useCallback((row) => {
        setSelected(row.seq);
        setMoveTo(`/resources/notice/${row.seq}`);
    }, [setMoveTo]);

    // 목록으로
    const handleBack = useCallback(() => {
        setSelected(null);
        setDetail(null);
    }, []);

    // 에러 메시지 생성 함수
    const getErrorMessage = (error) => {
        if (!error) return '';

        if (typeof error === 'string') {
            return error;
        }

        if (error.type === 'response') {
            return `서버 오류 (${error.status}): ${error.message}`;
        } else if (error.type === 'network') {
            return '네트워크 연결 오류가 발생했습니다.';
        } else if (error.type === 'request') {
            return `요청 오류: ${error.message}`;
        }

        return error.message || '알 수 없는 오류가 발생했습니다.';
    };

    return (
        <PageWrapper
            title="자료실"
            subtitle="공지사항"
            showCard={false}
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">공지사항</h1>
                {!selected ? (
                    <>
                        <form onSubmit={handleSearch} className="mb-4 flex flex-row flex-wrap items-center gap-x-2 gap-y-2">
                            <CmpSelect
                                value={searchField}
                                onChange={(value) => setSearchField(value)}
                                options={[
                                    { value: 'ttl', label: '제목' },
                                    { value: 'cntn', label: '내용' },
                                    { value: 'both', label: '제목+내용' }
                                ]}
                                size="md"
                                wrapperClassName="w-28"
                            />
                            <CmpInput
                                placeholder="검색어 입력"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                wrapperClassName="w-48"
                            />
                            <CmpInput
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                wrapperClassName="w-40"
                            />
                            <CmpInput
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                wrapperClassName="w-40"
                            />
                            <CmpSelect
                                value={size}
                                onChange={(value) => { setSize(Number(value)); setPage(1); }}
                                options={[3, 5, 10, 20, 50].map(n => ({ value: n, label: `${n}개씩` }))}
                                size="md"
                                wrapperClassName="w-28"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 h-12 rounded flex-shrink-0 min-w-[80px]"
                            >
                                검색
                            </button>
                        </form>
                        <Board
                            title={null}
                            columns={columns}
                            data={data}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            sortKey={sortKey}
                            sortOrder={sortOrder}
                            onSortChange={handleSortChange}
                            renderCell={(row, col) => {
                                if (col.key === 'rowNum') return row.rowNum;
                                if (col.key === 'writer') {
                                    return <EmpNameDisplay empId={row.writer} empName={row.writerName} />;
                                }
                                if (col.key === 'regDate') {
                                    // 작성일을 날짜+시간 형식으로 표시
                                    return row.regDate ? row.regDate.replace('T', ' ').substring(0, 19) : '-';
                                }
                                return row[col.key];
                            }}
                            className=""
                            style={{}}
                            onRowClick={handleRowClick}
                        />
                        {listError && (
                            <div className="text-red-500 mt-4 p-4 bg-red-50 rounded border border-red-200">
                                <div className="font-medium mb-1">데이터를 불러오는 중 오류가 발생했습니다:</div>
                                <div className="text-sm">{getErrorMessage(listError)}</div>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <button onClick={handleBack} className="mb-4 text-blue-600 underline">&larr; 목록으로</button>
                        {detailLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-gray-500">로딩 중...</div>
                            </div>
                        ) : detailError ? (
                            <div className="text-red-500 p-4 bg-red-50 rounded border border-red-200">
                                <div className="font-medium mb-1">상세 정보를 불러오는 중 오류가 발생했습니다:</div>
                                <div className="text-sm">{getErrorMessage(detailError)}</div>
                            </div>
                        ) : detail ? (
                            <div className="border rounded p-6 bg-gray-50">
                                <h2 className="text-xl font-bold mb-2">{detail.ttl}</h2>
                                <div className="mb-2 text-gray-600">작성자: <EmpNameDisplay empId={detail.writer} empName={detail.writerName} /></div>
                                <div className="mb-4 text-gray-500">작성일: {detail.regDate?.slice(0, 10) || '-'}</div>
                                <div className="prose" dangerouslySetInnerHTML={{ __html: detail.ctnt || '' }} />
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">상세 정보를 불러올 수 없습니다.</div>
                        )}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
