# 💳 DompetKu — Expense Tracker App

Aplikasi pencatat keuangan pribadi sederhana berbasis **React Native**, dibuat untuk UTS Project.

---

## 📱 Fitur Aplikasi

| Fitur | Keterangan |
|---|---|
| 💰 **Header Saldo** | Menampilkan total saldo yang berubah otomatis |
| ➕ **Tambah Pemasukan** | Input deskripsi + nominal, saldo bertambah |
| ➖ **Tambah Pengeluaran** | Input deskripsi + nominal, saldo berkurang |
| 🧾 **Riwayat Transaksi** | Daftar semua transaksi dengan `FlatList` |
| 🟢 **Warna Hijau** | Nominal pemasukan ditampilkan warna hijau |
| 🔴 **Warna Merah** | Nominal pengeluaran ditampilkan warna merah |

---

## 🎨 Desain

Tema **"Midnight Finance"** — dark mode elegan ala aplikasi fintech modern:
- Background gelap `#0D1117` (seperti GitHub dark)
- Aksen emas untuk elemen premium
- Hijau emerald (`#3DBA7E`) untuk pemasukan
- Merah coral (`#F25F5C`) untuk pengeluaran
- Card-based layout dengan border subtle

---

## 🏗️ Struktur Kode

```
UTS/
├── App.js          ← Komponen utama
└── README.md
```

---

## 🧠 Logika State

```js
// State transaksi (array of objects)
const [transaksi, setTransaksi] = useState([...]);

// Hitung saldo dengan reduce
const totalSaldo = transaksi.reduce((acc, t) => {
  return t.tipe === 'masuk' ? acc + t.nominal : acc - t.nominal;
}, 0);
```

---

## 🚀 Cara Menjalankan

```bash
# 1. Buat project baru
npx react-native init DompetKu

# 2. Ganti isi App.js dengan kode dari repo ini

# 3. Jalankan
npx react-native run-android
# atau
npx react-native run-ios
```

> Jika menggunakan **Expo**:
> ```bash
> npx create-expo-app DompetKu
> # Ganti App.js, lalu:
> npx expo start
> ```

---

## 📸 Screenshot

> [App Dompetku](app.jpeg)


---


## 🔗 Demo
[Cek di Expo Snack](https://snack.expo.dev/@vnderbilts/app-dompetku)