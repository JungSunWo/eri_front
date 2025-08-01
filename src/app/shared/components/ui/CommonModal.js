'use client';

import { useEffect } from 'react';

export default function CommonModal({ isOpen, onClose, title, children, width = 'w-96', size, className = '' }) {
  // 모달이 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body에 스크롤 방지 스타일 적용
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // 모달이 닫힐 때 스크롤 복원
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // size prop에 따른 width 설정
  let modalWidth = width;
  if (size === 'full') {
    modalWidth = 'w-11/12 max-w-7xl';
  } else if (size === 'xl') {
    modalWidth = 'w-5/6 max-w-6xl';
  } else if (size === 'lg') {
    modalWidth = 'w-4/5 max-w-4xl';
  } else if (size === 'md') {
    modalWidth = 'w-2/3 max-w-2xl';
  } else if (size === 'sm') {
    modalWidth = 'w-1/2 max-w-md';
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`relative border shadow-lg rounded-md bg-white ${modalWidth} ${className} max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
