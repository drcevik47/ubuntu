import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, X, Move } from 'lucide-react';
import { DesktopWindow, WindowId } from '../../types';

interface WindowFrameProps {
  window: DesktopWindow;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onMaximize: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onMove: (id: WindowId, pos: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: win.position.x,
    startY: win.position.y,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus(win.id);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: win.position.x,
      startY: win.position.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (win.isMaximized || !e.touches[0]) return;
    onFocus(win.id);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.touches[0].clientX,
      mouseY: e.touches[0].clientY,
      startX: win.position.x,
      startY: win.position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newX = Math.max(60, Math.min(window.innerWidth - 100, dragStartRef.current.startX + dx));
      const newY = Math.max(30, Math.min(window.innerHeight - 80, dragStartRef.current.startY + dy));
      onMove(win.id, { x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      const dx = e.touches[0].clientX - dragStartRef.current.mouseX;
      const dy = e.touches[0].clientY - dragStartRef.current.mouseY;
      const newX = Math.max(60, Math.min(window.innerWidth - 100, dragStartRef.current.startX + dx));
      const newY = Math.max(30, Math.min(window.innerHeight - 80, dragStartRef.current.startY + dy));
      onMove(win.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, win.id, onMove]);

  if (!win.isOpen || win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        top: '28px',
        left: '56px',
        width: 'calc(100vw - 56px)',
        height: 'calc(100vh - 28px)',
        zIndex: win.zIndex,
        borderRadius: '0px',
      }
    : {
        top: `${win.position.y}px`,
        left: `${win.position.x}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      id={`window-${win.id}`}
      style={style}
      onClick={() => onFocus(win.id)}
      className="fixed flex flex-col bg-[#1E1E1E] text-zinc-200 rounded-xl shadow-2xl border border-zinc-700/80 overflow-hidden select-none transition-shadow"
    >
      {/* Pencere Başlık Çubuğu (Ubuntu Yaru Style) */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`h-9 px-3 flex items-center justify-between border-b border-zinc-800 cursor-grab active:cursor-grabbing ${
          isDragging ? 'bg-[#2D2D2D]' : 'bg-[#252525]'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100 truncate pr-2">
          <span>{win.title}</span>
        </div>

        {/* Kontrol Butonları */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            id={`btn-min-${win.id}`}
            onClick={() => onMinimize(win.id)}
            title="Simge Durumuna Küçült"
            className="w-5 h-5 rounded-full bg-zinc-700/80 hover:bg-zinc-600 flex items-center justify-center text-zinc-300 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            id={`btn-max-${win.id}`}
            onClick={() => onMaximize(win.id)}
            title={win.isMaximized ? "Eski Boyuta Getir" : "Tam Ekran Yap"}
            className="w-5 h-5 rounded-full bg-zinc-700/80 hover:bg-zinc-600 flex items-center justify-center text-zinc-300 transition-colors"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            id={`btn-close-${win.id}`}
            onClick={() => onClose(win.id)}
            title="Kapat"
            className="w-5 h-5 rounded-full bg-red-600/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Pencere İçeriği */}
      <div className="flex-1 overflow-hidden relative bg-[#181818] select-text">
        {children}
      </div>
    </div>
  );
};
