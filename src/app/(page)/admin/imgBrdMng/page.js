'use client';

import { alert } from '@/common/ui_com.js';
import PageWrapper from '@/components/layout/PageWrapper';
import { CmpButton, CmpTextarea, CommonModal } from '@/components/ui';
import { imgBrdAPI } from '@/lib/api/imgBrdAPI';
import { useEffect, useState } from 'react';

export default function ImgBrdMngPage() {

    const [imgFileList, setImgFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileTexts, setFileTexts] = useState([]);
    const [editingFile, setEditingFile] = useState(null);
    const [editText, setEditText] = useState('');

    // 기본 게시판 정보 (하드코딩)
    const defaultBrd = {
        imgBrdSeq: 1,
        imgBrdTitl: '심리훈련 이미지 게시판',
        imgBrdDesc: '업로드된 이미지를 선택하는 심리훈련',
        maxSelCnt: 5
    };

    useEffect(() => {
        loadImgFileList(defaultBrd.imgBrdSeq);
    }, []);

    // 이미지 파일 목록 로드
    const loadImgFileList = async (imgBrdSeq) => {
        try {
            setIsLoading(true);
            const response = await imgBrdAPI.getImgFileList(imgBrdSeq);
            if (response.success) {
                setImgFileList(response.data);
            } else {
                alert.AlertOpen('오류', '이미지 파일 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            alert.AlertOpen('오류', '이미지 파일 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 이미지 업로드 처리
    const handleUploadImages = async () => {
        if (selectedFiles.length === 0) {
            alert.AlertOpen('경고', '업로드할 이미지를 선택해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await imgBrdAPI.uploadImages(defaultBrd.imgBrdSeq, selectedFiles, fileTexts);
            if (response.success) {
                alert.AlertOpen('성공', `${selectedFiles.length}개 이미지가 업로드되었습니다!`);
                setShowUploadModal(false);
                setSelectedFiles([]);
                setFileTexts([]);
                loadImgFileList(defaultBrd.imgBrdSeq);
            } else {
                alert.AlertOpen('오류', response.message || '이미지 업로드에 실패했습니다.');
            }
        } catch (error) {
            alert.AlertOpen('오류', '이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 파일 선택 처리
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) {
            alert.AlertOpen('경고', '업로드할 이미지를 선택해주세요.');
            event.target.value = '';
            return;
        }

        setSelectedFiles(files);
        setFileTexts(new Array(files.length).fill(''));
    };

    // 텍스트 입력 처리
    const handleTextChange = (index, value) => {
        const newTexts = [...fileTexts];
        newTexts[index] = value;
        setFileTexts(newTexts);
    };

    // 이미지 수정 모달 열기
    const handleEditImage = (file) => {
        setEditingFile(file);
        setEditText(file.imgText || '');
        setShowEditModal(true);
    };

    // 이미지 수정 처리
    const handleUpdateImage = async () => {
        if (!editingFile) return;

        try {
            setIsLoading(true);
            const response = await imgBrdAPI.updateImageText(editingFile.imgFileSeq, editText);
            if (response.success) {
                alert.AlertOpen('성공', '이미지 설명이 수정되었습니다.');
                setShowEditModal(false);
                setEditingFile(null);
                setEditText('');
                loadImgFileList(defaultBrd.imgBrdSeq);
            } else {
                alert.AlertOpen('오류', response.message || '이미지 수정에 실패했습니다.');
            }
        } catch (error) {
            alert.AlertOpen('오류', '이미지 수정 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 이미지 삭제 처리
    const handleDeleteImage = (file) => {
        alert.ConfirmOpen('확인', `"${file.imgFileNm}" 이미지를 삭제하시겠습니까?`, {
            okCallback: async () => {
                try {
                    setIsLoading(true);

                    // 세션 상태 확인 (디버깅용)
                    console.log('이미지 삭제 시도:', {
                        imgFileSeq: file.imgFileSeq,
                        imgFileNm: file.imgFileNm,
                        timestamp: new Date().toISOString()
                    });

                    const response = await imgBrdAPI.deleteImageFile(file.imgFileSeq);
                    if (response.success) {
                        alert.AlertOpen('성공', '이미지가 삭제되었습니다.');
                        loadImgFileList(defaultBrd.imgBrdSeq);
                    } else {
                        alert.AlertOpen('오류', response.message || '이미지 삭제에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('이미지 파일 삭제 오류:', error);
                    console.error('에러 상세 정보:', {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        message: error.message
                    });

                    // 세션 만료 여부 확인
                    if (error.response?.status === 401) {
                        alert.AlertOpen('세션 만료', '로그인이 만료되었습니다. 다시 로그인해주세요.');
                        // 로그인 페이지로 리다이렉트
                        window.location.href = '/login';
                        return;
                    }

                    alert.AlertOpen('오류', '이미지 삭제 중 오류가 발생했습니다.');
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    return (
        <PageWrapper
            title="심리훈련 이미지 관리"
            subtitle="이미지를 업로드하고 관리할 수 있습니다."
            showCard={true}
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">심리훈련 이미지 관리</h1>
                    <CmpButton
                        variant="success"
                        size="md"
                        onClick={() => setShowUploadModal(true)}
                    >
                        이미지 업로드
                    </CmpButton>
                </div>

                {/* 안내 메시지 */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 사용 안내</h3>
                    <ul className="text-blue-700 space-y-1">
                        <li>• 원하는 개수의 이미지를 선택하여 업로드할 수 있습니다.</li>
                        <li>• 각 이미지에 대한 설명을 입력할 수 있습니다.</li>
                        <li>• 업로드된 이미지는 사용자가 선택할 수 있습니다.</li>
                    </ul>
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
                                업로드된 이미지: {imgFileList.length}개
                            </p>
                        </div>

                        {/* 업로드 상태 표시 */}
                        {imgFileList.length === 0 && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800">
                                    아직 업로드된 이미지가 없습니다. 이미지를 업로드해주세요.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 이미지 목록 */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4">업로드된 이미지 목록</h2>
                    {isLoading ? (
                        <div className="text-center py-4">로딩 중...</div>
                    ) : imgFileList.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            업로드된 이미지가 없습니다.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {imgFileList.map((file, index) => (
                                <div key={file.imgFileSeq} className="border rounded-lg p-3">
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                                        <img
                                            src={imgBrdAPI.getImageDownloadUrl(file.imgFileSeq)}
                                            alt={file.imgFileNm}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                console.error('이미지 로드 실패:', file.imgFileNm);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium truncate">{file.imgFileNm}</p>
                                        {file.imgText && (
                                            <p className="text-gray-600 text-xs mt-1">{file.imgText}</p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            {new Date(file.regDate).toLocaleDateString()}
                                        </p>

                                        {/* 수정/삭제 버튼 */}
                                        <div className="flex space-x-2 mt-2">
                                            <CmpButton
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleEditImage(file)}
                                            >
                                                수정
                                            </CmpButton>
                                            <CmpButton
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteImage(file)}
                                            >
                                                삭제
                                            </CmpButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 업로드 모달 */}
            <CommonModal
                isOpen={showUploadModal}
                onClose={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setFileTexts([]);
                }}
                title="이미지 업로드"
                size="lg"
            >
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        이미지 파일 선택
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        여러 이미지를 선택할 수 있습니다.
                    </p>
                </div>

                {selectedFiles.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">선택된 파일 ({selectedFiles.length}개)</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="space-y-2">
                                    <span className="text-sm text-gray-600">
                                        {file.name}
                                    </span>
                                    <CmpTextarea
                                        placeholder="이미지 설명 (선택사항)"
                                        value={fileTexts[index] || ''}
                                        onChange={(e) => handleTextChange(index, e.target.value)}
                                        rows="2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <CmpButton
                        variant="outline"
                        onClick={() => {
                            setShowUploadModal(false);
                            setSelectedFiles([]);
                            setFileTexts([]);
                        }}
                    >
                        취소
                    </CmpButton>
                    <CmpButton
                        variant="primary"
                        onClick={handleUploadImages}
                        disabled={selectedFiles.length === 0 || isLoading}
                    >
                        {isLoading ? '업로드 중...' : '업로드'}
                    </CmpButton>
                </div>
            </CommonModal>

            {/* 수정 모달 */}
            <CommonModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingFile(null);
                    setEditText('');
                }}
                title="이미지 설명 수정"
                size="md"
            >
                {editingFile && (
                    <>
                        <div className="mb-4">
                            <div className="mb-4">
                                <img
                                    src={imgBrdAPI.getImageDownloadUrl(editingFile.imgFileSeq)}
                                    alt={editingFile.imgFileNm}
                                    className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    파일명
                                </label>
                                <p className="text-sm text-gray-600">{editingFile.imgFileNm}</p>
                            </div>
                            <div className="mb-4">
                                <CmpTextarea
                                    label="이미지 설명"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    placeholder="이미지에 대한 설명을 입력하세요"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <CmpButton
                                variant="outline"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingFile(null);
                                    setEditText('');
                                }}
                            >
                                취소
                            </CmpButton>
                            <CmpButton
                                variant="primary"
                                onClick={handleUpdateImage}
                                disabled={isLoading}
                            >
                                {isLoading ? '수정 중...' : '수정'}
                            </CmpButton>
                        </div>
                    </>
                )}
            </CommonModal>
        </PageWrapper>
    );
}
