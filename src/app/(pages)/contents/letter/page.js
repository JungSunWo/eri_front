'use client';

import { imgBrdAPI } from '@/app/core/services/api/imgBrdAPI';
import { useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert, toast } from '@/app/shared/utils/ui_com';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function LettersPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedImages, setLikedImages] = useState([]);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // 기본 게시판 정보
  const defaultBrd = {
    imgBrdSeq: 1,
    imgBrdTitl: '마음챙김레터',
    imgBrdDesc: '관리자가 업로드한 마음챙김 이미지를 스와이프하여 조회하고 좋아요할 수 있습니다.',
    maxSelCnt: 1
  };

  // 이미지 파일 목록 조회
  const {
    data: imgFileData,
    isLoading: imgFileLoading,
    error: imgFileError,
    refetch: refetchImgFiles
  } = useQuery(
    ['img-file-list', defaultBrd.imgBrdSeq],
    () => imgBrdAPI.getImgFileList(defaultBrd.imgBrdSeq),
    {
      cacheTime: 5 * 60 * 1000, // 5분 캐시
      retry: 3,
      refetchOnWindowFocus: false
    }
  );

  // 로컬 스토리지에서 좋아요한 이미지 불러오기
  useEffect(() => {
    const savedLikedImages = localStorage.getItem('likedImages');
    if (savedLikedImages) {
      setLikedImages(JSON.parse(savedLikedImages));
    }
  }, []);

  // 좋아요한 이미지 저장
  useEffect(() => {
    localStorage.setItem('likedImages', JSON.stringify(likedImages));
  }, [likedImages]);

  // 이미지 데이터 설정
  useEffect(() => {
    if (imgFileData?.success) {
      setIsLoading(false);
    } else if (imgFileData && !imgFileData.success) {
      alert.AlertOpen('오류', '이미지 목록을 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  }, [imgFileData]);

        // 현재 표시할 이미지 목록 (랜덤하게 5개만 표시)
  const allImages = imgFileData?.data || [];

  // refreshKey에 따라 랜덤 이미지 생성
  const randomImages = useMemo(() => {
    console.log('새로운 랜덤 이미지 생성, refreshKey:', refreshKey);

    // 시드 기반 랜덤 함수 생성
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // refreshKey를 시드로 사용하여 랜덤화
    const shuffled = [...allImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const seed = refreshKey + i * 1000;
      const j = Math.floor(seededRandom(seed) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    console.log('선택된 이미지들:', shuffled.slice(0, 5).map(img => img.imgFileNm));
    return shuffled.slice(0, 5);
  }, [allImages, refreshKey]);

  const likedImageList = allImages.filter(img => likedImages.includes(img.imgFileSeq));

  const displayImages = showLikedOnly ? likedImageList : randomImages;

  // refreshKey가 변경되면 현재 인덱스 리셋
  useEffect(() => {
    if (!showLikedOnly) {
      setCurrentImageIndex(0);
    }
  }, [refreshKey, showLikedOnly]);

  // 좋아요 토글
  const handleLikeToggle = (imgFileSeq) => {
    if (likedImages.includes(imgFileSeq)) {
      // 좋아요 취소
      setLikedImages(prev => prev.filter(id => id !== imgFileSeq));
      toast.callCommonToastOpen('좋아요가 취소되었습니다.');

      // 좋아요 취소 후 전체 모드에서 랜덤 이미지 새로고침
      if (!showLikedOnly) {
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
        }, 100);
      }
    } else {
      // 좋아요 추가 (1개 제한)
      if (likedImages.length >= defaultBrd.maxSelCnt) {
        alert.AlertOpen('알림', `좋아요는 최대 ${defaultBrd.maxSelCnt}개까지만 가능합니다.`);
        return;
      }
      setLikedImages(prev => [...prev, imgFileSeq]);
      toast.callCommonToastOpen('좋아요가 추가되었습니다.');
    }
  };

  // 좋아요한 이미지가 없을 때 자동으로 전체 모드로 전환
  useEffect(() => {
    if (showLikedOnly && likedImages.length === 0) {
      setShowLikedOnly(false);
      toast.callCommonToastOpen('좋아요한 이미지가 없어 전체 모드로 전환됩니다.');
    }
  }, [likedImages.length, showLikedOnly]);

  // 전체 버튼 클릭 핸들러
  const handleAllButtonClick = () => {
    if (!showLikedOnly) {
      // 이미 전체 모드인 경우 랜덤 이미지 새로고침
      console.log('전체 버튼 클릭 - 랜덤 이미지 새로고침');
      setRefreshKey(prev => prev + 1);
      toast.callCommonToastOpen('새로운 랜덤 이미지를 불러왔습니다.');
    } else {
      // 좋아요 모드에서 전체 모드로 전환
      console.log('좋아요 모드에서 전체 모드로 전환');
      setShowLikedOnly(false);
    }
  };

  // 이전 이미지로 이동
  const handlePrevious = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  // 다음 이미지로 이동
  const handleNext = () => {
    setCurrentImageIndex(prev =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [displayImages.length]);

  // 필터 변경 시 현재 인덱스 리셋
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [showLikedOnly]);

  // 현재 이미지
  const currentImage = displayImages[currentImageIndex];

  if (isLoading || imgFileLoading) {
    return (
      <PageWrapper title="마음챙김레터">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">이미지를 불러오는 중...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (imgFileError) {
    return (
      <PageWrapper title="마음챙김레터">
        <div className="text-center py-8">
          <p className="text-red-600">이미지 목록을 불러오는데 실패했습니다.</p>
        </div>
      </PageWrapper>
    );
  }

  if (displayImages.length === 0) {
    return (
      <PageWrapper title="마음챙김레터">
        <div className="text-center py-8">
          <p className="text-gray-600">
            {showLikedOnly ? '좋아요한 이미지가 없습니다.' : '업로드된 이미지가 없습니다.'}
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="마음챙김레터">
      <div className="max-w-4xl mx-auto p-4">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">마음챙김레터</h1>
          <p className="text-gray-600">{defaultBrd.imgBrdDesc}</p>
        </div>

        {/* 필터 버튼 */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-2">
                         <button
               onClick={handleAllButtonClick}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                 !showLikedOnly
                   ? 'bg-blue-500 text-white'
                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
               }`}
             >
               전체 (5개 랜덤)
             </button>
            <button
              onClick={() => setShowLikedOnly(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showLikedOnly
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              좋아요 ({likedImages.length}/{defaultBrd.maxSelCnt})
            </button>
          </div>
        </div>

        {/* 이미지 스와이프 영역 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 이미지 표시 */}
          <div className="relative aspect-square bg-gray-100">
            {currentImage && (
              <>
                <img
                  src={imgBrdAPI.getImageDownloadUrl(currentImage.imgFileSeq)}
                  alt={currentImage.imgFileNm}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('이미지 로드 실패:', currentImage.imgFileNm);
                    e.target.style.display = 'none';
                  }}
                />

                {/* 좋아요 버튼 */}
                <button
                  onClick={() => handleLikeToggle(currentImage.imgFileSeq)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200 ${
                    likedImages.includes(currentImage.imgFileSeq)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      likedImages.includes(currentImage.imgFileSeq) ? 'fill-current' : ''
                    }`}
                  />
                </button>

                {/* 이미지 정보 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">{currentImage.imgFileNm}</h3>
                    {currentImage.imgText && (
                      <p className="text-sm opacity-90 mt-1">{currentImage.imgText}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between items-center p-4">
            <button
              onClick={handlePrevious}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              disabled={displayImages.length <= 1}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* 이미지 인디케이터 */}
            <div className="flex space-x-2">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              disabled={displayImages.length <= 1}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

                 {/* 이미지 카운터 */}
         <div className="text-center mt-4 text-gray-600">
           {currentImageIndex + 1} / {displayImages.length}
           {!showLikedOnly && (
             <div className="text-xs text-blue-500 mt-1">
               새로고침 횟수: {refreshKey}
             </div>
           )}
         </div>

        {/* 사용 안내 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 사용 안내</h3>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• 좌우 화살표 키 또는 버튼을 눌러 이미지를 넘길 수 있습니다.</p>
            <p>• 하트 버튼을 클릭하여 좋아요할 수 있습니다.</p>
                         <p>• 좋아요는 최대 {defaultBrd.maxSelCnt}개까지만 가능합니다.</p>
             <p>• 전체 조회 시 랜덤하게 5개만 표시됩니다.</p>
            <p>• 좋아요한 이미지는 '좋아요' 필터에서 확인할 수 있습니다.</p>
          </div>
        </div>

        {/* 좋아요한 이미지 미리보기 */}
        {likedImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              좋아요한 이미지 ({likedImages.length}/{defaultBrd.maxSelCnt})
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {likedImages.map((imgFileSeq) => {
                const likedImage = imgFileData?.data?.find(img => img.imgFileSeq === imgFileSeq);
                if (!likedImage) return null;

                return (
                  <div key={imgFileSeq} className="relative">
                    <img
                      src={imgBrdAPI.getImageDownloadUrl(imgFileSeq)}
                      alt={likedImage.imgFileNm}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <div className="absolute top-1 right-1">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
