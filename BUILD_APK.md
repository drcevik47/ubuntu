# Android Studio / Capacitor APK Derleme Kılavuzu

Bu proje **Capacitor Android** desteği ile donatılmıştır. Projeyi bilgisayarınızda derleyip telefonunuza yüklenebilir `.apk` dosyası üretmek için aşağıdaki adımları izleyin:

---

### Gereksinimler:
1. **Node.js** (v18 veya üzeri)
2. **Android Studio** (veya Android SDK / Command Line Tools)
3. **JDK 17** (Android Studio ile birlikte otomatik gelir)

---

### 1. Adım: Bağımlılıkları Yükleyin ve Projeyi Derleyin
Bilgisayarınızda terminali açıp proje klasörüne gidin:

```bash
npm install
npm run build
```

---

### 2. Adım: Android Platformunu Ekleyin (Tek Seferlik)
```bash
npx cap add android
```
> Bu komut projenizin içine hazır `android/` klasörünü (tam teşekküllü Android Studio projesi) oluşturacaktır.

---

### 3. Adım: APK Dosyasını Derleyin

#### A) Komut Satırından Hızlıca Derlemek (Android Studio açmadan):
```bash
npx cap sync android
cd android
./gradlew assembleDebug
```
*(Windows PowerShell veya CMD kullanıyorsanız `gradlew assembleDebug` yazın).*

İşlem tamamlandığında APK dosyanız şurada hazır olacaktır:
📂 **`android/app/build/outputs/apk/debug/app-debug.apk`**

Bu dosyayı telefonunuza atıp doğrudan kurabilirsiniz!

---

#### B) Android Studio Arayüzü ile Açmak:
```bash
npx cap open android
```
Android Studio açıldıktan sonra:
1. Üst menüden **Build > Build Bundle(s) / APK(s) > Build APK(s)** seçeneğine tıklayın.
2. Sağ altta çıkan bildirimden **locate** diyerek üretilen `.apk` dosyasını alın.

---

### Güncellemeleri Android'e Aktarmak:
Web kodunda veya arayüzde bir değişiklik yaptığınızda Android tarafına aktarmak için:
```bash
npm run build
npx cap sync
```
komutunu çalıştırmanız yeterlidir.
