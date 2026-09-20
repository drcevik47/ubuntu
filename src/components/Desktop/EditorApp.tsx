import React, { useState, useEffect } from 'react';
import { Save, Play, FileCode, CheckCircle, RotateCcw } from 'lucide-react';
import { FileItem } from '../../types';

interface EditorAppProps {
  activeFile: FileItem | null;
  onSaveFile: (file: FileItem) => void;
  onRunScript: (scriptName: string) => void;
}

export const EditorApp: React.FC<EditorAppProps> = ({
  activeFile,
  onSaveFile,
  onRunScript,
}) => {
  const [content, setContent] = useState('');
  const [savedStatus, setSavedStatus] = useState(true);

  useEffect(() => {
    if (activeFile) {
      setContent(activeFile.content || '');
      setSavedStatus(true);
    }
  }, [activeFile]);

  const handleSave = () => {
    if (!activeFile) return;
    onSaveFile({
      ...activeFile,
      content,
      updatedAt: 'Şimdi',
    });
    setSavedStatus(true);
  };

  const handleRun = () => {
    if (!activeFile) return;
    handleSave();
    onRunScript(activeFile.name);
  };

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 bg-[#161616] p-4 text-center">
        <FileCode className="w-12 h-12 text-zinc-700 mb-2" />
        <p className="text-sm font-medium text-zinc-400">Açık dosya yok</p>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          Dosyalar uygulamasından bir .py, .sh veya .txt dosyasına çift tıklayarak düzenlemeye başlayabilirsiniz.
        </p>
      </div>
    );
  }

  const isExecutable = activeFile.name.endsWith('.py') || activeFile.name.endsWith('.sh');

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-zinc-200 font-mono text-xs">
      {/* Editör Araç Çubuğu */}
      <div className="h-10 bg-[#222222] border-b border-zinc-800 px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#E95420]" />
          <span className="font-semibold text-white">{activeFile.name}</span>
          <span className="text-[10px] text-zinc-500 font-sans">({activeFile.path})</span>
          {!savedStatus && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Kaydedilmemiş Değişiklikler" />
          )}
        </div>

        <div className="flex items-center gap-2 font-sans">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs transition-colors border border-zinc-700/60"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kaydet</span>
          </button>

          {isExecutable && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#E95420] hover:bg-[#d84a1b] text-white rounded text-xs font-medium transition-colors shadow-sm"
              title="Terminalde ARM64 olarak çalıştır"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Çalıştır</span>
            </button>
          )}
        </div>
      </div>

      {/* Kod Düzenleme Alanı */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Satır Numaraları */}
        <div className="w-10 bg-[#151515] border-r border-zinc-800/80 text-zinc-600 select-none py-3 text-right pr-2 font-mono text-[11px] leading-6 overflow-hidden">
          {content.split('\n').map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Metin Alanı */}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setSavedStatus(false);
          }}
          className="flex-1 bg-[#1A1A1A] p-3 text-zinc-100 font-mono text-xs leading-6 outline-none resize-none selection:bg-[#E95420]/30 selection:text-white"
          spellCheck={false}
        />
      </div>

      {/* Alt Durum Çubuğu */}
      <div className="h-6 bg-[#161616] border-t border-zinc-800 px-3 flex items-center justify-between text-[10px] text-zinc-500 font-sans select-none">
        <div>
          Satır: {content.split('\n').length} • Karakter: {content.length}
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>LF (Linux)</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> ARM64 Uyumlu
          </span>
        </div>
      </div>
    </div>
  );
};
