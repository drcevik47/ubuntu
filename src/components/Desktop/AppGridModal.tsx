import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Folder, 
  FileEdit, 
  Package, 
  Activity, 
  Settings, 
  Code2, 
  BookOpen, 
  MonitorPlay,
  Smartphone,
  X 
} from 'lucide-react';
import { WindowId } from '../../types';

interface AppGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (id: WindowId) => void;
}

export const AppGridModal: React.FC<AppGridModalProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const apps: { id: WindowId; name: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'terminal',
      name: 'Terminal',
      desc: 'ARM64 Ubuntu Bash Shell & Python/C/Node Çalıştırma',
      icon: <Terminal className="w-8 h-8 text-white" />,
      color: 'bg-black border border-zinc-700',
    },
    {
      id: 'files',
      name: 'Dosyalar (Nautilus)',
      desc: 'Ubuntu dosya yöneticisi ve Android /sdcard depolama bağı',
      icon: <Folder className="w-8 h-8 text-amber-300" />,
      color: 'bg-blue-600',
    },
    {
      id: 'editor',
      name: 'Metin & Kod Düzenleyici',
      desc: 'Python, Bash ve konfigürasyon dosyalarını düzenleyin',
      icon: <FileEdit className="w-8 h-8 text-emerald-300" />,
      color: 'bg-emerald-700',
    },
    {
      id: 'software',
      name: 'Yazılım Merkezi',
      desc: 'ARM64 için optimize edilmiş Linux paketleri ve araçları',
      icon: <Package className="w-8 h-8 text-orange-200" />,
      color: 'bg-[#E95420]',
    },
    {
      id: 'monitor',
      name: 'Sistem Monitörü',
      desc: '8 Çekirdek ARM64 CPU, RAM ve süreç izleme',
      icon: <Activity className="w-8 h-8 text-cyan-300" />,
      color: 'bg-cyan-700',
    },
    {
      id: 'standalone_apk',
      name: 'Tek Tıkla APK Mimarisi',
      desc: 'Termux gerektirmeyen bağımsız Android Studio ve APK kaynak kodları',
      icon: <Smartphone className="w-8 h-8 text-emerald-200" />,
      color: 'bg-emerald-600',
    },
    {
      id: 'installer',
      name: 'Termux Script Üretici',
      desc: 'Android için tek komutlu otomatik kurulum hazırlayıcı',
      icon: <Code2 className="w-8 h-8 text-amber-200" />,
      color: 'bg-amber-600',
    },
    {
      id: 'guide',
      name: 'Rootsuz Kurulum Rehberi',
      desc: 'Adım adım Termux ve noVNC kurulum yönergeleri',
      icon: <BookOpen className="w-8 h-8 text-indigo-200" />,
      color: 'bg-indigo-600',
    },
    {
      id: 'vnc_connect',
      name: 'noVNC Canlı Bağlantı',
      desc: 'Telefonun yerel portuna (:6080) webview üzerinden bağlanın',
      icon: <MonitorPlay className="w-8 h-8 text-purple-200" />,
      color: 'bg-purple-600',
    },
    {
      id: 'settings',
      name: 'Sistem Ayarları',
      desc: 'Duvar kağıdı, dokunmatik yardımcı ve ses köprüsü tercihleri',
      icon: <Settings className="w-8 h-8 text-zinc-200" />,
      color: 'bg-zinc-700',
    },
  ];

  const filtered = apps.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-start pt-16 p-6 select-none animate-in fade-in duration-200">
      {/* Kapat Butonu */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Arama Alanı */}
      <div className="relative w-full max-w-md mb-8">
        <Search className="w-5 h-5 absolute left-3.5 top-3 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Uygulama ara..."
          className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-full text-white text-sm outline-none placeholder-zinc-400 focus:border-[#E95420] focus:ring-2 focus:ring-[#E95420]/30 transition-all"
          autoFocus
        />
      </div>

      {/* Uygulama Izgarası */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 overflow-y-auto max-h-[70vh] p-2">
        {filtered.map((app) => (
          <button
            key={app.id}
            onClick={() => {
              onLaunchApp(app.id);
              onClose();
            }}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 transition-all transform hover:-translate-y-1 group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl mb-3 ${app.color} group-hover:scale-105 transition-transform`}>
              {app.icon}
            </div>
            <span className="font-semibold text-white text-xs mb-1">{app.name}</span>
            <span className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{app.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
