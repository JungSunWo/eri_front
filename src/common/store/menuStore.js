/**
 * @File Name      : menuStore.js
 * @File path      : src/common/store/menuStore.js
 * @author         : 정선우
 * @Description    : 메뉴 상태 관리 스토어
 *                   - 현재 활성화된 메뉴 목록 관리
 *                   - Zustand를 사용한 전역 상태 관리
 * @History        : 20250701  최초 신규
 **/

import { create } from 'zustand';

/**
 * 메뉴 상태 관리 스토어
 * 현재 활성화된 메뉴 목록을 전역적으로 관리
 *
 * @type {Object} 메뉴 스토어 객체
 * @property {Array} activeMenus - 현재 활성화된 메뉴 목록
 * @property {Function} setActiveMenus - 활성 메뉴 목록 설정 함수
 */
export const useMenuStore = create((set) => ({
  // 현재 활성화된 메뉴 목록
  activeMenus: [],

  /**
   * 활성 메뉴 목록 설정
   * @param {Array} menus - 설정할 메뉴 목록
   */
  setActiveMenus: (menus) => set({ activeMenus: menus }),
}));
