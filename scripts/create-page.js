#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 사용법: node scripts/create-page.js <page-name>
const pageName = process.argv[2];

if (!pageName) {
    console.error('사용법: node scripts/create-page.js <page-name>');
    process.exit(1);
}

const pageTemplate = `'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { CmpSection, CmpSectionBody, CmpSectionHead } from '@/components/contents/cmp_section/cmp_section';
import { CmpButton } from '@/components/button/cmp_button';
import { usePageMoveStore } from '@/common/store/pageMoveStore';

export default function ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page() {
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
          <h2 className="cmp_section_tit">${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h2>
        </CmpSectionHead>
        <CmpSectionBody>
          <div className="w-full max-w-6xl bg-white rounded-3xl shadow p-8">
            <p>${pageName} 페이지 내용</p>
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
      title="${pageName.charAt(0).toUpperCase() + pageName.slice(1)}"
      subtitle="${pageName.charAt(0).toUpperCase() + pageName.slice(1)} 페이지"
      toasts={toasts}
    >
      {drawMainContent()}
    </PageWrapper>
  );
}
`;

const pageDir = path.join(__dirname, '..', 'src', 'app', '(page)', pageName);
const pageFile = path.join(pageDir, 'page.js');

// 디렉토리 생성
if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
}

// 파일 생성
fs.writeFileSync(pageFile, pageTemplate);

console.log(`✅ ${pageName} 페이지가 생성되었습니다: ${pageFile}`);
console.log(`📁 디렉토리: ${pageDir}`);
console.log(`�� 파일: ${pageFile}`);
