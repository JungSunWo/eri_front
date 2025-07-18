'use client';

import { useLnbMenuStore } from '@/common/store/lnbMenuStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeaderArea from './HeaderArea';


const LnbLayout = ({ children, title }) => {
  const menuItems = useLnbMenuStore((state) => state.menuItems);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');

  // 메뉴 클릭 핸들러
  const handleMenuClick = (e, item) => {
    e.preventDefault();
    setActiveMenu(item.key);
    const targetId = item.href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 스크롤 위치에 따른 활성 메뉴 감지
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => ({
        key: item.key,
        element: document.getElementById(item.href.replace('#', ''))
      })).filter(section => section.element);
      const scrollPosition = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element.offsetTop <= scrollPosition) {
          setActiveMenu(section.key);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems]);

  return (
    <>
      <HeaderArea />
      <div className="flex h-screen bg-gray-50" style={{ marginTop: 'var(--header-height)' }}>
        {/* Left Navigation Bar */}
        <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title={isCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          {/* Menu Items */}
          <nav className="p-2">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    onClick={(e) => handleMenuClick(e, item)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeMenu === item.key
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {item.icon && (
                      <span className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                        {item.icon}
                      </span>
                    )}
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

    </>
  );
};

export default LnbLayout;
