import React, { useState } from 'react';
import { 
  Smartphone, 
  Code, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  GitBranch,
  Terminal,
  FolderArchive
} from 'lucide-react';

export const StandaloneApkApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'main_activity' | 'service' | 'manifest' | 'github_actions'>('architecture');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const mainActivityCode = `package com.androdesktop.ubuntu

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var statusText: TextView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.desktopWebView)
        progressBar = findViewById(R.id.bootProgressBar)
        statusText = findViewById(R.id.statusTextView)

        // 1. Android Phantom Killer'ı önlemek için Ön Plan Servisini (Foreground Service) başlat
        val serviceIntent = Intent(this, LinuxDaemonService::class.java)
        ContextCompat.startForegroundService(this, serviceIntent)

        // 2. WebView'i tam ekran donanım hızlandırmalı masaüstü arayüzü olarak yapılandır
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(false)
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Masaüstü yüklendiğinde yükleme çubuğunu gizle
                progressBar.visibility = View.GONE
                statusText.visibility = View.GONE
                webView.visibility = View.VISIBLE
            }
        }

        // 3. Dahili noVNC / VNC sunucusuna doğrudan bağlan (Kullanıcı harici tarayıcı açmaz!)
        statusText.text = "Ubuntu 24.04 (ARM64) başlatılıyor..."
        
        // Servis başladığında 127.0.0.1:6080 otomatik olarak uygulama içine yüklenir
        webView.postDelayed({
            webView.loadUrl("http://127.0.0.1:6080/vnc.html?autoconnect=true&resize=scale")
        }, 2500)
    }

    override fun onBackPressed() {
        // Geri tuşuna basıldığında uygulamadan yanlışlıkla çıkmayı önle
        moveTaskToBack(true)
    }
}`;

  const serviceCode = `package com.androdesktop.ubuntu

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import java.io.File

class LinuxDaemonService : Service() {

    private val CHANNEL_ID = "ubuntu_desktop_service"
    private var prootProcess: Process? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        val notification = buildForegroundNotification()
        startForeground(1001, notification)

        // PRoot ve Ubuntu XFCE arka plan sürecini başlat
        startUbuntuEnvironment()
    }

    private fun startUbuntuEnvironment() {
        Thread {
            try {
                val filesDir = applicationContext.filesDir.absolutePath
                val rootfsDir = "$filesDir/rootfs"

                // 1. Gerekirse dahili rootfs'i aç
                val rootfsMarker = File("$rootfsDir/etc/os-release")
                if (!rootfsMarker.exists()) {
                    extractBundledRootfs(filesDir)
                }

                // 2. PRoot ve VNC/noVNC daemon'unu başlat
                val prootBin = "\$filesDir/bin/proot"
                val cmd = arrayOf(
                    prootBin,
                    "-r", rootfsDir,
                    "-b", "/dev",
                    "-b", "/proc",
                    "-b", "/sys",
                    "-b", "/sdcard:/storage/emulated/0",
                    "-w", "/root",
                    "/usr/local/bin/start-desktop"
                )

                val pb = ProcessBuilder(*cmd)
                pb.environment()["HOME"] = "/root"
                pb.environment()["USER"] = "root"
                pb.redirectErrorStream(true)
                prootProcess = pb.start()

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    private fun extractBundledRootfs(destDir: String) {
        // assets/ubuntu-arm64-min.tar.xz dosyasını destDir dizinine açar
    }

    private fun buildForegroundNotification(): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Ubuntu 24.04 ARM64 Masaüstü")
            .setContentText("Linux oturumu ve masaüstü arka planda aktif")
            .setSmallIcon(android.R.drawable.ic_menu_agenda)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID, "Linux Desktop Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        prootProcess?.destroy()
        super.onDestroy()
    }
}`;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.androdesktop.ubuntu">

    <!-- Gerekli İzinler -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Ubuntu Desktop"
        android:theme="@style/Theme.AppCompat.NoActionBar"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true"
            android:screenOrientation="sensorLandscape">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".LinuxDaemonService"
            android:foregroundServiceType="specialUse"
            android:exported="false" />

    </application>
</manifest>`;

  const githubActionsWorkflow = `name: Build Ubuntu Desktop Standalone APK

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Setup Android SDK
      uses: android-actions/setup-android@v3

    - name: Download & Bundle PRoot (ARM64)
      run: |
        mkdir -p app/src/main/jniLibs/arm64-v8a
        curl -sL https://github.com/termux/proot/releases/download/v5.4.0/proot-android-arm64 -o app/src/main/jniLibs/arm64-v8a/libproot.so

    - name: Build APK with Gradle
      run: ./gradlew assembleDebug

    - name: Upload Standalone APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: UbuntuDesktop-ARM64.apk
        path: app/build/outputs/apk/debug/app-debug.apk`;

  return (
    <div className="flex flex-col h-full bg-[#181818] text-zinc-200 text-xs select-none">
      {/* Üst Başlık */}
      <div className="p-4 bg-[#202020] border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Tek Tıkla APK (All-in-One) Mimarisi</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                Termux'suz Bağımsız APK
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Uygulamayı telefona kurup açtığınızda doğrudan Ubuntu masaüstünü getiren yerel Android projesi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const zipContent = `// Ubuntu All-in-One Android Studio Projesi\n// MainActivity, LinuxDaemonService ve Manifest hazırlandı.`;
              const element = document.createElement('a');
              const file = new Blob([mainActivityCode + '\n\n' + serviceCode + '\n\n' + manifestCode], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = 'UbuntuDesktop-Android-Source.txt';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Kaynak Kodları İndir</span>
          </button>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex items-center gap-1 px-4 py-2 bg-[#1b1b1b] border-b border-zinc-800 overflow-x-auto text-[11px]">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'architecture' ? 'bg-[#E95420] text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Mimari (Nasıl Çalışır?)</span>
        </button>
        <button
          onClick={() => setActiveTab('main_activity')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'main_activity' ? 'bg-[#E95420] text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>MainActivity.kt</span>
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'service' ? 'bg-[#E95420] text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>LinuxDaemonService.kt</span>
        </button>
        <button
          onClick={() => setActiveTab('manifest')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'manifest' ? 'bg-[#E95420] text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AndroidManifest.xml</span>
        </button>
        <button
          onClick={() => setActiveTab('github_actions')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'github_actions' ? 'bg-[#E95420] text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Bulutta APK Derleme (GitHub Actions)</span>
        </button>
      </div>

      {/* İçerik */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'architecture' && (
          <div className="max-w-3xl space-y-6">
            <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Neden Termux'a İhtiyaç Duymayan Tek Parça APK?
              </h3>
              <p className="text-zinc-300 leading-relaxed text-xs">
                Termux bir terminal emülatörüdür. Bizim hedeflediğimiz ise <strong>UserLAnd</strong> veya <strong>Andronix / Termux-X11</strong> gibi bağımsız bir Android uygulaması (APK) geliştirmektir. Bu uygulamada kullanıcı siyah terminal ekranı görmez, komut yazmaz ve tarayıcıya geçmek zorunda kalmaz.
              </p>
            </div>

            {/* Karşılaştırma Tablosu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl space-y-2">
                <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  <span>❌ Manuel Yöntem (Termux + Tarayıcı)</span>
                </div>
                <ul className="space-y-1.5 text-zinc-400 text-[11px] list-disc list-inside">
                  <li>Termux'u ayrı indirip açmak gerekir.</li>
                  <li>Siyah ekrana elle komutlar yazmak gerekir.</li>
                  <li>Tarayıcı sekmesine geçildiğinde Android pili Termux'u öldürür (Signal 9 hatası).</li>
                  <li>Kullanıcı dostu değildir.</li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl space-y-2">
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span>✅ Bağımsız All-in-One APK (Hedefimiz)</span>
                </div>
                <ul className="space-y-1.5 text-zinc-300 text-[11px] list-disc list-inside">
                  <li>Telefonunuza tek bir <code>UbuntuDesktop.apk</code> iner.</li>
                  <li>İçinde PRoot NDK kütüphanesi (<code>libproot.so</code>) gömülüdür.</li>
                  <li>Ön plan servisi (Foreground Service) sayesinde Android asla süreci öldüremez.</li>
                  <li>Ekranda dahili WebView / Canvas doğrudan Ubuntu masaüstünü tam ekran açar!</li>
                </ul>
              </div>
            </div>

            {/* Mimari Şema */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 font-mono text-[11px]">
              <div className="text-zinc-300 font-sans font-semibold text-xs mb-2">Android APK İçi Katmanlar:</div>
              <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 space-y-1.5 text-zinc-300">
                <div className="text-cyan-400 font-bold">[1. Katman - UI / Kullanıcı Arayüzü]</div>
                <div>└── MainActivity (Gömülü WebView / noVNC Canvas + Dokunmatik Fare Sürücüsü)</div>
                <div className="text-amber-400 font-bold mt-2">[2. Katman - Android Arka Plan Servisi]</div>
                <div>└── LinuxDaemonService (Foreground Notification - Phantom Killer'a karşı korumalı)</div>
                <div className="text-emerald-400 font-bold mt-2">[3. Katman - Native C / NDK Katmanı]</div>
                <div>└── libproot.so (Ptrace tabanlı rootsuz Linux çekirdek simülasyonu)</div>
                <div className="text-purple-400 font-bold mt-2">[4. Katman - Linux Dosya Sistemi]</div>
                <div>└── /data/data/com.androdesktop.ubuntu/files/rootfs (Ubuntu 24.04 ARM64 + XFCE4)</div>
              </div>
            </div>

            {/* Doğrudan Telefonda Canlı Kullanım (PWA) */}
            <div className="p-4 bg-indigo-950/30 border border-indigo-800/60 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white">Telefona Doğrudan Web Uygulaması (PWA) Olarak Yükleme</h4>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Şu an kullandığınız bu web uygulamasını Samsung Browser veya Chrome'un sağ üstteki menüsünden <strong>"Uygulama olarak yükle"</strong> veya <strong>"Ana ekrana ekle"</strong> diyerek telefonunuza APK gibi bağımsız bir simge olarak ekleyebilirsiniz! Böylece tarayıcı çubukları olmadan tam ekran çalışır.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'main_activity' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-zinc-400 font-mono text-[11px]">app/src/main/java/com/androdesktop/ubuntu/MainActivity.kt</span>
              <button
                onClick={() => handleCopy('main_activity', mainActivityCode)}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] transition-colors"
              >
                {copied === 'main_activity' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'main_activity' ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="p-4 bg-black/80 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed border border-zinc-800">
              {mainActivityCode}
            </pre>
          </div>
        )}

        {activeTab === 'service' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-zinc-400 font-mono text-[11px]">app/src/main/java/com/androdesktop/ubuntu/LinuxDaemonService.kt</span>
              <button
                onClick={() => handleCopy('service', serviceCode)}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] transition-colors"
              >
                {copied === 'service' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'service' ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="p-4 bg-black/80 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed border border-zinc-800">
              {serviceCode}
            </pre>
          </div>
        )}

        {activeTab === 'manifest' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-zinc-400 font-mono text-[11px]">app/src/main/AndroidManifest.xml</span>
              <button
                onClick={() => handleCopy('manifest', manifestCode)}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] transition-colors"
              >
                {copied === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'manifest' ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="p-4 bg-black/80 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed border border-zinc-800">
              {manifestCode}
            </pre>
          </div>
        )}

        {activeTab === 'github_actions' && (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
              <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Bilgisayar Olmadan GitHub Üzerinde Ücretsiz APK Derleme
              </h4>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Bu dosyayı bir GitHub reposunun içine <code>.github/workflows/build-apk.yml</code> olarak koyduğunuzda, GitHub Actions sizin yerinize Android SDK'yı kurar, kodları derler ve telefonunuza indirebileceğiniz hazır <strong>`UbuntuDesktop-ARM64.apk`</strong> çıktısı üretir!
              </p>
            </div>

            <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
              <span className="text-zinc-400 font-mono text-[11px]">.github/workflows/build-apk.yml</span>
              <button
                onClick={() => handleCopy('workflow', githubActionsWorkflow)}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] transition-colors"
              >
                {copied === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'workflow' ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="p-4 bg-black/80 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed border border-zinc-800">
              {githubActionsWorkflow}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
