"use client";

import { authAPI, menuAPI, noticeAPI } from '@/app/core/services/api';
import { useLnbMenuStore } from '@/app/core/slices/lnbMenuStore';
import { useMenuStore } from '@/app/core/slices/menuStore';
import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import Board from '@/app/shared/components/Board';
import { CalendarSet, CmpBsArea } from '@/app/shared/components/bottomSheets/cmp_bottomSheets';
import { CmpBsCalendarArea, CmpBsPeriodCalendarArea, CmpBsWrapAccountCont, CmpBsWrapDefautlCont, CmpBsWrapDescriptionCont, CmpBsWrapLinkCont } from '@/app/shared/components/bottomSheets/cmp_bottomSheets_wrapper';
import { EChartsBarChart, EChartsLineChart, EChartsPieChart, EChartsScatterChart } from '@/app/shared/components/charts';
import { CmpFpArea, CmpFpCont, CmpFpTitle } from '@/app/shared/components/fullPopup/cmp_fullPopup';
import * as UI from '@/app/shared/components/ui';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import storage from '@/app/shared/utils/storage';
import { FullPopup, alert, bottomSheet, toast } from '@/app/shared/utils/ui_com';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { BarChart3, Bell, ChevronDown, ClipboardList, Cloud, Code, Database, Info, Layers, List, Settings, Square, Table } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// 편집 가능한 셀 컴포넌트들
const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full px-2 py-1 border rounded text-sm"
    />
  );
};

const EditableSelectCell = ({ getValue, row, column, table, options }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <select
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full px-2 py-1 border rounded text-sm"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const EditableNumberCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type="number"
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full px-2 py-1 border rounded text-sm"
    />
  );
};

export default function GuidePage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const setRefresh = usePageMoveStore((state) => state.setRefresh);
  const setGoBack = usePageMoveStore((state) => state.setGoBack);
  const activeMenus = useMenuStore((state) => state.activeMenus);
  const setMenuItems = useLnbMenuStore((state) => state.setMenuItems);

  useEffect(() => {
    setMenuItems([
      { key: 'ui', label: 'UI 공통 컴포넌트', href: '#ui', icon: <Layers size={18} /> },
      { key: 'sample', label: '샘플 소스', href: '#sample', icon: <Code size={18} /> },
      { key: 'cmn', label: '공통코드+Board', href: '#cmn', icon: <ClipboardList size={18} /> },
      { key: 'zustand', label: '전역 상태 관리', href: '#zustand', icon: <Settings size={18} /> },
      { key: 'alert', label: '알림 컴포넌트', href: '#alert', icon: <Bell size={18} /> },
      { key: 'toast', label: '토스트 컴포넌트', href: '#toast', icon: <Bell size={18} /> },
      { key: 'storage', label: '스토리지 유틸리티', href: '#storage', icon: <Database size={18} /> },
      { key: 'api', label: 'API 테스트', href: '#api', icon: <Cloud size={18} /> },
      { key: 'codesample', label: '코드 샘플', href: '#codesample', icon: <Code size={18} /> },
      { key: 'list', label: '주요 컴포넌트 목록', href: '#list', icon: <List size={18} /> },
      { key: 'env', label: '환경 설정', href: '#env', icon: <Settings size={18} /> },
      { key: 'notice', label: '공지사항 상세', href: '#notice', icon: <Info size={18} /> },
      { key: 'board', label: 'Board 예제', href: '#board', icon: <Table size={18} /> },
      { key: 'tanstack', label: 'TanStack Table', href: '#tanstack', icon: <Table size={18} /> },
      { key: 'fullpopup', label: 'FullPopup 예제', href: '#fullpopup', icon: <Square size={18} /> }, // Popup → Square
      { key: 'bottomsheet', label: 'BottomSheets 예제', href: '#bottomsheet', icon: <ChevronDown size={18} /> },
      { key: 'cmpselect', label: 'CmpSelect 예제', href: '#cmpselect', icon: <List size={18} /> },   // Select → List
      { key: 'echarts', label: 'ECharts 예제', href: '#echarts', icon: <BarChart3 size={18} /> },

    ]);
  }, [setMenuItems]);

  // Board 컴포넌트 예제용 상태
  const [boardPage, setBoardPage] = useState(1);
  const [boardSortKey, setBoardSortKey] = useState('id');
  const [boardSortOrder, setBoardSortOrder] = useState('asc');
  const boardColumns = [
    { key: 'id', label: '번호' },
    { key: 'title', label: '제목' },
    { key: 'writer', label: '작성자' },
    { key: 'date', label: '작성일' },
  ];
  const boardDataAll = [
    { id: 1, title: '테스트 공지1', writer: '홍길동', date: '2024-01-01' },
    { id: 2, title: '테스트 공지2', writer: '이순신', date: '2024-01-02' },
    { id: 3, title: '테스트 공지3', writer: '강감찬', date: '2024-01-03' },
    { id: 4, title: '테스트 공지4', writer: '유관순', date: '2024-01-04' },
    { id: 5, title: '테스트 공지5', writer: '신사임당', date: '2024-01-05' },
    { id: 6, title: '테스트 공지6', writer: '장보고', date: '2024-01-06' },
  ];
  // 정렬
  const sorted = [...boardDataAll].sort((a, b) => {
    if (boardSortOrder === 'asc') return a[boardSortKey] > b[boardSortKey] ? 1 : -1;
    return a[boardSortKey] < b[boardSortKey] ? 1 : -1;
  });
  // 페이징
  const pageSize = 3;
  const totalPages = Math.ceil(sorted.length / pageSize);
  const boardData = sorted.slice((boardPage - 1) * pageSize, boardPage * pageSize);

  // CmpSelect 예제용 상태
  const [selectedSize, setSelectedSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState('user');
  const [selectedUnit, setSelectedUnit] = useState('일별');

  // ECharts 예제용 데이터
  const lineChartData = {
    categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
    values: [10, 15, 12, 18, 22, 25]
  };

  const barChartData = {
    categories: ['제품A', '제품B', '제품C', '제품D', '제품E'],
    values: [120, 85, 95, 150, 110]
  };

  const pieChartData = [
    { value: 61.41, name: 'Chrome' },
    { value: 10.85, name: 'Firefox' },
    { value: 4.18, name: 'Safari' },
    { value: 4.67, name: 'Edge' },
    { value: 18.89, name: 'Other' }
  ];

  const scatterChartData = [
    [10, 20, '점1'],
    [15, 25, '점2'],
    [20, 30, '점3'],
    [25, 35, '점4'],
    [30, 40, '점5'],
    [35, 45, '점6'],
    [40, 50, '점7'],
    [45, 55, '점8']
  ];

  const bubbleChartData = [
    [10, 20, '점1', 15],
    [15, 25, '점2', 20],
    [20, 30, '점3', 25],
    [25, 35, '점4', 30],
    [30, 40, '점5', 35],
    [35, 45, '점6', 40],
    [40, 50, '점7', 45],
    [45, 55, '점8', 50]
  ];


  // row 클릭 예시
  const handleBoardRowClick = (row) => {
    alert.AlertOpen('선택된 행', `번호: ${row.id}\n제목: ${row.title}\n작성자: ${row.writer}\n작성일: ${row.date}`);
  };

  const handleTestAlert = () => {
    alert.AlertOpen('테스트 알림', '이것은 테스트 알림입니다.');
  };

  const handleTestConfirm = () => {
    alert.ConfirmOpen('확인 테스트', '정말로 진행하시겠습니까?', {
      okCallback: () => {
        alert.AlertOpen('확인됨', '사용자가 확인했습니다.');
      }
    });
  };

  const handleTestError = () => {
    alert.ErrorAlert('오류 발생', [{ ERR_CTNT: '테스트 오류 메시지입니다.', INBN_ERR_DVCD: '', INBN_ERR_CD: '', SRVC_ID: 'TEST' }]);
  };

  // 토스트 테스트 함수들
  const handleTestToast = () => {
    toast.callCommonToastOpen('이것은 기본 토스트 메시지입니다.');
  };

  const handleTestToastWithOk = () => {
    toast.callCommonToastOpen('확인 버튼이 있는 토스트입니다.', {
      showOk: 'Y',
      okLabel: '확인',
      okCallback: () => {
        alert.AlertOpen('토스트 확인', '토스트의 확인 버튼을 클릭했습니다.');
      }
    });
  };

  const handleTestToastWithCancel = () => {
    toast.callCommonToastOpen('취소와 확인 버튼이 있는 토스트입니다.', {
      showCancel: 'Y',
      showOk: 'Y',
      cancelLabel: '취소',
      okLabel: '확인',
      cancelCallback: () => {
        alert.AlertOpen('토스트 취소', '토스트의 취소 버튼을 클릭했습니다.');
      },
      okCallback: () => {
        alert.AlertOpen('토스트 확인', '토스트의 확인 버튼을 클릭했습니다.');
      }
    });
  };

  const handleStorageTest = () => {
    const storageInstance = storage();
    storageInstance.setItem('testKey', 'testValue');
    const value = storageInstance.getItem('testKey');
    alert.AlertOpen('스토리지 테스트', `저장된 값: ${value}`);
  };

  // API 테스트 함수들
  const handleAuthTest = async () => {
    try {
      const result = await authAPI.sessionStatus();
      alert.AlertOpen('인증 상태', `세션 상태: ${JSON.stringify(result)}`);
    } catch (error) {
      // api.js의 인터셉터에서 자동으로 ErrorAlert 처리됨
      console.log('인증 테스트 실패:', error.message);
    }
  };

  const handleMenuTest = async () => {
    try {
      const menus = await menuAPI.getMenuList();
      const menuList = menus?.menus || menus || [];
      const menuNames = menuList.data.map(menu => menu.mnuNm).join(', ');
      alert.AlertOpen('메뉴 조회', `메뉴 개수: ${menuList.data.length}개\n메뉴 목록: ${menuNames || '메뉴 없음'}`);
    } catch (error) {
      // api.js의 인터셉터에서 자동으로 ErrorAlert 처리됨
      console.log('메뉴 테스트 실패:', error.message);
    }
  };



  // 공지사항 상세 조회 예제
  const handleNoticeDetailTest = async () => {
    try {
      const ntiDetail = await noticeAPI.getNoticeDetail(1); // id=1 예시
      let detail = ntiDetail.data;
      alert.AlertOpen('공지사항 상세', `제목: ${detail.ttl}\n작성자: ${detail.regEmpId}\n내용: ${detail.cntn || '내용 없음'}`);
    } catch (error) {
      // api.js의 인터셉터에서 자동으로 ErrorAlert 처리됨
      console.log('공지사항 상세 조회 실패:', error.message);
    }
  };

  // FullPopup 테스트
  const handleFullPopupTest = () => {
    FullPopup.Open('#fullPopupTest');
  };

  // BottomSheet 테스트 함수들
  const handleBottomSheetTest = () => {
    bottomSheet.Open('#bottomSheetTest');
  };

  const handleBottomSheetDescriptionTest = () => {
    bottomSheet.Open('#bottomSheetDescriptionTest');
  };

  const handleBottomSheetLinkTest = () => {
    bottomSheet.Open('#bottomSheetLinkTest');
  };

  const handleBottomSheetAccountTest = () => {
    bottomSheet.Open('#bottomSheetAccountTest');
  };

  const handleBottomSheetCalendarTest = () => {
    bottomSheet.Open('#bottomSheetCalendarTest');
  };

  const handleBottomSheetPeriodCalendarTest = () => {
    bottomSheet.Open('#bottomSheetPeriodCalendarTest');
  };

  // 캘린더 콜백 함수들
  const handleCalendarSelect = (data) => {
    alert.AlertOpen('날짜 선택됨', `선택된 날짜: ${data.year}년 ${data.month}월 ${data.day}일`);
  };

  const handlePeriodCalendarSelect = (data) => {
    alert.AlertOpen('기간 선택됨', `시작일: ${data.startYear}년 ${data.startMonth}월 ${data.startDay}일\n종료일: ${data.endYear}년 ${data.endMonth}월 ${data.endDay}일`);
  };

  const handleCalendarSetSelect = (data) => {
    alert.AlertOpen('캘린더 선택됨', `선택된 날짜: ${data.year}년 ${data.month}월 ${data.day}일`);
  };

  // UI 컴포넌트 데모용 상태
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('male');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // DataTable 예시 데이터
  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '이름' },
    { key: 'role', label: '역할' },
  ];
  const tableData = [
    { id: 1, name: '홍길동', role: '관리자' },
    { id: 2, name: '이순신', role: '사용자' },
    { id: 3, name: '강감찬', role: '게스트' },
  ];

  // TanStack Table 예제용 데이터
  const tanstackData = useMemo(() => [
    { id: 1, name: '홍길동', email: 'hong@example.com', department: '개발팀', status: '활성', joinDate: '2023-01-15' },
    { id: 2, name: '이순신', email: 'lee@example.com', department: '디자인팀', status: '활성', joinDate: '2023-02-20' },
    { id: 3, name: '강감찬', email: 'kang@example.com', department: '기획팀', status: '비활성', joinDate: '2023-03-10' },
    { id: 4, name: '유관순', email: 'yoo@example.com', department: '개발팀', status: '활성', joinDate: '2023-04-05' },
    { id: 5, name: '신사임당', email: 'shin@example.com', department: '디자인팀', status: '활성', joinDate: '2023-05-12' },
    { id: 6, name: '장보고', email: 'jang@example.com', department: '기획팀', status: '비활성', joinDate: '2023-06-18' },
    { id: 7, name: '김철수', email: 'kim@example.com', department: '개발팀', status: '활성', joinDate: '2023-07-22' },
    { id: 8, name: '박영희', email: 'park@example.com', department: '디자인팀', status: '활성', joinDate: '2023-08-30' },
  ], []);

  // TanStack Table 컬럼 정의
  const tanstackColumns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
    },
    {
      accessorKey: 'name',
      header: '이름',
      size: 120,
    },
    {
      accessorKey: 'email',
      header: '이메일',
      size: 200,
    },
    {
      accessorKey: 'department',
      header: '부서',
      size: 120,
    },
    {
      accessorKey: 'status',
      header: '상태',
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === '활성' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'joinDate',
      header: '입사일',
      size: 120,
    },
    {
      id: 'actions',
      header: '작업',
      size: 120,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleTanstackEdit(row.original)}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            편집
          </button>
          <button
            onClick={() => handleTanstackDelete(row.original)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ),
    },
  ], []);

  // TanStack Table 인스턴스
  const tanstackTable = useReactTable({
    data: tanstackData,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // TanStack Table 액션 핸들러
  const handleTanstackEdit = (row) => {
    alert.AlertOpen('편집', `선택된 사용자: ${row.name} (${row.email})`);
  };

  const handleTanstackDelete = (row) => {
    alert.ConfirmOpen('삭제 확인', `${row.name} 사용자를 삭제하시겠습니까?`, {
      okCallback: () => {
        alert.AlertOpen('삭제됨', `${row.name} 사용자가 삭제되었습니다.`);
      }
    });
  };

  // TanStack Table 고급 기능을 위한 상태
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // 고급 기능용 데이터 (편집 가능)
  const [advancedData, setAdvancedData] = useState([
    { id: 1, name: '홍길동', email: 'hong@example.com', department: '개발팀', status: '활성', joinDate: '2023-01-15', salary: 5000000 },
    { id: 2, name: '이순신', email: 'lee@example.com', department: '디자인팀', status: '활성', joinDate: '2023-02-20', salary: 4500000 },
    { id: 3, name: '강감찬', email: 'kang@example.com', department: '기획팀', status: '비활성', joinDate: '2023-03-10', salary: 4800000 },
    { id: 4, name: '유관순', email: 'yoo@example.com', department: '개발팀', status: '활성', joinDate: '2023-04-05', salary: 5200000 },
    { id: 5, name: '신사임당', email: 'shin@example.com', department: '디자인팀', status: '활성', joinDate: '2023-05-12', salary: 4700000 },
    { id: 6, name: '장보고', email: 'jang@example.com', department: '기획팀', status: '비활성', joinDate: '2023-06-18', salary: 4600000 },
    { id: 7, name: '김철수', email: 'kim@example.com', department: '개발팀', status: '활성', joinDate: '2023-07-22', salary: 5100000 },
    { id: 8, name: '박영희', email: 'park@example.com', department: '디자인팀', status: '활성', joinDate: '2023-08-30', salary: 4900000 },
  ]);

  // 고급 기능용 컬럼 정의 (편집 가능, 정렬 가능, 필터링 가능)
  const advancedColumns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'name',
      header: '이름',
      size: 120,
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ getValue, row, column, table }) => {
        return <EditableCell getValue={getValue} row={row} column={column} table={table} />;
      },
    },
    {
      accessorKey: 'email',
      header: '이메일',
      size: 200,
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ getValue, row, column, table }) => {
        return <EditableCell getValue={getValue} row={row} column={column} table={table} />;
      },
    },
    {
      accessorKey: 'department',
      header: '부서',
      size: 120,
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ getValue, row, column, table }) => {
        return <EditableSelectCell
          getValue={getValue}
          row={row}
          column={column}
          table={table}
          options={[
            { value: '개발팀', label: '개발팀' },
            { value: '디자인팀', label: '디자인팀' },
            { value: '기획팀', label: '기획팀' },
            { value: '마케팅팀', label: '마케팅팀' }
          ]}
        />;
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      size: 100,
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ getValue, row, column, table }) => {
        return <EditableSelectCell
          getValue={getValue}
          row={row}
          column={column}
          table={table}
          options={[
            { value: '활성', label: '활성' },
            { value: '비활성', label: '비활성' }
          ]}
        />;
      },
    },
    {
      accessorKey: 'salary',
      header: '급여',
      size: 120,
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ getValue, row, column, table }) => {
        return <EditableNumberCell getValue={getValue} row={row} column={column} table={table} />;
      },
    },
    {
      accessorKey: 'joinDate',
      header: '입사일',
      size: 120,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      header: '작업',
      size: 120,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleAdvancedEdit(row.original)}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            편집
          </button>
          <button
            onClick={() => handleAdvancedDelete(row.original)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ),
    },
  ], []);

  // 고급 기능용 테이블 인스턴스
  const advancedTable = useReactTable({
    data: advancedData,
    columns: advancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setAdvancedData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  // 고급 기능 액션 핸들러
  const handleAdvancedEdit = (row) => {
    alert.AlertOpen('편집', `선택된 사용자: ${row.name} (${row.email})`);
  };

  const handleAdvancedDelete = (row) => {
    alert.ConfirmOpen('삭제 확인', `${row.name} 사용자를 삭제하시겠습니까?`, {
      okCallback: () => {
        setAdvancedData(prev => prev.filter(item => item.id !== row.id));
        alert.AlertOpen('삭제됨', `${row.name} 사용자가 삭제되었습니다.`);
      }
    });
  };

  const handleAddRow = () => {
    const newId = Math.max(...advancedData.map(row => row.id)) + 1;
    const newRow = {
      id: newId,
      name: '새 사용자',
      email: 'new@example.com',
      department: '개발팀',
      status: '활성',
      joinDate: new Date().toISOString().split('T')[0],
      salary: 4000000,
    };
    setAdvancedData(prev => [...prev, newRow]);
  };

  const handleExportData = () => {
    const selectedRows = advancedTable.getFilteredSelectedRowModel().rows;
    const dataToExport = selectedRows.length > 0
      ? selectedRows.map(row => row.original)
      : advancedData;

    const csvContent = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    alert.AlertOpen('내보내기 완료', '데이터가 CSV 파일로 내보내기되었습니다.');
  };

  // 컬럼 필터 컴포넌트
  const ColumnFilter = ({ column }) => {
    const columnFilterValue = column.getFilterValue();

    return (
      <div className="mt-2">
        <input
          type="text"
          value={columnFilterValue ?? ''}
          onChange={e => column.setFilterValue(e.target.value)}
          placeholder={`${column.columnDef.header} 필터...`}
          className="w-full px-2 py-1 text-xs border rounded"
        />
      </div>
    );
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnVisibility.showDropdown && !event.target.closest('.column-dropdown')) {
        setColumnVisibility(prev => ({ ...prev, showDropdown: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [columnVisibility.showDropdown]);

  return (
    <PageWrapper
      title="컴포넌트 가이드"
      subtitle="🛠️ 컴포넌트 가이드 & 샘플 소스"
      showCard={false}
    >

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">🛠️ 컴포넌트 가이드 & 샘플 소스</h1>

        {/* UI 컴포넌트 모음 샘플 */}
        <section id="ui" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">UI 공통 컴포넌트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input */}
            <div>
              <h3 className="font-bold mb-2">Input</h3>
              <UI.CmpInput label="일반 입력" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="입력하세요" />
              <div className="text-xs text-gray-500 mt-1">현재 값: {inputValue}</div>
              <UI.CmpInput label="비밀번호" type="password" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} placeholder="비밀번호 입력" />
              <div className="text-xs text-gray-500 mt-1">현재 값: {passwordValue}</div>
            </div>
            {/* Checkbox */}
            <div>
              <h3 className="font-bold mb-2">Checkbox</h3>
              <UI.CmpCheckbox checked={checkboxValue} onChange={e => setCheckboxValue(e.target.checked)} label="체크박스 예시" helperText="설명 텍스트" />
              <div className="text-xs text-gray-500 mt-1">현재 값: {checkboxValue ? '체크됨' : '해제'}</div>
            </div>
            {/* Radio */}
            <div>
              <h3 className="font-bold mb-2">Radio</h3>
              <UI.CmpRadio checked={radioValue === 'male'} onChange={() => setRadioValue('male')} label="남자" />
              <UI.CmpRadio checked={radioValue === 'female'} onChange={() => setRadioValue('female')} label="여자" />
              <div className="text-xs text-gray-500 mt-1">현재 값: {radioValue}</div>
              <h4 className="font-semibold mt-4 mb-1">RadioGroup</h4>
              <UI.CmpRadioGroup name="gender2" value={radioValue} options={[{ value: 'male', label: '남자' }, { value: 'female', label: '여자' }]} onChange={setRadioValue} />
            </div>
            {/* Select */}
            <div>
              <h3 className="font-bold mb-2">Select</h3>
              <UI.CmpSelect value={selectValue} onChange={setSelectValue} options={[{ value: '', label: '선택' }, { value: '1', label: '옵션1' }, { value: '2', label: '옵션2' }]} label="셀렉트박스" />
              <div className="text-xs text-gray-500 mt-1">현재 값: {selectValue}</div>
            </div>
            {/* Textarea */}
            <div>
              <h3 className="font-bold mb-2">Textarea</h3>
              <UI.CmpTextarea value={textareaValue} onChange={e => setTextareaValue(e.target.value)} label="텍스트에어리어" />
              <div className="text-xs text-gray-500 mt-1">현재 값: {textareaValue}</div>
            </div>
            {/* Modal */}
            <div>
              <h3 className="font-bold mb-2">CommonModal</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setModalOpen(true)}>모달 열기</button>
              <UI.CommonModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="공통 모달 예시">
                <div className="mb-4">이곳에 원하는 내용을 넣을 수 있습니다.</div>
                <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setModalOpen(false)}>닫기</button>
              </UI.CommonModal>
            </div>
            {/* DataTable */}
            <div className="col-span-2">
              <h3 className="font-bold mb-2">DataTable</h3>
              <UI.DataTable columns={tableColumns} data={tableData} />
            </div>
          </div>
        </section>

        {/* UI 공통 컴포넌트 샘플 소스 */}
        <section id="sample" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">UI 공통 컴포넌트 샘플 소스</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Input/Password</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { CmpInput } from '@/app/shared/components/ui';
import { useState } from 'react';

const [value, setValue] = useState('');
<CmpInput label="입력" value={value} onChange={e => setValue(e.target.value)} placeholder="입력하세요" />

// 비밀번호
const [pw, setPw] = useState('');
<CmpInput label="비밀번호" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호 입력" />
`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Checkbox</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { CmpCheckbox } from '@/app/shared/components/ui';
import { useState } from 'react';

const [checked, setChecked] = useState(false);
<CmpCheckbox checked={checked} onChange={e => setChecked(e.target.checked)} label="동의" helperText="필수 동의" />
`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Radio/RadioGroup</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { CmpRadio, CmpRadioGroup } from '@/app/shared/components/ui';
import { useState } from 'react';

const [gender, setGender] = useState('male');
<CmpRadio checked={gender==='male'} onChange={()=>setGender('male')} label="남자" />
<CmpRadio checked={gender==='female'} onChange={()=>setGender('female')} label="여자" />

<CmpRadioGroup
  name="gender"
  value={gender}
  options={[
    { value: 'male', label: '남자' },
    { value: 'female', label: '여자' }
  ]}
  onChange={setGender}
/>
`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Select</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { CmpSelect } from '@/app/shared/components/ui';
import { useState } from 'react';

const [selected, setSelected] = useState('');
<CmpSelect
  value={selected}
  onChange={setSelected}
  options={[
    { value: '', label: '선택' },
    { value: '1', label: '옵션1' },
    { value: '2', label: '옵션2' }
  ]}
  label="셀렉트박스"
/>
`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Textarea</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { CmpTextarea } from '@/app/shared/components/ui';
import { useState } from 'react';

const [text, setText] = useState('');
<CmpTextarea value={text} onChange={e => setText(e.target.value)} label="내용" />
`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">CommonModal</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { CommonModal } from '@/app/shared/components/ui';
import { useState } from 'react';

const [open, setOpen] = useState(false);
<>
  <button onClick={()=>setOpen(true)}>모달 열기</button>
  <CommonModal isOpen={open} onClose={()=>setOpen(false)} title="공통 모달">
    <div>모달 내용</div>
    <button onClick={()=>setOpen(false)}>닫기</button>
  </CommonModal>
</>
`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* 공통코드 + CmpSelect + Board 샘플 */}
        <section id="cmn" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">공통코드 + CmpSelect + Board 샘플</h2>
          <div className="mb-6 text-gray-700">공통코드 API로 코드 목록을 가져와 CmpSelect 옵션으로 사용하고, 선택된 코드로 Board 데이터를 필터링하며, Board의 '역할' 컬럼은 코드명으로 치환해서 보여줍니다.</div>
          {/* 실제 동작 데모 */}
          <CmnCodeBoardSampleDemo />
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">샘플 소스</h3>
            <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
              <pre>{`import { useEffect, useState } from 'react';
import { cmnCodeAPI } from '@/app/core/services/api';
import { CmpSelect } from '@/app/shared/components/ui';
import Board from '@/app/shared/components/Board';

export default function CmnCodeBoardSample() {
  const [codeOptions, setCodeOptions] = useState([]);
  const [codeMap, setCodeMap] = useState({});
  const [selectedCode, setSelectedCode] = useState('');
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCodes() {
      setLoading(true);
      try {
        const codes = await cmnCodeAPI.getCodeList('USER_ROLE');
        setCodeOptions([
          { value: '', label: '전체' },
          ...codes.map(c => ({ value: c.code, label: c.codeNm }))
        ]);
        const map = {};
        codes.forEach(c => { map[c.code] = c.codeNm; });
        setCodeMap(map);
      } catch (e) {
        setCodeOptions([{ value: '', label: '전체' }]);
        setCodeMap({});
      }
      setLoading(false);
    }
    fetchCodes();
  }, []);

  useEffect(() => {
    async function fetchBoard() {
      setLoading(true);
      const data = await fetchBoardData(selectedCode);
      setBoardData(data);
      setLoading(false);
    }
    fetchBoard();
  }, [selectedCode]);

  async function fetchBoardData(code) {
    const all = [
      { id: 1, name: '홍길동', role: 'ADMIN' },
      { id: 2, name: '이순신', role: 'USER' },
      { id: 3, name: '강감찬', role: 'GUEST' }
    ];
    if (!code) return all;
    return all.filter(row => row.role === code);
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '이름' },
    { key: 'role', label: '역할' }
  ];

  const renderCell = (row, col) => {
    if (col.key === 'role') {
      return codeMap[row.role] || row.role;
    }
    return row[col.key];
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">공통코드 + CmpSelect + Board (코드명 치환)</h2>
      <CmpSelect
        label="역할 선택"
        value={selectedCode}
        onChange={setSelectedCode}
        options={codeOptions}
        wrapperClassName="mb-4 w-60"
        disabled={loading}
      />
      <Board
        columns={columns}
        data={boardData}
        renderCell={renderCell}
      />
    </div>
  );
}
`}</pre>
            </div>
          </div>
        </section>

        {/* 전역 상태 관리 */}
        <section id="zustand" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">1. 전역 상태 관리 (Zustand)</h2>
          <div>
            <h3 className="text-lg font-medium mb-3">PageMove Store</h3>
            <p className="mb-3 text-gray-700">페이지 이동, 새로고침, 뒤로가기 기능</p>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setMoveTo('/dashboard')}>
                /dashboard 이동
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={setRefresh}>
                새로고침
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={setGoBack}>
                뒤로가기
              </button>
            </div>
          </div>
        </section>

        {/* 알림 컴포넌트 */}
        <section id="alert" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">2. 알림 컴포넌트</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleTestAlert}>
              일반 알림
            </button>
            <button className="px-4 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={handleTestConfirm}>
              확인 다이얼로그
            </button>
            <button className="px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleTestError}>
              오류 알림
            </button>
          </div>
        </section>

        {/* 토스트 컴포넌트 */}
        <section id="toast" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-600">3. 토스트 컴포넌트</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="px-4 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={handleTestToast}>
              기본 토스트
            </button>
            <button className="px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleTestToastWithOk}>
              확인 버튼 토스트
            </button>
            <button className="px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600"
              onClick={handleTestToastWithCancel}>
              취소/확인 토스트
            </button>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">토스트 사용법</h3>
            <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                              <pre>{`import { toast } from '@/app/shared/utils/ui_com';

// 기본 토스트 (3초 후 자동 사라짐)
toast.callCommonToastOpen('메시지입니다.');

// 확인 버튼이 있는 토스트
toast.callCommonToastOpen('확인 버튼이 있는 토스트입니다.', {
  showOk: 'Y',
  okLabel: '확인',
  okCallback: () => {
    console.log('확인 버튼 클릭됨');
  }
});

// 취소와 확인 버튼이 있는 토스트
toast.callCommonToastOpen('취소와 확인 버튼이 있는 토스트입니다.', {
  showCancel: 'Y',
  showOk: 'Y',
  cancelLabel: '취소',
  okLabel: '확인',
  cancelCallback: () => {
    console.log('취소 버튼 클릭됨');
  },
  okCallback: () => {
    console.log('확인 버튼 클릭됨');
  }
});`}</pre>
            </div>
          </div>
        </section>

        {/* 스토리지 유틸리티 */}
        <section id="storage" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">4. 스토리지 유틸리티</h2>
          <button className="px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={handleStorageTest}>
            스토리지 테스트
          </button>
        </section>

        {/* API 테스트 */}
        <section id="api" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-teal-600">5. API 테스트</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="px-4 py-3 bg-teal-500 text-white rounded hover:bg-teal-600"
              onClick={handleAuthTest}>
              인증 상태 테스트
            </button>
            <button className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleMenuTest}>
              메뉴 조회 테스트
            </button>
          </div>
        </section>

        {/* 코드 샘플 */}
        <section id="codesample" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-600">6. 코드 샘플</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">기본 페이지 구조</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`"use client";

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import { useMenuStore } from '@/app/core/slices/menuStore';

export default function MyPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const activeMenus = useMenuStore((state) => state.activeMenus);

  return (
    <div className="container mx-auto p-4">
      <h1>내 페이지</h1>
      {/* 페이지 내용 */}
    </div>
  );
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">알림 사용법</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { alert } from '@/app/shared/utils/ui_com';

// 일반 알림
alert.AlertOpen('제목', '내용');

// 확인 다이얼로그
alert.ConfirmOpen('제목', '내용', {
  okCallback: () => {
    // 확인 시 실행할 코드
    console.log('확인됨');
  }
});

// 오류 알림
alert.ErrorAlert('오류 제목', [{
  ERR_CTNT: '오류 내용',
  INBN_ERR_DVCD: '',
  INBN_ERR_CD: '',
  SRVC_ID: 'SERVICE'
}]);`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">토스트 사용법</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { toast } from '@/app/shared/utils/ui_com';

// 기본 토스트 (3초 후 자동 사라짐)
toast.callCommonToastOpen('메시지입니다.');

// 확인 버튼이 있는 토스트
toast.callCommonToastOpen('확인 버튼이 있는 토스트입니다.', {
  showOk: 'Y',
  okLabel: '확인',
  okCallback: () => {
    console.log('확인 버튼 클릭됨');
  }
});

// 취소와 확인 버튼이 있는 토스트
toast.callCommonToastOpen('취소와 확인 버튼이 있는 토스트입니다.', {
  showCancel: 'Y',
  showOk: 'Y',
  cancelLabel: '취소',
  okLabel: '확인',
  cancelCallback: () => {
    console.log('취소 버튼 클릭됨');
  },
  okCallback: () => {
    console.log('확인 버튼 클릭됨');
  }
});`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">스토리지 사용법</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import storage from '@/app/shared/utils/storage';

// 스토리지 인스턴스 생성
const storageInstance = storage();

// 데이터 저장
storageInstance.setItem('key', 'value');
storageInstance.setItem('user', JSON.stringify({ id: 1, name: 'John' }));

// 데이터 조회
const value = storageInstance.getItem('key');
const user = storageInstance.getItem('user');

// 데이터 삭제
storageInstance.removeItem('key');

// 만료일이 있는 데이터 저장 (일수)
storageInstance.setEItem('tempData', 'value', '7');

// 만료일이 있는 데이터 조회
const tempData = storageInstance.getEItem('tempData');`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">API 호출 예시</h3>
              <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                <pre>{`import { authAPI, menuAPI, cmnCodeAPI } from '@/app/core/services/api';
import { alert } from '@/app/shared/utils/ui_com';

// 인증 관련 API
const handleLogin = async (empNo) => {
  try {
    const userData = await authAPI.empLogin(empNo);
    alert.AlertOpen('성공', '로그인되었습니다.');
    return userData;
  } catch (error) {
    alert.ErrorAlert('로그인 실패', [{
      ERR_CTNT: '사원번호를 확인해주세요.',
      INBN_ERR_DVCD: '',
      INBN_ERR_CD: '',
      SRVC_ID: 'LOGIN'
    }]);
  }
};

const handleLogout = async () => {
  try {
    await authAPI.logout();
    alert.AlertOpen('성공', '로그아웃되었습니다.');
  } catch (error) {
    alert.ErrorAlert('오류', [{
      ERR_CTNT: '로그아웃 중 오류가 발생했습니다.',
      INBN_ERR_DVCD: '',
      INBN_ERR_CD: '',
      SRVC_ID: 'LOGOUT'
    }]);
  }
};

// 메뉴 관련 API
const getMenus = async () => {
  try {
    const menus = await menuAPI.getMenuList();
    return menus;
  } catch (error) {
    alert.ErrorAlert('오류', [{
      ERR_CTNT: '메뉴 조회에 실패했습니다.',
      INBN_ERR_DVCD: '',
      INBN_ERR_CD: '',
      SRVC_ID: 'MENU'
    }]);
  }
};`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* 컴포넌트 목록 */}
        <section id="list" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">7. 주요 컴포넌트 목록</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">UI 컴포넌트</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <code>CmpButton</code> - 버튼 컴포넌트</li>
                <li>• <code>CmpInput</code> - 입력 필드 컴포넌트</li>
                <li>• <code>CmpSelect</code> - 드롭다운 선택 컴포넌트</li>
                <li>• <code>CmpWrapCommonAlertArea</code> - 알림 영역</li>
                <li>• <code>HeaderArea</code> - 헤더 영역</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">API & 유틸리티</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <code>authAPI</code> - 인증 관련 API</li>
                <li>• <code>menuAPI</code> - 메뉴 관련 API</li>
                <li>• <code>cmnCodeAPI</code> - 공통 코드 API</li>
                <li>• <code>storage</code> - 로컬 스토리지 관리</li>
                <li>• <code>alert.AlertOpen</code> - 알림 표시</li>
                <li>• <code>alert.ConfirmOpen</code> - 확인 다이얼로그</li>
                <li>• <code>alert.ErrorAlert</code> - 오류 알림</li>
                <li>• <code>toast.callCommonToastOpen</code> - 토스트 알림</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 환경 설정 */}
        <section id="env" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-teal-600">8. 환경 설정</h2>
          <div className="bg-gray-100 rounded p-4">
            <h3 className="text-lg font-medium mb-2">환경 변수 사용법</h3>
            <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
              <pre>{`// .env.local 파일
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_DEBUG=true

// 코드에서 사용
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';`}</pre>
            </div>
          </div>
        </section>

        {/* 공지사항 상세 조회 예제 */}
        <section id="notice" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">9. 공지사항 상세 조회 예제</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleNoticeDetailTest}>
              공지사항 상세(id=1) 조회
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">코드 예제</h3>
            <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                              <pre>{`import { noticeAPI } from '@/app/core/services/api';

const detail = await noticeAPI.getNoticeDetail(1);
console.log(detail); // { ttl, regEmpId, regDate, stsCd, cntn, ... }`}</pre>
            </div>
          </div>
        </section>

        {/* Board 컴포넌트 예제 */}
        <section id="board" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">10. Board 컴포넌트 사용 예제</h2>
          <div className="mb-4 text-gray-700">컬럼 정렬, 페이징, row 클릭 등 Board의 기본 사용법 예시입니다.</div>
          <Board
            columns={boardColumns}
            data={boardData}
            page={boardPage}
            totalPages={totalPages}
            onPageChange={setBoardPage}
            sortKey={boardSortKey}
            sortOrder={boardSortOrder}
            onSortChange={(key, order) => { setBoardSortKey(key); setBoardSortOrder(order); setBoardPage(1); }}
            onRowClick={handleBoardRowClick}
            className="mb-2"
            style={{}}
          />
          <div className="text-sm text-gray-500 mb-2">행(row) 클릭 시 alert로 데이터 표시</div>
          <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
            <pre>{`import Board from '@/app/shared/components/Board';
import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import { alert } from '@/app/shared/utils/ui_com';

// 컬럼 정의
const columns = [
  { key: 'rowNum', label: '순번' },
  { key: 'title', label: '제목' },
  { key: 'writer', label: '작성자' },
  { key: 'date', label: '작성일' },
  { key: 'status', label: '상태' },
];

// 상태 관리
const [data, setData] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [sortKey, setSortKey] = useState('rowNum');
const [sortOrder, setSortOrder] = useState('asc');
const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

// 정렬 변경 핸들러
const handleSortChange = (key, order) => {
  setSortKey(key);
  setSortOrder(order);
  setPage(1); // 정렬 변경 시 첫 페이지로
};

// 행 클릭 핸들러 (상세 페이지 이동)
const handleRowClick = (row) => {
  setMoveTo(\`/resources/notice/\${row.seq}\`);
};

// 커스텀 셀 렌더링 (필요시)
const renderCell = (row, col) => {
  if (col.key === 'rowNum') return row.rowNum;
  if (col.key === 'status') return row.status === 'Y' ? '활성' : '비활성';
  return row[col.key];
};

// Board 컴포넌트 사용
<Board
  columns={columns}
  data={data}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  sortKey={sortKey}
  sortOrder={sortOrder}
  onSortChange={handleSortChange}
  onRowClick={handleRowClick}
  renderCell={renderCell}
/>`}</pre>
          </div>
        </section>

        {/* FullPopup 컴포넌트 예제 */}
        <section id="fullpopup" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">10. FullPopup 컴포넌트 사용 예제</h2>
          <div className="mb-4 text-gray-700">전체 화면 팝업 컴포넌트입니다.</div>
          <button className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleFullPopupTest}>
            FullPopup 열기
          </button>
          <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto mt-4">
                            <pre>{`import { FullPopup } from '@/app/shared/utils/ui_com';
import { CmpFpArea, CmpFpCont, CmpFpTitle } from '@/app/shared/components/fullPopup/cmp_fullPopup';

// FullPopup 열기
const handleOpen = () => {
  FullPopup.Open('#fullPopupId');
};

// FullPopup 닫기
const handleClose = () => {
  FullPopup.Closed('#fullPopupId');
};

// FullPopup 컴포넌트
<CmpFpArea id="fullPopupId">
  <CmpFpTitle popTitle="팝업 제목" id="fullPopupId" />
  <CmpFpCont>
    <div className="p-4">
      <h3>팝업 내용</h3>
      <p>여기에 팝업 내용을 작성합니다.</p>
      <button onClick={handleClose}>닫기</button>
    </div>
  </CmpFpCont>
</CmpFpArea>`}</pre>
          </div>
        </section>

        {/* BottomSheets 컴포넌트 예제 */}
        <section id="bottomsheet" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">11. BottomSheets 컴포넌트 사용 예제</h2>
          <div className="mb-4 text-gray-700">하단에서 올라오는 시트 컴포넌트입니다. 다양한 타입의 바텀쉬트를 제공합니다.</div>

          {/* 기본 바텀쉬트들 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <button className="px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleBottomSheetTest}>
              기본 BottomSheet
            </button>
            <button className="px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600"
              onClick={handleBottomSheetDescriptionTest}>
              설명 BottomSheet
            </button>
            <button className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleBottomSheetLinkTest}>
              링크 BottomSheet
            </button>
            <button className="px-4 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={handleBottomSheetAccountTest}>
              계좌 선택 BottomSheet
            </button>

          </div>

          {/* 캘린더 컴포넌트 예제 */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-medium mb-3">CalendarSet 컴포넌트 예제</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CalendarSet
                option={{
                  ID: 'singleDate',
                  title: '단일 날짜 선택',
                  multi: false,
                  closedcb: handleCalendarSetSelect
                }}
              />
              <CalendarSet
                option={{
                  ID: 'periodDate',
                  title: '기간 선택',
                  multi: true,
                  closedcb: (data) => {
                    alert.AlertOpen('기간 선택됨', `시작일: ${data.startYear}년 ${data.startMonth}월 ${data.startDay}일\n종료일: ${data.endYear}년 ${data.endMonth}월 ${data.endDay}일`);
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                            <pre>{`import { bottomSheet } from '@/app/shared/utils/ui_com';
import {
  CmpBsWrapDefautlCont,
  CmpBsWrapDescriptionCont,
  CmpBsWrapLinkCont,
  CmpBsWrapAccountCont,
  CmpBsCalendarArea,
  CmpBsPeriodCalendarArea
} from '@/app/shared/components/bottomSheets/cmp_bottomSheets_wrapper';
import { Calendar, CalendarSet, CmpBsArea } from '@/app/shared/components/bottomSheets/cmp_bottomSheets';

// 1. 기본 BottomSheet
const defaultData = [
  { dataKey: '1', dataValue: '옵션 1' },
  { dataKey: '2', dataValue: '옵션 2' },
  { dataKey: '3', dataValue: '옵션 3' },
];

// 2. 설명 BottomSheet
const descriptionData = [
  { dataText: '옵션 1', dataDescription: '옵션 1에 대한 설명입니다.' },
  { dataText: '옵션 2', dataDescription: '옵션 2에 대한 설명입니다.' },
];

// 3. 링크 BottomSheet
const linkData = [
  { dataText: '외부 링크 1', dataUrl: 'https://example1.com' },
  { dataText: '외부 링크 2', dataUrl: 'https://example2.com' },
];

// 4. 계좌 선택 BottomSheet
const accountData = [
  { dataKey: '1', dataType: '입출금', dataValue: '123-456-789012' },
  { dataKey: '2', dataType: '적금', dataValue: '987-654-321098' },
];

// 5. 캘린더 BottomSheet
const handleCalendarSelect = (data) => {
  console.log('선택된 날짜:', data);
};

// 6. CalendarSet 컴포넌트
<CalendarSet
  option={{
    ID: 'datePicker',
    title: '날짜 선택',
    multi: false, // true: 기간 선택, false: 단일 날짜
    closedcb: (data) => {
      console.log('선택된 날짜:', data);
    }
  }}
/>

// 바텀쉬트 열기
const handleOpen = () => {
  bottomSheet.Open('#bottomSheetId');
};

// 옵션 선택 핸들러
const handleOptionClick = (data) => {
  console.log('선택된 옵션:', data);
  // data.clickedIdx: 선택된 인덱스
  // data.id: 바텀쉬트 ID
  // data.text: 선택된 텍스트
};

// 컴포넌트 렌더링
<CmpBsWrapDefautlCont
  id="bottomSheetId"
  popTitle="옵션 선택"
  sheetData={defaultData}
  click={handleOptionClick}
/>

<CmpBsWrapDescriptionCont
  id="bottomSheetDescriptionId"
  popTitle="옵션 선택"
  sheetData={descriptionData}
  click={handleOptionClick}
/>

<CmpBsWrapLinkCont
  id="bottomSheetLinkId"
  popTitle="링크 선택"
  sheetData={linkData}
  click={(url) => window.open(url, '_blank')}
/>

<CmpBsWrapAccountCont
  id="bottomSheetAccountId"
  popTitle="계좌 선택"
  sheetData={accountData}
  click={(data) => {
    console.log('선택된 계좌:', data.typeText, data.valueText);
  }}
/>

<CmpBsCalendarArea
  id="bottomSheetCalendarId"
  popTitle="날짜 선택"
  dateClick={handleCalendarSelect}
/>

<CmpBsPeriodCalendarArea
  id="bottomSheetPeriodCalendarId"
  popTitle="기간 선택"
  periodType={true}
  selectedDate="2024.01.15"
  dateClick={handlePeriodCalendarSelect}
/>`}</pre>
          </div>
        </section>

        {/* CmpSelect 컴포넌트 예제 */}
        <section id="cmpselect" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">12. CmpSelect 컴포넌트 사용 예제</h2>
          <div className="mb-4 text-gray-700">커스텀 드롭다운 선택 컴포넌트입니다. 다양한 옵션과 스타일을 지원합니다.</div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3">기본 Select</h3>
              <CmpSelect
                value={selectedSize}
                onChange={setSelectedSize}
                options={[3, 5, 10, 20, 50].map(n => ({ value: n, label: `${n}개씩` }))}
                placeholder="페이지 크기 선택"
                size="md"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">선택된 값: {selectedSize}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">라벨이 있는 Select</h3>
              <CmpSelect
                value={selectedRole}
                onChange={setSelectedRole}
                options={[
                  { value: 'user', label: '일반 사용자' },
                  { value: 'active', label: '활성 사용자' },
                  { value: 'admin', label: '관리자' }
                ]}
                label="사용자 역할"
                size="md"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">선택된 값: {selectedRole}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">작은 크기 Select</h3>
              <CmpSelect
                value={selectedUnit}
                onChange={setSelectedUnit}
                options={['일별', '월별', '연간'].map(unit => ({ value: unit, label: unit }))}
                size="sm"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">선택된 값: {selectedUnit}</p>
            </div>
          </div>

          <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                            <pre>{`import CmpSelect from '@/app/shared/components/ui/CmpSelect';

// 기본 사용법
const [selectedValue, setSelectedValue] = useState('');

<CmpSelect
  value={selectedValue}
  onChange={setSelectedValue}
  options={[
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3' }
  ]}
  placeholder="선택하세요"
  size="md" // 'sm', 'md', 'lg'
  variant="default" // 'default', 'outline', 'filled'
  className="w-full"
/>

// 라벨과 도움말 텍스트가 있는 Select
<CmpSelect
  value={selectedValue}
  onChange={setSelectedValue}
  options={options}
  label="선택 항목"
  helperText="도움말 텍스트"
  required={true}
  error={false}
  disabled={false}
/>

// 간단한 옵션 배열 (문자열)
<CmpSelect
  value={selectedValue}
  onChange={setSelectedValue}
  options={['옵션1', '옵션2', '옵션3']}
/>

// 복잡한 옵션 배열 (객체)
<CmpSelect
  value={selectedValue}
  onChange={setSelectedValue}
  options={[
    { value: 'key1', label: '표시 라벨 1' },
    { value: 'key2', label: '표시 라벨 2' }
  ]}
/>`}</pre>
          </div>
        </section>

        {/* ECharts 컴포넌트 예제 */}
        <section id="echarts" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">13. ECharts 컴포넌트 사용 예제</h2>
          <div className="mb-4 text-gray-700">ECharts를 기반으로 한 3D 효과가 있는 차트 컴포넌트들입니다. 그라데이션, 그림자, 입체감을 제공합니다.</div>

          <div className="mb-6">
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-purple-800 mb-2">📦 설치된 패키지</h4>
              <code className="text-sm bg-purple-100 px-2 py-1 rounded">npm install echarts echarts-for-react</code>
              <p className="text-sm text-purple-700 mt-2">
                ✅ 3D 효과, 그라데이션, 그림자, 애니메이션 지원
              </p>
            </div>
          </div>

          {/* 차트 예제 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-600">📈 라인 차트 (3D 효과)</h3>
              <EChartsLineChart
                data={lineChartData}
                title="월별 매출 추이"
                style={{ height: '300px' }}
                show3DEffect={true}
                gradient={true}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-green-600">📊 바 차트 (3D 효과)</h3>
              <EChartsBarChart
                data={barChartData}
                title="제품별 판매량"
                style={{ height: '300px' }}
                show3DEffect={true}
                gradient={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-purple-600">🥧 파이 차트 (3D 효과)</h3>
              <EChartsPieChart
                data={pieChartData}
                title="브라우저 사용률"
                style={{ height: '300px' }}
                show3DEffect={true}
                gradient={true}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-orange-600">🎯 스캐터 차트 (3D 효과)</h3>
              <EChartsScatterChart
                data={scatterChartData}
                title="데이터 분포"
                style={{ height: '300px' }}
                show3DEffect={true}
                gradient={true}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3 text-red-600">🫧 버블 차트 (3D 효과)</h3>
            <EChartsScatterChart
              data={bubbleChartData}
              title="버블 차트 예제"
              style={{ height: '300px' }}
              show3DEffect={true}
              gradient={true}
              bubble={true}
            />
          </div>

          <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
                            <pre>{`import { EChartsLineChart, EChartsBarChart, EChartsPieChart, EChartsScatterChart } from '@/app/shared/components/charts';

// 라인 차트
const lineData = {
  categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
  values: [10, 15, 12, 18, 22, 25]
};

<EChartsLineChart
  data={lineData}
  title="월별 매출 추이"
  style={{ height: '400px' }}
  show3DEffect={true}
  gradient={true}
  color="#5470c6"
/>

// 바 차트
const barData = {
  categories: ['제품A', '제품B', '제품C', '제품D', '제품E'],
  values: [120, 85, 95, 150, 110]
};

<EChartsBarChart
  data={barData}
  title="제품별 판매량"
  style={{ height: '400px' }}
  show3DEffect={true}
  gradient={true}
  horizontal={false}
/>

// 파이 차트
const pieData = [
  { value: 61.41, name: 'Chrome' },
  { value: 10.85, name: 'Firefox' },
  { value: 4.18, name: 'Safari' },
  { value: 4.67, name: 'Edge' },
  { value: 18.89, name: 'Other' }
];

<EChartsPieChart
  data={pieData}
  title="브라우저 사용률"
  style={{ height: '400px' }}
  show3DEffect={true}
  gradient={true}
  roseType={false}
/>

// 스캐터 차트
const scatterData = [
  [10, 20, '점1'],
  [15, 25, '점2'],
  [20, 30, '점3']
];

<EChartsScatterChart
  data={scatterData}
  title="데이터 분포"
  style={{ height: '400px' }}
  show3DEffect={true}
  gradient={true}
/>

// 버블 차트
const bubbleData = [
  [10, 20, '점1', 15],
  [15, 25, '점2', 20],
  [20, 30, '점3', 25]
];

<EChartsScatterChart
  data={bubbleData}
  title="버블 차트"
  style={{ height: '400px' }}
  show3DEffect={true}
  gradient={true}
  bubble={true}
/>`}</pre>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 주요 기능</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 클라이언트 사이드 전용: SSR 호환성 보장</li>
              <li>• 3D 효과: 그림자, 그라데이션으로 입체감 연출</li>
              <li>• 반응형 디자인: 모바일/데스크톱 최적화</li>
              <li>• 자동 로딩 상태: 초기화 및 로딩 표시</li>
              <li>• 간단한 API: 최소한의 props로 차트 생성</li>
              <li>• 안정성: 하이드레이션 오류 방지</li>
              <li>• 인터랙티브: 줌, 팬, 툴팁 기능</li>
              <li>• 애니메이션: 부드러운 차트 렌더링</li>
              <li>• 커스터마이징: 색상, 크기, 효과 옵션</li>
              <li>• 접근성: 키보드 네비게이션 지원</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🎨 차트 커스터마이징 팁</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>3D 효과:</strong> show3DEffect={true}로 그림자와 입체감 활성화</li>
              <li>• <strong>그라데이션:</strong> gradient={true}로 색상 그라데이션 적용</li>
              <li>• <strong>색상:</strong> color prop으로 브랜드 컬러 설정</li>
              <li>• <strong>크기:</strong> style prop으로 차트 크기 조정</li>
              <li>• <strong>애니메이션:</strong> 기본적으로 2초 애니메이션 적용</li>
              <li>• <strong>툴팁:</strong> 마우스 호버 시 상세 정보 표시</li>
              <li>• <strong>반응형:</strong> 화면 크기에 따라 자동 조정</li>
              <li>• <strong>접근성:</strong> 키보드로 차트 탐색 가능</li>
              <li>• <strong>성능:</strong> Canvas 렌더링으로 빠른 성능</li>
              <li>• <strong>확장성:</strong> ECharts의 모든 옵션 활용 가능</li>
            </ul>
          </div>
        </section>

        {/* FullPopup 컴포넌트 */}
        <CmpFpArea id="fullPopupTest">
          <CmpFpTitle popTitle="FullPopup 테스트" id="fullPopupTest" />
          <CmpFpCont>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">FullPopup 예제</h3>
              <p className="mb-4">이것은 전체 화면 팝업의 예제입니다.</p>
              <div className="space-y-2">
                <p>• 전체 화면을 덮는 팝업</p>
                <p>• 스크롤 가능한 컨텐츠 영역</p>
                <p>• 닫기 버튼으로 팝업 닫기</p>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => FullPopup.Closed('#fullPopupTest')}
              >
                닫기
              </button>
            </div>
          </CmpFpCont>
        </CmpFpArea>

        {/* BottomSheets 컴포넌트들 */}
        <CmpBsArea id="bottomSheetTest">
          <CmpBsWrapDefautlCont
            id="bottomSheetTest"
            popTitle="옵션 선택"
            sheetData={[
              { dataKey: '1', dataValue: '홈으로 이동' },
              { dataKey: '2', dataValue: '설정으로 이동' },
              { dataKey: '3', dataValue: '프로필 보기' },
              { dataKey: '4', dataValue: '로그아웃' },
            ]}
            click={(data) => {
              alert.AlertOpen('선택됨', `선택된 옵션: ${data.text}`);
            }}
          />
        </CmpBsArea>

        <CmpBsArea id="bottomSheetDescriptionTest">
          <CmpBsWrapDescriptionCont
            id="bottomSheetDescriptionTest"
            popTitle="메뉴 선택"
            sheetData={[
              { dataText: '공지사항', dataDescription: '최신 공지사항을 확인합니다.' },
              { dataText: '자료실', dataDescription: '다운로드 가능한 자료들을 확인합니다.' },
              { dataText: '상담신청', dataDescription: '상담 신청을 진행합니다.' },
              { dataText: '설정', dataDescription: '계정 및 앱 설정을 변경합니다.' },
            ]}
            click={(data) => {
              alert.AlertOpen('선택됨', `선택된 메뉴: ${data.clickedIdx + 1}번`);
            }}
          />
        </CmpBsArea>

        <CmpBsArea id="bottomSheetLinkTest">
          <CmpBsWrapLinkCont
            id="bottomSheetLinkTest"
            popTitle="외부 링크"
            sheetData={[
              { dataText: 'Google', dataUrl: 'https://www.google.com' },
              { dataText: 'GitHub', dataUrl: 'https://github.com' },
              { dataText: 'Stack Overflow', dataUrl: 'https://stackoverflow.com' },
            ]}
            click={(url) => {
              alert.AlertOpen('링크 열기', `다음 링크를 새 탭에서 열겠습니다:\n${url}`);
              window.open(url, '_blank');
            }}
          />
        </CmpBsArea>

        <CmpBsArea id="bottomSheetAccountTest">
          <CmpBsWrapAccountCont
            id="bottomSheetAccountTest"
            popTitle="계좌 선택"
            sheetData={[
              { dataKey: '1', dataType: '입출금통장', dataValue: '123-456-789012' },
              { dataKey: '2', dataType: '적금통장', dataValue: '987-654-321098' },
              { dataKey: '3', dataType: '대출계좌', dataValue: '555-666-777888' },
            ]}
            click={(data) => {
              alert.AlertOpen('계좌 선택됨', `계좌 종류: ${data.typeText}\n계좌번호: ${data.valueText}`);
            }}
          />
        </CmpBsArea>

        <CmpBsArea id="bottomSheetCalendarTest">
          <CmpBsCalendarArea
            id="bottomSheetCalendarTest"
            popTitle="날짜 선택"
            dateClick={handleCalendarSelect}
          />
        </CmpBsArea>

        <CmpBsArea id="bottomSheetPeriodCalendarTest">
          <CmpBsPeriodCalendarArea
            id="bottomSheetPeriodCalendarTest"
            popTitle="기간 선택"
            periodType={true}
            selectedDate="2024.01.15"
            dateClick={handlePeriodCalendarSelect}
          />
        </CmpBsArea>

        {/* TanStack Table 예제 */}
        <section id="tanstack" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-teal-600">14. TanStack Table 예제</h2>
          <div className="mb-4 text-gray-700">TanStack Table을 사용하여 테이블을 구성합니다.</div>

          {/* TanStack Table 실제 예제 */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  {tanstackTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-gray-50">
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {tanstackTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 border-b">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => tanstackTable.previousPage()}
                  disabled={!tanstackTable.getCanPreviousPage()}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  이전
                </button>
                <span className="text-sm text-gray-700">
                  {tanstackTable.getState().pagination.pageIndex + 1} / {tanstackTable.getPageCount()}
                </span>
                <button
                  onClick={() => tanstackTable.nextPage()}
                  disabled={!tanstackTable.getCanNextPage()}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  다음
                </button>
              </div>
              <div className="text-sm text-gray-500">
                총 {tanstackTable.getFilteredRowModel().rows.length}개 항목
              </div>
            </div>
          </div>

          {/* 코드 예제 */}
          <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
            <pre>{`import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';

// 데이터 정의
const tanstackData = [
  { id: 1, name: '홍길동', email: 'hong@example.com', department: '개발팀', status: '활성', joinDate: '2023-01-15' },
  { id: 2, name: '이순신', email: 'lee@example.com', department: '디자인팀', status: '활성', joinDate: '2023-02-20' },
  // ... 더 많은 데이터
];

// 컬럼 정의
const tanstackColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'name',
    header: '이름',
    size: 120,
  },
  {
    accessorKey: 'email',
    header: '이메일',
    size: 200,
  },
  {
    accessorKey: 'department',
    header: '부서',
    size: 120,
  },
  {
    accessorKey: 'status',
    header: '상태',
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
          status === '활성' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }\`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'joinDate',
    header: '입사일',
    size: 120,
  },
  {
    id: 'actions',
    header: '작업',
    size: 120,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button onClick={() => handleEdit(row.original)}>편집</button>
        <button onClick={() => handleDelete(row.original)}>삭제</button>
      </div>
    ),
  },
];

// 테이블 인스턴스 생성
const table = useReactTable({
  data: tanstackData,
  columns: tanstackColumns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  initialState: {
    pagination: {
      pageSize: 5,
    },
  },
});

// 테이블 렌더링
<table>
  <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th key={header.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>`}</pre>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🚀 TanStack Table 주요 기능</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>정렬:</strong> 컬럼별 오름차순/내림차순 정렬</li>
              <li>• <strong>페이지네이션:</strong> 페이지 단위 데이터 표시</li>
              <li>• <strong>필터링:</strong> 데이터 검색 및 필터링</li>
              <li>• <strong>커스텀 셀:</strong> 각 셀의 렌더링 커스터마이징</li>
              <li>• <strong>컬럼 리사이징:</strong> 컬럼 너비 조정</li>
              <li>• <strong>드래그 앤 드롭:</strong> 행/컬럼 순서 변경</li>
              <li>• <strong>가상화:</strong> 대용량 데이터 성능 최적화</li>
              <li>• <strong>TypeScript:</strong> 완전한 타입 지원</li>
              <li>• <strong>접근성:</strong> 키보드 네비게이션 지원</li>
              <li>• <strong>확장성:</strong> 플러그인 기반 아키텍처</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">💡 사용 팁</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>성능:</strong> getCoreRowModel()로 기본 기능 활성화</li>
              <li>• <strong>정렬:</strong> getSortedRowModel()로 정렬 기능 추가</li>
              <li>• <strong>페이지네이션:</strong> getPaginationRowModel()로 페이지 기능 추가</li>
              <li>• <strong>필터링:</strong> getFilteredRowModel()로 필터 기능 추가</li>
              <li>• <strong>커스텀 렌더링:</strong> cell prop으로 셀 내용 커스터마이징</li>
              <li>• <strong>액션 버튼:</strong> id: 'actions'로 작업 컬럼 추가</li>
              <li>• <strong>상태 관리:</strong> useState로 테이블 상태 관리</li>
              <li>• <strong>스타일링:</strong> Tailwind CSS로 테이블 스타일링</li>
              <li>• <strong>반응형:</strong> overflow-x-auto로 모바일 대응</li>
              <li>• <strong>접근성:</strong> 적절한 ARIA 속성 추가</li>
            </ul>
          </div>
        </section>

        {/* TanStack Table 고급 기능 예제 */}
        <section id="tanstack-advanced" className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">15. TanStack Table 고급 기능</h2>
          <div className="mb-4 text-gray-700">정렬, 그리드 내 편집, 필터링, 행 선택, 데이터 내보내기 등 고급 기능을 포함한 테이블입니다.</div>

          {/* 고급 기능 컨트롤 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-4 items-center">
              {/* 전역 검색 */}
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-medium text-gray-700 mb-1">전역 검색</label>
                <input
                  type="text"
                  value={globalFilter ?? ''}
                  onChange={e => setGlobalFilter(e.target.value)}
                  placeholder="모든 컬럼에서 검색..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 액션 버튼들 */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddRow}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  행 추가
                </button>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  내보내기
                </button>
                <div className="relative column-dropdown">
                  <button
                    onClick={() => setColumnVisibility(prev => ({ ...prev, showDropdown: !prev.showDropdown }))}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    컬럼 설정
                  </button>
                  {columnVisibility.showDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 min-w-48">
                      <div className="text-sm font-medium text-gray-700 mb-2">표시할 컬럼</div>
                      {advancedTable.getAllLeafColumns()
                        .filter(column => column.id !== 'select' && column.id !== 'actions')
                        .map(column => (
                          <label key={column.id} className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={column.getIsVisible()}
                              onChange={column.getToggleVisibilityHandler()}
                              className="w-4 h-4"
                            />
                            <span>{column.columnDef.header}</span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 선택된 행 정보 */}
            <div className="mt-4 text-sm text-gray-600">
              선택된 행: {advancedTable.getFilteredSelectedRowModel().rows.length}개 /
              전체 행: {advancedTable.getFilteredRowModel().rows.length}개
            </div>
          </div>

          {/* 고급 기능 테이블 */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  {advancedTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-gray-50">
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center justify-between">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="ml-2">
                                {header.column.getIsSorted() === 'asc' ? '↑' :
                                  header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                              </span>
                            )}
                          </div>
                          {header.column.getCanFilter() && (
                            <ColumnFilter column={header.column} />
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {advancedTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 border-b">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => advancedTable.previousPage()}
                  disabled={!advancedTable.getCanPreviousPage()}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  이전
                </button>
                <span className="text-sm text-gray-700">
                  {advancedTable.getState().pagination.pageIndex + 1} / {advancedTable.getPageCount()}
                </span>
                <button
                  onClick={() => advancedTable.nextPage()}
                  disabled={!advancedTable.getCanNextPage()}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  다음
                </button>
              </div>
              <div className="text-sm text-gray-500">
                총 {advancedTable.getFilteredRowModel().rows.length}개 항목
              </div>
            </div>
          </div>

          {/* 코드 예제 */}
          <div className="bg-gray-900 text-green-400 rounded p-4 text-sm overflow-x-auto">
            <pre>{`// 고급 기능을 위한 상태 관리
const [globalFilter, setGlobalFilter] = useState('');
const [sorting, setSorting] = useState([]);
const [columnFilters, setColumnFilters] = useState([]);
const [columnVisibility, setColumnVisibility] = useState({});
const [rowSelection, setRowSelection] = useState({});

// 편집 가능한 셀 컴포넌트
const editableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full px-2 py-1 border rounded text-sm"
    />
  );
};

// 컬럼 필터 컴포넌트
const ColumnFilter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <div className="mt-2">
      <input
        type="text"
        value={columnFilterValue ?? ''}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder={\`\${column.columnDef.header} 필터...\`}
        className="w-full px-2 py-1 text-xs border rounded"
      />
    </div>
  );
};

  // 고급 기능 테이블 설정
  const advancedTable = useReactTable({
    data: advancedData,
    columns: advancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onColumnVisibilityChange: setColumnVisibility,
  onRowSelectionChange: setRowSelection,
  onGlobalFilterChange: setGlobalFilter,
  globalFilterFn: 'includesString',
  state: {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
  },
  meta: {
    updateData: (rowIndex, columnId, value) => {
      setAdvancedData(old =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        })
      );
    },
  },
});

// 데이터 내보내기 기능
const handleExportData = () => {
  const selectedRows = advancedTable.getFilteredSelectedRowModel().rows;
  const dataToExport = selectedRows.length > 0
    ? selectedRows.map(row => row.original)
    : advancedData;

  const csvContent = [
    Object.keys(dataToExport[0]).join(','),
    ...dataToExport.map(row => Object.values(row).join(','))
  ].join('\\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'user_data.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

// 컬럼 가시성 제어 UI
const ColumnVisibilityControl = () => (
  <div className="relative column-dropdown">
    <button onClick={() => setColumnVisibility(prev => ({
      ...prev,
      showDropdown: !prev.showDropdown
    }))}>
      컬럼 설정
    </button>
    {columnVisibility.showDropdown && (
      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-3 z-10">
        {advancedTable.getAllLeafColumns()
          .filter(column => column.id !== 'select' && column.id !== 'actions')
          .map(column => (
            <label key={column.id} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              <span>{column.columnDef.header}</span>
            </label>
          ))}
      </div>
    )}
  </div>
);`}</pre>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">🚀 고급 기능 목록</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• <strong>그리드 내 편집:</strong> 셀을 직접 클릭하여 편집 가능</li>
              <li>• <strong>정렬:</strong> 컬럼 헤더 클릭으로 오름차순/내림차순 정렬</li>
              <li>• <strong>전역 검색:</strong> 모든 컬럼에서 동시 검색</li>
              <li>• <strong>컬럼별 필터링:</strong> 각 컬럼 헤더 아래에 개별 필터 입력</li>
              <li>• <strong>행 선택:</strong> 체크박스로 개별/전체 행 선택</li>
              <li>• <strong>데이터 내보내기:</strong> 선택된 행 또는 전체 데이터를 CSV로 내보내기</li>
              <li>• <strong>행 추가/삭제:</strong> 동적으로 행 추가 및 삭제</li>
              <li>• <strong>컬럼 가시성 제어:</strong> 컬럼 설정 버튼으로 표시할 컬럼 선택</li>
              <li>• <strong>페이지네이션:</strong> 페이지 단위 데이터 표시</li>
              <li>• <strong>상태 관리:</strong> 정렬, 필터, 선택 상태 유지</li>
              <li>• <strong>반응형 디자인:</strong> 다양한 화면 크기에 대응</li>
              <li>• <strong>실시간 데이터 업데이트:</strong> 편집 시 즉시 반영</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 사용 방법</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>편집:</strong> 이름, 이메일, 부서, 상태, 급여 셀을 클릭하여 직접 편집</li>
              <li>• <strong>정렬:</strong> 컬럼 헤더의 화살표를 클릭하여 정렬</li>
              <li>• <strong>전역 검색:</strong> 상단 검색창에 키워드 입력</li>
              <li>• <strong>컬럼 필터:</strong> 각 컬럼 헤더 아래 필터 입력창 사용</li>
              <li>• <strong>선택:</strong> 체크박스로 행 선택 후 내보내기</li>
              <li>• <strong>행 추가:</strong> "행 추가" 버튼으로 새 행 생성</li>
              <li>• <strong>삭제:</strong> 각 행의 "삭제" 버튼으로 행 제거</li>
              <li>• <strong>내보내기:</strong> "내보내기" 버튼으로 CSV 파일 다운로드</li>
              <li>• <strong>컬럼 설정:</strong> "컬럼 설정" 버튼으로 표시할 컬럼 선택</li>
              <li>• <strong>페이지 이동:</strong> 하단 페이지네이션 버튼 사용</li>
            </ul>
          </div>
        </section>
      </div>

    </PageWrapper>
  );
}
function CmnCodeBoardSampleDemo() {
  const [codeOptions, setCodeOptions] = useState([
    { value: '', label: '전체' },
    { value: 'ADMIN', label: '관리자' },
    { value: 'USER', label: '사용자' },
    { value: 'GUEST', label: '게스트' }
  ]);
  const [codeMap, setCodeMap] = useState({
    ADMIN: '관리자',
    USER: '사용자',
    GUEST: '게스트'
  });
  const [selectedCode, setSelectedCode] = useState('');
  const [boardData, setBoardData] = useState([
    { id: 1, name: '홍길동', role: 'ADMIN' },
    { id: 2, name: '이순신', role: 'USER' },
    { id: 3, name: '강감찬', role: 'GUEST' }
  ]);

  useEffect(() => {
    if (!selectedCode) {
      setBoardData([
        { id: 1, name: '홍길동', role: 'ADMIN' },
        { id: 2, name: '이순신', role: 'USER' },
        { id: 3, name: '강감찬', role: 'GUEST' }
      ]);
    } else {
      setBoardData(prev => prev.filter(row => row.role === selectedCode));
    }
  }, [selectedCode]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '이름' },
    { key: 'role', label: '역할' }
  ];

  const renderCell = (row, col) => {
    if (col.key === 'role') {
      return codeMap[row.role] || row.role;
    }
    return row[col.key];
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <CmpSelect
        label="역할 선택"
        value={selectedCode}
        onChange={setSelectedCode}
        options={codeOptions}
        wrapperClassName="mb-4 w-60"
      />
      <Board columns={columns} data={boardData} renderCell={renderCell} />
    </div>
  );
}
