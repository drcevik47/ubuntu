import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, Sparkles, CornerDownLeft, Play } from 'lucide-react';
import { FileItem } from '../../types';

interface TerminalAppProps {
  files: FileItem[];
  onFileCreate: (file: FileItem) => void;
  onPackageInstall: (pkgName: string) => void;
}

interface CommandLog {
  id: string;
  type: 'cmd' | 'output' | 'error';
  text: string;
  isHtml?: boolean;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  files,
  onFileCreate,
  onPackageInstall,
}) => {
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/ubuntu');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'Ubuntu 24.04 LTS (GNU/Linux 6.1.0-android-arm64 aarch64)\n * Belgeler: https://help.ubuntu.com\n * Destek:    https://ubuntu.com/pro\n * Mimari:    ARM64 (aarch64) - Native PRoot Execution\n * Durum:     noVNC HTML5 Web Sunucusu Aktif (Port :6080)\n\nİpucu: Yardım için "help", sistem bilgisi için "neofetch" yazın.',
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    // Prompt satırı ekle
    const promptLine = `ubuntu@android:${currentDir === '/home/ubuntu' ? '~' : currentDir}$ ${raw}`;
    const newLogs: CommandLog[] = [
      ...logs,
      { id: String(Date.now()), type: 'cmd', text: promptLine },
    ];

    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'clear':
        setLogs([]);
        setInput('');
        return;

      case 'help':
        newLogs.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `Linux ARM64 Desteklenen Komutlar:
  • neofetch / fastfetch  : Detaylı Android ve Ubuntu sistem raporu
  • uname -a / uname -m   : Çekirdek ve ARM64 mimari bilgisi
  • ls [-la]              : Mevcut dizindeki dosyaları listele
  • cd <dizin>            : Dizin değiştir (örn: cd /sdcard, cd ~)
  • pwd                   : Bulunulan dizini göster
  • cat <dosya>           : Dosya içeriğini oku
  • python3 <dosya>       : Python ARM64 betiğini çalıştır
  • bash <betik>          : Bash scriptini çalıştır
  • apt update / install  : Paket yöneticisi (örn: apt install htop)
  • free -m / df -h       : RAM ve disk kullanım istatistikleri
  • whoami / date / ps    : Kullanıcı ve süreç bilgisi
  • start-desktop         : noVNC masaüstü oturumu başlatıcı kontrolü
  • clear                 : Terminal ekranını temizle`,
        });
        break;

      case 'uname':
        if (args.includes('-m')) {
          newLogs.push({ id: String(Date.now() + 1), type: 'output', text: 'aarch64' });
        } else if (args.includes('-r')) {
          newLogs.push({ id: String(Date.now() + 1), type: 'output', text: '6.1.0-android-arm64' });
        } else {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: 'Linux localhost 6.1.0-android-arm64 #1 SMP PREEMPT aarch64 GNU/Linux',
          });
        }
        break;

      case 'neofetch':
      case 'fastfetch':
        newLogs.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `        __            ubuntu@android-phone
   _---'  '---_       ---------------------
  /  _       _  \\     OS: Ubuntu 24.04 LTS (Noble Numbat) aarch64
 |  (o)     (o)  |    Host: Android Phone (PRoot Sandbox Container)
 |       _       |    Kernel: 6.1.0-android-arm64
  \\     (_)     /     Uptime: 2 days, 4 hours, 12 mins
   \`---_____---'      Packages: 1420 (dpkg), 12 (snap)
                      Shell: bash 5.2.21
                      Resolution: 1080x2400 (Native Phone Display)
                      DE: XFCE 4.18
                      WM: Xfwm4
                      Display Server: noVNC (HTML5 Websockets)
                      CPU: Qualcomm Kryo ARM64 (8) @ 2.80GHz
                      Memory: 3.4 GiB / 12.0 GiB (28%)
                      Storage: 42.1 GiB / 256 GiB (Shared /sdcard)`,
        });
        break;

      case 'pwd':
        newLogs.push({ id: String(Date.now() + 1), type: 'output', text: currentDir });
        break;

      case 'whoami':
        newLogs.push({ id: String(Date.now() + 1), type: 'output', text: 'ubuntu' });
        break;

      case 'date':
        newLogs.push({ id: String(Date.now() + 1), type: 'output', text: new Date().toString() });
        break;

      case 'free':
        newLogs.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `               total        used        free      shared  buff/cache   available
Mem:           11980        3480        6820         120        1680        8120
Swap:           4096           0        4096`,
        });
        break;

      case 'df':
        newLogs.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/root      245192800  43201400 189991400  19% /
tmpfs            6133760         0   6133760   0% /dev
/sdcard        245192800  43201400 189991400  19% /sdcard`,
        });
        break;

      case 'ls': {
        const targetDir = args[0] && !args[0].startsWith('-') ? args[0] : currentDir;
        const normalizedTarget = targetDir === '~' ? '/home/ubuntu' : targetDir;
        
        const matched = files.filter((f) => {
          const parent = f.path.substring(0, f.path.lastIndexOf('')) || '/';
          // Basit kontrol
          return f.path.startsWith(normalizedTarget) && f.path !== normalizedTarget;
        });

        const names = files
          .filter((f) => {
            const partsF = f.path.split('/').filter(Boolean);
            const partsCurr = normalizedTarget.split('/').filter(Boolean);
            return partsF.length === partsCurr.length + 1 && f.path.startsWith(normalizedTarget);
          })
          .map((f) => (f.type === 'directory' ? `\x1b[34m${f.name}/\x1b[0m` : f.name));

        if (names.length === 0) {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: 'Masaüstü/  hello_arm64.py  android_sistem_kontrol.sh  notlar.txt  sdcard/',
          });
        } else {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: names.join('   '),
          });
        }
        break;
      }

      case 'cd': {
        const dest = args[0] || '~';
        if (dest === '~' || dest === '') {
          setCurrentDir('/home/ubuntu');
        } else if (dest === '..') {
          const parent = currentDir.substring(0, currentDir.lastIndexOf('/')) || '/';
          setCurrentDir(parent);
        } else if (dest.startsWith('/')) {
          setCurrentDir(dest);
        } else {
          setCurrentDir(currentDir === '/' ? `/${dest}` : `${currentDir}/${dest}`);
        }
        break;
      }

      case 'cat': {
        const filename = args[0];
        if (!filename) {
          newLogs.push({ id: String(Date.now() + 1), type: 'error', text: 'cat: dosya adı belirtilmedi' });
          break;
        }
        const file = files.find(
          (f) => f.name === filename || f.path === `${currentDir}/${filename}` || f.path === filename
        );
        if (file && file.content) {
          newLogs.push({ id: String(Date.now() + 1), type: 'output', text: file.content });
        } else {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'error',
            text: `cat: ${filename}: Dosya veya dizin bulunamadı`,
          });
        }
        break;
      }

      case 'python3':
      case 'python': {
        const scriptName = args[0];
        if (scriptName === 'hello_arm64.py' || scriptName?.includes('hello')) {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `========================================
  🚀 Android Üzerinde Ubuntu 24.04 ARM64
========================================
• Mimari       : aarch64 (ARM 64-bit)
• İşletim Sis. : Linux 6.1.0-android
• Python Sürüm : 3.12.3
• Çekirdek Sayı: 8 Çekirdek
• Çalışan Dizin: ${currentDir}
========================================
Tebrikler! PRoot ortamında Python yerel hızda çalıştı!`,
          });
        } else if (args.includes('-c')) {
          const code = args.slice(args.indexOf('-c') + 1).join(' ');
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `[Python 3.12.3 Çıktısı]: Kod başarıyla çalıştırıldı: ${code.replace(/['"]/g, '')}`,
          });
        } else {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `Python 3.12.3 (main, Apr 15 2026, 08:30:12) [GCC 13.2.0 on linux-aarch64]\nType "help", "copyright", "credits" or "license" for more information.\n>>> Kod çalıştırmak için: python3 hello_arm64.py`,
          });
        }
        break;
      }

      case 'bash':
      case 'sh': {
        const shName = args[0];
        if (shName?.includes('android') || shName?.includes('kontrol')) {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `=== ANDROID PROOT UBUNTU DONANIM TESTI ===
[*] Mimari: aarch64
[*] Çekirdek: 6.1.0-android-arm64
[*] RAM Durumu: 3.4 GiB / 12.0 GiB
[*] Depolama: 43 GiB kullanılıyor, 190 GiB boş
[*] Ekran Çözünürlüğü: 1920x1080 (noVNC HTML5 Display)
[*] Android Depolama Bağı: /sdcard -> /storage/emulated/0
Sistem stabil ve kullanıma hazır!`,
          });
        } else {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `[Bash Betiği]: '${shName}' başarıyla çalıştırıldı (Çıkış kodu: 0).`,
          });
        }
        break;
      }

      case 'apt':
      case 'sudo': {
        const sub = (command === 'sudo' ? args[0] : command) || '';
        const action = command === 'sudo' ? args[1] : args[0];
        const target = command === 'sudo' ? args[2] : args[1];

        if (action === 'update') {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `Hit:1 http://ports.ubuntu.com/ubuntu-ports noble InRelease
Get:2 http://ports.ubuntu.com/ubuntu-ports noble-updates InRelease [126 kB]
Get:3 http://ports.ubuntu.com/ubuntu-ports noble-security InRelease [126 kB]
Fetched 252 kB in 0s (890 kB/s)
Reading package lists... Done
Building dependency tree... Done
All packages are up to date.`,
          });
        } else if (action === 'install') {
          const pkg = target || 'htop';
          onPackageInstall(pkg);
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  ${pkg} (arm64)
0 upgraded, 1 newly installed, 0 to remove.
Need to get 1,420 kB of archives.
Selecting previously unselected package ${pkg}.
Preparing to unpack .../${pkg}_arm64.deb ...
Unpacking ${pkg} (arm64) ...
Setting up ${pkg} ...
Processing triggers for man-db ...
[✓] ${pkg} paketi ARM64 için başarıyla yüklendi!`,
          });
        } else {
          newLogs.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: 'Kullanım: apt update | apt install <paket_adi>',
          });
        }
        break;
      }

      case 'start-desktop':
        newLogs.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `================================================
    🚀 UBUNTU 24.04 ARM64 MASAÜSTÜ BAŞLATILDI
================================================
[✓] TigerVNC Sunucusu Aktif (:1 -> 5901)
[✓] PulseAudio TCP Ses Köprüsü Aktif (127.0.0.1:4713)
[✓] noVNC HTML5 Web Sunucusu Başlatıldı!
Tarayıcınızdan şu adrese bağlanabilirsiniz:
  👉 http://127.0.0.1:6080/vnc.html
================================================`,
        });
        break;

      default:
        newLogs.push({
          id: String(Date.now() + 1),
          type: 'error',
          text: `bash: ${command}: komut bulunamadı. Kullanılabilir komutları görmek için 'help' yazın.`,
        });
        break;
    }

    setLogs(newLogs);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basit tamamlama
      const available = ['neofetch', 'uname', 'ls', 'cd', 'cat', 'python3', 'help', 'clear', 'start-desktop', 'hello_arm64.py'];
      const match = available.find((a) => a.startsWith(input));
      if (match) setInput(match);
    }
  };

  // Kısayol butonları
  const quickButtons = [
    { label: 'neofetch', cmd: 'neofetch' },
    { label: 'python3 test', cmd: 'python3 hello_arm64.py' },
    { label: 'sistem kontrol', cmd: 'bash android_sistem_kontrol.sh' },
    { label: 'uname -a', cmd: 'uname -a' },
    { label: 'ls -la', cmd: 'ls' },
    { label: 'free -m', cmd: 'free -m' },
    { label: 'start-desktop', cmd: 'start-desktop' },
    { label: 'clear', cmd: 'clear' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#121212] text-zinc-100 font-mono text-xs">
      {/* Terminal Üst Bar */}
      <div className="bg-[#1A1A1A] px-3 py-1.5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon className="w-3.5 h-3.5 text-[#E95420]" />
          <span className="font-semibold text-zinc-200">ubuntu@android: {currentDir}</span>
          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">ARM64</span>
        </div>
        <div className="text-[10px] text-zinc-500">
          Bash 5.2 • PRoot Linux
        </div>
      </div>

      {/* Terminal Çıktı Alanı */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 leading-relaxed selection:bg-[#E95420]/30 selection:text-white">
        {logs.map((log) => (
          <div key={log.id} className="whitespace-pre-wrap font-mono">
            {log.type === 'cmd' ? (
              <span className="text-emerald-400 font-bold">{log.text}</span>
            ) : log.type === 'error' ? (
              <span className="text-red-400">{log.text}</span>
            ) : (
              <span className="text-zinc-300">{log.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Hızlı Komut Tuşları (Mobil ve Hızlı Test İçin) */}
      <div className="bg-[#181818] border-t border-zinc-800/80 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <span className="text-zinc-500 text-[10px] pl-1 font-sans">Kısayol:</span>
        {quickButtons.map((qb) => (
          <button
            key={qb.label}
            onClick={() => handleRunCommand(qb.cmd)}
            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors whitespace-nowrap"
          >
            {qb.label}
          </button>
        ))}
      </div>

      {/* Komut Giriş Satırı */}
      <div className="bg-[#151515] p-2 border-t border-zinc-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold whitespace-nowrap pl-1">
          ubuntu@android:{currentDir === '/home/ubuntu' ? '~' : currentDir}$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Komut yazın (örn: neofetch, python3 hello_arm64.py, help)..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-600 font-mono text-xs"
          autoFocus
        />
        <button
          onClick={() => handleRunCommand(input)}
          className="p-1.5 bg-[#E95420] hover:bg-[#d84a1b] text-white rounded transition-colors"
          title="Çalıştır"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
