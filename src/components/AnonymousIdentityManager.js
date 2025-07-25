'use client';

import CmpButton from '@/components/ui/CmpButton';
import CommonModal from '@/components/ui/CommonModal';
import { useState } from 'react';
import styled from 'styled-components';

const AnonymousIdentityManager = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [selectedIdentityGroup, setSelectedIdentityGroup] = useState(null);

    // 샘플 데이터 (실제로는 API에서 가져올 예정)
    const sampleGroups = [
        {
            groupSeq: 1,
            groupName: '동일 사용자 그룹 1',
            groupDesc: '문체와 상담 패턴이 유사하여 동일 사용자로 판단',
            judgeEmpId: 'ADMIN001',
            memberCount: 2,
            confidenceLevel: 'H',
            judgeDate: '2024-01-15'
        },
        {
            groupSeq: 2,
            groupName: '동일 사용자 그룹 2',
            groupDesc: '상담 시간대와 주제가 유사하여 동일 사용자로 추정',
            judgeEmpId: 'ADMIN002',
            memberCount: 3,
            confidenceLevel: 'M',
            judgeDate: '2024-01-16'
        }
    ];

    const sampleMembers = [
        {
            memberSeq: 1,
            nickname: '익명사용자1',
            addEmpId: 'ADMIN001',
            addDate: '2024-01-15',
            addReason: '문체와 상담 스타일이 동일'
        },
        {
            memberSeq: 2,
            nickname: '익명사용자2',
            addEmpId: 'ADMIN001',
            addDate: '2024-01-15',
            addReason: '동일한 문제 상황과 해결 방식을 제시'
        }
    ];

    // 신뢰도별 스타일
    const getConfidenceStyle = (confidence) => {
        switch (confidence) {
            case 'H': return { color: '#51cf66', fontWeight: 'bold' };
            case 'M': return { color: '#ffa726', fontWeight: 'bold' };
            case 'L': return { color: '#868e96', fontWeight: 'bold' };
            default: return {};
        }
    };

    // 신뢰도 옵션
    const confidenceOptions = [
        { value: 'H', label: '높음' },
        { value: 'M', label: '보통' },
        { value: 'L', label: '낮음' }
    ];

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="익명 사용자 동일성 판단"
            size="large"
        >
            <Container>
                <Section>
                    <SectionHeader>
                        <h3>동일성 그룹 목록</h3>
                        <CmpButton
                            size="small"
                            variant="primary"
                        >
                            새 그룹 생성
                        </CmpButton>
                    </SectionHeader>

                    {loading ? (
                        <LoadingText>로딩 중...</LoadingText>
                    ) : (
                        <GroupList>
                            {sampleGroups.map(group => (
                                <GroupItem
                                    key={group.groupSeq}
                                    onClick={() => setSelectedIdentityGroup(group)}
                                    isSelected={selectedIdentityGroup?.groupSeq === group.groupSeq}
                                >
                                    <GroupInfo>
                                        <GroupName>{group.groupName}</GroupName>
                                        <GroupDesc>{group.groupDesc}</GroupDesc>
                                        <GroupMeta>
                                            <span>판단자: {group.judgeEmpId}</span>
                                            <span>멤버: {group.memberCount}명</span>
                                            <span style={getConfidenceStyle(group.confidenceLevel)}>
                                                신뢰도: {confidenceOptions.find(opt => opt.value === group.confidenceLevel)?.label}
                                            </span>
                                            <span>판단일: {new Date(group.judgeDate).toLocaleDateString()}</span>
                                        </GroupMeta>
                                    </GroupInfo>
                                    <GroupActions>
                                        <CmpButton
                                            size="small"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 삭제 로직
                                            }}
                                        >
                                            삭제
                                        </CmpButton>
                                    </GroupActions>
                                </GroupItem>
                            ))}
                        </GroupList>
                    )}
                </Section>

                {selectedIdentityGroup && (
                    <Section>
                        <SectionHeader>
                            <h3>그룹 멤버 목록 - {selectedIdentityGroup.groupName}</h3>
                            <CmpButton
                                size="small"
                                variant="primary"
                            >
                                멤버 추가
                            </CmpButton>
                        </SectionHeader>

                        <MemberList>
                            {sampleMembers.map(member => (
                                <MemberItem key={member.memberSeq}>
                                    <MemberInfo>
                                        <MemberName>{member.nickname}</MemberName>
                                        <MemberMeta>
                                            <span>추가자: {member.addEmpId}</span>
                                            <span>추가일: {new Date(member.addDate).toLocaleDateString()}</span>
                                            <span>사유: {member.addReason}</span>
                                        </MemberMeta>
                                    </MemberInfo>
                                    <CmpButton
                                        size="small"
                                        variant="outline"
                                        onClick={() => {
                                            // 제거 로직
                                        }}
                                    >
                                        제거
                                    </CmpButton>
                                </MemberItem>
                            ))}
                        </MemberList>
                    </Section>
                )}
            </Container>

            <ModalFooter>
                <CmpButton onClick={onClose} variant="outline">
                    닫기
                </CmpButton>
            </ModalFooter>
        </CommonModal>
    );
};

const Container = styled.div`
    max-height: 60vh;
    overflow-y: auto;
`;

const Section = styled.div`
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #dee2e6;

    h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
    }
`;

const GroupList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const GroupItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    background-color: ${props => props.isSelected ? '#f0f8ff' : 'white'};

    &:hover {
        background-color: #f0f8ff;
    }
`;

const GroupInfo = styled.div`
    flex: 1;
`;

const GroupName = styled.div`
    font-weight: bold;
    font-size: 16px;
    color: #1a1a1a;
`;

const GroupDesc = styled.div`
    font-size: 14px;
    color: #666;
    margin-top: 4px;
`;

const GroupMeta = styled.div`
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: #868e96;
    margin-top: 8px;
    flex-wrap: wrap;
`;

const GroupActions = styled.div`
    display: flex;
    gap: 8px;
`;

const MemberList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const MemberItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
`;

const MemberInfo = styled.div`
    flex: 1;
`;

const MemberName = styled.div`
    font-weight: bold;
    font-size: 15px;
    color: #1a1a1a;
`;

const MemberMeta = styled.div`
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: #868e96;
    margin-top: 4px;
    flex-wrap: wrap;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: #666;
    font-style: italic;
`;

export default AnonymousIdentityManager;
