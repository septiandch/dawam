# Content provenance and release review

Recitations were imported without generating or rewriting Arabic, transliteration, or Indonesian translation from Fitrahive dua-dhikr, commit `f42f895f914319a844c3e3c2279483cae060ea19` (MIT). The license is retained in CONTENT-LICENSE.txt. Upstream URL: https://github.com/fitrahive/dua-dhikr. Original morning/evening collection order is retained; identical entries are shared by ID. Individual entries are separate JSON files for reviewable diffs. `scripts/import-content.mjs` records the transformation.

## Verified corrections

- Al-Ikhlas, Al-Falaq, An-Naas: upstream Abu Dawud 4241 replaced with 5082, checked at https://sunnah.com/abudawud:5082; Qur'an references added.
- Ayat Kursi: use QS. Al-Baqarah 2:255 for the text. Upstream Tirmidhi 2879 was not retained because the stated reference did not establish the morning/evening claim. On 2026-10-10, checked https://sunnah.com/hisn:75 (morning/evening chapter) and added an Indonesian paraphrase of its protection-from-jinn virtue: morning until evening, and evening until morning. That page cites al-Hakim 1/562 and reports al-Albani's authentic grading in Sahih at-Targhib wa at-Tarhib 1/273. These volume/page references and grading are attributed to Hisn al-Muslim, not independently verified against the original editions. The linked page is Hisn al-Muslim no. 75, not hadith no. 75 in al-Hakim.
- Health/protection supplication: three repetitions, checked against https://sunnah.com/abudawud:5090 (upstream had one).
- Virtues shown only for Ayat Kursi, the three final surahs, Sayyid al-Istighfar, Tasbih dan Tahmid Harian, and Dzikir Tauhid. Sayyid al-Istighfar was checked against https://sunnah.com/bukhari:6306. Other upstream commentary is intentionally omitted pending review.
- Tasbih dan Tahmid Harian: on 2026-10-10, checked https://sunnah.com/muslim:2692 and https://sunnah.com/bukhari:6405. Added Indonesian paraphrases to both entries, distinguishing 100 repetitions morning/evening (the virtue on Judgment Day, including the equal-or-greater-repetition exception) from 100 in a day (forgiveness even if sins are like sea foam). Replaced the bundled reference with separate linked sources for each virtue. No additional claim about forgiveness of major sins or exemption from repentance is intended.
- Dzikir Tauhid: checked https://www.hadits.id/hadits/bukhari/3293 on 2026-10-10. Added an Indonesian paraphrase to both entries, explicitly conditioned on 100 repetitions in a day: the equivalent reward of freeing ten slaves, one hundred good deeds, removal of one hundred bad deeds, and protection from Satan that day until evening, preserving the exception for someone doing more. This does not establish these rewards for the 1/10-count alternatives or extend protection from evening until morning. Existing bundled references and user-edited repetition notes are retained; the new link identifies al-Bukhari 3293, and other bundled references were not rechecked in this change.
- Complex repetition instructions remain verbatim notes instead of being reduced to a misleading single count.

Daily hadith excerpts are sourced verbatim from https://hadeethenc.com/id/browse/hadith/5845 and https://hadeethenc.com/id/browse/hadith/10411. Each excerpt is under 25 words and has a visible link.

## Curated starter collections (2026-10-10)

The import provenance above applies to the original morning/evening dataset, **not** the following 12 new editorial entries. Source pages below were actually fetched and their Arabic, meaning, and occasion inspected on 2026-10-10. This is source checking, not a completed scholarly review or independent authentication of every cited narration.

### Exact source map

Each filename is its slug plus `.json` under `src/lib/content/entries/`.

| Entry ID                                | Slug                                    | Fetched source and selected text                                                                                                       |
| --------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `dua-bangun-tidur`                      | `doa-bangun-tidur`                      | https://sunnah.com/bukhari:6324 — waking formula, from al-ḥamdu lillāh through an-nushūr; also compared with https://sunnah.com/hisn:1 |
| `dua-sebelum-masuk-toilet`              | `doa-masuk-toilet`              | https://sunnah.com/hisn:10 — Allāhumma innī a‘ūdhu…; optional bracketed basmalah omitted                                               |
| `dua-setelah-keluar-toilet`             | `doa-keluar-toilet`             | https://sunnah.com/hisn:11 — Ghufrānaka                                                                                                |
| `dua-keluar-rumah`                      | `doa-keluar-rumah`                      | https://sunnah.com/hisn:16 — Bismillāhi, tawakkaltu…                                                                                   |
| `dua-sebelum-tidur`                     | `doa-sebelum-tidur`                     | https://sunnah.com/bukhari:6324 — Bismika Allāhumma amūtu wa aḥyā, retaining this narration's word order                               |
| `prayer-doa-iftitah`                    | `shalat-doa-iftitah`                    | https://sunnah.com/hisn:27 — all three Allāhumma clauses                                                                               |
| `prayer-tasbih-rukuk`                   | `shalat-tasbih-rukuk`                   | https://sunnah.com/hisn:33 — Subḥāna rabbiyal-‘aẓīm; three repetitions stated on page                                                  |
| `prayer-bangkit-dari-rukuk`             | `shalat-bangkit-rukuk`             | https://sunnah.com/hisn:38 — Sami‘allāhu liman ḥamidah                                                                                 |
| `prayer-pujian-iktidal`                 | `shalat-pujian-iktidal`                 | https://sunnah.com/hisn:39 — Rabbanā wa lakal-ḥamd through mubārakan fīh                                                               |
| `prayer-tasbih-sujud`                   | `shalat-tasbih-sujud`                   | https://sunnah.com/hisn:41 — Subḥāna rabbiyal-a‘lā; three repetitions stated on page                                                   |
| `prayer-doa-antara-dua-sujud`           | `shalat-doa-antara-sujud`           | https://sunnah.com/hisn:48 — both occurrences of Rabbi’ghfir lī                                                                        |
| `prayer-doa-memohon-pertolongan-ibadah` | `shalat-doa-pertolongan` | https://sunnah.com/hisn:59 — Allāhumma a‘innī…; source chapter places it after final tashahhud, before salam                           |

### Text and translation provenance

- Arabic was transcribed from the selected formulas on those pages, removing decorative tatweel, normalizing spacing/punctuation and ordinary spelling/diacritics (including Allah), and excluding surrounding narration/instructions. This is not a byte-for-byte diplomatic transcription. No formulas from separate variants were combined.
- Transliteration is an editorial rendering of that Arabic, checked against the source's Latin text where supplied. It uses Indonesian-friendly `sy`, `ż`, `ṡ`, `kh`, `gh`, long vowels `ā/ī/ū`, `‘` for ‘ayn and `’` for hamzah; phrase endings may use pause pronunciation. Al-Bukhari 6324 supplies a simpler Latin rendering within its English narration. Transliteration is a reading aid, not a replacement for Arabic instruction or tajwid.
- Indonesian meanings are newly composed editorial translations/paraphrases informed by the Arabic and the English meanings on the exact linked pages, **not** quotations from Kemenag, an Indonesian Hisn edition, or a named translator. They are labeled as editorial in each entry. No claim of certified translation is made.
- The toilet-entry translation selects the male/female evil-jinn interpretation explicitly offered by Hisn 10; the alternative evil/evil-ones meaning is noted. Its bracketed basmalah has a separate reference and is not silently merged into the selected formula.
- Hisn URLs are categorized as `book`, with numbers identifying the compilation's entries, not hadith numbers in the underlying collections. Volume/page references and attributed gradings on those pages have not been independently verified against original editions. The two al-Bukhari entries link directly to hadith 6324.
- All new `virtues` arrays are empty. No reward, protection guarantee, forgiveness guarantee, or unsourced repetition count is added. Rukuk and sujud use the compilation's explicit three-count instruction, not a claim that three is a validity condition. Hisn 48's repeated phrase remains in the text without a second multiplier.

### Collection boundaries and variations

`daily-duas` has `readingMode: single` and `kind: dua`: it only supports individual, occasion-specific supplications, not a prescribed daily sequence. Its category route always opens the full catalog and ignores `mode=sequence` and `start`, including `/read/daily-duas/?mode=sequence&start=doa-bangun-tidur` and prerendered HTML with JavaScript disabled. Catalog entries link to `/read/daily-duas/{slug}/` standalone readings. `prayer`, `morning`, and `evening` retain `readingMode: sequence`, opening at the introduction. `prayer` has `kind: prayer_recitation`; its UI sequence is a browsing order, not an executable prayer guide. Morning and evening remain `kind: dhikr`, with their existing membership unchanged.

The header's **Pilih bacaan** icon next to Back opens `/read/{category}/?mode=single` for choosing an individual reading and carries `aria-current="page"` in catalog mode. The former main **Mode membaca** navigation and **Baca berurutan** link are removed. For sequence-category catalogs, Back is **Kembali ke bacaan**, returning to `/read/{category}/` at the default introduction. Daily-duas catalog Back has the accessible name **Kembali ke beranda** and links to `/`, not back to itself; its **Pilih bacaan** header link still points to `/read/daily-duas/?mode=single`. Sequence Back is also **Kembali ke beranda**, linking to `/`. Existing standalone reading behavior is unchanged: **Kembali ke daftar bacaan** and **Pilih bacaan** both open its category catalog.

Review the once-only header note (**Petunjuk pilih bacaan**, `role="note"`) alongside these navigation cues: “Ingin langsung ke bacaan tertentu? Tekan tombol daftar ini untuk memilih bacaan.” **Mengerti**, Escape, or clicking the list icon dismisses it. It records `dawam-reading-list-hint-seen` as `'true'` in localStorage on first display, so it is not repeated on reload or in another category, even without acknowledgement. Storage failures must not block dismissal or reading navigation, and the bubble must not overflow at 320px. This guidance explains choosing a reading; it does not imply a religiously prescribed order.

The prayer collection now contains **13 recitations, not a complete fiqh guide**. Opening takbir, Al-Fatihah, tashahhud, salawat, the fourfold refuge before salam, and salam have been added. The browsing sequence does not model rak‘ahs or repeat the second prostration and does not prescribe an additional surah after Al-Fatihah. Do not imply that reading these cards once completes a prayer. Alternative opening formulas, bowing/prostration supplications, and iktidal wordings exist. Imam/follower/individual rules for tasmi‘ are not adjudicated here. Placement of the Hisn 59 supplication before versus after salam is an editorial review point; the entry follows the compilation's chapter placement and acknowledges differing explanations rather than issuing a ruling.

### Re-import policy

`scripts/import-content.mjs` now loads existing categories and entries before importing morning/evening source rows. Existing entry IDs are not rewritten; existing slugs and exclusive file creation guard against overwriting another entry. Existing categories (including curated collections, text, extra fields, order, and membership) remain authoritative; missing morning/evening categories are created, and absent metadata on legacy morning/evening categories receives defaults. No entry files are deleted. Curated content is checked-in JSON, not regenerated from the upstream dataset. Updating an existing imported text or collection membership therefore requires an explicit editorial edit; this script is no longer an overwrite-based refresh. The importer was deliberately **not executed** for this task.

The TypeScript `Category` interface includes `kind` and `readingMode`. Content validation checks both fields and ensures that each collection contains entries of its declared kind.

### Remaining review for these additions

A qualified Arabic/Indonesian religious editor must check every normalized Arabic character and vowel, transliteration/pronunciation, translation nuance (especially sleep/death/resurrection and al-khubth/al-khabā’ith), occasion, and repetition instruction. Confirm underlying hadith references/gradings and the disputed placement of Hisn 59 against authoritative editions and the intended teaching tradition. Review omissions and variation warnings with the UI so users cannot mistake the collection for complete shalat instruction. Confirm rights/attribution for source-site text and any adapted translations separately; the existing Fitrahive MIT notice does not automatically license these new source materials. No scholarly sign-off or rights audit is claimed.

## Verified prayer alternatives (2026-10-10)

The following actual Sunnah.com Hisn al-Muslim pages were fetched and inspected before adding the variants. Existing entry base fields, including titles, texts, sources, repetition counts, and notes, are unchanged. Only `defaultVersionLabel` and `variants` were added to the three prayer JSON files.

| File under `src/lib/content/entries/` | Default version label                         | Variant ID            | Variant label                                    | Exact fetched reference    |
| ------------------------------------- | --------------------------------------------- | --------------------- | ------------------------------------------------ | -------------------------- |
| `shalat-doa-iftitah.json`             | Allahumma Ba‘id — Memohon dijauhkan dari dosa | `subhanaka-allahumma` | Subhanaka Allahumma — Pujian pembuka             | https://sunnah.com/hisn:28 |
| `shalat-tasbih-rukuk.json`            | Subhana Rabbiyal ‘Azhim — Tasbih rukuk        | `subhanaka-rabbana`   | Subhanaka Allahumma Rabbana — Pujian dan ampunan | https://sunnah.com/hisn:34 |
| `shalat-tasbih-sujud.json`            | Subhana Rabbiyal A‘la — Tasbih sujud          | `subhanaka-rabbana`   | Subhanaka Allahumma Rabbana — Pujian dan ampunan | https://sunnah.com/hisn:42 |

- Hisn 28 places the complete formula from Subḥānaka Allāhumma through wa lā ilāha ghayruk after the opening takbir. Its reference names Abu Dawud, Ibn Majah, an-Nasa'i, and at-Tirmidhi, and points to al-Albani's Sahih at-Tirmidhi 1/77 and Sahih Ibn Majah 1/135. These are the compilation's attributions, not independent verification of those editions or gradings.
- Hisn 34 places Subḥānaka Allāhumma rabbanā wa biḥamdika, Allāhummaghfir lī in rukuk and cites al-Bukhari 1/99 and Muslim 1/350. Hisn 42 supplies the same formula for sujud and explicitly refers back to no. 34 for al-Bukhari and Muslim. The underlying volume/page citations were not independently checked. Source type `book` and source labels identify Hisn entry numbers, not underlying hadith numbers.
- Arabic preserves each source formula separately, with decorative tatweel removed and ordinary spelling, diacritics, spacing, and punctuation normalized. No alternative formulas are concatenated. Transliteration is editorial and follows the conventions above. Indonesian translations are newly composed editorial renderings informed by the Arabic and English meanings on these exact pages, not quotations from an Indonesian publisher or certified translations. Each variant carries its own provenance note.
- These are selectable alternatives, not an obligatory combined sequence or a ruling about replacing required prayer recitations. None of these three pages specifies a repetition count for its formula, so all three variants omit `repetitions`; in particular, they do not inherit the base rukuk/sujud count of three. No obligatory count is asserted. All variant `virtues` are explicitly empty: asking forgiveness is the prayer's text, not a newly asserted guarantee of forgiveness.
- Each variant has its own `sources`, `virtues`, and `notes`. Variant IDs are unique within their entry and never `default`; the shared rukuk/sujud ID is intentionally scoped to its entry. `repetitions` and `notes` are independently optional and must not fall back to the base entry when absent. Picker/model implementation is outside this content-only change; types, importer, and tests were not edited, and the importer was not run.
- This is source-page verification, not scholarly sign-off. The Arabic/Indonesian religious review and rights/attribution review described above still apply to these alternatives.

## Expanded prayer collection (2026-10-10)

Six new entries and four additional alternatives were transcribed only after fetching these source pages:

| Entry / alternative                   | Source checked                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| Opening takbir                        | https://sunnah.com/muslim:498                                                      |
| Al-Fatihah, seven verses              | https://quran.com/1?translations=20; prayer context https://sunnah.com/bukhari:756 |
| Tashahhud, Ibn Mas‘ud                 | https://sunnah.com/muslim:402a and https://sunnah.com/hisn:52                      |
| Tashahhud alternative, Ibn ‘Abbas     | https://sunnah.com/muslim:403a                                                     |
| Salawat Ibrahimiyah                   | https://sunnah.com/hisn:53                                                         |
| Refuge from four matters before salam | https://sunnah.com/hisn:55                                                         |
| Salam                                 | https://sunnah.com/abudawud:996                                                    |
| Iftitah, Wajjahtu wajhiya             | https://sunnah.com/hisn:29                                                         |
| Iftitah, Allahu akbar kabira          | https://sunnah.com/muslim:601                                                      |
| Between prostrations, seven requests  | https://sunnah.com/hisn:49                                                         |

Arabic formulas from separate narrations are not concatenated: in particular, Muslim 601's short opening and Hisn 29's complete Wajjahtu formula remain separate alternatives. Hisn 31 was also checked and is not the formula used for the Muslim 601 alternative. Al-Fatihah follows the source's seven-verse numbering including basmalah; amin is not included as a verse. Hisn 49 is cited as the compilation's seven-request formula, not as identical wording in every underlying narration.

Transliteration and Indonesian meanings are editorial renderings, not certified translations or quotations attributed to an Indonesian publisher. New entries and variants have empty virtues and no added repetition counts. Hisn's printed references and Abu Dawud's displayed grading are attributed to their pages, not independently authenticated. All existing text/translation review and rights-review caveats still apply. Category `items` is the authoritative browsing order; this is not a rak‘ah-by-rak‘ah prayer procedure or a resolution of differences between schools.

## Still required before declaring the religious dataset production-reviewed

A qualified editorial/religious reviewer must review all Arabic, diacritics, transliteration, Indonesian translations, remaining references, and collection membership. In particular, review the evening inclusion of Juwairiyah's morning tasbih and upstream time-specific notes attached to shared entries. MIT covers the supplied repository, but upstream does not identify every original translation publisher; confirm underlying translation redistribution rights with the maintainer. This implementation does not claim that a complete scholarly review or publisher-rights audit has occurred.

## Bedtime dhikr

The separate `bedtime` menu contains nine entries: Ayat Kursi (al-Bukhari 2311), Al-Ikhlas, Al-Falaq, and An-Nas as separate shared entries forming a routine repeated three times (5017), tasbih 33/tahmid 33/takbir 34 (5361), the bedtime supplication (6324), and conditional night-awakening dhikr (1154). The night-awakening formula includes Allahummaghfir li and has no assigned repetition count. Its instruction identifies the condition and the alternative of making supplication. The three-surah count applies to the complete recitation/wiping routine, not nine independent cycles. Quran text, transliteration, and meanings are reused from existing entries; their morning/evening virtues are not carried into bedtime entries. The new awakening transliteration and Indonesian translation are editorial renderings of the cited Arabic. Menu order is not asserted to be prescribed. Each entry links its specific source at `https://sunnah.com/bukhari:<number>`. This is a selection, not an exhaustive collection of bedtime recitations.

## Post-prayer dhikr

The prayer category retains its 13 in-prayer recitations. A separate post-prayer collection contains seven post-salam entries and appears as its own menu under the Bacaan Shalat homepage group. Verified against Sahih Muslim 591 (istighfar three times, then Allahumma antas-salam), 593a (al-Mughirah formula), and 597a (33 tasbih, 33 tahmid, 33 takbir, then one tahlil). Sources: https://sunnah.com/muslim:591, https://sunnah.com/muslim:593a, https://sunnah.com/muslim:597a. Arabic follows the cited formulas; Indonesian translations and transliterations are editorial. This is a sourced selection, not an exhaustive collection or a claim that all entries form one mandatory fixed sequence. Post-salam entries are explicitly distinguished from in-prayer recitations.

Bedtime recitations now reference existing entry IDs, including the separate three surahs. Entry variants supply context-specific titles, counts, instructions, references, and virtues; categories select them by variantId without changing shared Arabic, transliteration, or translation. Both reading routes use the same resolver. Category grouping is independent of entry type so the existing bedtime dua and tasbih entries can be shared. The duplicate bedtime text files have been removed.

## Uniform entry schema

All entries now use schema version 1; see CONTENT-SCHEMA.md. The old base wording is preserved in text and its metadata in the default variant. Existing alternative wordings are explicit variants. The former bedtime overrides are bedtime variants owned by each entry. IDs and URL slugs are retained for compatibility; filenames use descriptive type prefixes. The migration was checked against tracked pre-migration content for unchanged text, translations, counts, instructions, sources, and virtues in every context.

## Meal supplications

The daily-duas menu is titled Do'a Sehari-hari and contained seven entries after the meal additions. The before-meal entry displays Bismillah with the command to mention Allah's name in al-Bukhari 5376 (https://sunnah.com/bukhari:5376). The after-meal formula follows at-Tirmidhi 3458 (https://sunnah.com/tirmidhi:3458), graded hasan on the cited page; the grade is stated in its source label. Neither entry prescribes a repetition count. Transliteration and Indonesian meanings are editorial renderings. Both entries follow schema version 1 and use the default variant.

## Mosque and post-adhan supplications

Three entries were added to daily-duas (ten entries total): entering and leaving the mosque follow Muslim 713a (https://sunnah.com/muslim:713a), and the post-adhan formula follows al-Bukhari 614 (https://sunnah.com/bukhari:614). Its instruction to precede the supplication with salawat is supported separately by Muslim 384 (https://sunnah.com/muslim:384). No extra wording or fixed repetition count is added. Transliteration and Indonesian meanings are editorial renderings.

## Four dua menus and travel readings

The dua group now contains daily-duas (7), worship-duas (3), situational-duas (3), and travel-duas (9). Mosque and adhan entries moved to worship-duas; their previous standalone daily-duas URLs redirect permanently. Categories only select entry IDs and variants.

Travel selection follows https://rumaysho.com/20918-doa-dan-bacaan-penting-saat-safar-traveling.html with independently checked primary reports: Abu Dawud 2600 (farewell), at-Tirmidhi 3444 (provision; hasan), Ibn Majah 2825 (entrusting a loved one), Abu Dawud 2602 (mounting), Muslim 1342 (safar), and al-Bukhari 2993 (ascent/descent). Ibn Majah 2825 narrates the Prophet seeing someone off, so the instruction is intentionally phrased as parting with a loved one, without restricting the direction of the farewell. Mounting follows Abu Dawud 2602: Bismillah once, initial praise once, then the later praise and takbir three times each; the whole formula is not assigned a threefold repetition. Arabic repeats are written out. Transliteration and Indonesian translations are editorial renderings, not copied article translations.

Leaving-home reuses its existing entry. Ascent/descent reuse takbir/tasbih with contextual variants, no invented fixed count and no inherited post-prayer metadata. The singgah variant reuses doa_perlindungan_makhluk with Muslim 2708a and its specific protection virtue; its existing evening variant remains unchanged. New circumstance readings follow Muslim 2730a (distress) and 918a (calamity). The extra singgah reading supplements the article's selection. The menus are independent selections for their respective occasions, not a compulsory sequence.

## Daily dua virtue audit

Reviewed the ten daily-duas entries against their specific narrated wording. Added virtues for the after-meal formula (at-Tirmidhi 3458: forgiveness of past sins; hasan), the post-adhan formula (al-Bukhari 614: intercession on the Day of Resurrection), leaving home (Abu Dawud 5095: guidance, sufficiency, protection and devils withdrawing; sahih grading attributed to al-Albani), and mentioning Allah before food (Muslim 2017a: preventing Satan from sharing food, based on the report that food without Allah's name is made lawful to Satan). Each virtue references a source ID owned by its variant. No separate reward claim was added for waking, sleeping, entering/leaving the toilet or entering/leaving the mosque: the checked wording reports the supplication or its occasion, without the particular reward claims used elsewhere. The merits of other sleep formulas or of walking to a mosque are not attributed to these specific supplications. Source URLs are stored in the entries.
