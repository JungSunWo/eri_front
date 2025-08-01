'use client';

import anonymousUserAPI from '@/app/core/services/api/anonymousUserAPI';
import CmpButton from '@/app/shared/components/ui/CmpButton';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import CommonModal from '@/app/shared/components/ui/CommonModal';
import DataTable from '@/app/shared/components/ui/DataTable';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert } from '@/app/shared/utils/ui_com';
import { useEffect, useState } from 'react';

export default function AnonymousUserManagementPage() {
    // 상태 관리
    const [anonymousUsers, setAnonymousUsers] = useState([]);
    const [loading, setLoading] = useState(false);
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

    // 익명 사용자 목록 조회
    const fetchAnonymousUsers = async () => {
        setLoading(true);
        try {
            const response = await anonymousUserAPI.getList(currentPage, pageSize, searchCondition);
            setAnonymousUsers(response.content || []);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('익명 사용자 목록 조회 실패:', error);
            alert('익명 사용자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 검색 실행
    const handleSearch = () => {
        setCurrentPage(1);
        fetchAnonymousUsers();
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
            alert('닉네임을 입력해주세요.');
            return;
        }

        try {
            // 닉네임 중복 확인
            const exists = await anonymousUserAPI.checkNicknameExists(formData.nickname);
            if (exists) {
                alert('이미 사용 중인 닉네임입니다.');
                return;
            }

            await anonymousUserAPI.create(formData);
            alert('익명 사용자가 등록되었습니다.');
            setShowCreateModal(false);
            fetchAnonymousUsers();
        } catch (error) {
            console.error('익명 사용자 등록 실패:', error);
            alert('익명 사용자 등록에 실패했습니다.');
        }
    };

    // 익명 사용자 수정
    const handleEdit = async () => {
        if (!formData.nickname.trim()) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        try {
            // 닉네임이 변경된 경우 중복 확인
            if (formData.nickname !== selectedUser.nickname) {
                const exists = await anonymousUserAPI.checkNicknameExists(formData.nickname);
                if (exists) {
                    alert('이미 사용 중인 닉네임입니다.');
                    return;
                }
            }

            await anonymousUserAPI.update(selectedUser.anonymousId, formData);
            alert('익명 사용자가 수정되었습니다.');
            setShowEditModal(false);
            fetchAnonymousUsers();
        } catch (error) {
            console.error('익명 사용자 수정 실패:', error);
            alert('익명 사용자 수정에 실패했습니다.');
        }
    };

    // 익명 사용자 삭제
    const handleDelete = async (user) => {
        if (!confirm('정말 삭제하시겠습니까?')) {
            return;
        }

        try {
            await anonymousUserAPI.delete(user.anonymousId, 'ADMIN001'); // 실제로는 로그인한 사용자 ID 사용
            alert('익명 사용자가 삭제되었습니다.');
            fetchAnonymousUsers();
        } catch (error) {
            console.error('익명 사용자 삭제 실패:', error);
            alert('익명 사용자 삭제에 실패했습니다.');
        }
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

    // 초기 데이터 로드
    useEffect(() => {
        fetchAnonymousUsers();
    }, [currentPage]);

    return (
        <PageWrapper title="익명 사용자 관리">
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
                        <CmpButton onClick={handleSearch}>
                            검색
                        </CmpButton>
                        <CmpButton variant="outline" onClick={handleReset}>
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
                <CmpButton onClick={handleCreateModalOpen}>
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
                    <CmpButton onClick={handleCreate}>
                        등록
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
                    <CmpButton onClick={handleEdit}>
                        수정
                    </CmpButton>
                </div>
            </CommonModal>
        </PageWrapper>
    );
}
