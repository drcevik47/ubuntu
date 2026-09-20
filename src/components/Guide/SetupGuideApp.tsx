import React from 'react';
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Terminal, 
  Cpu, 
  BatteryWarning, 
  ExternalLink, 
  FolderSync, 
  Monitor,
  Copy
} from 'lucide-react';

export const SetupGuideApp: React.FC = () => {
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] text-zinc-200 text-xs overflow-y-auto p-4 sm:p-6 space-y-6 select-text">
      {/* Başlık */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="w-11 h-11 rounded-xl bg-indigo-600/90 flex items-center justify-center text-white shadow-lg">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Android'de Rootsuz Ubuntu Masaüstü Rehberi</h2>
          <p className="text-zinc-400 text-xs">
            Termux + PRoot + XFCE4 + noVNC (Tarayıcı Üzerinden Sıfır Sorunsuz Bağlantı)
          </p>
        </div>
      </div>

      {/* Kritik Uyarı: Play Store vs F-Droid */}
      <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>ÖNEMLİ: Termux'u Kesinlikle Google Play Store'dan İndirmeyin!</span>
        </div>
        <p className="text-zinc-300 leading-relaxed text-xs">
          Google Play Store'daki Termux sürümü 2020 yılından beri güncellenmemektedir ve paket depoları kapalıdır.
          Bu nedenle mutlaka <strong>F-Droid</strong> veya <strong>GitHub Releases</strong> üzerinden en son APK sürümünü kurmalısınız.
        </p>
        <div className="flex gap-2 pt-1 font-sans">
          <a
            href="https://f-droid.org/packages/com.termux/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <span>F-Droid Termux Sayfası</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/termux/termux-app/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <span>GitHub En Son APK</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Adım Adım Kurulum Kartları */}
      <div className="space-y-4 font-sans">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-zinc-400">
          Kurulum Aşamaları (5 Dakika)
        </h3>

        {/* Adım 1 */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E95420] text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h4 className="font-semibold text-white text-sm">Termux'u Açın ve Depolama İznini Verin</h4>
          </div>
          <p className="text-zinc-400 text-xs pl-8">
            Linux içinden telefonunuzun Galeri, İndirilenler ve SD kart dosyalarına erişmek için şu komutu verin:
          </p>
          <div className="pl-8">
            <div className="flex items-center justify-between p-2.5 bg-black/90 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400">
              <code>termux-setup-storage</code>
              <button
                onClick={() => copyText('termux-setup-storage')}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Kopyala"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              * Ekrana gelen "Fotoğraf ve dosyalara erişim" penceresinde <strong>İzin Ver</strong> seçeneğine dokunun.
            </span>
          </div>
        </div>

        {/* Adım 2 */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E95420] text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h4 className="font-semibold text-white text-sm">Kurulum Scriptini Çalıştırın</h4>
          </div>
          <p className="text-zinc-400 text-xs pl-8">
            PRoot-Distro, Ubuntu 24.04 ARM64, XFCE4 ve noVNC paketlerini tek seferde otomatik kurar:
          </p>
          <div className="pl-8">
            <div className="flex items-center justify-between p-2.5 bg-black/90 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400 break-all">
              <code>pkg update -y && pkg install -y proot-distro && proot-distro install ubuntu</code>
              <button
                onClick={() => copyText('pkg update -y && pkg install -y proot-distro && proot-distro install ubuntu')}
                className="text-zinc-500 hover:text-white transition-colors shrink-0 ml-2"
                title="Kopyala"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              * "Script Üretici" sekmesindeki tek satırlık scripti kopyalayıp Termux'a yapıştırabilirsiniz.
            </span>
          </div>
        </div>

        {/* Adım 3 */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E95420] text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h4 className="font-semibold text-white text-sm">Masaüstünü Başlatın</h4>
          </div>
          <p className="text-zinc-400 text-xs pl-8">
            Kurulum bittikten sonra masaüstünü açmak için sadece şu komutu yazın:
          </p>
          <div className="pl-8">
            <div className="flex items-center justify-between p-2.5 bg-black/90 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400">
              <code>start-desktop</code>
              <button
                onClick={() => copyText('start-desktop')}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Kopyala"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Adım 4 */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E95420] text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h4 className="font-semibold text-white text-sm">Tarayıcınızdan veya WebView'den Bağlanın</h4>
          </div>
          <p className="text-zinc-400 text-xs pl-8">
            Telefonunuzdaki Chrome, Brave veya Firefox tarayıcısını açıp şu adrese gidin:
          </p>
          <div className="pl-8">
            <div className="flex items-center justify-between p-2.5 bg-black/90 rounded-lg border border-zinc-800 font-mono text-xs text-cyan-400">
              <code>http://127.0.0.1:6080/vnc.html</code>
              <button
                onClick={() => copyText('http://127.0.0.1:6080/vnc.html')}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Kopyala"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Ekranda <strong>Connect</strong> butonuna bastığınız anda tam ekran Ubuntu XFCE4 masaüstünüz açılacaktır!
            </span>
          </div>
        </div>
      </div>

      {/* Android 12+ Phantom Process Killer Koruma Rehberi */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 font-sans">
        <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
          <BatteryWarning className="w-5 h-5" />
          <span>Android 12/13/14+ İçin Kritik İpucu: "Phantom Process Killer"</span>
        </div>
        <p className="text-zinc-300 text-xs leading-relaxed">
          Android 12 ve sonraki sürümlerde Google, arka planda 32'den fazla alt süreç açan uygulamaları (Termux gibi) otomatik olarak sonlandıran bir mekanizma eklemiştir.
          Linux'un beklenmedik şekilde kapanmaması için 2 şey yapmalısınız:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-zinc-300">
          <li>
            <strong>Pil Optimizasyonunu Devre Dışı Bırakın:</strong> Telefon ayarlarından Termux uygulamasına girin, Pil / Güç Yönetimi kısmında "Kısıtlanmamış" (Unrestricted) seçin.
          </li>
          <li>
            <strong>(İsteğe bağlı - ADB ile kalıcı çözüm):</strong> Bilgisayardan veya telefondaki Shizuku/LADB uygulamasından şu komutu bir kez çalıştırın:
            <div className="mt-1 p-2 bg-black/90 rounded border border-zinc-800 font-mono text-emerald-400 flex items-center justify-between">
              <code>adb shell /system/bin/device_config put activity_manager max_phantom_processes 2147483647</code>
              <button
                onClick={() => copyText('adb shell /system/bin/device_config put activity_manager max_phantom_processes 2147483647')}
                className="text-zinc-500 hover:text-white ml-2"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </li>
        </ol>
      </div>

      {/* Dokunmatik Kontrol Kılavuzu */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 font-sans">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <Smartphone className="w-5 h-5" />
          <span>Tarayıcıda Dokunmatik Ekran Kullanım İpuçları</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-zinc-800/80 rounded-lg border border-zinc-700/50">
            <span className="font-semibold text-white">Tek Dokunuş:</span>
            <p className="text-zinc-400 mt-0.5">Sol fare tıklaması.</p>
          </div>
          <div className="p-2.5 bg-zinc-800/80 rounded-lg border border-zinc-700/50">
            <span className="font-semibold text-white">Basılı Tutma (Uzun Basma):</span>
            <p className="text-zinc-400 mt-0.5">Sağ fare tıklaması (bağlam menüsü).</p>
          </div>
          <div className="p-2.5 bg-zinc-800/80 rounded-lg border border-zinc-700/50">
            <span className="font-semibold text-white">İki Parmakla Kaydırma:</span>
            <p className="text-zinc-400 mt-0.5">Fare tekerleği yukarı/aşağı kaydırma.</p>
          </div>
          <div className="p-2.5 bg-zinc-800/80 rounded-lg border border-zinc-700/50">
            <span className="font-semibold text-white">Klavyeyi Açma:</span>
            <p className="text-zinc-400 mt-0.5">noVNC sol panelindeki klavye simgesine dokunun.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
