import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Sparkles, 
  Sliders, 
  ExternalLink,
  Volume2,
  Monitor,
  Cpu
} from 'lucide-react';
import { InstallerConfig } from '../../types';
import { generateInstallScript } from '../../data/scripts';

export const ScriptGeneratorApp: React.FC = () => {
  const [config, setConfig] = useState<InstallerConfig>({
    distro: 'ubuntu-24.04',
    desktopEnv: 'xfce4',
    displayMode: 'novnc',
    resolution: 'adaptive',
    customResolution: '1920x1080',
    port: 6080,
    includeAudio: true,
    includeDevTools: true,
    includeBrowser: true,
    includeCodeServer: false,
    username: 'ubuntu',
  });

  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const scriptContent = generateInstallScript(config);

  const oneLiner = `pkg update -y && pkg install -y git wget curl proot-distro && curl -sL https://raw.githubusercontent.com/AndroLinux/arm64-scripts/main/setup-ubuntu.sh -o setup.sh && bash setup.sh`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOneLiner = () => {
    navigator.clipboard.writeText(oneLiner);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([scriptContent], { type: 'text/x-shellscript' });
    element.href = URL.createObjectURL(file);
    element.download = 'setup-ubuntu-android.sh';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] text-zinc-200 text-xs select-none">
      {/* Üst Başlık */}
      <div className="p-4 bg-[#202020] border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/90 flex items-center justify-center text-white shadow-md">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Android Termux Kurulum Scripti Üreticisi</h2>
            <p className="text-[11px] text-zinc-400">
              Root gerektirmeyen, ARM64 uyumlu Ubuntu 24.04 + noVNC Web Masaüstü Scripti
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs transition-colors border border-zinc-700"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span>Scripti İndir (.sh)</span>
          </button>
          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E95420] hover:bg-[#d84a1b] text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı!' : 'Tüm Scripti Kopyala'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sol Yapılandırma Paneli */}
        <div className="w-full md:w-80 bg-[#151515] border-r border-zinc-800 p-4 overflow-y-auto space-y-4">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#E95420]" />
            <span>Kurulum Parametreleri</span>
          </div>

          {/* Masaüstü Ortamı */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-xs">Masaüstü Ortamı</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['xfce4', 'lxde', 'mate'] as const).map((de) => (
                <button
                  key={de}
                  onClick={() => setConfig({ ...config, desktopEnv: de })}
                  className={`py-1.5 rounded-lg border text-[11px] font-medium uppercase transition-colors ${
                    config.desktopEnv === de
                      ? 'bg-[#E95420] border-[#E95420] text-white'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                >
                  {de}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500">
              * XFCE4: Android'de en az RAM tüketen ve en akıcı çalışan ortamdır.
            </p>
          </div>

          {/* Görüntü Modu */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-xs">Görüntüleme Yöntemi</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfig({ ...config, displayMode: 'novnc' })}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  config.displayMode === 'novnc'
                    ? 'bg-[#E95420]/20 border-[#E95420] text-white'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-xs text-white">noVNC (Web)</div>
                <div className="text-[10px] text-zinc-400">Tarayıcı & WebView</div>
              </button>

              <button
                onClick={() => setConfig({ ...config, displayMode: 'termux-x11' })}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  config.displayMode === 'termux-x11'
                    ? 'bg-[#E95420]/20 border-[#E95420] text-white'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-xs text-white">Termux:X11</div>
                <div className="text-[10px] text-zinc-400">Doğrudan APK</div>
              </button>
            </div>
          </div>

          {/* noVNC Web Port */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium text-xs">Web Bağlantı Portu</label>
            <input
              type="number"
              value={config.port}
              onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs font-mono outline-none focus:border-[#E95420]"
            />
            <p className="text-[10px] text-zinc-500">
              Bağlantı adresi: http://127.0.0.1:{config.port}/vnc.html
            </p>
          </div>

          {/* Ek Paket Seçenekleri */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-zinc-300 font-medium text-xs block">Eklentiler ve Paketler</label>
            
            <label className="flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeAudio}
                onChange={(e) => setConfig({ ...config, includeAudio: e.target.checked })}
                className="rounded accent-[#E95420]"
              />
              <span>PulseAudio Ses Köprüsü (Telefon Hoparlörü)</span>
            </label>

            <label className="flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeDevTools}
                onChange={(e) => setConfig({ ...config, includeDevTools: e.target.checked })}
                className="rounded accent-[#E95420]"
              />
              <span>Geliştirici Araçları (Python 3, Git, C/C++ GCC)</span>
            </label>

            <label className="flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeBrowser}
                onChange={(e) => setConfig({ ...config, includeBrowser: e.target.checked })}
                className="rounded accent-[#E95420]"
              />
              <span>Chromium Web Tarayıcı (ARM64 No-Sandbox)</span>
            </label>
          </div>
        </div>

        {/* Sağ Kod ve Çalıştırma Alanı */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#121212]">
          {/* Hızlı Tek Satır Kılavuzu */}
          <div className="p-3 bg-zinc-900 border-b border-zinc-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-white font-medium text-xs">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Termux İçinde 1 Komutla Kurulum:</span>
              </div>
              <button
                onClick={handleCopyOneLiner}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {copiedCurl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'Kopyalandı' : 'Komutu Kopyala'}</span>
              </button>
            </div>
            <div className="p-2 bg-black/80 rounded-lg border border-zinc-800 font-mono text-[11px] text-emerald-300 break-all select-all">
              {oneLiner}
            </div>
          </div>

          {/* Script Kodu */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed selection:bg-[#E95420]/30 selection:text-white">
            <pre className="whitespace-pre-wrap">{scriptContent}</pre>
          </div>

          {/* Alt Yardımcı Bilgi */}
          <div className="p-3 bg-[#181818] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Rootsuz PRoot-Distro (Ubuntu 24.04 ARM64) için tamamen optimize edilmiştir.</span>
            </div>
            <div className="font-mono text-zinc-300">
              Başlatma Komutu: <span className="text-[#E95420] font-semibold">start-desktop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
