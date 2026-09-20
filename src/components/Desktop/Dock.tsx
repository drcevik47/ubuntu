import React from 'react';
import { 
  Terminal, 
  Folder, 
  FileEdit, 
  Package, 
  Activity, 
  Settings, 
  Code2, 
  BookOpen, 
  MonitorPlay,
  Grid,
  Smartphone
} from 'lucide-react';
import { WindowId } from '../../types';

interface DockItem {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface DockProps {
  openWindows: Record<WindowId, boolean>;
  activeWindow: WindowId | null;
  onToggleWindow: (id: WindowId) => void;
  onOpenAppGrid: () => void;
}

export const Dock: React.FC<DockProps> = ({
  openWindows,
  activeWindow,
  onToggleWindow,
  onOpenAppGrid,
}) => {
  const dockItems: DockItem[] = [
    {
      id: 'terminal',
      label: 'Terminal (ARM64 Bash)',
      icon: <Terminal className="w-5 h-5 text-white" />,
      color: 'bg-black/80 border border-zinc-700',
    },
    {
      id: 'files',
      label: 'Dosyalar (Nautilus /sdcard)',
      icon: <Folder className="w-5 h-5 text-amber-300" />,
      color: 'bg-blue-600/80',
    },
    {
      id: 'editor',
      label: 'Metin & Kod Düzenleyici',
      icon: <FileEdit className="w-5 h-5 text-emerald-300" />,
      color: 'bg-emerald-700/80',
    },
    {
      id: 'software',
      label: 'Ubuntu Yazılım Merkezi',
      icon: <Package className="w-5 h-5 text-orange-200" />,
      color: 'bg-[#E95420]',
    },
    {
      id: 'monitor',
      label: 'Sistem & Donanım Kaynakları',
      icon: <Activity className="w-5 h-5 text-cyan-300" />,
      color: 'bg-cyan-700/80',
    },
    {
      id: 'standalone_apk',
      label: 'Tek Tıkla APK (All-in-One) Mimarisi',
      icon: <Smartphone className="w-5 h-5 text-emerald-200" />,
      color: 'bg-emerald-600/90',
    },
    {
      id: 'installer',
      label: 'Android Termux Script Üretici',
      icon: <Code2 className="w-5 h-5 text-amber-200" />,
      color: 'bg-amber-600/90',
    },
    {
      id: 'guide',
      label: 'Android Rootsuz Kurulum Rehberi',
      icon: <BookOpen className="w-5 h-5 text-indigo-200" />,
      color: 'bg-indigo-600/90',
    },
    {
      id: 'vnc_connect',
      label: 'Canlı noVNC Web Bağlantısı',
      icon: <MonitorPlay className="w-5 h-5 text-purple-200" />,
      color: 'bg-purple-600/90',
    },
    {
      id: 'settings',
      label: 'Sistem Ayarları',
      icon: <Settings className="w-5 h-5 text-zinc-200" />,
      color: 'bg-zinc-700/80',
    },
  ];

  return (
    <aside 
      id="ubuntu-dock"
      className="fixed left-0 top-7 bottom-0 w-14 bg-black/60 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-3 z-40 select-none shadow-2xl justify-between"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        {dockItems.map((item) => {
          const isOpen = openWindows[item.id];
          const isActive = activeWindow === item.id;

          return (
            <div key={item.id} className="relative group flex items-center justify-center w-full">
              {/* Çalışıyor Gösterge Noktası */}
              {isOpen && (
                <span 
                  className={`absolute left-1 w-1.5 h-1.5 rounded-full transition-all ${
                    isActive ? 'bg-[#E95420] ring-2 ring-[#E95420]/40' : 'bg-zinc-400'
                  }`} 
                />
              )}

              {/* Simge Butonu */}
              <button
                id={`dock-btn-${item.id}`}
                onClick={() => onToggleWindow(item.id)}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 transform group-hover:scale-110 active:scale-95 shadow-md ${
                  item.color
                } ${
                  isActive ? 'ring-2 ring-white/60 shadow-lg' : 'hover:brightness-110'
                }`}
              >
                {item.icon}
              </button>

              {/* Tooltip */}
              <div className="absolute left-16 px-2.5 py-1 bg-zinc-900/95 border border-zinc-700 text-white text-[11px] font-medium rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt Uygulama Listesi Butonu */}
      <div className="relative group w-full flex justify-center pt-2 border-t border-white/10">
        <button
          id="dock-btn-appgrid"
          onClick={onOpenAppGrid}
          title="Tüm Uygulamaları Göster"
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-all transform hover:scale-105 active:scale-95"
        >
          <Grid className="w-5 h-5" />
        </button>
        <div className="absolute left-16 px-2.5 py-1 bg-zinc-900/95 border border-zinc-700 text-white text-[11px] font-medium rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Tüm Uygulamalar
        </div>
      </div>
    </aside>
  );
};
