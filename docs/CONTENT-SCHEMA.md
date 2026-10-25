# Format entri bacaan

Semua file di `src/lib/content/entries/` memakai skema versi 1 dan susunan field yang sama. Validator menolak field yang hilang, field tambahan, referensi variant yang tidak ditemukan, dan format nama file yang salah.

## Nama file

Gunakan maksimal empat kata termasuk awalan jenis, dengan huruf kecil dan underscore, tanpa potongan hash:

- `surah_al_ikhlas.json`: surah lengkap.
- `ayat_kursi.json`: ayat tertentu.
- `doa_sebelum_tidur.json`: doa.
- `dzikir_takbir.json`: dzikir.
- `shalat_doa_iftitah.json`: bacaan di dalam shalat.

Slug harus sama dengan nama file tanpa ekstensi, dengan underscore diganti tanda hubung. Contoh: `surah_al_ikhlas.json` memakai slug `surah-al-ikhlas`. Slug juga maksimal empat kata termasuk awalan jenis. `id` tetap stabil agar referensi kategori dan preferensi pembaca tidak berubah. Tautan lama dialihkan melalui `src/lib/content/legacy-slugs.json`; parameter `start` lama juga tetap dikenali.

## Field entri

| Field              | Fungsi                                                             |
| ------------------ | ------------------------------------------------------------------ |
| `schemaVersion`    | Selalu `1`.                                                        |
| `id`               | Identitas entri yang stabil dan unik.                              |
| `slug`             | Identitas URL yang unik, sesuai nama file dan maksimal empat kata. |
| `type`             | `dhikr`, `dua`, atau `prayer_recitation`.                          |
| `title`            | Judul umum entri.                                                  |
| `text`             | Teks bersama: `arabic`, `transliteration`, `translation`.          |
| `defaultVariantId` | ID variant utama.                                                  |
| `variants`         | Daftar variant; minimal satu, termasuk variant utama.              |

Urutan bacaan ditentukan oleh kategori, sehingga entri tidak memiliki `order`.

## Field variant

Setiap variant wajib mempunyai semua field berikut:

| Field                | Fungsi                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| `id`                 | Unik di dalam entri, misalnya `default` atau `bedtime`.                   |
| `label`              | Nama variant untuk pilihan versi.                                         |
| `title`              | Judul bacaan dalam konteks variant ini.                                   |
| `text`               | `null` untuk memakai teks bersama; objek lengkap jika lafaznya berbeda.   |
| `repetitions`        | Bilangan bulat positif, atau `null` jika tidak menetapkan hitungan.       |
| `readingInstruction` | Petunjuk ringkas, atau `""`.                                              |
| `notes`              | Catatan tambahan, atau `""`.                                              |
| `sources`            | Dalil untuk variant ini; minimal satu.                                    |
| `virtues`            | Keutamaan beserta `sourceIds`, atau `[]`.                                 |
| `alternativeIds`     | ID alternatif lafaz yang boleh ditampilkan pada pemilih versi, atau `[]`. |

Hanya `text: null` yang mewarisi teks bersama. Hitungan, petunjuk, catatan, dalil, dan keutamaan selalu ditetapkan sendiri oleh variant; tidak diwarisi dari variant utama. Setiap sumber mempunyai `id`, `type`, `label`, dan `url`; gunakan `url: null` jika tidak tersedia tautan. `sourceIds` dalam keutamaan harus merujuk sumber milik variant yang sama.

## Memilih variant dalam kategori

Kategori hanya menyimpan referensi dan urutannya:

```json
{
  "entryId": "9e3658b41188",
  "variantId": "bedtime"
}
```

Ini memilih variant `bedtime` dari `surah_al_ikhlas.json`. Kategori pagi dan petang memilih `default` dari file yang sama. Tidak perlu menyalin teks atau menyimpan override di kategori.

Untuk menambah konteks baru, tambahkan variant ke entri lalu pilih ID-nya pada `category.items`. Untuk menambah alternatif lafaz yang dapat dipilih pembaca, tambahkan variant dengan objek `text` lengkap dan cantumkan ID-nya pada `alternativeIds` variant konteks yang sesuai. Variant konteks seperti `bedtime` tidak otomatis muncul sebagai alternatif lafaz.

## Pemeriksaan

Jalankan `npm test`, `npm run check`, dan `npm run build` setelah perubahan skema atau referensi. Untuk perubahan konten saja, `node scripts/validate-content.mjs` memeriksa seluruh file dan referensinya. Skrip impor menghasilkan skema yang sama dan mempertahankan entri hasil kurasi yang sudah ada.
