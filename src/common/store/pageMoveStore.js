/**
 * @File Name      : pageMoveStore.js
 * @File path      : src/common/store/pageMoveStore.js
 * @author         : 정선우
 * @Description    : 페이지 이동 상태 관리 스토어
 *                   - 페이지 이동, 새로고침, 뒤로가기 상태 관리
 *                   - 쿨다운 기능을 통한 중복 실행 방지
 *                   - Zustand를 사용한 전역 상태 관리
 * @History        : 20250701  최초 신규
 **/

import { create } from 'zustand';

/**
 * 전역 쿨다운 관리 (뒤로가기만)
 * 뒤로가기 버튼의 중복 클릭을 방지하기 위한 쿨다운 상태
 */
let goBackCooldown = false;

/**
 * 페이지 이동 상태 관리 스토어
 * 페이지 이동, 새로고침, 뒤로가기 등의 상태를 전역적으로 관리
 *
 * @type {Object} 페이지 이동 스토어 객체
 * @property {string|null} moveTo - 이동할 페이지 경로
 * @property {boolean} refresh - 새로고침 상태
 * @property {boolean} goBack - 뒤로가기 상태
 */
export const usePageMoveStore = create((set, get) => ({
  // 페이지 이동 관련 상태
  moveTo: null,

  /**
   * 이동할 페이지 설정
   * @param {string} to - 이동할 페이지 경로
   */
  setMoveTo: (to) => set({ moveTo: to }),

  /**
   * 이동 상태 초기화
   */
  resetMoveTo: () => set({ moveTo: null }),

  // 새로고침 관련 상태
  refresh: false,

  /**
   * 새로고침 상태 설정
   * 이미 새로고침 상태인 경우 중복 설정 방지
   */
  setRefresh: () => {
    const currentRefresh = get().refresh;

    if (!currentRefresh) {
      console.log('새로고침 상태 설정');
      set({ refresh: true });
    }
  },

  /**
   * 새로고침 상태 초기화
   */
  resetRefresh: () => {
    console.log('새로고침 상태 리셋');
    set({ refresh: false });
  },

  // 뒤로가기 관련 상태
  goBack: false,

  /**
   * 뒤로가기 상태 설정
   * 쿨다운 기능을 통해 중복 실행 방지
   * 안전장치로 2초 후 자동 리셋
   */
  setGoBack: () => {
    const currentGoBack = get().goBack;

    // 쿨다운 체크
    if (goBackCooldown) {
      console.log('뒤로가기 쿨다운 중 - 무시됨');
      return;
    }

    if (!currentGoBack) {
      console.log('뒤로가기 상태 설정');
      set({ goBack: true });

      // 쿨다운 설정 (1초)
      goBackCooldown = true;
      setTimeout(() => {
        goBackCooldown = false;
        console.log('뒤로가기 쿨다운 해제');
      }, 1000);

      // 자동으로 리셋하는 타이머 추가 (안전장치)
      setTimeout(() => {
        const state = get();
        if (state.goBack) {
          console.log('안전장치: 뒤로가기 상태 자동 리셋');
          set({ goBack: false });
        }
      }, 2000);
    }
  },

  /**
   * 뒤로가기 상태 초기화
   */
  resetGoBack: () => {
    console.log('뒤로가기 상태 리셋');
    set({ goBack: false });
  },
}));
