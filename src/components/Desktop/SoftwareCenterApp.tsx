import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Check, 
  Download, 
  Cpu, 
  Terminal, 
  Code, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Play, 
  Activity, 
  Volume2, 
  FolderGit2 
} from 'lucide-react';
import { PackageItem } from '../../types';

interface SoftwareCenterAppProps {
  packages: PackageItem[];
  onToggleInstall: (id: string) => void;
}

export const SoftwareCenterApp: React.FC<SoftwareCenterAppProps> = ({
  packages,
  onToggleInstall,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Hepsi');

  const categories = ['Hepsi', 'Geliştirme', 'Masaüstü', 'Araçlar', 'Medya'];

  const filtered = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === 'Hepsi' || pkg.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'terminal': return <Terminal className="w-6 h-6 text-emerald-400" />;
      case 'code': return <Code className="w-6 h-6 text-blue-400" />;
      case 'cpu': return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'globe': return <Globe className="w-6 h-6 text-amber-400" />;
      case 'file-text': return <FileText className="w-6 h-6 text-orange-400" />;
      case 'image': return <ImageIcon className="w-6 h-6 text-pink-400" />;
      case 'play': return <Play className="w-6 h-6 text-red-400" />;
      case 'activity': return <Activity className="w-6 h-6 text-cyan-400" />;
      case 'volume-2': return <Volume2 className="w-6 h-6 text-indigo-400" />;
      case 'folder-git-2': return <FolderGit2 className="w-6 h-6 text-rose-400" />;
      default: return <Package className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-zinc-200 select-none text-xs">
      {/* Üst Başlık & Arama */}
      <div className="p-4 bg-[#212121] border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E95420] flex items-center justify-center text-white shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Ubuntu Yazılım Merkezi</h2>
            <p className="text-[11px] text-zinc-400">ARM64 (aarch64) Paket Deposu</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Paket veya araç ara..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs outline-none focus:border-[#E95420]"
          />
        </div>
      </div>

      {/* Kategori Sekmeleri */}
      <div className="px-4 py-2 border-b border-zinc-800/80 bg-[#1C1C1C] flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#E95420] text-white font-medium shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Paket Listesi */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-zinc-700 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-800/90 rounded-xl border border-zinc-700/50">
                {getIcon(pkg.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{pkg.name}</h3>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                    v{pkg.version}
                  </span>
                  {pkg.arm64Optimized && (
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                      <Cpu className="w-2.5 h-2.5" /> ARM64 Yerel
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1">{pkg.description}</p>
                <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-zinc-500">
                  <span>Boyut: {pkg.size}</span>
                  <span>•</span>
                  <span>Komut: <code className="text-zinc-300">{pkg.command}</code></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onToggleInstall(pkg.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center ${
                pkg.installed
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/40'
                  : 'bg-[#E95420] hover:bg-[#d84a1b] text-white shadow-md'
              }`}
            >
              {pkg.installed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Yüklendi</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Kur</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
