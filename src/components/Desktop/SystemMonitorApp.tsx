import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Layers, RefreshCw, XCircle } from 'lucide-react';
import { ProcessItem } from '../../types';

export const SystemMonitorApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'processes'>('resources');
  
  // 8 Çekirdekli ARM64 CPU verisi
  const [cores, setCores] = useState<number[]>([18, 42, 25, 12, 65, 8, 30, 22]);
  const [overallCpu, setOverallCpu] = useState(28);
  const [ramUsed, setRamUsed] = useState(3.4);

  const [processes, setProcesses] = useState<ProcessItem[]>([
    { pid: 1, user: 'root', cpu: 0.1, mem: 0.2, name: 'proot (container init)', status: 'S' },
    { pid: 142, user: 'ubuntu', cpu: 12.4, mem: 4.8, name: 'Xorg / Xtightvnc (:1)', status: 'R' },
    { pid: 168, user: 'ubuntu', cpu: 6.2, mem: 3.1, name: 'websockify (noVNC :6080)', status: 'S' },
    { pid: 210, user: 'ubuntu', cpu: 4.5, mem: 2.8, name: 'xfce4-session', status: 'S' },
    { pid: 245, user: 'ubuntu', cpu: 2.1, mem: 2.0, name: 'xfwm4 (pencere yöneticisi)', status: 'S' },
    { pid: 312, user: 'ubuntu', cpu: 1.8, mem: 1.9, name: 'pulseaudio (tcp bridge)', status: 'S' },
    { pid: 450, user: 'ubuntu', cpu: 0.8, mem: 1.5, name: 'bash (terminal shell)', status: 'S' },
    { pid: 520, user: 'ubuntu', cpu: 0.2, mem: 1.2, name: 'dbus-daemon --system', status: 'S' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCores((prev) =>
        prev.map(() => Math.floor(Math.random() * 45) + 10)
      );
      setOverallCpu(Math.floor(Math.random() * 25) + 15);
      setRamUsed(Number((3.2 + Math.random() * 0.4).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKill = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] text-zinc-200 text-xs select-none">
      {/* Üst Sekmeler */}
      <div className="h-10 bg-[#202020] border-b border-zinc-800 px-4 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs ${
            activeTab === 'resources'
              ? 'bg-[#E95420] text-white font-medium shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Donanım Kaynakları</span>
        </button>

        <button
          onClick={() => setActiveTab('processes')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs ${
            activeTab === 'processes'
              ? 'bg-[#E95420] text-white font-medium shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>İşlemler (Süreçler)</span>
        </button>
      </div>

      {/* İçerik */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'resources' ? (
          <div className="space-y-4">
            {/* CPU Genel & Çekirdekler */}
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#E95420]" />
                  <span className="font-semibold text-white">İşlemci: ARM64 (8 Çekirdek Kryo/Cortex)</span>
                </div>
                <span className="text-sm font-bold text-[#E95420]">{overallCpu}%</span>
              </div>

              {/* 8 Çekirdek Çubuğu */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {cores.map((usage, idx) => (
                  <div key={idx} className="p-2 bg-zinc-800/80 rounded-lg border border-zinc-700/40">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>Çekirdek {idx + 1}</span>
                      <span className="text-zinc-200 font-mono">{usage}%</span>
                    </div>
                    <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${usage}%`,
                          backgroundColor: usage > 70 ? '#EF4444' : usage > 40 ? '#F59E0B' : '#10B981',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RAM ve Swap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white">Bellek (RAM)</span>
                  </div>
                  <span className="font-mono text-cyan-400 text-xs">
                    {ramUsed} GB / 12.0 GB ({Math.round((ramUsed / 12) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(ramUsed / 12) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500">
                  Android LPDDR5X paylaşımlı bellek (Rootsuz Sandbox Alanı)
                </p>
              </div>

              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">Android Depolama (/sdcard)</span>
                  </div>
                  <span className="font-mono text-emerald-400 text-xs">43.2 GB / 256 GB (17%)</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[17%]" />
                </div>
                <p className="text-[10px] text-zinc-500">
                  UFS 4.0 Dahili Depolama Alanı
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-400 border-b border-zinc-700 text-[11px]">
                  <th className="p-2.5 font-medium">PID</th>
                  <th className="p-2.5 font-medium">Süreç Adı</th>
                  <th className="p-2.5 font-medium">Kullanıcı</th>
                  <th className="p-2.5 font-medium">CPU %</th>
                  <th className="p-2.5 font-medium">RAM %</th>
                  <th className="p-2.5 font-medium text-right">Eylem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
                {processes.map((proc) => (
                  <tr key={proc.pid} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-2.5 text-zinc-400">{proc.pid}</td>
                    <td className="p-2.5 text-white font-medium">{proc.name}</td>
                    <td className="p-2.5 text-zinc-400">{proc.user}</td>
                    <td className="p-2.5 text-[#E95420]">{proc.cpu}%</td>
                    <td className="p-2.5 text-cyan-400">{proc.mem}%</td>
                    <td className="p-2.5 text-right font-sans">
                      {proc.pid > 1 && (
                        <button
                          onClick={() => handleKill(proc.pid)}
                          className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50 text-[10px] transition-colors"
                        >
                          Durdur
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
