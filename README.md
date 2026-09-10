# EbookLosslessDownloader

[English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md)

**EbookLosslessDownloader** is a userscript for downloading accessible ebook pages from supported platforms while preserving source quality whenever possible, with format conversion, OCR, and export to ZIP, CBZ, PDF, or EPUB.

- 中文：电子书无损下载器
- 日本語：電子書籍ロスレスダウンローダー
- Repository: https://github.com/Li3Zi3han2/EbookLosslessDownloader

> [!IMPORTANT]
> **Legal and access disclaimer.** Use this script only with content you are authorized to access, and only in accordance with applicable law, copyright rules, contractual obligations, and the terms of the platform you use. EbookLosslessDownloader does not grant access to content that is unavailable to the active reader session and is not intended to bypass DRM, authentication, paywalls, or other access controls. You are solely responsible for how you use the software and for any downloaded or exported material. No representation is made that a particular use is lawful in every jurisdiction, and this documentation is not legal advice.
>
> **Project independence.** EbookLosslessDownloader is an independent open-source project and is not affiliated with, endorsed by, or sponsored by any ebook platform or rights holder. Product names and trademarks belong to their respective owners.
>
> **AI assistance notice.** The code in this project has been developed with assistance from **OpenAI's ChatGPT**. The project author remains responsible for reviewing, testing, maintaining, and releasing it.

## What “lossless” means here

“Lossless” refers to avoiding unnecessary additional degradation relative to the page data supplied by the platform. It does **not** mean that every source page is an originally lossless master image.

For eligible JPG pages, EbookLosslessDownloader can rearrange quantized JPG DCT coefficients directly and re-encode the entropy stream without dequantizing and requantizing the image. This avoids another lossy JPG generation. The source JPG itself may already contain compression loss from the publisher or platform.

For PNG, lossless WEBP, and lossless JXL output, the encoded result preserves the decoded pixel data used by the conversion path. Converting an already-lossy JPG to a lossless format does not restore information that was absent from the JPG source.

## Platform support

| Platform | Trial / preview content | Purchased content |
| --- | :---: | :---: |
| BOOK☆WALKER JP | ✅ | ✅ |
| GOOGLE PLAY BOOKS | 🚧 | 🚧 |

**✅ Supported** · **🚧 Planned**

## Features

- [x] Preserve original page data whenever possible instead of performing unnecessary decode/re-encode cycles.
- [x] JPG coefficient-domain restoration for eligible pages, avoiding additional JPG quantization loss when NFBR block reordering can be performed directly in the DCT domain.
- [x] Image output: **JPG, JXL, PNG, WEBP**.
- [x] Package output: **ZIP**.
- [x] ⚠️ **Experimental / unverified:** package output to **CBZ, PDF, EPUB**. PDF uses JPG page images, supports volume splitting, and can embed OCR text as a text layer.
- [x] ⚠️ **Experimental / unverified:** automatic conversion of detected text pages to **4-color PNG**.
- [x] ⚠️ **Experimental / unverified:** OCR using **Japanese + English** recognition.
- [x] Streaming ZIP / CBZ / EPUB writing to reduce archive-building memory usage.
- [x] OPFS temporary storage when available, with IndexedDB / memory fallback and automatic cleanup of stale OPFS data left by abnormal exits.
- [x] Image codecs and JPG coefficient processing in Web Workers.
- [x] Small OCR worker pool so recognition can overlap with page processing.
- [x] Material Design 3 interface.
- [x] Interface languages: **中文 / English / 日本語**, with the selected language remembered locally.
- [x] Hidden developer mode for diagnostics and preservation/timing metadata.

## Installation and usage

1. Install a userscript manager such as Tampermonkey or Violentmonkey.
2. Install `EbookLosslessDownloader.user.js` from the Raw userscript URL below. Installing from this URL allows the userscript manager to record the installation source and use the update URL configured in the script:

   ```text
   https://raw.githubusercontent.com/Li3Zi3han2/EbookLosslessDownloader/main/EbookLosslessDownloader.user.js
   ```

3. Open a supported trial / preview or purchased ebook in its web reader. The EbookLosslessDownloader panel appears automatically.
4. To change the interface language, use the translation-style button immediately to the left of the minimize button and choose **中文**, **English**, or **日本語**. The selection is stored locally.
5. Wait until the panel shows the total page count and **就绪 / Ready / 準備完了**.
6. Choose the page range, output size, image format, and quality settings.
7. Optionally enable 4-color text-page conversion, OCR, or volume splitting.
8. Choose ZIP, CBZ, PDF, or EPUB, then start the download.
9. To enable developer mode, rapidly click the version number five times. Developer mode adds diagnostic output, detailed timing information, and `manifest.json` preservation metadata to supported archive outputs. Click the version number once while developer mode is enabled to disable it.

## Output formats

### Images

| Format | Notes |
| --- | --- |
| JPG | Small files; DCT-domain preservation is used when eligible. |
| JXL | Modern high-efficiency lossy or lossless image output. |
| PNG | Lossless output. ⚠️ **Experimental / unverified:** optional 4-color optimization for detected text pages. |
| WEBP | Lossy or lossless image output. |

### Packages

| Format | Notes |
| --- | --- |
| ZIP | Image archive; images are stored without redundant ZIP recompression. |
| CBZ | ⚠️ **Experimental / unverified.** Comic-book ZIP with `ComicInfo.xml`. |
| PDF | ⚠️ **Experimental / unverified.** Page images are forced to JPG; optional OCR text is embedded as a text layer. |
| EPUB | ⚠️ **Experimental / unverified.** Fixed-layout image-based EPUB package. |

All package formats support optional volume splitting.

## Storage and networking

Page data is processed locally in the browser. The script prefers the browser's Origin Private File System (OPFS) for temporary page/archive storage and falls back to IndexedDB or memory when OPFS is unavailable. Temporary session data is removed after normal completion; stale session/archive entries left by an abnormal exit are cleaned automatically on later runs.

The script also contacts:

- the active supported ebook platform for page data available to the current viewer session;
- pinned CDN resources required for runtime codecs/libraries;
- OCR language/runtime resources when OCR is enabled.

Runtime libraries are pinned to specific versions and verified against expected SHA-256 hashes where implemented by the loader.

## Runtime components

The current script uses or adapts the following open-source components:

| Component | Version | License |
| --- | ---: | --- |
| jsPDF | 2.5.1 | MIT |
| Tesseract.js | 6.0.1 | Apache-2.0 |
| pako | 2.1.0 | MIT / Zlib |
| @jsquash/webp | 1.5.0 | Apache-2.0 |
| @jsquash/jxl | 1.2.0 | Apache-2.0 |
| @cross/image | 0.4.3 | MIT |

`@cross/image` JPG code is adapted/bundled for coefficient-domain JPG processing. Third-party components retain their own licenses and copyright notices. See `THIRD_PARTY_NOTICES.md`.

## Compatibility

The script is intended for current desktop releases of Chromium- and Firefox-based browsers with a userscript manager that supports `unsafeWindow` and `GM_xmlhttpRequest`.

## Reporting issues

Please report reproducible problems at:

https://github.com/Li3Zi3han2/EbookLosslessDownloader/issues

Useful reports should include:

- browser and version;
- userscript manager and version;
- platform and whether the book is trial / preview or purchased;
- EbookLosslessDownloader version;
- selected image/package settings;
- developer-mode diagnostics when appropriate.

Do not post account credentials, cookies, signed private URLs, or other sensitive session data.

## License

EbookLosslessDownloader is released under the **GNU General Public License v3.0 or later (GPL-3.0-or-later)**. See `LICENSE`.

Modified versions that are distributed must remain available under the applicable GPL terms. Third-party components retain their own licenses and notices; see `THIRD_PARTY_NOTICES.md`.
