import React from 'react';

interface CommunityTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'groups', label: 'Groups' },
    { id: 'events', label: 'Events' },
    { id: 'marketplace', label: 'Marketplace' }
  ];

  return (
    <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-md mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-colors
            ${activeTab === tab.id
              ? 'bg-green-700 text-white'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}