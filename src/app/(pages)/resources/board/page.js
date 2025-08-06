/**
 * @File Name      : page.js
 * @File path      : src/app/(page)/resources/board/page.js
 * @author         : 정선우
 * @Description    : 직원권익게시판 페이지
 *                   - 게시글 목록 조회 및 검색
 *                   - 게시글 상세보기 및 댓글
 *                   - 게시글 작성 및 수정
 * @History        : 20250701  최초 신규
 **/

'use client';

import { boardAPI } from '@/app/core/services/api';
import { CmpInput, CmpSelect, CmpTextarea } from '@/app/shared/components/ui';
import { useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { toast } from '@/app/shared/utils/ui_com';
import ImageTextModal from '@/components/ImageTextModal';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FileText,
    Image,
    MessageCircle,
    Paperclip,
    PenTool,
    Search,
    ThumbsUp,
    Upload,
    User,
    Video,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function EmployeeRightsBoardPage() {
  // 상태 관리
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentReplyTo, setCurrentReplyTo] = useState(null);
  const [replyFormData, setReplyFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [fileErrors, setFileErrors] = useState({});
  const [fileLinks, setFileLinks] = useState({}); // 파일별 링크 정보 저장

  // 글쓰기 모달용 파일 상태
  const [writeModalFiles, setWriteModalFiles] = useState([]);
  const [writeModalUploadingFiles, setWriteModalUploadingFiles] = useState(false);
  const [writeModalFileErrors, setWriteModalFileErrors] = useState({});
  const [writeModalFileLinks, setWriteModalFileLinks] = useState({});
  const [writeModalPreviewFile, setWriteModalPreviewFile] = useState(null);
  const [writeModalShowPreviewModal, setWriteModalShowPreviewModal] = useState(false);
  const [writeModalShowTextModal, setWriteModalShowTextModal] = useState(false);
  const [writeModalSelectedImageFile, setWriteModalSelectedImageFile] = useState(null);
  const writeModalImageTextInputRef = useRef(null);

  // 수정 모달용 파일 상태
  const [editModalFiles, setEditModalFiles] = useState([]);
  const [editModalUploadingFiles, setEditModalUploadingFiles] = useState(false);
  const [editModalFileErrors, setEditModalFileErrors] = useState({});
  const [editModalFileLinks, setEditModalFileLinks] = useState({});
  const [editModalPreviewFile, setEditModalPreviewFile] = useState(null);
  const [editModalShowPreviewModal, setEditModalShowPreviewModal] = useState(false);
  const [editModalShowTextModal, setEditModalShowTextModal] = useState(false);
  const [editModalSelectedImageFile, setEditModalSelectedImageFile] = useState(null);
  const editModalImageTextInputRef = useRef(null);

  // 검색 및 필터 상태
  const [searchType, setSearchType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('regDate');

  // 모달 상태
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCommentEditModal, setShowCommentEditModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  // 폼 상태
  const [boardForm, setBoardForm] = useState({
    ttl: '',
    cntn: '',
    categoryCd: '',
    noticeYn: 'N'
  });

  const [commentForm, setCommentForm] = useState({
    cntn: ''
  });

  // 옵션 데이터
  const searchTypeOptions = [
    { value: '', label: '전체' },
    { value: 'title', label: '제목' },
    { value: 'content', label: '내용' }
  ];

  const categoryOptions = [
    { value: '', label: '전체 카테고리' },
    { value: 'GENERAL', label: '일반' },
    { value: 'COMPLAINT', label: '불만/민원' },
    { value: 'SUGGESTION', label: '건의사항' },
    { value: 'QUESTION', label: '질문' }
  ];

  const sortOptions = [
    { value: 'regDate', label: '최신순' },
    { value: 'viewCnt', label: '조회순' },
    { value: 'likeCnt', label: '좋아요순' }
  ];

  const boardCategoryOptions = [
    { value: '', label: '선택하세요' },
    { value: 'GENERAL', label: '일반' },
    { value: 'COMPLAINT', label: '불만/민원' },
    { value: 'SUGGESTION', label: '건의사항' },
    { value: 'QUESTION', label: '질문' }
  ];

  // Query parameters
  const boardQueryParams = {
    page: currentPage,
    size: 10,
    searchType,
    searchKeyword,
    categoryCd: categoryFilter,
    sortBy,
    sortDirection: 'DESC'
  };

  // 게시글 목록 조회 쿼리
  const {
    data: boardListData,
    isLoading: boardListLoading,
    error: boardListError,
    refetch: refetchBoardList
  } = useQuery(
    ['board-list', boardQueryParams],
    () => boardAPI.getBoardList(boardQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false
    }
  );

  // 게시글 상세 조회 쿼리
  const {
    data: boardDetailData,
    isLoading: boardDetailLoading,
    error: boardDetailError,
    refetch: refetchBoardDetail
  } = useQuery(
    ['board-detail', selectedBoard?.seq],
    () => boardAPI.getBoardDetail(selectedBoard?.seq),
    {
      cacheTime: 5 * 60 * 1000, // 5분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: !!selectedBoard?.seq
    }
  );

  // 댓글 목록 조회 쿼리
  const {
    data: commentListData,
    isLoading: commentListLoading,
    error: commentListError,
    refetch: refetchCommentList
  } = useQuery(
    ['comment-list', selectedBoard?.seq],
    () => boardAPI.getCommentList(selectedBoard?.seq),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: !!selectedBoard?.seq
    }
  );

  // 게시글 등록 뮤테이션
  const {
    mutate: createBoardMutation,
    isLoading: createBoardLoading,
    error: createBoardError
  } = useMutation(
    'create-board',
    (boardData) => boardAPI.createBoard(boardData),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          const boardSeq = response.data?.seq;

          // 파일이 있으면 업로드
          if (writeModalFiles.length > 0 && boardSeq) {
            handleFileUploadForBoard(boardSeq, writeModalFiles);
          }

          displayToast('게시글이 등록되었습니다.');
          resetWriteModal();
          refetchBoardList();
        } else {
          displayToast('게시글 등록 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('게시글 등록 실패:', error);
        displayToast('게시글 등록 실패: ' + error.message);
      },
      invalidateQueries: [['board-list']]
    }
  );

  // 게시글 수정 뮤테이션
  const {
    mutate: updateBoardMutation,
    isLoading: updateBoardLoading,
    error: updateBoardError
  } = useMutation(
    'update-board',
    (data) => boardAPI.updateBoard(data.boardSeq, data.boardData),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          const boardSeq = selectedBoard?.seq;

          // 파일이 있으면 업로드
          if (editModalFiles.length > 0 && boardSeq) {
            handleFileUploadForBoard(boardSeq, editModalFiles);
          }

          displayToast('게시글이 수정되었습니다.');
          resetEditModal();
          // 상세 정보 새로고침
          if (selectedBoard) {
            refetchBoardDetail();
          }
          // 목록 새로고침
          refetchBoardList();
        } else {
          displayToast('게시글 수정 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('게시글 수정 실패:', error);
        displayToast('게시글 수정 실패: ' + error.message);
      },
      invalidateQueries: [['board-list'], ['board-detail']]
    }
  );

  // 게시글 삭제 뮤테이션
  const {
    mutate: deleteBoardMutation,
    isLoading: deleteBoardLoading,
    error: deleteBoardError
  } = useMutation(
    'delete-board',
    (boardSeq) => boardAPI.deleteBoard(boardSeq),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          displayToast('게시글이 삭제되었습니다.');
          setShowDetailModal(false);
          setSelectedBoard(null);
          refetchBoardList();
        } else {
          displayToast('게시글 삭제 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('게시글 삭제 실패:', error);
        displayToast('게시글 삭제 실패: ' + error.message);
      },
      invalidateQueries: [['board-list']]
    }
  );

  // 댓글 등록 뮤테이션
  const {
    mutate: createCommentMutation,
    isLoading: createCommentLoading,
    error: createCommentError
  } = useMutation(
    'create-comment',
    (commentData) => boardAPI.createComment(commentData),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          const message = currentReplyTo ? '답글이 등록되었습니다.' : '댓글이 등록되었습니다.';
          displayToast(message);
          resetCommentForm();
          setCurrentReplyTo(null); // 답글 모드 초기화
          refetchCommentList();
        } else {
          displayToast('댓글 등록 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('댓글 등록 실패:', error);
        displayToast('댓글 등록 실패: ' + error.message);
      },
      invalidateQueries: [['comment-list']]
    }
  );

  // 댓글 수정 뮤테이션
  const {
    mutate: updateCommentMutation,
    isLoading: updateCommentLoading,
    error: updateCommentError
  } = useMutation(
    'update-comment',
    (data) => boardAPI.updateComment(data.commentSeq, data.updateData),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          displayToast('댓글이 수정되었습니다.');
          setShowCommentEditModal(false);
          setEditingComment(null);
          resetCommentForm();
          refetchCommentList();
        } else {
          displayToast('댓글 수정 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('댓글 수정 실패:', error);
        displayToast('댓글 수정 실패: ' + error.message);
      },
      invalidateQueries: [['comment-list']]
    }
  );

  // 댓글 삭제 뮤테이션
  const {
    mutate: deleteCommentMutation,
    isLoading: deleteCommentLoading,
    error: deleteCommentError
  } = useMutation(
    'delete-comment',
    (commentSeq) => boardAPI.deleteComment(commentSeq),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          displayToast('댓글이 삭제되었습니다.');
          refetchCommentList();
        } else {
          displayToast('댓글 삭제 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('댓글 삭제 실패:', error);
        displayToast('댓글 삭제 실패: ' + error.message);
      },
      invalidateQueries: [['comment-list']]
    }
  );

  // 게시글 좋아요 뮤테이션
  const {
    mutate: likeBoardMutation,
    isLoading: likeBoardLoading,
    error: likeBoardError
  } = useMutation(
    'like-board',
    (data) => boardAPI.likeBoard(data.boardSeq, data.likeType),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          refetchBoardDetail();
        } else {
          displayToast('좋아요 처리 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('좋아요 처리 실패:', error);
        displayToast('좋아요 처리 실패: ' + error.message);
      },
      invalidateQueries: [['board-detail']]
    }
  );

  // 댓글 좋아요 뮤테이션
  const {
    mutate: likeCommentMutation,
    isLoading: likeCommentLoading,
    error: likeCommentError
  } = useMutation(
    'like-comment',
    (data) => boardAPI.likeComment(data.commentSeq, data.likeType),
    {
      onSuccess: (response) => {
        if (response && response.success) {
          refetchCommentList();
        } else {
          displayToast('좋아요 처리 실패: ' + (response?.message || '알 수 없는 오류'));
        }
      },
      onError: (error) => {
        console.error('좋아요 처리 실패:', error);
        displayToast('좋아요 처리 실패: ' + error.message);
      },
      invalidateQueries: [['comment-list']]
    }
  );

  // 데이터 설정
  useEffect(() => {
    if (boardListData?.success) {
      setBoards(boardListData.content);
      setTotalPages(boardListData.totalPages || 1);
    } else if (boardListData && !boardListData.success) {
      displayToast('게시글 목록 조회 실패: ' + boardListData.message);
    }
  }, [boardListData]);

  useEffect(() => {
    if (boardDetailData?.success) {
      // 백엔드에서 전달받은 isAuthor 정보를 게시글 데이터에 추가
      const boardData = {
        ...boardDetailData.data,
        isAuthor: boardDetailData.isAuthor || false
      };
      setSelectedBoard(boardData);
      setShowDetailModal(true);
    } else if (boardDetailData && !boardDetailData.success) {
      displayToast('게시글 조회 실패: ' + (boardDetailData?.message || '알 수 없는 오류'));
    }
  }, [boardDetailData]);

  useEffect(() => {
    if (commentListData?.success) {
      // 다양한 응답 구조 대응
      const commentData = commentListData.data || commentListData.content || commentListData || [];

      // 댓글을 계층 구조로 정렬
      const sortedComments = sortCommentsByHierarchy(Array.isArray(commentData) ? commentData : []);
      setComments(sortedComments);
    } else if (commentListData && !commentListData.success) {
      console.error('댓글 목록 조회 실패:', commentListData?.message || '알 수 없는 오류');
      setComments([]);
    }
  }, [commentListData]);

  // 페이지 로드 시 게시글 목록 조회
  useEffect(() => {
    // Query will automatically refetch when parameters change
  }, [currentPage, searchType, searchKeyword, categoryFilter, sortBy]);

  // 게시글 상세 조회
  const showBoardDetail = (boardSeq) => {
    setSelectedBoard({ seq: boardSeq });
  };

  // 게시글 등록
  const submitBoard = () => {
    createBoardMutation(boardForm);
  };

  // 댓글 등록
  const submitComment = () => {
    if (!selectedBoard) return;

    const commentData = {
      boardSeq: selectedBoard.seq,
      cntn: commentForm.cntn,
      parentSeq: currentReplyTo
    };

    createCommentMutation(commentData);
  };

  // 답글 등록
  const submitReply = (commentSeq) => {
    if (!selectedBoard || !replyFormData[commentSeq]) return;

    const commentData = {
      boardSeq: selectedBoard.seq,
      cntn: replyFormData[commentSeq],
      parentSeq: commentSeq
    };

    createCommentMutation(commentData);
  };

  // 댓글 좋아요/싫어요
  const likeComment = (commentSeq, likeType) => {
    likeCommentMutation({ commentSeq, likeType });
  };

  // 댓글 수정
  const updateComment = () => {
    if (!editingComment) return;

    const updateData = {
      cntn: commentForm.cntn
    };

    updateCommentMutation({
      commentSeq: editingComment.seq,
      updateData
    });
  };

  // 댓글 삭제
  const deleteComment = (commentSeq) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    deleteCommentMutation(commentSeq);
  };

  // 게시글 좋아요/싫어요
  const likeBoard = (boardSeq, likeType) => {
    likeBoardMutation({ boardSeq, likeType });
  };

  // 게시글 수정
  const updateBoard = () => {
    if (!selectedBoard) return;

    const updateData = {
      ...boardForm
    };

    updateBoardMutation({
      boardSeq: selectedBoard.seq,
      boardData: updateData
    });
  };

  // 게시글 삭제
  const deleteBoard = (boardSeq) => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    deleteBoardMutation(boardSeq);
  };

  // 파일 업로드 처리 (게시글용)
  const handleFileUploadForBoard = async (boardSeq, filesToUpload) => {
    try {
      const filesToUploadArray = filesToUpload.map(file => file.file);
      const uploadedFiles = await handleFileUpload(boardSeq, filesToUploadArray);

      // 이미지 텍스트 링크 정보 업데이트
      if (uploadedFiles && uploadedFiles.length > 0) {
        for (let i = 0; i < uploadedFiles.length; i++) {
          const uploadedFile = uploadedFiles[i];
          const originalFile = filesToUpload[i];
          const links = originalFile.links || [];

          if (links && links.length > 0) {
            const linkData = {
              links: JSON.stringify(links)
            };
            await boardAPI.updateFileLinks(uploadedFile.fileSeq, linkData);
          }
        }
      }
    } catch (fileError) {
      console.error('파일 업로드 실패:', fileError);
      displayToast('게시글은 등록되었지만 파일 업로드에 실패했습니다.');
    }
  };

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

  // 로딩 상태 통합
  const loading = boardListLoading || boardDetailLoading || commentListLoading ||
                 createBoardLoading || updateBoardLoading || deleteBoardLoading ||
                 createCommentLoading || updateCommentLoading || deleteCommentLoading ||
                 likeBoardLoading || likeCommentLoading;

  // 댓글을 계층 구조로 정렬하는 함수
  const sortCommentsByHierarchy = (comments) => {
    if (!Array.isArray(comments) || comments.length === 0) {
      return [];
    }

    console.log('=== 계층 구조 정렬 시작 ===');
    console.log('원본 댓글 데이터:', comments);

    // 댓글을 부모-자식 관계로 그룹화
    const commentMap = new Map();
    const rootComments = [];

    // 모든 댓글을 Map에 저장
    comments.forEach(comment => {
      const commentId = comment.seq || comment.id;
      commentMap.set(commentId, { ...comment, children: [] });
      console.log(`댓글 ${commentId} Map에 저장:`, {
        seq: comment.seq,
        parentSeq: comment.parentSeq,
        depth: comment.depth,
        cntn: comment.cntn?.substring(0, 20) + '...'
      });
    });

    // 부모-자식 관계 설정
    comments.forEach(comment => {
      const commentId = comment.seq || comment.id;
      const parentId = comment.parentSeq || comment.parentId;

      console.log(`댓글 ${commentId} 처리:`, {
        commentId,
        parentId,
        hasParent: !!parentId,
        parentExists: parentId ? commentMap.has(parentId) : false
      });

      if (parentId && commentMap.has(parentId)) {
        // 답글인 경우 부모 댓글의 children에 추가
        commentMap.get(parentId).children.push(commentMap.get(commentId));
        console.log(`댓글 ${commentId}를 부모 ${parentId}의 children에 추가`);
      } else {
        // 최상위 댓글인 경우 rootComments에 추가
        rootComments.push(commentMap.get(commentId));
        console.log(`댓글 ${commentId}를 rootComments에 추가`);
      }
    });

    console.log('rootComments:', rootComments);
    console.log('commentMap:', commentMap);

    // 계층 구조를 평면 배열로 변환 (DFS)
    const flattenComments = [];
    const flattenHierarchy = (commentList, depth = 0) => {
      commentList.forEach(comment => {
        // depth 정보 추가
        const commentWithDepth = { ...comment, depth };
        flattenComments.push(commentWithDepth);
        console.log(`평면화: 댓글 ${comment.seq} depth=${depth} 추가`);

        // 자식 댓글이 있으면 재귀적으로 처리
        if (comment.children && comment.children.length > 0) {
          console.log(`댓글 ${comment.seq}의 children ${comment.children.length}개 처리`);
          flattenHierarchy(comment.children, depth + 1);
        }
      });
    };

    flattenHierarchy(rootComments);
    console.log('최종 정렬된 댓글:', flattenComments);
    console.log('=== 계층 구조 정렬 완료 ===');

    return flattenComments;
  };

  // 폼 초기화
  const resetBoardForm = () => {
    setBoardForm({
      ttl: '',
      cntn: '',
      categoryCd: '',
      noticeYn: 'N'
    });
  };

  // 글쓰기 모달 초기화 함수
  const resetWriteModal = () => {
    setShowWriteModal(false);
    resetBoardForm();
    // 글쓰기 모달 파일 상태 초기화
    setWriteModalFiles([]);
    setWriteModalFileLinks({});
    setWriteModalFileErrors({});
    setWriteModalUploadingFiles(false);
    setWriteModalShowPreviewModal(false);
    setWriteModalShowTextModal(false);
    setWriteModalSelectedImageFile(null);
    // 이미지 텍스트 입력 ref 초기화
    if (writeModalImageTextInputRef.current) {
      writeModalImageTextInputRef.current.value = '';
    }
  };

  // 수정 모달 초기화 함수
  const resetEditModal = () => {
    setShowEditModal(false);
    setIsEditMode(false);
    resetBoardForm();
    // 수정 모달 파일 상태 초기화
    setEditModalFiles([]);
    setEditModalFileLinks({});
    setEditModalFileErrors({});
    setEditModalUploadingFiles(false);
    setEditModalShowPreviewModal(false);
    setEditModalShowTextModal(false);
    setEditModalSelectedImageFile(null);
    // 이미지 텍스트 입력 ref 초기화
    if (editModalImageTextInputRef.current) {
      editModalImageTextInputRef.current.value = '';
    }
  };

  const resetCommentForm = () => {
    setCommentForm({
      cntn: ''
    });
    setCurrentReplyTo(null);
  };

  // 답글 모드 활성화
  const showReplyForm = (commentSeq) => {
    setCurrentReplyTo(commentSeq);
    // 해당 댓글의 답글 입력란 초기화
    setReplyFormData(prev => ({
      ...prev,
      [commentSeq]: ''
    }));
  };

  // 답글 모드 취소
  const cancelReply = (commentSeq) => {
    setCurrentReplyTo(null);
    // 해당 댓글의 답글 입력란 제거
    setReplyFormData(prev => {
      const newData = { ...prev };
      delete newData[commentSeq];
      return newData;
    });
  };

  // 답글 대상 댓글 찾기
  const getReplyTargetComment = () => {
    if (!currentReplyTo) return null;
    return comments.find(comment => comment.seq === currentReplyTo);
  };

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(1);
    refetchBoardList();
  };

  // 검색 초기화
  const resetSearch = () => {
    setSearchType('');
    setSearchKeyword('');
    setCategoryFilter('');
    setSortBy('regDate');
    setCurrentPage(1);
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 카테고리 이름 반환
  const getCategoryName = (categoryCd) => {
    if (!categoryCd || categoryCd === '') {
      return '미지정';
    }
    const category = categoryOptions.find(cat => cat.value === categoryCd);
    return category ? category.label : categoryCd;
  };

  // 파일 목록 조회
  const loadFiles = async (boardSeq) => {
    try {
      const result = await boardAPI.getFiles(boardSeq);
      if (result && result.success) {
        const fileList = result.data || [];
        setFiles(fileList);

        // 각 파일의 링크 정보 조회
        const linkPromises = fileList.map(async (file) => {
          try {
            const linkResult = await boardAPI.getFileLinks(file.fileSeq);
            if (linkResult && linkResult.success && linkResult.data && linkResult.data.imageLinks) {
              const links = JSON.parse(linkResult.data.imageLinks || '[]');
              return {
                fileSeq: file.fileSeq,
                links: links
              };
            }
          } catch (error) {
            console.error(`파일 ${file.fileSeq} 링크 정보 조회 실패:`, error);
          }
          return null;
        });

        const linkResults = await Promise.all(linkPromises);
        const newFileLinks = {};
        linkResults.forEach(result => {
          if (result && result.links) {
            newFileLinks[result.fileSeq] = result.links;
          }
        });
        setFileLinks(newFileLinks);

        // 파일 목록이 변경되면 오류 상태 초기화
        setFileErrors({});
      } else {
        setFiles([]);
        setFileLinks({});
      }
    } catch (error) {
      console.error('파일 목록 조회 실패:', error);
      setFiles([]);
      setFileLinks({});
    }
  };

  // 파일 업로드
  const handleFileUpload = async (boardSeq, selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    // 파일 크기 체크 (50MB = 52428800 bytes)
    const maxFileSize = 52428800;
    const oversizedFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size > maxFileSize) {
        oversizedFiles.push(selectedFiles[i].name);
      }
    }

    if (oversizedFiles.length > 0) {
      displayToast(`파일 크기 초과: ${oversizedFiles.join(', ')} (최대 50MB)`);
      return;
    }

    setUploadingFiles(true);
    try {
      const result = await boardAPI.uploadFiles(boardSeq, selectedFiles);
      if (result && result.success) {
        displayToast('파일이 성공적으로 업로드되었습니다.');
        // 백엔드에서 반환된 업로드된 파일 정보를 직접 사용
        const uploadedFiles = result.data || [];
        console.log('백엔드에서 반환된 업로드된 파일:', uploadedFiles);

        // 파일 목록 재조회
        console.log('파일 업로드 후 목록 재조회 시작');
        await loadFiles(boardSeq);
        console.log('파일 업로드 후 목록 재조회 완료');

        return uploadedFiles;
      } else {
        displayToast('파일 업로드 실패: ' + (result?.message || '알 수 없는 오류'));
        return null;
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      displayToast('파일 업로드 실패: ' + error.message);
      return null;
    } finally {
      setUploadingFiles(false);
    }
  };

  // 파일 다운로드
  const handleFileDownload = async (fileSeq, fileName) => {
    try {
      const response = await boardAPI.downloadFile(fileSeq);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      displayToast('파일 다운로드가 시작되었습니다.');
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      displayToast('파일 다운로드 실패: ' + error.message);
    }
  };

  // 파일 삭제
  const handleFileDelete = async (fileSeq) => {
    if (!window.confirm('정말로 이 파일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await boardAPI.deleteFile(fileSeq);
      if (result && result.success) {
        displayToast('파일이 삭제되었습니다.');
        loadFiles(selectedBoard.seq);
      } else {
        displayToast('파일 삭제 실패: ' + (result?.message || '알 수 없는 오류'));
      }
    } catch (error) {
      displayToast('파일 삭제 실패: ' + error.message);
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

  // 파일 크기 제한 체크 (50MB)
  const checkFileSize = (file) => {
    const maxSize = 52428800; // 50MB
    return file.size <= maxSize;
  };

  // 파일 로드 오류 처리
  const handleFileError = (fileSeq) => {
    setFileErrors(prev => ({
      ...prev,
      [fileSeq]: true
    }));
  };

  // 파일 타입에 따른 아이콘 반환
  const getFileIcon = (fileType) => {
    if (fileType && fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    if (fileType && fileType.startsWith('video/')) {
      return <Video className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  // 안전한 toast 표시 함수
  const displayToast = (message) => {
    toast.callCommonToastOpen(message);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 링크 텍스트에서 이스케이프된 줄바꿈을 <br/> 태그로 변환
  const formatLinkText = (text) => {
    if (!text) return '';
    return text.replace(/\\n/g, '<br/>');
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 border rounded ${page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // 이미지 텍스트 추가 모달 상태
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const imageTextInputRef = useRef(null);

  // 이미지 텍스트 추가 처리
  // 글쓰기 모달용 파일 업로드 처리
  const handleWriteModalFileUpload = async (selectedFiles) => {
    // null, undefined, 또는 빈 값 체크
    if (!selectedFiles) {
      return;
    }

    // FileList를 Array로 변환
    const filesArray = Array.from(selectedFiles || []);

    if (!filesArray || filesArray.length === 0) return;

    // 파일 크기 체크 (50MB = 52428800 bytes)
    const maxFileSize = 52428800;
    const oversizedFiles = [];

    for (let i = 0; i < filesArray.length; i++) {
      if (filesArray[i].size > maxFileSize) {
        oversizedFiles.push(filesArray[i].name);
      }
    }

    if (oversizedFiles.length > 0) {
      displayToast(`파일 크기 초과: ${oversizedFiles.join(', ')} (최대 50MB)`);
      return;
    }

    setWriteModalUploadingFiles(true);
    try {
      // 임시로 파일 정보를 로컬에 저장 (실제 업로드는 게시글 등록 시)
      const tempFiles = filesArray.map((file, index) => ({
        fileSeq: `temp_${Date.now()}_${index}`,
        originalFileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        file: file // 실제 File 객체 저장
      }));

      setWriteModalFiles(prev => [...prev, ...tempFiles]);
      displayToast('파일이 추가되었습니다. (게시글 등록 시 업로드됩니다)');
    } catch (error) {
      console.error('파일 추가 실패:', error);
      displayToast('파일 추가 실패: ' + error.message);
    } finally {
      setWriteModalUploadingFiles(false);
    }
  };

  // 글쓰기 모달용 파일 삭제
  const handleWriteModalFileDelete = (fileSeq) => {
    setWriteModalFiles(prev => prev.filter(file => file.fileSeq !== fileSeq));
    setWriteModalFileLinks(prev => {
      const newLinks = { ...prev };
      delete newLinks[fileSeq];
      return newLinks;
    });
    displayToast('파일이 제거되었습니다.');
  };

  // 글쓰기 모달용 이미지 텍스트 처리
  // 수정 모달용 파일 업로드 처리
  const handleEditModalFileUpload = async (selectedFiles) => {
    // null, undefined, 또는 빈 값 체크
    if (!selectedFiles) {
      return;
    }

    // FileList를 Array로 변환
    const filesArray = Array.from(selectedFiles || []);

    if (!filesArray || filesArray.length === 0) return;

    // 파일 크기 체크 (50MB = 52428800 bytes)
    const maxFileSize = 52428800;
    const oversizedFiles = [];

    for (let i = 0; i < filesArray.length; i++) {
      if (filesArray[i].size > maxFileSize) {
        oversizedFiles.push(filesArray[i].name);
      }
    }

    if (oversizedFiles.length > 0) {
      displayToast(`파일 크기 초과: ${oversizedFiles.join(', ')} (최대 50MB)`);
      return;
    }

    setEditModalUploadingFiles(true);
    try {
      // 임시로 파일 정보를 로컬에 저장 (실제 업로드는 게시글 수정 시)
      const tempFiles = filesArray.map((file, index) => ({
        fileSeq: `temp_${Date.now()}_${index}`,
        originalFileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        file: file // 실제 File 객체 저장
      }));

      setEditModalFiles(prev => [...prev, ...tempFiles]);
      displayToast('파일이 추가되었습니다. (게시글 수정 시 업로드됩니다)');
    } catch (error) {
      console.error('파일 추가 실패:', error);
      displayToast('파일 추가 실패: ' + error.message);
    } finally {
      setEditModalUploadingFiles(false);
    }
  };

  // 수정 모달용 파일 삭제
  const handleEditModalFileDelete = (fileSeq) => {
    setEditModalFiles(prev => prev.filter(file => file.fileSeq !== fileSeq));
    setEditModalFileLinks(prev => {
      const newLinks = { ...prev };
      delete newLinks[fileSeq];
      return newLinks;
    });
    displayToast('파일이 제거되었습니다.');
  };

  // 수정 모달용 이미지 텍스트 처리
  const handleEditModalImageTextConfirm = async (result) => {
    console.log('Edit modal - Received result:', result);

    if (!result || typeof result !== 'object') {
      console.error('Invalid result:', result);
      displayToast('이미지 처리 중 오류가 발생했습니다.');
      return;
    }

    const { imageFile, links } = result;

    if (!imageFile || !(imageFile instanceof File)) {
      console.error('Invalid image file:', imageFile);
      displayToast('이미지 처리 중 오류가 발생했습니다.');
      return;
    }

    // 임시 파일로 저장
    const tempFile = {
      fileSeq: `temp_${Date.now()}_image`,
      originalFileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type,
      file: imageFile,
      links: Array.isArray(links) ? links : []
    };

    setEditModalFiles(prev => [...prev, tempFile]);
    setEditModalFileLinks(prev => ({
      ...prev,
      [tempFile.fileSeq]: tempFile.links
    }));

    displayToast('이미지에 텍스트와 링크가 추가되었습니다.');
    setEditModalShowTextModal(false);
    setEditModalSelectedImageFile(null);

    if (editModalImageTextInputRef.current) {
      editModalImageTextInputRef.current.value = '';
    }
  };

  const handleWriteModalImageTextConfirm = async (result) => {
    console.log('Write modal - Received result:', result);

    if (!result || typeof result !== 'object') {
      console.error('Invalid result:', result);
      displayToast('이미지 처리 중 오류가 발생했습니다.');
      return;
    }

    const { imageFile, links } = result;

    if (!imageFile || !(imageFile instanceof File)) {
      console.error('Invalid image file:', imageFile);
      displayToast('이미지 처리 중 오류가 발생했습니다.');
      return;
    }

    // 임시 파일로 저장
    const tempFile = {
      fileSeq: `temp_${Date.now()}_image`,
      originalFileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type,
      file: imageFile,
      links: Array.isArray(links) ? links : []
    };

    setWriteModalFiles(prev => [...prev, tempFile]);
    setWriteModalFileLinks(prev => ({
      ...prev,
      [tempFile.fileSeq]: tempFile.links
    }));

    displayToast('이미지에 텍스트와 링크가 추가되었습니다.');
    setWriteModalShowTextModal(false);
    setWriteModalSelectedImageFile(null);

    if (writeModalImageTextInputRef.current) {
      writeModalImageTextInputRef.current.value = '';
    }
  };

  const handleImageTextConfirm = async (result) => {
    console.log('Received result:', result);
    console.log('Result type:', typeof result);
    console.log('Result keys:', result ? Object.keys(result) : 'null');

    // result가 객체인지 확인
    if (!result || typeof result !== 'object') {
      console.error('Invalid result:', result);
      displayToast('이미지 처리 중 오류가 발생했습니다.');
      return;
    }

    if (selectedBoard) {
      // result는 { imageFile, links } 형태
      const { imageFile, links } = result;

      console.log('Extracted imageFile:', imageFile);
      console.log('Extracted links:', links);
      console.log('Links type:', typeof links);
      console.log('Links length:', links ? links.length : 'null');
      console.log('Links content:', JSON.stringify(links, null, 2));
      console.log('Links isArray:', Array.isArray(links));
      console.log('Links isTruthy:', !!links);

      // imageFile이 유효한지 확인
      if (!imageFile || !(imageFile instanceof File)) {
        console.error('Invalid image file:', imageFile);
        displayToast('이미지 처리 중 오류가 발생했습니다.');
        return;
      }

      // 이미지 파일 업로드
      const uploadedFiles = await handleFileUpload(selectedBoard.seq, [imageFile]);

      // 링크 정보가 있으면 DB에 저장 (빈 배열도 저장)
      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[0];

        try {
          // 신규 업로드이므로 기존 링크는 없음, 새 링크만 사용
          const updatedLinks = Array.isArray(links) && links.length > 0 ? links : [];

          console.log('신규 업로드 - 새 링크만 사용');
          console.log('updatedLinks:', updatedLinks);
          console.log('updatedLinks length:', updatedLinks.length);

          // 링크 정보를 DB에 저장
          const linkData = {
            links: JSON.stringify(updatedLinks)
          };

          console.log('Sending linkData to API:', linkData);
          console.log('uploadedFile.fileSeq:', uploadedFile.fileSeq);

          const linkResult = await boardAPI.updateFileLinks(uploadedFile.fileSeq, linkData);

          if (linkResult && linkResult.success) {
            // 로컬 상태도 업데이트
            setFileLinks(prev => ({
              ...prev,
              [uploadedFile.fileSeq]: updatedLinks
            }));
            displayToast('이미지에 텍스트와 링크가 추가되었습니다.');
          } else {
            displayToast('이미지에 텍스트가 추가되었지만 링크 저장에 실패했습니다.');
          }
        } catch (error) {
          console.error('링크 정보 저장 실패:', error);
          displayToast('이미지에 텍스트가 추가되었지만 링크 저장에 실패했습니다.');
        }
      } else {
        displayToast('이미지에 텍스트가 추가되었습니다.');
      }

      // 파일 목록 재조회
      if (selectedBoard) {
        console.log('파일 목록 재조회 시작');
        await loadFiles(selectedBoard.seq);
        console.log('파일 목록 재조회 완료');
      }
    }
    setShowTextModal(false);
    setSelectedImageFile(null);

    // 파일 input 초기화
    if (imageTextInputRef.current) {
      imageTextInputRef.current.value = '';
    }

    // 모달 상태 완전 초기화를 위한 지연 처리
    setTimeout(() => {
      setShowTextModal(false);
      setSelectedImageFile(null);
      if (imageTextInputRef.current) {
        imageTextInputRef.current.value = '';
      }
    }, 100);
  };

  return (
    <PageWrapper
      title="직원권익게시판"
      subtitle="직원들의 의견과 건의사항을 자유롭게 나누는 공간입니다"
      showCard={false}
    >
      {/* 페이지 헤더 */}
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-2">📢 직원권익게시판</h1>
        <p className="text-lg opacity-90">직원들의 의견과 건의사항을 자유롭게 나누는 공간입니다</p>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔍 게시글 검색</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색 유형</label>
            <CmpSelect
              value={searchType}
              onChange={setSearchType}
              options={searchTypeOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색어</label>
            <CmpInput
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <CmpSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정렬</label>
            <CmpSelect
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              검색
            </button>
            <button
              onClick={resetSearch}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">📋 게시글 목록</h2>
          <button
            onClick={() => setShowWriteModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <PenTool className="w-4 h-4" />
            글쓰기
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">게시글을 불러오는 중...</p>
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 게시글이 없습니다</h3>
            <p className="text-gray-600">첫 번째 게시글을 작성해보세요!</p>
          </div>
        ) : (
          <div>
            {boards.map((board) => (
              <div
                key={board.seq}
                onClick={() => showBoardDetail(board.seq)}
                className="p-6 border-b hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.01]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {board.noticeYn === 'Y' && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">공지</span>
                      )}

                      <span className={`px-2 py-1 text-xs rounded-full ${!board.categoryCd || board.categoryCd === '' ? 'bg-gray-100 text-gray-800' :
                          board.categoryCd === 'GENERAL' ? 'bg-blue-100 text-blue-800' :
                            board.categoryCd === 'COMPLAINT' ? 'bg-red-100 text-red-800' :
                              board.categoryCd === 'SUGGESTION' ? 'bg-green-100 text-green-800' :
                                'bg-orange-100 text-orange-800'
                        }`}>
                        {getCategoryName(board.categoryCd)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{board.ttl}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {board.regEmpNm || board.regEmpId}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(board.regDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {board.viewCnt}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {board.likeCnt}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {board.commentCount || 0}
                      </span>
                      {board.fileCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-4 h-4" />
                          {board.fileCount}
                        </span>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && <Pagination />}

      {/* 게시글 작성 모달 */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">✍️ 게시글 작성</h2>
              <button
                onClick={resetWriteModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <CmpInput
                  value={boardForm.ttl}
                  onChange={(e) => setBoardForm({ ...boardForm, ttl: e.target.value })}
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                <CmpTextarea
                  value={boardForm.cntn}
                  onChange={(e) => setBoardForm({ ...boardForm, cntn: e.target.value })}
                  rows={10}
                  placeholder="내용을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
                  <CmpSelect
                    value={boardForm.categoryCd}
                    onChange={(value) => setBoardForm({ ...boardForm, categoryCd: value })}
                    options={boardCategoryOptions}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">옵션</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={boardForm.noticeYn === 'Y'}
                        onChange={(e) => setBoardForm({ ...boardForm, noticeYn: e.target.checked ? 'Y' : 'N' })}
                        className="mr-2"
                      />
                      공지글
                    </label>
                  </div>
                </div>
              </div>

              {/* 파일 업로드 섹션 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
                <div className="space-y-3">
                  {/* 파일 업로드 버튼들 */}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      파일 업로드
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleWriteModalFileUpload(e.target.files)}
                        className="hidden"
                        accept="*/*"
                      />
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Image className="w-4 h-4" />
                      이미지 텍스트 추가
                      <input
                        type="file"
                        ref={writeModalImageTextInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setWriteModalSelectedImageFile(e.target.files[0]);
                            setWriteModalShowTextModal(true);
                          }
                        }}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>

                  {/* 업로드 중 표시 */}
                  {writeModalUploadingFiles && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      파일 처리 중...
                    </div>
                  )}

                  {/* 파일 목록 */}
                  {writeModalFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">첨부된 파일 ({writeModalFiles.length}개)</h4>
                      <div className="space-y-2">
                        {writeModalFiles.map((file) => (
                          <div key={file.fileSeq} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.fileType)}
                              <span className="text-sm text-gray-700">{file.originalFileName}</span>
                              <span className="text-xs text-gray-500">({formatFileSize(file.fileSize)})</span>
                              {writeModalFileLinks[file.fileSeq] && writeModalFileLinks[file.fileSeq].length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">텍스트 추가됨</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleWriteModalFileDelete(file.fileSeq)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={resetWriteModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={submitBoard}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">✏️ 게시글 수정</h2>
              <button
                onClick={resetEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <CmpInput
                  value={boardForm.ttl}
                  onChange={(e) => setBoardForm({ ...boardForm, ttl: e.target.value })}
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                <CmpTextarea
                  value={boardForm.cntn}
                  onChange={(e) => setBoardForm({ ...boardForm, cntn: e.target.value })}
                  rows={10}
                  placeholder="내용을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
                  <CmpSelect
                    value={boardForm.categoryCd}
                    onChange={(value) => setBoardForm({ ...boardForm, categoryCd: value })}
                    options={boardCategoryOptions}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">옵션</label>
                  <div className="space-y-2">

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={boardForm.noticeYn === 'Y'}
                        onChange={(e) => setBoardForm({ ...boardForm, noticeYn: e.target.checked ? 'Y' : 'N' })}
                        className="mr-2"
                      />
                      공지글
                    </label>
                  </div>
                </div>
              </div>

              {/* 파일 업로드 섹션 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
                <div className="space-y-3">
                  {/* 파일 업로드 버튼들 */}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      파일 업로드
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleEditModalFileUpload(e.target.files)}
                        className="hidden"
                        accept="*/*"
                      />
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Image className="w-4 h-4" />
                      이미지 텍스트 추가
                      <input
                        type="file"
                        ref={editModalImageTextInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setEditModalSelectedImageFile(e.target.files[0]);
                            setEditModalShowTextModal(true);
                          }
                        }}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>

                  {/* 업로드 중 표시 */}
                  {editModalUploadingFiles && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      파일 처리 중...
                    </div>
                  )}

                  {/* 파일 목록 */}
                  {editModalFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">첨부된 파일 ({editModalFiles.length}개)</h4>
                      <div className="space-y-2">
                        {editModalFiles.map((file) => (
                          <div key={file.fileSeq} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.fileType)}
                              <span className="text-sm text-gray-700">{file.originalFileName}</span>
                              <span className="text-xs text-gray-500">({formatFileSize(file.fileSize)})</span>
                              {editModalFileLinks[file.fileSeq] && editModalFileLinks[file.fileSeq].length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">텍스트 추가됨</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleEditModalFileDelete(file.fileSeq)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={resetEditModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={updateBoard}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 댓글 수정 모달 */}
      {showCommentEditModal && editingComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">✏️ 댓글 수정</h2>
              <button
                onClick={() => {
                  setShowCommentEditModal(false);
                  setEditingComment(null);
                  resetCommentForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">댓글 내용 *</label>
                <CmpTextarea
                  value={commentForm.cntn}
                  onChange={(e) => setCommentForm({ ...commentForm, cntn: e.target.value })}
                  rows={5}
                  placeholder="댓글 내용을 입력하세요"
                  style={{ minHeight: '100px', height: 'auto' }}
                  className="!min-h-[100px] !h-auto resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowCommentEditModal(false);
                    setEditingComment(null);
                    resetCommentForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={updateComment}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 상세 모달 */}
      {showDetailModal && selectedBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">📄 게시글 상세</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 게시글 내용 */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${!selectedBoard.categoryCd || selectedBoard.categoryCd === '' ? 'bg-gray-100 text-gray-800' :
                    selectedBoard.categoryCd === 'GENERAL' ? 'bg-blue-100 text-blue-800' :
                      selectedBoard.categoryCd === 'COMPLAINT' ? 'bg-red-100 text-red-800' :
                        selectedBoard.categoryCd === 'SUGGESTION' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                  }`}>
                  {getCategoryName(selectedBoard.categoryCd)}
                </span>
                {selectedBoard.noticeYn === 'Y' && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">공지</span>
                )}

              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 break-words">{selectedBoard.ttl}</h3>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedBoard.regEmpNm || selectedBoard.regEmpId}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedBoard.regDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  조회 {selectedBoard.viewCnt}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  좋아요 {selectedBoard.likeCnt}
                </span>

              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="whitespace-pre-wrap leading-relaxed">{selectedBoard.cntn}</div>
              </div>

              {/* 첨부파일 섹션 */}
              <div className="mt-4">
                <h4 className="text-base sm:text-lg font-semibold mb-3">📎 첨부파일</h4>

                {/* 파일 업로드 (작성자만) */}
                {isAuthor(selectedBoard.regEmpId, selectedBoard.isAuthor) && (
                  <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(selectedBoard.seq, e.target.files)}
                        disabled={uploadingFiles}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingFiles ? '업로드 중...' : '파일 선택'}
                      </label>

                      {/* 이미지 텍스트 추가 버튼 */}
                      <input
                        ref={imageTextInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedImageFile(e.target.files[0]);
                            setShowTextModal(true);
                          }
                          // input value 초기화 (같은 파일 재선택 가능하도록)
                          e.target.value = '';
                        }}
                        className="hidden"
                        id="image-text-upload"
                      />
                      <label
                        htmlFor="image-text-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                      >
                        <PenTool className="w-4 h-4" />
                        이미지에 텍스트 추가
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      이미지, PDF, 문서, 동영상 파일 업로드 가능 (최대 50MB)
                    </p>
                  </div>
                )}

                {/* 파일 목록 */}
                {files.length > 0 ? (
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div key={file.fileSeq} className="border rounded-lg overflow-hidden">
                        {/* 파일 정보 헤더 */}
                        <div className="flex items-center justify-between p-3 bg-gray-100">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.fileType)}
                            <div>
                              <div className="font-medium text-gray-900">{file.originalFileName}</div>
                              <div className="text-sm text-gray-500">
                                {formatFileSize(file.fileSize)} • 다운로드 {file.downloadCnt}회
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFileDownload(file.fileSeq, file.originalFileName)}
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              다운로드
                            </button>
                            {isAuthor(selectedBoard.regEmpId, selectedBoard.isAuthor) && (
                              <button
                                onClick={() => handleFileDelete(file.fileSeq)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                삭제
                              </button>
                            )}
                          </div>
                        </div>

                        {/* 파일 미리보기 */}
                        <div className="p-3">
                          {file.fileType && file.fileType.startsWith('image/') ? (
                            <div className="flex justify-center relative">
                              {!fileErrors[file.fileSeq] ? (
                                <>
                                  <img
                                    src={`/api/emp-rights-board/files/${file.fileSeq}/download`}
                                    alt={file.originalFileName}
                                    className="w-full h-auto max-w-full max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96 object-contain rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{ aspectRatio: 'auto' }}
                                    onClick={() => {
                                      setPreviewFile(file);
                                      setShowPreviewModal(true);
                                    }}
                                    onError={() => handleFileError(file.fileSeq)}
                                  />
                                  {/* 링크 오버레이 */}
                                  {fileLinks[file.fileSeq] && fileLinks[file.fileSeq].length > 0 && (
                                    <div className="absolute inset-0">
                                      {fileLinks[file.fileSeq].map((link, index) => {
                                        // 이미지 크기를 기준으로 위치 계산 (기본값: 800x600)
                                        const imgWidth = 800;
                                        const imgHeight = 600;

                                        return (
                                          <div
                                            key={link.id || index}
                                            className="absolute cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // 팝업으로 링크 열기
                                              const popup = window.open(
                                                link.url,
                                                'linkPopup',
                                                'width=800,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=yes,menubar=yes'
                                              );
                                              // 팝업이 차단된 경우 새 탭으로 열기
                                              if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                                                window.open(link.url, '_blank');
                                              }
                                            }}
                                            title={`클릭하여 링크 열기: ${link.url}`}
                                            style={{
                                              left: `${(link.position.x / imgWidth) * 100}%`,
                                              top: `${(link.position.y / imgHeight) * 100}%`,
                                              width: `${Math.max(link.position.width / imgWidth * 100, 5)}%`,
                                              height: `${Math.max(link.position.height / imgHeight * 100, 5)}%`,
                                              transform: 'translate(-50%, -50%)'
                                            }}
                                          >
                                            {/* 링크 영역 표시 */}
                                            <div className="absolute w-full h-full">
                                              <div
                                                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 text-center ${link.style?.outlineShape === 'circle' ? 'rounded-full' :
                                                    link.style?.outlineShape === 'diamond' ? 'transform rotate-45' :
                                                      link.style?.outlineShape === 'none' ? '' :
                                                        'rounded'
                                                  }`}
                                                style={{
                                                  fontSize: `${link.style?.fontSize || 20}px`,
                                                  fontFamily: link.style?.fontFamily || 'Malgun Gothic, sans-serif',
                                                  color: link.style?.color || '#ffffff',
                                                  backgroundColor: link.style?.outlineShape !== 'none' ? (link.style?.strokeColor || '#0066cc') : 'transparent',
                                                  maxWidth: '200px',
                                                  whiteSpace: 'pre-line',
                                                  wordBreak: 'keep-all',
                                                  padding: link.style?.outlineShape !== 'none' ? '4px 8px' : '0',
                                                  ...(link.style?.outlineShape === 'diamond' && {
                                                    transform: 'translate(-50%, -50%) rotate(45deg)',
                                                    width: 'fit-content',
                                                    minWidth: '60px'
                                                  }),

                                                }}
                                                dangerouslySetInnerHTML={{
                                                  __html: `${formatLinkText(link.text) || '링크'}`
                                                }}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-center text-gray-500 py-8">
                                  <FileText className="w-12 h-12 mx-auto mb-2" />
                                  <p>이미지를 불러올 수 없습니다.</p>
                                </div>
                              )}
                            </div>
                          ) : file.fileType && file.fileType.startsWith('video/') ? (
                            <div className="flex justify-center">
                              {!fileErrors[file.fileSeq] ? (
                                <div className="relative">
                                  <video
                                    className="w-full h-auto max-w-full max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{ aspectRatio: 'auto' }}
                                    controls
                                    preload="metadata"
                                    onClick={() => {
                                      setPreviewFile(file);
                                      setShowPreviewModal(true);
                                    }}
                                    onError={() => handleFileError(file.fileSeq)}
                                  >
                                    <source src={`/api/emp-rights-board/files/${file.fileSeq}/download`} type={file.fileType} />
                                    브라우저가 비디오를 지원하지 않습니다.
                                  </video>
                                </div>
                              ) : (
                                <div className="text-center text-gray-500 py-8">
                                  <Video className="w-12 h-12 mx-auto mb-2" />
                                  <p>동영상을 재생할 수 없습니다.</p>
                                  <button
                                    onClick={() => handleFileDownload(file.fileSeq, file.originalFileName)}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    파일 다운로드
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              <FileText className="w-12 h-12 mx-auto mb-2" />
                              <p>미리보기를 지원하지 않는 파일 형식입니다.</p>
                              <button
                                onClick={() => handleFileDownload(file.fileSeq, file.originalFileName)}
                                className="mt-2 px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                              >
                                파일 다운로드
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">첨부된 파일이 없습니다.</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => likeBoard(selectedBoard.seq, 'L')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  좋아요
                </button>

                {isAuthor(selectedBoard.regEmpId, selectedBoard.isAuthor) && (
                  <>
                    <button
                      onClick={() => openEditModal(selectedBoard)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      onClick={() => deleteBoard(selectedBoard.seq)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">💬 댓글</h4>

              {/* 댓글 목록 */}
              <div className="space-y-4 mb-6">
                {!comments || !Array.isArray(comments) || comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">등록된 댓글이 없습니다.</p>
                ) : (
                  comments.map((comment, index) => {
                    // 댓글 객체가 유효하지 않은 경우 건너뛰기
                    if (!comment || typeof comment !== 'object') {
                      return null;
                    }

                    const commentSeq = comment.seq || comment.id;
                    const isReplyMode = currentReplyTo === commentSeq;
                    const commentDepth = comment.depth || 0;

                    // 디버깅: 각 댓글의 parentSeq와 depth 정보 출력
                    console.log(`댓글 ${commentSeq}:`, {
                      seq: comment.seq,
                      id: comment.id,
                      parentSeq: comment.parentSeq,
                      parentId: comment.parentId,
                      depth: comment.depth,
                      cntn: comment.cntn?.substring(0, 20) + '...',
                      regEmpNm: comment.regEmpNm
                    });

                    return (
                      <div key={commentSeq || `comment-${index}`}>
                        <div
                          className="bg-gray-50 p-4 rounded-lg"
                          style={{ marginLeft: `${commentDepth * 20}px` }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              {commentDepth > 0 && (
                                <span className="text-blue-500 text-xs">↳</span>
                              )}
                              <span className="font-medium">{comment.regEmpNm || comment.regEmpId || '익명'}</span>
                              <span className="text-sm text-gray-500">{formatDate(comment.regDate)}</span>
                              {commentDepth > 0 && (
                                <span className="text-xs text-gray-400">답글</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => likeComment(commentSeq, 'L')}
                                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center gap-1"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                {comment.likeCnt || 0}
                              </button>

                              <button
                                onClick={() => showReplyForm(commentSeq)}
                                className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                              >
                                답글
                              </button>
                              {isAuthor(comment.regEmpId, comment.isAuthor) && (
                                <>
                                  <button
                                    onClick={() => openCommentEditModal(comment)}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 flex items-center gap-1"
                                  >
                                    <PenTool className="w-3 h-3" />
                                    수정
                                  </button>
                                  <button
                                    onClick={() => deleteComment(commentSeq)}
                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                                  >
                                    <X className="w-3 h-3" />
                                    삭제
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-gray-800 whitespace-pre-wrap">{comment.cntn}</div>
                        </div>

                        {/* 답글 입력란 */}
                        {isReplyMode && (
                          <div
                            className="bg-blue-50 p-4 rounded-lg mt-2"
                            style={{ marginLeft: `${(commentDepth + 1) * 20}px` }}
                          >
                            <div className="mb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-blue-800">답글 작성:</span>
                                  <span className="text-sm text-gray-600">
                                    {comment.regEmpNm || comment.regEmpId || '익명'}님의 댓글에 답글
                                  </span>
                                </div>
                                <button
                                  onClick={() => cancelReply(commentSeq)}
                                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  답글 취소
                                </button>
                              </div>
                            </div>
                            <div className="mb-3">
                              <CmpTextarea
                                value={replyFormData[commentSeq] || ''}
                                onChange={(e) => setReplyFormData(prev => ({
                                  ...prev,
                                  [commentSeq]: e.target.value
                                }))}
                                rows={3}
                                placeholder="답글을 입력하세요"
                                style={{ minHeight: '60px', height: 'auto' }}
                                className="!min-h-[60px] !h-auto resize-none"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => submitReply(commentSeq)}
                                disabled={!replyFormData[commentSeq] || replyFormData[commentSeq].trim() === ''}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                답글 등록
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* 댓글 작성 */}
              <div className="border-t pt-4">
                <div className="mb-4">
                  <CmpTextarea
                    value={commentForm.cntn}
                    onChange={(e) => setCommentForm({ ...commentForm, cntn: e.target.value })}
                    rows={3}
                    placeholder="댓글을 입력하세요"
                    style={{ minHeight: '60px', height: 'auto' }}
                    className="!min-h-[60px] !h-auto resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={submitComment}
                    disabled={!commentForm.cntn || commentForm.cntn.trim() === ''}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    댓글 등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 텍스트 추가 모달 */}
      <ImageTextModal
        isOpen={showTextModal}
        onClose={() => {
          setShowTextModal(false);
          setSelectedImageFile(null);
          // 파일 input 초기화
          if (imageTextInputRef.current) {
            imageTextInputRef.current.value = '';
          }
        }}
        imageFile={selectedImageFile}
        onConfirm={handleImageTextConfirm}
      />

      {/* 글쓰기 모달용 이미지 텍스트 추가 모달 */}
      <ImageTextModal
        isOpen={writeModalShowTextModal}
        onClose={() => {
          setWriteModalShowTextModal(false);
          setWriteModalSelectedImageFile(null);
          // 파일 input 초기화
          if (writeModalImageTextInputRef.current) {
            writeModalImageTextInputRef.current.value = '';
          }
        }}
        imageFile={writeModalSelectedImageFile}
        onConfirm={handleWriteModalImageTextConfirm}
      />

      {/* 수정 모달용 이미지 텍스트 추가 모달 */}
      <ImageTextModal
        isOpen={editModalShowTextModal}
        onClose={() => {
          setEditModalShowTextModal(false);
          setEditModalSelectedImageFile(null);
          // 파일 input 초기화
          if (editModalImageTextInputRef.current) {
            editModalImageTextInputRef.current.value = '';
          }
        }}
        imageFile={editModalSelectedImageFile}
        onConfirm={handleEditModalImageTextConfirm}
      />

      {/* 파일 미리보기 모달 */}
      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate flex-1 mr-2">{previewFile.originalFileName}</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-2 sm:p-3 md:p-4 max-h-[calc(90vh-120px)] overflow-auto">
              {previewFile.fileType && previewFile.fileType.startsWith('image/') ? (
                <div className="flex justify-center">
                  <img
                    src={`/api/emp-rights-board/files/${previewFile.fileSeq}/download`}
                    alt={previewFile.originalFileName}
                    className="w-full h-auto max-w-full max-h-[calc(90vh-200px)] sm:max-h-[calc(90vh-180px)] md:max-h-[calc(90vh-160px)] lg:max-h-[calc(90vh-140px)] object-contain"
                    style={{ aspectRatio: 'auto' }}
                  />
                </div>
              ) : previewFile.fileType && previewFile.fileType.startsWith('video/') ? (
                <div className="flex justify-center">
                  <video
                    controls
                    className="w-full h-auto max-w-full max-h-[calc(90vh-200px)] sm:max-h-[calc(90vh-180px)] md:max-h-[calc(90vh-160px)] lg:max-h-[calc(90vh-140px)]"
                    style={{ aspectRatio: 'auto' }}
                    autoPlay
                    preload="metadata"
                  >
                    <source src={`/api/emp-rights-board/files/${previewFile.fileSeq}/download`} type={previewFile.fileType} />
                    브라우저가 비디오를 지원하지 않습니다.
                  </video>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <p>미리보기를 지원하지 않는 파일 형식입니다.</p>
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-t bg-gray-50">
              <div className="text-xs sm:text-sm text-gray-600 truncate flex-1 mr-2">
                {formatFileSize(previewFile.fileSize)} • 다운로드 {previewFile.downloadCnt}회
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => handleFileDownload(previewFile.fileSeq, previewFile.originalFileName)}
                  className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">다운로드</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs sm:text-sm"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
