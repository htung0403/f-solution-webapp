import React, { useState } from 'react';
import { ActionCard } from '../components/ui/ActionCard';
import type { ActionCardProps } from '../components/ui/ActionCard';
import { Search, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import { moduleData } from '../data/moduleData';
import { ModuleCard } from '../components/ui/ModuleCard';
import upbankLogo from '../assets/Untitled-1-1.png';

const dashboardModules: ActionCardProps[] = [

];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chuc-nang' | 'danh-dau' | 'tat-ca'>('chuc-nang');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpBankSSO = async () => {
    try {
      const response = await fetch('/api/sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'upedu2023@gmail.com' }), // Hardcoded for test
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Có lỗi khi tạo SSO token: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('SSO connection error:', error);
      alert('Không thể kết nối đến máy chủ SSO');
    }
  };

  const handleVinhDanhRedirect = () => {
    window.open('https://fe-vinhdanh.vercel.app/', '_blank');
  };

  const allSections = Object.values(moduleData).flat();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2 text-foreground">
          Chào buổi tối, <span className="text-primary">Lê Minh Công</span> 👋
        </h1>
      </div>

      <div className={clsx(
        "bg-card rounded-xl shadow-sm border border-border p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 lg:mb-8 transition-all duration-300",
        activeTab === 'tat-ca' ? "w-full" : "max-w-fit"
      )}>
        <div className="flex bg-muted/20 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setActiveTab('chuc-nang')}
            className={clsx(
              "px-4 py-1.5 rounded-md text-[13px] font-bold transition-all duration-200",
              activeTab === 'chuc-nang'
                ? "bg-card text-primary shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Chức năng
          </button>
          <button
            onClick={() => setActiveTab('danh-dau')}
            className={clsx(
              "px-4 py-1.5 rounded-md text-[13px] font-bold transition-all duration-200",
              activeTab === 'danh-dau'
                ? "bg-card text-primary shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Đánh dấu
          </button>
          <button
            onClick={() => setActiveTab('tat-ca')}
            className={clsx(
              "px-4 py-1.5 rounded-md text-[13px] font-bold transition-all duration-200",
              activeTab === 'tat-ca'
                ? "bg-card text-primary shadow-sm ring-1 ring-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Tất cả
          </button>
        </div>

        {/* Search Bar (Only shown on "Tất cả" tab) */}
        {activeTab === 'tat-ca' && (
          <div className="flex-1 flex items-center bg-muted/20 rounded-lg px-3 py-1.5 animate-in slide-in-from-left-2 duration-300">
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm module, chức năng..."
              className="bg-transparent border-none outline-none text-[13px] text-foreground w-full ml-2 placeholder:text-muted-foreground/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {activeTab === 'chuc-nang' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-5">
          {dashboardModules.map((module, idx) => (
            <ActionCard
              key={idx}
              {...module}
            />
          ))}
          {/* Action Card UpBank tích hợp SSO */}
          <ActionCard
            imageSrc={upbankLogo}
            title="Truy cập UpBank"
            description="Chuyển hướng một chạm an toàn đến ngân hàng nội bộ."
            href="#"
            colorScheme="blue"
            onClick={handleUpBankSSO}
          />
          {/* Action Card Vinh Danh (Link ngoài) */}
          <ActionCard
            icon={Trophy}
            title="Bảng Vinh Danh"
            description="Cổng thông tin tuyên dương và khen thưởng cá nhân."
            href="#"
            colorScheme="amber"
            onClick={handleVinhDanhRedirect}
          />
        </div>
      )}

      {activeTab === 'danh-dau' && (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
          Chưa có module nào được đánh dấu.
        </div>
      )}

      {activeTab === 'tat-ca' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="space-y-8">
            {allSections.map((section, idx) => {
              const filteredItems = section.items.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                  <h2 className="text-[14px] font-bold text-primary mb-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-1 h-4 bg-primary rounded-full"></span>
                      <span>{section.section}</span>
                    </div>
                    <div className="h-px flex-1 bg-border/60"></div>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredItems.map((item, itemIdx) => (
                      <ModuleCard key={itemIdx} {...item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
