import { FileItem } from '../types';

export const INITIAL_FILES: FileItem[] = [
  {
    name: 'home',
    path: '/home',
    type: 'directory',
    owner: 'root',
    permissions: 'drwxr-xr-x',
  },
  {
    name: 'ubuntu',
    path: '/home/ubuntu',
    type: 'directory',
    owner: 'ubuntu',
    permissions: 'drwxr-xr-x',
  },
  {
    name: 'Masaüstü',
    path: '/home/ubuntu/Masaüstü',
    type: 'directory',
    owner: 'ubuntu',
    permissions: 'drwxr-xr-x',
  },
  {
    name: 'hello_arm64.py',
    path: '/home/ubuntu/hello_arm64.py',
    type: 'file',
    owner: 'ubuntu',
    permissions: '-rwxr-xr-x',
    size: '482 B',
    updatedAt: '2026-09-20 10:15',
    content: `#!/usr/bin/env python3
# Android ARM64 Ubuntu Python Test Script
import platform
import os
import sys

print("========================================")
print("  🚀 Android Üzerinde Ubuntu 24.04 ARM64")
print("========================================")
print(f"• Mimari       : {platform.machine()}")
print(f"• İşletim Sis. : {platform.system()} {platform.release()}")
print(f"• Python Sürüm : {platform.python_version()}")
print(f"• Çekirdek Sayı: {os.cpu_count()} Çekirdek")
print(f"• Çalışan Dizin: {os.getcwd()}")
print("========================================")
print("Tebrikler! PRoot ortamında kodunuz yerel (native) hızda çalışıyor.")
`,
  },
  {
    name: 'android_sistem_kontrol.sh',
    path: '/home/ubuntu/android_sistem_kontrol.sh',
    type: 'file',
    owner: 'ubuntu',
    permissions: '-rwxr-xr-x',
    size: '620 B',
    updatedAt: '2026-09-20 10:20',
    content: `#!/bin/bash
echo "=== ANDROID PROOT UBUNTU DONANIM TESTI ==="
echo "[*] Mimari: $(uname -m)"
echo "[*] Çekirdek: $(uname -r)"
echo "[*] RAM Durumu: $(free -h | grep Mem | awk '{print $3 \" / \" $2}')"
echo "[*] Depolama: $(df -h / | awk 'NR==2 {print $3 \" kullanılıyor, \" $4 \" boş\"}')"
echo "[*] Ekran Çözünürlüğü: $(xdpyinfo 2>/dev/null | grep dimensions || echo '1920x1080 (noVNC HTML5 Display)')"
echo "[*] Android Depolama Bağı: /sdcard -> /storage/emulated/0"
echo "Sistem stabil ve kullanıma hazır!"
`,
  },
  {
    name: 'notlar.txt',
    path: '/home/ubuntu/notlar.txt',
    type: 'file',
    owner: 'ubuntu',
    permissions: '-rw-r--r--',
    size: '345 B',
    updatedAt: '2026-09-20 10:30',
    content: `Ubuntu 24.04 LTS (Noble Numbat) - ARM64
=========================================
1. Termux üzerinde PRoot ile rootsuz çalışıyoruz.
2. XFCE4 masaüstü ve noVNC ile tarayıcıdan bağlanıyoruz.
3. Android dosyalarına '/sdcard' klasöründen erişebilirsin.
4. Paket kurmak için: sudo apt install <paket-adi>
`,
  },
  {
    name: 'sdcard',
    path: '/sdcard',
    type: 'directory',
    owner: 'ubuntu',
    permissions: 'lrwxrwxrwx',
  },
  {
    name: 'Download',
    path: '/sdcard/Download',
    type: 'directory',
    owner: 'ubuntu',
    permissions: 'drwxrwx---',
  },
  {
    name: 'android_indirilen_belge.pdf',
    path: '/sdcard/Download/android_indirilen_belge.pdf',
    type: 'file',
    owner: 'ubuntu',
    permissions: '-rw-rw----',
    size: '1.4 MB',
    updatedAt: '2026-09-19 18:42',
    content: '[PDF Dosyası - Android İndirilenler klasöründen paylaşıldı]',
  },
  {
    name: 'etc',
    path: '/etc',
    type: 'directory',
    owner: 'root',
    permissions: 'drwxr-xr-x',
  },
  {
    name: 'os-release',
    path: '/etc/os-release',
    type: 'file',
    owner: 'root',
    permissions: '-rw-r--r--',
    size: '380 B',
    updatedAt: '2026-09-15 08:00',
    content: `NAME="Ubuntu"
VERSION="24.04 LTS (Noble Numbat)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 24.04 LTS"
VERSION_ID="24.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
UBUNTU_CODENAME=noble
ARCHITECTURE=arm64
`,
  },
];
