'use client';

import { alert } from '@/common/ui_com.js';
import PageWrapper from '@/components/layout/PageWrapper';
import { imgBrdAPI } from '@/lib/api/imgBrdAPI';
import { useEffect, useState } from 'react';

export default function ImgSelectionPage() {
    const [imgFileList, setImgFileList] = useState([]);
    const [randomImages, setRandomImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [statsData, setStatsData] = useState([]);
    const [userTexts, setUserTexts] = useState({}); // 선택된 이미지별 텍스트

    // 기본 게시판 정보 (하드코딩)
    const defaultBrd = {
        imgBrdSeq: 1,
        imgBrdTitl: '심리훈련 이미지 게시판',
        imgBrdDesc: '업로드된 이미지를 선택하는 심리훈련',
        maxSelCnt: 5
    };

    useEffect(() => {
        loadImgFileList(defaultBrd.imgBrdSeq);
        loadSelectedImages(defaultBrd.imgBrdSeq);
    }, []);

    // 이미지 파일 목록 로드 (사용자 선택 여부 포함)
    const loadImgFileList = async (imgBrdSeq) => {
        try {
            setIsLoading(true);
            const response = await imgBrdAPI.getImgFileList(imgBrdSeq);
            if (response.success) {
                setImgFileList(response.data);

                // 이미지가 업로드되었으면 랜덤으로 선택
                if (response.data.length > 0) {
                    // 업로드된 이미지 중 랜덤으로 5개 선택 (최대 5개)
                    generateRandomImages(response.data);
                } else {
                    setRandomImages([]);
                    alert.AlertOpen('안내', '이 게시판에는 아직 이미지가 업로드되지 않았습니다. 관리자가 이미지를 업로드한 후 이용해주세요.');
                }
            } else {
                alert.AlertOpen('오류', '이미지 파일 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            alert.AlertOpen('오류', '이미지 파일 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 랜덤 이미지 생성
    const generateRandomImages = (allImages) => {
        if (allImages.length === 0) {
            setRandomImages([]);
            return;
        }

        // 최대 5개까지만 선택
        const maxCount = Math.min(5, allImages.length);
        const shuffled = [...allImages].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, maxCount);

        setRandomImages(selected);

        // 텍스트 입력 상태 초기화
        const newTexts = {};
        selected.forEach(img => {
            newTexts[img.imgFileSeq] = '';
        });
        setUserTexts(newTexts);
    };

    // 사용자가 선택한 이미지 목록 로드
    const loadSelectedImages = async (imgBrdSeq) => {
        try {
            const response = await imgBrdAPI.getSelectedImages(imgBrdSeq);
            if (response.success) {
                setSelectedImages(response.data);
            } else {
                alert.AlertOpen('오류', '선택한 이미지 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            alert.AlertOpen('오류', '선택한 이미지 목록을 불러오는 중 오류가 발생했습니다.');
        }
    };

    // 이미지 선택/해제 토글
    const handleToggleImageSelection = async (imgFileSeq) => {
        try {
            const response = await imgBrdAPI.toggleImageSelection(defaultBrd.imgBrdSeq, imgFileSeq);
            if (response.success) {
                loadImgFileList(defaultBrd.imgBrdSeq);
                loadSelectedImages(defaultBrd.imgBrdSeq);
            } else {
                alert.AlertOpen('오류', response.message || '이미지 선택 변경에 실패했습니다.');
            }
        } catch (error) {
            alert.AlertOpen('오류', '이미지 선택 변경 중 오류가 발생했습니다.');
        }
    };

    // 텍스트 입력 처리
    const handleTextChange = (imgFileSeq, value) => {
        setUserTexts(prev => ({
            ...prev,
            [imgFileSeq]: value
        }));
    };

    // 모든 선택 해제
    const handleClearAllSelections = async () => {
        alert.ConfirmOpen('확인', '모든 선택을 해제하시겠습니까?', {
            okCallback: async () => {
                try {
                    const response = await imgBrdAPI.clearAllSelections(defaultBrd.imgBrdSeq);
                    if (response.success) {
                        alert.AlertOpen('성공', '모든 선택이 해제되었습니다.');
                        loadImgFileList(defaultBrd.imgBrdSeq);
                        loadSelectedImages(defaultBrd.imgBrdSeq);
                    } else {
                        alert.AlertOpen('오류', '선택 해제에 실패했습니다.');
                    }
                } catch (error) {
                    alert.AlertOpen('오류', '선택 해제 중 오류가 발생했습니다.');
                }
            }
        });
    };

    // 통계 보기
    const handleShowStats = async () => {
        try {
            const response = await imgBrdAPI.getImageSelectionStats(defaultBrd.imgBrdSeq);
            if (response.success) {
                setStatsData(response.data);
                setShowStatsModal(true);
            } else {
                alert.AlertOpen('오류', '통계 데이터를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            alert.AlertOpen('오류', '통계 데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };

    // 선택된 이미지 개수
    const getSelectedCount = () => {
        return selectedImages.length;
    };

    // 이미지가 선택되었는지 확인
    const isImageSelected = (imgFileSeq) => {
        return selectedImages.some(img => img.imgFileSeq === imgFileSeq);
    };

    return (
        <PageWrapper
            title="심리훈련 이미지 선택"
            subtitle="업로드된 이미지 중 원하는 이미지를 선택하세요."
            showCard={true}
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">심리훈련 이미지 선택</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleClearAllSelections}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            모든 선택 해제
                        </button>
                        <button
                            onClick={handleShowStats}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            통계 보기
                        </button>
                    </div>
                </div>

                {/* 게시판 정보 */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">{defaultBrd.imgBrdTitl}</h2>
                        <p className="text-gray-600">{defaultBrd.imgBrdDesc}</p>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">
                                최대 선택 개수: {defaultBrd.maxSelCnt}개
                            </p>
                            <p className="text-sm text-blue-600 font-medium">
                                현재 선택: {getSelectedCount()}개
                            </p>
                        </div>
                    </div>

                    {/* 안내 메시지 */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            💡 업로드된 이미지 중 랜덤으로 5개가 표시됩니다.
                        </p>
                    </div>
                </div>

                {/* 랜덤 이미지 표시 */}
                {isLoading ? (
                    <div className="text-center py-8">로딩 중...</div>
                ) : randomImages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        표시할 이미지가 없습니다.
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-4">이미지 선택</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {randomImages.map((img) => (
                                <div
                                    key={img.imgFileSeq}
                                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                        isImageSelected(img.imgFileSeq)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleToggleImageSelection(img.imgFileSeq)}
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                                        <img
                                            src={imgBrdAPI.getImageDownloadUrl(img.imgFileSeq)}
                                            alt={img.imgFileNm}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                console.error('이미지 로드 실패:', img.imgFileNm);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium truncate">{img.imgFileNm}</p>
                                        {img.imgText && (
                                            <p className="text-gray-600 text-xs mt-1">{img.imgText}</p>
                                        )}
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="이미지에 대한 생각을 입력하세요 (선택사항)"
                                                value={userTexts[img.imgFileSeq] || ''}
                                                onChange={(e) => handleTextChange(img.imgFileSeq, e.target.value)}
                                                className="w-full p-2 text-xs border border-gray-300 rounded"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="mt-2 text-center">
                                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                isImageSelected(img.imgFileSeq)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {isImageSelected(img.imgFileSeq) ? '선택됨' : '선택 안됨'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 선택된 이미지 목록 */}
                {selectedImages.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 mt-6">
                        <h2 className="text-lg font-semibold mb-4">선택한 이미지 ({selectedImages.length}개)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedImages.map((img) => (
                                <div key={img.imgFileSeq} className="border rounded-lg p-3">
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                                        <img
                                            src={imgBrdAPI.getImageDownloadUrl(img.imgFileSeq)}
                                            alt={img.imgFileNm}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium truncate">{img.imgFileNm}</p>
                                        {img.imgText && (
                                            <p className="text-gray-600 text-xs mt-1">{img.imgText}</p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            선택일: {new Date(img.selDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 통계 모달 */}
            {showStatsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">이미지 선택 통계</h3>
                            <button
                                onClick={() => setShowStatsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            {statsData.map((stat, index) => (
                                <div key={index} className="border rounded-lg p-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={imgBrdAPI.getImageDownloadUrl(stat.imgFileSeq)}
                                                alt={stat.imgFileNm}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    console.error('이미지 로드 실패:', stat.imgFileNm);
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{stat.imgFileNm}</p>
                                            <p className="text-sm text-gray-600">
                                                선택 횟수: {stat.selCnt}회
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}
