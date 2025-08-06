'use client';

import { fileAPI, noticeAPI } from '@/app/core/services/api';
import EmpNameDisplay from '@/app/shared/components/EmpNameDisplay';
import { CmpBadge, CmpInput, CmpSelect, CmpTextarea, CommonModal } from '@/app/shared/components/ui';
import { useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { toast } from '@/app/shared/utils/ui_com';
import {
  Calendar,
  Download,
  Edit,
  FileText,
  Paperclip,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function NoticeManagementPage() {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // 검색 상태
  const [searchTitle, setSearchTitle] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    seq: '',
    title: '',
    content: '',
    status: 'STS001'
  });

  const fileInputRef = useRef(null);

  // 쿼리 파라미터
  const noticeQueryParams = {
    page: currentPage,
    size: pageSize,
    title: searchTitle,
    status: searchStatus
  };

  // 공지사항 목록 조회 (Zustand Query 사용)
  const {
    data: noticeData,
    isLoading: noticeLoading,
    error: noticeError,
    refetch: refetchNotices
  } = useQuery(
    ['notice-list', noticeQueryParams],
    () => noticeAPI.getNoticeList(noticeQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
    }
  );

  // 공지사항 생성 뮤테이션
  const {
    mutate: createNoticeMutation,
    isLoading: createNoticeLoading,
    error: createNoticeError
  } = useMutation(
    'create-notice',
    (noticeData) => noticeAPI.createNotice(noticeData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('공지사항이 성공적으로 등록되었습니다.');
          setIsModalOpen(false);
          setFormData({ seq: '', title: '', content: '', status: 'STS001' });
          setSelectedFiles([]);
          refetchNotices();
        } else {
          toast.callCommonToastOpen(response.message || '공지사항 등록에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('공지사항 등록 실패:', error);
        toast.callCommonToastOpen('공지사항 등록 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['notice-list']]
    }
  );

  // 공지사항 수정 뮤테이션
  const {
    mutate: updateNoticeMutation,
    isLoading: updateNoticeLoading,
    error: updateNoticeError
  } = useMutation(
    'update-notice',
    ({ seq, noticeData }) => noticeAPI.updateNotice(seq, noticeData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('공지사항이 성공적으로 수정되었습니다.');
          setIsModalOpen(false);
          setFormData({ seq: '', title: '', content: '', status: 'STS001' });
          setSelectedFiles([]);
          setExistingFiles([]);
          refetchNotices();
        } else {
          toast.callCommonToastOpen(response.message || '공지사항 수정에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('공지사항 수정 실패:', error);
        toast.callCommonToastOpen('공지사항 수정 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['notice-list']]
    }
  );

  // 공지사항 삭제 뮤테이션
  const {
    mutate: deleteNoticeMutation,
    isLoading: deleteNoticeLoading,
    error: deleteNoticeError
  } = useMutation(
    'delete-notice',
    (seq) => noticeAPI.deleteNotice(seq),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('공지사항이 성공적으로 삭제되었습니다.');
          refetchNotices();
        } else {
          toast.callCommonToastOpen(response.message || '공지사항 삭제에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('공지사항 삭제 실패:', error);
        toast.callCommonToastOpen('공지사항 삭제 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['notice-list']]
    }
  );

  // 파일 업로드 뮤테이션
  const {
    mutate: uploadFileMutation,
    isLoading: uploadFileLoading,
    error: uploadFileError
  } = useMutation(
    'upload-file',
    (fileData) => fileAPI.uploadFile(fileData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('파일이 성공적으로 업로드되었습니다.');
        } else {
          toast.callCommonToastOpen(response.message || '파일 업로드에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('파일 업로드 실패:', error);
        toast.callCommonToastOpen('파일 업로드 중 오류가 발생했습니다.');
      }
    }
  );

  // 데이터 설정
  useEffect(() => {
    if (noticeData?.success) {
      const data = noticeData.data;
      setNotices(data.content || []);
      setTotalPages(data.totalPages || 1);
    }
  }, [noticeData]);

  // 로딩 상태 통합
  const loading = noticeLoading || createNoticeLoading || updateNoticeLoading || deleteNoticeLoading || uploadFileLoading;

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

  // 검색
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 검색 조건 초기화
  const handleResetSearch = () => {
    setSearchTitle('');
    setSearchStatus('');
    setCurrentPage(1);
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 모달 열기 (생성)
  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({
      seq: '',
      title: '',
      content: '',
      status: 'STS001'
    });
    setSelectedFiles([]);
    setExistingFiles([]);
    setIsModalOpen(true);
  };

  // 모달 열기 (수정)
  const openEditModal = async (seq) => {
    setIsEditMode(true);
    setFormData({
      seq: seq,
      title: '',
      content: '',
      status: 'STS001'
    });
    setSelectedFiles([]);
    setExistingFiles([]);
    setIsModalOpen(true);

    try {
      const result = await noticeAPI.getNoticeDetail(seq);
      if (result.success) {
        const notice = result.data;
        setFormData({
          seq: notice.seq,
          title: notice.title,
          content: notice.content,
          status: notice.status
        });

        // 기존 파일 목록 로드
        await loadExistingFiles('NOTICE', seq);
      }
    } catch (error) {
      toast.callCommonToastOpen('공지사항 상세 조회 실패: ' + error.message);
    }
  };

  // 기존 파일 목록 로드
  const loadExistingFiles = async (refTblCd, refPkVal) => {
    try {
      const result = await fileAPI.getFileList({ refTblCd, refPkVal });
      if (result.success) {
        setExistingFiles(result.data || []);
      }
    } catch (error) {
      console.error('파일 목록 로드 실패:', error);
    }
  };

  // 파일 선택
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    addFiles(files);
  };

  // 파일 추가
  const addFiles = (files) => {
    const newFiles = files.map(file => ({
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      id: Date.now() + Math.random()
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  // 파일 제거
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 기존 파일 삭제
  const deleteExistingFile = async (fileSeq) => {
    try {
      const result = await fileAPI.deleteFile(fileSeq);
      if (result.success) {
        toast.callCommonToastOpen('파일이 삭제되었습니다.');
        setExistingFiles(prev => prev.filter(file => file.fileSeq !== fileSeq));
      } else {
        toast.callCommonToastOpen(result.message || '파일 삭제에 실패했습니다.');
      }
    } catch (error) {
      toast.callCommonToastOpen('파일 삭제 실패: ' + error.message);
    }
  };

  // 파일 다운로드
  const downloadFile = async (fileSeq, fileName) => {
    try {
      const result = await fileAPI.downloadFile(fileSeq);
      if (result.success) {
        const blob = new Blob([result.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast.callCommonToastOpen(result.message || '파일 다운로드에 실패했습니다.');
      }
    } catch (error) {
      toast.callCommonToastOpen('파일 다운로드 실패: ' + error.message);
    }
  };

  // 파일 미리보기
  const previewFile = async (fileSeq, fileName) => {
    try {
      const result = await fileAPI.downloadFile(fileSeq);
      if (result.success) {
        const blob = new Blob([result.data]);
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        toast.callCommonToastOpen(result.message || '파일 미리보기에 실패했습니다.');
      }
    } catch (error) {
      toast.callCommonToastOpen('파일 미리보기 실패: ' + error.message);
    }
  };

  // 미리보기 가능한 파일 타입 확인
  const canPreview = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'].includes(ext);
  };

  // 공지사항 삭제
  const deleteNotice = async (seq) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      deleteNoticeMutation(seq);
    }
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.callCommonToastOpen('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      toast.callCommonToastOpen('내용을 입력해주세요.');
      return;
    }

    setIsEditLoading(true);

    try {
      const noticeData = {
        title: formData.title,
        content: formData.content,
        status: formData.status
      };

      if (isEditMode) {
        updateNoticeMutation({ seq: formData.seq, noticeData });
      } else {
        createNoticeMutation(noticeData);
      }
    } catch (error) {
      console.error('공지사항 저장 실패:', error);
      toast.callCommonToastOpen('공지사항 저장 중 오류가 발생했습니다.');
    } finally {
      setIsEditLoading(false);
    }
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 아이콘 반환
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-100"
          >
            이전
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-100"
          >
            다음
          </button>
        )}
      </div>
    );
  };

  return (
    <PageWrapper
      title="관리자"
      subtitle="공지사항 관리"
      showCard={false}
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">공지사항 관리</h1>
        </div>

        {/* 검색 및 등록 버튼 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">검색 및 등록</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-700 mb-1">
                제목 검색
              </label>
              <CmpInput
                id="searchTitle"
                placeholder="제목을 입력하세요"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
            </div>
            <div className="w-48">
              <label htmlFor="searchStatus" className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <CmpSelect
                value={searchStatus}
                onChange={(value) => setSearchStatus(value)}
                options={[
                  { value: '', label: '전체' },
                  { value: 'STS001', label: '활성' },
                  { value: 'STS002', label: '비활성' }
                ]}
                placeholder="전체"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '검색 중...' : '검색'}
            </button>
            <button
              onClick={handleResetSearch}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              초기화
            </button>
            <button
              onClick={openCreateModal}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              공지사항 등록
            </button>
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">공지사항 목록</h2>
            {(searchTitle || searchStatus) && (
              <div className="text-sm text-gray-600">
                검색 조건:
                {searchTitle && <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">제목: {searchTitle}</span>}
                {searchStatus && <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded">상태: {searchStatus === 'STS001' ? '활성' : '비활성'}</span>}
              </div>
            )}
          </div>
          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTitle || searchStatus ? '검색 조건에 맞는 공지사항이 없습니다.' : '등록된 공지사항이 없습니다.'}
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.seq} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{notice.title}</h3>
                    <CmpBadge variant={notice.status === 'STS001' ? 'default' : 'secondary'}>
                      {notice.status === 'STS001' ? '활성' : '비활성'}
                    </CmpBadge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(notice.regDate).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>작성자: <EmpNameDisplay empId={notice.regEmpId} empName={notice.regEmpNm} /></span>
                    </div>
                    {notice.updEmpId && notice.updEmpId !== notice.regEmpId && (
                      <div className="flex items-center gap-1">
                        <Edit className="w-4 h-4" />
                        <span>수정자: <EmpNameDisplay empId={notice.updEmpId} empName={notice.updEmpNm} /></span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Paperclip className="w-4 h-4" />
                      {notice.fileAttachYn === 'Y' ? '첨부파일 있음' : '첨부파일 없음'}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {notice.content ? (notice.content.length > 200 ? notice.content.substring(0, 200) + '...' : notice.content) : ''}
                  </p>

                  {/* 추가 정보 표시 */}
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    {notice.updDate && notice.updDate !== notice.regDate && (
                      <div>최종 수정: {new Date(notice.updDate).toLocaleString()}</div>
                    )}
                    {notice.fileAttachYn === 'Y' && notice.fileCount > 0 && (
                      <div>첨부파일: {notice.fileCount}개</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50"
                      onClick={() => openEditModal(notice.seq)}
                      disabled={isEditLoading}
                    >
                      <Edit className={`w-4 h-4 ${isEditLoading ? 'animate-spin' : ''}`} />
                      {isEditLoading ? '로딩 중...' : '수정'}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center gap-1"
                      onClick={() => deleteNotice(notice.seq)}
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                    {notice.fileAttachYn === 'Y' && (
                      <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1"
                        onClick={() => loadExistingFiles('NOTICE', notice.seq)}
                      >
                        <FileText className="w-4 h-4" />
                        첨부파일
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {renderPagination()}
        </div>

        {/* 공지사항 등록/수정 모달 */}
        <CommonModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log('모달 닫기 호출됨');
            setIsModalOpen(false);
            // 모달 닫을 때 상태 초기화
            setSelectedFiles([]);
            setExistingFiles([]);
            setIsUploading(false);
            setUploadProgress(0);
            setIsDragOver(false);
          }}
          title={isEditMode ? '공지사항 수정' : '공지사항 등록'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 min-h-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  제목 *
                </label>
                <CmpInput
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </label>
                <CmpSelect
                  value={formData.status}
                  onChange={(value) => setFormData({ ...formData, status: value })}
                  options={[
                    { value: 'STS001', label: '활성' },
                    { value: 'STS002', label: '비활성' }
                  ]}
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                내용 *
              </label>
              <CmpTextarea
                id="content"
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="resize-none"
              />
            </div>



            {/* 첨부파일 섹션 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">첨부파일</label>
                {(selectedFiles.length > 0 || existingFiles.length > 0) && (
                  <span className="text-xs text-gray-500">
                    총 {selectedFiles.length + existingFiles.length}개 파일
                  </span>
                )}
              </div>

              {/* 업로드 진행 상황 */}
              {isUploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-700">파일 업로드 중...</span>
                    <span className="text-sm text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* 파일 업로드 영역 */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600 mb-2">
                  {isDragOver ? '파일을 여기에 놓으세요' : '파일을 드래그하여 놓거나 클릭하여 선택하세요'}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  지원 형식: JPG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR<br />
                  최대 파일 크기: 50MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  파일 선택
                </button>
              </div>

              {/* 선택된 파일 목록 */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      선택된 파일 목록 ({selectedFiles.length}개)
                    </label>
                    <button
                      type="button"
                      className="text-sm text-red-500 hover:text-red-700"
                      onClick={() => setSelectedFiles([])}
                    >
                      전체 삭제
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-2xl flex-shrink-0">{getFileIcon(file.name)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                          onClick={() => removeFile(index)}
                          title="파일 제거"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 기존 파일 목록 */}
              {existingFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    기존 첨부파일 ({existingFiles.length}개)
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {existingFiles.map((file) => (
                      <div key={file.fileSeq} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-2xl flex-shrink-0">{getFileIcon(file.fileNm)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{file.fileNm}</p>
                            <p className="text-xs text-gray-600">{file.fileSizeDisplay}</p>
                            {file.regDate && (
                              <p className="text-xs text-gray-500">
                                업로드: {new Date(file.regDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {canPreview(file.fileNm) && (
                            <button
                              type="button"
                              className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
                              onClick={() => previewFile(file.fileSeq, file.fileNm)}
                              title="미리보기"
                            >
                              <FileText className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
                            onClick={() => downloadFile(file.fileSeq, file.fileNm)}
                            title="다운로드"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center gap-1"
                            onClick={() => deleteExistingFile(file.fileSeq)}
                            title="삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isEditLoading}
              >
                {isEditLoading ? '처리 중...' : (isEditMode ? '수정' : '등록')}
              </button>
            </div>
          </form>
        </CommonModal>


      </div>
    </PageWrapper>
  );
}
