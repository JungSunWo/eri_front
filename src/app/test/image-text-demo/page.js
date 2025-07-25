'use client';

import ImageTextModal from '@/components/ImageTextModal';
import { Download, Eye, Link, Upload } from 'lucide-react';
import { useState } from 'react';

export default function ImageTextDemoPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [linkInfo, setLinkInfo] = useState(null);

  const handleImageTextConfirm = (result) => {
    console.log('Received result:', result);

    // result가 객체인지 확인
    if (!result || typeof result !== 'object') {
      console.error('Invalid result:', result);
      alert('이미지 처리 중 오류가 발생했습니다.');
      return;
    }

    // result는 { imageFile, linkInfo } 형태
    const { imageFile, linkInfo } = result;

    // imageFile이 유효한지 확인
    if (imageFile && imageFile instanceof File) {
      setProcessedImage(imageFile);
      setLinkInfo(linkInfo);
      setShowModal(false);
      setSelectedFile(null);
    } else {
      console.error('Invalid image file:', imageFile);
      alert('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8">🖼️ 이미지 텍스트 추가 데모</h1>

          <div className="space-y-8">
            {/* 새로운 기능 소개 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                ✨ 새로운 기능: 실시간 미리보기 + 드래그 앤 드롭 + 하이퍼링크
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  텍스트를 입력하는 즉시 이미지에 반영되는 실시간 미리보기
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  폰트 크기, 색상, 위치 변경 시 즉시 미리보기 업데이트
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <strong>드래그 앤 드롭으로 텍스트 위치를 자유롭게 조정</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <strong>하이퍼링크 추가로 클릭 가능한 텍스트 생성</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  원본 이미지와 텍스트가 추가된 이미지를 비교 가능
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  반응형 레이아웃으로 모바일에서도 편리한 사용
                </li>
              </ul>
            </div>

            {/* 사용법 설명 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">📖 사용법</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>아래 "이미지 선택" 버튼을 클릭하여 이미지 파일을 선택합니다.</li>
                <li>이미지 텍스트 추가 모달이 열리면 원하는 텍스트를 입력합니다.</li>
                <li><strong>하이퍼링크</strong>: 선택사항으로 링크 URL을 입력하여 클릭 가능한 텍스트를 만듭니다.</li>
                <li><strong>실시간 미리보기</strong>에서 텍스트가 어떻게 표시될지 확인합니다.</li>
                <li>폰트 크기, 색상, 링크 스타일 등을 조정하여 원하는 스타일을 만듭니다.</li>
                <li><strong>드래그 앤 드롭</strong>: 위치를 "드래그 위치"로 설정하고 텍스트를 마우스로 드래그하여 원하는 위치에 배치합니다.</li>
                <li>"텍스트 추가" 버튼을 클릭하면 이미지에 텍스트가 추가됩니다.</li>
                <li>처리된 이미지는 아래에 표시되며 다운로드할 수 있습니다.</li>
              </ol>
            </div>

            {/* 이미지 선택 */}
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="demo-image-upload"
              />
              <label
                htmlFor="demo-image-upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer text-lg font-medium"
              >
                <Upload className="w-5 h-5" />
                이미지 선택
              </label>
            </div>

            {/* 처리된 이미지 표시 */}
            {processedImage && processedImage instanceof File && (
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  ✅ 텍스트가 추가된 이미지
                  {linkInfo && (
                    <span className="ml-2 text-blue-600 flex items-center gap-1">
                      <Link className="w-4 h-4" />
                      링크 포함
                    </span>
                  )}
                </h3>
                <div className="flex justify-center relative">
                  <img
                    src={URL.createObjectURL(processedImage)}
                    alt="처리된 이미지"
                    className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                  />
                  {/* 링크 정보 표시 */}
                  {linkInfo && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                      🔗 링크: {linkInfo.url}
                    </div>
                  )}
                                    {/* 클릭 가능한 링크 오버레이 */}
                  {linkInfo && (
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 팝업으로 링크 열기
                        const popup = window.open(
                          linkInfo.url,
                          'linkPopup',
                          'width=800,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=yes,menubar=yes'
                        );
                        // 팝업이 차단된 경우 새 탭으로 열기
                        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                          window.open(linkInfo.url, '_blank');
                        }
                      }}
                      title={`클릭하여 링크 열기: ${linkInfo.url}`}
                    >
                      {/* 링크 영역 표시 (개발용) */}
                      <div
                        className="absolute border-2 border-blue-500 border-dashed opacity-50 hover:opacity-100 transition-opacity"
                        style={{
                          left: `${(linkInfo.position.x / linkInfo.position.width) * 100}%`,
                          top: `${(linkInfo.position.y / linkInfo.position.height) * 100}%`,
                          width: `${(linkInfo.position.width / linkInfo.position.width) * 100}%`,
                          height: `${(linkInfo.position.height / linkInfo.position.height) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          🔗 클릭 가능한 링크
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center mt-4 space-y-2">
                  <a
                    href={URL.createObjectURL(processedImage)}
                    download={processedImage.name || 'processed-image.png'}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <Download className="w-4 h-4" />
                    이미지 다운로드
                  </a>
                  {linkInfo && (
                    <div className="text-sm text-blue-600">
                      💡 이미지 위의 점선 영역을 클릭하면 링크가 팝업으로 열립니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 기능 비교 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기존 기능 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">기존 방식</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 텍스트 입력 후 결과를 확인할 수 없음</li>
                  <li>• 여러 번 시도해야 원하는 결과 도출</li>
                  <li>• 색상과 크기 조정이 어려움</li>
                  <li>• 시간이 많이 소요됨</li>
                </ul>
              </div>

              {/* 새로운 기능 */}
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">새로운 방식</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• 실시간 미리보기로 즉시 결과 확인</li>
                  <li>• 드래그 앤 드롭으로 정확한 위치 조정</li>
                  <li>• 하이퍼링크 추가로 상호작용 가능한 텍스트</li>
                  <li>• 한 번에 원하는 결과 도출</li>
                  <li>• 직관적인 색상과 크기 조정</li>
                  <li>• 빠르고 효율적인 작업</li>
                </ul>
              </div>
            </div>

            {/* 컴포넌트 정보 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">🔧 컴포넌트 정보</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">파일 위치:</h3>
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">src/components/ImageTextModal.js</code>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">주요 기능:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>실시간 미리보기 (Canvas API 활용)</li>
                    <li>드래그 앤 드롭 위치 조정</li>
                    <li>하이퍼링크 추가 및 스타일링</li>
                    <li>텍스트 스타일링 (크기, 색상, 위치)</li>
                    <li>자동 줄바꿈 처리</li>
                    <li>반응형 디자인</li>
                    <li>외곽선 효과 (가독성 향상)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Props:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><code>isOpen</code>: 모달 열림/닫힘 상태 (boolean)</li>
                    <li><code>onClose</code>: 모달 닫기 함수 (function)</li>
                    <li><code>imageFile</code>: 텍스트를 추가할 이미지 파일 (File)</li>
                    <li><code>onConfirm</code>: 텍스트 추가 완료 시 호출되는 함수 (function)</li>
                    <li><code>defaultOptions</code>: 기본 텍스트 옵션 (object, optional)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">반환 데이터:</h3>
                  <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto">
{`{
  imageFile: File,        // 처리된 이미지 파일
  linkInfo: {             // 링크 정보 (선택사항)
    url: string,          // 링크 URL
    text: string,         // 텍스트 내용
    position: {           // 텍스트 위치 정보
      x: number,
      y: number,
      fontSize: number,
      width: number,
      height: number
    }
  }
}`}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">사용 예시:</h3>
                  <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto">
{`<ImageTextModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  imageFile={selectedFile}
  onConfirm={handleImageTextConfirm}
  defaultOptions={{
    fontSize: 24,
    color: '#ffffff',
    strokeColor: '#000000',
    position: 'bottom'
  }}
/>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 텍스트 추가 모달 */}
      <ImageTextModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        imageFile={selectedFile}
        onConfirm={handleImageTextConfirm}
      />
    </div>
  );
}
