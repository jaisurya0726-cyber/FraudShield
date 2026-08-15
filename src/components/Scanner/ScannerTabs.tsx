import React from 'react';
import {
  MessageSquare,
  Mail,
  Globe,
  Image as ImageIcon,
  QrCode,
  PhoneCall,
  CreditCard,
} from 'lucide-react';
import { ScanType } from '../../types';

interface ScannerTabsProps {
  activeTab: ScanType;
  onTabChange: (tab: ScanType) => void;
}

export const ScannerTabs: React.FC<ScannerTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'message' as ScanType, label: 'Message / SMS', icon: MessageSquare, badge: 'WhatsApp / Chat' },
    { id: 'email' as ScanType, label: 'Email Scanner', icon: Mail, badge: 'Headers & Body' },
    { id: 'url' as ScanType, label: 'URL & Domain', icon: Globe, badge: 'Reputation & TLD' },
    { id: 'image' as ScanType, label: 'Screenshot (OCR)', icon: ImageIcon, badge: 'Vision AI' },
    { id: 'qr' as ScanType, label: 'QR Code', icon: QrCode, badge: 'Payload Check' },
    { id: 'phone' as ScanType, label: 'Phone Lookup', icon: PhoneCall, badge: 'Carrier / Spam' },
    { id: 'payment' as ScanType, label: 'Payment / UPI', icon: CreditCard, badge: 'Fraud Filter' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
      <div className="flex items-center gap-2 min-w-max p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800/90 shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="font-semibold leading-tight">{tab.label}</div>
                <div className={`text-[10px] font-normal ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                  {tab.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
