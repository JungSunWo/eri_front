'use client';

import anonymousUserAPI from '@/app/core/services/api/anonymousUserAPI';
import CmpButton from '@/app/shared/components/ui/CmpButton';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import CommonModal from '@/app/shared/components/ui/CommonModal';
import DataTable from '@/app/shared/components/ui/DataTable';
import { useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert, toast } from '@/app/shared/utils/ui_com';
import { useEffect, useState } from 'react';

export default function AnonymousUserManagementPage() {
    // 상태 관리
    const [anonymousUsers, setAnonymousUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    // 검색 조건
    const [searchCondition, setSearchCondition] = useState({
        nickname: '',
        useYn: ''
    });

    // 모달 상태
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // 폼 데이터
    const [formData, setFormData] = useState({
        nickname: '',
        useYn: 'Y'
    });

    // 익명 사용자 목록 조회 쿼리 파라미터
    const queryParams = {
        page: currentPage,
        size: pageSize,
        ...searchCondition
    };

    // 익명 사용자 목록 조회 (Zustand Query 사용)
    const {
        data: anonymousUserData,
        isLoading: anonymousUserLoading,
        error: anonymousUserError,
        refetch: refetchAnonymousUsers
    } = useQuery(
        ['anonymous-user-list', queryParams],
        () => anonymousUserAPI.getList(currentPage, pageSize, searchCondition),
        {
            cacheTime: 2 * 60 * 1000, // 2분 캐시
            retry: 3,
            refetchOnWindowFocus: false,
        }
    );

    // 익명 사용자 생성 뮤테이션
    const {
        mutate: createAnonymousUserMutation,
        isLoading: createAnonymousUserLoading,
        error: createAnonymousUserError
    } = useMutation(
        'create-anonymous-user',
        (anonymousUserData) => anonymousUserAPI.create(anonymousUserData),
        {
            onSuccess: (response) => {
                if (response.success) {
                    toast.callCommonToastOpen('익명 사용자가 성공적으로 등록되었습니다.');
                    setShowCreateModal(false);
                    refetchAnonymousUsers();
                } else {
                    toast.callCommonToastOpen(response.message || '익명 사용자 등록에 실패했습니다.');
                }
            },
            onError: (error) => {
                console.error('익명 사용자 등록 실패:', error);
                toast.callCommonToastOpen('익명 사용자 등록 중 오류가 발생했습니다.');
            },
            invalidateQueries: [['anonymous-user-list']]
        }
    );

    // 익명 사용자 수정 뮤테이션
    const {
        mutate: updateAnonymousUserMutation,
        isLoading: updateAnonymousUserLoading,
        error: updateAnonymousUserError
    } = useMutation(
        'update-anonymous-user',
        ({ anonymousId, anonymousUserData }) => anonymousUserAPI.update(anonymousId, anonymousUserData),
        {
            onSuccess: (response) => {
                if (response.success) {
                    toast.callCommonToastOpen('익명 사용자 정보가 성공적으로 수정되었습니다.');
                    setShowEditModal(false);
                    refetchAnonymousUsers();
                } else {
                    toast.callCommonToastOpen(response.message || '익명 사용자 수정에 실패했습니다.');
                }
            },
            onError: (error) => {
                console.error('익명 사용자 수정 실패:', error);
                toast.callCommonToastOpen('익명 사용자 수정 중 오류가 발생했습니다.');
            },
            invalidateQueries: [['anonymous-user-list']]
        }
    );

    // 익명 사용자 삭제 뮤테이션
    const {
        mutate: deleteAnonymousUserMutation,
        isLoading: deleteAnonymousUserLoading,
        error: deleteAnonymousUserError
    } = useMutation(
        'delete-anonymous-user',
        ({ anonymousId, empId }) => anonymousUserAPI.delete(anonymousId, empId),
        {
            onSuccess: (response) => {
                if (response.success) {
                    toast.callCommonToastOpen('익명 사용자가 성공적으로 삭제되었습니다.');
                    refetchAnonymousUsers();
                } else {
                    toast.callCommonToastOpen(response.message || '익명 사용자 삭제에 실패했습니다.');
                }
            },
            onError: (error) => {
                console.error('익명 사용자 삭제 실패:', error);
                toast.callCommonToastOpen('익명 사용자 삭제 중 오류가 발생했습니다.');
            },
            invalidateQueries: [['anonymous-user-list']]
        }
    );

    // 데이터 설정
    useEffect(() => {
        if (anonymousUserData?.success) {
            const data = anonymousUserData.data;
            setAnonymousUsers(data.content || data || []);
            setTotalElements(data.totalElements || 0);
        }
    }, [anonymousUserData]);

    // 페이지 변경
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 검색 실행
    const handleSearch = () => {
        setCurrentPage(1);
    };

    // 검색 조건 초기화
    const handleReset = () => {
        setSearchCondition({
            nickname: '',
            useYn: ''
        });
        setCurrentPage(1);
    };

    // 새 익명 사용자 등록 모달 열기
    const handleCreateModalOpen = () => {
        setFormData({
            nickname: '',
            useYn: 'Y'
        });
        setShowCreateModal(true);
    };

    // 익명 사용자 수정 모달 열기
    const handleEditModalOpen = (user) => {
        setSelectedUser(user);
        setFormData({
            nickname: user.nickname,
            useYn: user.useYn
        });
        setShowEditModal(true);
    };

    // 익명 사용자 등록
    const handleCreate = async () => {
        if (!formData.nickname.trim()) {
            toast.callCommonToastOpen('닉네임을 입력해주세요.');
            return;
        }

        try {
            // 닉네임 중복 확인
            const exists = await anonymousUserAPI.checkNicknameExists(formData.nickname);
            if (exists) {
                toast.callCommonToastOpen('이미 사용 중인 닉네임입니다.');
                return;
            }

            createAnonymousUserMutation(formData);
        } catch (error) {
            console.error('익명 사용자 등록 실패:', error);
            toast.callCommonToastOpen('익명 사용자 등록에 실패했습니다.');
        }
    };

    // 익명 사용자 수정
    const handleEdit = async () => {
        if (!formData.nickname.trim()) {
            toast.callCommonToastOpen('닉네임을 입력해주세요.');
            return;
        }

        try {
            // 닉네임이 변경된 경우 중복 확인
            if (formData.nickname !== selectedUser.nickname) {
                const exists = await anonymousUserAPI.checkNicknameExists(formData.nickname);
                if (exists) {
                    toast.callCommonToastOpen('이미 사용 중인 닉네임입니다.');
                    return;
                }
            }

            updateAnonymousUserMutation({
                anonymousId: selectedUser.anonymousId,
                anonymousUserData: formData
            });
        } catch (error) {
            console.error('익명 사용자 수정 실패:', error);
            toast.callCommonToastOpen('익명 사용자 수정에 실패했습니다.');
        }
    };

    // 익명 사용자 삭제
    const handleDelete = (user) => {
        alert.ConfirmOpen('익명 사용자 삭제', '정말로 이 익명 사용자를 삭제하시겠습니까?', {
            okLabel: '삭제',
            cancelLabel: '취소',
            okCallback: () => {
                deleteAnonymousUserMutation({
                    anonymousId: user.anonymousId,
                    empId: 'ADMIN001' // 실제로는 로그인한 사용자 ID 사용
                });
            }
        });
    };

    // 로딩 상태 통합
    const loading = anonymousUserLoading || createAnonymousUserLoading || updateAnonymousUserLoading || deleteAnonymousUserLoading;

    // 에러 메시지 생성 함수
    const getErrorMessage = (error) => {
        if (!error) return '';

        if (typeof error === 'string') {
            return error;
        }

        if (error.type === 'response') {
            return `서버 오류 (${error.status}): ${error.message}`;
        } else if (error.type === 'network') {
            return '네트워크 연결 오류가 발생했습니다.';
        } else if (error.type === 'request') {
            return `요청 오류: ${error.message}`;
        }

        return error.message || '알 수 없는 오류가 발생했습니다.';
    };

    // 테이블 컬럼 정의
    const columns = [
        {
            key: 'anonymousId',
            label: 'ID',
            width: '80px'
        },
        {
            key: 'nickname',
            label: '닉네임',
            width: '150px'
        },
        {
            key: 'regDate',
            label: '등록일시',
            width: '180px',
            render: (value) => new Date(value).toLocaleString('ko-KR')
        },
        {
            key: 'consultationCount',
            label: '상담 건수',
            width: '100px',
            render: (value) => value || 0
        },
        {
            key: 'useYn',
            label: '사용여부',
            width: '100px',
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs ${value === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {value === 'Y' ? '사용' : '미사용'}
                </span>
            )
        },
        {
            key: 'actions',
            label: '관리',
            width: '150px',
            render: (_, row) => (
                <div className="flex gap-2">
                    <CmpButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditModalOpen(row)}
                    >
                        수정
                    </CmpButton>
                    <CmpButton
                        size="sm"
                        variant="outline"
                        color="red"
                        onClick={() => handleDelete(row)}
                    >
                        삭제
                    </CmpButton>
                </div>
            )
        }
    ];

    return (
        <PageWrapper title="익명 사용자 관리">
            {/* 에러 메시지 표시 */}
            {(anonymousUserError || createAnonymousUserError || updateAnonymousUserError || deleteAnonymousUserError) && (
                <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
                    <div className="font-medium text-red-800 mb-1">오류가 발생했습니다:</div>
                    <div className="text-sm text-red-600">
                        {anonymousUserError && <div>익명 사용자 목록: {getErrorMessage(anonymousUserError)}</div>}
                        {createAnonymousUserError && <div>익명 사용자 등록: {getErrorMessage(createAnonymousUserError)}</div>}
                        {updateAnonymousUserError && <div>익명 사용자 수정: {getErrorMessage(updateAnonymousUserError)}</div>}
                        {deleteAnonymousUserError && <div>익명 사용자 삭제: {getErrorMessage(deleteAnonymousUserError)}</div>}
                    </div>
                </div>
            )}

            {/* 검색 영역 */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            닉네임
                        </label>
                        <CmpInput
                            value={searchCondition.nickname}
                            onChange={(e) => setSearchCondition(prev => ({
                                ...prev,
                                nickname: e.target.value
                            }))}
                            placeholder="닉네임 검색"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            사용여부
                        </label>
                        <CmpSelect
                            value={searchCondition.useYn}
                            onChange={(e) => setSearchCondition(prev => ({
                                ...prev,
                                useYn: e.target.value
                            }))}
                        >
                            <option value="">전체</option>
                            <option value="Y">사용</option>
                            <option value="N">미사용</option>
                        </CmpSelect>
                    </div>
                    <div className="flex items-end gap-2">
                        <CmpButton onClick={handleSearch} disabled={loading}>
                            검색
                        </CmpButton>
                        <CmpButton variant="outline" onClick={handleReset} disabled={loading}>
                            초기화
                        </CmpButton>
                    </div>
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    익명 사용자 목록 ({totalElements}건)
                </h2>
                <CmpButton onClick={handleCreateModalOpen} disabled={loading}>
                    새 익명 사용자 등록
                </CmpButton>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-lg shadow-sm">
                <DataTable
                    columns={columns}
                    data={anonymousUsers}
                    loading={loading}
                    currentPage={currentPage}
                    totalElements={totalElements}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* 새 익명 사용자 등록 모달 */}
            <CommonModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="새 익명 사용자 등록"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            닉네임 *
                        </label>
                        <CmpInput
                            value={formData.nickname}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                nickname: e.target.value
                            }))}
                            placeholder="닉네임을 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            사용여부
                        </label>
                        <CmpSelect
                            value={formData.useYn}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                useYn: e.target.value
                            }))}
                        >
                            <option value="Y">사용</option>
                            <option value="N">미사용</option>
                        </CmpSelect>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <CmpButton variant="outline" onClick={() => setShowCreateModal(false)}>
                        취소
                    </CmpButton>
                    <CmpButton onClick={handleCreate} disabled={loading}>
                        {loading ? '등록 중...' : '등록'}
                    </CmpButton>
                </div>
            </CommonModal>

            {/* 익명 사용자 수정 모달 */}
            <CommonModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="익명 사용자 수정"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            닉네임 *
                        </label>
                        <CmpInput
                            value={formData.nickname}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                nickname: e.target.value
                            }))}
                            placeholder="닉네임을 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            사용여부
                        </label>
                        <CmpSelect
                            value={formData.useYn}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                useYn: e.target.value
                            }))}
                        >
                            <option value="Y">사용</option>
                            <option value="N">미사용</option>
                        </CmpSelect>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <CmpButton variant="outline" onClick={() => setShowEditModal(false)}>
                        취소
                    </CmpButton>
                    <CmpButton onClick={handleEdit} disabled={loading}>
                        {loading ? '수정 중...' : '수정'}
                    </CmpButton>
                </div>
            </CommonModal>
        </PageWrapper>
    );
}
