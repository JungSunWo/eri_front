'use client';

import empNameCache from '@/common/empNameCache';
import { usePageMoveStore } from '@/common/store/pageMoveStore';
import EmpNameDisplay from '@/components/EmpNameDisplay';
import PageWrapper from '@/components/layout/PageWrapper';
import { authAPI, fileAPI, noticeAPI } from '@/lib/api';
import { Download, FileText, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';

// 날짜 포맷팅 함수
function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateStr;
  }
}

// 상태 텍스트 변환 함수
function getStatusText(statusCode) {
  const statusMap = {
    'Y': '활성',
    'N': '비활성',
    'D': '삭제됨'
  };
  return statusMap[statusCode] || statusCode || '-';
}

export default function NoticeDetailPage({ params }) {
  const { id } = params;
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

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

  useEffect(() => {
    // ID 유효성 검사
    if (!id || isNaN(Number(id))) {
      setError('유효하지 않은 공지사항 ID입니다.');
      setLoading(false);
      return;
    }

    const fetchNoticeDetail = async () => {
      try {
        setLoading(true);
        const response = await noticeAPI.getNoticeDetail(id);

        // 데이터가 없는 경우 에러 처리
        if (!response || Object.keys(response).length === 0) {
          setError('공지사항을 찾을 수 없습니다.');
          return;
        }

        setData(response.data);

        // 첨부파일이 있는 경우 첨부파일 목록 조회
        if (response.data.fileAttachYn === 'Y') {
          await fetchAttachments(id);
        }
      } catch (e) {
        console.error('Failed to fetch notice detail:', e);
        setError(e.message || '공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [id]);

  // 첨부파일 목록 조회
  const fetchAttachments = async (noticeId) => {
    try {
      setLoadingAttachments(true);
      const response = await fileAPI.getFileList({
        refTblCd: 'NTI',
        refPkVal: noticeId
      });

      if (response.success) {
        setAttachments(response.data || []);
      } else {
        setAttachments([]);
      }
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
      setAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  };

  // 파일 다운로드
  const handleDownload = async (fileSeq, fileName) => {
    try {
      const response = await fileAPI.downloadFile(fileSeq);

      // Blob을 다운로드 링크로 변환
      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('파일 다운로드에 실패했습니다.');
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

  const handleBackToList = () => {
    setMoveTo('/resources/notice');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <PageWrapper
        title="자료실"
        subtitle="공지사항 상세"
        showCard={false}
      >
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">공지사항을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="자료실"
      subtitle="공지사항 상세"
      showCard={false}
    >
      <div className="max-w-4xl mx-auto p-6">


        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800">오류가 발생했습니다</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        )}

        {/* 공지사항 상세 내용 */}
        {data && (
          <div className="bg-white rounded-lg shadow-sm border">
            {/* 헤더 영역 */}
            <div className="border-b border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{data.ttl || '제목 없음'}</h1>

              {/* 메타 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>작성자: <EmpNameDisplay empId={data.regEmpId} /></span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>작성일: {formatDate(data.regDate)}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>상태: {getStatusText(data.stsCd)}</span>
                </div>
              </div>

              {/* 수정자 정보 (작성자와 다른 경우에만 표시) */}
              {data.updEmpId && data.updEmpId !== data.regEmpId && (
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>수정자: <EmpNameDisplay empId={data.updEmpId} /></span>
                    {data.updDate && (
                      <span className="ml-4">수정일: {formatDate(data.updDate)}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 본문 영역 */}
            <div className="p-6">
              {data.cntn ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.cntn }}
                />
              ) : (
                <div className="text-gray-500 text-center py-8">
                  내용이 없습니다.
                </div>
              )}
            </div>

            {/* 첨부파일 영역 */}
            {data.fileAttachYn === 'Y' && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center mb-4">
                  <Paperclip className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">첨부파일</h3>
                  {loadingAttachments && (
                    <div className="ml-2 text-sm text-gray-500">로딩 중...</div>
                  )}
                </div>

                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((file) => (
                      <div
                        key={file.fileSeq}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">{file.fileNm}</div>
                            <div className="text-sm text-gray-500">
                              {formatFileSize(file.fileSize)} • {file.fileExt}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(file.fileSeq, file.fileNm)}
                          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          다운로드
                        </button>
                      </div>
                    ))}
                  </div>
                ) : !loadingAttachments ? (
                  <div className="text-center py-4 text-gray-500">
                    첨부파일이 없습니다.
                  </div>
                ) : null}
              </div>
            )}

            {/* 하단 액션 영역 */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  공지사항 ID: {data.seq || id}
                  {data.fileAttachYn === 'Y' && (
                    <span className="ml-4">
                      첨부파일: {attachments.length}개
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    인쇄
                  </button>
                  <button
                    onClick={handleBackToList}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    목록으로
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
