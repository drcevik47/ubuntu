import React, { useState } from 'react';
import { MousePointer, ChevronUp, ChevronDown, CornerDownLeft, Sparkles } from 'lucide-react';

interface TouchAssistBarProps {
  onSendKey?: (key: string) => void;
  onOpenTerminal?: () => void;
}

export const TouchAssistBar: React.FC<TouchAssistBarProps> = ({
  onSendKey,
  onOpenTerminal,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [clickMode, setClickMode] = useState<'left' | 'right' | 'middle'>('left');

  const keys = ['Esc', 'Tab', 'Ctrl+C', 'Ctrl+Z', 'Alt', 'Super'];

  return (
    <div
      id="touch-assist-floating"
      className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-1.5 select-none font-sans"
    >
      {expanded && (
        <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <div className="flex items-center justify-between text-[11px] text-zinc-300 font-semibold px-1 pb-1 border-b border-zinc-800">
            <span>Mobil Tuş & Fare Paneli</span>
            <span className="text-[10px] text-emerald-400">Aktif</span>
          </div>

          {/* Fare Tıklama Modu Seçici */}
          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <button
              onClick={() => setClickMode('left')}
              className={`py-1 px-2 rounded-lg font-medium transition-colors ${
                clickMode === 'left' ? 'bg-[#E95420] text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Sol Tık
            </button>
            <button
              onClick={() => setClickMode('right')}
              className={`py-1 px-2 rounded-lg font-medium transition-colors ${
                clickMode === 'right' ? 'bg-[#E95420] text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Sağ Tık
            </button>
            <button
              onClick={() => setClickMode('middle')}
              className={`py-1 px-2 rounded-lg font-medium transition-colors ${
                clickMode === 'middle' ? 'bg-[#E95420] text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Orta Tık
            </button>
          </div>

          {/* Hızlı Tuşlar */}
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => onSendKey?.(k)}
                className="py-1 px-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded text-zinc-300 font-medium transition-colors border border-zinc-700/50 text-center"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Terminal Aç */}
          {onOpenTerminal && (
            <button
              onClick={onOpenTerminal}
              className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[11px] font-medium transition-colors text-center border border-zinc-700"
            >
              Terminali Öne Getir
            </button>
          )}
        </div>
      )}

      {/* Tetikleyici Buton */}
      <button
        id="toggle-touch-assist-btn"
        onClick={() => setExpanded(!expanded)}
        className="px-3 py-2 bg-[#E95420] hover:bg-[#d84a1b] text-white rounded-full shadow-xl flex items-center gap-1.5 text-xs font-semibold transition-all transform active:scale-95"
      >
        <MousePointer className="w-4 h-4" />
        <span className="hidden sm:inline">Dokunmatik Yardımcı</span>
        {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
