'use client';

import empNameCache from '@/common/empNameCache';
import { usePageMoveStore } from '@/common/store/pageMoveStore';
import Board from '@/components/Board';
import EmpNameDisplay from '@/components/EmpNameDisplay';
import PageWrapper from '@/components/layout/PageWrapper';
import CmpInput from '@/components/ui/CmpInput';
import CmpSelect from '@/components/ui/CmpSelect';
import { authAPI, noticeAPI } from '@/lib/api';
import { useEffect, useState } from 'react';

const columns = [
    { key: 'rowNum', label: '순번' },
    { key: 'ttl', label: '제목' },
    { key: 'writer', label: '작성자' },
    { key: 'regDate', label: '작성일' },
    { key: 'stsCd', label: '상태' },
];

export default function NoticePage() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortKey, setSortKey] = useState('seq');
    const [sortOrder, setSortOrder] = useState('asc');
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stsCd, setStsCd] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

    // 페이지 로드 시 직원 캐시 초기화
    useEffect(() => {
        const initializePage = async () => {
            // 직원 캐시가 초기화되지 않았으면 초기화
            if (!empNameCache.isCacheInitialized()) {
                try {
                    const employeeCache = await authAPI.getEmployeeCache();
                    empNameCache.initialize(employeeCache);
                    console.log('직원 캐시 초기화 완료:', empNameCache.getSize(), '명');
                } catch (error) {
                    console.error('직원 캐시 초기화 실패:', error);
                }
            }
        };

        initializePage();
    }, []);

    // 목록 불러오기
    const fetchList = async (params = {}) => {
        setLoading(true);
        try {
            const res = await noticeAPI.getNoticePage({
                page: params.page || page,
                size: params.size || size,
                sortKey: params.sortKey || sortKey,
                sortOrder: params.sortOrder || sortOrder,
                ttl: params.ttl ?? search,
                startDate: params.startDate ?? startDate,
                endDate: params.endDate ?? endDate,
                stsCd: params.stsCd ?? stsCd,
            });
            setData(
                (res.content || []).map(item => ({
                    id: item.rowNum, // rowNum을 id로 사용
                    rowNum: item.rowNum,
                    seq: item.seq, // seq는 상세 이동 등 내부 용도
                    ttl: item.ttl,
                    writer: item.regEmpId,
                    regDate: item.regDate,
                    stsCd: item.stsCd,
                    ctnt: item.cntn,
                }))
            );
            setTotalPages(res.totalPages || 1);
            setPage(res.currentPage || 1);
        } catch (e) {
            setData([]);
            setTotalPages(1);
        }
        setLoading(false);
    };

    // 상세 불러오기
    const fetchDetail = async (id) => {
        setLoading(true);
        try {
            const res = await fetch(`/resources/notice/${id}`);
            const result = await res.json();
            setDetail({
                ttl: result.ttl,
                writer: result.regEmpId,
                regDate: result.regDate,
                ctnt: result.cntn,
            });
        } catch (e) {
            setDetail(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!selected) fetchList();
        // eslint-disable-next-line
    }, [page, size, sortKey, sortOrder]);

    // 검색
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchList({ page: 1, size, ttl: search, startDate, endDate, stsCd });
    };

    // 정렬
    const handleSortChange = (key, order) => {
        setSortKey(key);
        setSortOrder(order);
        setPage(1);
    };

    // 행 클릭
    const handleRowClick = (row) => {
        setMoveTo(`/resources/notice/${row.seq}`);
    };

    // 목록으로
    const handleBack = () => {
        setSelected(null);
        setDetail(null);
    };

    return (
        <PageWrapper
            title="자료실"
            subtitle="공지사항"
            showCard={false}
        >
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-2xl font-bold mb-6">공지사항</h1>
            {!selected ? (
                <>
                    <form onSubmit={handleSearch} className="mb-4 flex flex-row flex-wrap items-center gap-x-2 gap-y-2">
                        <CmpInput
                            placeholder="제목"
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
                        <CmpInput
                            placeholder="상태코드"
                            value={stsCd}
                            onChange={e => setStsCd(e.target.value)}
                            wrapperClassName="w-32"
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
                                return <EmpNameDisplay empId={row.writer} />;
                            }
                            return row[col.key];
                        }}
                        className=""
                        style={{}}
                        onRowClick={handleRowClick}
                    />
                </>
            ) : (
                <div>
                    <button onClick={handleBack} className="mb-4 text-blue-600 underline">&larr; 목록으로</button>
                    {loading ? (
                        <div>로딩 중...</div>
                    ) : detail ? (
                        <div className="border rounded p-6 bg-gray-50">
                            <h2 className="text-xl font-bold mb-2">{detail.ttl}</h2>
                            <div className="mb-2 text-gray-600">작성자: <EmpNameDisplay empId={detail.writer} /></div>
                            <div className="mb-4 text-gray-500">작성일: {detail.regDate?.slice(0, 10) || '-'}</div>
                            <div className="prose" dangerouslySetInnerHTML={{ __html: detail.ctnt || '' }} />
                        </div>
                    ) : (
                        <div>상세 정보를 불러올 수 없습니다.</div>
                    )}
                </div>
            )}
            </div>
        </PageWrapper>
    );
}
