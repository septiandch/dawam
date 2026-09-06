# Content provenance and release review

Recitations were imported without generating or rewriting Arabic, transliteration, or Indonesian translation from Fitrahive dua-dhikr, commit `f42f895f914319a844c3e3c2279483cae060ea19` (MIT). The license is retained in CONTENT-LICENSE.txt. Upstream URL: https://github.com/fitrahive/dua-dhikr. Original morning/evening collection order is retained; identical entries are shared by ID. Individual entries are separate JSON files for reviewable diffs. `scripts/import-content.mjs` records the transformation.

## Verified corrections

- Al-Ikhlas, Al-Falaq, An-Naas: upstream Abu Dawud 4241 replaced with 5082, checked at https://sunnah.com/abudawud:5082; Qur'an references added.
- Ayat al-Kursi: use QS. Al-Baqarah 2:255 for the text. Upstream Tirmidhi 2879 and associated morning/evening virtue were not carried over because the stated reference did not establish that claim.
- Health/protection supplication: three repetitions, checked against https://sunnah.com/abudawud:5090 (upstream had one).
- Virtues shown only for the three final surahs and Sayyid al-Istighfar. The latter was checked against https://sunnah.com/bukhari:6306. Other upstream commentary is intentionally omitted pending review.
- Complex repetition instructions remain verbatim notes instead of being reduced to a misleading single count.

Daily hadith excerpts are sourced verbatim from https://hadeethenc.com/id/browse/hadith/5845 and https://hadeethenc.com/id/browse/hadith/10411. Each excerpt is under 25 words and has a visible link.

## Still required before declaring the religious dataset production-reviewed

A qualified editorial/religious reviewer must review all Arabic, diacritics, transliteration, Indonesian translations, remaining references, and collection membership. In particular, review the evening inclusion of Juwairiyah's morning tasbih and upstream time-specific notes attached to shared entries. MIT covers the supplied repository, but upstream does not identify every original translation publisher; confirm underlying translation redistribution rights with the maintainer. This implementation does not claim that a complete scholarly review or publisher-rights audit has occurred.
