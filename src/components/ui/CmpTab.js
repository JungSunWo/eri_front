'use client';

const CmpTab = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  inactiveTabClassName = ''
}) => {
  const defaultActiveClass = 'border-b-2 border-blue-600 text-blue-600';
  const defaultInactiveClass = 'text-gray-500';

  return (
    <div className={`flex border-b mb-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`px-6 py-2 font-bold transition-colors ${
            activeTab === tab.key
              ? activeTabClassName || defaultActiveClass
              : inactiveTabClassName || defaultInactiveClass
          } ${tabClassName}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CmpTab;
