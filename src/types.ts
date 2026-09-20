export type WindowId = 
  | 'terminal' 
  | 'files' 
  | 'editor' 
  | 'software' 
  | 'monitor' 
  | 'settings' 
  | 'installer' 
  | 'guide' 
  | 'vnc_connect'
  | 'standalone_apk';

export interface DesktopWindow {
  id: WindowId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  size?: string;
  permissions?: string;
  owner?: string;
  updatedAt?: string;
}

export interface PackageItem {
  id: string;
  name: string;
  category: 'Geliştirme' | 'Masaüstü' | 'Araçlar' | 'Medya' | 'Sunucu';
  description: string;
  version: string;
  size: string;
  installed: boolean;
  arm64Optimized: boolean;
  command: string;
  icon: string;
}

export interface ProcessItem {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  name: string;
  status: 'R' | 'S' | 'Z';
}

export interface InstallerConfig {
  distro: 'ubuntu-24.04' | 'debian-12' | 'alpine';
  desktopEnv: 'xfce4' | 'lxde' | 'mate';
  displayMode: 'novnc' | 'termux-x11';
  resolution: 'adaptive' | '1920x1080' | '1280x720' | 'custom';
  customResolution: string;
  port: number;
  includeAudio: boolean;
  includeDevTools: boolean;
  includeBrowser: boolean;
  includeCodeServer: boolean;
  username: string;
}
