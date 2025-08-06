/**
 * @File Name      : page.js
 * @File path      : src/app/(page)/login/page.js
 * @author         : 정선우
 * @Description    : 직원 로그인 페이지 컴포넌트
 *                   - 직원번호 입력을 통한 로그인 기능
 *                   - 입력값 검증 및 자동 대문자 변환
 *                   - 로그인 성공 시 메인 페이지로 리다이렉트
 *                   - 전역 상태 초기화 및 세션 관리
 * @History        : 20250701  최초 신규
 **/

'use client';

import CmpButton from '@/app/shared/components/button/cmp_button';
import { CmpSection, CmpSectionBody } from '@/components/contents/cmp_section/cmp_section';
import { useMenuStore } from '@/slices/menuStore';
import { usePageMoveStore } from '@/slices/pageMoveStore';
import { useEffect, useState } from 'react';


import CmpInput from '@/components/ui/CmpInput';
import PageWrapper from '@/layouts/PageWrapper';
import { authAPI } from '@/services/api';
import storage from '@/utils/storage';
import { alert } from '@/utils/ui_com';
import { Building, User } from 'lucide-react';

/**
 * 로그인 페이지 컴포넌트
 * @returns {JSX.Element} 로그인 페이지 UI
 */
export default function LoginPage() {
  // 전역 상태 관리 훅
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const resetMoveTo = usePageMoveStore((state) => state.resetMoveTo);
  const resetRefresh = usePageMoveStore((state) => state.resetRefresh);
  const resetGoBack = usePageMoveStore((state) => state.resetGoBack);
  const setActiveMenus = useMenuStore((state) => state.setActiveMenus);

  // 로컬 상태 관리
  const [empNo, setEmpNo] = useState('');           // 직원번호 입력값
  const [loading, setLoading] = useState(false);    // 로그인 처리 중 상태
  const [error, setError] = useState('');           // 에러 메시지
  const [toasts, setToasts] = useState([]);         // 토스트 알림 목록

  /**
   * 로그인 페이지 진입 시 초기화 작업
   * - 기존 세션 로그아웃 처리
   * - 전역 상태 초기화
   * - 직원 캐시 초기화
   */
  useEffect(() => {
    /**
     * 기존 세션 로그아웃 처리
     */
    const logout = async () => {
      try {
        await authAPI.logout();
      } catch (e) {
        // 로그아웃 실패는 무시 (이미 로그아웃된 상태일 수 있음)
      }
      storage().removeItem('user');
      // 직원 캐시도 비우기

    };

    /**
     * 전역 상태 초기화
     */
    const resetGlobalStates = () => {
      // pageMoveStore 초기화
      resetMoveTo();
      resetRefresh();
      resetGoBack();

      // menuStore 초기화
      setActiveMenus([]);

      console.log('로그인 페이지 진입: 전역 상태 초기화 완료');
    };

    logout();
    resetGlobalStates();
  }, [resetMoveTo, resetRefresh, resetGoBack, setActiveMenus]);

  /**
   * 직원번호 입력 처리
   * - 소문자를 대문자로 자동 변환
   * - 영문 + 숫자만 허용하는 필터링
   * @param {Event} e - 입력 이벤트
   */
  const handleEmpNoChange = (e) => {
    const value = e.target.value;
    // 1. 먼저 대문자로 변환
    const upperValue = value.toUpperCase();
    // 2. 대문자 영문과 숫자만 허용하는 정규식으로 필터링
    const filteredValue = upperValue.replace(/[^A-Z0-9]/g, '');
    setEmpNo(filteredValue);
  };

  /**
   * 키 입력 시 처리
   * - 대문자 영문 + 숫자만 허용
   * - 엔터키 로그인 처리
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  const handleKeyPress = (e) => {
    // 엔터키 처리
    if (e.key === 'Enter') {
      e.preventDefault();
      if (empNo.trim() && !loading) {
        handleSubmit(e);
      }
      return;
    }

    const char = String.fromCharCode(e.charCode);
    // 대문자 영문과 숫자가 아닌 경우 입력 차단
    if (!/[A-Z0-9]/i.test(char)) {
      e.preventDefault();
    }
  };

  /**
   * 상태 기반 토스트 열기 함수
   * @param {string} id - 토스트 ID
   * @param {string} message - 토스트 메시지
   * @param {string} type - 토스트 타입 (info, success, error)
   */
  const openToast = (id, message, type = 'info') => {
    setToasts([
      {
        id,
        message,
        type,
        onClose: () => setToasts([])
      }
    ]);
  };

  /**
   * 로그인 폼 제출 처리
   * - 직원번호로 로그인 API 호출
   * - 성공 시 직원 캐시 초기화 및 메인 페이지 이동
   * - 실패 시 에러 메시지 표시
   * @param {Event} e - 폼 제출 이벤트
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.empLogin(empNo);
      if (response.success) {
        // 직원 캐시 초기화
        if (response.employeeCache) {

        }

        // 사용자 정보를 로컬 스토리지에 저장
        storage().setItem('user', {
          userId: response.userAuth?.userId,
          userName: response.userAuth?.userName,
          deptCd: response.userAuth?.deptCd,
          rankCd: response.userAuth?.rankCd,
          isAdmin: response.userAuth?.isAdmin,
        });

        // 메인 페이지로 이동
        setMoveTo('/main');
        // openToast('loginSuccessToast', '로그인이 성공했습니다. 메인 페이지로 이동합니다.', 'success');
        // alert.AlertOpen('로그인 성공', '로그인이 성공했습니다. 메인 페이지로 이동합니다.');
      } else {
        // setError(response.message || '로그인에 실패했습니다.');
        // openToast('loginErrorToast', '로그인에 실패했습니다. 직원번호를 확인해주세요.', 'error');
        alert.AlertOpen('로그인 실패', '로그인에 실패했습니다. 직원번호를 확인해주세요.');
      }
    } catch (err) {
      // setError(err.response?.data?.message || '로그인에 실패했습니다.');
      // openToast('loginErrorToast', '로그인에 실패했습니다. 직원번호를 확인해주세요.', 'error');
      alert.AlertOpen('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그인 폼 UI 렌더링
   * @returns {JSX.Element} 로그인 폼 컴포넌트
   */
  const drawLoginForm = () => {
    return (
      <CmpSection>
        <CmpSectionBody>
          {/* 로고 및 안내 문구 */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-600">직원번호로 로그인하여 계속하세요</p>
          </div>

          {/* 로그인 폼 */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* 에러 메시지 표시 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="empNo" className="block text-sm font-medium text-gray-700 mb-1">
                  직원번호
                </label>
                <div className="relative mb-4">
                  <CmpInput
                    id="empNo"
                    name="empNo"
                    type="text"
                    required
                    value={empNo}
                    onChange={handleEmpNoChange}
                    onKeyPress={handleKeyPress}
                    placeholder="직원번호를 입력하세요"
                    autoComplete="off"
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    inputType="engnum"
                    className="w-full h-12 px-4 border border-gray-300 rounded-none bg-white text-base"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  대문자 영문과 숫자만 입력 가능합니다.
                </p>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <CmpButton
              type="submit"
              label={loading ? "로그인 중..." : "로그인"}
              disabled={loading || !empNo.trim()}
              className="w-full h-10 text-sm mt-2"
            />
          </form>

          {/* 사용 안내 */}
          <div className="mt-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">💡 사용 안내</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>직원번호는 대문자 영문과 숫자만 입력 가능합니다</li>
                <li>로그인 후 직원정보와 권한이 자동으로 설정됩니다</li>
              </ul>
            </div>
          </div>
        </CmpSectionBody>
      </CmpSection>
    );
  };

  return (
    <PageWrapper
      title="IBK 직원권익보호 포탈"
      subtitle="로그인"
      layoutType="login"
      toasts={toasts}
    >
      {drawLoginForm()}
    </PageWrapper>
  );
}
