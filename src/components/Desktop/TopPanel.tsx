import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Volume2, 
  Battery, 
  Power, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface TopPanelProps {
  onOpenActivities: () => void;
  activeWindowTitle?: string;
  onOpenSettings: () => void;
  onSwitchView: (view: 'desktop' | 'installer' | 'guide' | 'vnc') => void;
}

export const TopPanel: React.FC<TopPanelProps> = ({
  onOpenActivities,
  activeWindowTitle,
  onOpenSettings,
  onSwitchView,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [volume, setVolume] = useState(85);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', weekday: 'short' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header 
      id="ubuntu-top-panel" 
      className="h-7 w-full bg-[#111111]/95 backdrop-blur-md text-[#E6E6E6] text-xs flex items-center justify-between px-3 select-none z-50 border-b border-black/40 shadow-sm font-sans"
    >
      {/* Sol: Activities & Aktif Pencere */}
      <div className="flex items-center gap-3">
        <button
          id="activities-btn"
          onClick={onOpenActivities}
          className="px-2 py-0.5 rounded font-medium hover:bg-white/10 active:bg-white/20 transition-colors text-white flex items-center gap-1.5"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#E95420]" />
          Etkinlikler
        </button>

        {activeWindowTitle && (
          <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[11px] border-l border-zinc-700 pl-3">
            <span className="font-semibold text-zinc-200">{activeWindowTitle}</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full">
          <Cpu className="w-3 h-3 text-emerald-400" />
          <span>ARM64 (aarch64)</span>
          <span className="text-zinc-500">•</span>
          <span>Rootsuz (PRoot)</span>
        </div>
      </div>

      {/* Orta: Saat ve Tarih */}
      <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded transition-colors text-white font-medium">
        <span>{dateStr}</span>
        <span className="font-semibold">{timeStr}</span>
      </div>

      {/* Sağ: Sistem Tepsisi ve Menü */}
      <div className="relative flex items-center gap-2">
        <button
          id="system-status-trigger"
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          <Wifi className="w-3.5 h-3.5 text-zinc-300" />
          <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
          <div className="flex items-center gap-0.5">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono text-zinc-300">92%</span>
          </div>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        </button>

        {/* Dropdown Menü */}
        {showStatusMenu && (
          <div 
            id="status-dropdown-menu"
            className="absolute right-0 top-8 w-72 bg-[#1E1E1E] border border-zinc-700/80 rounded-xl shadow-2xl p-3 z-50 text-zinc-200 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="pb-2 mb-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Ubuntu 24.04 LTS (Noble)</span>
              <span className="text-[10px] bg-[#E95420] text-white px-1.5 py-0.5 rounded">ARM64</span>
            </div>

            {/* Ses Kontrolü */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5" /> Ses (PulseAudio TCP)</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#E95420]"
              />
            </div>

            {/* Hızlı Kısayollar */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <button
                onClick={() => {
                  setShowStatusMenu(false);
                  onSwitchView('installer');
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 transition-colors text-left"
              >
                <Sliders className="w-3.5 h-3.5 text-[#E95420]" />
                <div>
                  <div className="font-medium text-white">Script Üretici</div>
                  <div className="text-[10px] text-zinc-400">Termux Komutu</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowStatusMenu(false);
                  onSwitchView('guide');
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 transition-colors text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <div className="font-medium text-white">Android İpuçları</div>
                  <div className="text-[10px] text-zinc-400">Rootsuz Ayarlar</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                setShowStatusMenu(false);
                onOpenSettings();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-xs text-zinc-300 flex items-center justify-between transition-colors"
            >
              <span>Masaüstü & Ekran Ayarları</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
