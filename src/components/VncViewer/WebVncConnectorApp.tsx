import React, { useState } from 'react';
import { 
  MonitorPlay, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  MousePointer, 
  Sliders, 
  HelpCircle,
  PlayCircle,
  AlertCircle
} from 'lucide-react';

export const WebVncConnectorApp: React.FC = () => {
  const [url, setUrl] = useState('http://127.0.0.1:6080/vnc.html?autoconnect=true&resize=scale');
  const [connectedUrl, setConnectedUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'embedded' | 'new_tab'>('embedded');

  const handleConnect = () => {
    setConnectedUrl(url);
  };

  const handleOpenNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] text-zinc-200 text-xs select-none">
      {/* Üst Bağlantı Çubuğu */}
      <div className="h-11 bg-[#1F1F1F] border-b border-zinc-800 px-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <MonitorPlay className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://127.0.0.1:6080/vnc.html"
            className="flex-1 px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-xs outline-none focus:border-purple-500"
          />
          <button
            onClick={handleConnect}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center gap-1 shrink-0"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Bağlan</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNewTab}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700/60"
            title="Ayrı Tarayıcı Sekmesinde Aç"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Yeni Sekmede Aç</span>
          </button>
        </div>
      </div>

      {/* Ana Görünüm Alanı */}
      <div className="flex-1 relative bg-black flex flex-col items-center justify-center overflow-hidden">
        {connectedUrl ? (
          <div className="w-full h-full relative">
            <iframe
              src={connectedUrl}
              title="noVNC Desktop Session"
              className="w-full h-full border-none"
              allow="clipboard-read; clipboard-write; fullscreen"
            />
            {/* Bağlantı Bilgilendirme Notu */}
            <div className="absolute bottom-2 left-2 bg-zinc-900/90 border border-zinc-700 px-3 py-1 rounded-full text-[10px] text-zinc-400 pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>noVNC Port 6080 Hedefleniyor</span>
            </div>
          </div>
        ) : (
          <div className="max-w-md p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
              <MonitorPlay className="w-8 h-8" />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white">Canlı noVNC Masaüstü Bağlantısı</h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Android cihazınızdaki Termux içinde <code>start-desktop</code> komutunu verdikten sonra
                buradan veya doğrudan tarayıcınızdan tek tıkla bağlanabilirsiniz.
              </p>
            </div>

            <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/50 text-left space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-zinc-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Varsayılan Yerel Adres:</span>
              </div>
              <code className="block p-1.5 bg-black/60 rounded text-emerald-300 font-mono text-[10px] select-all">
                http://127.0.0.1:6080/vnc.html
              </code>
              <p className="text-zinc-500 text-[10px]">
                * Webview içinde tam ekran kullanmak için "Bağlan" butonuna basın.
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors text-xs flex items-center gap-1.5 shadow-md"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Bu Pencerede Bağlan</span>
              </button>
              <button
                onClick={handleOpenNewTab}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium transition-colors text-xs flex items-center gap-1.5 border border-zinc-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ayrı Sekmede Aç</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
