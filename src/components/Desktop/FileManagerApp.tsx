import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  FileCode, 
  HardDrive, 
  Smartphone, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Eye, 
  FolderPlus,
  Info
} from 'lucide-react';
import { FileItem } from '../../types';

interface FileManagerAppProps {
  files: FileItem[];
  onOpenFileInEditor: (file: FileItem) => void;
  onCreateFile: (file: FileItem) => void;
  onDeleteFile: (path: string) => void;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({
  files,
  onOpenFileInEditor,
  onCreateFile,
  onDeleteFile,
}) => {
  const [currentPath, setCurrentPath] = useState('/home/ubuntu');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'directory'>('file');

  // Geçerli dizindeki alt dosyaları filtrele
  const currentItems = files.filter((f) => {
    if (f.path === currentPath) return false;
    const partsF = f.path.split('/').filter(Boolean);
    const partsCurr = currentPath.split('/').filter(Boolean);
    return f.path.startsWith(currentPath) && partsF.length === partsCurr.length + 1;
  });

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const handleGoBack = () => {
    if (currentPath === '/' || currentPath === '') return;
    const parent = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
    setCurrentPath(parent);
    setSelectedFile(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const path = currentPath === '/' ? `/${newFileName.trim()}` : `${currentPath}/${newFileName.trim()}`;
    
    onCreateFile({
      name: newFileName.trim(),
      path,
      type: newFileType,
      owner: 'ubuntu',
      permissions: newFileType === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--',
      size: newFileType === 'directory' ? '-' : '0 B',
      updatedAt: 'Az önce',
      content: newFileType === 'file' ? '#!/bin/bash\n# Yeni dosya\n' : undefined,
    });

    setNewFileName('');
    setShowNewModal(false);
  };

  return (
    <div className="flex h-full bg-[#181818] text-zinc-200 text-xs select-none">
      {/* Yan Menü (Klasör Ağacı ve Android Bağlantısı) */}
      <div className="w-48 bg-[#141414] border-r border-zinc-800 p-2.5 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 py-1">
            Ubuntu Alanı
          </div>
          <button
            onClick={() => handleNavigate('/home/ubuntu')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
              currentPath === '/home/ubuntu' ? 'bg-[#E95420] text-white font-medium' : 'hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-300" />
            <span>Ev (ubuntu)</span>
          </button>

          <button
            onClick={() => handleNavigate('/home/ubuntu/Masaüstü')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
              currentPath === '/home/ubuntu/Masaüstü' ? 'bg-[#E95420] text-white font-medium' : 'hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-300" />
            <span>Masaüstü</span>
          </button>

          <button
            onClick={() => handleNavigate('/')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
              currentPath === '/' ? 'bg-[#E95420] text-white font-medium' : 'hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <HardDrive className="w-4 h-4 text-zinc-400" />
            <span>Kök Dizin (/)</span>
          </button>

          <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider px-2 py-1 pt-3 flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            Android Depolama
          </div>

          <button
            onClick={() => handleNavigate('/sdcard')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
              currentPath === '/sdcard' ? 'bg-[#E95420] text-white font-medium' : 'hover:bg-zinc-800 text-emerald-300'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Dahili Hafıza (/sdcard)</span>
          </button>

          <button
            onClick={() => handleNavigate('/sdcard/Download')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
              currentPath === '/sdcard/Download' ? 'bg-[#E95420] text-white font-medium' : 'hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Folder className="w-4 h-4 text-cyan-400" />
            <span>İndirilenler</span>
          </button>
        </div>

        {/* Depolama Özeti */}
        <div className="p-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-[11px] text-zinc-400">
          <div className="flex justify-between text-zinc-300 mb-1">
            <span>ARM64 Depolama</span>
            <span className="text-white font-semibold">19% Dolu</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#E95420] h-full w-[19%]" />
          </div>
          <div className="mt-1 text-[10px] text-zinc-500">190 GB Boş Alan</div>
        </div>
      </div>

      {/* Sağ Ana Bölüm */}
      <div className="flex-1 flex flex-col">
        {/* Üst Yol ve Araç Çubuğu */}
        <div className="h-10 border-b border-zinc-800 px-3 flex items-center justify-between bg-[#1C1C1C]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoBack}
              disabled={currentPath === '/'}
              className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 transition-colors"
              title="Üst Dizine Çık"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="font-mono text-zinc-200 bg-zinc-800/80 px-2.5 py-1 rounded border border-zinc-700">
              {currentPath}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewFileType('file');
                setShowNewModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Dosya</span>
            </button>
            <button
              onClick={() => {
                setNewFileType('directory');
                setShowNewModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors text-[11px]"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Yeni Klasör</span>
            </button>
          </div>
        </div>

        {/* Dosya Listesi / Izgara */}
        <div className="flex-1 p-4 overflow-y-auto">
          {currentItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
              <Folder className="w-12 h-12 text-zinc-700" />
              <p>Bu dizin boş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currentItems.map((item) => {
                const isSelected = selectedFile?.path === item.path;
                const isDir = item.type === 'directory';
                const isCode = item.name.endsWith('.py') || item.name.endsWith('.sh') || item.name.endsWith('.js');

                return (
                  <div
                    key={item.path}
                    onClick={() => setSelectedFile(item)}
                    onDoubleClick={() => {
                      if (isDir) {
                        handleNavigate(item.path);
                      } else {
                        onOpenFileInEditor(item);
                      }
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#E95420]/20 border-[#E95420] text-white shadow-md'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/60 text-zinc-300'
                    }`}
                  >
                    <div className="mb-2">
                      {isDir ? (
                        <Folder className="w-10 h-10 text-amber-400" />
                      ) : isCode ? (
                        <FileCode className="w-10 h-10 text-emerald-400" />
                      ) : (
                        <FileText className="w-10 h-10 text-zinc-400" />
                      )}
                    </div>
                    <span className="font-medium truncate max-w-full text-[11px]" title={item.name}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      {isDir ? 'Klasör' : item.size || 'Dosya'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Seçili Dosya Alt Bilgi Çubuğu */}
        {selectedFile && (
          <div className="h-12 border-t border-zinc-800 bg-[#161616] px-4 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="font-semibold text-white">{selectedFile.name}</span>
                <span className="text-zinc-400 ml-2 font-mono text-[10px]">
                  {selectedFile.permissions} • {selectedFile.size || 'Klasör'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedFile.type === 'file' && (
                <button
                  onClick={() => onOpenFileInEditor(selectedFile)}
                  className="flex items-center gap-1 px-3 py-1 bg-[#E95420] hover:bg-[#d84a1b] text-white rounded font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Düzenleyicide Aç</span>
                </button>
              )}
              {selectedFile.type === 'directory' && (
                <button
                  onClick={() => handleNavigate(selectedFile.path)}
                  className="flex items-center gap-1 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded font-medium transition-colors"
                >
                  <span>Aç</span>
                </button>
              )}
              <button
                onClick={() => {
                  onDeleteFile(selectedFile.path);
                  setSelectedFile(null);
                }}
                className="p-1.5 text-red-400 hover:bg-red-950/50 rounded transition-colors"
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Yeni Dosya/Klasör Modalı */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#202020] border border-zinc-700 rounded-xl p-4 w-80 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">
              {newFileType === 'file' ? 'Yeni Dosya Oluştur' : 'Yeni Klasör Oluştur'}
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder={newFileType === 'file' ? 'ornek_betik.py' : 'YeniKlasor'}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs outline-none focus:border-[#E95420]"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#E95420] hover:bg-[#d84a1b] text-white rounded text-xs font-medium"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
