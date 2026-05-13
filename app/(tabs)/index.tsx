import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// ─── Warna & Tema ────────────────────────────────────────────
const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  card: '#1C2333',
  border: '#30363D',
  accent: '#F0B429',       // Gold
  income: '#3DBA7E',       // Emerald green
  expense: '#F25F5C',      // Coral red
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  inputBg: '#0D1117',
};

// ─── Data Awal (contoh) ──────────────────────────────────────
const DATA_AWAL = [
  { id: '1', ket: 'Uang Bulanan', nominal: 500000, tipe: 'masuk' },
  { id: '2', ket: 'Beli Makan Siang', nominal: 25000, tipe: 'keluar' },
];

// ─── Format Rupiah ───────────────────────────────────────────
const formatRupiah = (angka) => {
  const abs = Math.abs(angka);
  return 'Rp ' + abs.toLocaleString('id-ID');
};

// ─── Komponen Item Transaksi ─────────────────────────────────
const TransaksiItem = ({ item }) => {
  const isMasuk = item.tipe === 'masuk';
  return (
    <View style={styles.itemCard}>
      {/* Ikon indikator */}
      <View style={[styles.itemIcon, { backgroundColor: isMasuk ? '#1A3A2E' : '#3A1A1A' }]}>
        <Text style={{ fontSize: 18 }}>{isMasuk ? '↑' : '↓'}</Text>
      </View>

      {/* Deskripsi */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemKet} numberOfLines={1}>{item.ket}</Text>
        <Text style={styles.itemTipe}>{isMasuk ? 'Pemasukan' : 'Pengeluaran'}</Text>
      </View>

      {/* Nominal */}
      <Text style={[styles.itemNominal, { color: isMasuk ? COLORS.income : COLORS.expense }]}>
        {isMasuk ? '+' : '-'} {formatRupiah(item.nominal)}
      </Text>
    </View>
  );
};

// ─── Komponen Utama ──────────────────────────────────────────
export default function HomeScreen() {
  const [transaksi, setTransaksi] = useState(DATA_AWAL);
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');
  // Hitung total saldo
  const totalSaldo = transaksi.reduce((acc, t) => {
    return t.tipe === 'masuk' ? acc + t.nominal : acc - t.nominal;
  }, 0);

  // Hitung total pemasukan & pengeluaran
  const totalMasuk = transaksi
    .filter(t => t.tipe === 'masuk')
    .reduce((acc, t) => acc + t.nominal, 0);
  const totalKeluar = transaksi
    .filter(t => t.tipe === 'keluar')
    .reduce((acc, t) => acc + t.nominal, 0);

  // Tambah transaksi
  const tambahTransaksi = (tipe) => {
    if (!deskripsi.trim()) {
      Alert.alert('Oops!', 'Deskripsi tidak boleh kosong.');
      return;
    }
    const angka = parseInt(nominal.replace(/\D/g, ''), 10);
    if (!angka || angka <= 0) {
      Alert.alert('Oops!', 'Masukkan nominal yang valid.');
      return;
    }

    const baru = {
      id: Date.now().toString(),
      ket: deskripsi.trim(),
      nominal: angka,
      tipe,
    };

    setTransaksi(prev => [baru, ...prev]);
    setDeskripsi('');
    setNominal('');
  };

  // Header komponen (Saldo + Form)
  const ListHeader = () => (
    <>
      {/* ── Kartu Saldo ── */}
      <View style={styles.saldoCard}>
        <Text style={styles.saldoLabel}>Total Saldo</Text>
        <Text style={[styles.saldoNominal, { color: totalSaldo >= 0 ? COLORS.income : COLORS.expense }]}>
          {totalSaldo < 0 ? '-' : ''}{formatRupiah(totalSaldo)}
        </Text>

        {/* Ringkasan Masuk & Keluar */}
        <View style={styles.saldoRow}>
          <View style={styles.saldoBox}>
            <Text style={styles.saldoBoxLabel}>↑ Masuk</Text>
            <Text style={[styles.saldoBoxVal, { color: COLORS.income }]}>
              {formatRupiah(totalMasuk)}
            </Text>
          </View>
          <View style={[styles.saldoDivider]} />
          <View style={styles.saldoBox}>
            <Text style={styles.saldoBoxLabel}>↓ Keluar</Text>
            <Text style={[styles.saldoBoxVal, { color: COLORS.expense }]}>
              {formatRupiah(totalKeluar)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Form Input ── */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Tambah Transaksi</Text>

        <Text style={styles.inputLabel}>Deskripsi</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Beli Makan, Uang Saku..."
          placeholderTextColor={COLORS.textSecondary}
          value={deskripsi}
          onChangeText={setDeskripsi}
        />

        <Text style={styles.inputLabel}>Nominal (Rp)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 50000"
          placeholderTextColor={COLORS.textSecondary}
          value={nominal}
          onChangeText={setNominal}
          keyboardType="numeric"
        />

        {/* Tombol */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnMasuk]}
            onPress={() => tambahTransaksi('masuk')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>+ Pemasukan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnKeluar]}
            onPress={() => tambahTransaksi('keluar')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>− Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Label Riwayat ── */}
      <View style={styles.riwayatHeader}>
        <Text style={styles.riwayatTitle}>Riwayat Transaksi</Text>
        <Text style={styles.riwayatCount}>{transaksi.length} transaksi</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* ── App Header ── */}
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>💳 DompetKu</Text>
        <Text style={styles.appSubtitle}>Pencatat Keuangan</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={transaksi}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransaksiItem item={item} />}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🧾</Text>
              <Text style={styles.emptyText}>Belum ada transaksi.</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // App Header
  appHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  listContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Kartu Saldo
  saldoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  saldoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  saldoNominal: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  saldoRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saldoBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  saldoDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  saldoBoxLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  saldoBoxVal: {
    fontSize: 15,
    fontWeight: '700',
  },

  // Form
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnMasuk: {
    backgroundColor: '#1A3A2E',
    borderWidth: 1,
    borderColor: COLORS.income,
  },
  btnKeluar: {
    backgroundColor: '#3A1A1A',
    borderWidth: 1,
    borderColor: COLORS.expense,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  // Riwayat Header
  riwayatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riwayatTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  riwayatCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  // Item Transaksi
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemKet: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemTipe: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemNominal: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
