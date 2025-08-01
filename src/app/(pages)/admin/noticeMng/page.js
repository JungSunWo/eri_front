'use client';


import { fileAPI, noticeAPI } from '@/app/core/services/api';
import EmpNameDisplay from '@/app/shared/components/EmpNameDisplay';
import { CmpBadge, CmpInput, CmpSelect, CmpTextarea, CommonModal } from '@/app/shared/components/ui';
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
  const [loading, setLoading] = useState(false);

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

  // 페이지 로드 시 공지사항 목록 조회
  useEffect(() => {
    loadNoticeList();
  }, []);

  // 모달 상태 디버깅
  useEffect(() => {
    console.log('모달 상태 변경:', { isModalOpen, isEditMode });
  }, [isModalOpen, isEditMode]);

  // 공지사항 목록 조회
  const loadNoticeList = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: pageSize,
        title: searchTitle,
        status: searchStatus
      };

      const result = await noticeAPI.getNoticeList(params);

      if (result.success) {
        setNotices(result.data.content);
        setTotalPages(result.data.totalPages);
        setCurrentPage(page);
      } else {
        toast.callCommonToastOpen(result.message || '공지사항 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      toast.callCommonToastOpen('공지사항 목록 조회 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색
  const handleSearch = () => {
    loadNoticeList(1);
  };

  // 검색 조건 초기화
  const handleResetSearch = () => {
    setSearchTitle('');
    setSearchStatus('');
    loadNoticeList(1);
  };

  // 공지사항 등록 모달 열기
  const openCreateModal = () => {
    console.log('openCreateModal 호출됨');
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
    console.log('등록 모달 열기 완료');
  };

  // 공지사항 수정 모달 열기
  const openEditModal = async (seq) => {
    console.log('openEditModal 호출됨, seq:', seq);
    setIsEditLoading(true);
    try {
      const result = await noticeAPI.getNoticeDetail(seq);
      console.log('API 응답:', result);

      if (result.success) {
        const notice = result.data;
        console.log('공지사항 데이터:', notice);

        // 상태 설정을 한 번에 처리
        setFormData({
          seq: notice.seq,
          title: notice.ttl,
          content: notice.cntn,
          status: notice.stsCd
        });

        // 작성자와 수정자 정보 로그 출력 (디버깅용)
        console.log('공지사항 상세 정보:', {
          seq: notice.seq,
          title: notice.ttl,
          regEmpId: notice.regEmpId,
          updEmpId: notice.updEmpId,
          regDate: notice.regDate,
          updDate: notice.updDate
        });
        setSelectedFiles([]);

        // 기존 첨부파일 목록 로드
        if (notice.fileAttachYn === 'Y') {
          await loadExistingFiles('NTI', seq);
        } else {
          setExistingFiles([]);
        }

        console.log('모달 열기 전 상태:', { isEditMode: true, isModalOpen: true });
        // 모달 상태 설정
        setIsEditMode(true);
        setTimeout(() => {
          setIsModalOpen(true);
          console.log('모달 열기 완료');
        }, 0);
      } else {
        toast.callCommonToastOpen('공지사항 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('openEditModal 에러:', error);
      toast.callCommonToastOpen('공지사항 조회 실패: ' + error.message);
    } finally {
      setIsEditLoading(false);
    }
  };

  // 기존 첨부파일 목록 로드
  const loadExistingFiles = async (refTblCd, refPkVal) => {
    try {
      // 백엔드 API 오류로 인해 기존 API 사용
      const params = {
        refTblCd: refTblCd,
        refPkVal: refPkVal
      };
      const result = await fileAPI.getFileList(params);

      if (result.success) {
        setExistingFiles(result.data);
      } else {
        setExistingFiles([]);
      }
    } catch (error) {
      console.error('기존 첨부파일 로드 실패:', error);
      setExistingFiles([]);
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    addFiles(files);
    // 파일 입력 초기화
    event.target.value = '';
  };

  // 파일 추가 (중복 체크 및 유효성 검사 포함)
  const addFiles = (files) => {
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'application/zip', 'application/x-rar-compressed'
    ];

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      // 파일 크기 검사
      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (크기 초과: ${formatFileSize(file.size)})`);
        return;
      }

      // 파일 타입 검사
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (지원하지 않는 파일 형식)`);
        return;
      }

      // 중복 검사
      const isDuplicate = selectedFiles.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      );

      if (isDuplicate) {
        invalidFiles.push(`${file.name} (중복 파일)`);
        return;
      }

      validFiles.push(file);
    });

    // 유효하지 않은 파일들 알림
    if (invalidFiles.length > 0) {
      toast.callCommonToastOpen(`다음 파일들이 제외되었습니다:\n${invalidFiles.join('\n')}`);
    }

    // 유효한 파일들만 추가
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      toast.callCommonToastOpen(`${validFiles.length}개 파일이 추가되었습니다.`);
    }
  };

  // 드래그 앤 드롭 이벤트 핸들러
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
    if (!confirm('정말로 이 파일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      console.log('파일 삭제 시도:', { fileSeq });
      const result = await fileAPI.deleteFile(fileSeq);
      console.log('파일 삭제 결과:', result);

      if (result.success) {
        toast.callCommonToastOpen('파일이 삭제되었습니다.');
        // 기존 파일 목록 새로고침
        if (formData.seq) {
          await loadExistingFiles('NTI', formData.seq);
        }
      } else {
        toast.callCommonToastOpen('파일 삭제 실패: ' + result.message);
      }
    } catch (error) {
      console.error('파일 삭제 에러 상세:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      toast.callCommonToastOpen('파일 삭제 실패: ' + (error.response?.data?.message || error.message));
    }
  };

  // 파일 다운로드
  const downloadFile = async (fileSeq, fileName) => {
    try {
      const result = await fileAPI.downloadFile(fileSeq);

      // Blob을 다운로드 링크로 변환
      const blob = new Blob([result]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.callCommonToastOpen('파일이 다운로드되었습니다.');
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      toast.callCommonToastOpen('파일 다운로드 실패: ' + error.message);
    }
  };

  // 파일 미리보기
  const previewFile = async (fileSeq, fileName) => {
    try {
      const result = await fileAPI.previewFile(fileSeq);

      // Blob을 미리보기 링크로 변환
      const blob = new Blob([result]);
      const url = window.URL.createObjectURL(blob);

      // 새 창에서 열기
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        toast.callCommonToastOpen('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      }

      // 메모리 정리
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      console.error('파일 미리보기 실패:', error);
      toast.callCommonToastOpen('파일 미리보기 실패: ' + error.message);
    }
  };

  // 파일 미리보기 가능 여부 확인
  const canPreview = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const previewableExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'txt'];
    return previewableExtensions.includes(extension);
  };

  // 공지사항 삭제
  const deleteNotice = async (seq) => {
    if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await noticeAPI.deleteNotice(seq);

      if (result.success) {
        toast.callCommonToastOpen('공지사항이 삭제되었습니다.');
        loadNoticeList(currentPage);
      } else {
        toast.callCommonToastOpen('공지사항 삭제 실패: ' + result.message);
      }
    } catch (error) {
      toast.callCommonToastOpen('공지사항 삭제 실패: ' + error.message);
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsEditLoading(true);
    try {
      let result;

      if (isEditMode) {
        // 수정 모드: 공지사항 업데이트 후 첨부파일 처리
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('content', formData.content);
        formDataObj.append('status', formData.status);

        // 선택된 파일들을 FormData에 추가
        if (selectedFiles.length > 0) {
          selectedFiles.forEach(file => {
            formDataObj.append('files', file);
          });
        }

        result = await noticeAPI.updateNotice(formData.seq, formDataObj);

        // 새로운 첨부파일이 있으면 업로드 진행 상황 표시
        if (result.success && selectedFiles.length > 0) {
          try {
            setIsUploading(true);
            setUploadProgress(0);

            // 업로드 진행 상황 시뮬레이션
            const progressInterval = setInterval(() => {
              setUploadProgress(prev => {
                if (prev >= 90) {
                  clearInterval(progressInterval);
                  return 90;
                }
                return prev + 10;
              });
            }, 200);

            // 파일은 이미 updateNotice에서 업로드되었으므로 별도 업로드 불필요
            clearInterval(progressInterval);
            setUploadProgress(100);

            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
            }, 500);

            toast.callCommonToastOpen('첨부파일이 추가되었습니다.');
          } catch (fileError) {
            setIsUploading(false);
            setUploadProgress(0);
            console.error('첨부파일 업로드 실패:', fileError);
            toast.callCommonToastOpen('공지사항은 수정되었지만 첨부파일 업로드에 실패했습니다.');
          }
        }
      } else {
        // 등록 모드: 공지사항 생성 후 첨부파일 처리
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('content', formData.content);
        formDataObj.append('status', formData.status);

        // 선택된 파일들을 FormData에 추가
        if (selectedFiles.length > 0) {
          selectedFiles.forEach(file => {
            formDataObj.append('files', file);
          });
        }

        result = await noticeAPI.createNotice(formDataObj);

        // 새로운 첨부파일이 있으면 업로드 진행 상황 표시
        if (result.success && selectedFiles.length > 0) {
          try {
            const noticeSeq = result.data?.seq || result.data?.id;
            if (noticeSeq) {
              setIsUploading(true);
              setUploadProgress(0);

              // 업로드 진행 상황 시뮬레이션
              const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                  if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                  }
                  return prev + 10;
                });
              }, 200);

              // 파일은 이미 createNotice에서 업로드되었으므로 별도 업로드 불필요 (백엔드에서 처리)
              clearInterval(progressInterval);
              setUploadProgress(100);

              setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
              }, 500);

              toast.callCommonToastOpen('첨부파일이 추가되었습니다.');
            }
          } catch (fileError) {
            setIsUploading(false);
            setUploadProgress(0);
            console.error('첨부파일 업로드 실패:', fileError);
            toast.callCommonToastOpen('공지사항은 등록되었지만 첨부파일 업로드에 실패했습니다.');
          }
        }
      }

      if (result.success) {
        toast.callCommonToastOpen(isEditMode ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.');
        setIsModalOpen(false);
        loadNoticeList(currentPage);
      } else {
        toast.callCommonToastOpen((isEditMode ? '공지사항 수정' : '공지사항 등록') + ' 실패: ' + result.message);
      }
    } catch (error) {
      toast.callCommonToastOpen((isEditMode ? '공지사항 수정' : '공지사항 등록') + ' 실패: ' + error.message);
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

  // 파일 아이콘 가져오기
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📎';
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // 이전 페이지 버튼
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={() => loadNoticeList(currentPage - 1)}
        >
          이전
        </button>
      );
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded text-sm ${i === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-300 hover:bg-gray-50'
            }`}
          onClick={() => loadNoticeList(i)}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={() => loadNoticeList(currentPage + 1)}
        >
          다음
        </button>
      );
    }

    return (
      <div className="flex justify-center gap-2 mt-6">
        {pages}
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
                    <h3 className="text-lg font-semibold">{notice.ttl}</h3>
                    <CmpBadge variant={notice.stsCd === 'STS001' ? 'default' : 'secondary'}>
                      {notice.stsCd === 'STS001' ? '활성' : '비활성'}
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
                    {notice.cntn ? (notice.cntn.length > 200 ? notice.cntn.substring(0, 200) + '...' : notice.cntn) : ''}
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
                        onClick={() => loadExistingFiles('NTI', notice.seq)}
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
