import React, { useState } from 'react';
import { Settings, Palette, MousePointer, Volume2, HardDrive, Smartphone, Check } from 'lucide-react';

interface SettingsAppProps {
  currentWallpaper: string;
  onChangeWallpaper: (wp: string) => void;
  touchAssistEnabled: boolean;
  onToggleTouchAssist: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  currentWallpaper,
  onChangeWallpaper,
  touchAssistEnabled,
  onToggleTouchAssist,
}) => {
  const wallpapers = [
    { id: 'aubergine', name: 'Ubuntu Noble (Klasik Mor/Turuncu)', gradient: 'from-[#2c001e] via-[#77216F] to-[#5E2750]' },
    { id: 'dark-carbon', name: 'Karanlık Karbon & Minimalist', gradient: 'from-[#0d0d0d] via-[#1a1a1a] to-[#262626]' },
    { id: 'arm-emerald', name: 'ARM64 Siber Zümrüt', gradient: 'from-[#022c22] via-[#064e3b] to-[#0f172a]' },
    { id: 'deep-space', name: 'Gece Gökyüzü & Nebula', gradient: 'from-[#0b0f19] via-[#1e1b4b] to-[#311042]' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#181818] text-zinc-200 text-xs select-none p-4 sm:p-6 overflow-y-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center text-white shadow-md">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Sistem & Masaüstü Ayarları</h2>
          <p className="text-[11px] text-zinc-400">Ubuntu 24.04 LTS (ARM64) Görünüm ve Donanım Tercihleri</p>
        </div>
      </div>

      {/* Duvar Kağıdı Seçimi */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-xs">
          <Palette className="w-4 h-4 text-[#E95420]" />
          <span>Masaüstü Arka Planı (Duvar Kağıdı)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {wallpapers.map((wp) => {
            const isSelected = currentWallpaper === wp.id;
            return (
              <div
                key={wp.id}
                onClick={() => onChangeWallpaper(wp.id)}
                className={`p-2 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? 'border-[#E95420] ring-2 ring-[#E95420]/30' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`h-16 rounded-lg bg-gradient-to-br ${wp.gradient} flex items-center justify-center shadow-inner`}>
                  {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                </div>
                <div className="mt-1.5 text-[11px] font-medium text-zinc-300 truncate text-center">
                  {wp.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dokunmatik / Mobil Yardımcı Kontroller */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MousePointer className="w-4 h-4 text-emerald-400" />
            <div>
              <h4 className="text-xs font-semibold text-white">Mobil Ekran Dokunmatik Fare Yardımcısı</h4>
              <p className="text-[11px] text-zinc-400">
                Telefon veya tablet ekranında farenin sağ/orta tıkını ve kısayolları kolaylaştıran yüzer buton paneli.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleTouchAssist}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              touchAssistEnabled ? 'bg-[#E95420]' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                touchAssistEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Ses Köprüsü (PulseAudio TCP) */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-xs">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <span>PulseAudio Android Ses Köprüsü</span>
        </div>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Linux uygulamalarının ses çıktıları (VLC, Chromium, oyunlar vb.) <code>127.0.0.1:4713</code> portu üzerinden doğrudan Android sistem mikserine ve telefon hoparlörüne aktarılır.
        </p>
      </div>

      {/* Android Cihaz Bilgisi */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2 font-mono text-[11px] text-zinc-400">
        <div className="text-zinc-300 font-sans font-semibold text-xs mb-1">Ortam Özeti</div>
        <div className="flex justify-between">
          <span>Linux Ortamı:</span>
          <span className="text-white">PRoot (Rootsuz Sandbox Katmanı)</span>
        </div>
        <div className="flex justify-between">
          <span>İşlemci Mimarisi:</span>
          <span className="text-emerald-400 font-bold">ARM64 (aarch64 Native)</span>
        </div>
        <div className="flex justify-between">
          <span>Görüntüleme Protokolü:</span>
          <span className="text-cyan-400">noVNC (WebSockets + HTML5 Canvas)</span>
        </div>
        <div className="flex justify-between">
          <span>Paylaşılan Dizin:</span>
          <span className="text-amber-400">/sdcard → /storage/emulated/0</span>
        </div>
      </div>
    </div>
  );
};
