import React, { useState, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Folder, 
  FileEdit, 
  Package, 
  Activity, 
  Settings as SettingsIcon, 
  Code2, 
  BookOpen, 
  MonitorPlay,
  FileCode,
  CheckCircle,
  Smartphone
} from 'lucide-react';

import { DesktopWindow, WindowId, FileItem, PackageItem } from './types';
import { INITIAL_FILES } from './data/initialFs';
import { SOFTWARE_PACKAGES } from './data/packages';

import { TopPanel } from './components/Desktop/TopPanel';
import { Dock } from './components/Desktop/Dock';
import { WindowFrame } from './components/Desktop/WindowFrame';
import { TerminalApp } from './components/Desktop/TerminalApp';
import { FileManagerApp } from './components/Desktop/FileManagerApp';
import { EditorApp } from './components/Desktop/EditorApp';
import { SoftwareCenterApp } from './components/Desktop/SoftwareCenterApp';
import { SystemMonitorApp } from './components/Desktop/SystemMonitorApp';
import { SettingsApp } from './components/Desktop/SettingsApp';
import { ScriptGeneratorApp } from './components/Installer/ScriptGeneratorApp';
import { SetupGuideApp } from './components/Guide/SetupGuideApp';
import { WebVncConnectorApp } from './components/VncViewer/WebVncConnectorApp';
import { StandaloneApkApp } from './components/ApkBuilder/StandaloneApkApp';
import { TouchAssistBar } from './components/Desktop/TouchAssistBar';
import { AppGridModal } from './components/Desktop/AppGridModal';

export default function App() {
  // Pencerelerin Başlangıç Durumları
  const [windows, setWindows] = useState<Record<WindowId, DesktopWindow>>({
    terminal: {
      id: 'terminal',
      title: 'Terminal - bash (ARM64)',
      icon: 'terminal',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 80, y: 45 },
      size: { width: 680, height: 440 },
    },
    installer: {
      id: 'installer',
      title: 'Android Termux Kurulum Scripti Üreticisi',
      icon: 'code',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
      position: { x: 120, y: 70 },
      size: { width: 780, height: 500 },
    },
    standalone_apk: {
      id: 'standalone_apk',
      title: 'Tek Tıkla APK (All-in-One) Mimarisi ve Kodları',
      icon: 'smartphone',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      position: { x: 130, y: 65 },
      size: { width: 780, height: 500 },
    },
    guide: {
      id: 'guide',
      title: 'Android Rootsuz Linux Kurulum Rehberi',
      icon: 'book',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      position: { x: 140, y: 60 },
      size: { width: 720, height: 480 },
    },
    files: {
      id: 'files',
      title: 'Dosyalar (Nautilus - /home/ubuntu)',
      icon: 'folder',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      position: { x: 100, y: 90 },
      size: { width: 680, height: 430 },
    },
    editor: {
      id: 'editor',
      title: 'Metin & Kod Düzenleyici (Gedit)',
      icon: 'file-text',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      position: { x: 160, y: 80 },
      size: { width: 650, height: 430 },
    },
    software: {
      id: 'software',
      title: 'Ubuntu Yazılım Merkezi (ARM64 Deposu)',
      icon: 'package',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      position: { x: 130, y: 70 },
      size: { width: 700, height: 460 },
    },
    monitor: {
      id: 'monitor',
      title: 'Sistem Monitörü - Donanım & Süreçler',
      icon: 'activity',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 4,
      position: { x: 150, y: 85 },
      size: { width: 640, height: 420 },
    },
    vnc_connect: {
      id: 'vnc_connect',
      title: 'noVNC Canlı Web Bağlantı Portu',
      icon: 'monitor-play',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 3,
      position: { x: 110, y: 65 },
      size: { width: 720, height: 470 },
    },
    settings: {
      id: 'settings',
      title: 'Ayarlar (Ubuntu Control Center)',
      icon: 'settings',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 2,
      position: { x: 170, y: 95 },
      size: { width: 600, height: 430 },
    },
  });

  const [topZIndex, setTopZIndex] = useState(15);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('terminal');
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [packages, setPackages] = useState<PackageItem[]>(SOFTWARE_PACKAGES);
  const [activeEditorFile, setActiveEditorFile] = useState<FileItem | null>(INITIAL_FILES[3]); // hello_arm64.py
  const [wallpaper, setWallpaper] = useState<string>('aubergine');
  const [touchAssistEnabled, setTouchAssistEnabled] = useState(true);
  const [appGridOpen, setAppGridOpen] = useState(false);

  // Mobil ekranlar için pencere boyutlarını otomatik uyarlama
  useEffect(() => {
    if (window.innerWidth < 768) {
      setWindows((prev) => {
        const updated = { ...prev };
        (Object.keys(updated) as WindowId[]).forEach((id) => {
          updated[id] = {
            ...updated[id],
            position: { x: 60, y: 35 },
            size: { width: window.innerWidth - 65, height: window.innerHeight - 45 },
          };
        });
        return updated;
      });
    }
  }, []);

  const handleFocus = (id: WindowId) => {
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setActiveWindowId(id);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: nextZ, isMinimized: false },
    }));
  };

  const handleToggleWindow = (id: WindowId) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win.isOpen) {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { ...win, isOpen: true, isMinimized: false, zIndex: nextZ },
        };
      }
      if (win.isMinimized) {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { ...win, isMinimized: false, zIndex: nextZ },
        };
      }
      if (activeWindowId === id) {
        return {
          ...prev,
          [id]: { ...win, isMinimized: true },
        };
      }
      const nextZ = topZIndex + 1;
      setTopZIndex(nextZ);
      setActiveWindowId(id);
      return {
        ...prev,
        [id]: { ...win, zIndex: nextZ },
      };
    });
  };

  const handleClose = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMinimize = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMaximize = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  };

  const handleMove = (id: WindowId, pos: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], position: pos },
    }));
  };

  const handleOpenFileInEditor = (file: FileItem) => {
    setActiveEditorFile(file);
    handleToggleWindow('editor');
    handleFocus('editor');
  };

  const handleSaveFile = (updated: FileItem) => {
    setFiles((prev) => prev.map((f) => (f.path === updated.path ? updated : f)));
    setActiveEditorFile(updated);
  };

  const handleCreateFile = (newFile: FileItem) => {
    setFiles((prev) => [...prev, newFile]);
  };

  const handleDeleteFile = (path: string) => {
    setFiles((prev) => prev.filter((f) => f.path !== path));
    if (activeEditorFile?.path === path) {
      setActiveEditorFile(null);
    }
  };

  const handleTogglePackageInstall = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, installed: !p.installed } : p))
    );
  };

  const handleRunScriptFromEditor = (scriptName: string) => {
    handleToggleWindow('terminal');
    handleFocus('terminal');
  };

  const getWallpaperGradient = () => {
    switch (wallpaper) {
      case 'aubergine':
        return 'from-[#2c001e] via-[#77216F] to-[#5E2750]';
      case 'dark-carbon':
        return 'from-[#0d0d0d] via-[#1a1a1a] to-[#262626]';
      case 'arm-emerald':
        return 'from-[#022c22] via-[#064e3b] to-[#0f172a]';
      case 'deep-space':
        return 'from-[#0b0f19] via-[#1e1b4b] to-[#311042]';
      default:
        return 'from-[#2c001e] via-[#77216F] to-[#5E2750]';
    }
  };

  const openWindowsState: Record<WindowId, boolean> = {
    terminal: windows.terminal.isOpen,
    files: windows.files.isOpen,
    editor: windows.editor.isOpen,
    software: windows.software.isOpen,
    monitor: windows.monitor.isOpen,
    settings: windows.settings.isOpen,
    installer: windows.installer.isOpen,
    guide: windows.guide.isOpen,
    vnc_connect: windows.vnc_connect.isOpen,
    standalone_apk: windows.standalone_apk.isOpen,
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none bg-black">
      {/* 1. Üst Sistem Tepsisi ve Panel */}
      <TopPanel
        onOpenActivities={() => setAppGridOpen(true)}
        activeWindowTitle={activeWindowId ? windows[activeWindowId]?.title : undefined}
        onOpenSettings={() => {
          handleToggleWindow('settings');
          handleFocus('settings');
        }}
        onSwitchView={(view) => {
          if (view === 'installer') {
            handleToggleWindow('installer');
            handleFocus('installer');
          } else if (view === 'guide') {
            handleToggleWindow('guide');
            handleFocus('guide');
          }
        }}
      />

      {/* 2. Masaüstü Arka Planı ve Alanı */}
      <main
        id="desktop-canvas"
        className={`flex-1 relative w-full h-full bg-gradient-to-br ${getWallpaperGradient()} overflow-hidden`}
      >
        {/* Sol Kenar Ubuntu Dock */}
        <Dock
          openWindows={openWindowsState}
          activeWindow={activeWindowId}
          onToggleWindow={handleToggleWindow}
          onOpenAppGrid={() => setAppGridOpen(true)}
        />

        {/* Masaüstü Kısayol Simgeleri */}
        <div className="absolute top-6 left-20 grid grid-cols-1 gap-4 z-0 pointer-events-auto">
          <div
            onDoubleClick={() => {
              const file = files.find((f) => f.name === 'hello_arm64.py');
              if (file) handleOpenFileInEditor(file);
            }}
            onClick={() => {
              const file = files.find((f) => f.name === 'hello_arm64.py');
              if (file) handleOpenFileInEditor(file);
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-24 text-center group transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <FileCode className="w-6 h-6 text-emerald-200" />
            </div>
            <span className="text-white text-[11px] font-medium mt-1 drop-shadow-md truncate max-w-full">
              hello_arm64.py
            </span>
          </div>

          <div
            onDoubleClick={() => {
              handleToggleWindow('standalone_apk');
              handleFocus('standalone_apk');
            }}
            onClick={() => {
              handleToggleWindow('standalone_apk');
              handleFocus('standalone_apk');
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-24 text-center group transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-400/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6 text-emerald-100" />
            </div>
            <span className="text-white text-[11px] font-medium mt-1 drop-shadow-md truncate max-w-full">
              Tek Tık APK
            </span>
          </div>

          <div
            onDoubleClick={() => {
              handleToggleWindow('installer');
              handleFocus('installer');
            }}
            onClick={() => {
              handleToggleWindow('installer');
              handleFocus('installer');
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-24 text-center group transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600/80 border border-amber-400/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6 text-amber-200" />
            </div>
            <span className="text-white text-[11px] font-medium mt-1 drop-shadow-md truncate max-w-full">
              Termux Scripti
            </span>
          </div>

          <div
            onDoubleClick={() => {
              handleToggleWindow('guide');
              handleFocus('guide');
            }}
            onClick={() => {
              handleToggleWindow('guide');
              handleFocus('guide');
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-24 text-center group transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-indigo-200" />
            </div>
            <span className="text-white text-[11px] font-medium mt-1 drop-shadow-md truncate max-w-full">
              Kurulum Kılavuzu
            </span>
          </div>

          <div
            onDoubleClick={() => {
              handleToggleWindow('files');
              handleFocus('files');
            }}
            onClick={() => {
              handleToggleWindow('files');
              handleFocus('files');
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-24 text-center group transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/80 border border-blue-400/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Folder className="w-6 h-6 text-blue-200" />
            </div>
            <span className="text-white text-[11px] font-medium mt-1 drop-shadow-md truncate max-w-full">
              Android /sdcard
            </span>
          </div>
        </div>

        {/* Masaüstü Filigran / Bilgi Kartı */}
        <div className="absolute bottom-4 left-20 pointer-events-none text-white/30 font-mono text-xs hidden md:block select-none">
          <div className="text-sm font-semibold text-white/40">Ubuntu 24.04 LTS Noble Numbat</div>
          <div>ARM64 Native PRoot Sandbox • noVNC Web Interface (Port 6080)</div>
        </div>

        {/* 3. Pencereler */}
        {/* Terminal Penceresi */}
        <WindowFrame
          window={windows.terminal}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <TerminalApp
            files={files}
            onFileCreate={handleCreateFile}
            onPackageInstall={(name) => {
              const matched = packages.find((p) => p.id.includes(name) || p.name.toLowerCase().includes(name));
              if (matched) handleTogglePackageInstall(matched.id);
            }}
          />
        </WindowFrame>

        {/* Termux Script Üretici Penceresi */}
        <WindowFrame
          window={windows.installer}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <ScriptGeneratorApp />
        </WindowFrame>

        {/* Tek Tıkla APK (All-in-One) Mimarisi Penceresi */}
        <WindowFrame
          window={windows.standalone_apk}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <StandaloneApkApp />
        </WindowFrame>

        {/* Rootsuz Kurulum Rehberi Penceresi */}
        <WindowFrame
          window={windows.guide}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <SetupGuideApp />
        </WindowFrame>

        {/* Dosyalar (Nautilus) Penceresi */}
        <WindowFrame
          window={windows.files}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <FileManagerApp
            files={files}
            onOpenFileInEditor={handleOpenFileInEditor}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
          />
        </WindowFrame>

        {/* Metin ve Kod Editörü Penceresi */}
        <WindowFrame
          window={windows.editor}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <EditorApp
            activeFile={activeEditorFile}
            onSaveFile={handleSaveFile}
            onRunScript={handleRunScriptFromEditor}
          />
        </WindowFrame>

        {/* Yazılım Merkezi Penceresi */}
        <WindowFrame
          window={windows.software}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <SoftwareCenterApp
            packages={packages}
            onToggleInstall={handleTogglePackageInstall}
          />
        </WindowFrame>

        {/* Sistem Monitörü Penceresi */}
        <WindowFrame
          window={windows.monitor}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <SystemMonitorApp />
        </WindowFrame>

        {/* Canlı noVNC Bağlantı Penceresi */}
        <WindowFrame
          window={windows.vnc_connect}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <WebVncConnectorApp />
        </WindowFrame>

        {/* Ayarlar Penceresi */}
        <WindowFrame
          window={windows.settings}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onFocus={handleFocus}
          onMove={handleMove}
        >
          <SettingsApp
            currentWallpaper={wallpaper}
            onChangeWallpaper={setWallpaper}
            touchAssistEnabled={touchAssistEnabled}
            onToggleTouchAssist={() => setTouchAssistEnabled(!touchAssistEnabled)}
          />
        </WindowFrame>
      </main>

      {/* 4. Mobil Dokunmatik Fare ve Tuş Paneli */}
      {touchAssistEnabled && (
        <TouchAssistBar
          onOpenTerminal={() => {
            handleToggleWindow('terminal');
            handleFocus('terminal');
          }}
        />
      )}

      {/* 5. Uygulama Listesi (App Grid Drawer) */}
      <AppGridModal
        isOpen={appGridOpen}
        onClose={() => setAppGridOpen(false)}
        onLaunchApp={(id) => {
          handleToggleWindow(id);
          handleFocus(id);
        }}
      />
    </div>
  );
}
