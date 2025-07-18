'use client';
import Board from '@/components/Board';
import { CmpButton } from '@/components/button/cmp_button';
import PageWrapper from '@/components/layout/PageWrapper';
import CmpInput from '@/components/ui/CmpInput';
import CmpSelect from '@/components/ui/CmpSelect';
import CmpTab from '@/components/ui/CmpTab';
import CmpTextarea from '@/components/ui/CmpTextarea';
import CommonModal from '@/components/ui/CommonModal';
import { commonCodeAPI } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function ComCdMngPage() {
  const [tab, setTab] = useState('group');
  const [groupCodes, setGroupCodes] = useState([]);

  const tabs = [
    { key: 'group', label: '그룹코드 관리' },
    { key: 'detail', label: '상세코드 관리' }
  ];

  return (
    <PageWrapper title="ERI 공통코드 관리" >
      <div className="max-w-6xl mx-auto">
        <CmpTab
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
        />
        {tab === 'group' && <GroupCodeSection groupCodes={groupCodes} setGroupCodes={setGroupCodes} />}
        {tab === 'detail' && <DetailCodeSection groupCodes={groupCodes} />}
      </div>
    </PageWrapper>
  );
}

function GroupCodeSection({ groupCodes, setGroupCodes }) {
  const [search, setSearch] = useState({ keyword: '', useYn: '' });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalForm, setModalForm] = useState({ grpCd: '', grpCdNm: '', desc: '', useYn: 'Y' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  // Board 페이징/정렬 상태
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState('grpCd');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRow, setSelectedRow] = useState(null);

  // 목록 조회
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await commonCodeAPI.getGroupList({ keyword: search.keyword, useYn: search.useYn, page, size, sortKey, sortOrder });
      setData(res?.data?.content || []);
      setTotalPages(res?.data?.totalPages || 1);
      setGroupCodes((res?.data?.content || []).map(row => ({ grpCd: row.grpCd, grpCdNm: row.grpCdNm })));
    } catch (e) {
      setAlert('목록 조회 실패');
    }
    setLoading(false);
  };
  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [page, sortKey, sortOrder]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await fetchList();
  };
  const handleReset = async () => {
    setSearch({ keyword: '', useYn: '' });
    setPage(1);
    setTimeout(fetchList, 0);
  };
  const openAddModal = () => {
    setModalMode('add');
    setModalForm({ grpCd: '', grpCdNm: '', desc: '', useYn: 'Y' });
    setShowModal(true);
    setEditId(null);
    setError('');
  };
  const openEditModal = (row) => {
    setModalMode('edit');
    setModalForm({ grpCd: row.grpCd, grpCdNm: row.grpCdNm, desc: row.desc, useYn: row.useYn });
    setShowModal(true);
    setEditId(row.grpCd);
    setError('');
  };
  const handleDelete = async (grpCd) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await commonCodeAPI.deleteGroup(grpCd);
        setAlert('삭제되었습니다.');
        fetchList();
      } catch (e) {
        setAlert('삭제 실패');
      }
      setTimeout(() => setAlert(''), 2000);
    }
  };
  const handleModalSave = async (e) => {
    e.preventDefault();
    if (!modalForm.grpCd || !modalForm.grpCdNm) {
      setError('그룹코드와 그룹코드명은 필수입니다.');
      return;
    }
    try {
      if (modalMode === 'add') {
        await commonCodeAPI.createGroup(modalForm);
        setAlert('등록되었습니다.');
      } else if (modalMode === 'edit') {
        await commonCodeAPI.updateGroup(editId, modalForm);
        setAlert('수정되었습니다.');
      }
      setShowModal(false);
      fetchList();
    } catch (e) {
      setError('저장 실패');
    }
    setTimeout(() => setAlert(''), 2000);
  };

  // Board columns
  const columns = [
    { key: 'rowNum', label: '번호', width: '56px' },
    { key: 'grpCd', label: '그룹코드', width: '120px' },
    { key: 'grpCdNm', label: '그룹코드명', width: '160px' },
    { key: 'desc', label: '설명', width: '200px' },
    { key: 'useYn', label: '사용여부', width: '80px' },
    { key: 'regDate', label: '등록일시', width: '140px' },
    { key: 'modDate', label: '수정일시', width: '140px' },
    { key: 'actions', label: '관리', width: '110px' },
  ];

  // 한글 라벨 매핑
  const fieldLabels = {
    grpCd: '그룹코드',
    grpCdNm: '그룹코드명',
    desc: '설명',
    useYn: '사용여부',
    regDate: '등록일시',
    modDate: '수정일시',
  };

  return (
    <div className="section mb-8">
      <div className="font-bold text-lg mb-4 border-b pb-2">그룹코드 관리</div>
      {alert && <div className="mb-2 text-green-600 font-bold">{alert}</div>}
      <form className="flex flex-row flex-wrap gap-4 mb-4 items-end" onSubmit={handleSearch}>
        <CmpInput label="검색어" placeholder="그룹코드명 또는 설명" value={search.keyword} onChange={e => setSearch(s => ({ ...s, keyword: e.target.value }))} wrapperClassName="w-64" />
        <CmpSelect label="사용여부" value={search.useYn} onChange={v => setSearch(s => ({ ...s, useYn: v }))} options={[{value:'',label:'전체'},{value:'Y',label:'사용'},{value:'N',label:'미사용'}]} wrapperClassName="w-40" />
        <CmpButton label="검색" styleType="primary" type="submit" className="w-auto px-4 h-10 text-base font-bold" size="h40" />
        <CmpButton label="초기화" styleType="gray" onClick={handleReset} className="w-auto px-4 h-10 text-base font-bold" size="h40" />
      </form>
      <div className="mb-2 flex flex-row gap-2">
        <CmpButton label="새 그룹코드 등록" styleType="success" onClick={openAddModal} className="w-auto px-4 h-10 text-base font-bold" size="h40" />
        <CmpButton label="새로고침" styleType="info" onClick={fetchList} className="w-auto px-4 h-10 text-base font-bold" size="h40" />
      </div>
      <div className="overflow-x-auto">
        {loading ? <div className="text-center py-8">로딩 중...</div> : (
          <Board
            columns={columns}
            data={data.map((row, idx) => ({ ...row, rowNum: (page - 1) * size + idx + 1, actions: null }))}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSortChange={(key, order) => { setSortKey(key); setSortOrder(order); setPage(1); }}
            onRowClick={row => setSelectedRow(row)}
            renderCell={(row, col) => {
              if (col.key === 'useYn') return row.useYn === 'Y' ? <span className="text-green-600 font-bold">사용</span> : <span className="text-red-600 font-bold">미사용</span>;
              if (col.key === 'actions') return (
                <div className="flex flex-row gap-2">
                  <CmpButton label="수정" styleType="warning" onClick={e => { e.stopPropagation(); openEditModal(row); }} size="h40" className="min-w-[60px] px-4" />
                  <CmpButton label="삭제" styleType="danger" onClick={e => { e.stopPropagation(); handleDelete(row.grpCd); }} size="h40" className="min-w-[60px] px-4" />
                </div>
              );
              return row[col.key];
            }}
          />
        )}
      </div>
      {/* 등록/수정 모달 */}
      <CommonModal isOpen={showModal} onClose={()=>setShowModal(false)} title={modalMode === 'add' ? '그룹코드 등록' : '그룹코드 수정'}>
        {error && <div className="mb-2 text-red-600 font-bold">{error}</div>}
        <form onSubmit={handleModalSave}>
          <div className="flex gap-4 mb-4">
            <CmpInput label="그룹코드" required value={modalForm.grpCd} onChange={e => setModalForm(f => ({ ...f, grpCd: e.target.value }))} wrapperClassName="w-1/2" />
            <CmpInput label="그룹코드명" required value={modalForm.grpCdNm} onChange={e => setModalForm(f => ({ ...f, grpCdNm: e.target.value }))} wrapperClassName="w-1/2" />
          </div>
          <CmpTextarea label="설명" rows={3} value={modalForm.desc} onChange={e => setModalForm(f => ({ ...f, desc: e.target.value }))} wrapperClassName="mb-4" />
          <CmpSelect label="사용여부" value={modalForm.useYn} onChange={v => setModalForm(f => ({ ...f, useYn: v }))} options={[{value:'Y',label:'사용'},{value:'N',label:'미사용'}]} required wrapperClassName="mb-4 w-40" />
          <div className="flex gap-2 mt-4 justify-end">
            <CmpButton label="저장" styleType="primary" type="submit" />
            <CmpButton label="취소" styleType="gray" onClick={()=>setShowModal(false)} />
          </div>
        </form>
      </CommonModal>
      {/* 상세 모달 */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-2xl" onClick={()=>setSelectedRow(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">그룹코드 상세</h2>
            <table className="w-full mb-4">
              <tbody>
                {Object.entries(fieldLabels).map(([key, label]) => (
                  <tr key={key}>
                    <td className="py-2 px-2 font-bold text-gray-600 w-32">{label}</td>
                    <td className="py-2 px-2">{key === 'useYn' ? (selectedRow[key] === 'Y' ? '사용' : '미사용') : selectedRow[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-2 mt-6">
              <CmpButton label="수정" styleType="warning" onClick={()=>{ setShowModal(false); setSelectedRow(null); openEditModal(selectedRow); }} />
              <CmpButton label="삭제" styleType="danger" onClick={()=>{ if(window.confirm('정말로 삭제하시겠습니까?')) { handleDelete(selectedRow.grpCd); setSelectedRow(null); } }} />
              <CmpButton label="닫기" styleType="gray" onClick={()=>setSelectedRow(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCodeSection({ groupCodes }) {
  const [search, setSearch] = useState({ groupCd: '', keyword: '', useYn: '' });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalForm, setModalForm] = useState({ grpCd: '', dtlCd: '', dtlCdNm: '', sortOrder: 1, desc: '', useYn: 'Y' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState('grpCd');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRow, setSelectedRow] = useState(null);

  const groupOptions = [{ value: '', label: '전체' }, ...groupCodes.map(g => ({ value: g.grpCd, label: `${g.grpCd} - ${g.grpCdNm}` }))];
  const groupOptionsModal = [{ value: '', label: '그룹코드 선택' }, ...groupCodes.map(g => ({ value: g.grpCd, label: `${g.grpCd} - ${g.grpCdNm}` }))];

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await commonCodeAPI.getDetailList({ grpCd: search.groupCd, keyword: search.keyword, useYn: search.useYn, page, size, sortKey, sortOrder });
      setData(res?.data?.content || []);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (e) {
      setAlert('목록 조회 실패');
    }
    setLoading(false);
  };
  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [groupCodes, page, sortKey, sortOrder]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await fetchList();
  };
  const handleReset = async () => {
    setSearch({ groupCd: '', keyword: '', useYn: '' });
    setPage(1);
    setTimeout(fetchList, 0);
  };
  const openAddModal = () => {
    setModalMode('add');
    setModalForm({ grpCd: '', dtlCd: '', dtlCdNm: '', sortOrder: 1, desc: '', useYn: 'Y' });
    setShowModal(true);
    setEditId(null);
    setError('');
  };
  const openEditModal = (row) => {
    setModalMode('edit');
    setModalForm({ grpCd: row.grpCd, dtlCd: row.dtlCd, dtlCdNm: row.dtlCdNm, sortOrder: row.sortOrder, desc: row.desc, useYn: row.useYn });
    setShowModal(true);
    setEditId({ grpCd: row.grpCd, dtlCd: row.dtlCd });
    setError('');
  };
  const handleDelete = async (grpCd, dtlCd) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await commonCodeAPI.deleteDetail(grpCd, dtlCd);
        setAlert('삭제되었습니다.');
        fetchList();
      } catch (e) {
        setAlert('삭제 실패');
      }
      setTimeout(() => setAlert(''), 2000);
    }
  };
  const handleModalSave = async (e) => {
    e.preventDefault();
    if (!modalForm.grpCd || !modalForm.dtlCd || !modalForm.dtlCdNm) {
      setError('그룹코드, 상세코드, 상세코드명은 필수입니다.');
      return;
    }
    try {
      if (modalMode === 'add') {
        await commonCodeAPI.createDetail(modalForm);
        setAlert('등록되었습니다.');
      } else if (modalMode === 'edit') {
        await commonCodeAPI.updateDetail(editId.grpCd, editId.dtlCd, modalForm);
        setAlert('수정되었습니다.');
      }
      setShowModal(false);
      fetchList();
    } catch (e) {
      setError('저장 실패');
    }
    setTimeout(() => setAlert(''), 2000);
  };

  // Board columns
  const columns = [
    { key: 'rowNum', label: '번호', width: '56px' },
    { key: 'grpCd', label: '그룹코드', width: '120px' },
    { key: 'dtlCd', label: '상세코드', width: '120px' },
    { key: 'dtlCdNm', label: '상세코드명', width: '160px' },
    { key: 'desc', label: '설명', width: '200px' },
    { key: 'sortOrder', label: '정렬순서', width: '80px' },
    { key: 'useYn', label: '사용여부', width: '80px' },
    { key: 'regDate', label: '등록일시', width: '140px' },
    { key: 'modDate', label: '수정일시', width: '140px' },
    { key: 'actions', label: '관리', width: '110px' },
  ];

  // 한글 라벨 매핑
  const fieldLabels = {
    grpCd: '그룹코드',
    dtlCd: '상세코드',
    dtlCdNm: '상세코드명',
    desc: '설명',
    sortOrder: '정렬순서',
    useYn: '사용여부',
    regDate: '등록일시',
    modDate: '수정일시',
  };

  return (
    <div className="section mb-8">
      <div className="font-bold text-lg mb-4 border-b pb-2">상세코드 관리</div>
      {alert && <div className="mb-2 text-green-600 font-bold">{alert}</div>}
      <form className="flex flex-row flex-wrap gap-4 mb-4 items-end" onSubmit={handleSearch}>
        <CmpSelect label="그룹코드" value={search.groupCd} onChange={v => setSearch(s => ({ ...s, groupCd: v }))} options={groupOptions} wrapperClassName="w-40" />
        <CmpInput label="검색어" placeholder="상세코드명 또는 설명" value={search.keyword} onChange={e => setSearch(s => ({ ...s, keyword: e.target.value }))} wrapperClassName="w-64" />
        <CmpSelect label="사용여부" value={search.useYn} onChange={v => setSearch(s => ({ ...s, useYn: v }))} options={[{value:'',label:'전체'},{value:'Y',label:'사용'},{value:'N',label:'미사용'}]} wrapperClassName="w-40" />
        <CmpButton label="검색" styleType="primary" type="submit" className="w-auto px-4 h-10 text-base font-bold" size="h40" />
        <CmpButton label="초기화" styleType="gray" onClick={handleReset} className="w-auto px-4 h-10 text-base font-bold" size="h40" />
      </form>
      <div className="mb-2 flex flex-row gap-2">
        <CmpButton label="새 상세코드 등록" styleType="success" onClick={openAddModal} className="w-auto px-4 h-10 text-base font-bold" size="h40" />
        <CmpButton label="새로고침" styleType="info" onClick={fetchList} className="w-auto px-4 h-10 text-base font-bold" size="h40" />
      </div>
      <div className="overflow-x-auto">
        {loading ? <div className="text-center py-8">로딩 중...</div> : (
          <Board
            columns={columns}
            data={data.map((row, idx) => ({ ...row, rowNum: (page - 1) * size + idx + 1, actions: null }))}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSortChange={(key, order) => { setSortKey(key); setSortOrder(order); setPage(1); }}
            onRowClick={row => setSelectedRow(row)}
            renderCell={(row, col) => {
              if (col.key === 'useYn') return row.useYn === 'Y' ? <span className="text-green-600 font-bold">사용</span> : <span className="text-red-600 font-bold">미사용</span>;
              if (col.key === 'actions') return (
                <div className="flex flex-row gap-2">
                  <CmpButton label="수정" styleType="warning" onClick={e => { e.stopPropagation(); openEditModal(row); }} size="h40" className="min-w-[60px] px-4" />
                  <CmpButton label="삭제" styleType="danger" onClick={e => { e.stopPropagation(); handleDelete(row.grpCd, row.dtlCd); }} size="h40" className="min-w-[60px] px-4" />
                </div>
              );
              return row[col.key];
            }}
          />
        )}
      </div>
      {/* 상세코드 등록/수정 모달도 동일하게 교체 */}
      <CommonModal isOpen={showModal} onClose={()=>setShowModal(false)} title={modalMode === 'add' ? '상세코드 등록' : '상세코드 수정'}>
        {error && <div className="mb-2 text-red-600 font-bold">{error}</div>}
        <form onSubmit={handleModalSave}>
          <div className="flex gap-4 mb-4">
            <CmpSelect label="그룹코드" value={modalForm.grpCd} onChange={v => setModalForm(f => ({ ...f, grpCd: v }))} options={groupOptionsModal} required wrapperClassName="w-1/2" />
            <CmpInput label="상세코드" required value={modalForm.dtlCd} onChange={e => setModalForm(f => ({ ...f, dtlCd: e.target.value }))} wrapperClassName="w-1/2" />
          </div>
          <div className="flex gap-4 mb-4">
            <CmpInput label="상세코드명" required value={modalForm.dtlCdNm} onChange={e => setModalForm(f => ({ ...f, dtlCdNm: e.target.value }))} wrapperClassName="w-1/2" />
            <CmpInput label="정렬순서" type="number" value={modalForm.sortOrder} onChange={e => setModalForm(f => ({ ...f, sortOrder: e.target.value }))} wrapperClassName="w-1/2" />
          </div>
          <CmpTextarea label="설명" rows={3} value={modalForm.desc} onChange={e => setModalForm(f => ({ ...f, desc: e.target.value }))} wrapperClassName="mb-4" />
          <CmpSelect label="사용여부" value={modalForm.useYn} onChange={v => setModalForm(f => ({ ...f, useYn: v }))} options={[{value:'Y',label:'사용'},{value:'N',label:'미사용'}]} required wrapperClassName="mb-4 w-40" />
          <div className="flex gap-2 mt-4 justify-end">
            <CmpButton label="저장" styleType="primary" type="submit" />
            <CmpButton label="취소" styleType="gray" onClick={()=>setShowModal(false)} />
          </div>
        </form>
      </CommonModal>
      {/* 상세 모달 */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-2xl" onClick={()=>setSelectedRow(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">상세코드 상세</h2>
            <table className="w-full mb-4">
              <tbody>
                {Object.entries(fieldLabels).map(([key, label]) => (
                  <tr key={key}>
                    <td className="py-2 px-2 font-bold text-gray-600 w-32">{label}</td>
                    <td className="py-2 px-2">{key === 'useYn' ? (selectedRow[key] === 'Y' ? '사용' : '미사용') : selectedRow[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-2 mt-6">
              <CmpButton label="수정" styleType="warning" onClick={()=>{ setShowModal(false); setSelectedRow(null); openEditModal(selectedRow); }} />
              <CmpButton label="삭제" styleType="danger" onClick={()=>{ if(window.confirm('정말로 삭제하시겠습니까?')) { handleDelete(selectedRow.grpCd, selectedRow.dtlCd); setSelectedRow(null); } }} />
              <CmpButton label="닫기" styleType="gray" onClick={()=>setSelectedRow(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
