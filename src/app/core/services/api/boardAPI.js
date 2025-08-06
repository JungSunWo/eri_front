/**
 * @File Name      : boardAPI.js
 * @File path      : src/lib/api/boardAPI.js
 * @author         : 정선우
 * @Description    : 직원권익게시판 관련 API 함수들
 *                   - 게시글 목록 조회, 상세 조회, 등록, 수정, 삭제
 *                   - 댓글 목록 조회, 등록, 수정, 삭제
 *                   - 좋아요/싫어요 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from '../apiClient';

/**
 * 직원권익게시판 관련 API 함수들
 * - 게시글 목록 조회, 상세 조회, 등록, 수정, 삭제
 * - 댓글 목록 조회, 등록, 수정, 삭제
 * - 좋아요/싫어요 기능
 */
export const boardAPI = {
  // 게시글 목록 조회 (페이징/검색/필터링)
  getBoardList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/emp-rights-board?${query}`);
    return response.data;
  },

  // 게시글 상세 조회
  getBoardDetail: async (boardSeq) => {
    const response = await api.get(`/api/emp-rights-board/${boardSeq}`);
    return response.data;
  },

  // 게시글 등록
  createBoard: async (boardData) => {
    const response = await api.post('/api/emp-rights-board', boardData);
    return response.data;
  },

  // 게시글 수정
  updateBoard: async (boardSeq, boardData) => {
    const response = await api.put(`/api/emp-rights-board/${boardSeq}`, boardData);
    return response.data;
  },

  // 게시글 삭제
  deleteBoard: async (boardSeq) => {
    const response = await api.delete(`/api/emp-rights-board/${boardSeq}`);
    return response.data;
  },

  // 댓글 목록 조회
  getCommentList: async (boardSeq) => {
    const response = await api.get(`/api/emp-rights-comment/${boardSeq}`);
    return response.data;
  },

  // 댓글 등록
  createComment: async (commentData) => {
    const response = await api.post('/api/emp-rights-comment', commentData);
    return response.data;
  },

  // 댓글 수정
  updateComment: async (commentSeq, commentData) => {
    const response = await api.put(`/api/emp-rights-comment/${commentSeq}`, commentData);
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (commentSeq) => {
    const response = await api.delete(`/api/emp-rights-comment/${commentSeq}`);
    return response.data;
  },

  // 게시글 좋아요/싫어요
  likeBoard: async (boardSeq, likeType) => {
    const response = await api.post(`/api/emp-rights-like/board/${boardSeq}`, {
      likeType: likeType
    });
    return response.data;
  },

  // 댓글 좋아요/싫어요
  likeComment: async (commentSeq, likeType) => {
    const response = await api.post(`/api/emp-rights-like/comment/${commentSeq}`, {
      likeType: likeType
    });
    return response.data;
  },

  // 파일 업로드
  uploadFiles: async (boardSeq, files) => {
    const formData = new FormData();

    // files가 배열인지 확인하고 안전하게 처리
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append('files', file);
      });
    } else if (files && files.length > 0) {
      // FileList 객체인 경우
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
    } else {
      throw new Error('업로드할 파일이 없습니다.');
    }

    const response = await api.post(`/api/emp-rights-board/${boardSeq}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 게시글별 파일 목록 조회
  getFiles: async (boardSeq) => {
    const response = await api.get(`/api/emp-rights-board/${boardSeq}/files`);
    return response.data;
  },

  // 파일 다운로드
  downloadFile: async (fileSeq) => {
    const response = await api.get(`/api/emp-rights-board/files/${fileSeq}/download`, {
      responseType: 'blob',
    });
    return response;
  },

  // 파일 삭제
  deleteFile: async (fileSeq) => {
    const response = await api.delete(`/api/emp-rights-board/files/${fileSeq}`);
    return response.data;
  },

  // 파일 링크 정보 업데이트
  updateFileLinks: async (fileSeq, linkData) => {
    const response = await api.put(`/api/emp-rights-board/files/${fileSeq}/links`, linkData);
    return response.data;
  },

  // 파일 링크 정보 조회
  getFileLinks: async (fileSeq) => {
    const response = await api.get(`/api/emp-rights-board/files/${fileSeq}/links`);
    return response.data;
  }
};
