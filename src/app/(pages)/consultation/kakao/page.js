'use client';

import { setMoveTo } from '@/app/core/slices/pageMoveStore';
import CmpButton from '@/app/shared/components/button/cmp_button';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { useState } from 'react';

export default function KakaoConsultationPage() {
  const [showQRCode, setShowQRCode] = useState(false);

  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  const handleBack = () => {
    setMoveTo('/consultation/selection');
  };

  return (
    <PageWrapper title="카카오톡 오픈채팅 상담">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">카카오톡 오픈채팅 상담</h2>
            <p className="text-gray-600">
              긴급한 상담이 필요한 경우 아래 QR을 통해 오픈채팅을 요청해 주세요.
            </p>
          </div>

          <div className="space-y-6">
            {/* QR 코드 영역 */}
            <div className="text-center">
              {!showQRCode ? (
                <div className="bg-gray-100 p-8 rounded-lg">
                  <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-gray-500">QR 코드</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    QR 코드를 스캔하여 카카오톡 오픈채팅방에 입장하세요
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 p-8 rounded-lg">
                  <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📱</div>
                      <p className="text-sm text-gray-500">QR 코드</p>
                      <p className="text-xs text-gray-400 mt-1">(실제 QR 코드)</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    QR 코드를 스캔하여 카카오톡 오픈채팅방에 입장하세요
                  </p>
                </div>
              )}
            </div>

            {/* 운영 시간 정보 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">운영 시간</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>응답시간:</strong> 08:00 ~ 17:00</p>
                <p className="text-xs mt-2">
                  업무시간 내 상담이 발생할 경우 다소 응답이 늦어질 수 있습니다.
                </p>
              </div>
            </div>

            {/* 안내사항 */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">오픈채팅 상담 안내사항</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• QR 코드를 스캔하여 카카오톡 오픈채팅방에 입장하세요.</li>
                <li>• 채팅방에서 실시간으로 상담사와 대화할 수 있습니다.</li>
                <li>• 긴급한 상황이나 즉시 답변이 필요한 경우에 이용해주세요.</li>
                <li>• 개인정보 보호를 위해 민감한 정보는 직접 전달하지 마세요.</li>
                <li>• 상담 내용은 개인정보보호법에 따라 안전하게 관리됩니다.</li>
                <li>• 운영시간 외에는 게시판 상담을 이용해주세요.</li>
              </ul>
            </div>

            {/* 긴급 상담 안내 */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">긴급 상담 안내</h3>
              <p className="text-sm text-red-800">
                자살 위험이나 극도의 위기 상황인 경우, 아래 기관에 즉시 연락하세요:
              </p>
              <ul className="text-sm text-red-800 mt-2 space-y-1">
                <li>• 자살예방상담전화: 1393</li>
                <li>• 정신건강상담전화: 1577-0199</li>
                <li>• 여성긴급전화: 1366</li>
                <li>• 아동학대신고: 1391</li>
              </ul>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4 mt-8">
            <CmpButton
              label="이전"
              styleType="secondary"
              click={handleBack}
              className="flex-1"
            />
            <CmpButton
              label={showQRCode ? "QR 코드 숨기기" : "QR 코드 보기"}
              styleType="primary"
              click={handleShowQRCode}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
