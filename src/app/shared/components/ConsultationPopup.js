'use client';

import { commonCodeAPI } from '@/app/core/services/api/commonCodeAPI';
import { consultationAPI } from '@/app/core/services/api/consultationAPI';
import { CmpButton, CmpInput, CmpSelect, CmpTextarea } from '@/app/shared/components/ui';
import { alert } from '@/app/shared/utils/ui_com';
import { useEffect, useState } from 'react';

const ConsultationPopup = ({ isOpen, onClose, onSuccess }) => {
    // 폼 데이터
    const [formData, setFormData] = useState({
        ttl: '',
        cntn: '',
        categoryCd: '',
        anonymousYn: 'N',
        nickname: '',
        priorityCd: ''
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // 카테고리 코드 목록
    const [categoryOptions, setCategoryOptions] = useState([]);
    // 우선순위 코드 목록
    const [priorityOptions, setPriorityOptions] = useState([]);

    // 컴포넌트 마운트 시 공통 코드 조회
    useEffect(() => {
        if (isOpen) {
            fetchCommonCodes();
        }
    }, [isOpen]);

    // 공통 코드 조회
    const fetchCommonCodes = async () => {
        try {
            const [categoryResponse, priorityResponse] = await Promise.all([
                commonCodeAPI.getDetailList({ grpCd: 'CNSL_CAT' }),
                commonCodeAPI.getDetailList({ grpCd: 'CNSL_PRI' })
            ]);

            if (categoryResponse.success) {
                const categoryContent = categoryResponse.data?.content || categoryResponse.data || [];
                setCategoryOptions(categoryContent);
            }
            if (priorityResponse.success) {
                const priorityContent = priorityResponse.data?.content || priorityResponse.data || [];
                setPriorityOptions(priorityContent);
            }
        } catch (error) {
            console.error('공통 코드 조회 오류:', error);
            setCategoryOptions([]);
            setPriorityOptions([]);
        }
    };

    // 익명 여부 변경 시 닉네임 초기화
    const handleAnonymousChange = (value) => {
        const isAnonymous = value === 'Y';
        setFormData(prev => ({
            ...prev,
            anonymousYn: value,
            // 익명이 아닌 경우에만 닉네임 초기화
            nickname: isAnonymous ? prev.nickname : ''
        }));
    };

    // 우선순위 변경 시 긴급 여부 자동 설정
    const handlePriorityChange = (value) => {
        setFormData(prev => ({
            ...prev,
            priorityCd: value
        }));
    };

    // 상담 신청
    const createConsultation = async () => {
        if (!formData.ttl.trim()) {
            alert.AlertOpen('입력 오류', '제목을 입력해주세요.');
            return;
        }
        if (!formData.cntn.trim()) {
            alert.AlertOpen('입력 오류', '내용을 입력해주세요.');
            return;
        }
        if (!formData.categoryCd) {
            alert.AlertOpen('입력 오류', '카테고리를 선택해주세요.');
            return;
        }
        if (formData.anonymousYn === 'Y' && !formData.nickname.trim()) {
            alert.AlertOpen('입력 오류', '익명 상담의 경우 닉네임을 입력해주세요.');
            return;
        }

        // 디버깅을 위한 로그
        console.log('상담 신청 폼 데이터:', formData);
        console.log('익명 여부:', formData.anonymousYn);
        console.log('닉네임:', formData.nickname);

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('ttl', formData.ttl);
            formDataToSend.append('cntn', formData.cntn);
            formDataToSend.append('categoryCd', formData.categoryCd);
            formDataToSend.append('anonymousYn', formData.anonymousYn);
            formDataToSend.append('nickname', formData.nickname);
            formDataToSend.append('priorityCd', formData.priorityCd);
            // 우선순위가 '긴급'인 경우 긴급 여부를 'Y'로 설정
            const urgentYn = formData.priorityCd === 'PRI001' ? 'Y' : 'N';
            formDataToSend.append('urgentYn', urgentYn);

            files.forEach(file => {
                formDataToSend.append('files', file);
            });

            // FormData 내용 확인
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await consultationAPI.createConsultation(formDataToSend);

            if (response.success) {
                alert.AlertOpen('상담 신청 완료', '상담이 성공적으로 신청되었습니다.');
                resetForm();
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                alert.AlertOpen('상담 신청 실패', response.message || '상담 신청에 실패했습니다.');
            }
        } catch (error) {
            console.error('상담 신청 오류:', error);
            alert.AlertOpen('상담 신청 오류', '상담 신청 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 폼 초기화
    const resetForm = () => {
        setFormData({
            ttl: '',
            cntn: '',
            categoryCd: '',
            anonymousYn: 'N',
            nickname: '',
            priorityCd: ''
        });
        setFiles([]);
    };

    // 파일 변경
    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    // 팝업 닫기
    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">상담 신청</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* 제목 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            제목 *
                        </label>
                        <CmpInput
                            value={formData.ttl}
                            onChange={(e) => setFormData(prev => ({ ...prev, ttl: e.target.value }))}
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    {/* 카테고리 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            카테고리 *
                        </label>
                        <CmpSelect
                            value={formData.categoryCd}
                            onChange={(value) => setFormData(prev => ({ ...prev, categoryCd: value }))}
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categoryOptions && categoryOptions.length > 0 ? (
                                categoryOptions.map(option => (
                                    <option key={option.dtlCd} value={option.dtlCd}>
                                        {option.dtlCdNm}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>카테고리를 불러오는 중...</option>
                            )}
                        </CmpSelect>
                    </div>

                    {/* 익명 여부 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            익명 여부
                        </label>
                        <CmpSelect
                            value={formData.anonymousYn}
                            onChange={handleAnonymousChange}
                        >
                            <option value="N">기명</option>
                            <option value="Y">익명</option>
                        </CmpSelect>
                    </div>

                    {/* 익명 닉네임 */}
                    {formData.anonymousYn === 'Y' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                닉네임 *
                            </label>
                            <CmpInput
                                value={formData.nickname}
                                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                                placeholder="익명 닉네임을 입력하세요"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                익명 상담 시 사용할 닉네임을 입력해주세요.
                            </p>
                        </div>
                    )}

                    {/* 우선순위 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            우선순위
                        </label>
                        <CmpSelect
                            value={formData.priorityCd}
                            onChange={handlePriorityChange}
                        >
                            <option value="">우선순위를 선택하세요</option>
                            {priorityOptions && priorityOptions.length > 0 ? (
                                priorityOptions.map(option => (
                                    <option key={option.dtlCd} value={option.dtlCd}>
                                        {option.dtlCdNm}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>우선순위를 불러오는 중...</option>
                            )}
                        </CmpSelect>
                    </div>



                    {/* 내용 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            내용 *
                        </label>
                        <CmpTextarea
                            value={formData.cntn}
                            onChange={(e) => setFormData(prev => ({ ...prev, cntn: e.target.value }))}
                            placeholder="상담 내용을 입력하세요"
                            rows={12}
                            className="min-h-[300px]"
                        />
                    </div>

                    {/* 파일 첨부 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            파일 첨부
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {files.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">선택된 파일: {files.length}개</p>
                                <ul className="text-xs text-gray-500 mt-1">
                                    {files.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <CmpButton
                        onClick={handleClose}
                        variant="outline"
                        disabled={loading}
                    >
                        취소
                    </CmpButton>
                    <CmpButton
                        onClick={createConsultation}
                        disabled={loading}
                    >
                        {loading ? '처리 중...' : '상담 신청'}
                    </CmpButton>
                </div>
            </div>
        </div>
    );
};

export default ConsultationPopup;
