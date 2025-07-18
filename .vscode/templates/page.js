/**
 * @File Name      : page.js
 * @File path      : D:\eri_front\.vscode\templates\page.js
 * @author         :
 * @Description    :
 * @History        : 20250704  author  최초 신규
 **/
'use client'

import { usePageMoveStore } from '@/common/store/pageMoveStore';
import { CmpButton } from '@/components/button/cmp_button';
import { CmpSection, CmpSectionBody, CmpSectionHead } from '@/components/contents/cmp_section/cmp_section';
import PageWrapper from '@/components/layout/PageWrapper';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PageNamePage() {
    const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
    const router = useRouter();

    // State variables
    const [loading, setLoading] = useState(false);

    // Functions
    const handleAction = () => {
        console.log('Action triggered');
    };

    const toastClose = () => {
        console.log('Toast closed');
    };

    // Draw functions
    const drawMainContent = () => {
        return (
            <CmpSection>
                <CmpSectionHead>
                    <h2 className="cmp_section_tit">Section Title</h2>
                </CmpSectionHead>
                <CmpSectionBody>
                    <div className="w-full max-w-6xl bg-white rounded-3xl shadow p-8">
                        <p>Main content goes here</p>
                        <CmpButton label="Action" click={handleAction} />
                    </div>
                </CmpSectionBody>
            </CmpSection>
        );
    };

    const toasts = [
        {
            id: 'successToast',
            message: 'Success message',
            type: 'success',
            onClose: toastClose
        }
    ];

    return (
        <PageWrapper
            title="Page Title"
            subtitle="Page Subtitle"
            toasts={toasts}
        >
            {drawMainContent()}
        </PageWrapper>
    );
}
