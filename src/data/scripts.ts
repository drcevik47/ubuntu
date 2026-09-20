import { InstallerConfig } from '../types';

export function generateInstallScript(config: InstallerConfig): string {
  const isXfce = config.desktopEnv === 'xfce4';
  const dePackages = isXfce
    ? 'xfce4 xfce4-terminal xfce4-goodies'
    : config.desktopEnv === 'lxde'
    ? 'lxde lxterminal'
    : 'mate-desktop-environment mate-terminal';

  const deStartup = isXfce
    ? 'startxfce4'
    : config.desktopEnv === 'lxde'
    ? 'startlxde'
    : 'mate-session';

  const extraTools = [
    config.includeDevTools ? 'build-essential python3 python3-pip git curl wget nano' : 'curl wget nano',
    config.includeBrowser ? 'chromium-browser' : '',
    config.includeAudio ? 'pulseaudio pavucontrol' : '',
  ].filter(Boolean).join(' ');

  const resParam = config.resolution === 'adaptive'
    ? '$(stty size 2>/dev/null | awk \'{print $2\"x\"$1}\' || echo \"1920x1080\")'
    : config.resolution === '1920x1080'
    ? '1920x1080'
    : config.resolution === '1280x720'
    ? '1280x720'
    : config.customResolution || '1920x1080';

  return `#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# 🚀 ANDROID ROOTSUZ UBUNTU 24.04 ARM64 MASAÜSTÜ & noVNC KURULUM SCRIPTI
# ==============================================================================
# Dağıtım        : Ubuntu 24.04 (Noble Numbat - aarch64)
# Masaüstü       : ${config.desktopEnv.toUpperCase()}
# Görüntü Modu   : ${config.displayMode === 'novnc' ? 'noVNC (Web Tarayıcı / WebView Üzerinden Doğrudan)' : 'Termux:X11 (Yerel X11)'}
# Port           : ${config.port} (http://127.0.0.1:${config.port}/vnc.html)
# Kullanıcı Adı  : ${config.username}
# ==============================================================================

set -e
echo -e "\\e[1;34m[*] Android sistem ve donanım mimarisi taranıyor...\\e[0m"

ARCH=$(uname -m)
if [ "$ARCH" != "aarch64" ]; then
    echo -e "\\e[1;31m[!] Dikkat: Cihaz mimariniz '$ARCH'. Bu script 64-bit ARM (aarch64) için optimize edilmiştir.\\e[0m"
else
    echo -e "\\e[1;32m[✓] ARM64 (aarch64) mimarisi doğrulandı. Yüksek performans destekleniyor.\\e[0m"
fi

# 1. Termux Temel Paketlerinin Kurulumu
echo -e "\\e[1;34m[*] Termux paket depoları güncelleniyor ve PRoot kuruluyor...\\e[0m"
pkg update -y
pkg install -y proot-distro pulseaudio git wget curl x11-repo

# 2. Android Depolama İznini Doğrula (/sdcard erişimi için)
if [ ! -d "$HOME/storage" ]; then
    echo -e "\\e[1;33m[*] Android depolama bağları oluşturuluyor... (Lütfen ekranda izin verin)\\e[0m"
    termux-setup-storage || true
fi

# 3. Ubuntu 24.04 Kurulumu
echo -e "\\e[1;34m[*] PRoot-Distro ile Ubuntu 24.04 ARM64 indiriliyor ve açılıyor...\\e[0m"
proot-distro install ubuntu

# 4. Ubuntu İç Ayarlarının ve Masaüstü Paketlerinin Kurulması
echo -e "\\e[1;34m[*] Ubuntu içine masaüstü (${config.desktopEnv.toUpperCase()}) ve VNC sunucusu kuruluyor...\\e[0m"
proot-distro login ubuntu -- bash -c "
set -e
export DEBIAN_FRONTEND=noninteractive
apt update -y && apt upgrade -y

# Temel masaüstü, terminal ve noVNC bileşenleri
apt install -y sudo dbus-x11 tigervnc-standalone-server tigervnc-common novnc websockify ${dePackages} ${extraTools}

# Kullanıcı oluşturma: ${config.username}
if ! id -u ${config.username} >/dev/null 2>&1; then
    echo -e '\\e[1;32m[*] ${config.username} kullanıcısı ve sudo yetkisi tanımlanıyor...\\e[0m'
    useradd -m -s /bin/bash -G sudo ${config.username}
    echo '${config.username}:ubuntu' | chpasswd
    echo 'root:root' | chpasswd
    echo '${config.username} ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
fi

# VNC Başlatma Komut Dosyası Hazırlama
mkdir -p /home/${config.username}/.vnc
cat << 'EOF' > /home/${config.username}/.vnc/xstartup
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export DISPLAY=:1
export PULSE_SERVER=127.0.0.1:4713
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r \\$HOME/.Xresources ] && xrdb \\$HOME/.Xresources
dbus-launch --exit-with-session ${deStartup} &
EOF
chmod +x /home/${config.username}/.vnc/xstartup
chown -R ${config.username}:${config.username} /home/${config.username}/.vnc

# Chromium sandbox bayrağı (PRoot uyumluluğu)
if command -v chromium-browser >/dev/null 2>&1; then
    echo 'export CHROMIUM_FLAGS=\"--no-sandbox --test-type --disable-gpu\"' >> /home/${config.username}/.bashrc
fi

# Android depolama bağı (Ubuntu içinde /sdcard)
ln -sf /data/data/com.termux/files/home/storage/shared /sdcard || true
"

# 5. Başlatıcı Scriptlerini Hazırlama (start-desktop ve stop-desktop)
cat << 'START_EOF' > "$PREFIX/bin/start-desktop"
#!/data/data/com.termux/files/usr/bin/bash
echo -e "\\e[1;32m================================================\\e[0m"
echo -e "\\e[1;32m    🚀 UBUNTU 24.04 ARM64 MASAÜSTÜ BAŞLATILIYOR    \\e[0m"
echo -e "\\e[1;32m================================================\\e[0m"

# PulseAudio Ses Sunucusunu Arka Planda Başlat (Android hoparlörüne yönlendir)
pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1 2>/dev/null || true

# Ubuntu içerisinde VNC ve noVNC web sunucusunu çalıştır
proot-distro login --bind /data/data/com.termux/files/home/storage/shared:/sdcard ubuntu -- user-env ${config.username} bash -c '
    # Eski vnc oturumlarını temizle
    vncserver -kill :1 2>/dev/null || true
    rm -rf /tmp/.X1-lock /tmp/.X11-unix/X1 2>/dev/null || true

    # TigerVNC sunucusunu şifresiz/güvenli localhostta başlat
    vncserver :1 -geometry ${resParam} -depth 24 -SecurityTypes None
    
    # noVNC Websocket Köprüsünü Başlat (Port ${config.port})
    websockify --web /usr/share/novnc/ ${config.port} localhost:5901 >/dev/null 2>&1 &
    
    echo -e "\\e[1;36m[✓] Masaüstü Aktif!\\e[0m"
    echo -e "\\e[1;33m[!] Tarayıcınızdan şu adrese gidin: \\e[1;37mhttp://127.0.0.1:${config.port}/vnc.html\\e[0m"
'
START_EOF
chmod +x "$PREFIX/bin/start-desktop"

cat << 'STOP_EOF' > "$PREFIX/bin/stop-desktop"
#!/data/data/com.termux/files/usr/bin/bash
echo -e "\\e[1;31m[*] Ubuntu Masaüstü ve noVNC oturumu kapatılıyor...\\e[0m"
proot-distro login ubuntu -- user-env ${config.username} bash -c '
    vncserver -kill :1 2>/dev/null || true
    pkill websockify 2>/dev/null || true
'
pulseaudio --kill 2>/dev/null || true
echo -e "\\e[1;32m[✓] Masaüstü durduruldu. RAM boşaltıldı.\\e[0m"
STOP_EOF
chmod +x "$PREFIX/bin/stop-desktop"

echo -e "\\e[1;32m====================================================\\e[0m"
echo -e "\\e[1;32m  🎉 KURULUM TAMAMLANDI! ARTIK KULLANIMA HAZIR  \\e[0m"
echo -e "\\e[1;32m====================================================\\e[0m"
echo -e "Masaüstünü başlatmak için şu komutu yazın:"
echo -e "  \\e[1;37mstart-desktop\\e[0m"
echo -e ""
echo -e "Ardından Chrome, Brave veya WebView tarayıcınızdan açın:"
echo -e "  \\e[1;33mhttp://127.0.0.1:${config.port}/vnc.html\\e[0m"
echo -e ""
echo -e "Masaüstünü kapatıp RAM'i boşaltmak için:"
echo -e "  \\e[1;37mstop-desktop\\e[0m"
echo -e "===================================================="
`;
}
