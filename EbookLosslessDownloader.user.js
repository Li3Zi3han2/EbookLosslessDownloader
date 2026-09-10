// ==UserScript==
// @name         EbookLosslessDownloader
// @name:zh-CN   电子书无损下载器
// @name:ja      電子書籍ロスレスダウンローダー
// @namespace    https://github.com/Li3Zi3han2/EbookLosslessDownloader
// @version      0.5.0
// @description  Download accessible ebook pages from supported platforms while preserving source quality whenever possible, with format conversion, OCR, and export to ZIP, CBZ, PDF, or EPUB.
// @description:zh-CN 从受支持的平台下载可访问的电子书页面，同时尽可能保留源画质，并支持格式转换、OCR，以及导出为 ZIP、CBZ、PDF 或 EPUB。
// @description:ja 対応プラットフォームからアクセス可能な電子書籍ページをダウンロードし、可能な限り元の画質を維持しながら、形式変換、OCR、ZIP / CBZ / PDF / EPUB への出力に対応します。
// @author       Li3Zi3han2
// @homepageURL  https://github.com/Li3Zi3han2/EbookLosslessDownloader
// @source       https://raw.githubusercontent.com/Li3Zi3han2/EbookLosslessDownloader/main/EbookLosslessDownloader.user.js
// @updateURL    https://raw.githubusercontent.com/Li3Zi3han2/EbookLosslessDownloader/main/EbookLosslessDownloader.user.js
// @downloadURL  https://raw.githubusercontent.com/Li3Zi3han2/EbookLosslessDownloader/main/EbookLosslessDownloader.user.js
// @supportURL   https://github.com/Li3Zi3han2/EbookLosslessDownloader/issues
// @match        https://viewer.bookwalker.jp/*
// @match        https://viewer-trial.bookwalker.jp/*
// @match        https://viewer-epubs.bookwalker.jp/*
// @match        https://viewer-epubs-trial.bookwalker.jp/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      unpkg.com
// @connect      cdnjs.cloudflare.com
// @connect      cdn.jsdelivr.net
// @connect      *.bookwalker.jp
// @connect      viewer.bookwalker.jp
// @connect      viewer-trial.bookwalker.jp
// @connect      viewer-epubs.bookwalker.jp
// @connect      viewer-epubs-trial.bookwalker.jp
// @connect      bw-bv-epubs.bookwalker.jp
// @run-at       document-start
// @license      GPL-3.0-or-later
// ==/UserScript==
// SPDX-License-Identifier: GPL-3.0-or-later
/* global exportFunction */
"use strict";
(() => {
  const __ELD_VERSION__ = "0.5.0";
  const __ELD_PRODUCT_NAME__ = "EbookLosslessDownloader";
  const __ELD_LANGUAGE_KEY__ = "eld.language";
  const __ELD_LANGUAGES__ = ["zh-CN", "en", "ja"];
  const __ELD_I18N__ = {
    "zh-CN": {
      productName: "EbookLosslessDownloader",
      language: "语言",
      chooseLanguage: "选择界面语言",
      chinese: "中文",
      english: "English",
      japanese: "日本語",
      minimize: "最小化",
      close: "关闭",
      version: "版本 {version}",
      versionCloseDeveloper: "版本 {version}，关闭开发者模式",
      developerMode: "开发者模式",
      pageRange: "页面范围",
      waitingReader: "等待阅读器…",
      totalPages: "共{count}页",
      startPage: "起始页",
      endPage: "结束页",
      outputSize: "输出尺寸",
      detecting: "检测中",
      width: "宽",
      height: "高",
      matchOriginalSize: "匹配原图尺寸",
      keepAspectRatio: "保持宽高比",
      imageFormat: "图片格式",
      jpgQuality: "JPG 质量",
      jxlQuality: "JXL 质量",
      webpQuality: "WEBP 质量",
      pngCompression: "PNG 压缩等级",
      compressionLevel: "压缩等级",
      dctLossless: "DCT 无损",
      lossless: "无损",
      textPage4ColorPng: "文本页自动转 4 色 PNG",
      imageToText: "图片转文本",
      packageFormat: "打包格式",
      splitVolumes: "分卷",
      pagesPerVolume: "每卷页数",
      ready: "就绪",
      downloadProgress: "下载进度",
      startDownload: "开始下载",
      stopInitializing: "停止初始化",
      stopAndPackage: "停止并打包已完成页面",
      stopping: "正在停止…",
      packaging: "正在打包…",
      readingPageInfo: "正在读取页面信息…",
      preparingDownload: "正在准备下载…",
      preparingComponents: "正在准备下载组件…",
      preparingPage: "准备第 {page} 页（{current}/{total}）…",
      processingPage: "处理第 {page} 页（{current}/{total}）…",
      ocrQueued: "第 {page} 页：OCR 已加入后台队列…",
      finishCurrentVolume: "正在完成当前压缩卷；打包阶段无法安全中断。",
      stoppingThenPackage: "正在停止；随后打包已完成的 {count} 页。",
      finishingOcr: "正在完成 OCR…",
      pagesDoneFinishingOcr: "页面处理完成；正在完成 OCR…",
      stoppedPackaging: "已停止采集；正在打包已完成的 {count} 页…",
      generatingEbook: "正在生成电子书文件…",
      completed: "完成",
      stoppedPackaged: "已停止并打包",
      splitIntoVolumes: "；分为 {count} 卷",
      failures: "；失败页：{pages}",
      preservation: "；DCT 无损复原 {lossless} 页；原图直通 {passthrough} 页；像素转码 {fallback} 页",
      timing: "；计时：{summary}",
      completeSummary: "{state}：{count} 页{volumes}{failures}{preservation}{timing}",
      sourceImageUnavailable: "第 {page} 页：页面原始图片不可用。",
      mappingUnknown: "第 {page} 页：尚未确定是否需要 NFBR 重排，拒绝输出未经确认的图片。",
      mappingMissing: "第 {page} 页：已确认需要重排，但缺少 NFBR 映射。",
      mappingInvalid: "第 {page} 页：NFBR 映射不完整或非法：{detail}",
      reorderCanvasFailed: "无法创建 NFBR 像素重排画布。",
      cropCanvasFailed: "无法创建页面裁剪画布。",
      catalogInitFailed: "页面目录初始化失败{diagnostic}。",
      rangeInvalid: "页码范围无效，或页面目录尚未加载完成。",
      deterministicSourceFailed: "第 {page} 页：未能建立确定性页面源。",
      pageFailed: "第 {page} 页失败{retry}：{detail}",
      pageFailureRecord: "第 {page} 页：{detail}",
      stoppedNoPages: "已停止，且还没有成功处理任何页面可供打包。",
      noSuccessfulPages: "没有成功处理任何页面。{detail}",
      timingPrepare: "准备",
      timingDctParse: "DCT解析",
      timingReorder: "块重排",
      timingJpgEntropy: "JPG熵编码",
      timingPixelEncode: "像素编码",
      timingStore: "存储",
      timingPdf: "PDF预览",
      timingPackage: "打包",
      timingTotal: "总计"
    },
    en: {
      productName: "EbookLosslessDownloader",
      language: "Language",
      chooseLanguage: "Choose interface language",
      chinese: "中文",
      english: "English",
      japanese: "日本語",
      minimize: "Minimize",
      close: "Close",
      version: "Version {version}",
      versionCloseDeveloper: "Version {version}, disable developer mode",
      developerMode: "Developer mode",
      pageRange: "Page range",
      waitingReader: "Waiting for reader…",
      totalPages: "{count} pages",
      startPage: "Start page",
      endPage: "End page",
      outputSize: "Output size",
      detecting: "Detecting",
      width: "Width",
      height: "Height",
      matchOriginalSize: "Match original size",
      keepAspectRatio: "Keep aspect ratio",
      imageFormat: "Image format",
      jpgQuality: "JPG quality",
      jxlQuality: "JXL quality",
      webpQuality: "WEBP quality",
      pngCompression: "PNG compression level",
      compressionLevel: "Compression level",
      dctLossless: "DCT lossless",
      lossless: "Lossless",
      textPage4ColorPng: "Auto-convert text pages to 4-color PNG",
      imageToText: "Image to text",
      packageFormat: "Package format",
      splitVolumes: "Split volumes",
      pagesPerVolume: "Pages per volume",
      ready: "Ready",
      downloadProgress: "Download progress",
      startDownload: "Start download",
      stopInitializing: "Stop initialization",
      stopAndPackage: "Stop and package completed pages",
      stopping: "Stopping…",
      packaging: "Packaging…",
      readingPageInfo: "Reading page information…",
      preparingDownload: "Preparing download…",
      preparingComponents: "Preparing download components…",
      preparingPage: "Preparing page {page} ({current}/{total})…",
      processingPage: "Processing page {page} ({current}/{total})…",
      ocrQueued: "Page {page}: OCR queued…",
      finishCurrentVolume: "Finishing the current archive; packaging cannot be safely interrupted.",
      stoppingThenPackage: "Stopping; {count} completed pages will be packaged.",
      finishingOcr: "Finishing OCR…",
      pagesDoneFinishingOcr: "Page processing complete; finishing OCR…",
      stoppedPackaging: "Capture stopped; packaging {count} completed pages…",
      generatingEbook: "Generating ebook file…",
      completed: "Complete",
      stoppedPackaged: "Stopped and packaged",
      splitIntoVolumes: "; {count} volumes",
      failures: "; failed pages: {pages}",
      preservation: "; DCT lossless {lossless}; passthrough {passthrough}; pixel re-encode {fallback}",
      timing: "; timing: {summary}",
      completeSummary: "{state}: {count} pages{volumes}{failures}{preservation}{timing}",
      sourceImageUnavailable: "Page {page}: source image is unavailable.",
      mappingUnknown: "Page {page}: whether NFBR reordering is required is still unknown; refusing to output an unverified image.",
      mappingMissing: "Page {page}: reordering is required, but the NFBR map is missing.",
      mappingInvalid: "Page {page}: the NFBR map is incomplete or invalid: {detail}",
      reorderCanvasFailed: "Unable to create the NFBR pixel-reordering canvas.",
      cropCanvasFailed: "Unable to create the page-cropping canvas.",
      catalogInitFailed: "Failed to initialize the page catalog{diagnostic}.",
      rangeInvalid: "The page range is invalid, or the page catalog is not ready.",
      deterministicSourceFailed: "Page {page}: unable to establish a deterministic page source.",
      pageFailed: "Page {page} failed{retry}: {detail}",
      pageFailureRecord: "Page {page}: {detail}",
      stoppedNoPages: "Stopped before any page was processed successfully; there is nothing to package.",
      noSuccessfulPages: "No page was processed successfully.{detail}",
      timingPrepare: "prepare",
      timingDctParse: "DCT parse",
      timingReorder: "block reorder",
      timingJpgEntropy: "JPG entropy encode",
      timingPixelEncode: "pixel encode",
      timingStore: "store",
      timingPdf: "PDF preview",
      timingPackage: "package",
      timingTotal: "total"
    },
    ja: {
      productName: "EbookLosslessDownloader",
      language: "言語",
      chooseLanguage: "表示言語を選択",
      chinese: "中文",
      english: "English",
      japanese: "日本語",
      minimize: "最小化",
      close: "閉じる",
      version: "バージョン {version}",
      versionCloseDeveloper: "バージョン {version}、開発者モードを無効化",
      developerMode: "開発者モード",
      pageRange: "ページ範囲",
      waitingReader: "リーダーを待機中…",
      totalPages: "全{count}ページ",
      startPage: "開始ページ",
      endPage: "終了ページ",
      outputSize: "出力サイズ",
      detecting: "検出中",
      width: "幅",
      height: "高さ",
      matchOriginalSize: "元画像のサイズに合わせる",
      keepAspectRatio: "縦横比を維持",
      imageFormat: "画像形式",
      jpgQuality: "JPG 品質",
      jxlQuality: "JXL 品質",
      webpQuality: "WEBP 品質",
      pngCompression: "PNG 圧縮レベル",
      compressionLevel: "圧縮レベル",
      dctLossless: "DCT ロスレス",
      lossless: "ロスレス",
      textPage4ColorPng: "テキストページを4色PNGへ自動変換",
      imageToText: "画像をテキスト化",
      packageFormat: "パッケージ形式",
      splitVolumes: "分割",
      pagesPerVolume: "1巻あたりのページ数",
      ready: "準備完了",
      downloadProgress: "ダウンロード進行状況",
      startDownload: "ダウンロード開始",
      stopInitializing: "初期化を停止",
      stopAndPackage: "停止して完了ページをパッケージ化",
      stopping: "停止中…",
      packaging: "パッケージ化中…",
      readingPageInfo: "ページ情報を読み込み中…",
      preparingDownload: "ダウンロードを準備中…",
      preparingComponents: "ダウンロードコンポーネントを準備中…",
      preparingPage: "{page}ページ目を準備中（{current}/{total}）…",
      processingPage: "{page}ページ目を処理中（{current}/{total}）…",
      ocrQueued: "{page}ページ目：OCRをキューに追加しました…",
      finishCurrentVolume: "現在のアーカイブを完了中です。パッケージ化中は安全に中断できません。",
      stoppingThenPackage: "停止中です。完了済みの{count}ページをパッケージ化します。",
      finishingOcr: "OCRを完了中…",
      pagesDoneFinishingOcr: "ページ処理完了。OCRを完了中…",
      stoppedPackaging: "取得を停止しました。完了済みの{count}ページをパッケージ化中…",
      generatingEbook: "電子書籍ファイルを生成中…",
      completed: "完了",
      stoppedPackaged: "停止してパッケージ化完了",
      splitIntoVolumes: "；{count}巻に分割",
      failures: "；失敗ページ：{pages}",
      preservation: "；DCTロスレス復元 {lossless}ページ；元画像をそのまま使用 {passthrough}ページ；ピクセル再エンコード {fallback}ページ",
      timing: "；計測：{summary}",
      completeSummary: "{state}：{count}ページ{volumes}{failures}{preservation}{timing}",
      sourceImageUnavailable: "{page}ページ目：元画像を取得できません。",
      mappingUnknown: "{page}ページ目：NFBR再配置の要否が未確定のため、未確認の画像は出力しません。",
      mappingMissing: "{page}ページ目：再配置が必要ですが、NFBRマップがありません。",
      mappingInvalid: "{page}ページ目：NFBRマップが不完全または不正です：{detail}",
      reorderCanvasFailed: "NFBRピクセル再配置用キャンバスを作成できません。",
      cropCanvasFailed: "ページ切り抜き用キャンバスを作成できません。",
      catalogInitFailed: "ページカタログの初期化に失敗しました{diagnostic}。",
      rangeInvalid: "ページ範囲が無効か、ページカタログの読み込みが完了していません。",
      deterministicSourceFailed: "{page}ページ目：確定的なページソースを構築できません。",
      pageFailed: "{page}ページ目に失敗しました{retry}：{detail}",
      pageFailureRecord: "{page}ページ目：{detail}",
      stoppedNoPages: "正常に処理されたページがないため、パッケージ化せず停止しました。",
      noSuccessfulPages: "正常に処理できたページがありません。{detail}",
      timingPrepare: "準備",
      timingDctParse: "DCT解析",
      timingReorder: "ブロック再配置",
      timingJpgEntropy: "JPGエントロピー符号化",
      timingPixelEncode: "ピクセル符号化",
      timingStore: "保存",
      timingPdf: "PDFプレビュー",
      timingPackage: "パッケージ化",
      timingTotal: "合計"
    }
  };
  function __eldNormalizeLanguage(value) {
    if (value === "zh" || value?.toLowerCase?.().startsWith("zh")) {return "zh-CN";}
    if (value === "ja" || value?.toLowerCase?.().startsWith("ja")) {return "ja";}
    return "en";
  }
  function __eldReadLanguage() {
    try {
      const stored = localStorage.getItem(__ELD_LANGUAGE_KEY__);
      if (__ELD_LANGUAGES__.includes(stored)) {return stored;}
    } catch { /* Intentionally ignored. */ }
    return __eldNormalizeLanguage(navigator.language || "en");
  }
  let __eldLanguage = __eldReadLanguage();
  function __eldT(key, values = {}) {
    const table = __ELD_I18N__[__eldLanguage] ?? __ELD_I18N__.en;
    const fallback = __ELD_I18N__.en[key];
    let text = table[key] ?? fallback ?? key;
    for (const [name, value] of Object.entries(values)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  }
  function __eldPersistLanguage(language) {
    __eldLanguage = __ELD_LANGUAGES__.includes(language) ? language : "en";
    try { localStorage.setItem(__ELD_LANGUAGE_KEY__, __eldLanguage); } catch { /* Intentionally ignored. */ }
  }
  const __ELD_GLOBAL__ = window.globalThis || window;
  const __ELD_DEVELOPER_UNLOCKED_KEY__ = "eld.developer.unlocked";
  const __ELD_DEVELOPER_ENABLED_KEY__ = "eld.developer.enabled";
  function __eldReadStoredFlag(key) {
    try { return localStorage.getItem(key) === "1"; } catch { return false; }
  }
  function __eldWriteStoredFlag(key, enabled) {
    try { localStorage.setItem(key, enabled ? "1" : "0"); } catch { /* Intentionally ignored. */ }
  }
  function __eldDeveloperUnlocked() {
    return __eldReadStoredFlag(__ELD_DEVELOPER_UNLOCKED_KEY__);
  }
  function __eldDeveloperEnabled() {
    return __eldDeveloperUnlocked() && __eldReadStoredFlag(__ELD_DEVELOPER_ENABLED_KEY__);
  }
  function __eldSetDeveloperUnlocked(enabled) {
    __eldWriteStoredFlag(__ELD_DEVELOPER_UNLOCKED_KEY__, enabled);
    if (!enabled) { __eldWriteStoredFlag(__ELD_DEVELOPER_ENABLED_KEY__, false); }
  }
  function __eldSetDeveloperEnabled(enabled) {
    if (enabled) { __eldSetDeveloperUnlocked(true); }
    __eldWriteStoredFlag(__ELD_DEVELOPER_ENABLED_KEY__, enabled);
  }
  function __eldDevInfo(...args) { if (__eldDeveloperEnabled()) { console.info(...args); } }
  function __eldDevDebug(...args) { if (__eldDeveloperEnabled()) { console.debug(...args); } }
  function __eldDevWarn(...args) { if (__eldDeveloperEnabled()) { console.warn(...args); } }
  // Lightweight viewer_image bridge.
  //
  // Important Firefox detail: forcing @inject-into page makes some userscript
  // managers insert a moz-extension://.../main.js <script>. BOOK☆WALKER's CSP can
  // reject that script before our code runs at all. 0.5.0 therefore stays in the
  // normal userscript sandbox and reaches the page realm through unsafeWindow.
  // When Firefox exposes exportFunction, the Z1P wrapper is explicitly exported
  // into the page realm; direct assignment is retained as a Chromium fallback.
  const __ELD_CORE_STATE__ = {
    capture: null,
    status: {
      scriptStarted: true,
      nfbrFound: false,
      wrapped: false,
      strategy: null,
      checkedAt: Date.now()
    },
    lastOriginal: null,
    lastWrapped: null,
    timer: 0
  };

  (() => {
    const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    const frameLabel = (() => {
      try { return window.top === window ? "top" : "child"; } catch { return "unknown"; }
    })();
      __eldDevInfo(`[EbookLosslessDownloader 0.5.0] userscript started (${frameLabel})`, location.href);

    const publishStatus = (patch) => {
      Object.assign(__ELD_CORE_STATE__.status, patch, { checkedAt: Date.now() });
      // This page-world mirror contains primitives only. It is intentionally not the
      // authoritative storage for renderer/page references.
      try {
        pageWindow.__ELD_CORE_BRIDGE_STATUS__ = Object.assign({}, __ELD_CORE_STATE__.status);
      } catch { /* Intentionally ignored. */ }
    };

    const publishCore = (renderer, page, originalZ1P, width, height) => {
      const core = {
        renderer,
        page,
        originalZ1P,
        width,
        height,
        capturedAt: Date.now(),
        frameWindow: pageWindow
      };
      __ELD_CORE_STATE__.capture = core;
      publishStatus({ nfbrFound: true, wrapped: true, captured: true });
      __eldDevInfo("[EbookLosslessDownloader 0.5.0] captured viewer core", {
        pageIndex: page?.index,
        k9j: page?.k9j,
        width,
        height
      });

      // Best-effort page-world mirror for same-origin frame discovery. The local
      // sandbox state above remains authoritative, so failure here is harmless.
      try {
        const holder = new pageWindow.Object();
        holder.renderer = renderer;
        holder.page = page;
        holder.originalZ1P = originalZ1P;
        holder.width = width;
        holder.height = height;
        holder.capturedAt = core.capturedAt;
        pageWindow.__ELD_VIEWER_CORE__ = holder;
      } catch { /* Intentionally ignored. */ }
      try {
        pageWindow.top.postMessage({ __eldCoreReady: true, capturedAt: core.capturedAt }, "*");
      } catch { /* Intentionally ignored. */ }
    };

    const makeExportedWrapper = (original) => {
      function sandboxWrapper(page, width, height) {
        const rectangles = Reflect.apply(original, this, [page, width, height]);
        publishCore(this, page, original, width, height);
        return rectangles;
      }

      if (typeof exportFunction === "function") {
        try {
          return {
            fn: exportFunction(sandboxWrapper, pageWindow),
            strategy: "exportFunction"
          };
        } catch (error) {
          __eldDevDebug("[EbookLosslessDownloader 0.5.0] exportFunction failed; trying direct assignment", error);
        }
      }
      return { fn: sandboxWrapper, strategy: "direct" };
    };

    const install = () => {
      let prototype;
      try { prototype = pageWindow.NFBR?.a6G?.a5x?.prototype; } catch { /* Intentionally ignored. */ }
      if (!prototype || typeof prototype.Z1P !== "function") {
        publishStatus({ nfbrFound: false, wrapped: false });
        return false;
      }
      publishStatus({ nfbrFound: true });

      let current;
      try { current = prototype.Z1P; } catch { return false; }
      if (__ELD_CORE_STATE__.lastWrapped && current === __ELD_CORE_STATE__.lastWrapped) {
        publishStatus({ wrapped: true });
        return true;
      }

      // viewer_image may replace Z1P while booting. Always wrap the function that is
      // currently installed rather than relying on marker properties across realms.
      const original = current;
      const { fn: wrapped, strategy } = makeExportedWrapper(original);
      try {
        prototype.Z1P = wrapped;
      } catch (error) {
        publishStatus({ wrapped: false, strategy: `${strategy}:assign-failed` });
        __eldDevDebug("[EbookLosslessDownloader 0.5.0] Z1P assignment failed", error);
        return false;
      }

      let installed = false;
      try { installed = prototype.Z1P === wrapped; } catch { /* Intentionally ignored. */ }
      if (installed) {
        __ELD_CORE_STATE__.lastOriginal = original;
        __ELD_CORE_STATE__.lastWrapped = wrapped;
      }
      publishStatus({ wrapped: installed, strategy });
      if (installed) {
        __eldDevInfo(`[EbookLosslessDownloader 0.5.0] Z1P bridge installed via ${strategy}`);
      }
      return installed;
    };

    // Cheap property polling only. It stops after a capture or after 30 seconds;
    // an on-demand reinstall function remains available afterwards.
    install();
    const started = Date.now();
    __ELD_CORE_STATE__.timer = setInterval(() => {
      if (__ELD_CORE_STATE__.capture || Date.now() - started > 30000) {
        clearInterval(__ELD_CORE_STATE__.timer);
        __ELD_CORE_STATE__.timer = 0;
        return;
      }
      install();
    }, 50);

    // Local callback used by the downloader. A primitive-only page mirror is also
    // provided for diagnostics from the normal DevTools console.
    __ELD_CORE_STATE__.reinstall = install;
    try { pageWindow.__ELD_REINSTALL_CORE_CAPTURE__ = typeof exportFunction === "function" ? exportFunction(install, pageWindow) : install; } catch { /* Intentionally ignored. */ }
  })();

  // Child frames only install the lightweight Z1P bridge above. Catalog discovery,
  // codecs, UI, storage and download state exist exclusively in the top frame.
  try {
    if (window.top !== window) {return;}
  } catch {
    return;
  }

  // Optional third-party libraries are deliberately NOT declared with @require.
  // Userscript managers resolve @require before executing the script body, which can
  // delay a nominal document-start script until after viewer_image's first Z1P call;
  // a failed @require can also prevent or partially initialize the userscript.  The
  // lightweight BOOK☆WALKER bridge above must therefore run first.  Libraries are
  // loaded only after the deterministic page catalog is ready and only when needed.
  const __ELD_DEPENDENCY_PROMISES__ = new Map();
  function __eldGlobalPath(path) {
    let value = __ELD_GLOBAL__;
    for (const key of path.split('.')) {value = value?.[key];}
    return value;
  }
  function __eldSetGlobalPath(path, value) {
    const parts = path.split('.');
    let target = __ELD_GLOBAL__;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (!target[key] || (typeof target[key] !== "object" && typeof target[key] !== "function")) {target[key] = {};}
      target = target[key];
    }
    target[parts.at(-1)] = value;
  }
  async function __eldSha256Hex(source) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  async function __eldVerifySource(source, expectedSha256, url) {
    const actual = await __eldSha256Hex(source);
    if (actual !== expectedSha256) {
      throw new Error(`integrity mismatch for ${url}; expected ${expectedSha256}, received ${actual}`);
    }
    return source;
  }
  function __eldRequestText(url, timeoutMs = 15000, signal) {
    __eldThrowIfAborted(signal);
    if (typeof GM_xmlhttpRequest !== "function") {
      return fetch(url, { signal }).then((response) => {
        if (!response.ok) {throw new Error(`HTTP ${response.status} loading ${url}`);}
        return response.text();
      });
    }
    return new Promise((resolve, reject) => {
      let settled = false;
      let request;
      let timer;
      const cleanup = () => {
        if (timer) {clearTimeout(timer);}
        signal?.removeEventListener("abort", abort);
      };
      const finish = (callback, value) => {
        if (settled) {return;}
        settled = true;
        cleanup();
        callback(value);
      };
      const abort = () => {
        try { request?.abort?.(); } catch { /* Intentionally ignored. */ }
        finish(reject, signal?.reason ?? __eldAbortError());
      };
      signal?.addEventListener("abort", abort, { once: true });
      if (signal?.aborted) {
        abort();
        return;
      }
      timer = setTimeout(() => {
        try { request?.abort?.(); } catch { /* Intentionally ignored. */ }
        finish(reject, new Error(`timeout loading ${url}`));
      }, timeoutMs);
      request = GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: timeoutMs,
        onload(response) {
          if (response.status < 200 || response.status >= 300) {
            finish(reject, new Error(`HTTP ${response.status} loading ${url}`));
            return;
          }
          finish(resolve, response.responseText);
        },
        onerror() { finish(reject, new Error(`failed to load ${url}`)); },
        ontimeout() { finish(reject, new Error(`timeout loading ${url}`)); },
        onabort() {
          if (!settled) {finish(reject, signal?.reason ?? __eldAbortError());}
        }
      });
    });
  }
  async function __eldLoadScriptUrl(url, expectedSha256, timeoutMs = 15000, signal) {
    const execute = (source) => {
      // Run UMD bundles in a tiny CommonJS-compatible wrapper. Indirect eval() is
      // unreliable in Firefox userscript sandboxes: a bundle may execute successfully
      // yet export to a realm/global object different from this script's globalThis.
      // Supplying module/exports makes UMD dependencies return their export
      // explicitly, while window/self still point at the userscript sandbox.
      const module = { exports: {} };
      // Some CommonJS-flavoured UMD bundles expect setImmediate. Firefox does not expose
      // that Node-style global, so provide a browser-safe scheduler explicitly.
      const immediate = typeof __ELD_GLOBAL__.setImmediate === "function"
        ? __ELD_GLOBAL__.setImmediate.bind(__ELD_GLOBAL__)
        : (callback, ...args) => setTimeout(callback, 0, ...args);
      const clearImmediateCompat = typeof __ELD_GLOBAL__.clearImmediate === "function"
        ? __ELD_GLOBAL__.clearImmediate.bind(__ELD_GLOBAL__)
        : (handle) => clearTimeout(handle);
      const runner = new Function(
        "module", "exports", "define", "require", "window", "self", "globalThis",
        "setImmediate", "clearImmediate",
        `${source}\n//# sourceURL=${url}\n;return module.exports;`
      );
      return runner.call(
        __ELD_GLOBAL__, module, module.exports, void 0, void 0,
        __ELD_GLOBAL__, __ELD_GLOBAL__, __ELD_GLOBAL__, immediate, clearImmediateCompat
      );
    };
    const source = await __eldRequestText(url, timeoutMs, signal);
    return execute(await __eldVerifySource(source, expectedSha256, url));
  }
  async function __eldFetchVerifiedText(url, expectedSha256, timeoutMs = 15000, signal) {
    const source = await __eldRequestText(url, timeoutMs, signal);
    return __eldVerifySource(source, expectedSha256, url);
  }
  async function __eldEnsureDependency(name, globalPath, sources, signal) {
    if (__eldGlobalPath(globalPath) !== void 0) {return;}
    if (__ELD_DEPENDENCY_PROMISES__.has(name)) {return __ELD_DEPENDENCY_PROMISES__.get(name);}
    const promise = (async () => {
      const failures = [];
      for (const { url, sha256 } of sources) {
        try {
          const exported = await __eldLoadScriptUrl(url, sha256, 15000, signal);
          if (__eldGlobalPath(globalPath) !== void 0) {return;}
          // Most browser UMD bundles expose a useful CommonJS export when module/exports
          // are supplied. Adopt it explicitly instead of assuming it attached itself to
          // the userscript global object.
          if (exported !== void 0 && exported !== null) {
            if (globalPath === "jspdf.jsPDF" && exported.jsPDF) {
              __ELD_GLOBAL__.jspdf = exported;
            } else {
              const candidate = exported.default ?? exported;
              if (candidate && (typeof candidate === "object" || typeof candidate === "function")) {
                __eldSetGlobalPath(globalPath, candidate);
              }
            }
          }
          if (__eldGlobalPath(globalPath) !== void 0) {return;}
          failures.push(`${url}: loaded but ${globalPath} was not exported`);
        } catch (error) {
          if (isAbort(error)) {throw error;}
          failures.push(`${url}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      throw new Error(`${name} 加载失败。${failures.join(' | ')}`);
    })();
    __ELD_DEPENDENCY_PROMISES__.set(name, promise);
    try {
      await promise;
    } catch (error) {
      __ELD_DEPENDENCY_PROMISES__.delete(name);
      throw error;
    }
  }
  async function __eldEnsureRuntimeDependencies(settings, signal) {
    // PageStore prefers native OPFS and falls back to IndexedDB/memory. ZIP/CBZ/EPUB
    // packaging is handled by the built-in streaming writer, so no archive library is needed.
    if (settings.packFormat === 'pdf') {
      // 2.5.2 is not reliably available on cdnjs; use the established 2.5.1 UMD build.
      await __eldEnsureDependency('jsPDF', 'jspdf.jsPDF', [
        { url: 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js', sha256: '98ccf17aa10c20bb1301762618fcc9b6ab3a4e7f26b6071d64d0b41154df3875' },
        { url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', sha256: '98ccf17aa10c20bb1301762618fcc9b6ab3a4e7f26b6071d64d0b41154df3875' },
        { url: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js', sha256: '98ccf17aa10c20bb1301762618fcc9b6ab3a4e7f26b6071d64d0b41154df3875' }
      ], signal);
    }
    if (settings.imageToText) {
      await __eldEnsureDependency('Tesseract', 'Tesseract', [
        { url: 'https://unpkg.com/tesseract.js@6.0.1/dist/tesseract.min.js', sha256: '10fff78484067759c43028a02a72d76d0b90eb17302bb23b58a9ec5410bc928b' },
        { url: 'https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js', sha256: '10fff78484067759c43028a02a72d76d0b90eb17302bb23b58a9ec5410bc928b' }
      ], signal);
    }
  }

  function __eldAbortError() {
    return new DOMException("Download stopped.", "AbortError");
  }
  function __eldThrowIfAborted(signal) {
    if (signal?.aborted) {throw signal.reason ?? __eldAbortError();}
  }
  function __eldGmArrayBuffer(url, timeoutMs = 2e4, signal) {
    if (typeof GM_xmlhttpRequest !== "function") {
      return Promise.reject(new Error("GM_xmlhttpRequest is unavailable"));
    }
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(signal.reason ?? __eldAbortError());
        return;
      }
      let settled = false;
      let request;
      const cleanup = () => signal?.removeEventListener("abort", abort);
      const finishError = (message) => {
        if (settled) {return;}
        settled = true;
        cleanup();
        reject(new Error(message));
      };
      const abort = () => {
        if (settled) {return;}
        settled = true;
        try { request?.abort(); } catch { /* Intentionally ignored. */ }
        cleanup();
        reject(signal?.reason ?? __eldAbortError());
      };
      signal?.addEventListener("abort", abort, { once: true });
      request = GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "arraybuffer",
        timeout: timeoutMs,
        onload(response) {
          if (settled) {return;}
          const status = Number(response.status) || 0;
          if (status < 200 || status >= 300) {
            finishError(`HTTP ${status || "?"}`);
            return;
          }
          const body = response.response;
          try {
            if (body instanceof ArrayBuffer || Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
              settled = true;
              cleanup();
              resolve(new Uint8Array(body));
              return;
            }
            if (ArrayBuffer.isView(body)) {
              settled = true;
              cleanup();
              resolve(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
              return;
            }
          } catch { /* Intentionally ignored. */ }
          finishError("response was not an ArrayBuffer");
        },
        onerror(response) {
          finishError(`network error${response?.status ? ` (HTTP ${response.status})` : ""}`);
        },
        ontimeout() { finishError("request timeout"); },
        onabort() { finishError("request aborted"); }
      });
    });
  }

  class BoundedRequestGate {
    constructor(maximumConcurrent = 2, minimumSpacingMs = 120) {
      this.maximumConcurrent = maximumConcurrent;
      this.minimumSpacingMs = minimumSpacingMs;
      this.active = 0;
      this.lastStartedAt = 0;
      this.queue = [];
    }
    run(task, signal) {
      __eldThrowIfAborted(signal);
      return new Promise((resolve, reject) => {
        const item = { task, signal, resolve, reject, abort: null };
        item.abort = () => {
          const index = this.queue.indexOf(item);
          if (index >= 0) {this.queue.splice(index, 1);}
          reject(signal?.reason ?? __eldAbortError());
        };
        signal?.addEventListener("abort", item.abort, { once: true });
        this.queue.push(item);
        this.drain();
      });
    }
    drain() {
      while (this.active < this.maximumConcurrent && this.queue.length > 0) {
        const elapsed = performance.now() - this.lastStartedAt;
        if (elapsed < this.minimumSpacingMs) {
          setTimeout(() => this.drain(), this.minimumSpacingMs - elapsed);
          return;
        }
        const item = this.queue.shift();
        item.signal?.removeEventListener("abort", item.abort);
        if (item.signal?.aborted) {
          item.reject(item.signal.reason ?? __eldAbortError());
          continue;
        }
        this.active++;
        this.lastStartedAt = performance.now();
        Promise.resolve().then(() => item.task()).then(item.resolve, item.reject).finally(() => {
          this.active--;
          this.drain();
        });
      }
    }
  }

   // src/userscript/bookwalker/network-observer.ts
  var IMAGE_LIMIT = 64;
  var JPG_MIME = "image/" + "jp" + "eg";
  var JPG_SOURCE_EXTENSION = "jp" + "eg";
  var PDF_JPG_FORMAT = "JP" + "EG";
  var JPG_SIGNATURE = [255, 216, 255];
  function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  function isJpg(bytes) {
    return JPG_SIGNATURE.every((value, index) => bytes[index] === value);
  }
  function parseJpgSize(bytes) {
    if (!isJpg(bytes)) {return void 0;}
    let offset2 = 2;
    while (offset2 + 8 < bytes.length) {
      if (bytes[offset2] !== 255) {
        offset2++;
        continue;
      }
      const marker = bytes[offset2 + 1] ?? 0;
      offset2 += 2;
      if (marker === 216 || marker === 217 || marker === 1 || marker >= 208 && marker <= 215) {
        continue;
      }
      const length = (bytes[offset2] ?? 0) << 8 | (bytes[offset2 + 1] ?? 0);
      if (length < 2 || offset2 + length > bytes.length) {return void 0;}
      if (marker >= 192 && marker <= 207 && ![196, 200, 204].includes(marker)) {
        const height = (bytes[offset2 + 3] ?? 0) << 8 | (bytes[offset2 + 4] ?? 0);
        const width = (bytes[offset2 + 5] ?? 0) << 8 | (bytes[offset2 + 6] ?? 0);
        return width > 0 && height > 0 ? { width, height } : void 0;
      }
      offset2 += length;
    }
    return void 0;
  }
  function parsePngSize(bytes) {
    if (bytes.length < 24) {return void 0;}
    const signature = [137, 80, 78, 71, 13, 10, 26, 10];
    if (!signature.every((value, index) => bytes[index] === value)) {return void 0;}
    const chunkType = String.fromCharCode(bytes[12] ?? 0, bytes[13] ?? 0, bytes[14] ?? 0, bytes[15] ?? 0);
    if (chunkType !== "IHDR") {return void 0;}
    const width = ((bytes[16] ?? 0) << 24 | (bytes[17] ?? 0) << 16 | (bytes[18] ?? 0) << 8 | (bytes[19] ?? 0)) >>> 0;
    const height = ((bytes[20] ?? 0) << 24 | (bytes[21] ?? 0) << 16 | (bytes[22] ?? 0) << 8 | (bytes[23] ?? 0)) >>> 0;
    return width > 0 && height > 0 ? { width, height } : void 0;
  }
  function parseWebpSize(bytes) {
    if (bytes.length < 30) {return void 0;}
    const riff = String.fromCharCode(bytes[0] ?? 0, bytes[1] ?? 0, bytes[2] ?? 0, bytes[3] ?? 0);
    const webp = String.fromCharCode(bytes[8] ?? 0, bytes[9] ?? 0, bytes[10] ?? 0, bytes[11] ?? 0);
    if (riff !== "RIFF" || webp !== "WEBP") {return void 0;}
    const kind = String.fromCharCode(bytes[12] ?? 0, bytes[13] ?? 0, bytes[14] ?? 0, bytes[15] ?? 0);
    if (kind === "VP8 ") {
      if (bytes.length < 30) {return void 0;}
      if ((bytes[23] ?? 0) !== 157 || (bytes[24] ?? 0) !== 1 || (bytes[25] ?? 0) !== 42) {return void 0;}
      const width = ((bytes[27] ?? 0) << 8 | (bytes[26] ?? 0)) & 16383;
      const height = ((bytes[29] ?? 0) << 8 | (bytes[28] ?? 0)) & 16383;
      return width > 0 && height > 0 ? { width, height } : void 0;
    }
    if (kind === "VP8L") {
      if (bytes.length < 25 || (bytes[20] ?? 0) !== 47) {return void 0;}
      const b0 = bytes[21] ?? 0;
      const b1 = bytes[22] ?? 0;
      const b2 = bytes[23] ?? 0;
      const b3 = bytes[24] ?? 0;
      const width = 1 + (((b1 & 63) << 8) | b0);
      const height = 1 + (((b3 & 15) << 10) | (b2 << 2) | ((b1 & 192) >> 6));
      return width > 0 && height > 0 ? { width, height } : void 0;
    }
    if (kind === "VP8X") {
      if (bytes.length < 30) {return void 0;}
      const width = 1 + ((bytes[24] ?? 0) | ((bytes[25] ?? 0) << 8) | ((bytes[26] ?? 0) << 16));
      const height = 1 + ((bytes[27] ?? 0) | ((bytes[28] ?? 0) << 8) | ((bytes[29] ?? 0) << 16));
      return width > 0 && height > 0 ? { width, height } : void 0;
    }
    return void 0;
  }
  function parseImageSize(bytes) {
    return parseJpgSize(bytes) ?? parsePngSize(bytes) ?? parseWebpSize(bytes);
  }
  function mimeTypeFromUrl(url) {
    const normalized = String(url || "").toLowerCase();
    if (/\.png(?:[?#]|$)/u.test(normalized)) {return "image/png";}
    if (/\.webp(?:[?#]|$)/u.test(normalized)) {return "image/webp";}
    return JPG_MIME;
  }
  function directValue(object, names) {
    const entries = Object.entries(object);
    for (const name of names) {
      const found = entries.find(([key]) => key.toLowerCase() === name.toLowerCase());
      if (found) {return found[1];}
    }
    return void 0;
  }
  function directNumber(object, names) {
    const value = directValue(object, names);
    const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
    return Number.isSafeInteger(number) && number >= 0 ? number : void 0;
  }
  function directString(object, names) {
    const value = directValue(object, names);
    return typeof value === "string" && value.trim() ? value.trim() : void 0;
  }
   function resolveUrl(url, sourceUrl) {
    try {
      return new URL(url, sourceUrl || location.href).href;
    } catch {
      return url;
    }
  }
  function resourceIdentity(url) {
    try {
      return new URL(url, location.href).pathname;
    } catch {
      return String(url).split(/[?#]/u)[0];
    }
  }
   function configurationContents(root) {
    if (!isRecord(root)) {return void 0;}
    const configuration = directValue(root, ["configuration"]);
    if (!isRecord(configuration)) {return void 0;}
    const contents = directValue(configuration, ["contents"]);
    return Array.isArray(contents) ? contents : void 0;
  }
  function configurationReorderDescriptor(...records) {
    for (const record of records) {
      if (!isRecord(record)) {continue;}
      const tileWidth = directNumber(record, ["J1r", "j1r", "BlockWidth", "blockWidth", "tileWidth"]);
      const tileHeight = directNumber(record, ["u3L", "u3l", "BlockHeight", "blockHeight", "tileHeight"]);
      const seed = directNumber(record, ["q5w", "seed", "Seed", "ShuffleSeed"]);
      const v1p = directNumber(record, ["V1p", "v1p"]);
      const w6b = directNumber(record, ["w6b", "W6b"]);
      const i8e = directNumber(record, ["i8E", "i8e"]);
      const a6l = directNumber(record, ["A6l", "a6l"]);
      const rectangles = directValue(record, ["rectangles", "Rectangles", "ReorderMap", "reorderMap"]);
      const advanced = [v1p, w6b, i8e, a6l].every((value) => value !== void 0)
        ? { v1p, w6b, i8e, a6l }
        : void 0;
      if (Array.isArray(rectangles) && rectangles.length > 0 || tileWidth && tileHeight && (seed !== void 0 || advanced)) {
        return { tileWidth, tileHeight, seed, advanced, rectangles };
      }
    }
    return void 0;
  }
  class DownloadError extends Error {
    constructor(message, code, retryable = false) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      this.retryable = retryable;
    }
  }
  class AuthenticationError extends DownloadError {
    constructor(message) { super(message, "auth-expired", true); }
  }
  class NetworkDownloadError extends DownloadError {
    constructor(message) { super(message, "network", true); }
  }
  class MappingMissingError extends DownloadError {
    constructor(message) { super(message, "mapping-missing", false); }
  }
  class InvalidMappingError extends DownloadError {
    constructor(message) { super(message, "invalid-map", false); }
  }
  class CodecError extends DownloadError {
    constructor(message) { super(message, "codec", false); }
  }
  var BookWalkerPageSource = class {
    images = /* @__PURE__ */ new Map();
    bookInfo = {
      title: void 0,
      width: void 0,
      height: void 0,
      totalPages: void 0
    };
    pendingImageFetches = /* @__PURE__ */ new Map();
    pageCatalog = [];
    pageCatalogSourceUrl;
    catalogKind;
    authInfo;
    configData;
    trialRuntimeMemory;
    configurationLoadPromise;
    directCatalogReady = false;
    installed = false;
    metadataDimensionsResolved = false;
    events = new EventTarget();
    requestGate = new BoundedRequestGate(2, 120);
    activeSignal;
    on(type, listener) {
      this.events.addEventListener(type, listener);
      return () => this.events.removeEventListener(type, listener);
    }
    emit(type, detail = {}) {
      this.events.dispatchEvent(new CustomEvent(type, { detail }));
    }
    install() {
      if (this.installed) {return;}
      this.installed = true;
      window.addEventListener("message", (event) => {
        if (!event.data?.__eldCoreReady) {return;}
        try {
          const host = event.origin ? new URL(event.origin).hostname : location.hostname;
          if (host && !/(?:^|\.)bookwalker\.jp$/iu.test(host)) {return;}
        } catch {
          return;
        }
        if (!this.isTrialViewer() && this.pageCatalog.length === 0) {
          void this.ensureBookConfiguration().then((ready) => {
            if (ready) {this.emit("catalog-ready", this.snapshotBookInfo());}
          });
        }
      });
      this.configurationLoadPromise = this.loadBookConfiguration();
      void this.configurationLoadPromise;
    }
    catalogEntry(page) {
      return this.pageCatalog[page - 1];
    }
    catalogTotalPages() {
      return this.pageCatalog.length;
    }
    isTrialViewer() {
      return /(?:^|\.)viewer-(?:epubs-)?trial\.bookwalker\.jp$/iu.test(location.hostname);
    }
    purchasedCoreCapture() {
      // 0.3.4 authoritative source: sandbox-local capture. This avoids relying on
      // page-world object assignment, which Firefox Xray wrappers can reject.
      let best = __ELD_CORE_STATE__.capture ?? void 0;
      // Prefer the newest core captured in this document or any same-origin child
      // frame.  The direct frame walk is a fallback for cases where the child could
      // not promote the reference before the top-level downloader started.
      const seen = /* @__PURE__ */ new Set();
      const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
      const queue = [pageWindow];
      while (queue.length) {
        const frame = queue.shift();
        if (!frame || seen.has(frame)) {continue;}
        seen.add(frame);
        try {
          const capture = frame.__ELD_VIEWER_CORE__;
          if (capture && (!best || Number(capture.capturedAt ?? 0) > Number(best.capturedAt ?? 0))) {best = capture;}
          for (let index = 0; index < frame.frames.length; index++) {queue.push(frame.frames[index]);}
        } catch { /* Intentionally ignored. */ }
      }
      return best;
    }
    findPurchasedContext(renderer, root) {
      // P1j/n4q do NOT receive renderer.model.attributes.a2u itself. The debugger
      // showed a separate book context object (url/M3Z/S3g/...) passed to both
      // methods. 0.3.5 incorrectly equated a2u with that context; r8q was found,
      // but a2u.url was undefined, so waitForPurchasedMemory rejected the already
      // valid 181-page catalog forever. Search only the captured renderer/model
      // object graph, once, for the actual content context.
      const seen = new WeakSet();
      const queue = [];
      const enqueue = (value, path, depth = 0) => {
        if (value && (typeof value === "object" || typeof value === "function")) {queue.push({ value, path, depth });}
      };
      enqueue(root, "renderer.model.attributes");
      try { enqueue(renderer?.model, "renderer.model"); } catch { /* Intentionally ignored. */ }
      enqueue(renderer, "renderer");
      const candidates = [];
      while (queue.length) {
        const { value, path, depth } = queue.shift();
        if (!value || (typeof value !== "object" && typeof value !== "function") || seen.has(value)) {continue;}
        seen.add(value);

        if (!Array.isArray(value)) {
          let url;
          try { url = value.url; } catch { /* Intentionally ignored. */ }
          if (typeof url === "string" && /^https:\/\/bw-bv-epubs\.bookwalker\.jp\//iu.test(url)) {
            let score = 1e6;
            try { if (typeof value.M3Z === "boolean") {score += 1e4;} } catch { /* Intentionally ignored. */ }
            try { if (typeof value.S3g === "string" && value.S3g.length >= 16) {score += 1e4;} } catch { /* Intentionally ignored. */ }
            try {
              const keyCount = Object.keys(value).length;
              if (keyCount >= 8 && keyCount <= 40) {score += 1e3;}
            } catch { /* Intentionally ignored. */ }
            candidates.push({ value, path, url, score });
          }
        }

        if (depth >= 6) {continue;}
        let keys = [];
        try { keys = Reflect.ownKeys(value); } catch { /* Intentionally ignored. */ }
        let inspected = 0;
        for (const key of keys) {
          if (++inspected > 600) {break;}
          let child;
          try { child = value[key]; } catch { continue; }
          if (!child || (typeof child !== "object" && typeof child !== "function")) {continue;}
          try { if (typeof Node !== "undefined" && child instanceof Node) {continue;} } catch { /* Intentionally ignored. */ }
          // r8q can contain hundreds of spread/page objects; the actual context is a
          // controller/model object, not an item deep inside that catalog. Avoid
          // walking every page just to locate one context object.
          if (Array.isArray(child) && child.length > 80) {continue;}
          enqueue(child, `${path}.${String(key)}`, depth + 1);
        }
      }
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      if (best && !this._purchasedContextLogged) {
        this._purchasedContextLogged = true;
        __eldDevInfo("[EbookLosslessDownloader 0.5.0] purchased P1j/n4q context found", {
          path: best.path,
          url: best.url,
          candidateCount: candidates.length
        });
      }
      return best?.value;
    }
    discoverPurchasedMemory() {
      const capture = this.purchasedCoreCapture();
      const renderer = capture?.renderer;
      const capturedPage = capture?.page;
      let root;
      try { root = renderer?.model?.attributes; } catch { /* Intentionally ignored. */ }
      if (!renderer || !root || typeof root !== "object") {return void 0;}

      const pageLike = (value) => value && typeof value === "object" && Number.isSafeInteger(Number(value.index)) && (typeof value.k9j === "string" || typeof value.xhtmlfile === "string");
      const collectPages = (spreads) => {
        if (!Array.isArray(spreads) || spreads.length === 0) {return [];}
        const pageMap = /* @__PURE__ */ new Map();
        for (const spread of spreads) {
          if (!spread || typeof spread !== "object") {continue;}
          for (const side of ["left", "right"]) {
            let page;
            try { page = spread[side]; } catch { continue; }
            if (!pageLike(page)) {continue;}
            const index = Number(page.index);
            if (!pageMap.has(index)) {pageMap.set(index, page);}
          }
        }
        return [...pageMap.values()].sort((left, right) => Number(left.index) - Number(right.index));
      };

      // viewer_image 2.0.29 stores the complete purchased-book spread catalog at
      // renderer.model.attributes.a2u.r8q.  This exact path was verified in the
      // Firefox debugger.  Prefer direct property access here: Firefox Xray wrappers
      // can allow normal reads while Object.getOwnPropertyDescriptors() omits or
      // filters page-world properties, which made 0.3.4 capture Z1P successfully but
      // still fail to discover the catalog.
      try {
        const catalogOwner = root.a2u;
        const spreads = catalogOwner?.r8q;
        const pages = collectPages(spreads);
        if (catalogOwner && typeof catalogOwner === "object" && pages.length >= 2) {
          const context = this.findPurchasedContext(renderer, root, pages);
          if (!this._purchasedCatalogLogged) {
            this._purchasedCatalogLogged = true;
            __eldDevInfo("[EbookLosslessDownloader 0.5.0] purchased catalog found by direct path", {
              pages: pages.length,
              contextReady: Boolean(context),
              contextUrl: (() => { try { return context?.url; } catch { return void 0; } })(),
              first: pages[0]?.k9j,
              last: pages.at(-1)?.k9j
            });
          }
          return {
            score: Number.POSITIVE_INFINITY,
            renderer,
            originalZ1P: capture.originalZ1P,
            context,
            catalogOwner,
            spreads,
            pages,
            path: "renderer.model.attributes.a2u.r8q"
          };
        }
      } catch (error) {
        __eldDevDebug("[EbookLosslessDownloader 0.5.0] direct purchased catalog path failed", error);
      }

      // Generic fallback for future viewer_image builds where the obfuscated field
      // names change. Do not require the context and spread array to be the same
      // object; score the parent object that owns the candidate array.
      const seen = /* @__PURE__ */ new WeakSet();
      const queue = [{ value: root, depth: 0, path: "renderer.model.attributes" }];
      let best;
      while (queue.length) {
        const item = queue.shift();
        const value = item.value;
        if (!value || typeof value !== "object" || seen.has(value)) {continue;}
        seen.add(value);

        let keys = [];
        try { keys = Reflect.ownKeys(value); } catch { /* Intentionally ignored. */ }
        for (const key of keys) {
          let child;
          try { child = value[key]; } catch { continue; }
          if (Array.isArray(child) && child.length > 0) {
            const pages = collectPages(child);
            if (pages.length >= 2) {
              const containsCaptured = pages.some((page) => page === capturedPage || Number(page.index) === Number(capturedPage?.index) && page.k9j === capturedPage?.k9j);
              let contextUrl;
              try { contextUrl = value.url; } catch { /* Intentionally ignored. */ }
              const contextLooksRight = typeof contextUrl === "string" && contextUrl.includes("bookwalker.jp/");
              const pageMethodsReady = pages.some((page) => typeof page.P1j === "function" && typeof page.n4q === "function");
              const score = pages.length * 100 + (containsCaptured ? 1e6 : 0) + (contextLooksRight ? 1e5 : 0) + (pageMethodsReady ? 1e4 : 0);
              if (!best || score > best.score) {
                best = {
                  score,
                  renderer,
                  originalZ1P: capture.originalZ1P,
                  context: value,
                  spreads: child,
                  pages,
                  path: `${item.path}.${String(key)}`
                };
              }
            }
          }
          if (item.depth >= 5 || !child || typeof child !== "object" || Array.isArray(child)) {continue;}
          try {
            if (typeof Node !== "undefined" && child instanceof Node) {continue;}
          } catch { /* Intentionally ignored. */ }
          queue.push({ value: child, depth: item.depth + 1, path: `${item.path}.${String(key)}` });
        }
      }
      if (best) {
        __eldDevInfo("[EbookLosslessDownloader 0.5.0] purchased catalog found by fallback scan", {
          pages: best.pages.length,
          path: best.path,
          contextUrl: best.context?.url
        });
      }
      return best;
    }
    async waitForPurchasedMemory(timeoutMs = 2e4, signal) {
      const started = performance.now();
      let resizeRequested = false;
      while (performance.now() - started < timeoutMs) {
        __eldThrowIfAborted(signal);
        const memory = this.discoverPurchasedMemory();
        // Catalog readiness and P1j/n4q context readiness are separate. r8q itself
        // is enough to make range/size UI ready; the exact content context can be
        // discovered lazily before the first purchased page is prepared.
        if (memory && memory.pages.length > 0) {return memory;}

        if (!resizeRequested && performance.now() - started >= 1200) {
          resizeRequested = true;
          try { __ELD_CORE_STATE__.reinstall?.(); } catch { /* Intentionally ignored. */ }
          try { window.dispatchEvent(new Event("resize")); } catch { /* Intentionally ignored. */ }
        }
        await delayWithSignal(100, signal);
      }
      return void 0;
    }
    async buildPurchasedMemoryCatalog(signal) {
      const memory = await this.waitForPurchasedMemory(2e4, signal);
      if (!memory) {return false;}
      this.purchasedMemory = memory;
      if (!memory.context) {
        let root;
        try { root = memory.renderer?.model?.attributes; } catch { /* Intentionally ignored. */ }
        memory.context = this.findPurchasedContext(memory.renderer, root, memory.pages);
      }
      const pages = memory.pages.map((pageObject, position) => {
        const info = isRecord(pageObject.info) ? pageObject.info : {};
        const blockWidth = directNumber(info, ["BlockWidth"]);
        const blockHeight = directNumber(info, ["BlockHeight"]);
        const dummyWidth = directNumber(info, ["DummyWidth"]) ?? 0;
        const dummyHeight = directNumber(info, ["DummyHeight"]) ?? 0;
        const width = Number.isSafeInteger(Number(pageObject.width)) ? Number(pageObject.width) : void 0;
        const height = Number.isSafeInteger(Number(pageObject.height)) ? Number(pageObject.height) : void 0;
        return {
          // User-facing range is the physical archive order.  Position 1 is the first
          // page object in r8q (normally p-cover.xhtml), so 1–10 means exactly 10 files.
          pageNumber: position + 1,
          sourceKind: "purchased",
          reorderState: "unknown",
          viewerPageIndex: Number(pageObject.index),
          file: pageObject.k9j ?? pageObject.xhtmlfile ?? `page-${position + 1}`,
          type: "jpg",
          ...width === void 0 ? {} : { width },
          ...height === void 0 ? {} : { height },
          ...blockWidth === void 0 ? {} : { blockWidth },
          ...blockHeight === void 0 ? {} : { blockHeight },
          dummyWidth,
          dummyHeight,
          pageObject,
          purchasedMemory: true,
          directFromConfiguration: true
        };
      });
      if (!pages.length) {return false;}
      this.pageCatalog = pages;
      this.pageCatalogSourceUrl = memory.path;
      this.catalogKind = "purchased";
      this.directCatalogReady = true;
      this.bookInfo.totalPages = pages.length;
      const sized = pages.find((entry) => entry.width && entry.height);
      if (sized) {
        this.bookInfo.width = sized.width;
        this.bookInfo.height = sized.height;
        this.metadataDimensionsResolved = true;
      }
      this.emit("catalog-ready", this.snapshotBookInfo());
      return true;
    }
    pageHasNativeNfbr(pageObject) {
      if (!pageObject || typeof pageObject !== "object") {return false;}
      const tileWidth = Number(pageObject.J1r);
      const tileHeight = Number(pageObject.u3L);
      if (!Number.isSafeInteger(tileWidth) || tileWidth <= 0 || !Number.isSafeInteger(tileHeight) || tileHeight <= 0) {return false;}
      const advanced = [pageObject.V1p, pageObject.w6b, pageObject.i8E, pageObject.A6l].every((value) => Number.isSafeInteger(Number(value)));
      const seeded = Number.isSafeInteger(Number(pageObject.q5w));
      return advanced || seeded;
    }
    normalizedSource(pageNumber, entry, image, reorderState, reorderMap) {
      entry.imageUrl = image.url;
      entry.reorderState = reorderState;
      if (reorderMap?.length) {entry.reorderMap = reorderMap;}
      else {delete entry.reorderMap;}
      return {
        pageNumber,
        sourceKind: entry.sourceKind,
        imageUrl: image.url,
        image,
        catalogEntry: entry,
        reorderState,
        reorderMap: reorderMap ?? null
      };
    }
    async preparePurchasedSource(pageNumber, signal) {
      __eldThrowIfAborted(signal);
      if (!await this.ensureBookConfiguration(signal)) {return void 0;}
      const entry = this.catalogEntry(pageNumber);
      const memory = this.purchasedMemory;
      const pageObject = entry?.pageObject;
      if (!entry?.purchasedMemory || !memory || !pageObject) {return void 0;}
      let context = memory.context;
      if (!context) {
        let root;
        try { root = memory.renderer?.model?.attributes; } catch { /* Intentionally ignored. */ }
        context = this.findPurchasedContext(memory.renderer, root, memory.pages);
        if (context) {memory.context = context;}
      }
      if (!context) {
        throw new Error(`第 ${pageNumber} 页：已找到完整 r8q 页面目录，但尚未定位 P1j/n4q 所需的内容上下文。`);
      }

      if (typeof pageObject.i9q !== "string" || !pageObject.i9q) {
        if (typeof pageObject.P1j !== "function") {throw new Error(`第 ${pageNumber} 页：viewer_image 页面对象没有 P1j。`);}
        pageObject.P1j(context);
      }
      if (typeof pageObject.i9q !== "string" || !pageObject.i9q) {throw new Error(`第 ${pageNumber} 页：P1j 未生成图片路径。`);}

      if (!this.authInfo) {
        const auth = await this.fetchAuthInfo(signal);
        if (!auth) {throw new Error(`第 ${pageNumber} 页：无法取得已购内容授权参数。`);}
        this.authInfo = auth;
        if (typeof auth.cti === "string" && auth.cti) {this.bookInfo.title = auth.cti;}
      }

      const isCover = Number(pageObject.index) === 0 || /(?:^|\/)p-cover\.xhtml(?:\/|$)/iu.test(String(pageObject.i9q));
      const relativeCandidates = [];
      if (isCover && /\.jpe?g$/iu.test(pageObject.i9q)) {
        relativeCandidates.push({ path: `${pageObject.i9q}bvCoverImage`, displayReadyCover: true });
      }
      relativeCandidates.push({ path: pageObject.i9q, displayReadyCover: false });

      let image;
      let usedDisplayReadyCover = false;
      let lastCandidateError;
      const seenPaths = new Set();
      for (const candidateInfo of relativeCandidates) {
        if (seenPaths.has(candidateInfo.path)) {continue;}
        seenPaths.add(candidateInfo.path);
        const candidate = this.resourceUrl(candidateInfo.path, this.authInfo);
        if (!candidate) {continue;}
        try {
          await this.refetchImage(candidate, { signal });
        } catch (error) {
          if (isAbort(error) || error instanceof AuthenticationError) {throw error;}
          lastCandidateError = error;
          __eldDevDebug("[EbookLosslessDownloader 0.5.0] purchased JPG candidate unavailable", unsignedUrl(candidate), error);
          continue;
        }
        const found = this.imageForUrl(candidate);
        if (found) {
          image = found;
          usedDisplayReadyCover = candidateInfo.displayReadyCover;
          break;
        }
      }
      if (!image) {
        throw new NetworkDownloadError(`第 ${pageNumber} 页：无法直接取得 P1j 对应的 JPG。${lastCandidateError ? ` ${lastCandidateError.message}` : ""}`);
      }

      // The bvCoverImage resource is already the final cover image used by the viewer.
      if (isCover && usedDisplayReadyCover) {
        return this.normalizedSource(pageNumber, entry, image, "none", null);
      }

      // n4q lazily supplies NFBR parameters. If it supplies none, do not attempt
      // rearrangement; BlockWidth/BlockHeight alone are not proof of scrambling.
      if (!this.pageHasNativeNfbr(pageObject) && typeof pageObject.n4q === "function") {pageObject.n4q(context);}
      const hasNfbr = this.pageHasNativeNfbr(pageObject);
      if (!hasNfbr) {
        return this.normalizedSource(pageNumber, entry, image, "none", null);
      }

      const originalZ1P = memory.originalZ1P;
      if (typeof originalZ1P !== "function") {throw new Error(`第 ${pageNumber} 页：无法取得 viewer_image 原生 Z1P。`);}
      const rectangles = Reflect.apply(originalZ1P, memory.renderer, [pageObject, image.width, image.height]);
      const map = normalizeViewerRectangles(rectangles, image.width, image.height);
      if (!Array.isArray(map) || map.length === 0) {
        throw new MappingMissingError(`第 ${pageNumber} 页：viewer_image 已提供 NFBR 参数，但 Z1P 未生成可用映射。`);
      }
      const moved = map.filter((rect) => rect.inputX !== rect.outputX || rect.inputY !== rect.outputY);
      if (moved.length === 0) {
        return this.normalizedSource(pageNumber, entry, image, "none", null);
      }
      return this.normalizedSource(pageNumber, entry, image, "required", map);
    }

    async prefetchPurchasedRange(startPage, endPage, concurrency = 2, signal) {
      __eldThrowIfAborted(signal);
      if (!await this.ensureBookConfiguration(signal)) {return;}
      const memory = this.purchasedMemory;
      if (!memory) {return;}
      let context = memory.context;
      if (!context) {
        let root;
        try { root = memory.renderer?.model?.attributes; } catch { /* Intentionally ignored. */ }
        context = this.findPurchasedContext(memory.renderer, root, memory.pages);
        if (context) {memory.context = context;}
      }
      if (!context) {return;}
      if (!this.authInfo) {
        try {
          const auth = await this.fetchAuthInfo(signal);
          if (auth) {this.authInfo = auth;}
        } catch { /* Intentionally ignored. */ }
      }
      if (!this.authInfo) {return;}
      const jobs = [];
      for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
        const entry = this.catalogEntry(pageNumber);
        const pageObject = entry?.pageObject;
        if (!entry?.purchasedMemory || !pageObject) {continue;}
        try {
          if (typeof pageObject.i9q !== "string" || !pageObject.i9q) {
            if (typeof pageObject.P1j !== "function") {continue;}
            pageObject.P1j(context);
          }
          if (typeof pageObject.i9q !== "string" || !pageObject.i9q) {continue;}
          const paths = [];
          const isCover = Number(pageObject.index) === 0 || /(?:^|\/)p-cover\.xhtml(?:\/|$)/iu.test(String(pageObject.i9q));
          if (isCover && /\.jpe?g$/iu.test(pageObject.i9q)) {paths.push(`${pageObject.i9q}bvCoverImage`);}
          paths.push(pageObject.i9q);
          jobs.push([...new Set(paths)].map((path) => this.resourceUrl(path, this.authInfo)).filter(Boolean));
        } catch { /* Intentionally ignored. */ }
      }
      let cursor = 0;
      const worker = async () => {
        while (cursor < jobs.length) {
          __eldThrowIfAborted(signal);
          const index = cursor++;
          const candidates = jobs[index] ?? [];
          for (const candidate of candidates) {
            if (this.imageForUrl(candidate)) {break;}
            try {
              await this.refetchImage(candidate, { signal });
              if (this.imageForUrl(candidate)) {break;}
            } catch (error) {
              if (isAbort(error) || error instanceof AuthenticationError) {throw error;}
              __eldDevDebug("[EbookLosslessDownloader 0.5.0] prefetch candidate unavailable", unsignedUrl(candidate), error);
            }
          }
        }
      };
      await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, jobs.length || 1)) }, () => worker()));
    }
    imageForUrl(url) {
      if (!url) {return void 0;}
      const resolved = resolveUrl(url, location.href);
      return this.images.get(resolved) ?? [...this.images.values()].find((entry) => resourceIdentity(entry.url) === resourceIdentity(resolved));
    }
    async waitForNfbrApi(methods = [], timeoutMs = 15e3) {
      const started = performance.now();
      while (performance.now() - started < timeoutMs) {
        const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : __ELD_GLOBAL__;
        const api = pageWindow.NFBR ?? __ELD_GLOBAL__.NFBR;
        if (api && methods.every((name) => typeof api[name] === "function")) {return api;}
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      return void 0;
    }
    cookieValue(name) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
      return document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`, "u"))?.[1];
    }
    async requestJson(url, signal) {
      try {
        const response = await fetch(url, { credentials: "include", cache: "no-store", signal });
        if (!response.ok) {return void 0;}
        const value = await response.json();
        return isRecord(value) ? value : void 0;
      } catch (error) {
        if (error?.name === "AbortError") {throw error;}
        return void 0;
      }
    }
    async existingAuthInfo(signal) {
      const trial = /(?:^|\.)viewer-(?:epubs-)?trial\.bookwalker\.jp$/iu.test(location.hostname);
      const wanted = trial ? /\/trial-page\/c(?:\?|$)/iu : /\/browserWebApi\/c(?:\?|$)/iu;
      const urls = performance.getEntriesByType("resource").map((entry) => entry.name).filter((url) => wanted.test(url)).reverse();
      for (const url of urls) {
        const value = await this.requestJson(url, signal);
        if (value && typeof value.url === "string" && isRecord(value.auth_info)) {return value;}
      }
      return void 0;
    }
    async loaderNumber(signal) {
      const candidates = [];
      for (const script of document.scripts) {
        const src = script.getAttribute("src");
        if (src && /\/browserWebApi\/[^?#]*getLoader(?:[?#]|$)/iu.test(src)) {candidates.push(resolveUrl(src, location.href));}
      }
      candidates.push(new URL("/browserWebApi/03/getLoader", location.origin).href);
      for (const url of [...new Set(candidates)]) {
        try {
          const response = await fetch(url, { credentials: "include", cache: "no-store", signal });
          if (!response.ok) {continue;}
          const text = await response.text();
          const match = text.match(/(?:^|[;\n])\s*([A-Za-z_$][\w$]*)\s*=\s*function\s*\(\s*\)\s*\{[\s\S]*?\}\s*;?/u);
          if (!match) {continue;}
          const name = match[1];
          const code = match[0];
          const value = Function(`"use strict";${code};return ${name}();`)();
          const number = Number(value);
          if (Number.isFinite(number)) {return number;}
        } catch (error) {
          if (error?.name === "AbortError") {throw error;}
        }
      }
      return void 0;
    }
    async fetchAuthInfo(signal) {
      const existing = await this.existingAuthInfo(signal);
      if (existing) {return existing;}
      const cid = new URLSearchParams(location.search).get("cid");
      if (!cid) {return void 0;}
      const trial = /(?:^|\.)viewer-(?:epubs-)?trial\.bookwalker\.jp$/iu.test(location.hostname);
      if (trial) {
        const url = new URL("/trial-page/c", location.origin);
        url.searchParams.set("cid", cid);
        url.searchParams.set("BID", "0");
        const value = await this.requestJson(url.href, signal);
        return value && typeof value.url === "string" && isRecord(value.auth_info) ? value : void 0;
      }
      const url = new URL("/browserWebApi/c", location.origin);
      url.searchParams.set("cid", cid);
      const u1 = this.cookieValue("u1");
      const u2 = this.cookieValue("u2");
      const browserId = localStorage.getItem("NFBR.Global/BrowserId");
      if (u1) {url.searchParams.set("u1", u1);}
      if (u2) {url.searchParams.set("u2", u2);}
      if (browserId) {url.searchParams.set("BID", browserId);}
      const cr = await this.loaderNumber(signal);
      if (cr !== void 0) {url.searchParams.set("cr", String(cr));}
      const value = await this.requestJson(url.href, signal);
      return value && typeof value.url === "string" && isRecord(value.auth_info) ? value : void 0;
    }
    async refreshAuthorization(signal) {
      const auth = await this.fetchAuthInfo(signal);
      if (!auth) {throw new AuthenticationError("无法刷新 BOOK☆WALKER 内容授权参数。");}
      this.authInfo = auth;
      if (typeof auth.cti === "string" && auth.cti) {this.bookInfo.title = auth.cti;}
      if (this.catalogKind === "trial") {
        for (const entry of this.pageCatalog) {
          if (entry.imagePath) {entry.imageUrl = this.resourceUrl(entry.imagePath, auth);}
        }
      }
      this.emit("metadata-updated", this.snapshotBookInfo());
      return auth;
    }
    resourceUrl(fileName, auth = this.authInfo) {
      if (!auth || typeof auth.url !== "string" || !isRecord(auth.auth_info)) {return void 0;}
      const cty = Number(auth.cty);
      const prefix = Number.isFinite(cty) && cty !== 1 && cty !== 2 ? "normal_default/" : "";
      const base = String(auth.url);
      let url;
      try {
        url = new URL(`${prefix}${fileName}`, base.endsWith("/") ? base : `${base}/`);
      } catch {
        return void 0;
      }
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(auth.auth_info)) {query.set(String(key), String(value));}
      url.search = query.toString();
      return url.href;
    }
    async decryptConfigurationPack(raw) {
      if (!isRecord(raw)) {return void 0;}
      if (typeof raw.data !== "string" || raw.data.length === 0) {
        return { config: raw, key1: [], key2: [], key3: [], key1Arr: "", key2Arr: "", key3Arr: "", encrypted: false };
      }
      const nfbr = await this.waitForNfbrApi(["decryptConfig"]);
      if (!nfbr) {return void 0;}
      let decoded;
      try { decoded = atob(raw.data); } catch { return void 0; }
      if (decoded.length < 96) {return void 0;}
      const keys = [[], [], []];
      for (let key = 0; key < 3; key++) {
        for (let index = 0; index < 32; index++) {keys[key].push(decoded.charCodeAt(key * 32 + index));}
      }
      const body = decoded.slice(96);
      const bytes = new Uint8Array(body.length);
      for (let index = 0; index < body.length; index++) {bytes[index] = body.charCodeAt(index);}
      try {
        const result = await nfbr.decryptConfig(bytes, keys[0], keys[1], keys[2]);
        if (!result) {return void 0;}
        if (isRecord(result) && isRecord(result.config)) {return { ...result, encrypted: true };}
        if (isRecord(result)) {return { config: result, key1: keys[0], key2: keys[1], key3: keys[2], key1Arr: "", key2Arr: "", key3Arr: "", encrypted: true };}
      } catch (error) {
        __eldDevDebug("[EbookLosslessDownloader] configuration decrypt failed", error);
      }
      return void 0;
    }
    async buildDirectCatalog(configData, auth) {
      if (!configData || !isRecord(configData.config)) {return [];}
      const config = configData.config;
      const contents = configurationContents(config);
      if (!contents) {return [];}
      const pages = [];
      let pageNumber = 0;
      for (let contentIndex = 0; contentIndex < contents.length; contentIndex++) {
        const item = contents[contentIndex];
        if (!isRecord(item)) {continue;}
        const file = directString(item, ["file"]);
        if (!file) {continue;}
        const type = directString(item, ["type"]) ?? JPG_SOURCE_EXTENSION;
        const fileInfo = config[file];
        if (!isRecord(fileInfo)) {continue;}
        const linkInfo = directValue(fileInfo, ["FileLinkInfo"]);
        if (!isRecord(linkInfo)) {continue;}
        const pageLinksRaw = directValue(linkInfo, ["PageLinkInfoList"]);
        const pageLinks = Array.isArray(pageLinksRaw) ? pageLinksRaw : [];
        const pageCount = pageLinks.length || directNumber(linkInfo, ["PageCount"]) || 0;
        for (let subPageIndex = 0; subPageIndex < pageCount; subPageIndex++) {
          const pageInfo = isRecord(pageLinks[subPageIndex]) ? pageLinks[subPageIndex] : void 0;
          const pageObject = pageInfo && isRecord(directValue(pageInfo, ["Page"])) ? directValue(pageInfo, ["Page"]) : void 0;
          // Trial resources use the ordered subpage index even when the configuration
          // payload itself was encrypted. Purchased books never enter this adapter.
          const imagePath = `${file}/${subPageIndex}.${type}`;
          const imageUrl = imagePath ? this.resourceUrl(imagePath, auth) : void 0;
          const size = pageObject && isRecord(directValue(pageObject, ["Size"])) ? directValue(pageObject, ["Size"]) : void 0;
          const width = size ? directNumber(size, ["Width", "width"]) : void 0;
          const height = size ? directNumber(size, ["Height", "height"]) : void 0;
          const blockWidth = pageObject ? directNumber(pageObject, ["BlockWidth"]) : void 0;
          const blockHeight = pageObject ? directNumber(pageObject, ["BlockHeight"]) : void 0;
          const dummyWidth = pageObject ? directNumber(pageObject, ["DummyWidth"]) ?? 0 : 0;
          const dummyHeight = pageObject ? directNumber(pageObject, ["DummyHeight"]) ?? 0 : 0;
          const reorderDescriptor = configurationReorderDescriptor(pageObject, pageInfo);
          // BlockWidth/BlockHeight may exist on ordinary, unscrambled pages. Only
          // an actual seed/advanced tuple/rectangle map proves that reorder is needed.
          const hasBlockGeometry = Number.isSafeInteger(blockWidth) && blockWidth > 0 && Number.isSafeInteger(blockHeight) && blockHeight > 0;
          const reorderState = reorderDescriptor ? "required" : hasBlockGeometry ? "unknown" : "none";
          pageNumber++;
          pages.push({
            pageNumber, sourceKind: "trial", contentIndex, subPageIndex, file, type, imagePath, reorderState,
            ...imageUrl ? { imageUrl } : {},
            ...width === void 0 ? {} : { width },
            ...height === void 0 ? {} : { height },
            ...blockWidth === void 0 ? {} : { blockWidth },
            ...blockHeight === void 0 ? {} : { blockHeight },
            dummyWidth, dummyHeight,
            ...reorderDescriptor ? { reorderDescriptor } : {},
            ...pageInfo ? { pageInfo } : {},
            ...pageObject ? { pageObject } : {},
            directFromConfiguration: true
          });
        }
      }
      return pages;
    }
    async loadBookConfiguration(signal) {
      try {
        // Purchased viewer: the in-memory catalog itself is sufficient to make the UI
        // ready. Do not gate catalog discovery on /browserWebApi/c; authentication is
        // fetched independently and can be retried when the first JPG is requested.
        if (!this.isTrialViewer()) {
          const catalogReady = await this.buildPurchasedMemoryCatalog(signal);
          if (!catalogReady) {return false;}
          try {
            const auth = await this.fetchAuthInfo(signal);
            if (auth) {
              this.authInfo = auth;
              if (typeof auth.cti === "string" && auth.cti) {this.bookInfo.title = auth.cti;}
            }
          } catch (error) {
            __eldDevDebug("[EbookLosslessDownloader 0.5.0] purchased auth deferred", error);
          }
          return true;
        }

        const auth = await this.fetchAuthInfo(signal);
        if (!auth) {return false;}
        this.authInfo = auth;
        if (typeof auth.cti === "string" && auth.cti) {this.bookInfo.title = auth.cti;}

        // Trial viewer: retain the working configuration_pack.json path.
        const configUrl = this.resourceUrl("configuration_pack.json", auth);
        if (!configUrl) {return false;}
        const raw = await this.requestJson(configUrl, signal);
        if (!raw) {return false;}
        const configData = await this.decryptConfigurationPack(raw);
        if (!configData || !isRecord(configData.config)) {return false;}
        this.configData = configData;
        const catalog = await this.buildDirectCatalog(configData, auth);
        if (catalog.length === 0) {return false;}
        this.pageCatalog = catalog;
        this.pageCatalogSourceUrl = configUrl;
        this.catalogKind = "trial";
        this.directCatalogReady = true;
        this.bookInfo.totalPages = catalog.length;
        const sized = catalog.find((entry) => entry.width && entry.height);
        if (sized) {
          this.bookInfo.width = sized.width;
          this.bookInfo.height = sized.height;
          this.metadataDimensionsResolved = true;
        }
        this.emit("catalog-ready", this.snapshotBookInfo());
        return true;
      } catch (error) {
        if (isAbort(error)) {throw error;}
        __eldDevDebug("[EbookLosslessDownloader] deterministic catalog pipeline unavailable", error);
        return false;
      }
    }
    async ensureBookConfiguration(signal) {
      if (this.pageCatalog.length > 0 && (this.configData || this.purchasedMemory)) {return true;}
      if (!this.configurationLoadPromise) {this.configurationLoadPromise = this.loadBookConfiguration(signal);}
      let ready = await __eldWaitWithSignal(this.configurationLoadPromise, signal);
      if (!ready) {
        // The first Z1P call may occur slightly after userscript startup.
        this.configurationLoadPromise = this.loadBookConfiguration(signal);
        ready = await __eldWaitWithSignal(this.configurationLoadPromise, signal);
      }
      return Boolean(ready && this.pageCatalog.length > 0);
    }
    async resolveTrialRuntimeReorder(page, entry, image, signal) {
      let memory = this.trialRuntimeMemory;
      if (!memory) {
        memory = await this.waitForPurchasedMemory(3e3, signal);
        if (memory) {this.trialRuntimeMemory = memory;}
      }
      if (!memory) {
        throw new MappingMissingError(`第 ${page} 页：配置只给出了块尺寸，但尚未捕获可判定 NFBR 状态的 viewer_image 页面对象。`);
      }
      let context = memory.context;
      if (!context) {
        let root;
        try { root = memory.renderer?.model?.attributes; } catch { /* Intentionally ignored. */ }
        context = this.findPurchasedContext(memory.renderer, root, memory.pages);
        if (context) {memory.context = context;}
      }
      const pageObject = memory.pages[page - 1];
      if (!pageObject || !context) {
        throw new MappingMissingError(`第 ${page} 页：无法将试读目录条目绑定到 viewer_image 运行时页面对象。`);
      }
      if (!this.pageHasNativeNfbr(pageObject) && typeof pageObject.n4q === "function") {pageObject.n4q(context);}
      if (!this.pageHasNativeNfbr(pageObject)) {
        entry.runtimePageObject = pageObject;
        return { state: "none", map: null };
      }
      if (typeof memory.originalZ1P !== "function") {
        throw new MappingMissingError(`第 ${page} 页：已取得试读 NFBR 参数，但原生 Z1P 不可用。`);
      }
      const rectangles = Reflect.apply(memory.originalZ1P, memory.renderer, [pageObject, image.width, image.height]);
      const map = normalizeViewerRectangles(rectangles, image.width, image.height);
      if (!Array.isArray(map) || map.length === 0) {
        throw new MappingMissingError(`第 ${page} 页：试读页面已有 NFBR 参数，但 Z1P 未生成可用映射。`);
      }
      entry.runtimePageObject = pageObject;
      const moved = map.some((rect) => rect.inputX !== rect.outputX || rect.inputY !== rect.outputY);
      return { state: moved ? "required" : "none", map: moved ? map : null };
    }
    async prepareTrialSource(page, signal) {
      __eldThrowIfAborted(signal);
      if (!await this.ensureBookConfiguration(signal)) {return void 0;}
      const entry = this.catalogEntry(page);
      if (!entry || entry.sourceKind !== "trial" || !entry.imageUrl) {return void 0;}
      await this.refetchImage(entry.imageUrl, { signal });
      const image = this.imageForUrl(entry.imageUrl);
      if (!image?.bytes) {throw new NetworkDownloadError(`第 ${page} 页：未取得试读页面原始图片。`);}
      const targetWidth = Math.max(1, image.width - (entry.dummyWidth ?? 0));
      const targetHeight = Math.max(1, image.height - (entry.dummyHeight ?? 0));
      entry.width = targetWidth;
      entry.height = targetHeight;
      if (entry.reorderState === "none") {return this.normalizedSource(page, entry, image, "none", null);}
      if (entry.reorderState === "unknown") {
        const resolved = await this.resolveTrialRuntimeReorder(page, entry, image, signal);
        return this.normalizedSource(page, entry, image, resolved.state, resolved.map);
      }
      const descriptor = entry.reorderDescriptor;
      let map;
      if (Array.isArray(descriptor?.rectangles)) {
        map = normalizeViewerRectangles(descriptor.rectangles, image.width, image.height);
      } else if (descriptor?.tileWidth && descriptor?.tileHeight) {
        map = mapForDescriptor(image.width, image.height, descriptor);
      }
      if (!Array.isArray(map) || map.length === 0) {
        throw new MappingMissingError(`第 ${page} 页：配置表明需要重排，但没有给出可用的 NFBR 映射参数。`);
      }
      const moved = map.some((rect) => rect.inputX !== rect.outputX || rect.inputY !== rect.outputY);
      return this.normalizedSource(page, entry, image, moved ? "required" : "none", moved ? map : null);
    }

    async preparePage(page, { signal } = {}) {
      __eldThrowIfAborted(signal);
      const entry = this.catalogEntry(page);
      if (!entry) {return void 0;}
      if (entry.sourceKind === "purchased") {return this.preparePurchasedSource(page, signal);}
      if (entry.sourceKind === "trial") {return this.prepareTrialSource(page, signal);}
      throw new DownloadError(`第 ${page} 页：未知页面源类型。`, "page-source", false);
    }

    async prefetchTrialRange(startPage, endPage, concurrency = 2, signal) {
      if (!await this.ensureBookConfiguration(signal)) {return;}
      const urls = [];
      for (let page = startPage; page <= endPage; page++) {
        const url = this.catalogEntry(page)?.imageUrl;
        if (url && !this.imageForUrl(url)) {urls.push(url);}
      }
      if (urls.length === 0) {return;}
      let cursor = 0;
      const worker = async () => {
        while (cursor < urls.length) {
          __eldThrowIfAborted(signal);
          const url = urls[cursor++];
          if (url) {await this.refetchImage(url, { signal });}
        }
      };
      await Promise.all(Array.from({ length: Math.min(2, Math.max(1, concurrency), urls.length) }, () => worker()));
    }
    async prefetchWindow(page, endPage, signal) {
      __eldThrowIfAborted(signal);
      const windowEnd = Math.min(endPage, page + 5);
      if (this.catalogKind === "purchased") {
        await this.prefetchPurchasedRange(page, windowEnd, 2, signal);
      } else {
        await this.prefetchTrialRange(page, windowEnd, 2, signal);
      }
      const keep = new Set(this.pageCatalog.slice(Math.max(0, page - 1), windowEnd).map((entry) => entry.imageUrl).filter(Boolean).map(resourceIdentity));
      for (const [url] of this.images) {
        if (!keep.has(resourceIdentity(url))) {this.images.delete(url);}
      }
    }
    snapshotBookInfo() {
      return {
        ...this.bookInfo.title === void 0 ? {} : { title: this.bookInfo.title },
        ...this.bookInfo.width === void 0 ? {} : { width: this.bookInfo.width },
        ...this.bookInfo.height === void 0 ? {} : { height: this.bookInfo.height },
        ...this.bookInfo.totalPages === void 0 ? {} : { totalPages: this.bookInfo.totalPages }
      };
    }
    async refetchImage(url, { bypassCache = false, signal = this.activeSignal } = {}) {
      __eldThrowIfAborted(signal);
      const resolvedUrl = resolveUrl(url, location.href);
      if (this.imageForUrl(resolvedUrl)) {return true;}
      const existing = this.pendingImageFetches.get(resolvedUrl);
      if (existing) {return existing;}
      const task = this.requestGate.run(async () => {
        __eldThrowIfAborted(signal);
        try {
          let crossOrigin = false;
          try { crossOrigin = new URL(resolvedUrl, location.href).origin !== location.origin; } catch { /* Intentionally ignored. */ }
          if (crossOrigin && typeof GM_xmlhttpRequest === "function") {
            const bytes = await __eldGmArrayBuffer(resolvedUrl, 2e4, signal);
            this.rememberImage(resolvedUrl, bytes);
          } else {
            const response = await fetch(resolvedUrl, {
              credentials: "include",
              cache: bypassCache ? "reload" : "force-cache",
              signal
            });
            if (response.status === 401 || response.status === 403) {
              throw new AuthenticationError(`HTTP ${response.status}`);
            }
            if (!response.ok) {throw new NetworkDownloadError(`HTTP ${response.status}`);}
            this.rememberImage(resolvedUrl, new Uint8Array(await response.arrayBuffer()));
          }
          if (!this.imageForUrl(resolvedUrl)) {throw new NetworkDownloadError("response is not a usable page image");}
          return true;
        } catch (error) {
          if (error?.name === "AbortError" || error instanceof DownloadError) {throw error;}
          const detail = error instanceof Error ? error.message : String(error);
          if (/HTTP (?:401|403)/u.test(detail)) {throw new AuthenticationError(detail);}
          throw new NetworkDownloadError(detail);
        } finally {
          this.pendingImageFetches.delete(resolvedUrl);
        }
      }, signal);
      this.pendingImageFetches.set(resolvedUrl, task);
      return task;
    }
    rememberImage(url, bytes) {
      const size = parseImageSize(bytes);
      if (!size || size.width < 256 || size.height < 256) {return;}
      const resolvedUrl = resolveUrl(url, location.href);
      this.images.set(resolvedUrl, {
        url: resolvedUrl,
        bytes,
        width: size.width,
        height: size.height,
        mimeType: mimeTypeFromUrl(resolvedUrl),
        observedAt: performance.now()
      });
      while (this.images.size > IMAGE_LIMIT) {
        const oldest = [...this.images.values()].sort((left, right) => left.observedAt - right.observedAt)[0];
        if (!oldest) {break;}
        this.images.delete(oldest.url);
      }
    }
   };

  // src/userscript/bookwalker/image-processing.ts
  var PNG_SIGNATURE = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  var crcTable;
  function createCrcTable() {
    const table = new Uint32Array(256);
    for (let value = 0; value < 256; value++) {
      let crc = value;
      for (let bit = 0; bit < 8; bit++) {crc = crc & 1 ? 3988292384 ^ crc >>> 1 : crc >>> 1;}
      table[value] = crc >>> 0;
    }
    return table;
  }
  function crc32(type, data) {
    const table = crcTable ??= createCrcTable();
    let crc = 4294967295;
    for (const bytes of [type, data]) {
      for (const byte of bytes) {crc = (table[(crc ^ byte) & 255] ?? 0) ^ crc >>> 8;}
    }
    return (crc ^ 4294967295) >>> 0;
  }
  function uint32(value) {
    return Uint8Array.from([value >>> 24, value >>> 16, value >>> 8, value]);
  }
  function concatBytes(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(total);
    let offset2 = 0;
    for (const part of parts) {
      result.set(part, offset2);
      offset2 += part.length;
    }
    return result;
  }
  function ownedArrayBuffer(bytes) {
    return Uint8Array.from(bytes).buffer;
  }
  function pngChunk(typeName, data) {
    const type = new TextEncoder().encode(typeName);
    return concatBytes([uint32(data.length), type, data, uint32(crc32(type, data))]);
  }
  function paeth(left, above, upperLeft) {
    const estimate = left + above - upperLeft;
    const leftDistance = Math.abs(estimate - left);
    const aboveDistance = Math.abs(estimate - above);
    const upperLeftDistance = Math.abs(estimate - upperLeft);
    return leftDistance <= aboveDistance && leftDistance <= upperLeftDistance ? left : aboveDistance <= upperLeftDistance ? above : upperLeft;
  }
  function filterRgbRow(source, width, row, filter, result) {
    const stride = width * 3;
    const sourceStride = width * 4;
    const sourceRowOffset = row * sourceStride;
    let score = 0;
    for (let index = 0; index < stride; index++) {
      const pixel = Math.floor(index / 3);
      const channel = index % 3;
      const sourceIndex = sourceRowOffset + pixel * 4 + channel;
      const value = source[sourceIndex] ?? 0;
      const left = pixel > 0 ? source[sourceIndex - 4] ?? 0 : 0;
      const above = row > 0 ? source[sourceIndex - sourceStride] ?? 0 : 0;
      const upperLeft = row > 0 && pixel > 0 ? source[sourceIndex - sourceStride - 4] ?? 0 : 0;
      let predictor = 0;
      if (filter === 1) {predictor = left;}
      else if (filter === 2) {predictor = above;}
      else if (filter === 3) {predictor = Math.floor((left + above) / 2);}
      else if (filter === 4) {predictor = paeth(left, above, upperLeft);}
      const filtered = value - predictor & 255;
      result[index] = filtered;
      score += Math.abs(filtered < 128 ? filtered : filtered - 256);
    }
    return score;
  }
  function encodeRgbScanlines(imageData, compression) {
    const stride = imageData.width * 3;
    const output = new Uint8Array((stride + 1) * imageData.height);
    const candidates = compression <= 1 ? [0] : compression <= 4 ? [0, 1, 2] : [0, 1, 2, 3, 4];
    let best = new Uint8Array(stride);
    let candidate = new Uint8Array(stride);
    for (let row = 0; row < imageData.height; row++) {
      let bestFilter = 0;
      let bestScore = filterRgbRow(imageData.data, imageData.width, row, 0, best);
      for (let candidateIndex = 1; candidateIndex < candidates.length; candidateIndex++) {
        const filter = candidates[candidateIndex];
        const score = filterRgbRow(imageData.data, imageData.width, row, filter, candidate);
        if (score < bestScore) {
          bestFilter = filter;
          bestScore = score;
          const swap = best;
          best = candidate;
          candidate = swap;
        }
      }
      const offset2 = row * (stride + 1);
      output[offset2] = bestFilter;
      output.set(best, offset2 + 1);
    }
    return output;
  }
  function grayscaleIndex(red, green, blue, colors) {
    const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
    return Math.max(0, Math.min(colors - 1, Math.round(gray * (colors - 1) / 255)));
  }
  function encodeIndexedScanlines(imageData, colors) {
    const bitDepth = colors === 2 ? 1 : colors === 4 ? 2 : 4;
    const rowBytes = Math.ceil(imageData.width * bitDepth / 8);
    const scanlines = new Uint8Array((rowBytes + 1) * imageData.height);
    for (let y = 0; y < imageData.height; y++) {
      const rowOffset = y * (rowBytes + 1);
      scanlines[rowOffset] = 0;
      for (let x = 0; x < imageData.width; x++) {
        const pixel = (y * imageData.width + x) * 4;
        const index = grayscaleIndex(
          imageData.data[pixel] ?? 0,
          imageData.data[pixel + 1] ?? 0,
          imageData.data[pixel + 2] ?? 0,
          colors
        );
        const bitOffset = x * bitDepth;
        const byteOffset = rowOffset + 1 + Math.floor(bitOffset / 8);
        const shift = 8 - bitDepth - bitOffset % 8;
        scanlines[byteOffset] = (scanlines[byteOffset] ?? 0) | index << shift;
      }
    }
    const palette = new Uint8Array(colors * 3);
    for (let index = 0; index < colors; index++) {
      const gray = Math.round(index * 255 / (colors - 1));
      palette.set([gray, gray, gray], index * 3);
    }
    return { scanlines, palette, bitDepth };
  }
  function encodePngSync(imageData, compression, paletteColors) {
    const level = Math.max(0, Math.min(9, Math.round(compression)));
    const indexed = paletteColors ? encodeIndexedScanlines(imageData, paletteColors) : void 0;
    const ihdr = new Uint8Array(13);
    ihdr.set(uint32(imageData.width), 0);
    ihdr.set(uint32(imageData.height), 4);
    ihdr[8] = indexed?.bitDepth ?? 8;
    ihdr[9] = indexed ? 3 : 2;
    const scanlines = indexed?.scanlines ?? encodeRgbScanlines(imageData, level);
    const compressed = globalThis.pako.deflate(scanlines, { level });
    const chunks = [PNG_SIGNATURE, pngChunk("IHDR", ihdr)];
    if (indexed) {chunks.push(pngChunk("PLTE", indexed.palette));}
    chunks.push(pngChunk("IDAT", compressed), pngChunk("IEND", new Uint8Array()));
    return new Blob([ownedArrayBuffer(concatBytes(chunks))], { type: "image/png" });
  }

  var __eldImageWorker;
  var __eldImageWorkerUrl;
  var __eldImageWorkerSerial = 0;
  var __eldImageWorkerSourcePromise;
  var __eldImageWorkerPending = /* @__PURE__ */ new Map();
  async function __eldCreateImageWorkerSource(signal) {
    const pakoSource = await __eldFetchVerifiedText(
      "https://unpkg.com/pako@2.1.0/dist/pako.min.js",
      "ede2693a4a6a5126b9d35669062b358ecab6ae7b9b86a1cf302feb45a8514907",
      15000,
      signal
    );
    return `"use strict";
${pakoSource}
const PNG_SIGNATURE = Uint8Array.from([137,80,78,71,13,10,26,10]);
let crcTable;
${createCrcTable.toString()}
${crc32.toString()}
${uint32.toString()}
${concatBytes.toString()}
${ownedArrayBuffer.toString()}
${pngChunk.toString()}
${paeth.toString()}
${filterRgbRow.toString()}
${encodeRgbScanlines.toString()}
${grayscaleIndex.toString()}
${encodeIndexedScanlines.toString()}
${encodePngSync.toString()}
const codecPromises = new Map();
async function sha256Hex(source) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function verifiedImport(url, expectedHash) {
  if (codecPromises.has(url)) return codecPromises.get(url);
  const promise = (async () => {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status + " loading codec");
    const original = await response.text();
    const actual = await sha256Hex(original);
    if (actual !== expectedHash) throw new Error("codec integrity mismatch");
    const absolute = original.replaceAll('"/npm/', '"https://cdn.jsdelivr.net/npm/').replaceAll("'/npm/", "'https://cdn.jsdelivr.net/npm/");
    const blobUrl = URL.createObjectURL(new Blob([absolute], { type: "text/javascript" }));
    try { return await import(blobUrl); }
    finally { URL.revokeObjectURL(blobUrl); }
  })();
  codecPromises.set(url, promise);
  return promise;
}
const WEBP_CODEC = ["https://cdn.jsdelivr.net/npm/@jsquash/webp@1.5.0/+esm", "66efc3f63f8b43cf33eb7ebc55b2129b19827e741f2101c2637c59dba20621a3"];
const JXL_CODEC = ["https://cdn.jsdelivr.net/npm/@jsquash/jxl@1.2.0/+esm", "b053c791ec85b0c40ca7a5d51cbf2942f5d8d58e920148b14c881d221e9cd675"];
self.onmessage = async (event) => {
  const { id, type = "encode", image, options } = event.data;
  try {
    if (type === "warmup") {
      const formats = Array.isArray(event.data.formats) ? event.data.formats : [];
      if (formats.includes("webp")) await verifiedImport(...WEBP_CODEC);
      if (formats.includes("jxl")) await verifiedImport(...JXL_CODEC);
      self.postMessage({ id, ok: true, warmup: true });
      return;
    }
    let bytes;
    let mimeType;
    if (options.format === "png") {
      const blob = encodePngSync(image, options.compression, options.paletteColors);
      bytes = new Uint8Array(await blob.arrayBuffer());
      mimeType = "image/png";
    } else if (options.format === "webp") {
      const codec = await verifiedImport(...WEBP_CODEC);
      const result = await codec.encode(image, {
        quality: Math.max(0, Math.min(100, options.quality)),
        method: Math.max(0, Math.min(6, Math.round(options.method))),
        lossless: options.lossless ? 1 : 0,
        exact: options.lossless ? 1 : 0
      });
      bytes = result instanceof ArrayBuffer ? new Uint8Array(result) : new Uint8Array(result.buffer, result.byteOffset, result.byteLength);
      mimeType = "image/webp";
    } else if (options.format === "jxl") {
      const codec = await verifiedImport(...JXL_CODEC);
      const result = await codec.encode(image, {
        effort: Math.max(1, Math.min(9, Math.round(options.effort))),
        lossless: Boolean(options.lossless),
        quality: options.lossless ? 100 : Math.min(99.9, Math.max(0, options.quality)),
        progressive: false,
        epf: -1,
        lossyPalette: false,
        decodingSpeedTier: 1,
        photonNoiseIso: 0,
        lossyModular: false
      });
      bytes = result instanceof ArrayBuffer ? new Uint8Array(result) : new Uint8Array(result.buffer, result.byteOffset, result.byteLength);
      mimeType = "image/jxl";
    } else {
      throw new Error("Unsupported worker codec: " + options.format);
    }
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    self.postMessage({ id, ok: true, buffer, mimeType }, [buffer]);
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};`;
  }
  async function __eldEnsureImageWorker(signal) {
    if (__eldImageWorker) {return __eldImageWorker;}
    __eldImageWorkerSourcePromise ??= __eldCreateImageWorkerSource(signal).catch((error) => {
      __eldImageWorkerSourcePromise = void 0;
      throw error;
    });
    const source = await __eldImageWorkerSourcePromise;
    __eldThrowIfAborted(signal);
    __eldImageWorkerUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    __eldImageWorker = new Worker(__eldImageWorkerUrl);
    __eldImageWorker.onmessage = (event) => {
      const pending = __eldImageWorkerPending.get(event.data?.id);
      if (!pending) {return;}
      __eldImageWorkerPending.delete(event.data.id);
      pending.cleanup();
      if (event.data.ok) {
        if (event.data.warmup) {pending.resolve(true);}
        else {pending.resolve(new Blob([event.data.buffer], { type: event.data.mimeType }));}
      } else {pending.reject(new CodecError(event.data.error || "Image encoding failed."));}
    };
    __eldImageWorker.onerror = (event) => {
      const error = new CodecError(event.message || "Image encoding worker failed.");
      for (const pending of __eldImageWorkerPending.values()) {
        pending.cleanup();
        pending.reject(error);
      }
      __eldImageWorkerPending.clear();
      __eldDisposeImageWorker();
    };
    return __eldImageWorker;
  }
  function __eldDisposeImageWorker(reason = "Image encoding worker stopped.") {
    const error = new DOMException(reason, "AbortError");
    for (const pending of __eldImageWorkerPending.values()) {
      pending.cleanup();
      pending.reject(error);
    }
    __eldImageWorkerPending.clear();
    try { __eldImageWorker?.terminate(); } catch { /* Intentionally ignored. */ }
    if (__eldImageWorkerUrl) {URL.revokeObjectURL(__eldImageWorkerUrl);}
    __eldImageWorker = void 0;
    __eldImageWorkerUrl = void 0;
  }
  async function __eldWarmImageCodecs(formats, signal) {
    const requested = [...new Set((formats ?? []).filter((format) => format === "webp" || format === "jxl"))];
    if (requested.length === 0) {return;}
    __eldThrowIfAborted(signal);
    const worker = await __eldEnsureImageWorker(signal);
    __eldThrowIfAborted(signal);
    const id = ++__eldImageWorkerSerial;
    return new Promise((resolve, reject) => {
      const abort = () => {
        __eldImageWorkerPending.delete(id);
        reject(signal?.reason ?? __eldAbortError());
      };
      const cleanup = () => signal?.removeEventListener("abort", abort);
      signal?.addEventListener("abort", abort, { once: true });
      __eldImageWorkerPending.set(id, { resolve, reject, cleanup });
      worker.postMessage({ id, type: "warmup", formats: requested });
    });
  }
  async function encodeInWorker(imageData, options, signal) {
    __eldThrowIfAborted(signal);
    const worker = await __eldEnsureImageWorker(signal);
    __eldThrowIfAborted(signal);
    const id = ++__eldImageWorkerSerial;
    const data = imageData.data;
    return new Promise((resolve, reject) => {
      const abort = () => {
        __eldImageWorkerPending.delete(id);
        reject(signal?.reason ?? __eldAbortError());
      };
      const cleanup = () => signal?.removeEventListener("abort", abort);
      signal?.addEventListener("abort", abort, { once: true });
      __eldImageWorkerPending.set(id, { resolve, reject, cleanup });
      worker.postMessage({ id, image: { width: imageData.width, height: imageData.height, data }, options }, [data.buffer]);
    });
  }
  function analyzePageType(imageData) {
    let color = 0;
    let white = 0;
    let gray = 0;
    let total = 0;
    const step = Math.max(2, Math.floor(Math.sqrt(imageData.width * imageData.height / 16e4)));
    for (let y = 0; y < imageData.height; y += step) {
      for (let x = 0; x < imageData.width; x += step) {
        const offset2 = (y * imageData.width + x) * 4;
        if ((imageData.data[offset2 + 3] ?? 0) < 20) {continue;}
        total++;
        const red = imageData.data[offset2] ?? 0;
        const green = imageData.data[offset2 + 1] ?? 0;
        const blue = imageData.data[offset2 + 2] ?? 0;
        const maximum = Math.max(red, green, blue);
        const minimum = Math.min(red, green, blue);
        if (maximum - minimum > 18) {color++;}
        else if (red > 238) {white++;}
        else if (red > 35 && red < 232) {gray++;}
      }
    }
    const divisor = Math.max(1, total);
    const colorRatio = color / divisor;
    const whiteRatio = white / divisor;
    const grayRatio = gray / divisor;
    return {
      colorRatio,
      whiteRatio,
      grayRatio,
      isTextPage: colorRatio < 0.025 && (whiteRatio > 0.68 || grayRatio < 0.16)
    };
  }
  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error(`Browser cannot encode ${type}.`)), type, quality);
    });
  }
  function calculateTargetSize(sourceWidth, sourceHeight, width, height, preserveAspectRatio) {
    if (!preserveAspectRatio) {return { width, height };}
    const ratio = Math.min(width / sourceWidth, height / sourceHeight);
    return {
      width: Math.max(1, Math.round(sourceWidth * ratio)),
      height: Math.max(1, Math.round(sourceHeight * ratio))
    };
  }
  function prepareCanvasPage(source, options) {
    const target = calculateTargetSize(
      source.width,
      source.height,
      options.width,
      options.height,
      options.preserveAspectRatio
    );
    const canvas = document.createElement("canvas");
    canvas.width = target.width;
    canvas.height = target.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {throw new Error("Unable to create an output canvas.");}
    context.fillStyle = "#fff";
    context.fillRect(0, 0, target.width, target.height);
    context.imageSmoothingEnabled = target.width !== source.width || target.height !== source.height;
    context.imageSmoothingQuality = "high";
    context.drawImage(source, 0, 0, target.width, target.height);
    const imageData = context.getImageData(0, 0, target.width, target.height);
    const analysis = analyzePageType(imageData);
    return { width: target.width, height: target.height, analysis, canvas, imageData };
  }
  async function encodePreparedPage(prepared, options, signal) {
    const { analysis, canvas, height, imageData, width } = prepared;
    if (options.reduceTextColors && analysis.isTextPage) {
      return {
        blob: await encodeInWorker(imageData, { format: "png", compression: options.pngCompression, paletteColors: 4 }, signal),
        extension: "png",
        width,
        height,
        analysis,
        canvas
      };
    }
    if (options.format === "png") {
      return {
        blob: await encodeInWorker(imageData, { format: "png", compression: options.pngCompression }, signal),
        extension: "png",
        width,
        height,
        analysis,
        canvas
      };
    }
    if (options.format === "webp") {
      return {
        blob: await encodeInWorker(imageData, { format: "webp", lossless: options.webpLossless, quality: options.webpQuality, method: options.webpMethod }, signal),
        extension: "webp",
        width,
        height,
        analysis,
        canvas
      };
    }
    if (options.format === "jxl") {
      return {
        blob: await encodeInWorker(imageData, { format: "jxl", lossless: options.jxlLossless, quality: options.jxlQuality, effort: options.jxlEffort }, signal),
        extension: "jxl",
        width,
        height,
        analysis,
        canvas
      };
    }
    return {
      blob: await canvasToBlob(canvas, JPG_MIME, options.jpgQuality),
      extension: "jpg",
      width,
      height,
      analysis,
      canvas
    };
  }
  async function blobToCanvas(blob) {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      bitmap.close();
      throw new Error("Unable to decode the restored image.");
    }
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
    return canvas;
  }
  var __eldOcrScheduler;
  var __eldOcrPoolPromise;
  var __eldOcrWorkers = [];
  var __eldOcrGeneration = 0;
  var __eldOcrJobs = /* @__PURE__ */ new Set();
  var __ELD_OCR_POOL_SIZE__ = 2;
  var __ELD_OCR_MAX_IN_FLIGHT__ = 3;
  function __eldWaitWithSignal(promise, signal) {
    __eldThrowIfAborted(signal);
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (callback, value) => {
        if (settled) {return;}
        settled = true;
        signal?.removeEventListener("abort", abort);
        callback(value);
      };
      const abort = () => finish(reject, signal?.reason ?? __eldAbortError());
      signal?.addEventListener("abort", abort, { once: true });
      promise.then((value) => finish(resolve, value), (error) => finish(reject, error));
    });
  }
  async function __eldEnsureOcrPool(signal) {
    if (__eldOcrScheduler) {return __eldOcrScheduler;}
    const tesseract = __ELD_GLOBAL__.Tesseract;
    if (!tesseract || typeof tesseract.createWorker !== "function" || typeof tesseract.createScheduler !== "function") {
      throw new CodecError("OCR scheduler is unavailable.");
    }
    if (!__eldOcrPoolPromise) {
      const generation = ++__eldOcrGeneration;
      const creation = (async () => {
        const scheduler = tesseract.createScheduler();
        const workers = await Promise.all(Array.from({ length: __ELD_OCR_POOL_SIZE__ }, () => tesseract.createWorker(["jpn", "eng"], void 0, {
          logger: (message) => {
            if (message.status && message.progress !== void 0 && message.progress >= 1) {
              __eldDevDebug(`[EbookLosslessDownloader OCR] ${message.status}`);
            }
          }
        })));
        if (generation !== __eldOcrGeneration) {
          await Promise.allSettled(workers.map((worker) => worker.terminate()));
          throw __eldAbortError();
        }
        for (const worker of workers) {scheduler.addWorker(worker);}
        __eldOcrWorkers = workers;
        __eldOcrScheduler = scheduler;
        return scheduler;
      })();
      const tracked = creation.catch((error) => {
        if (__eldOcrPoolPromise === tracked) {__eldOcrPoolPromise = void 0;}
        throw error;
      });
      __eldOcrPoolPromise = tracked;
    }
    return __eldWaitWithSignal(__eldOcrPoolPromise, signal);
  }
  async function __eldWaitForOcrCapacity(signal) {
    while (__eldOcrJobs.size >= __ELD_OCR_MAX_IN_FLIGHT__) {
      __eldThrowIfAborted(signal);
      await __eldWaitWithSignal(Promise.race([...__eldOcrJobs].map((job) => job.catch(() => void 0))), signal);
    }
  }
  async function __eldQueueOcr(canvas, signal) {
    await __eldWaitForOcrCapacity(signal);
    const scheduler = await __eldEnsureOcrPool(signal);
    __eldThrowIfAborted(signal);
    const recognition = __eldWaitWithSignal(scheduler.addJob("recognize", canvas), signal).then((result) => result.data?.text?.trim() ?? "");
    let tracked;
    tracked = recognition.finally(() => {
      __eldOcrJobs.delete(tracked);
      releaseCanvas(canvas);
    });
    __eldOcrJobs.add(tracked);
    return { promise: tracked };
  }
  async function __eldDrainOcrJobs(pages, signal, tolerateFailures = false) {
    for (const page of pages) {
      if (!page.__ocrPromise) {continue;}
      try {
        __eldThrowIfAborted(signal);
        page.ocrText = await __eldWaitWithSignal(page.__ocrPromise, signal);
      } catch (error) {
        if (!tolerateFailures) {throw error;}
        __eldDevDebug(`[EbookLosslessDownloader OCR] 第 ${page.pageNumber} 页后台 OCR 未完成。`, error);
      } finally {
        delete page.__ocrPromise;
      }
    }
  }
  function __eldDisposeOcrWorker() {
    __eldOcrGeneration++;
    const scheduler = __eldOcrScheduler;
    const workers = __eldOcrWorkers;
    __eldOcrScheduler = void 0;
    __eldOcrPoolPromise = void 0;
    __eldOcrWorkers = [];
    __eldOcrJobs.clear();
    if (scheduler?.terminate) {
      void Promise.resolve(scheduler.terminate()).catch(() => {});
    } else {
      for (const worker of workers) {void worker.terminate().catch(() => {});}
    }
  }
  // The bundled @jsr/cross__image@0.4.3 JPG subset is isolated here and is used
  // only for coefficient-domain reorder/crop. Ordinary JPG export uses the browser's
  // native canvas encoder. Per the selected policy, this path performs structural
  // validation but deliberately does not decode and compare all output coefficients.
  var __ELD_DCT_WORKER_SOURCE__ = "var __defProp = Object.defineProperty;\nvar __getOwnPropNames = Object.getOwnPropertyNames;\nvar __esm = (fn, res, err) => function __init() {\n  if (err) throw err[0];\n  try {\n    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;\n  } catch (e) {\n    throw err = [e], e;\n  }\n};\nvar __export = (target, all) => {\n  for (var name in all)\n    __defProp(target, name, { get: all[name], enumerable: true });\n};\n\n// node_modules/.pnpm/@jsr+cross__image@0.4.3/node_modules/@jsr/cross__image/src/utils/security.js\nfunction validateImageDimensions(width, height) {\n  if (width <= 0 || height <= 0) {\n    throw new Error(`Invalid image dimensions: ${width}x${height} (dimensions must be positive)`);\n  }\n  if (!Number.isInteger(width) || !Number.isInteger(height)) {\n    throw new Error(`Invalid image dimensions: ${width}x${height} (dimensions must be integers)`);\n  }\n  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {\n    throw new Error(`Image dimensions too large: ${width}x${height} (maximum ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION})`);\n  }\n  const pixelCount = width * height;\n  if (pixelCount > MAX_IMAGE_PIXELS) {\n    throw new Error(`Image size too large: ${width}x${height} (${pixelCount} pixels exceeds maximum ${MAX_IMAGE_PIXELS})`);\n  }\n}\nvar MAX_IMAGE_DIMENSION, MAX_IMAGE_PIXELS;\nvar init_security = __esm({\n  \"node_modules/.pnpm/@jsr+cross__image@0.4.3/node_modules/@jsr/cross__image/src/utils/security.js\"() {\n    MAX_IMAGE_DIMENSION = 65535;\n    MAX_IMAGE_PIXELS = 178956970;\n  }\n});\n\n// node_modules/.pnpm/@jsr+cross__image@0.4.3/node_modules/@jsr/cross__image/src/utils/jpg_encoder.js\nvar jpg_encoder_exports = {};\n__export(jpg_encoder_exports, {\n  JPGEncoder: () => JPGEncoder\n});\nvar STANDARD_LUMINANCE_QUANT_TABLE, STANDARD_CHROMINANCE_QUANT_TABLE, ZIGZAG, STD_DC_LUMINANCE_NRCODES, STD_DC_LUMINANCE_VALUES, STD_AC_LUMINANCE_NRCODES, STD_AC_LUMINANCE_VALUES, STD_DC_CHROMINANCE_NRCODES, STD_DC_CHROMINANCE_VALUES, STD_AC_CHROMINANCE_NRCODES, STD_AC_CHROMINANCE_VALUES, BitWriter, JPGEncoder;\nvar init_jpg_encoder = __esm({\n  \"node_modules/.pnpm/@jsr+cross__image@0.4.3/node_modules/@jsr/cross__image/src/utils/jpg_encoder.js\"() {\n    STANDARD_LUMINANCE_QUANT_TABLE = [\n      16,\n      11,\n      10,\n      16,\n      24,\n      40,\n      51,\n      61,\n      12,\n      12,\n      14,\n      19,\n      26,\n      58,\n      60,\n      55,\n      14,\n      13,\n      16,\n      24,\n      40,\n      57,\n      69,\n      56,\n      14,\n      17,\n      22,\n      29,\n      51,\n      87,\n      80,\n      62,\n      18,\n      22,\n      37,\n      56,\n      68,\n      109,\n      103,\n      77,\n      24,\n      35,\n      55,\n      64,\n      81,\n      104,\n      113,\n      92,\n      49,\n      64,\n      78,\n      87,\n      103,\n      121,\n      120,\n      101,\n      72,\n      92,\n      95,\n      98,\n      112,\n      100,\n      103,\n      99\n    ];\n    STANDARD_CHROMINANCE_QUANT_TABLE = [\n      17,\n      18,\n      24,\n      47,\n      99,\n      99,\n      99,\n      99,\n      18,\n      21,\n      26,\n      66,\n      99,\n      99,\n      99,\n      99,\n      24,\n      26,\n      56,\n      99,\n      99,\n      99,\n      99,\n      99,\n      47,\n      66,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99,\n      99\n    ];\n    ZIGZAG = [\n      0,\n      1,\n      8,\n      16,\n      9,\n      2,\n      3,\n      10,\n      17,\n      24,\n      32,\n      25,\n      18,\n      11,\n      4,\n      5,\n      12,\n      19,\n      26,\n      33,\n      40,\n      48,\n      41,\n      34,\n      27,\n      20,\n      13,\n      6,\n      7,\n      14,\n      21,\n      28,\n      35,\n      42,\n      49,\n      56,\n      57,\n      50,\n      43,\n      36,\n      29,\n      22,\n      15,\n      23,\n      30,\n      37,\n      44,\n      51,\n      58,\n      59,\n      52,\n      45,\n      38,\n      31,\n      39,\n      46,\n      53,\n      60,\n      61,\n      54,\n      47,\n      55,\n      62,\n      63\n    ];\n    STD_DC_LUMINANCE_NRCODES = [\n      0,\n      0,\n      1,\n      5,\n      1,\n      1,\n      1,\n      1,\n      1,\n      1,\n      0,\n      0,\n      0,\n      0,\n      0,\n      0,\n      0\n    ];\n    STD_DC_LUMINANCE_VALUES = [\n      0,\n      1,\n      2,\n      3,\n      4,\n      5,\n      6,\n      7,\n      8,\n      9,\n      10,\n      11\n    ];\n    STD_AC_LUMINANCE_NRCODES = [\n      0,\n      0,\n      2,\n      1,\n      3,\n      3,\n      2,\n      4,\n      3,\n      5,\n      5,\n      4,\n      4,\n      0,\n      0,\n      1,\n      125\n    ];\n    STD_AC_LUMINANCE_VALUES = [\n      1,\n      2,\n      3,\n      0,\n      4,\n      17,\n      5,\n      18,\n      33,\n      49,\n      65,\n      6,\n      19,\n      81,\n      97,\n      7,\n      34,\n      113,\n      20,\n      50,\n      129,\n      145,\n      161,\n      8,\n      35,\n      66,\n      177,\n      193,\n      21,\n      82,\n      209,\n      240,\n      36,\n      51,\n      98,\n      114,\n      130,\n      9,\n      10,\n      22,\n      23,\n      24,\n      25,\n      26,\n      37,\n      38,\n      39,\n      40,\n      41,\n      42,\n      52,\n      53,\n      54,\n      55,\n      56,\n      57,\n      58,\n      67,\n      68,\n      69,\n      70,\n      71,\n      72,\n      73,\n      74,\n      83,\n      84,\n      85,\n      86,\n      87,\n      88,\n      89,\n      90,\n      99,\n      100,\n      101,\n      102,\n      103,\n      104,\n      105,\n      106,\n      115,\n      116,\n      117,\n      118,\n      119,\n      120,\n      121,\n      122,\n      131,\n      132,\n      133,\n      134,\n      135,\n      136,\n      137,\n      138,\n      146,\n      147,\n      148,\n      149,\n      150,\n      151,\n      152,\n      153,\n      154,\n      162,\n      163,\n      164,\n      165,\n      166,\n      167,\n      168,\n      169,\n      170,\n      178,\n      179,\n      180,\n      181,\n      182,\n      183,\n      184,\n      185,\n      186,\n      194,\n      195,\n      196,\n      197,\n      198,\n      199,\n      200,\n      201,\n      202,\n      210,\n      211,\n      212,\n      213,\n      214,\n      215,\n      216,\n      217,\n      218,\n      225,\n      226,\n      227,\n      228,\n      229,\n      230,\n      231,\n      232,\n      233,\n      234,\n      241,\n      242,\n      243,\n      244,\n      245,\n      246,\n      247,\n      248,\n      249,\n      250\n    ];\n    STD_DC_CHROMINANCE_NRCODES = [\n      0,\n      0,\n      3,\n      1,\n      1,\n      1,\n      1,\n      1,\n      1,\n      1,\n      1,\n      1,\n      0,\n      0,\n      0,\n      0,\n      0\n    ];\n    STD_DC_CHROMINANCE_VALUES = [\n      0,\n      1,\n      2,\n      3,\n      4,\n      5,\n      6,\n      7,\n      8,\n      9,\n      10,\n      11\n    ];\n    STD_AC_CHROMINANCE_NRCODES = [\n      0,\n      0,\n      2,\n      1,\n      2,\n      4,\n      4,\n      3,\n      4,\n      7,\n      5,\n      4,\n      4,\n      0,\n      1,\n      2,\n      119\n    ];\n    STD_AC_CHROMINANCE_VALUES = [\n      0,\n      1,\n      2,\n      3,\n      17,\n      4,\n      5,\n      33,\n      49,\n      6,\n      18,\n      65,\n      81,\n      7,\n      97,\n      113,\n      19,\n      34,\n      50,\n      129,\n      8,\n      20,\n      66,\n      145,\n      161,\n      177,\n      193,\n      9,\n      35,\n      51,\n      82,\n      240,\n      21,\n      98,\n      114,\n      209,\n      10,\n      22,\n      36,\n      52,\n      225,\n      37,\n      241,\n      23,\n      24,\n      25,\n      26,\n      38,\n      39,\n      40,\n      41,\n      42,\n      53,\n      54,\n      55,\n      56,\n      57,\n      58,\n      67,\n      68,\n      69,\n      70,\n      71,\n      72,\n      73,\n      74,\n      83,\n      84,\n      85,\n      86,\n      87,\n      88,\n      89,\n      90,\n      99,\n      100,\n      101,\n      102,\n      103,\n      104,\n      105,\n      106,\n      115,\n      116,\n      117,\n      118,\n      119,\n      120,\n      121,\n      122,\n      130,\n      131,\n      132,\n      133,\n      134,\n      135,\n      136,\n      137,\n      138,\n      146,\n      147,\n      148,\n      149,\n      150,\n      151,\n      152,\n      153,\n      154,\n      162,\n      163,\n      164,\n      165,\n      166,\n      167,\n      168,\n      169,\n      170,\n      178,\n      179,\n      180,\n      181,\n      182,\n      183,\n      184,\n      185,\n      186,\n      194,\n      195,\n      196,\n      197,\n      198,\n      199,\n      200,\n      201,\n      202,\n      210,\n      211,\n      212,\n      213,\n      214,\n      215,\n      216,\n      217,\n      218,\n      226,\n      227,\n      228,\n      229,\n      230,\n      231,\n      232,\n      233,\n      234,\n      242,\n      243,\n      244,\n      245,\n      246,\n      247,\n      248,\n      249,\n      250\n    ];\n    BitWriter = class {\n      buffer = new Uint8Array(524288);\n      length = 0;\n      bitBuffer = 0;\n      bitCount = 0;\n      ensureCapacity(additional) {\n        const required = this.length + additional;\n        if (required <= this.buffer.length) return;\n        let capacity = this.buffer.length;\n        while (capacity < required) capacity *= 2;\n        const expanded = new Uint8Array(capacity);\n        expanded.set(this.buffer.subarray(0, this.length));\n        this.buffer = expanded;\n      }\n      writeByte(byte) {\n        this.ensureCapacity(byte === 255 ? 2 : 1);\n        this.buffer[this.length++] = byte;\n        if (byte === 255) this.buffer[this.length++] = 0;\n      }\n      writeBits(value, length) {\n        this.bitBuffer = this.bitBuffer << length | value;\n        this.bitCount += length;\n        while (this.bitCount >= 8) {\n          this.bitCount -= 8;\n          this.writeByte(this.bitBuffer >> this.bitCount & 255);\n        }\n      }\n      flush() {\n        if (this.bitCount > 0) {\n          this.writeByte(this.bitBuffer << 8 - this.bitCount & 255);\n        }\n        this.bitBuffer = 0;\n        this.bitCount = 0;\n      }\n      getBytes() {\n        return this.buffer.subarray(0, this.length);\n      }\n    };\n    JPGEncoder = class {\n      quality;\n      progressive;\n      luminanceQuantTable = [];\n      chrominanceQuantTable = [];\n      dcLuminanceHuffman;\n      acLuminanceHuffman;\n      dcChrominanceHuffman;\n      acChrominanceHuffman;\n      constructor(options = {}) {\n        this.quality = Math.max(1, Math.min(100, options.quality ?? 85));\n        this.progressive = options.progressive ?? false;\n        this.initQuantizationTables();\n        this.initHuffmanTables();\n      }\n      initQuantizationTables() {\n        const scaleFactor = this.quality < 50 ? 5e3 / this.quality : 200 - this.quality * 2;\n        for (let i = 0; i < 64; i++) {\n          let lumVal = Math.floor((STANDARD_LUMINANCE_QUANT_TABLE[i] * scaleFactor + 50) / 100);\n          let chromVal = Math.floor((STANDARD_CHROMINANCE_QUANT_TABLE[i] * scaleFactor + 50) / 100);\n          lumVal = Math.max(1, Math.min(255, lumVal));\n          chromVal = Math.max(1, Math.min(255, chromVal));\n          this.luminanceQuantTable[i] = lumVal;\n          this.chrominanceQuantTable[i] = chromVal;\n        }\n      }\n      initHuffmanTables() {\n        this.dcLuminanceHuffman = this.buildHuffmanTable(STD_DC_LUMINANCE_NRCODES, STD_DC_LUMINANCE_VALUES);\n        this.acLuminanceHuffman = this.buildHuffmanTable(STD_AC_LUMINANCE_NRCODES, STD_AC_LUMINANCE_VALUES);\n        this.dcChrominanceHuffman = this.buildHuffmanTable(STD_DC_CHROMINANCE_NRCODES, STD_DC_CHROMINANCE_VALUES);\n        this.acChrominanceHuffman = this.buildHuffmanTable(STD_AC_CHROMINANCE_NRCODES, STD_AC_CHROMINANCE_VALUES);\n      }\n      buildHuffmanTable(nrcodes, values) {\n        const codes = new Uint32Array(256);\n        const sizes = new Uint8Array(256);\n        let code = 0;\n        let valueIndex = 0;\n        for (let length = 1; length <= 16; length++) {\n          for (let i = 0; i < nrcodes[length]; i++) {\n            const value = values[valueIndex];\n            codes[value] = code;\n            sizes[value] = length;\n            code++;\n            valueIndex++;\n          }\n          code <<= 1;\n        }\n        return {\n          codes,\n          sizes\n        };\n      }\n      encode(width, height, rgba, dpiX = 72, dpiY = 72) {\n        const output = [];\n        output.push(255, 216);\n        this.writeAPP0(output, dpiX, dpiY);\n        this.writeDQT(output);\n        if (this.progressive) {\n          this.writeSOF2(output, width, height);\n        } else {\n          this.writeSOF0(output, width, height);\n        }\n        this.writeDHT(output);\n        if (this.progressive) {\n          this.encodeProgressive(output, width, height, rgba);\n        } else {\n          this.writeSOS(output);\n          const scanData = this.encodeScan(width, height, rgba);\n          for (let i = 0; i < scanData.length; i++) {\n            output.push(scanData[i]);\n          }\n        }\n        output.push(255, 217);\n        return new Uint8Array(output);\n      }\n      writeAPP0(output, dpiX, dpiY) {\n        output.push(255, 224);\n        output.push(0, 16);\n        output.push(74, 70, 73, 70, 0);\n        output.push(1, 1);\n        output.push(1);\n        output.push(dpiX >> 8 & 255, dpiX & 255);\n        output.push(dpiY >> 8 & 255, dpiY & 255);\n        output.push(0, 0);\n      }\n      writeDQT(output) {\n        output.push(255, 219);\n        output.push(0, 67);\n        output.push(0);\n        for (let i = 0; i < 64; i++) {\n          output.push(this.luminanceQuantTable[ZIGZAG[i]]);\n        }\n        output.push(255, 219);\n        output.push(0, 67);\n        output.push(1);\n        for (let i = 0; i < 64; i++) {\n          output.push(this.chrominanceQuantTable[ZIGZAG[i]]);\n        }\n      }\n      writeSOF0(output, width, height) {\n        output.push(255, 192);\n        output.push(0, 17);\n        output.push(8);\n        output.push(height >> 8 & 255, height & 255);\n        output.push(width >> 8 & 255, width & 255);\n        output.push(3);\n        output.push(1);\n        output.push(17);\n        output.push(0);\n        output.push(2);\n        output.push(17);\n        output.push(1);\n        output.push(3);\n        output.push(17);\n        output.push(1);\n      }\n      writeSOF2(output, width, height) {\n        output.push(255, 194);\n        output.push(0, 17);\n        output.push(8);\n        output.push(height >> 8 & 255, height & 255);\n        output.push(width >> 8 & 255, width & 255);\n        output.push(3);\n        output.push(1);\n        output.push(17);\n        output.push(0);\n        output.push(2);\n        output.push(17);\n        output.push(1);\n        output.push(3);\n        output.push(17);\n        output.push(1);\n      }\n      writeDHT(output) {\n        this.writeHuffmanTable(output, 0, STD_DC_LUMINANCE_NRCODES, STD_DC_LUMINANCE_VALUES);\n        this.writeHuffmanTable(output, 16, STD_AC_LUMINANCE_NRCODES, STD_AC_LUMINANCE_VALUES);\n        this.writeHuffmanTable(output, 1, STD_DC_CHROMINANCE_NRCODES, STD_DC_CHROMINANCE_VALUES);\n        this.writeHuffmanTable(output, 17, STD_AC_CHROMINANCE_NRCODES, STD_AC_CHROMINANCE_VALUES);\n      }\n      writeHuffmanTable(output, classId, nrcodes, values) {\n        output.push(255, 196);\n        let length = 19;\n        for (let i = 1; i <= 16; i++) {\n          length += nrcodes[i];\n        }\n        output.push(length >> 8 & 255, length & 255);\n        output.push(classId);\n        for (let i = 1; i <= 16; i++) {\n          output.push(nrcodes[i]);\n        }\n        let valueIndex = 0;\n        for (let i = 1; i <= 16; i++) {\n          for (let j = 0; j < nrcodes[i]; j++) {\n            output.push(values[valueIndex++]);\n          }\n        }\n      }\n      writeSOS(output) {\n        output.push(255, 218);\n        output.push(0, 12);\n        output.push(3);\n        output.push(1);\n        output.push(0);\n        output.push(2);\n        output.push(17);\n        output.push(3);\n        output.push(17);\n        output.push(0);\n        output.push(63);\n        output.push(0);\n      }\n      writeProgressiveSOS(output, componentIds, spectralStart, spectralEnd, successiveHigh, successiveLow) {\n        output.push(255, 218);\n        const length = 6 + componentIds.length * 2;\n        output.push(length >> 8 & 255, length & 255);\n        output.push(componentIds.length);\n        for (const id of componentIds) {\n          output.push(id);\n          if (id === 1) {\n            output.push(0);\n          } else {\n            output.push(17);\n          }\n        }\n        output.push(spectralStart);\n        output.push(spectralEnd);\n        output.push(successiveHigh << 4 | successiveLow);\n      }\n      encodeProgressive(output, width, height, rgba) {\n        const mcuWidth = Math.ceil(width / 8);\n        const mcuHeight = Math.ceil(height / 8);\n        const yBlocks = [];\n        const cbBlocks = [];\n        const crBlocks = [];\n        for (let mcuY = 0; mcuY < mcuHeight; mcuY++) {\n          for (let mcuX = 0; mcuX < mcuWidth; mcuX++) {\n            const yBlock = new Float32Array(64);\n            const cbBlock = new Float32Array(64);\n            const crBlock = new Float32Array(64);\n            for (let y = 0; y < 8; y++) {\n              for (let x = 0; x < 8; x++) {\n                const px = mcuX * 8 + x;\n                const py = mcuY * 8 + y;\n                if (px < width && py < height) {\n                  const offset2 = (py * width + px) * 4;\n                  const r = rgba[offset2];\n                  const g = rgba[offset2 + 1];\n                  const b = rgba[offset2 + 2];\n                  const yVal = 0.299 * r + 0.587 * g + 0.114 * b;\n                  const cbVal = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;\n                  const crVal = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;\n                  yBlock[y * 8 + x] = yVal - 128;\n                  cbBlock[y * 8 + x] = cbVal - 128;\n                  crBlock[y * 8 + x] = crVal - 128;\n                }\n              }\n            }\n            yBlocks.push(this.dctAndQuantize(yBlock, this.luminanceQuantTable));\n            cbBlocks.push(this.dctAndQuantize(cbBlock, this.chrominanceQuantTable));\n            crBlocks.push(this.dctAndQuantize(crBlock, this.chrominanceQuantTable));\n          }\n        }\n        this.writeProgressiveSOS(output, [\n          1,\n          2,\n          3\n        ], 0, 0, 0, 0);\n        const dcScanData = this.encodeProgressiveDCScan(yBlocks, cbBlocks, crBlocks);\n        for (let i = 0; i < dcScanData.length; i++) {\n          output.push(dcScanData[i]);\n        }\n        this.writeProgressiveSOS(output, [\n          1\n        ], 1, 63, 0, 0);\n        const yAcScanData = this.encodeProgressiveACScanSingle(yBlocks, this.acLuminanceHuffman);\n        for (let i = 0; i < yAcScanData.length; i++) {\n          output.push(yAcScanData[i]);\n        }\n        this.writeProgressiveSOS(output, [\n          2\n        ], 1, 63, 0, 0);\n        const cbAcScanData = this.encodeProgressiveACScanSingle(cbBlocks, this.acChrominanceHuffman);\n        for (let i = 0; i < cbAcScanData.length; i++) {\n          output.push(cbAcScanData[i]);\n        }\n        this.writeProgressiveSOS(output, [\n          3\n        ], 1, 63, 0, 0);\n        const crAcScanData = this.encodeProgressiveACScanSingle(crBlocks, this.acChrominanceHuffman);\n        for (let i = 0; i < crAcScanData.length; i++) {\n          output.push(crAcScanData[i]);\n        }\n      }\n      dctAndQuantize(block, quantTable) {\n        const dct = this.performDCT2D(block);\n        const quantized = new Int32Array(64);\n        for (let i = 0; i < 64; i++) {\n          quantized[i] = Math.round(dct[i] / quantTable[i]);\n        }\n        return quantized;\n      }\n      performDCT2D(block) {\n        const output = new Float32Array(64);\n        for (let v = 0; v < 8; v++) {\n          for (let u = 0; u < 8; u++) {\n            let sum = 0;\n            for (let y = 0; y < 8; y++) {\n              for (let x = 0; x < 8; x++) {\n                const cu = u === 0 ? 1 / Math.sqrt(2) : 1;\n                const cv = v === 0 ? 1 / Math.sqrt(2) : 1;\n                sum += block[y * 8 + x] * Math.cos((2 * x + 1) * u * Math.PI / 16) * Math.cos((2 * y + 1) * v * Math.PI / 16) * cu * cv;\n              }\n            }\n            output[v * 8 + u] = sum / 4;\n          }\n        }\n        return output;\n      }\n      encodeProgressiveDCScan(yBlocks, cbBlocks, crBlocks) {\n        const bitWriter = new BitWriter();\n        let dcY = 0, dcCb = 0, dcCr = 0;\n        for (let i = 0; i < yBlocks.length; i++) {\n          dcY = this.encodeOnlyDC(yBlocks[i][0], dcY, this.dcLuminanceHuffman, bitWriter);\n          dcCb = this.encodeOnlyDC(cbBlocks[i][0], dcCb, this.dcChrominanceHuffman, bitWriter);\n          dcCr = this.encodeOnlyDC(crBlocks[i][0], dcCr, this.dcChrominanceHuffman, bitWriter);\n        }\n        bitWriter.flush();\n        return bitWriter.getBytes();\n      }\n      encodeProgressiveACScanSingle(blocks, acTable) {\n        const bitWriter = new BitWriter();\n        for (let i = 0; i < blocks.length; i++) {\n          this.encodeOnlyAC(blocks[i], acTable, bitWriter);\n        }\n        bitWriter.flush();\n        return bitWriter.getBytes();\n      }\n      encodeOnlyDC(dc, prevDC, dcTable, bitWriter) {\n        const dcDiff = dc - prevDC;\n        const clampedDiff = Math.max(-2047, Math.min(2047, dcDiff));\n        const absDiff = Math.abs(clampedDiff);\n        let size = 0;\n        if (absDiff > 0) {\n          size = Math.floor(Math.log2(absDiff)) + 1;\n        }\n        bitWriter.writeBits(dcTable.codes[size], dcTable.sizes[size]);\n        if (size > 0) {\n          const magnitude = clampedDiff < 0 ? clampedDiff + (1 << size) - 1 : clampedDiff;\n          bitWriter.writeBits(magnitude, size);\n        }\n        return dc;\n      }\n      encodeOnlyAC(quantized, acTable, bitWriter) {\n        let zeroCount = 0;\n        for (let i = 1; i < 64; i++) {\n          const coef = quantized[ZIGZAG[i]];\n          const clampedCoef = Math.max(-1023, Math.min(1023, coef));\n          if (clampedCoef === 0) {\n            zeroCount++;\n            if (zeroCount === 16) {\n              bitWriter.writeBits(acTable.codes[240], acTable.sizes[240]);\n              zeroCount = 0;\n            }\n          } else {\n            while (zeroCount >= 16) {\n              bitWriter.writeBits(acTable.codes[240], acTable.sizes[240]);\n              zeroCount -= 16;\n            }\n            const absCoef = Math.abs(clampedCoef);\n            const size = Math.floor(Math.log2(absCoef)) + 1;\n            const symbol = zeroCount << 4 | size;\n            bitWriter.writeBits(acTable.codes[symbol], acTable.sizes[symbol]);\n            const magnitude = clampedCoef < 0 ? clampedCoef + (1 << size) - 1 : clampedCoef;\n            bitWriter.writeBits(magnitude, size);\n            zeroCount = 0;\n          }\n        }\n        if (zeroCount > 0) {\n          bitWriter.writeBits(acTable.codes[0], acTable.sizes[0]);\n        }\n      }\n      encodeScan(width, height, rgba) {\n        const bitWriter = new BitWriter();\n        let dcY = 0, dcCb = 0, dcCr = 0;\n        const mcuWidth = Math.ceil(width / 8);\n        const mcuHeight = Math.ceil(height / 8);\n        for (let mcuY = 0; mcuY < mcuHeight; mcuY++) {\n          for (let mcuX = 0; mcuX < mcuWidth; mcuX++) {\n            const yBlock = new Float32Array(64);\n            const cbBlock = new Float32Array(64);\n            const crBlock = new Float32Array(64);\n            for (let y = 0; y < 8; y++) {\n              for (let x = 0; x < 8; x++) {\n                const px = mcuX * 8 + x;\n                const py = mcuY * 8 + y;\n                if (px < width && py < height) {\n                  const offset2 = (py * width + px) * 4;\n                  const r = rgba[offset2];\n                  const g = rgba[offset2 + 1];\n                  const b = rgba[offset2 + 2];\n                  const yVal = 0.299 * r + 0.587 * g + 0.114 * b;\n                  const cbVal = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;\n                  const crVal = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;\n                  yBlock[y * 8 + x] = yVal - 128;\n                  cbBlock[y * 8 + x] = cbVal - 128;\n                  crBlock[y * 8 + x] = crVal - 128;\n                }\n              }\n            }\n            dcY = this.encodeBlock(yBlock, this.luminanceQuantTable, dcY, this.dcLuminanceHuffman, this.acLuminanceHuffman, bitWriter);\n            dcCb = this.encodeBlock(cbBlock, this.chrominanceQuantTable, dcCb, this.dcChrominanceHuffman, this.acChrominanceHuffman, bitWriter);\n            dcCr = this.encodeBlock(crBlock, this.chrominanceQuantTable, dcCr, this.dcChrominanceHuffman, this.acChrominanceHuffman, bitWriter);\n          }\n        }\n        bitWriter.flush();\n        return bitWriter.getBytes();\n      }\n      encodeBlock(block, quantTable, prevDC, dcTable, acTable, bitWriter) {\n        this.forwardDCT(block);\n        const quantized = new Int32Array(64);\n        for (let i = 0; i < 64; i++) {\n          const zigzagIndex = ZIGZAG[i];\n          quantized[i] = Math.round(block[zigzagIndex] / quantTable[zigzagIndex]);\n        }\n        const dcDiff = quantized[0] - prevDC;\n        this.encodeDC(dcDiff, dcTable, bitWriter);\n        this.encodeAC(quantized, acTable, bitWriter);\n        return quantized[0];\n      }\n      forwardDCT(block) {\n        const temp = new Float32Array(64);\n        for (let i = 0; i < 8; i++) {\n          const offset2 = i * 8;\n          for (let u = 0; u < 8; u++) {\n            let sum = 0;\n            for (let x = 0; x < 8; x++) {\n              sum += block[offset2 + x] * Math.cos((2 * x + 1) * u * Math.PI / 16);\n            }\n            const cu = u === 0 ? 1 / Math.sqrt(2) : 1;\n            temp[offset2 + u] = 0.5 * cu * sum;\n          }\n        }\n        for (let j = 0; j < 8; j++) {\n          for (let v = 0; v < 8; v++) {\n            let sum = 0;\n            for (let y = 0; y < 8; y++) {\n              sum += temp[y * 8 + j] * Math.cos((2 * y + 1) * v * Math.PI / 16);\n            }\n            const cv = v === 0 ? 1 / Math.sqrt(2) : 1;\n            block[v * 8 + j] = 0.5 * cv * sum;\n          }\n        }\n      }\n      encodeDC(value, huffTable, bitWriter) {\n        const maxDC = 2047;\n        const clampedValue = Math.max(-maxDC, Math.min(maxDC, value));\n        const absValue = Math.abs(clampedValue);\n        let size = 0;\n        if (absValue > 0) {\n          size = Math.floor(Math.log2(absValue)) + 1;\n        }\n        bitWriter.writeBits(huffTable.codes[size], huffTable.sizes[size]);\n        if (size > 0) {\n          const magnitude = clampedValue < 0 ? clampedValue + (1 << size) - 1 : clampedValue;\n          bitWriter.writeBits(magnitude, size);\n        }\n      }\n      encodeAC(block, huffTable, bitWriter) {\n        let zeroCount = 0;\n        for (let i = 1; i < 64; i++) {\n          const coef = block[i];\n          if (coef === 0) {\n            zeroCount++;\n          } else {\n            while (zeroCount >= 16) {\n              bitWriter.writeBits(huffTable.codes[240], huffTable.sizes[240]);\n              zeroCount -= 16;\n            }\n            const maxAC = 1023;\n            const clampedCoef = Math.max(-maxAC, Math.min(maxAC, coef));\n            const absCoef = Math.abs(clampedCoef);\n            const size = Math.floor(Math.log2(absCoef)) + 1;\n            const symbol = zeroCount << 4 | size;\n            bitWriter.writeBits(huffTable.codes[symbol], huffTable.sizes[symbol]);\n            const magnitude = clampedCoef < 0 ? clampedCoef + (1 << size) - 1 : clampedCoef;\n            bitWriter.writeBits(magnitude, size);\n            zeroCount = 0;\n          }\n        }\n        if (zeroCount > 0) {\n          bitWriter.writeBits(huffTable.codes[0], huffTable.sizes[0]);\n        }\n      }\n      /**\n       * Encode JPG from pre-quantized DCT coefficients\n       * Skips DCT and quantization - uses provided coefficients directly\n       * Useful for steganography where coefficients are modified and re-encoded\n       * @param coeffs JPG quantized coefficients\n       * @param _options Optional encoding options (currently unused)\n       * @returns Encoded JPG bytes\n       */\n      encodeFromCoefficients(coeffs, _options) {\n        const output = [];\n        const { width, height, components, quantizationTables, isProgressive } = coeffs;\n        output.push(255, 216);\n        this.writeAPP0(output, 72, 72);\n        this.writeDQTFromCoeffs(output, quantizationTables);\n        if (isProgressive) {\n          this.writeSOF2FromCoeffs(output, width, height, components);\n        } else {\n          this.writeSOF0FromCoeffs(output, width, height, components);\n        }\n        this.writeDHT(output);\n        if (isProgressive) {\n          this.encodeProgressiveFromCoeffs(output, coeffs);\n          output.push(255, 217);\n          return new Uint8Array(output);\n        }\n        this.writeSOS(output);\n        const scanData = this.encodeScanFromCoeffs(coeffs);\n        const result = new Uint8Array(output.length + scanData.length + 2);\n        result.set(output, 0);\n        result.set(scanData, output.length);\n        result[result.length - 2] = 255;\n        result[result.length - 1] = 217;\n        return result;\n      }\n      writeDQTFromCoeffs(output, quantizationTables) {\n        for (let tableId = 0; tableId < quantizationTables.length; tableId++) {\n          const table = quantizationTables[tableId];\n          if (!table) continue;\n          output.push(255, 219);\n          output.push(0, 67);\n          output.push(tableId);\n          for (let i = 0; i < 64; i++) {\n            output.push(table[ZIGZAG[i]] ?? 1);\n          }\n        }\n      }\n      writeSOF0FromCoeffs(output, width, height, components) {\n        const numComponents = components.length;\n        const length = 8 + numComponents * 3;\n        output.push(255, 192);\n        output.push(length >> 8 & 255, length & 255);\n        output.push(8);\n        output.push(height >> 8 & 255, height & 255);\n        output.push(width >> 8 & 255, width & 255);\n        output.push(numComponents);\n        for (const comp of components) {\n          output.push(comp.id);\n          output.push(comp.h << 4 | comp.v);\n          output.push(comp.qTable);\n        }\n      }\n      writeSOF2FromCoeffs(output, width, height, components) {\n        const numComponents = components.length;\n        const length = 8 + numComponents * 3;\n        output.push(255, 194);\n        output.push(length >> 8 & 255, length & 255);\n        output.push(8);\n        output.push(height >> 8 & 255, height & 255);\n        output.push(width >> 8 & 255, width & 255);\n        output.push(numComponents);\n        for (const comp of components) {\n          output.push(comp.id);\n          output.push(comp.h << 4 | comp.v);\n          output.push(comp.qTable);\n        }\n      }\n      encodeScanFromCoeffs(coeffs) {\n        const bitWriter = new BitWriter();\n        const { components } = coeffs;\n        const dcPreds = /* @__PURE__ */ new Map();\n        for (const comp of components) {\n          dcPreds.set(comp.id, 0);\n        }\n        const mcuHeight = coeffs.mcuHeight;\n        const mcuWidth = coeffs.mcuWidth;\n        for (let mcuY = 0; mcuY < mcuHeight; mcuY++) {\n          for (let mcuX = 0; mcuX < mcuWidth; mcuX++) {\n            for (const comp of components) {\n              for (let v = 0; v < comp.v; v++) {\n                for (let h = 0; h < comp.h; h++) {\n                  const blockY = mcuY * comp.v + v;\n                  const blockX = mcuX * comp.h + h;\n                  if (blockY < comp.blocks.length && blockX < comp.blocks[0].length) {\n                    const block = comp.blocks[blockY][blockX];\n                    const prevDC = dcPreds.get(comp.id) ?? 0;\n                    const dcHuffman = comp.id === 1 ? this.dcLuminanceHuffman : this.dcChrominanceHuffman;\n                    const acHuffman = comp.id === 1 ? this.acLuminanceHuffman : this.acChrominanceHuffman;\n                    const dc = block[0];\n                    const dcDiff = dc - prevDC;\n                    this.encodeDC(dcDiff, dcHuffman, bitWriter);\n                    dcPreds.set(comp.id, dc);\n                    this.encodeACFromCoeffs(block, acHuffman, bitWriter);\n                  }\n                }\n              }\n            }\n          }\n        }\n        bitWriter.flush();\n        return bitWriter.getBytes();\n      }\n      encodeACFromCoeffs(block, huffTable, bitWriter) {\n        let zeroCount = 0;\n        for (let i = 1; i < 64; i++) {\n          const coef = block[ZIGZAG[i]];\n          if (coef === 0) {\n            zeroCount++;\n          } else {\n            while (zeroCount >= 16) {\n              bitWriter.writeBits(huffTable.codes[240], huffTable.sizes[240]);\n              zeroCount -= 16;\n            }\n            const maxAC = 1023;\n            const clampedCoef = Math.max(-maxAC, Math.min(maxAC, coef));\n            const absCoef = Math.abs(clampedCoef);\n            const size = Math.floor(Math.log2(absCoef)) + 1;\n            const symbol = zeroCount << 4 | size;\n            bitWriter.writeBits(huffTable.codes[symbol], huffTable.sizes[symbol]);\n            const magnitude = clampedCoef < 0 ? clampedCoef + (1 << size) - 1 : clampedCoef;\n            bitWriter.writeBits(magnitude, size);\n            zeroCount = 0;\n          }\n        }\n        if (zeroCount > 0) {\n          bitWriter.writeBits(huffTable.codes[0], huffTable.sizes[0]);\n        }\n      }\n      encodeProgressiveFromCoeffs(output, coeffs) {\n        const { components } = coeffs;\n        const componentBlocks = /* @__PURE__ */ new Map();\n        for (const comp of components) {\n          const blocks = [];\n          for (const row of comp.blocks) {\n            for (const block of row) {\n              blocks.push(block);\n            }\n          }\n          componentBlocks.set(comp.id, blocks);\n        }\n        this.writeProgressiveSOS(output, components.map((c) => c.id), 0, 0, 0, 0);\n        const dcScanData = this.encodeProgressiveDCScanFromCoeffs(componentBlocks, components);\n        for (let i = 0; i < dcScanData.length; i++) {\n          output.push(dcScanData[i]);\n        }\n        for (const comp of components) {\n          this.writeProgressiveSOS(output, [\n            comp.id\n          ], 1, 63, 0, 0);\n          const blocks = componentBlocks.get(comp.id) ?? [];\n          const acHuffman = comp.id === 1 ? this.acLuminanceHuffman : this.acChrominanceHuffman;\n          const acScanData = this.encodeProgressiveACScanFromCoeffs(blocks, acHuffman);\n          for (let i = 0; i < acScanData.length; i++) {\n            output.push(acScanData[i]);\n          }\n        }\n      }\n      encodeProgressiveDCScanFromCoeffs(componentBlocks, components) {\n        const bitWriter = new BitWriter();\n        const dcPreds = /* @__PURE__ */ new Map();\n        for (const comp of components) {\n          dcPreds.set(comp.id, 0);\n        }\n        const numBlocks = componentBlocks.get(components[0].id)?.length ?? 0;\n        for (let i = 0; i < numBlocks; i++) {\n          for (const comp of components) {\n            const blocks = componentBlocks.get(comp.id);\n            if (!blocks || i >= blocks.length) continue;\n            const block = blocks[i];\n            const dc = block[0];\n            const prevDC = dcPreds.get(comp.id) ?? 0;\n            const dcHuffman = comp.id === 1 ? this.dcLuminanceHuffman : this.dcChrominanceHuffman;\n            this.encodeOnlyDC(dc, prevDC, dcHuffman, bitWriter);\n            dcPreds.set(comp.id, dc);\n          }\n        }\n        bitWriter.flush();\n        return bitWriter.getBytes();\n      }\n      encodeProgressiveACScanFromCoeffs(blocks, acHuffman) {\n        const bitWriter = new BitWriter();\n        for (const block of blocks) {\n          this.encodeOnlyACFromCoeffs(block, acHuffman, bitWriter);\n        }\n        bitWriter.flush();\n        return bitWriter.getBytes();\n      }\n      encodeOnlyACFromCoeffs(block, acTable, bitWriter) {\n        let zeroCount = 0;\n        for (let i = 1; i < 64; i++) {\n          const coef = block[ZIGZAG[i]];\n          const clampedCoef = Math.max(-1023, Math.min(1023, coef));\n          if (clampedCoef === 0) {\n            zeroCount++;\n            if (zeroCount === 16) {\n              bitWriter.writeBits(acTable.codes[240], acTable.sizes[240]);\n              zeroCount = 0;\n            }\n          } else {\n            while (zeroCount >= 16) {\n              bitWriter.writeBits(acTable.codes[240], acTable.sizes[240]);\n              zeroCount -= 16;\n            }\n            const absCoef = Math.abs(clampedCoef);\n            const size = Math.floor(Math.log2(absCoef)) + 1;\n            const symbol = zeroCount << 4 | size;\n            bitWriter.writeBits(acTable.codes[symbol], acTable.sizes[symbol]);\n            const magnitude = clampedCoef < 0 ? clampedCoef + (1 << size) - 1 : clampedCoef;\n            bitWriter.writeBits(magnitude, size);\n            zeroCount = 0;\n          }\n        }\n        if (zeroCount > 0) {\n          bitWriter.writeBits(acTable.codes[0], acTable.sizes[0]);\n        }\n      }\n    };\n  }\n});\n\n// node_modules/.pnpm/@jsr+cross__image@0.4.3/node_modules/@jsr/cross__image/src/utils/jpg_decoder.js\nvar jpg_decoder_exports = {};\n__export(jpg_decoder_exports, {\n  JPGDecoder: () => JPGDecoder\n});\nvar EndOfScanError, EOI, SOS, DQT, DHT, SOF0, SOF2, DRI, ZIGZAG2, JPGDecoder;\nvar init_jpg_decoder = __esm({\n  \"node_modules/.pnpm/@jsr+cross__image@0.4.3/node_modules/@jsr/cross__image/src/utils/jpg_decoder.js\"() {\n    EndOfScanError = class extends Error {\n      constructor(message = \"End of scan marker detected\") {\n        super(message);\n        this.name = \"EndOfScanError\";\n      }\n    };\n    EOI = 65497;\n    SOS = 65498;\n    DQT = 65499;\n    DHT = 65476;\n    SOF0 = 65472;\n    SOF2 = 65474;\n    DRI = 65501;\n    ZIGZAG2 = [\n      0,\n      1,\n      8,\n      16,\n      9,\n      2,\n      3,\n      10,\n      17,\n      24,\n      32,\n      25,\n      18,\n      11,\n      4,\n      5,\n      12,\n      19,\n      26,\n      33,\n      40,\n      48,\n      41,\n      34,\n      27,\n      20,\n      13,\n      6,\n      7,\n      14,\n      21,\n      28,\n      35,\n      42,\n      49,\n      56,\n      57,\n      50,\n      43,\n      36,\n      29,\n      22,\n      15,\n      23,\n      30,\n      37,\n      44,\n      51,\n      58,\n      59,\n      52,\n      45,\n      38,\n      31,\n      39,\n      46,\n      53,\n      60,\n      61,\n      54,\n      47,\n      55,\n      62,\n      63\n    ];\n    JPGDecoder = class {\n      data;\n      pos = 0;\n      width = 0;\n      height = 0;\n      components = [];\n      qTables = [];\n      dcTables = [];\n      acTables = [];\n      restartInterval = 0;\n      bitBuffer = 0;\n      bitCount = 0;\n      options;\n      isProgressive = false;\n      // Progressive JPG scan parameters\n      spectralStart = 0;\n      spectralEnd = 63;\n      successiveHigh = 0;\n      successiveLow = 0;\n      scanComponentIds = [];\n      eobRun = 0;\n      // Storage for quantized coefficients (when extractCoefficients is true)\n      quantizedCoefficients = null;\n      constructor(data, settings = {}) {\n        this.data = data;\n        this.options = {\n          tolerantDecoding: settings.tolerantDecoding ?? true,\n          onWarning: settings.onWarning,\n          extractCoefficients: settings.extractCoefficients ?? false\n        };\n      }\n      decode() {\n        if (this.data.length < 2 || this.data[0] !== 255 || this.data[1] !== 216) {\n          throw new Error(\"Invalid JPG signature\");\n        }\n        this.pos = 2;\n        while (this.pos < this.data.length) {\n          const marker = this.readMarker();\n          if (marker === EOI) {\n            break;\n          } else if (marker === SOS) {\n            this.parseSOS();\n            this.decodeScan();\n            if (!this.isProgressive) {\n              break;\n            }\n          } else if (marker === DQT) {\n            this.parseDQT();\n          } else if (marker === DHT) {\n            this.parseDHT();\n          } else if (marker === SOF0 || marker === SOF2) {\n            this.parseSOF();\n            this.isProgressive = marker === SOF2;\n          } else if (marker === DRI) {\n            this.parseDRI();\n          } else if (marker >= 65504 && marker <= 65519) {\n            this.skipSegment();\n          } else if (marker >= 65472 && marker <= 65487) {\n            if (marker !== 65476 && marker !== 65480 && marker !== 65484) {\n              throw new Error(`Unsupported JPG type: marker 0x${marker.toString(16)}`);\n            }\n          } else {\n            if (this.pos < this.data.length) {\n              this.skipSegment();\n            }\n          }\n        }\n        if (this.width === 0 || this.height === 0) {\n          throw new Error(\"Failed to decode JPG: invalid dimensions\");\n        }\n        if (this.isProgressive && !this.options.extractCoefficients) {\n          for (const component of this.components) {\n            if (component.blocks) {\n              for (const row of component.blocks) {\n                for (const block of row) {\n                  this.idct(block);\n                }\n              }\n            }\n          }\n        }\n        if (this.options.extractCoefficients) {\n          this.storeQuantizedCoefficients();\n        }\n        return this.convertToRGB();\n      }\n      /**\n       * Get the quantized DCT coefficients after decoding\n       * Only available if extractCoefficients option was set to true\n       * @returns JPGQuantizedCoefficients or undefined if not available\n       */\n      getQuantizedCoefficients() {\n        return this.quantizedCoefficients ?? void 0;\n      }\n      /**\n       * Store quantized coefficients in the output structure\n       * Called after decoding when extractCoefficients is true\n       */\n      storeQuantizedCoefficients() {\n        const maxH = Math.max(...this.components.map((c) => c.h));\n        const maxV = Math.max(...this.components.map((c) => c.v));\n        const mcuWidth = Math.ceil(this.width / (8 * maxH));\n        const mcuHeight = Math.ceil(this.height / (8 * maxV));\n        const componentCoeffs = this.components.map((comp) => ({\n          id: comp.id,\n          h: comp.h,\n          v: comp.v,\n          qTable: comp.qTable,\n          blocks: comp.blocks.map((row) => row.map((block) => {\n            if (block instanceof Int32Array) {\n              return block;\n            }\n            return new Int32Array(block);\n          }))\n        }));\n        const qTables = this.qTables.map((table) => {\n          if (table instanceof Uint8Array) {\n            return new Uint8Array(table);\n          }\n          return new Uint8Array(table);\n        });\n        this.quantizedCoefficients = {\n          format: \"jpg\",\n          width: this.width,\n          height: this.height,\n          isProgressive: this.isProgressive,\n          components: componentCoeffs,\n          quantizationTables: qTables,\n          mcuWidth,\n          mcuHeight\n        };\n      }\n      readMarker() {\n        while (this.pos < this.data.length && this.data[this.pos] !== 255) {\n          this.pos++;\n        }\n        if (this.pos >= this.data.length - 1) {\n          return EOI;\n        }\n        const byte1 = this.data[this.pos++];\n        let byte2 = this.data[this.pos++];\n        while (byte2 === 255 && this.pos < this.data.length) {\n          byte2 = this.data[this.pos++];\n        }\n        return byte1 << 8 | byte2;\n      }\n      readUint16() {\n        const value = this.data[this.pos] << 8 | this.data[this.pos + 1];\n        this.pos += 2;\n        return value;\n      }\n      skipSegment() {\n        const length = this.readUint16();\n        this.pos += length - 2;\n      }\n      parseDQT() {\n        let length = this.readUint16() - 2;\n        while (length > 0) {\n          const info = this.data[this.pos++];\n          const tableId = info & 15;\n          const precision = info >> 4 & 15;\n          if (precision !== 0) {\n            throw new Error(\"16-bit quantization tables not supported\");\n          }\n          const table = new Uint8Array(64);\n          for (let i = 0; i < 64; i++) {\n            table[ZIGZAG2[i]] = this.data[this.pos++];\n          }\n          this.qTables[tableId] = table;\n          length -= 65;\n        }\n      }\n      parseDHT() {\n        let length = this.readUint16() - 2;\n        while (length > 0) {\n          const info = this.data[this.pos++];\n          const tableId = info & 15;\n          const tableClass = info >> 4 & 15;\n          const bits = new Uint8Array(16);\n          let numSymbols = 0;\n          for (let i = 0; i < 16; i++) {\n            bits[i] = this.data[this.pos++];\n            numSymbols += bits[i];\n          }\n          const huffVal = new Uint8Array(numSymbols);\n          for (let i = 0; i < numSymbols; i++) {\n            huffVal[i] = this.data[this.pos++];\n          }\n          const table = this.buildHuffmanTable(bits, huffVal);\n          if (tableClass === 0) {\n            this.dcTables[tableId] = table;\n          } else {\n            this.acTables[tableId] = table;\n          }\n          length -= 17 + numSymbols;\n        }\n      }\n      buildHuffmanTable(bits, huffVal) {\n        const maxCode = new Int32Array(16).fill(-1);\n        const minCode = new Int32Array(16).fill(-1);\n        const valPtr = new Int32Array(16).fill(-1);\n        const fastValues = new Int16Array(256).fill(-1);\n        const fastLengths = new Uint8Array(256);\n        let code = 0;\n        let valIndex = 0;\n        for (let i = 0; i < 16; i++) {\n          const codeLength = i + 1;\n          if (bits[i] > 0) {\n            minCode[i] = code;\n            valPtr[i] = valIndex;\n            for (let j = 0; j < bits[i]; j++) {\n              const symbol = huffVal[valIndex];\n              if (codeLength <= 8) {\n                const suffixBits = 8 - codeLength;\n                const start = code << suffixBits;\n                const count = 1 << suffixBits;\n                for (let suffix = 0; suffix < count; suffix++) {\n                  fastValues[start + suffix] = symbol;\n                  fastLengths[start + suffix] = codeLength;\n                }\n              }\n              code++;\n              valIndex++;\n            }\n            maxCode[i] = code - 1;\n          }\n          code <<= 1;\n        }\n        return {\n          fastValues,\n          fastLengths,\n          maxCode,\n          minCode,\n          valPtr,\n          huffVal\n        };\n      }\n      parseSOF() {\n        const _length = this.readUint16();\n        const precision = this.data[this.pos++];\n        if (precision !== 8) {\n          throw new Error(`Unsupported precision: ${precision}`);\n        }\n        this.height = this.readUint16();\n        this.width = this.readUint16();\n        const numComponents = this.data[this.pos++];\n        if (numComponents !== 1 && numComponents !== 3) {\n          throw new Error(`Unsupported number of components: ${numComponents}`);\n        }\n        this.components = [];\n        for (let i = 0; i < numComponents; i++) {\n          const id = this.data[this.pos++];\n          const samplingFactor = this.data[this.pos++];\n          const qTable = this.data[this.pos++];\n          this.components.push({\n            id,\n            h: samplingFactor >> 4 & 15,\n            v: samplingFactor & 15,\n            qTable,\n            dcTable: 0,\n            acTable: 0,\n            pred: 0,\n            blocks: []\n          });\n        }\n      }\n      parseSOS() {\n        const _length = this.readUint16();\n        const numComponents = this.data[this.pos++];\n        this.scanComponentIds = [];\n        for (let i = 0; i < numComponents; i++) {\n          const id = this.data[this.pos++];\n          const tables = this.data[this.pos++];\n          this.scanComponentIds.push(id);\n          const component = this.components.find((c) => c.id === id);\n          if (component) {\n            component.dcTable = tables >> 4 & 15;\n            component.acTable = tables & 15;\n          }\n        }\n        this.spectralStart = this.data[this.pos++];\n        this.spectralEnd = this.data[this.pos++];\n        const successiveApprox = this.data[this.pos++];\n        this.successiveHigh = successiveApprox >> 4 & 15;\n        this.successiveLow = successiveApprox & 15;\n      }\n      parseDRI() {\n        const _length = this.readUint16();\n        this.restartInterval = this.readUint16();\n      }\n      decodeScan() {\n        const maxH = Math.max(...this.components.map((c) => c.h));\n        const maxV = Math.max(...this.components.map((c) => c.v));\n        const mcuWidth = Math.ceil(this.width / (8 * maxH));\n        const mcuHeight = Math.ceil(this.height / (8 * maxV));\n        this.bitBuffer = 0;\n        this.bitCount = 0;\n        this.eobRun = 0;\n        for (const component of this.components) {\n          component.pred = 0;\n        }\n        for (const component of this.components) {\n          const blocksAcross = mcuWidth * component.h;\n          const blocksDown = mcuHeight * component.v;\n          if (!component.blocks || component.blocks.length === 0) {\n            component.blocks = Array(blocksDown).fill(null).map(() => Array(blocksAcross).fill(null).map(() => new Int32Array(64)));\n          }\n        }\n        if (this.scanComponentIds.length === 1) {\n          const componentId = this.scanComponentIds[0];\n          const component = this.components.find((c) => c.id === componentId);\n          if (!component) return;\n          const blocksAcross = mcuWidth * component.h;\n          const blocksDown = mcuHeight * component.v;\n          for (let blockY = 0; blockY < blocksDown; blockY++) {\n            for (let blockX = 0; blockX < blocksAcross; blockX++) {\n              if (blockY >= component.blocks.length || blockX >= component.blocks[0].length) {\n                continue;\n              }\n              if (this.options.tolerantDecoding) {\n                try {\n                  this.decodeBlock(component, blockY, blockX);\n                } catch (e) {\n                  if (e instanceof EndOfScanError) {\n                    return;\n                  }\n                }\n              } else {\n                try {\n                  this.decodeBlock(component, blockY, blockX);\n                } catch (e) {\n                  if (e instanceof EndOfScanError) {\n                    return;\n                  }\n                  throw e;\n                }\n              }\n            }\n          }\n          return;\n        }\n        outerLoop: for (let mcuY = 0; mcuY < mcuHeight; mcuY++) {\n          for (let mcuX = 0; mcuX < mcuWidth; mcuX++) {\n            for (const component of this.components) {\n              if (this.scanComponentIds.length > 0 && !this.scanComponentIds.includes(component.id)) {\n                continue;\n              }\n              for (let v = 0; v < component.v; v++) {\n                for (let h = 0; h < component.h; h++) {\n                  const blockY = mcuY * component.v + v;\n                  const blockX = mcuX * component.h + h;\n                  if (blockY < component.blocks.length && blockX < component.blocks[0].length) {\n                    if (this.options.tolerantDecoding) {\n                      try {\n                        this.decodeBlock(component, blockY, blockX);\n                      } catch (e) {\n                        if (e instanceof EndOfScanError) {\n                          break outerLoop;\n                        }\n                      }\n                    } else {\n                      try {\n                        this.decodeBlock(component, blockY, blockX);\n                      } catch (e) {\n                        if (e instanceof EndOfScanError) {\n                          break outerLoop;\n                        }\n                        throw e;\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      decodeBlock(component, blockY, blockX) {\n        const block = component.blocks[blockY][blockX];\n        const isACScan = this.spectralEnd > 0 && this.spectralStart > 0;\n        const isACRefinementScan = isACScan && this.successiveHigh > 0;\n        if (isACScan && !isACRefinementScan && this.eobRun > 0) {\n          this.eobRun--;\n          return;\n        }\n        if (this.spectralStart === 0) {\n          const dcTable = this.dcTables[component.dcTable];\n          if (!dcTable) {\n            throw new Error(`Missing DC table ${component.dcTable}`);\n          }\n          if (this.successiveHigh === 0) {\n            const dcLen = this.decodeHuffman(dcTable);\n            const dcDiff = dcLen > 0 ? this.receiveBits(dcLen) : 0;\n            component.pred += dcDiff;\n            const coeff = component.pred << this.successiveLow;\n            if (this.options.extractCoefficients) {\n              block[0] = coeff;\n            } else {\n              block[0] = coeff * this.qTables[component.qTable][0];\n            }\n          } else {\n            const bit = this.readBit();\n            if (bit) {\n              const refinement = 1 << this.successiveLow;\n              if (this.options.extractCoefficients) {\n                block[0] += refinement;\n              } else {\n                block[0] += refinement * this.qTables[component.qTable][0];\n              }\n            }\n          }\n        }\n        if (this.spectralEnd > 0) {\n          const acTable = this.acTables[component.acTable];\n          if (!acTable) {\n            throw new Error(`Missing AC table ${component.acTable}`);\n          }\n          if (this.successiveHigh === 0) {\n            let k = this.spectralStart === 0 ? 1 : this.spectralStart;\n            while (k <= this.spectralEnd && k < 64) {\n              const rs = this.decodeHuffman(acTable);\n              const r = rs >> 4 & 15;\n              const s = rs & 15;\n              if (s === 0) {\n                if (r === 15) {\n                  k += 16;\n                } else {\n                  if (this.isProgressive && r > 0) {\n                    const additionalBits = this.receiveUnsignedBits(r);\n                    this.eobRun = (1 << r) - 1 + additionalBits;\n                  }\n                  break;\n                }\n              } else {\n                k += r;\n                if (k > this.spectralEnd) break;\n                const coeff = this.receiveBits(s) << this.successiveLow;\n                if (this.options.extractCoefficients) {\n                  block[ZIGZAG2[k]] = coeff;\n                } else {\n                  block[ZIGZAG2[k]] = coeff * this.qTables[component.qTable][ZIGZAG2[k]];\n                }\n                k++;\n              }\n            }\n          } else {\n            const qTable = this.qTables[component.qTable];\n            const hadEobRunAtStart = this.eobRun > 0;\n            let successiveACState = hadEobRunAtStart ? 4 : 0;\n            let successiveACNextValue = 0;\n            let runLength = 0;\n            let kk = this.spectralStart === 0 ? 1 : this.spectralStart;\n            while (kk <= this.spectralEnd && kk < 64) {\n              const z = ZIGZAG2[kk];\n              const current = block[z];\n              const direction = current < 0 ? -1 : 1;\n              switch (successiveACState) {\n                case 0: {\n                  const rs = this.decodeHuffman(acTable);\n                  const realR = rs >> 4 & 15;\n                  const realS = rs & 15;\n                  if (realS === 0) {\n                    if (realR < 15) {\n                      const additionalBits = this.receiveUnsignedBits(realR);\n                      this.eobRun = (1 << realR) - 1 + additionalBits;\n                      successiveACState = 4;\n                    } else {\n                      runLength = 16;\n                      successiveACState = 1;\n                    }\n                  } else {\n                    if (realS !== 1) {\n                      throw new Error(\"Invalid AC refinement size\");\n                    }\n                    successiveACNextValue = this.receiveBits(realS);\n                    runLength = realR;\n                    successiveACState = realR ? 2 : 3;\n                  }\n                  continue;\n                }\n                case 1:\n                case 2:\n                  if (current !== 0) {\n                    const bit = this.readBit();\n                    if (bit) {\n                      const refinement = this.options.extractCoefficients ? 1 << this.successiveLow : (1 << this.successiveLow) * qTable[z];\n                      block[z] += direction * refinement;\n                    }\n                  } else {\n                    runLength--;\n                    if (runLength === 0) {\n                      successiveACState = successiveACState === 2 ? 3 : 0;\n                    }\n                  }\n                  break;\n                case 3:\n                  if (current !== 0) {\n                    const bit = this.readBit();\n                    if (bit) {\n                      const refinement = this.options.extractCoefficients ? 1 << this.successiveLow : (1 << this.successiveLow) * qTable[z];\n                      block[z] += direction * refinement;\n                    }\n                  } else {\n                    const newCoeff = successiveACNextValue << this.successiveLow;\n                    block[z] = this.options.extractCoefficients ? newCoeff : newCoeff * qTable[z];\n                    successiveACState = 0;\n                  }\n                  break;\n                case 4:\n                  if (current !== 0) {\n                    const bit = this.readBit();\n                    if (bit) {\n                      const refinement = this.options.extractCoefficients ? 1 << this.successiveLow : (1 << this.successiveLow) * qTable[z];\n                      block[z] += direction * refinement;\n                    }\n                  }\n                  break;\n              }\n              kk++;\n            }\n            if (successiveACState === 4 && hadEobRunAtStart && this.eobRun > 0) {\n              this.eobRun--;\n            }\n          }\n        }\n        if (!this.isProgressive && !this.options.extractCoefficients) {\n          this.idct(block);\n        }\n      }\n      decodeHuffman(table) {\n        const savedPos = this.pos;\n        const savedBuffer = this.bitBuffer;\n        const savedCount = this.bitCount;\n        if (this.ensureBits(8, true)) {\n          const prefix = this.bitBuffer >>> (this.bitCount - 8) & 255;\n          const fastLength = table.fastLengths[prefix];\n          if (fastLength > 0) {\n            this.bitCount -= fastLength;\n            return table.fastValues[prefix];\n          }\n        }\n        this.pos = savedPos;\n        this.bitBuffer = savedBuffer;\n        this.bitCount = savedCount;\n        let code = 0;\n        for (let len = 0; len < 16; len++) {\n          code = code << 1 | this.readBit();\n          if (table.minCode[len] !== -1 && code <= table.maxCode[len]) {\n            const index = table.valPtr[len] + (code - table.minCode[len]);\n            if (index >= 0 && index < table.huffVal.length) {\n              return table.huffVal[index];\n            } else {\n              throw new Error(`Huffman table index out of bounds: ${index} (table size: ${table.huffVal.length})`);\n            }\n          }\n        }\n        throw new Error(\"Invalid Huffman code\");\n      }\n      readEntropyByte(speculative = false) {\n        if (this.pos >= this.data.length) {\n          if (speculative) return -1;\n          throw new Error(\"Unexpected end of JPG data\");\n        }\n        const markerPos = this.pos;\n        const byte = this.data[this.pos++];\n        if (byte !== 255) {return byte;}\n        if (this.pos >= this.data.length) {\n          this.pos = markerPos;\n          if (speculative) return -1;\n          throw new Error(\"Unexpected end of JPG data after 0xFF\");\n        }\n        const nextByte = this.data[this.pos];\n        if (nextByte === 0) {\n          this.pos++;\n          return 255;\n        }\n        if (speculative) {\n          this.pos = markerPos;\n          return -1;\n        }\n        if (nextByte >= 208 && nextByte <= 215) {\n          this.pos++;\n          for (const component of this.components) {component.pred = 0;}\n          this.eobRun = 0;\n          this.bitBuffer = 0;\n          this.bitCount = 0;\n          return this.readEntropyByte(false);\n        }\n        this.pos = markerPos;\n        throw new EndOfScanError();\n      }\n      ensureBits(n, speculative = false) {\n        while (this.bitCount < n) {\n          const byte = this.readEntropyByte(speculative);\n          if (byte < 0) {return false;}\n          this.bitBuffer = this.bitBuffer << 8 | byte;\n          this.bitCount += 8;\n        }\n        return true;\n      }\n      readBit() {\n        this.ensureBits(1, false);\n        this.bitCount--;\n        return this.bitBuffer >>> this.bitCount & 1;\n      }\n      receiveBits(n) {\n        const value = this.receiveUnsignedBits(n);\n        return value < 1 << n - 1 ? value - (1 << n) + 1 : value;\n      }\n      receiveUnsignedBits(n) {\n        if (n < 0 || n > 16) {\n          throw new Error(`Invalid bit count: ${n} (must be 0-16)`);\n        }\n        if (n === 0) return 0;\n        this.ensureBits(n, false);\n        this.bitCount -= n;\n        return this.bitBuffer >>> this.bitCount & (1 << n) - 1;\n      }\n      idct(block) {\n        const temp = new Float32Array(64);\n        for (let i = 0; i < 8; i++) {\n          const offset2 = i * 8;\n          for (let j = 0; j < 8; j++) {\n            let sum = 0;\n            for (let k = 0; k < 8; k++) {\n              const c = k === 0 ? 1 / Math.sqrt(2) : 1;\n              sum += c * block[offset2 + k] * Math.cos((2 * j + 1) * k * Math.PI / 16);\n            }\n            temp[offset2 + j] = sum / 2;\n          }\n        }\n        for (let j = 0; j < 8; j++) {\n          for (let i = 0; i < 8; i++) {\n            let sum = 0;\n            for (let k = 0; k < 8; k++) {\n              const c = k === 0 ? 1 / Math.sqrt(2) : 1;\n              sum += c * temp[k * 8 + j] * Math.cos((2 * i + 1) * k * Math.PI / 16);\n            }\n            block[i * 8 + j] = Math.max(0, Math.min(255, Math.round(sum / 2 + 128)));\n          }\n        }\n      }\n      convertToRGB() {\n        const rgba = new Uint8Array(this.width * this.height * 4);\n        if (this.components.length === 1) {\n          const y = this.components[0];\n          for (let row = 0; row < this.height; row++) {\n            for (let col = 0; col < this.width; col++) {\n              const blockRow = Math.floor(row / 8);\n              const blockCol = Math.floor(col / 8);\n              const blockY = row % 8;\n              const blockX = col % 8;\n              if (blockRow < y.blocks.length && blockCol < y.blocks[0].length) {\n                const value = y.blocks[blockRow][blockCol][blockY * 8 + blockX];\n                const offset2 = (row * this.width + col) * 4;\n                rgba[offset2] = value;\n                rgba[offset2 + 1] = value;\n                rgba[offset2 + 2] = value;\n                rgba[offset2 + 3] = 255;\n              }\n            }\n          }\n        } else {\n          const [y, cb, cr] = this.components;\n          const maxH = Math.max(...this.components.map((c) => c.h));\n          const maxV = Math.max(...this.components.map((c) => c.v));\n          for (let row = 0; row < this.height; row++) {\n            for (let col = 0; col < this.width; col++) {\n              const yRow = Math.floor(row * y.v / maxV);\n              const yCol = Math.floor(col * y.h / maxH);\n              const yBlockRow = Math.floor(yRow / 8);\n              const yBlockCol = Math.floor(yCol / 8);\n              const yBlockY = yRow % 8;\n              const yBlockX = yCol % 8;\n              let yVal = 0;\n              if (yBlockRow < y.blocks.length && yBlockCol < y.blocks[0].length) {\n                yVal = y.blocks[yBlockRow][yBlockCol][yBlockY * 8 + yBlockX];\n              }\n              const cbRow = Math.floor(row * cb.v / maxV);\n              const cbCol = Math.floor(col * cb.h / maxH);\n              const cbBlockRow = Math.floor(cbRow / 8);\n              const cbBlockCol = Math.floor(cbCol / 8);\n              const cbBlockY = cbRow % 8;\n              const cbBlockX = cbCol % 8;\n              let cbVal = 0;\n              if (cbBlockRow < cb.blocks.length && cbBlockCol < cb.blocks[0].length) {\n                cbVal = cb.blocks[cbBlockRow][cbBlockCol][cbBlockY * 8 + cbBlockX] - 128;\n              }\n              const crRow = Math.floor(row * cr.v / maxV);\n              const crCol = Math.floor(col * cr.h / maxH);\n              const crBlockRow = Math.floor(crRow / 8);\n              const crBlockCol = Math.floor(crCol / 8);\n              const crBlockY = crRow % 8;\n              const crBlockX = crCol % 8;\n              let crVal = 0;\n              if (crBlockRow < cr.blocks.length && crBlockCol < cr.blocks[0].length) {\n                crVal = cr.blocks[crBlockRow][crBlockCol][crBlockY * 8 + crBlockX] - 128;\n              }\n              const r = Math.max(0, Math.min(255, Math.round(yVal + 1.402 * crVal)));\n              const g = Math.max(0, Math.min(255, Math.round(yVal - 0.344136 * cbVal - 0.714136 * crVal)));\n              const b = Math.max(0, Math.min(255, Math.round(yVal + 1.772 * cbVal)));\n              const offset2 = (row * this.width + col) * 4;\n              rgba[offset2] = r;\n              rgba[offset2 + 1] = g;\n              rgba[offset2 + 2] = b;\n              rgba[offset2 + 3] = 255;\n            }\n          }\n        }\n        return rgba;\n      }\n    };\n  }\n});\n\ninit_security();\ninit_jpg_encoder();\ninit_jpg_decoder();\n\nfunction eldReorderCoefficients(source, map) {\n  const maxH = Math.max(...source.components.map((component) => component.h));\n  const maxV = Math.max(...source.components.map((component) => component.v));\n  const components = [];\n  for (const component of source.components) {\n    const blockPixelWidth = 8 * maxH / component.h;\n    const blockPixelHeight = 8 * maxV / component.v;\n    if (!Number.isInteger(blockPixelWidth) || !Number.isInteger(blockPixelHeight)) {\n      throw new RangeError(\"Unsupported non-integral JPG sampling factors.\");\n    }\n    const rowCount = component.blocks.length;\n    const columnCount = component.blocks[0]?.length ?? 0;\n    const target = Array.from({ length: rowCount }, () => Array(columnCount));\n    for (const rect of map) {\n      const values = [rect.inputX, rect.inputY, rect.outputX, rect.outputY, rect.width, rect.height];\n      if (!values.every(Number.isSafeInteger) || rect.width <= 0 || rect.height <= 0) {\n        throw new RangeError(\"Invalid NFBR rectangle.\");\n      }\n      if (\n        rect.inputX % blockPixelWidth !== 0 ||\n        rect.outputX % blockPixelWidth !== 0 ||\n        rect.width % blockPixelWidth !== 0 ||\n        rect.inputY % blockPixelHeight !== 0 ||\n        rect.outputY % blockPixelHeight !== 0 ||\n        rect.height % blockPixelHeight !== 0\n      ) {\n        throw new RangeError(\"The NFBR map is not aligned to the JPG coefficient grid.\");\n      }\n      const sourceColumn = rect.inputX / blockPixelWidth;\n      const sourceRow = rect.inputY / blockPixelHeight;\n      const targetColumn = rect.outputX / blockPixelWidth;\n      const targetRow = rect.outputY / blockPixelHeight;\n      const blockWidth = rect.width / blockPixelWidth;\n      const blockHeight = rect.height / blockPixelHeight;\n      for (let row = 0; row < blockHeight; row++) {\n        for (let column = 0; column < blockWidth; column++) {\n          const block = component.blocks[sourceRow + row]?.[sourceColumn + column];\n          const targetBlockRow = target[targetRow + row];\n          if (!block || !targetBlockRow || targetBlockRow[targetColumn + column]) {\n            throw new RangeError(\"The NFBR map is incompatible with the JPG coefficient grid.\");\n          }\n          targetBlockRow[targetColumn + column] = block;\n        }\n      }\n    }\n    const blocks = target.map((row, rowIndex) =>\n      row.map((block, columnIndex) => block ?? component.blocks[rowIndex]?.[columnIndex])\n    );\n    components.push({ ...component, blocks });\n  }\n  return {\n    ...source,\n    components,\n    quantizationTables: source.quantizationTables.map((table) => Uint8Array.from(table))\n  };\n}\n\nfunction eldCropCoefficients(source, width, height) {\n  if (!width || !height) return source;\n  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {\n    throw new RangeError(\"Crop dimensions must be positive integers.\");\n  }\n  if (width > source.width || height > source.height) {\n    throw new RangeError(\"A coefficient-domain crop cannot enlarge the image.\");\n  }\n  const maxH = Math.max(...source.components.map((component) => component.h));\n  const maxV = Math.max(...source.components.map((component) => component.v));\n  const mcuWidth = Math.ceil(width / (8 * maxH));\n  const mcuHeight = Math.ceil(height / (8 * maxV));\n  const components = source.components.map((component) => ({\n    ...component,\n    blocks: component.blocks\n      .slice(0, mcuHeight * component.v)\n      .map((row) => row.slice(0, mcuWidth * component.h))\n  }));\n  return { ...source, width, height, mcuWidth, mcuHeight, components };\n}\n\nself.onmessage = (event) => {\n  const message = event.data ?? {};\n  const id = message.id;\n  if (message.type !== \"process\") return;\n  try {\n    const timings = {\n      extractMs: 0,\n      reorderMs: 0,\n      cropMs: 0,\n      jpgEncodeMs: 0,\n      totalDctMs: 0\n    };\n    const totalStartedAt = performance.now();\n    const bytes = new Uint8Array(message.bytes);\n\n    let startedAt = performance.now();\n    const decoder = new JPGDecoder(bytes, {\n      tolerantDecoding: true,\n      extractCoefficients: true\n    });\n    decoder.decode();\n    let coefficients = decoder.getQuantizedCoefficients();\n    if (!coefficients) throw new Error(\"The source is not a supported DCT-based JPG.\");\n    timings.extractMs = performance.now() - startedAt;\n\n    startedAt = performance.now();\n    if (Array.isArray(message.map) && message.map.length) {\n      coefficients = eldReorderCoefficients(coefficients, message.map);\n    }\n    timings.reorderMs = performance.now() - startedAt;\n\n    startedAt = performance.now();\n    if (message.crop?.width && message.crop?.height) {\n      coefficients = eldCropCoefficients(coefficients, message.crop.width, message.crop.height);\n    }\n    timings.cropMs = performance.now() - startedAt;\n\n    startedAt = performance.now();\n    const encoder = new JPGEncoder({\n      progressive: coefficients.isProgressive\n    });\n    const resultBytes = encoder.encodeFromCoefficients(coefficients);\n    timings.jpgEncodeMs = performance.now() - startedAt;\n    timings.totalDctMs = performance.now() - totalStartedAt;\n\n    const buffer = resultBytes.buffer.slice(\n      resultBytes.byteOffset,\n      resultBytes.byteOffset + resultBytes.byteLength\n    );\n    self.postMessage({\n      id,\n      ok: true,\n      bytes: buffer,\n      width: coefficients.width,\n      height: coefficients.height,\n      sampling: coefficients.components.map((component) => `${component.h}x${component.v}`).join(\",\"),\n      timings\n    }, [buffer]);\n  } catch (error) {\n    self.postMessage({\n      id,\n      ok: false,\n      error: error instanceof Error ? error.message : String(error)\n    });\n  }\n};\n";
  var __eldDctWorker;
  var __eldDctWorkerUrl;
  var __eldDctWorkerSequence = 0;
  var __eldDctPending = new Map();

  function __eldDisposeDctWorker(reason = "DCT worker stopped.") {
    const worker = __eldDctWorker;
    __eldDctWorker = void 0;
    if (worker) {
      try { worker.terminate(); } catch { /* Intentionally ignored. */ }
    }
    for (const pending of __eldDctPending.values()) {
      try { pending.reject(new DOMException(reason, "AbortError")); } catch { /* Intentionally ignored. */ }
    }
    __eldDctPending.clear();
    if (__eldDctWorkerUrl) {
      try { URL.revokeObjectURL(__eldDctWorkerUrl); } catch { /* Intentionally ignored. */ }
      __eldDctWorkerUrl = void 0;
    }
  }

  function __eldEnsureDctWorker() {
    if (__eldDctWorker) {return __eldDctWorker;}
    if (typeof Worker !== "function") {throw new Error("当前浏览器环境不支持 DCT Worker。");}
    const blob = new Blob([__ELD_DCT_WORKER_SOURCE__], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    let worker;
    try {
      worker = new Worker(url);
    } catch (error) {
      URL.revokeObjectURL(url);
      throw new Error(`无法启动 DCT Worker：${error instanceof Error ? error.message : String(error)}`);
    }
    __eldDctWorkerUrl = url;
    __eldDctWorker = worker;
    worker.onmessage = (event) => {
      const message = event.data ?? {};
      const pending = __eldDctPending.get(message.id);
      if (!pending) {return;}
      __eldDctPending.delete(message.id);
      if (message.ok) {pending.resolve(message);}
      else {pending.reject(new CodecError(message.error || "DCT Worker 处理失败。"));}
    };
    worker.onerror = (event) => {
      const detail = event?.message || "DCT Worker 发生错误。";
      console.error("[EbookLosslessDownloader 0.5.0] DCT worker error", event);
      __eldDisposeDctWorker(detail);
    };
    return worker;
  }

  function __eldRunDctWorker(bytes, map, crop) {
    const worker = __eldEnsureDctWorker();
    const id = ++__eldDctWorkerSequence;
    const source = bytes instanceof Uint8Array ? bytes : Uint8Array.from(bytes);
    if (!isJpg(source) || !parseJpgSize(source)) {
      return Promise.reject(new CodecError("DCT 路径只接受结构完整、尺寸可读的 JPG。"));
    }
    const transfer = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    return new Promise((resolve, reject) => {
      __eldDctPending.set(id, { resolve, reject });
      try {
        worker.postMessage({
          type: "process",
          id,
          bytes: transfer,
          map: Array.isArray(map) ? map : null,
          crop: crop?.width && crop?.height ? { width: crop.width, height: crop.height } : null
        }, [transfer]);
      } catch (error) {
        __eldDctPending.delete(id);
        reject(error);
      }
    });
  }

  async function losslessReorderJpg(bytes, map, crop) {
    const result = await __eldRunDctWorker(bytes, map, crop);
    return {
      bytes: new Uint8Array(result.bytes),
      width: result.width,
      height: result.height,
      sampling: result.sampling,
      dctMilliseconds: result.timings?.totalDctMs ?? 0,
      dctTimings: result.timings ?? {}
    };
  }

  function losslessCropJpg(bytes, crop) {
    return losslessReorderJpg(bytes, null, crop);
  }

   // src/core/image-reorder/nfbr-advanced.ts
  var UINT32_RANGE2 = 4294967296;
  var UINT32_MAX = UINT32_RANGE2 - 1;
  var DEFAULT_STATE = 2463534242;
  var XOR_SHIFT_PARAMETERS = [
    [1, 3, 10],
    [1, 5, 16],
    [1, 5, 19],
    [1, 9, 29],
    [1, 11, 6],
    [1, 11, 16],
    [1, 19, 3],
    [1, 21, 20],
    [1, 27, 27],
    [2, 5, 15],
    [2, 5, 21],
    [2, 7, 7],
    [2, 7, 9],
    [2, 7, 25],
    [2, 9, 15],
    [2, 15, 17],
    [2, 15, 25],
    [2, 21, 9],
    [3, 1, 14],
    [3, 3, 26],
    [3, 3, 28],
    [3, 3, 29],
    [3, 5, 20],
    [3, 5, 22],
    [3, 5, 25],
    [3, 7, 29],
    [3, 13, 7],
    [3, 23, 25],
    [3, 25, 24],
    [3, 27, 11],
    [4, 3, 17],
    [4, 3, 27],
    [4, 5, 15],
    [5, 3, 21],
    [5, 7, 22],
    [5, 9, 7],
    [5, 9, 28],
    [5, 9, 31],
    [5, 13, 6],
    [5, 15, 17],
    [5, 17, 13],
    [5, 21, 12],
    [5, 27, 8],
    [5, 27, 21],
    [5, 27, 25],
    [5, 27, 28],
    [6, 1, 11],
    [6, 3, 17],
    [6, 17, 9],
    [6, 21, 7],
    [6, 21, 13],
    [7, 1, 9],
    [7, 1, 18],
    [7, 1, 25],
    [7, 13, 25],
    [7, 17, 21],
    [7, 25, 12],
    [7, 25, 20],
    [8, 7, 23],
    [8, 9, 23],
    [9, 5, 14],
    [9, 5, 25],
    [9, 11, 19],
    [9, 21, 16],
    [10, 9, 21],
    [10, 9, 25],
    [11, 7, 12],
    [11, 7, 16],
    [11, 17, 13],
    [11, 21, 13],
    [12, 9, 23],
    [13, 3, 17],
    [13, 3, 27],
    [13, 5, 19],
    [13, 17, 15],
    [14, 1, 15],
    [14, 13, 15],
    [15, 1, 29],
    [17, 15, 20],
    [17, 15, 23],
    [17, 15, 26]
  ];
  function validateAdvancedMap(map, width, height) {
    let area = 0;
    const inputOrigins = /* @__PURE__ */ new Set();
    const outputOrigins = /* @__PURE__ */ new Set();
    for (const rect of map) {
      if (rect.inputX < 0 || rect.inputY < 0 || rect.outputX < 0 || rect.outputY < 0 || rect.inputX + rect.width > width || rect.outputX + rect.width > width || rect.inputY + rect.height > height || rect.outputY + rect.height > height) {
        throw new RangeError("The generated advanced NFBR map contains an out-of-bounds rectangle.");
      }
      const inputKey = `${rect.inputX},${rect.inputY}`;
      const outputKey = `${rect.outputX},${rect.outputY}`;
      if (inputOrigins.has(inputKey) || outputOrigins.has(outputKey)) {
        throw new Error("The generated advanced NFBR map is not a one-to-one rectangle permutation.");
      }
      inputOrigins.add(inputKey);
      outputOrigins.add(outputKey);
      area += rect.width * rect.height;
    }
    if (area !== width * height) {throw new Error("The generated advanced NFBR map does not cover the complete image.");}
  }
  var NfbrRandom = class {
    state = DEFAULT_STATE;
    firstShift = XOR_SHIFT_PARAMETERS[0]?.[0] ?? 1;
    secondShift = XOR_SHIFT_PARAMETERS[0]?.[1] ?? 3;
    thirdShift = XOR_SHIFT_PARAMETERS[0]?.[2] ?? 10;
    algorithm = 0;
    configure(parameterIndex, algorithm) {
      const parameters = XOR_SHIFT_PARAMETERS[parameterIndex];
      if (!parameters || !Number.isInteger(algorithm) || algorithm < 0 || algorithm >= 6) {
        throw new RangeError("Invalid NFBR xorshift configuration.");
      }
      [this.firstShift, this.secondShift, this.thirdShift] = parameters;
      this.algorithm = algorithm;
      this.state = DEFAULT_STATE;
    }
    seed(value) {
      const unsigned = value >>> 0;
      this.state = unsigned === 0 ? DEFAULT_STATE : unsigned;
    }
    update() {
      let value = this.state;
      const first = this.firstShift;
      const second = this.secondShift;
      const third = this.thirdShift;
      switch (this.algorithm) {
        case 0:
          value ^= value << first;
          value ^= value >>> second;
          value ^= value << third;
          break;
        case 1:
          value ^= value << third;
          value ^= value >>> second;
          value ^= value << first;
          break;
        case 2:
          value ^= value >>> first;
          value ^= value << second;
          value ^= value >>> third;
          break;
        case 3:
          value ^= value >>> third;
          value ^= value << second;
          value ^= value >>> first;
          break;
        case 4:
          value ^= value << first;
          value ^= value << third;
          value ^= value >>> second;
          break;
        case 5:
          value ^= value >>> first;
          value ^= value >>> third;
          value ^= value << second;
          break;
      }
      this.state = value >>> 0;
      return this.state;
    }
    next(limit) {
      if (limit <= 1) {return 0;}
      let value;
      let remainder;
      do {
        value = this.update() - 1;
        remainder = value % limit;
      } while (UINT32_MAX - limit < value - remainder);
      return remainder;
    }
  };
  function shuffle(random, count) {
    const result = [];
    for (let index = 0; index < count; index++) {
      const other = random(index + 1);
      result[index] = result[other] ?? index;
      result[other] = index;
    }
    return result;
  }
  function chooseInsertion(random, count) {
    return count < 4 ? random(count + 1) : random(count - 1) + 1;
  }
  function chooseExcluding(random, excluded, count) {
    if (count === 0) {return 0;}
    const value = random(count);
    return value < excluded ? value : value + 1;
  }
  function fillCoupledSelections(random, horizontal, vertical, horizontalHead, verticalHead, width, height) {
    let remainingWidth = width;
    let remainingHeight = height;
    let headWidth = horizontalHead;
    let headHeight = verticalHead;
    let horizontalIndex = 0;
    let verticalIndex = 0;
    while (remainingWidth + remainingHeight > 0) {
      const choice = random(remainingWidth + remainingHeight);
      let start;
      let end;
      if (choice < remainingWidth) {
        if (choice < headWidth) {
          for (start = verticalIndex; start > 0 && !(horizontalIndex >= (horizontal[start - 1] ?? Number.NaN)); start--) {
            // Locate the nearest admissible boundary.
          }
          for (end = verticalIndex + remainingHeight; end < height && !(horizontalIndex >= (horizontal[end] ?? Number.NaN)); end++) {
            // Locate the nearest admissible boundary.
          }
          vertical[horizontalIndex] = random(end - start) + start;
          horizontalIndex++;
          headWidth--;
        } else {
          for (start = verticalIndex; start > 0 && !(horizontalIndex + remainingWidth <= (horizontal[start - 1] ?? Number.NaN)); start--) {
            // Locate the nearest admissible boundary.
          }
          for (end = verticalIndex + remainingHeight; end < height && !(horizontalIndex + remainingWidth <= (horizontal[end] ?? Number.NaN)); end++) {
            // Locate the nearest admissible boundary.
          }
          vertical[horizontalIndex + remainingWidth - 1] = random(end - start) + start;
        }
        remainingWidth--;
      } else {
        if (choice - remainingWidth < headHeight) {
          for (start = horizontalIndex; start > 0 && !(verticalIndex >= (vertical[start - 1] ?? Number.NaN)); start--) {
            // Locate the nearest admissible boundary.
          }
          for (end = horizontalIndex + remainingWidth; end < width && !(verticalIndex >= (vertical[end] ?? Number.NaN)); end++) {
            // Locate the nearest admissible boundary.
          }
          horizontal[verticalIndex] = random(end - start) + start;
          verticalIndex++;
          headHeight--;
        } else {
          for (start = horizontalIndex; start > 0 && !(verticalIndex + remainingHeight <= (vertical[start - 1] ?? Number.NaN)); start--) {
            // Locate the nearest admissible boundary.
          }
          for (end = horizontalIndex + remainingWidth; end < width && !(verticalIndex + remainingHeight <= (vertical[end] ?? Number.NaN)); end++) {
            // Locate the nearest admissible boundary.
          }
          horizontal[verticalIndex + remainingHeight - 1] = random(end - start) + start;
        }
        remainingHeight--;
      }
    }
  }
  function buildPairPermutation(width, height, cellPermutation, columnPermutation, rowPermutation, firstVerticalSelections, firstHorizontalSelections, secondHorizontalInsertion, secondVerticalInsertion, secondVerticalSelections, secondHorizontalSelections, firstHorizontalInsertion, firstVerticalInsertion) {
    const result = [];
    const wideWidth = width + 1;
    const wideHeight = height + 1;
    const doubledWidth = wideWidth << 1;
    const doubledHeight = wideHeight << 1;
    for (let column = 0; column < width; column++) {
      for (let row = 0; row < height; row++) {
        const value = cellPermutation[column + row * width] ?? 0;
        const mappedColumn = value % width;
        const mappedRow = (value - mappedColumn) / width;
        const outputColumn = column < (secondHorizontalSelections[row] ?? 0) ? column : column + wideWidth;
        const outputRow = row < (secondVerticalSelections[column] ?? 0) ? row : row + wideHeight;
        const inputColumn = mappedColumn < (firstHorizontalSelections[mappedRow] ?? 0) ? mappedColumn : mappedColumn + wideWidth;
        const inputRow = mappedRow < (firstVerticalSelections[mappedColumn] ?? 0) ? mappedRow : mappedRow + wideHeight;
        result.push(inputRow * doubledWidth + outputColumn, inputColumn * doubledHeight + outputRow);
      }
    }
    result.push(secondVerticalInsertion * doubledWidth + firstHorizontalInsertion);
    result.push(secondHorizontalInsertion * doubledHeight + firstVerticalInsertion);
    for (let column = 0; column < width; column++) {
      const outputRow = secondVerticalSelections[column] ?? 0;
      const mappedColumn = columnPermutation[column] ?? 0;
      const inputColumn = mappedColumn < secondHorizontalInsertion ? mappedColumn : mappedColumn + wideWidth;
      result.push(
        (firstVerticalSelections[mappedColumn] ?? 0) * doubledWidth + (column < firstHorizontalInsertion ? column : column + wideWidth),
        inputColumn * doubledHeight + outputRow
      );
    }
    for (let row = 0; row < height; row++) {
      const outputColumn = secondHorizontalSelections[row] ?? 0;
      const mappedRow = rowPermutation[row] ?? 0;
      const inputColumn = firstHorizontalSelections[mappedRow] ?? 0;
      const outputRow = row < firstVerticalInsertion ? row : row + wideHeight;
      result.push(
        (mappedRow < secondVerticalInsertion ? mappedRow : mappedRow + wideHeight) * doubledWidth + outputColumn
      );
      result.push(inputColumn * doubledHeight + outputRow);
    }
    return result;
  }
  function createPairPermutation(first, second, third, fourth) {
    const random = new NfbrRandom();
    const seed = second ^ third ^ fourth;
    const firstHigh = Math.floor(first / 65536);
    const secondHigh = Math.floor(second / 65536);
    const thirdHigh = Math.floor(third / 65536);
    const fourthHigh = Math.floor(fourth / 65536);
    let selector = secondHigh ^ thirdHigh ^ fourthHigh;
    let auxiliary = firstHigh ^ fourthHigh;
    let firstSeed = first ^ second;
    const secondSeed = first ^ third;
    const thirdSeed = first ^ fourth;
    const algorithm = (selector >>>= 16) % 6;
    const parameter = (selector - algorithm) / 6 % XOR_SHIFT_PARAMETERS.length;
    random.configure(parameter, algorithm);
    random.seed(seed);
    const random32 = random.next(65536) | random.next(65536) << 16;
    const width = secondHigh >>> 16;
    const height = thirdHigh >>> 16;
    firstSeed = (firstSeed ^ random32) >>> 0;
    const mixedSecondSeed = (secondSeed ^ random32) >>> 0;
    const mixedThirdSeed = (thirdSeed ^ random32) >>> 0;
    const nextAlgorithm = (auxiliary = auxiliary >>> 16 ^ random.next(512)) % 6;
    const nextParameter = (auxiliary - nextAlgorithm) / 6 % XOR_SHIFT_PARAMETERS.length;
    random.configure(nextParameter, nextAlgorithm);
    random.seed(firstSeed);
    const next = random.next.bind(random);
    const cellPermutation = shuffle(next, width * height);
    random.seed(mixedSecondSeed);
    const firstHorizontalInsertion = chooseInsertion(next, width);
    const firstVerticalInsertion = chooseInsertion(next, height);
    const secondHorizontal = chooseExcluding(next, firstHorizontalInsertion, width);
    const secondVertical = chooseExcluding(next, firstVerticalInsertion, height);
    random.seed(mixedThirdSeed);
    const firstHorizontalSelections = [];
    const firstVerticalSelections = [];
    fillCoupledSelections(
      next,
      firstHorizontalSelections,
      firstVerticalSelections,
      firstHorizontalInsertion,
      firstVerticalInsertion,
      width,
      height
    );
    const columnPermutation = shuffle(next, width);
    const rowPermutation = shuffle(next, height);
    const firstHorizontal = [];
    const firstVertical = [];
    fillCoupledSelections(next, firstHorizontal, firstVertical, secondHorizontal, secondVertical, width, height);
    return buildPairPermutation(
      width,
      height,
      cellPermutation,
      columnPermutation,
      rowPermutation,
      firstVertical,
      firstHorizontal,
      secondHorizontal,
      secondVertical,
      firstVerticalSelections,
      firstHorizontalSelections,
      firstHorizontalInsertion,
      firstVerticalInsertion
    );
  }
  function assertUint32(value, name) {
    if (!Number.isSafeInteger(value) || value < 0 || value > UINT32_MAX) {
      throw new RangeError(`${name} must be an unsigned 32-bit integer.`);
    }
  }
  function createNfbrAdvancedReorderMap(width, height, tileWidth, tileHeight, parameters) {
    assertUint32(parameters.v1p, "v1p");
    assertUint32(parameters.w6b, "w6b");
    assertUint32(parameters.i8e, "i8e");
    assertUint32(parameters.a6l, "a6l");
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {
      throw new RangeError("Image dimensions must be positive integers.");
    }
    if (!Number.isSafeInteger(tileWidth) || !Number.isSafeInteger(tileHeight) || tileWidth <= 0 || tileHeight <= 0) {
      throw new RangeError("Tile dimensions must be positive integers.");
    }
    const columns = Math.floor(width / tileWidth);
    const rows = Math.floor(height / tileHeight);
    if (columns === 0 || rows === 0) {
      throw new RangeError("Advanced NFBR reordering requires at least one full tile on each axis.");
    }
    const remainderWidth = width % tileWidth;
    const remainderHeight = height % tileHeight;
    const doubledColumns = columns + 1 << 1;
    const doubledRows = rows + 1 << 1;
    const xWrap = (columns + 1) * tileWidth - remainderWidth;
    const yWrap = (rows + 1) * tileHeight - remainderHeight;
    const random = new NfbrRandom();
    const selector = parameters.v1p ^ columns ^ rows;
    const algorithm = selector % 6;
    const parameter = (selector - algorithm) / 6 % XOR_SHIFT_PARAMETERS.length;
    random.configure(parameter, algorithm);
    random.seed(parameters.w6b ^ parameters.i8e ^ parameters.a6l);
    let first = random.next(65536);
    first += 65536 * random.next(65536);
    first += UINT32_RANGE2 * random.next(512);
    const second = UINT32_RANGE2 * columns + parameters.w6b;
    const third = UINT32_RANGE2 * rows + parameters.i8e;
    const fourth = UINT32_RANGE2 * parameters.v1p + parameters.a6l;
    const permutation = createPairPermutation(first, second, third, fourth);
    const map = [];
    const addRange = (start, end2, rectWidth, rectHeight) => {
      if (rectWidth === 0 || rectHeight === 0) {return;}
      for (let index = start; index < end2; ) {
        const horizontalValue = permutation[index++] ?? 0;
        const verticalValue = permutation[index++] ?? 0;
        const outputXIndex = horizontalValue % doubledColumns;
        const inputYIndex = (horizontalValue - outputXIndex) / doubledColumns;
        const outputYIndex = verticalValue % doubledRows;
        const inputXIndex = (verticalValue - outputYIndex) / doubledRows;
        map.push({
          outputX: outputXIndex * tileWidth - (columns < outputXIndex ? xWrap : 0),
          outputY: outputYIndex * tileHeight - (rows < outputYIndex ? yWrap : 0),
          inputX: inputXIndex * tileWidth - (columns < inputXIndex ? xWrap : 0),
          inputY: inputYIndex * tileHeight - (rows < inputYIndex ? yWrap : 0),
          width: rectWidth,
          height: rectHeight
        });
      }
    };
    let cursor = 0;
    let end = columns * rows << 1;
    addRange(cursor, end, tileWidth, tileHeight);
    cursor = end;
    end += 2;
    addRange(cursor, end, remainderWidth, remainderHeight);
    cursor = end;
    end += columns << 1;
    addRange(cursor, end, tileWidth, remainderHeight);
    cursor = end;
    end += rows << 1;
    addRange(cursor, end, remainderWidth, tileHeight);
    validateAdvancedMap(map, width, height);
    return map;
  }

  // src/userscript/bookwalker/nfbr-browser.ts
  function assertPositiveInteger(value, name) {
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new RangeError(`${name} must be a positive integer.`);
    }
  }
  function assertSeed(seed) {
    if (!Number.isSafeInteger(seed) || seed < 0) {
      throw new RangeError("seed must be a non-negative integer.");
    }
  }
  function specialIndex(count, multiplier, seed) {
    let index = (count - multiplier * seed % count) % count;
    if (index === 0) {index = (count - 4) % count;}
    if (index === 0) {index = count - 1;}
    return index;
  }
  function offset(index, special, remainder, size) {
    return index * size + (special <= index ? remainder : 0);
  }
  function permutedColumn(index, columnCount, seed) {
    return (index + 61 * seed) % columnCount;
  }
  function permutedRow(index, rowCount, seed) {
    return (index + 73 * seed) % rowCount;
  }
  function rowForColumn(column, specialColumn, specialRow, rowCount, seed) {
    const oddSeed = seed % 2 === 1;
    const useHead = column < specialColumn ? oddSeed : !oddSeed;
    const range = useHead ? specialRow : rowCount - specialRow;
    const base = useHead ? 0 : specialRow;
    return (column + 53 * seed + 59 * specialRow) % range + base;
  }
  function columnForRow(row, specialColumn, specialRow, columnCount, seed) {
    const oddSeed = seed % 2 === 1;
    const useTail = row < specialRow ? oddSeed : !oddSeed;
    const range = useTail ? columnCount - specialColumn : specialColumn;
    const base = useTail ? specialColumn : 0;
    return (row + 67 * seed + specialColumn + 71) % range + base;
  }
  function pushRect(map, outputX, outputY, inputX, inputY, width, height) {
    if (width === 0 || height === 0) {return;}
    map.push({ inputX, inputY, outputX, outputY, width, height });
  }
  function validateMap(map, width, height) {
    let area = 0;
    const outputOrigins = /* @__PURE__ */ new Set();
    const inputOrigins = /* @__PURE__ */ new Set();
    for (const rect of map) {
      if (rect.inputX < 0 || rect.inputY < 0 || rect.outputX < 0 || rect.outputY < 0 || rect.inputX + rect.width > width || rect.outputX + rect.width > width || rect.inputY + rect.height > height || rect.outputY + rect.height > height) {
        throw new RangeError("The generated NFBR map contains an out-of-bounds rectangle.");
      }
      const outputKey = `${rect.outputX},${rect.outputY}`;
      const inputKey = `${rect.inputX},${rect.inputY}`;
      if (outputOrigins.has(outputKey) || inputOrigins.has(inputKey)) {
        throw new Error("The generated NFBR map is not a one-to-one rectangle permutation.");
      }
      outputOrigins.add(outputKey);
      inputOrigins.add(inputKey);
      area += rect.width * rect.height;
    }
    if (area !== width * height) {
      throw new Error("The generated NFBR map does not cover the complete image.");
    }
  }
  function createNfbrReorderMap(width, height, tileWidth = 64, tileHeight = 64, seed = 1) {
    assertPositiveInteger(width, "width");
    assertPositiveInteger(height, "height");
    assertPositiveInteger(tileWidth, "tileWidth");
    assertPositiveInteger(tileHeight, "tileHeight");
    assertSeed(seed);
    const columnCount = Math.floor(width / tileWidth);
    const rowCount = Math.floor(height / tileHeight);
    if (columnCount < 5 || rowCount < 5) {
      throw new RangeError("NFBR reordering requires at least five full tiles on each axis.");
    }
    const remainderWidth = width % tileWidth;
    const remainderHeight = height % tileHeight;
    const specialColumn = specialIndex(columnCount, 43, seed);
    const specialRow = specialIndex(rowCount, 47, seed);
    const map = [];
    if (remainderWidth > 0 && remainderHeight > 0) {
      const x = specialColumn * tileWidth;
      const y = specialRow * tileHeight;
      pushRect(map, x, y, x, y, remainderWidth, remainderHeight);
    }
    if (remainderHeight > 0) {
      for (let column = 0; column < columnCount; column++) {
        const inputColumn = permutedColumn(column, columnCount, seed);
        const inputRow = rowForColumn(inputColumn, specialColumn, specialRow, rowCount, seed);
        pushRect(
          map,
          offset(column, specialColumn, remainderWidth, tileWidth),
          specialRow * tileHeight,
          offset(inputColumn, specialColumn, remainderWidth, tileWidth),
          inputRow * tileHeight,
          tileWidth,
          remainderHeight
        );
      }
    }
    if (remainderWidth > 0) {
      for (let row = 0; row < rowCount; row++) {
        const inputRow = permutedRow(row, rowCount, seed);
        const inputColumn = columnForRow(inputRow, specialColumn, specialRow, columnCount, seed);
        pushRect(
          map,
          specialColumn * tileWidth,
          offset(row, specialRow, remainderHeight, tileHeight),
          inputColumn * tileWidth,
          offset(inputRow, specialRow, remainderHeight, tileHeight),
          remainderWidth,
          tileHeight
        );
      }
    }
    for (let column = 0; column < columnCount; column++) {
      for (let row = 0; row < rowCount; row++) {
        const inputColumn = (column + 29 * seed + 31 * row) % columnCount;
        const inputRow = (row + 37 * seed + 41 * inputColumn) % rowCount;
        pushRect(
          map,
          offset(column, specialColumn, remainderWidth, tileWidth),
          offset(row, specialRow, remainderHeight, tileHeight),
          inputColumn * tileWidth + (inputColumn >= columnForRow(inputRow, specialColumn, specialRow, columnCount, seed) ? remainderWidth : 0),
          inputRow * tileHeight + (inputRow >= rowForColumn(inputColumn, specialColumn, specialRow, rowCount, seed) ? remainderHeight : 0),
          tileWidth,
          tileHeight
        );
      }
    }
    validateMap(map, width, height);
    return map;
  }

  // src/userscript/bookwalker/output.ts
  var PageStore = class {
    sessionId;
    sessionCreatedAt;
    sessionDirectoryName;
    sessionLockName;
    sessionLockPromise;
    sessionLockRelease;
    sessionClosed = false;
    rootPromise;
    sessionDirectoryPromise;
    archiveDirectoryPromise;
    databasePromise;
    databaseName;
    storeName = "pages";
    memoryFallback = /* @__PURE__ */ new Map();
    mimeTypes = /* @__PURE__ */ new Map();
    archiveEntries = /* @__PURE__ */ new Set();
    constructor(sessionId) {
      this.sessionId = sessionId;
      this.sessionCreatedAt = Date.now();
      this.sessionDirectoryName = `session-${this.sessionCreatedAt}-${this.sessionId}`;
      this.sessionLockName = `EbookLosslessDownloader:OPFS:${this.sessionDirectoryName}`;
      this.sessionLockPromise = this.acquireSessionLock();
      this.databaseName = `EbookLosslessDownloader_${sessionId}`;
      this.rootPromise = this.openOpfsRoot().then(async (root) => {
        await this.cleanupStaleSessions(root);
        return root;
      }).catch((error) => {
        __eldDevWarn("[EbookLosslessDownloader] OPFS unavailable; falling back to IndexedDB.", error);
        return null;
      });
      this.sessionDirectoryPromise = this.rootPromise.then(async (root) => {
        if (!root) {return null;}
        return root.getDirectoryHandle(this.sessionDirectoryName, { create: true });
      }).catch((error) => {
        __eldDevWarn("[EbookLosslessDownloader] OPFS session directory unavailable; falling back to IndexedDB.", error);
        return null;
      });
      this.archiveDirectoryPromise = this.rootPromise.then(async (root) => {
        if (!root) {return null;}
        const directory = await root.getDirectoryHandle("exports", { create: true });
        void this.cleanupStaleArchives(directory);
        return directory;
      }).catch(() => null);
      this.databasePromise = null;
    }
    async openOpfsRoot() {
      if (!navigator.storage?.getDirectory) {throw new Error("OPFS is unavailable.");}
      const originRoot = await navigator.storage.getDirectory();
      return originRoot.getDirectoryHandle("EbookLosslessDownloader", { create: true });
    }
    acquireSessionLock() {
      if (!navigator.locks?.request) {return null;}
      return navigator.locks.request(this.sessionLockName, async () => {
        if (this.sessionClosed) {return;}
        await new Promise((resolve) => {
          this.sessionLockRelease = resolve;
          if (this.sessionClosed) {resolve();}
        });
      }).catch((error) => {
        __eldDevWarn("[EbookLosslessDownloader] OPFS session lock unavailable; stale cleanup will use age checks.", error);
      });
    }
    releaseSessionLock() {
      this.sessionClosed = true;
      const release = this.sessionLockRelease;
      this.sessionLockRelease = null;
      release?.();
    }
    async removeUnlockedSession(root, name) {
      if (!navigator.locks?.request) {return false;}
      try {
        let removed = false;
        const lockName = `EbookLosslessDownloader:OPFS:${name}`;
        await navigator.locks.request(lockName, { ifAvailable: true }, async (lock) => {
          if (!lock) {return;}
          try {
            await root.removeEntry(name, { recursive: true });
            removed = true;
          } catch { /* Intentionally ignored. */ }
        });
        return removed;
      } catch {
        return false;
      }
    }
    async directoryLastModified(directory) {
      let latest = 0;
      try {
        for await (const [, handle] of directory.entries()) {
          try {
            if (handle.kind === "file") {
              const file = await handle.getFile();
              latest = Math.max(latest, file.lastModified || 0);
            } else if (handle.kind === "directory") {
              latest = Math.max(latest, await this.directoryLastModified(handle));
            }
          } catch { /* Intentionally ignored. */ }
        }
      } catch { /* Intentionally ignored. */ }
      return latest;
    }
    async cleanupStaleSessions(root, maxAgeMs = 24 * 60 * 60 * 1000, lockGraceMs = 5 * 60 * 1000) {
      try {
        const now = Date.now();
        const cutoff = now - maxAgeMs;
        const unlockedCutoff = now - lockGraceMs;
        for await (const [name, handle] of root.entries()) {
          if (handle.kind !== "directory" || !name.startsWith("session-") || name === this.sessionDirectoryName) {continue;}
          const timestampMatch = /^session-(\d{13})-/u.exec(name);
          const createdAt = timestampMatch ? Number(timestampMatch[1]) : 0;
          if (createdAt > 0 && createdAt < unlockedCutoff && await this.removeUnlockedSession(root, name)) {continue;}
          let stale = false;
          if (createdAt > 0) {
            stale = createdAt < cutoff;
          } else {
            const lastModified = await this.directoryLastModified(handle);
            stale = lastModified > 0 && lastModified < cutoff;
          }
          if (!stale) {continue;}
          try { await root.removeEntry(name, { recursive: true }); } catch { /* Intentionally ignored. */ }
        }
      } catch { /* Intentionally ignored. */ }
    }
    async cleanupStaleArchives(directory, maxAgeMs = 24 * 60 * 60 * 1000) {
      try {
        const cutoff = Date.now() - maxAgeMs;
        for await (const [name, handle] of directory.entries()) {
          if (handle.kind !== "file" || !name.startsWith("archive-")) {continue;}
          try {
            const file = await handle.getFile();
            if (file.lastModified < cutoff) {await directory.removeEntry(name);}
          } catch { /* Intentionally ignored. */ }
        }
      } catch { /* Intentionally ignored. */ }
    }
    openDatabase() {
      if (typeof indexedDB === "undefined") {return Promise.reject(new Error("IndexedDB is unavailable."));}
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.databaseName, 1);
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(this.storeName)) {database.createObjectStore(this.storeName);}
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
        request.onblocked = () => reject(new Error("IndexedDB open was blocked."));
      });
    }
    fallbackDatabase() {
      if (!this.databasePromise) {
        this.databasePromise = this.openDatabase().catch((error) => {
          __eldDevWarn("[EbookLosslessDownloader] IndexedDB unavailable; using in-memory fallback.", error);
          return null;
        });
      }
      return this.databasePromise;
    }
    request(database, mode, action) {
      return new Promise((resolve, reject) => {
        let transaction;
        try { transaction = database.transaction(this.storeName, mode); }
        catch (error) { reject(error); return; }
        const store = transaction.objectStore(this.storeName);
        let request;
        try { request = action(store); }
        catch (error) { reject(error); return; }
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
        transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
      });
    }
    safeEntryName(key) {
      return String(key).replace(/[^a-zA-Z0-9._-]/gu, "_");
    }
    async put(key, blob) {
      this.mimeTypes.set(key, blob.type || "application/octet-stream");
      const directory = await this.sessionDirectoryPromise;
      if (directory) {
        const fileHandle = await directory.getFileHandle(this.safeEntryName(key), { create: true });
        const writable = await fileHandle.createWritable({ keepExistingData: false });
        try {
          await writable.write(blob);
          await writable.close();
          return;
        } catch (error) {
          try { await writable.abort?.(error); } catch { /* Intentionally ignored. */ }
          throw error;
        }
      }
      const database = await this.fallbackDatabase();
      if (!database) {
        this.memoryFallback.set(key, blob);
        return;
      }
      await this.request(database, "readwrite", (store) => store.put(blob, key));
    }
    async get(key) {
      const directory = await this.sessionDirectoryPromise;
      if (directory) {
        try {
          const fileHandle = await directory.getFileHandle(this.safeEntryName(key));
          const file = await fileHandle.getFile();
          const type = this.mimeTypes.get(key) || file.type || "application/octet-stream";
          return file.type === type ? file : file.slice(0, file.size, type);
        } catch (error) {
          if (error?.name !== "NotFoundError") {throw error;}
        }
      }
      const database = await this.fallbackDatabase();
      const blob = database ? await this.request(database, "readonly", (store) => store.get(key)) : this.memoryFallback.get(key);
      if (!blob) {throw new Error(`Stored page ${key} is missing.`);}
      return blob;
    }
    async createArchiveTarget(name, mimeType = "application/zip") {
      const directory = await this.archiveDirectoryPromise;
      if (directory) {
        const key = `archive-${Date.now()}-${this.sessionId}-${crypto.randomUUID()}-${this.safeEntryName(name)}`;
        this.archiveEntries.add(key);
        const fileHandle = await directory.getFileHandle(key, { create: true });
        const writable = await fileHandle.createWritable({ keepExistingData: false });
        return {
          writable,
          async finish() {
            const file = await fileHandle.getFile();
            return file.type === mimeType ? file : file.slice(0, file.size, mimeType);
          },
          async cleanup() {
            try { await directory.removeEntry(key); } catch { /* Intentionally ignored. */ }
          }
        };
      }
      const chunks = [];
      return {
        writable: {
          async write(chunk) { chunks.push(chunk instanceof Uint8Array ? chunk.slice() : new Uint8Array(chunk)); },
          async close() {},
          async abort() { chunks.length = 0; }
        },
        async finish() { return new Blob(chunks, { type: mimeType }); },
        async cleanup() { chunks.length = 0; }
      };
    }
    scheduleArchiveCleanup(delayMs = 30 * 60 * 1000) {
      if (this.archiveEntries.size === 0) {return;}
      const names = [...this.archiveEntries];
      this.archiveEntries.clear();
      const directoryPromise = this.archiveDirectoryPromise;
      setTimeout(() => {
        void directoryPromise.then(async (directory) => {
          if (!directory) {return;}
          for (const name of names) {try { await directory.removeEntry(name); } catch { /* Intentionally ignored. */ }}
        });
      }, delayMs);
    }
    async clear() {
      const directory = await this.sessionDirectoryPromise;
      const root = await this.rootPromise;
      this.memoryFallback.clear();
      this.mimeTypes.clear();
      if (root && directory) {
        try { await root.removeEntry(this.sessionDirectoryName, { recursive: true }); } catch { /* Intentionally ignored. */ }
      }
      const database = this.databasePromise ? await this.databasePromise : null;
      if (!database) {
        this.releaseSessionLock();
        return;
      }
      try { await this.request(database, "readwrite", (store) => store.clear()); } catch { /* Intentionally ignored. */ }
      try { database.close(); } catch { /* Intentionally ignored. */ }
      try { indexedDB.deleteDatabase(this.databaseName); } catch { /* Intentionally ignored. */ }
      this.releaseSessionLock();
    }
  };
  function sanitizeFilename(value) {
    const invalidFilenameCharacters = '\\/:*?"<>|';
    const cleaned = Array.from(String(value), (character) =>
      character.charCodeAt(0) <= 31 || invalidFilenameCharacters.includes(character) ? "_" : character
    ).join("");
    const normalized = cleaned.replace(/\s+/gu, " ").trim();
    return normalized.slice(0, 120) || "book";
  }
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15e3);
  }
  function escapeXml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
  }
  function mediaType(extension) {
    if (extension === "jpg") {return JPG_MIME;}
    return `image/${extension}`;
  }
  function unsignedUrl(value) {
    try {
      const url = new URL(value, location.href);
      return `${url.origin}${url.pathname}`;
    } catch {
      return String(value).split(/[?#]/u)[0];
    }
  }
  function zipUint16(value) {
    const bytes = new Uint8Array(2);
    new DataView(bytes.buffer).setUint16(0, value, true);
    return bytes;
  }
  function zipUint32(value) {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(0, value >>> 0, true);
    return bytes;
  }
  function zipUint64(value) {
    const bytes = new Uint8Array(8);
    new DataView(bytes.buffer).setBigUint64(0, __ELD_GLOBAL__.BigInt(value), true);
    return bytes;
  }
  function zipConcat(parts) {
    const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
    const result = new Uint8Array(total);
    let offset2 = 0;
    for (const part of parts) {
      result.set(part, offset2);
      offset2 += part.byteLength;
    }
    return result;
  }
  function zipDosDateTime(date = new Date()) {
    const year = Math.max(1980, Math.min(2107, date.getFullYear()));
    const dosDate = (year - 1980 << 9) | (date.getMonth() + 1 << 5) | date.getDate();
    const dosTime = date.getHours() << 11 | date.getMinutes() << 5 | Math.floor(date.getSeconds() / 2);
    return { dosDate, dosTime };
  }
  function crc32Begin() { return 4294967295; }
  function crc32UpdateValue(crc, data) {
    const table = crcTable ??= createCrcTable();
    for (let index = 0; index < data.length; index++) {
      crc = (table[(crc ^ data[index]) & 255] ?? 0) ^ crc >>> 8;
    }
    return crc >>> 0;
  }
  function crc32Finish(crc) { return (crc ^ 4294967295) >>> 0; }
  async function deflateRawForZip(bytes) {
    const CompressionStreamCtor = __ELD_GLOBAL__.CompressionStream;
    if (typeof CompressionStreamCtor !== "function") {return null;}
    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStreamCtor("deflate-raw"));
      return new Uint8Array(await new Response(stream).arrayBuffer());
    } catch {
      return null;
    }
  }
  var StreamingZipWriter = class {
    writable;
    entries = [];
    position = 0n;
    closed = false;
    constructor(writable) {
      this.writable = writable;
    }
    async write(bytes) {
      if (this.closed) {throw new Error("ZIP writer is already closed.");}
      if (!(bytes instanceof Uint8Array)) {bytes = new Uint8Array(bytes);}
      await this.writable.write(bytes);
      this.position += __ELD_GLOBAL__.BigInt(bytes.byteLength);
    }
    buildZip64Extra({ uncompressedSize, compressedSize, localOffset }, includeUncompressed, includeCompressed, includeOffset) {
      const fields = [];
      if (includeUncompressed) {fields.push(zipUint64(uncompressedSize));}
      if (includeCompressed) {fields.push(zipUint64(compressedSize));}
      if (includeOffset) {fields.push(zipUint64(localOffset));}
      if (fields.length === 0) {return new Uint8Array();}
      const payload = zipConcat(fields);
      return zipConcat([zipUint16(1), zipUint16(payload.length), payload]);
    }
    async addStoredBlob(name, blob, date = new Date()) {
      const nameBytes = new TextEncoder().encode(name);
      const size = __ELD_GLOBAL__.BigInt(blob.size);
      const localOffset = this.position;
      const needsZip64Size = size >= 4294967295n;
      const extra = this.buildZip64Extra({ uncompressedSize: size, compressedSize: size, localOffset }, needsZip64Size, needsZip64Size, false);
      const { dosDate, dosTime } = zipDosDateTime(date);
      const flags = 2056;
      const localHeader = zipConcat([
        zipUint32(67324752),
        zipUint16(needsZip64Size ? 45 : 20),
        zipUint16(flags),
        zipUint16(0),
        zipUint16(dosTime), zipUint16(dosDate),
        zipUint32(0),
        zipUint32(needsZip64Size ? 4294967295 : 0),
        zipUint32(needsZip64Size ? 4294967295 : 0),
        zipUint16(nameBytes.length), zipUint16(extra.length),
        nameBytes, extra
      ]);
      await this.write(localHeader);
      let crc = crc32Begin();
      const reader = blob.stream().getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {break;}
          const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
          crc = crc32UpdateValue(crc, chunk);
          await this.write(chunk);
        }
      } finally {
        try { reader.releaseLock(); } catch { /* Intentionally ignored. */ }
      }
      crc = crc32Finish(crc);
      const descriptor = needsZip64Size
        ? zipConcat([zipUint32(134695760), zipUint32(crc), zipUint64(size), zipUint64(size)])
        : zipConcat([zipUint32(134695760), zipUint32(crc), zipUint32(Number(size)), zipUint32(Number(size))]);
      await this.write(descriptor);
      this.entries.push({ nameBytes, crc, compressedSize: size, uncompressedSize: size, localOffset, method: 0, flags, dosDate, dosTime });
    }
    async addText(name, text, compress = true, date = new Date()) {
      const input = new TextEncoder().encode(text);
      const compressed = compress ? await deflateRawForZip(input) : null;
      const data = compressed && compressed.byteLength < input.byteLength ? compressed : input;
      const method = data === input ? 0 : 8;
      const nameBytes = new TextEncoder().encode(name);
      const uncompressedSize = __ELD_GLOBAL__.BigInt(input.byteLength);
      const compressedSize = __ELD_GLOBAL__.BigInt(data.byteLength);
      const localOffset = this.position;
      const needsZip64Size = uncompressedSize >= 4294967295n || compressedSize >= 4294967295n;
      const extra = this.buildZip64Extra({ uncompressedSize, compressedSize, localOffset }, needsZip64Size, needsZip64Size, false);
      const { dosDate, dosTime } = zipDosDateTime(date);
      let crc = crc32Begin();
      crc = crc32Finish(crc32UpdateValue(crc, input));
      const flags = 2048;
      const localHeader = zipConcat([
        zipUint32(67324752),
        zipUint16(needsZip64Size ? 45 : 20),
        zipUint16(flags),
        zipUint16(method),
        zipUint16(dosTime), zipUint16(dosDate),
        zipUint32(crc),
        zipUint32(needsZip64Size ? 4294967295 : Number(compressedSize)),
        zipUint32(needsZip64Size ? 4294967295 : Number(uncompressedSize)),
        zipUint16(nameBytes.length), zipUint16(extra.length),
        nameBytes, extra
      ]);
      await this.write(localHeader);
      await this.write(data);
      this.entries.push({ nameBytes, crc, compressedSize, uncompressedSize, localOffset, method, flags, dosDate, dosTime });
    }
    async close() {
      if (this.closed) {throw new Error("ZIP writer is already closed.");}
      const centralOffset = this.position;
      for (const entry of this.entries) {
        const sizeOverflow = entry.uncompressedSize >= 4294967295n || entry.compressedSize >= 4294967295n;
        const offsetOverflow = entry.localOffset >= 4294967295n;
        const extra = this.buildZip64Extra(entry, sizeOverflow, sizeOverflow, offsetOverflow);
        const needsZip64 = sizeOverflow || offsetOverflow;
        const central = zipConcat([
          zipUint32(33639248),
          zipUint16(needsZip64 ? 45 : 20),
          zipUint16(needsZip64 ? 45 : 20),
          zipUint16(entry.flags),
          zipUint16(entry.method),
          zipUint16(entry.dosTime), zipUint16(entry.dosDate),
          zipUint32(entry.crc),
          zipUint32(sizeOverflow ? 4294967295 : Number(entry.compressedSize)),
          zipUint32(sizeOverflow ? 4294967295 : Number(entry.uncompressedSize)),
          zipUint16(entry.nameBytes.length), zipUint16(extra.length),
          zipUint16(0), zipUint16(0), zipUint16(0), zipUint32(0),
          zipUint32(offsetOverflow ? 4294967295 : Number(entry.localOffset)),
          entry.nameBytes, extra
        ]);
        await this.write(central);
      }
      const centralSize = this.position - centralOffset;
      const count = __ELD_GLOBAL__.BigInt(this.entries.length);
      const needsZip64Eocd = count >= 65535n || centralOffset >= 4294967295n || centralSize >= 4294967295n;
      if (needsZip64Eocd) {
        const zip64Offset = this.position;
        await this.write(zipConcat([
          zipUint32(101075792), zipUint64(44),
          zipUint16(45), zipUint16(45),
          zipUint32(0), zipUint32(0),
          zipUint64(count), zipUint64(count),
          zipUint64(centralSize), zipUint64(centralOffset)
        ]));
        await this.write(zipConcat([
          zipUint32(117853008), zipUint32(0), zipUint64(zip64Offset), zipUint32(1)
        ]));
      }
      await this.write(zipConcat([
        zipUint32(101010256),
        zipUint16(0), zipUint16(0),
        zipUint16(needsZip64Eocd ? 65535 : Number(count)),
        zipUint16(needsZip64Eocd ? 65535 : Number(count)),
        zipUint32(needsZip64Eocd ? 4294967295 : Number(centralSize)),
        zipUint32(needsZip64Eocd ? 4294967295 : Number(centralOffset)),
        zipUint16(0)
      ]));
      this.closed = true;
      await this.writable.close();
    }
    async abort(error) {
      this.closed = true;
      try { await this.writable.abort?.(error); } catch { /* Intentionally ignored. */ }
    }
  };
  function preservationManifest(title, pages) {
    return JSON.stringify({
      title,
      generator: `${__ELD_PRODUCT_NAME__} ${__ELD_VERSION__}`,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      source: unsignedUrl(location.href),
      notice: "Only pages made available by the active BOOK☆WALKER viewer session were captured.",
      pages: pages.map((page) => {
        const publicPage = { ...page };
        delete publicPage.storageKey;
        delete publicPage.pdfStorageKey;
        delete publicPage.__ocrPromise;
        if (publicPage.sourceUrl) {publicPage.sourceUrl = unsignedUrl(publicPage.sourceUrl);}
        return publicPage;
      })
    }, null, 2);
  }
  async function buildZip(title, pages, store, cbz) {
    const target = await store.createArchiveTarget(`${title}.${cbz ? "cbz" : "zip"}`, cbz ? "application/vnd.comicbook+zip" : "application/zip");
    const zip = new StreamingZipWriter(target.writable);
    try {
      for (const page of pages) {
        await zip.addStoredBlob(page.filename, await store.get(page.storageKey));
      }
      if (__eldDeveloperEnabled()) {
        await zip.addText("manifest.json", preservationManifest(title, pages), true);
      }
      if (cbz) {
        await zip.addText("ComicInfo.xml", `<?xml version="1.0" encoding="utf-8"?>
<ComicInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Title>${escapeXml(title)}</Title>
  <PageCount>${pages.length}</PageCount>
  <LanguageISO>ja</LanguageISO>
  <Pages>${pages.map((page, index) => `<Page Image="${index}" ImageWidth="${page.width}" ImageHeight="${page.height}" />`).join("")}</Pages>
</ComicInfo>`, true);
      }
      for (const page of pages) {
        if (page.ocrText) {await zip.addText(`ocr/page-${String(page.pageNumber).padStart(4, "0")}.txt`, page.ocrText, true);}
      }
      await zip.close();
      return await target.finish();
    } catch (error) {
      await zip.abort(error);
      await target.cleanup?.();
      throw error;
    }
  }
  async function buildPdf(pages, store) {
    if (pages.length === 0) {throw new Error("No captured pages are available.");}
    let document2;
    for (const [index, page] of pages.entries()) {
      const orientation = page.width > page.height ? "l" : "p";
      if (!document2) {
        document2 = new __ELD_GLOBAL__.jspdf.jsPDF({ orientation, unit: "px", format: [page.width, page.height], compress: true });
      } else {
        document2.addPage([page.width, page.height], orientation);
      }
      const blob = await store.get(page.pdfStorageKey);
      const format = blob.type.includes("png") ? "PNG" : blob.type.includes("webp") ? "WEBP" : PDF_JPG_FORMAT;
      document2.addImage(new Uint8Array(await blob.arrayBuffer()), format, 0, 0, page.width, page.height);
      if (page.ocrText) {
        document2.setFontSize(1);
        document2.setTextColor(255, 255, 255);
        document2.text(page.ocrText.split(/\r?\n/u), 1, Math.max(1, page.height - 1), { maxWidth: page.width - 2 });
      }
      if (index % 10 === 0) {await new Promise((resolve) => setTimeout(resolve, 0));}
    }
    if (!document2) {throw new Error("PDF creation failed.");}
    return document2.output("blob");
  }
  async function buildEpub(title, pages, store) {
    const target = await store.createArchiveTarget(`${title}.epub`, "application/epub+zip");
    const zip = new StreamingZipWriter(target.writable);
    const identifier = `urn:uuid:${crypto.randomUUID()}`;
    try {
      await zip.addText("mimetype", "application/epub+zip", false);
      await zip.addText("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`, true);
      await zip.addText("OEBPS/style.css", `html,body{margin:0;padding:0;width:100%;height:100%;background:#fff}body{display:flex;align-items:center;justify-content:center}img{width:100%;height:100%;object-fit:contain}.ocr{position:absolute;left:-100000px}`, true);
      const manifestItems = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
        '<item id="css" href="style.css" media-type="text/css"/>'
      ];
      const spineItems = [];
      const navItems = [];
      for (const [index, page] of pages.entries()) {
        const number = String(index + 1).padStart(4, "0");
        const imageHref = `images/${page.filename}`;
        const pageHref = `pages/page-${number}.xhtml`;
        await zip.addStoredBlob(`OEBPS/${imageHref}`, await store.get(page.storageKey));
        const ocr = page.ocrText ? `<pre class="ocr">${escapeXml(page.ocrText)}</pre>` : "";
        await zip.addText(`OEBPS/${pageHref}`, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Page ${index + 1}</title><link rel="stylesheet" type="text/css" href="../style.css"/></head><body><img src="../${escapeXml(imageHref)}" alt="Page ${index + 1}"/>${ocr}</body></html>`, true);
        manifestItems.push(`<item id="image-${number}" href="${escapeXml(imageHref)}" media-type="${mediaType(page.extension)}"${index === 0 ? ' properties="cover-image"' : ""}/>`);
        manifestItems.push(`<item id="page-${number}" href="${pageHref}" media-type="application/xhtml+xml"/>`);
        spineItems.push(`<itemref idref="page-${number}"/>`);
        navItems.push(`<li><a href="${pageHref}">Page ${index + 1}</a></li>`);
      }
      await zip.addText("OEBPS/nav.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${escapeXml(title)}</title></head><body><nav epub:type="toc" xmlns:epub="http://www.idpf.org/2007/ops"><h1>${escapeXml(title)}</h1><ol>${navItems.join("")}</ol></nav></body></html>`, true);
      await zip.addText("OEBPS/content.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" prefix="rendition: http://www.idpf.org/vocab/rendition/#">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${identifier}</dc:identifier><dc:title>${escapeXml(title)}</dc:title><dc:language>ja</dc:language><meta property="dcterms:modified">${(/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/u, "Z")}</meta><meta property="rendition:layout">pre-paginated</meta><meta property="rendition:spread">auto</meta></metadata>
  <manifest>${manifestItems.join("")}</manifest><spine page-progression-direction="rtl">${spineItems.join("")}</spine>
</package>`, true);
      if (__eldDeveloperEnabled()) {
        await zip.addText("OEBPS/manifest.json", preservationManifest(title, pages), true);
      }
      await zip.close();
      return await target.finish();
    } catch (error) {
      await zip.abort(error);
      await target.cleanup?.();
      throw error;
    }
  }

  // src/userscript/bookwalker/main.ts
  var activePageSource = new BookWalkerPageSource();
  activePageSource.install();
  // Deterministic trial/purchased paths do not require observing the viewer Canvas.
  var session = {
    state: "idle",
    stopRequested: false,
    abortController: null,
    runId: 0,
    absolutePage: 1,
    total: 0,
    current: 0,
    pages: [],
    failures: [],
    failureDetails: [],
    losslessPages: 0,
    passthroughPages: 0,
    fallbackPages: 0,
    runStartedAt: 0,
    pageTimings: [],
    aggregateTimings: {
      prepareMs: 0,
      captureMs: 0,
      dctMs: 0,
      extractMs: 0,
      reorderMs: 0,
      cropMs: 0,
      jpgEncodeMs: 0,
      encodeMs: 0,
      storeMs: 0,
      pdfMs: 0,
      packageMs: 0,
      totalMs: 0
    }
  };
  var panel;
  var statusElement;
  var statusState = { type: "key", key: "waitingReader", values: {} };
  var progressElement;
  var startButton;
  var metadataRatio = 0;
  var wakeLock;
  var LOSSLESS_SLIDER_VALUE = 110;
  var LOSSLESS_SLIDER_THRESHOLD = 105;
  function byId(id) {
    return document.getElementById(id) ?? void 0;
  }
  function inputById(id) {
    const element = document.getElementById(id);
    return element instanceof HTMLInputElement ? element : void 0;
  }
  function buttonById(id) {
    const element = document.getElementById(id);
    return element instanceof HTMLButtonElement ? element : void 0;
  }
  function yieldToBrowser() {
    // Let the browser paint and dispatch UI events between page, storage and package
    // stages. Image and DCT codec work itself runs in dedicated workers.
    return new Promise((resolve) => {
      try {
        if (typeof requestAnimationFrame === "function" && document.visibilityState !== "hidden") {
          requestAnimationFrame(() => setTimeout(resolve, 0));
          return;
        }
      } catch { /* Intentionally ignored. */ }
      setTimeout(resolve, 0);
    });
  }
  function refreshStatusText() {
    if (!statusElement || !statusState) {return;}
    if (statusState.type !== "key") {
      statusElement.textContent = statusState.message;
      return;
    }
    if (statusState.key === "finalSummary") {
      const values = statusState.values ?? {};
      const state = __eldT(values.aborted ? "stoppedPackaged" : "completed");
      const volumes = values.outputCount > 1 ? __eldT("splitIntoVolumes", { count: values.outputCount }) : "";
      const failures = values.failurePages?.length ? __eldT("failures", { pages: values.failurePages.join(", ") }) : "";
      const preservation = values.developer ? __eldT("preservation", {
        lossless: values.losslessPages ?? 0,
        passthrough: values.passthroughPages ?? 0,
        fallback: values.fallbackPages ?? 0
      }) : "";
      const summary = values.developer ? formatTimingSummary(values.timing) : "";
      const timing = summary ? __eldT("timing", { summary }) : "";
      statusElement.textContent = __eldT("completeSummary", { state, count: values.pageCount ?? 0, volumes, failures, preservation, timing });
      return;
    }
    statusElement.textContent = __eldT(statusState.key, statusState.values);
  }
  function reportStatus(message) {
    statusState = { type: "literal", message: String(message) };
    refreshStatusText();
  }
  function reportStatusKey(key, values = {}) {
    statusState = { type: "key", key, values: { ...values } };
    refreshStatusText();
  }
  function nowMilliseconds() {
    try {
      return performance.now();
    } catch {
      return Date.now();
    }
  }
  function createEmptyTimingTotals() {
    return {
      prepareMs: 0,
      captureMs: 0,
      dctMs: 0,
      encodeMs: 0,
      storeMs: 0,
      pdfMs: 0,
      packageMs: 0,
      totalMs: 0
    };
  }
  function addTimingTotals(target, patch) {
    if (!target || !patch) {return target;}
    for (const key of ["prepareMs", "captureMs", "dctMs", "extractMs", "reorderMs", "cropMs", "jpgEncodeMs", "encodeMs", "storeMs", "pdfMs", "packageMs", "totalMs"]) {
      const value = Number(patch[key]);
      if (Number.isFinite(value)) {target[key] = (Number(target[key]) || 0) + value;}
    }
    return target;
  }
  function roundedMilliseconds(value) {
    return Math.round((Number(value) || 0) * 10) / 10;
  }
  function formatTimingSummary(timing) {
    if (!timing) {return "";}
    const parts = [];
    const add = (key, value) => {if ((value ?? 0) > 0) {parts.push(`${__eldT(key)} ${roundedMilliseconds(value)} ms`);}};
    add("timingPrepare", timing.prepareMs);
    if ((timing.dctMs ?? 0) > 0) {parts.push(`DCT ${roundedMilliseconds(timing.dctMs)} ms`);}
    add("timingDctParse", timing.extractMs);
    add("timingReorder", timing.reorderMs);
    add("timingJpgEntropy", timing.jpgEncodeMs);
    add("timingPixelEncode", timing.encodeMs);
    add("timingStore", timing.storeMs);
    add("timingPdf", timing.pdfMs);
    add("timingPackage", timing.packageMs);
    add("timingTotal", timing.totalMs);
    return parts.join(__eldLanguage === "en" ? "; " : "；");
  }
  function logPageTiming(page, timing, preservation) {
    if (!timing || !__eldDeveloperEnabled()) {return;}
    __eldDevInfo(`[EbookLosslessDownloader 0.5.0] page ${page} timing`, {
      page,
      preservation,
      prepareMs: roundedMilliseconds(timing.prepareMs),
      captureMs: roundedMilliseconds(timing.captureMs),
      dctMs: roundedMilliseconds(timing.dctMs),
      extractMs: roundedMilliseconds(timing.extractMs),
      reorderMs: roundedMilliseconds(timing.reorderMs),
      cropMs: roundedMilliseconds(timing.cropMs),
      jpgEncodeMs: roundedMilliseconds(timing.jpgEncodeMs),
      encodeMs: roundedMilliseconds(timing.encodeMs),
      storeMs: roundedMilliseconds(timing.storeMs),
      pdfMs: roundedMilliseconds(timing.pdfMs),
      totalMs: roundedMilliseconds(timing.totalMs)
    });
  }
  function logRunTimingSummary() {
    const totals = session?.aggregateTimings;
    if (!totals || !__eldDeveloperEnabled()) {return;}
    __eldDevInfo('[EbookLosslessDownloader 0.5.0] run timing summary', {
      pages: session.pages.length,
      prepareMs: roundedMilliseconds(totals.prepareMs),
      captureMs: roundedMilliseconds(totals.captureMs),
      dctMs: roundedMilliseconds(totals.dctMs),
      extractMs: roundedMilliseconds(totals.extractMs),
      reorderMs: roundedMilliseconds(totals.reorderMs),
      cropMs: roundedMilliseconds(totals.cropMs),
      jpgEncodeMs: roundedMilliseconds(totals.jpgEncodeMs),
      encodeMs: roundedMilliseconds(totals.encodeMs),
      storeMs: roundedMilliseconds(totals.storeMs),
      pdfMs: roundedMilliseconds(totals.pdfMs),
      packageMs: roundedMilliseconds(totals.packageMs),
      totalMs: roundedMilliseconds(totals.totalMs),
      coefficientRoundTripVerification: false,
      dctWorker: true,
      pageTimings: session.pageTimings
    });
  }
  function totalPages() {
    const catalogTotal = activePageSource.catalogTotalPages();
    if (catalogTotal > 0) {return catalogTotal;}
    const counter = document.querySelector("#pageSliderCounter")?.textContent ?? "";
    const match = counter.match(/\/\s*(\d+)/u);
    return match ? Number.parseInt(match[1] ?? "0", 10) : activePageSource.bookInfo.totalPages ?? 0;
  }
   function readInteger(id, fallback) {
    const value = Number.parseInt(inputById(id)?.value ?? "", 10);
    return Number.isSafeInteger(value) && value > 0 ? value : fallback;
  }
  function readBoundedInteger(id, fallback, minimum, maximum) {
    const value = Number.parseInt(inputById(id)?.value ?? "", 10);
    return Number.isSafeInteger(value) ? Math.max(minimum, Math.min(maximum, value)) : fallback;
  }
  function checked(id) {
    return inputById(id)?.checked ?? false;
  }
  function selectedRadio(name, fallback) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;
  }
  function detectedImageSize(page = session.absolutePage ?? 1) {
    const catalogEntry = activePageSource.catalogEntry(page);
    if (catalogEntry?.width && catalogEntry?.height) {return { width: catalogEntry.width, height: catalogEntry.height };}
    const metadata = activePageSource.snapshotBookInfo();
    if (metadata.width && metadata.height) {return { width: metadata.width, height: metadata.height };}
    const imageUrl = catalogEntry?.imageUrl;
    const image = imageUrl ? activePageSource.imageForUrl(imageUrl) : void 0;
    return image ? { width: image.width, height: image.height } : void 0;
  }
  function qualitySetting(id, allowLossless) {
    const raw = readBoundedInteger(id, allowLossless ? LOSSLESS_SLIDER_VALUE : 100, 0, LOSSLESS_SLIDER_VALUE);
    return {
      lossless: allowLossless && raw >= LOSSLESS_SLIDER_THRESHOLD,
      quality: Math.min(100, raw)
    };
  }
  function readSettings() {
    const total = totalPages();
    const detected = detectedImageSize();
    const matchMetadata = checked("eld-match-meta");
    const jpg2 = qualitySetting("eld-jpg-quality", matchMetadata);
    const jxl = qualitySetting("eld-jxl-quality", true);
    const webp = qualitySetting("eld-webp-quality", true);
    const width = readInteger("eld-width", detected?.width ?? 1200);
    const height = readInteger("eld-height", detected?.height ?? 1600);
    const packFormat = selectedRadio("eld-pack-format", "zip");
    return {
      startPage: Math.max(1, readInteger("eld-start", 1)),
      endPage: Math.min(total, readInteger("eld-end", total)),
      matchMetadata,
      preserveAspectRatio: checked("eld-aspect"),
      width,
      height,
      imageFormat: packFormat === "pdf" ? "jpg" : selectedRadio("eld-image-format", "jpg"),
      jpgQuality: jpg2.quality / 100,
      jpgLossless: jpg2.lossless,
      jxlQuality: jxl.quality,
      jxlLossless: jxl.lossless,
      jxlEffort: readBoundedInteger("eld-jxl-effort", 7, 1, 9),
      pngCompression: readBoundedInteger("eld-png-compression", 7, 0, 9),
      webpLossless: webp.lossless,
      webpQuality: webp.quality,
      webpMethod: readBoundedInteger("eld-webp-method", 4, 0, 6),
      detectTextPages: checked("eld-detect-text"),
      imageToText: checked("eld-ocr"),
      packFormat,
      volumePages: checked("eld-split-volume") ? readBoundedInteger("eld-volume-pages", 100, 1, 1000) : 0
    };
  }
  function normalizeViewerRectangles(rectangles, imageWidth, imageHeight) {
    if (!Array.isArray(rectangles) || rectangles.length === 0) {return void 0;}
    const map = [];
    for (const rectangle of rectangles) {
      if (!rectangle || typeof rectangle !== "object") {return void 0;}
      const width = Number(rectangle.width);
      const height = Number(rectangle.height);
      let inputX, inputY, outputX, outputY;
      if ([rectangle.inputX, rectangle.inputY, rectangle.outputX, rectangle.outputY].every(Number.isFinite)) {
        inputX = Number(rectangle.inputX); inputY = Number(rectangle.inputY);
        outputX = Number(rectangle.outputX); outputY = Number(rectangle.outputY);
      } else if ([rectangle.srcX, rectangle.srcY, rectangle.destX, rectangle.destY].every(Number.isFinite)) {
        // viewer_image's block records are consumed as drawImage(image, dest..., src...),
        // so dest is the scrambled input rectangle and src is its restored output position.
        inputX = Number(rectangle.destX); inputY = Number(rectangle.destY);
        outputX = Number(rectangle.srcX); outputY = Number(rectangle.srcY);
      } else {return void 0;}
      if (![inputX, inputY, outputX, outputY, width, height].every(Number.isSafeInteger) || width <= 0 || height <= 0) {return void 0;}
      if (Number.isSafeInteger(imageWidth) && Number.isSafeInteger(imageHeight)) {
        if (inputX < 0 || inputY < 0 || outputX < 0 || outputY < 0 || inputX + width > imageWidth || outputX + width > imageWidth || inputY + height > imageHeight || outputY + height > imageHeight) {return void 0;}
      }
      map.push({ inputX, inputY, outputX, outputY, width, height });
    }
    return map.length ? map : void 0;
  }
  function mapForDescriptor(imageWidth, imageHeight, descriptor) {
    if (descriptor.map) {return descriptor.map;}
    const tileWidth = descriptor.tileWidth;
    const tileHeight = descriptor.tileHeight;
    if (tileWidth === void 0 || tileHeight === void 0) {throw new Error("NFBR tile dimensions are missing.");}
    if (descriptor.advanced) {
      return createNfbrAdvancedReorderMap(imageWidth, imageHeight, tileWidth, tileHeight, descriptor.advanced);
    }
    if (descriptor.seed === void 0) {throw new Error("NFBR seed is missing.");}
    return createNfbrReorderMap(imageWidth, imageHeight, tileWidth, tileHeight, descriptor.seed);
  }
 
  async function originalJpgSource(image, metadataSize) {
    const originalBlob = new Blob([Uint8Array.from(image.bytes).buffer], { type: JPG_MIME });
    const crop2 = metadataSize && metadataSize.width <= image.width && metadataSize.height <= image.height && (metadataSize.width !== image.width || metadataSize.height !== image.height) ? metadataSize : void 0;
    if (!crop2) {
      return {
        blob: originalBlob,
        width: image.width,
        height: image.height,
        preservation: "jpg-original-pass-through"
      };
    }
    try {
      const cropped = await losslessCropJpg(image.bytes, crop2);
      return {
        blob: new Blob([Uint8Array.from(cropped.bytes).buffer], { type: JPG_MIME }),
        width: cropped.width,
        height: cropped.height,
        sampling: cropped.sampling,
        preservation: "jpg-dct-lossless-crop"
      };
    } catch {
      return {
        blob: originalBlob,
        width: image.width,
        height: image.height,
        preservation: "jpg-original-pass-through"
      };
    }
  }
  async function restorePageJpg(page, source, metadataSize) {
    const image = source?.image ?? activePageSource.imageForUrl(source?.imageUrl);
    if (!image?.bytes) {throw new NetworkDownloadError(__eldT("sourceImageUnavailable", { page }));}
    if (source.reorderState === "unknown") {
      throw new MappingMissingError(__eldT("mappingUnknown", { page }));
    }
    if (source.reorderState === "none") {
      return { ...(await originalJpgSource(image, metadataSize)), sourceMode: "passthrough" };
    }
    const map = source.reorderMap;
    if (!Array.isArray(map) || map.length === 0) {
      throw new MappingMissingError(__eldT("mappingMissing", { page }));
    }
    try {
      validateMap(map, image.width, image.height);
    } catch (error) {
      throw new InvalidMappingError(__eldT("mappingInvalid", { page, detail: error instanceof Error ? error.message : String(error) }));
    }
    const movedRectangles = map.filter((rect) => rect.inputX !== rect.outputX || rect.inputY !== rect.outputY);
    if (movedRectangles.length === 0) {
      return { ...(await originalJpgSource(image, metadataSize)), sourceMode: "passthrough" };
    }
    const crop = metadataSize && metadataSize.width <= image.width && metadataSize.height <= image.height && (metadataSize.width !== image.width || metadataSize.height !== image.height)
      ? metadataSize
      : void 0;
    const result = await losslessReorderJpg(image.bytes, map, crop);
    return {
      blob: new Blob([Uint8Array.from(result.bytes).buffer], { type: JPG_MIME }),
      width: result.width,
      height: result.height,
      sampling: result.sampling,
      preservation: "jpg-dct-lossless-unverified",
      sourceMode: "nfbr",
      dctMilliseconds: result.dctMilliseconds,
      dctTimings: result.dctTimings,
      nfbrRectangleCount: map.length,
      nfbrMovedRectangleCount: movedRectangles.length,
      nfbrMovedArea: movedRectangles.reduce((sum, rect) => sum + rect.width * rect.height, 0),
      nfbrMappingSource: source.sourceKind === "purchased" ? "viewer_image:n4q+Z1P" : "configuration_pack.json"
    };
  }
  async function jpgBlobFromCanvas(canvas, quality = 0.92) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PDF preview encoding failed.")), JPG_MIME, quality);
    });
  }
  function releaseCanvas(canvas) {
    if (!canvas) {return;}
    canvas.width = 0;
    canvas.height = 0;
  }
  async function canvasFromNormalizedSource(page, source, metadataSize) {
    const image = source?.image ?? activePageSource.imageForUrl(source?.imageUrl);
    if (!image?.bytes) {throw new NetworkDownloadError(__eldT("sourceImageUnavailable", { page }));}
    if (source.reorderState === "unknown") {
      throw new MappingMissingError(__eldT("mappingUnknown", { page }));
    }
    let canvas = await blobToCanvas(new Blob([Uint8Array.from(image.bytes).buffer], { type: JPG_MIME }));
    let map = null;
    try {
      if (source.reorderState === "required") {
        map = source.reorderMap;
        if (!Array.isArray(map) || map.length === 0) {
          throw new MappingMissingError(__eldT("mappingMissing", { page }));
        }
        try {
          validateMap(map, image.width, image.height);
        } catch (error) {
          throw new InvalidMappingError(__eldT("mappingInvalid", { page, detail: error instanceof Error ? error.message : String(error) }));
        }
        const reordered = document.createElement("canvas");
        reordered.width = image.width;
        reordered.height = image.height;
        const context = reordered.getContext("2d");
        if (!context) {
          releaseCanvas(reordered);
          throw new CodecError(__eldT("reorderCanvasFailed"));
        }
        for (const rect of map) {
          context.drawImage(canvas, rect.inputX, rect.inputY, rect.width, rect.height, rect.outputX, rect.outputY, rect.width, rect.height);
        }
        releaseCanvas(canvas);
        canvas = reordered;
      }
      if (metadataSize && metadataSize.width <= canvas.width && metadataSize.height <= canvas.height && (metadataSize.width !== canvas.width || metadataSize.height !== canvas.height)) {
        const cropped = document.createElement("canvas");
        cropped.width = metadataSize.width;
        cropped.height = metadataSize.height;
        const context = cropped.getContext("2d");
        if (!context) {
          releaseCanvas(cropped);
          throw new CodecError(__eldT("cropCanvasFailed"));
        }
        context.drawImage(canvas, 0, 0);
        releaseCanvas(canvas);
        canvas = cropped;
      }
      const movedRectangles = map?.filter((rect) => rect.inputX !== rect.outputX || rect.inputY !== rect.outputY) ?? [];
      return {
        canvas,
        ...(map ? {
          nfbrRectangleCount: map.length,
          nfbrMovedRectangleCount: movedRectangles.length,
          nfbrMovedArea: movedRectangles.reduce((sum, rect) => sum + rect.width * rect.height, 0),
          nfbrMappingSource: source.sourceKind === "purchased" ? "viewer_image:n4q+Z1P" : "configuration_pack.json"
        } : {})
      };
    } catch (error) {
      releaseCanvas(canvas);
      throw error;
    }
  }
  async function capturePage(page, source, settings, store) {
    const captureStartedAt = nowMilliseconds();
    const stageTimings = {
      dctMs: 0,
      extractMs: 0,
      reorderMs: 0,
      cropMs: 0,
      jpgEncodeMs: 0,
      encodeMs: 0,
      storeMs: 0,
      pdfMs: 0,
      totalMs: 0
    };
    __eldThrowIfAborted(session.abortController?.signal);
    const metadataSize = detectedImageSize(page);
    const fastDirectArchive = Boolean(
      settings.jpgLossless &&
      settings.matchMetadata &&
      settings.imageFormat === "jpg" &&
      !settings.detectTextPages &&
      !settings.imageToText &&
      settings.packFormat !== "pdf"
    );
    if (fastDirectArchive) {
      // The vendored coefficient writer is used only for this explicit JPG-lossless
      // path. PNG/WebP/JXL/PDF/resized JPG paths reorder pixels directly and use their
      // own browser/WASM encoders, avoiding an unnecessary JPG decode/re-encode cycle.
      const restoreStartedAt = nowMilliseconds();
      const directJpg = await restorePageJpg(page, source, metadataSize);
      const sourceMode = directJpg.sourceMode;
      stageTimings.losslessMs = nowMilliseconds() - restoreStartedAt;
      stageTimings.dctMs = Number(directJpg.dctMilliseconds) || 0;
      stageTimings.extractMs = Number(directJpg.dctTimings?.extractMs) || 0;
      stageTimings.reorderMs = Number(directJpg.dctTimings?.reorderMs) || 0;
      stageTimings.cropMs = Number(directJpg.dctTimings?.cropMs) || 0;
      stageTimings.jpgEncodeMs = Number(directJpg.dctTimings?.jpgEncodeMs) || 0;
      if (sourceMode === "nfbr") {session.losslessPages++;}
      else if (sourceMode === "passthrough") {session.passthroughPages++;}
      const number = String(page).padStart(4, "0");
      const storageKey = `page-${number}`;
      const storeStartedAt = nowMilliseconds();
      await store.put(storageKey, directJpg.blob);
      stageTimings.storeMs = nowMilliseconds() - storeStartedAt;
      stageTimings.totalMs = nowMilliseconds() - captureStartedAt;
      return {
        pageNumber: page,
        filename: `page-${number}.jpg`,
        storageKey,
        extension: "jpg",
        width: directJpg.width,
        height: directJpg.height,
        byteLength: directJpg.blob.size,
        textPage: false,
        preservation: directJpg.preservation,
        stageTimings,
        ...directJpg.sampling ? { jpgSampling: directJpg.sampling } : {},
        ...directJpg.nfbrRectangleCount !== void 0 ? { nfbrRectangleCount: directJpg.nfbrRectangleCount } : {},
        ...directJpg.nfbrMovedRectangleCount !== void 0 ? { nfbrMovedRectangleCount: directJpg.nfbrMovedRectangleCount } : {},
        ...directJpg.nfbrMovedArea !== void 0 ? { nfbrMovedArea: directJpg.nfbrMovedArea } : {},
        ...directJpg.nfbrMappingSource ? { nfbrMappingSource: directJpg.nfbrMappingSource } : {},
        ...source.imageUrl ? { sourceUrl: source.imageUrl } : {}
      };
    }

    const pixelSource = await canvasFromNormalizedSource(page, source, metadataSize);
    const sourceCanvas = pixelSource.canvas;

    const targetWidth = settings.matchMetadata ? metadataSize?.width ?? sourceCanvas.width : settings.width;
    const targetHeight = settings.matchMetadata ? metadataSize?.height ?? sourceCanvas.height : settings.height;
    let prepared;
    try {
      prepared = prepareCanvasPage(sourceCanvas, { width: targetWidth, height: targetHeight, preserveAspectRatio: settings.preserveAspectRatio });
    } finally {
      releaseCanvas(sourceCanvas);
    }
    session.fallbackPages++;
    let encoded;
    let ocrPromise;
    let canvasOwnedByOcr = false;
    try {
      if (settings.packFormat === "pdf") {
        const encodeStartedAt = nowMilliseconds();
        encoded = { blob: await jpgBlobFromCanvas(prepared.canvas, settings.jpgQuality), extension: "jpg", width: prepared.width, height: prepared.height, analysis: prepared.analysis };
        stageTimings.encodeMs = nowMilliseconds() - encodeStartedAt;
      } else {
        const encodeStartedAt = nowMilliseconds();
        encoded = await encodePreparedPage(prepared, {
          format: settings.imageFormat, reduceTextColors: settings.detectTextPages, pngCompression: settings.pngCompression, jpgQuality: settings.jpgQuality,
          jxlLossless: settings.jxlLossless, jxlQuality: settings.jxlQuality, jxlEffort: settings.jxlEffort, webpLossless: settings.webpLossless, webpQuality: settings.webpQuality, webpMethod: settings.webpMethod
        }, session.abortController?.signal);
        stageTimings.encodeMs = nowMilliseconds() - encodeStartedAt;
      }
      if (settings.imageToText) {
        reportStatusKey("ocrQueued", { page });
        const queued = await __eldQueueOcr(prepared.canvas, session.abortController?.signal);
        ocrPromise = queued.promise;
        canvasOwnedByOcr = true;
      }
    } finally {
      if (!canvasOwnedByOcr) {releaseCanvas(prepared.canvas);}
    }
    const blob = encoded.blob;
    const extension = encoded.extension;
    const preservation = extension === "png" || extension === "jxl" && settings.jxlLossless || extension === "webp" && settings.webpLossless ? "canvas-pixel-lossless" : "canvas-reencoded";
    const number = String(page).padStart(4, "0");
    const storageKey = `page-${number}`;
    const storeStartedAt = nowMilliseconds();
    await store.put(storageKey, blob);
    stageTimings.storeMs = nowMilliseconds() - storeStartedAt;
    const pdfStorageKey = settings.packFormat === "pdf" ? storageKey : void 0;
    stageTimings.totalMs = nowMilliseconds() - captureStartedAt;
    return {
      pageNumber: page, filename: `page-${number}.${extension}`, storageKey, byteLength: blob.size,
      ...pdfStorageKey ? { pdfStorageKey } : {}, extension, width: encoded.width, height: encoded.height, textPage: encoded.analysis.isTextPage,
      ...ocrPromise ? { __ocrPromise: ocrPromise } : {}, preservation,
      stageTimings,
      ...pixelSource.nfbrRectangleCount !== void 0 ? { nfbrRectangleCount: pixelSource.nfbrRectangleCount } : {},
      ...pixelSource.nfbrMovedRectangleCount !== void 0 ? { nfbrMovedRectangleCount: pixelSource.nfbrMovedRectangleCount } : {},
      ...pixelSource.nfbrMovedArea !== void 0 ? { nfbrMovedArea: pixelSource.nfbrMovedArea } : {},
      ...pixelSource.nfbrMappingSource ? { nfbrMappingSource: pixelSource.nfbrMappingSource } : {},
      ...source.imageUrl ? { sourceUrl: source.imageUrl } : {},
      ...source.loadId === void 0 ? {} : { viewerLoadId: source.loadId }
    };
  }
  async function createPackage(title, settings, store, pages) {
    if (settings.packFormat === "pdf") {return { blob: await buildPdf(pages, store), extension: "pdf", pages };}
    if (settings.packFormat === "epub") {return { blob: await buildEpub(title, pages, store), extension: "epub", pages };}
    return {
      blob: await buildZip(title, pages, store, settings.packFormat === "cbz"),
      extension: settings.packFormat,
      pages
    };
  }
  async function createPackages(title, settings, store) {
    const canSplit = ["zip", "cbz", "pdf", "epub"].includes(settings.packFormat);
    const partSize = canSplit ? settings.volumePages : 0;
    const groups = [];
    if (partSize > 0 && session.pages.length > partSize) {
      for (let index = 0; index < session.pages.length; index += partSize) {groups.push(session.pages.slice(index, index + partSize));}
    } else {
      groups.push(session.pages);
    }
    const outputs = [];
    for (const [index, pages] of groups.entries()) {
      __eldThrowIfAborted(session.abortController?.signal);
      const partTitle = groups.length > 1 ? `${title}_part${String(index + 1).padStart(2, "0")}_${String(pages[0].pageNumber).padStart(4, "0")}-${String(pages.at(-1).pageNumber).padStart(4, "0")}` : title;
      outputs.push({ ...(await createPackage(partTitle, settings, store, pages)), title: partTitle });
      await yieldToBrowser();
    }
    return outputs;
  }
  async function acquireWakeLock() {
    try {
      wakeLock = await navigator.wakeLock?.request("screen");
    } catch {
      wakeLock = void 0;
    }
  }
  async function releaseWakeLock() {
    try {
      await wakeLock?.release();
    } catch {
      /* Intentionally ignored. */
    }
    wakeLock = void 0;
  }
  function delayWithSignal(milliseconds, signal) {
    __eldThrowIfAborted(signal);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        signal?.removeEventListener("abort", abort);
        resolve();
      }, milliseconds);
      const abort = () => {
        clearTimeout(timer);
        reject(signal?.reason ?? __eldAbortError());
      };
      signal?.addEventListener("abort", abort, { once: true });
    });
  }
  function isAbort(error) {
    return error?.name === "AbortError" || /Download stopped\.?/iu.test(error instanceof Error ? error.message : String(error));
  }
  async function runDownload() {
    if (session.state !== "idle") {
      if (session.state === "packaging") {
        reportStatusKey("finishCurrentVolume");
        return;
      }
      session.state = "stopping";
      session.stopRequested = true;
      session.abortController?.abort(__eldAbortError());
      __eldDisposeDctWorker("Download stopped.");
      __eldDisposeImageWorker("Download stopped.");
      __eldDisposeOcrWorker();
      reportStatusKey("stoppingThenPackage", { count: session.pages.length });
      updateUi();
      return;
    }

    const runId = session.runId + 1;
    const abortController = new AbortController();
    Object.assign(session, {
      state: "initializing",
      stopRequested: false,
      abortController,
      runId,
      total: 0,
      current: 0,
      pages: [],
      failures: [],
      failureDetails: [],
      losslessPages: 0,
      passthroughPages: 0,
      fallbackPages: 0,
      pageTimings: [],
      aggregateTimings: createEmptyTimingTotals()
    });
    activePageSource.activeSignal = abortController.signal;
    updateUi();
    let store;
    let abortedByUser = false;
    try {
      reportStatusKey("readingPageInfo");
      const catalogReady = await activePageSource.ensureBookConfiguration(abortController.signal);
      __eldThrowIfAborted(abortController.signal);
      if (!catalogReady || activePageSource.catalogTotalPages() === 0) {
        const bridge = __ELD_CORE_STATE__.status ?? null;
        const diagnostic = __eldDeveloperEnabled() ? `；bridge=${bridge?.nfbrFound ? (bridge.wrapped ? "NFBR已挂接" : "NFBR存在但未挂接") : "尚未发现NFBR"}` : "";
        throw new DownloadError(__eldT("catalogInitFailed", { diagnostic }), "catalog", false);
      }
      const settings = readSettings();
      if (settings.endPage < settings.startPage || totalPages() === 0) {
        throw new DownloadError(__eldT("rangeInvalid"), "range", false);
      }
      reportStatusKey("preparingDownload");
      await __eldEnsureRuntimeDependencies(settings, abortController.signal);
      __eldThrowIfAborted(abortController.signal);
      const warmups = [];
      if (settings.packFormat !== "pdf" && (settings.imageFormat === "webp" || settings.imageFormat === "jxl")) {
        warmups.push(__eldWarmImageCodecs([settings.imageFormat], abortController.signal));
      }
      if (settings.imageToText) {warmups.push(__eldEnsureOcrPool(abortController.signal));}
      if (warmups.length > 0) {
        reportStatusKey("preparingComponents");
        await Promise.all(warmups);
        __eldThrowIfAborted(abortController.signal);
      }

      Object.assign(session, {
        state: "running",
        total: settings.endPage - settings.startPage + 1,
        runStartedAt: nowMilliseconds()
      });
      store = new PageStore(crypto.randomUUID().replaceAll("-", ""));
      await acquireWakeLock();
      updateUi();

      const startPrefetch = (page) => {
        void activePageSource.prefetchWindow(page, settings.endPage, abortController.signal).catch((error) => {
          if (!isAbort(error)) {__eldDevDebug("[EbookLosslessDownloader 0.5.0] rolling prefetch deferred", error);}
        });
      };
      startPrefetch(settings.startPage);

      for (let page = settings.startPage; page <= settings.endPage; page++) {
        if (abortController.signal.aborted) {
          abortedByUser = true;
          break;
        }
        session.absolutePage = page;
        session.current = page - settings.startPage + 1;
        updateUi();
        await yieldToBrowser();

        let captured = false;
        const pageTiming = createEmptyTimingTotals();
        pageTiming.page = page;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            reportStatusKey("preparingPage", { page, current: session.current, total: session.total });
            const prepareStartedAt = nowMilliseconds();
            const source = await activePageSource.preparePage(page, { signal: abortController.signal });
            pageTiming.prepareMs += nowMilliseconds() - prepareStartedAt;
            if (!source) {throw new DownloadError(__eldT("deterministicSourceFailed", { page }), "page-source", false);}

            reportStatusKey("processingPage", { page, current: session.current, total: session.total });
            const captureStartedAt = nowMilliseconds();
            const capturedPage = await capturePage(page, source, settings, store);
            pageTiming.captureMs += nowMilliseconds() - captureStartedAt;
            addTimingTotals(pageTiming, capturedPage.stageTimings);
            pageTiming.totalMs = pageTiming.prepareMs + pageTiming.captureMs;
            session.pages.push(capturedPage);
            session.pageTimings.push({
              page,
              preservation: capturedPage.preservation,
              prepareMs: roundedMilliseconds(pageTiming.prepareMs),
              captureMs: roundedMilliseconds(pageTiming.captureMs),
              dctMs: roundedMilliseconds(pageTiming.dctMs),
              extractMs: roundedMilliseconds(pageTiming.extractMs),
              reorderMs: roundedMilliseconds(pageTiming.reorderMs),
              cropMs: roundedMilliseconds(pageTiming.cropMs),
              jpgEncodeMs: roundedMilliseconds(pageTiming.jpgEncodeMs),
              encodeMs: roundedMilliseconds(pageTiming.encodeMs),
              storeMs: roundedMilliseconds(pageTiming.storeMs),
              pdfMs: roundedMilliseconds(pageTiming.pdfMs),
              totalMs: roundedMilliseconds(pageTiming.totalMs)
            });
            addTimingTotals(session.aggregateTimings, pageTiming);
            logPageTiming(page, pageTiming, capturedPage.preservation);
            captured = true;
            startPrefetch(page + 1);
            await yieldToBrowser();
            break;
          } catch (error) {
            if (isAbort(error)) {
              abortedByUser = true;
              break;
            }
            const detail = error instanceof Error ? error.message : String(error);
            const retryable = error instanceof DownloadError ? error.retryable : false;
            const finalAttempt = !retryable || attempt === 3;
            reportStatus(__eldT("pageFailed", { page, retry: retryable ? (__eldLanguage === "en" ? ` (${attempt}/3)` : `（${attempt}/3）`) : "", detail }));
            if (finalAttempt) {
              session.failureDetails.push(__eldT("pageFailureRecord", { page, detail }));
              console.error("[EbookLosslessDownloader]", error);
              break;
            }
            if (error instanceof AuthenticationError) {await activePageSource.refreshAuthorization(abortController.signal);}
            await delayWithSignal(300 * attempt, abortController.signal);
          }
        }
        if (!captured && !abortedByUser) {session.failures.push(page);}
        if (abortedByUser) {break;}
      }

      if (session.pages.length === 0) {
        if (abortedByUser) {throw new DownloadError(__eldT("stoppedNoPages"), "empty", false);}
        throw new DownloadError(__eldT("noSuccessfulPages", { detail: session.failureDetails[0] ? ` ${session.failureDetails[0]}` : "" }), "empty", false);
      }
      session.pages.sort((left, right) => left.pageNumber - right.pageNumber);

      // Stopping cancels all fetch/codec work immediately. Packaging gets a fresh
      // controller so already completed pages can still be written as requested.
      session.abortController = new AbortController();
      activePageSource.activeSignal = session.abortController.signal;
      session.state = "packaging";
      updateUi();
      if (settings.imageToText) {
        reportStatusKey(abortedByUser ? "finishingOcr" : "pagesDoneFinishingOcr");
        await __eldDrainOcrJobs(session.pages, session.abortController.signal, abortedByUser);
      }
      abortedByUser ? reportStatusKey("stoppedPackaging", { count: session.pages.length }) : reportStatusKey("generatingEbook");
      const title = sanitizeFilename((activePageSource.bookInfo.title ?? document.title.replace(/\s*[-|].*BOOK.?WALKER.*$/iu, "")) || "book");
      const packageStartedAt = nowMilliseconds();
      const outputs = await createPackages(title, settings, store);
      session.aggregateTimings.packageMs = nowMilliseconds() - packageStartedAt;
      session.aggregateTimings.totalMs = nowMilliseconds() - session.runStartedAt;
      for (const output of outputs) {
        downloadBlob(output.blob, `${output.title}.${output.extension}`);
        await yieldToBrowser();
      }
      const developer = __eldDeveloperEnabled();
      logRunTimingSummary();
      reportStatusKey("finalSummary", {
        aborted: abortedByUser,
        pageCount: session.pages.length,
        outputCount: outputs.length,
        failurePages: [...session.failures],
        developer,
        losslessPages: session.losslessPages,
        passthroughPages: session.passthroughPages,
        fallbackPages: session.fallbackPages,
        timing: { ...session.aggregateTimings }
      });
    } catch (error) {
      if (!isAbort(error) || session.pages.length === 0) {reportStatus(error instanceof Error ? error.message : String(error));}
    } finally {
      activePageSource.activeSignal = void 0;
      session.state = "idle";
      session.stopRequested = false;
      session.abortController = null;
      updateUi();
      await releaseWakeLock();
      if (store) {
        await store.clear();
        store.scheduleArchiveCleanup();
      }
      __eldDisposeDctWorker("DCT worker released.");
      __eldDisposeImageWorker("Image encoding worker released.");
      __eldDisposeOcrWorker();
    }
  }

  function updateSplitControls() {
    const split = inputById("eld-split-volume");
    const volume = inputById("eld-volume-pages");
    const splitRow = byId("eld-split-row");
    const volumeRow = byId("eld-volume-pages-row");
    if (split) {split.disabled = false;}
    if (splitRow) {splitRow.hidden = false;}
    if (volume) {volume.disabled = !split?.checked;}
    if (volumeRow) {volumeRow.hidden = !split?.checked;}
  }
  function updateQualityVisibility() {
    const pdf = selectedRadio("eld-pack-format", "zip") === "pdf";
    if (pdf) {
      const jpg = document.querySelector('input[name="eld-image-format"][value="jpg"]');
      if (jpg instanceof HTMLInputElement) {jpg.checked = true;}
    }
    const format = selectedRadio("eld-image-format", "jpg");
    const formatGrid = byId("eld-image-format-grid");
    const jpg2 = byId("eld-jpg-options");
    const jxl = byId("eld-jxl-options");
    const png = byId("eld-png-options");
    const webp = byId("eld-webp-options");
    if (formatGrid) {formatGrid.setAttribute("aria-disabled", pdf ? "true" : "false");}
    for (const radio of document.querySelectorAll('input[name="eld-image-format"]')) {radio.disabled = pdf;}
    if (jpg2) {jpg2.hidden = format !== "jpg";}
    if (jxl) {jxl.hidden = format !== "jxl";}
    if (png) {png.hidden = format !== "png";}
    if (webp) {webp.hidden = format !== "webp";}
    updateSplitControls();
  }
  function updateSpecialQuality(inputId, labelId, losslessLabel, allowLossless) {
    const input = inputById(inputId);
    const label = byId(labelId);
    if (!input || !label) {return;}
    let value = Number.parseInt(input.value, 10);
    if (!Number.isFinite(value)) {value = 100;}
    if (!allowLossless && value > 100) {value = 100;}
    else if (value > 100) {value = value >= LOSSLESS_SLIDER_THRESHOLD ? LOSSLESS_SLIDER_VALUE : 100;}
    const sliderMaximum = allowLossless ? LOSSLESS_SLIDER_VALUE : 100;
    input.max = String(sliderMaximum);
    input.value = String(value);
    const lossless = allowLossless && value >= LOSSLESS_SLIDER_THRESHOLD;
    const qualityStop = allowLossless ? 100 / LOSSLESS_SLIDER_VALUE * 100 : 100;
    const fillStop = Math.min(100, value) / sliderMaximum * 100;
    const shell = input.closest(".eld-special-slider-shell");
    input.style.setProperty("--eld-quality-stop", `${qualityStop}%`);
    input.style.setProperty("--eld-fill-stop", `${fillStop}%`);
    shell?.style.setProperty("--eld-quality-stop", `${qualityStop}%`);
    shell?.style.setProperty("--eld-fill-stop", `${fillStop}%`);
    label.textContent = lossless ? __eldT(losslessLabel) : String(Math.min(100, value));
    input.setAttribute("aria-valuetext", label.textContent);
    input.classList.toggle("lossless-selected", lossless);
    input.classList.toggle("lossless-available", allowLossless);
    shell?.classList.toggle("lossless-available", allowLossless);
    label.classList.toggle("lossless-selected", lossless);
    shell?.classList.toggle("lossless-selected", lossless);
  }
  function updateJpgControls(resetToEndpoint = false) {
    const matched = checked("eld-match-meta");
    const quality = inputById("eld-jpg-quality");
    if (quality && resetToEndpoint) {quality.value = matched ? String(LOSSLESS_SLIDER_VALUE) : "100";}
    updateSpecialQuality("eld-jpg-quality", "eld-jpg-value", "dctLossless", matched);
  }
  function updateMetadata() {
    const total = totalPages();
    const readerReady = total > 0 && activePageSource.catalogTotalPages() > 0;
    const widthInput = inputById("eld-width");
    const heightInput = inputById("eld-height");
    const startInput = inputById("eld-start");
    const endInput = inputById("eld-end");
    const matchMetadata = checked("eld-match-meta");
    for (const input of [widthInput, heightInput]) {
      if (!input) {continue;}
      input.readOnly = matchMetadata;
      input.setAttribute("aria-disabled", matchMetadata ? "true" : "false");
    }
    const pageSummary = byId("eld-page-summary");
    const metaLabel = byId("eld-meta-size");
    if (!readerReady) {
      if (pageSummary) {pageSummary.textContent = __eldT("waitingReader");}
      if (metaLabel) {metaLabel.textContent = __eldT("detecting");}
      // 阅读器尚未真正就绪时四个数值框保持空白。不要把网络预加载到的
      // 尺寸或默认 1/总页数提前写进输入框。
      for (const input of [startInput, endInput, widthInput, heightInput]) {
        if (input?.dataset.eldAutoFilled === "true") {
          input.value = "";
          delete input.dataset.eldAutoFilled;
        }
      }
      if (session.state === "idle" && statusState.type === "key" && ["waitingReader", "ready"].includes(statusState.key)) {
        reportStatusKey("waitingReader");
      }
      return;
    }
    const size = detectedImageSize();
    if (pageSummary) {pageSummary.textContent = __eldT("totalPages", { count: total });}
    for (const input of [startInput, endInput]) {if (input) {input.max = String(total);}}
    if (startInput && !startInput.value && document.activeElement !== startInput) {
      startInput.value = "1";
      startInput.dataset.eldAutoFilled = "true";
    }
    if (endInput && !endInput.value && document.activeElement !== endInput) {
      endInput.value = String(total);
      endInput.dataset.eldAutoFilled = "true";
      delete endInput.dataset.fillWhenReady;
    }
    if (size) {
      metadataRatio = size.width / size.height;
      if (metaLabel) {metaLabel.textContent = `${size.width} × ${size.height}`;}
      if (matchMetadata) {
        if (widthInput) {
          widthInput.value = String(size.width);
          widthInput.dataset.eldAutoFilled = "true";
        }
        if (heightInput) {
          heightInput.value = String(size.height);
          heightInput.dataset.eldAutoFilled = "true";
        }
      } else {
        if (widthInput && !widthInput.value && document.activeElement !== widthInput) {
          widthInput.value = String(size.width);
          widthInput.dataset.eldAutoFilled = "true";
        }
        if (heightInput && !heightInput.value && document.activeElement !== heightInput) {
          heightInput.value = String(size.height);
          heightInput.dataset.eldAutoFilled = "true";
        }
      }
    } else if (metaLabel) {
      metaLabel.textContent = __eldT("detecting");
    }
    if (session.state === "idle" && statusState.type === "key" && statusState.key === "waitingReader") {
      reportStatusKey("ready");
    }
  }
  function updateUi() {
    updateMetadata();
    updateDeveloperUi();
    updateSplitControls();
    if (startButton) {
      const labels = {
        idle: "startDownload",
        initializing: "stopInitializing",
        running: "stopAndPackage",
        stopping: "stopping",
        packaging: "packaging"
      };
      startButton.textContent = __eldT(labels[session.state] ?? "startDownload");
      startButton.classList.toggle("stopping", session.state === "running" || session.state === "stopping");
      startButton.disabled = session.state === "stopping" || session.state === "packaging";
    }
    if (progressElement) {
      const percent = session.total > 0 ? Math.round(session.current / session.total * 100) : 0;
      progressElement.style.width = `${percent}%`;
      progressElement.parentElement?.setAttribute("aria-valuenow", String(percent));
      progressElement.parentElement?.setAttribute("aria-valuemin", "0");
      progressElement.parentElement?.setAttribute("aria-valuemax", "100");
    }
  }
  function updateDeveloperUi() {
    const version = buttonById("eld-version");
    const enabled = __eldDeveloperEnabled();
    panel?.classList.toggle("eld-developer-enabled", enabled);
    if (version) {
      version.textContent = enabled ? `${__ELD_VERSION__} ${__eldT("developerMode")}` : __ELD_VERSION__;
      version.setAttribute("aria-label", __eldT(enabled ? "versionCloseDeveloper" : "version", { version: __ELD_VERSION__ }));
      version.setAttribute("aria-pressed", enabled ? "true" : "false");
    }
  }
  function bindDeveloperModeUnlock() {
    const version = buttonById("eld-version");
    let clicks = [];
    version?.addEventListener("click", () => {
      if (__eldDeveloperEnabled()) {
        clicks = [];
        __eldSetDeveloperEnabled(false);
        __eldSetDeveloperUnlocked(false);
        updateDeveloperUi();
        return;
      }
      const now = Date.now();
      clicks = clicks.filter((timestamp) => now - timestamp <= 1800);
      clicks.push(now);
      if (clicks.length < 5) {return;}
      clicks = [];
      __eldSetDeveloperUnlocked(true);
      __eldSetDeveloperEnabled(true);
      updateDeveloperUi();
    });
    updateDeveloperUi();
  }

  function applyUiLanguage() {
    if (!panel) {return;}
    panel.lang = __eldLanguage === "zh-CN" ? "zh-CN" : __eldLanguage;
    panel.setAttribute("aria-label", __eldT("productName"));
    for (const element of panel.querySelectorAll("[data-eld-i18n]")) {
      element.textContent = __eldT(element.dataset.eldI18n);
    }
    for (const element of panel.querySelectorAll("[data-eld-i18n-title]")) {
      const text = __eldT(element.dataset.eldI18nTitle);
      element.setAttribute("title", text);
      element.setAttribute("aria-label", text);
    }
    const languageButton = buttonById("eld-language-button");
    if (languageButton) {
      languageButton.setAttribute("aria-label", __eldT("chooseLanguage"));
      languageButton.setAttribute("title", __eldT("chooseLanguage"));
    }
    for (const option of panel.querySelectorAll("[data-eld-language]")) {
      const selected = option.dataset.eldLanguage === __eldLanguage;
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-checked", selected ? "true" : "false");
    }
    updateDeveloperUi();
    updateMetadata();
    updateJpgControls();
    updateSpecialQuality("eld-jxl-quality", "eld-jxl-value", "lossless", true);
    updateSpecialQuality("eld-webp-quality", "eld-webp-quality-value", "lossless", true);
    refreshStatusText();
    if (startButton) {
      const labels = {
        idle: "startDownload",
        initializing: "stopInitializing",
        running: "stopAndPackage",
        stopping: "stopping",
        packaging: "packaging"
      };
      startButton.textContent = __eldT(labels[session.state] ?? "startDownload");
    }
  }
  function closeLanguageMenu() {
    const menu = byId("eld-language-menu");
    const button = buttonById("eld-language-button");
    if (menu) {menu.hidden = true;}
    button?.setAttribute("aria-expanded", "false");
  }
  function bindLanguageSelector() {
    const picker = byId("eld-language-picker");
    const button = buttonById("eld-language-button");
    const menu = byId("eld-language-menu");
    button?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!menu) {return;}
      const opening = menu.hidden;
      menu.hidden = !opening;
      button.setAttribute("aria-expanded", opening ? "true" : "false");
    });
    for (const option of panel?.querySelectorAll("[data-eld-language]") ?? []) {
      option.addEventListener("click", () => {
        __eldPersistLanguage(option.dataset.eldLanguage);
        applyUiLanguage();
        closeLanguageMenu();
      });
    }
    document.addEventListener("click", (event) => {
      if (picker && !picker.contains(event.target)) {closeLanguageMenu();}
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {closeLanguageMenu();}
    });
    applyUiLanguage();
  }

  function bindPanel() {
    statusElement = byId("eld-status");
    progressElement = byId("eld-progress");
    startButton = buttonById("eld-start-download");
    bindDeveloperModeUnlock();
    bindLanguageSelector();
    startButton?.addEventListener("click", () => void runDownload());
    byId("eld-close")?.addEventListener("click", () => {
      if (panel) {panel.hidden = true;}
    });
    byId("eld-minimize")?.addEventListener("click", () => byId("eld-body")?.classList.toggle("collapsed"));
    for (const radio of Array.from(document.querySelectorAll('input[name="eld-image-format"]'))) {
      radio.addEventListener("change", updateQualityVisibility);
    }
    for (const radio of Array.from(document.querySelectorAll('input[name="eld-pack-format"]'))) {
      radio.addEventListener("change", updateQualityVisibility);
    }
    inputById("eld-split-volume")?.addEventListener("change", updateSplitControls);
    const bindSpecialQuality = (inputId, labelId, losslessLabel, allowLossless) => {
      const input = inputById(inputId);
      const update = () => updateSpecialQuality(inputId, labelId, losslessLabel, allowLossless());
      input?.addEventListener("input", update);
      input?.addEventListener("change", update);
    };
    bindSpecialQuality("eld-jpg-quality", "eld-jpg-value", "dctLossless", () => checked("eld-match-meta"));
    bindSpecialQuality("eld-jxl-quality", "eld-jxl-value", "lossless", () => true);
    bindSpecialQuality("eld-webp-quality", "eld-webp-quality-value", "lossless", () => true);

    const bindRangeLabel = (inputId, labelId) => {
      const input = inputById(inputId);
      const label = byId(labelId);
      input?.addEventListener("input", () => {
        if (label) {label.textContent = input.value;}
      });
    };
    bindRangeLabel("eld-png-compression", "eld-png-value");
    bindRangeLabel("eld-jxl-effort", "eld-jxl-effort-value");
    bindRangeLabel("eld-webp-method", "eld-webp-method-value");

    const bindPageRange = (id) => {
      const input = inputById(id);
      input?.addEventListener("input", () => delete input.dataset.eldAutoFilled);
      input?.addEventListener("blur", () => {
        const total = totalPages();
        if (!input.value && total > 0) {input.value = id === "eld-start" ? "1" : String(total);}
        if (!input.value) {return;}
        const fallback = id === "eld-start" ? 1 : Math.max(1, total);
        const value = readInteger(id, fallback);
        input.value = String(Math.max(1, total > 0 ? Math.min(total, value) : value));
      });
    };
    bindPageRange("eld-start");
    bindPageRange("eld-end");

    const widthInput = inputById("eld-width");
    const heightInput = inputById("eld-height");
    widthInput?.addEventListener("input", () => {
      delete widthInput.dataset.eldAutoFilled;
      if (!checked("eld-match-meta") && checked("eld-aspect") && metadataRatio > 0 && heightInput && widthInput.value) {
        heightInput.value = String(Math.max(1, Math.round(readInteger("eld-width", 1) / metadataRatio)));
      }
    });
    heightInput?.addEventListener("input", () => {
      delete heightInput.dataset.eldAutoFilled;
      if (!checked("eld-match-meta") && checked("eld-aspect") && metadataRatio > 0 && widthInput && heightInput.value) {
        widthInput.value = String(Math.max(1, Math.round(readInteger("eld-height", 1) * metadataRatio)));
      }
    });
    inputById("eld-match-meta")?.addEventListener("change", () => {
      updateMetadata();
      updateJpgControls(true);
    });

    updateSpecialQuality("eld-jxl-quality", "eld-jxl-value", "lossless", true);
    updateSpecialQuality("eld-webp-quality", "eld-webp-quality-value", "lossless", true);
    updateJpgControls();
    updateQualityVisibility();
    updateUi();
  }

  function createPanel() {
    if (byId("eld-panel")) {return;}
    const style = document.createElement("style");
    style.textContent = `
#eld-panel{
  --eld-primary:#a8c7fa;--eld-on-primary:#062e6f;--eld-primary-container:#0b57d0;--eld-on-primary-container:#d3e3fd;
  --eld-surface:#111318;--eld-surface-container:#1d1f24;--eld-surface-container-high:#282a2f;--eld-surface-container-highest:#33353a;
  --eld-on-surface:#e3e2e9;--eld-on-surface-variant:#c4c6d0;--eld-outline:#8e9099;--eld-outline-variant:#44474f;
  --eld-error:#ffb4ab;--eld-on-error:#690005;--eld-error-container:#93000a;--eld-lossless:#d0bcff;--eld-on-lossless:#381e72;--eld-shadow:#000;
  position:fixed;top:64px;right:18px;z-index:2147483647;width:min(400px,calc(100vw - 24px));color-scheme:dark;
  font:650 13px/1.45 system-ui,-apple-system,"Segoe UI","Noto Sans SC","Noto Sans JP","Yu Gothic UI","Yu Gothic","Microsoft YaHei",sans-serif;color:var(--eld-on-surface);
  background:var(--eld-surface);border:1px solid var(--eld-outline-variant);border-radius:28px;
  box-shadow:0 20px 60px color-mix(in srgb,var(--eld-shadow) 58%,transparent);overflow:hidden
}
#eld-panel *{box-sizing:border-box}
#eld-panel button,#eld-panel input{font:inherit}
#eld-panel button{color:inherit}
#eld-panel [hidden]{display:none!important}
#eld-panel .eld-header{display:flex;align-items:center;gap:8px;min-height:64px;padding:10px 12px 10px 18px;background:var(--eld-surface-container);border-bottom:1px solid var(--eld-outline-variant)}
#eld-panel .eld-brand{display:flex;align-items:center;gap:7px;min-width:0;flex:1;white-space:nowrap}
#eld-panel .eld-title{font-size:14px;font-weight:650;letter-spacing:.01em;overflow:hidden;text-overflow:ellipsis}
#eld-version{appearance:none;border:0;border-radius:999px;padding:4px 8px;background:var(--eld-surface-container-highest);color:var(--eld-on-surface-variant);font-size:11px;line-height:18px;cursor:pointer;user-select:none;white-space:nowrap;transition:background .15s,color .15s,transform .08s,font-size .15s}
#eld-version:hover{background:color-mix(in srgb,var(--eld-primary) 14%,var(--eld-surface-container-highest))}
#eld-version:active{transform:scale(.96)}
#eld-panel.eld-developer-enabled #eld-version{background:var(--eld-primary-container);color:var(--eld-on-primary-container);font-size:14px;font-weight:650}
#eld-panel .eld-window-actions{display:flex;gap:2px}
#eld-panel .eld-language-picker{position:relative;display:flex}
#eld-language-button{color:var(--eld-primary)}
#eld-panel .eld-translate-icon{position:relative;display:block;width:23px;height:21px;color:currentColor;font-weight:750;line-height:1}
#eld-panel .eld-translate-icon .eld-translate-han{position:absolute;left:0;top:0;font-size:16px;letter-spacing:-.08em}
#eld-panel .eld-translate-icon .eld-translate-a{position:absolute;right:0;bottom:-1px;font-size:14px;background:var(--eld-surface-container);border-radius:4px;padding:0 1px}
#eld-panel .eld-icon:hover .eld-translate-icon .eld-translate-a{background:var(--eld-surface-container-highest)}
#eld-language-menu{position:absolute;z-index:20;top:42px;right:-2px;min-width:150px;padding:6px;background:var(--eld-surface-container-high);border:1px solid var(--eld-outline-variant);border-radius:14px;box-shadow:0 10px 28px #0008}
#eld-language-menu button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:38px;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--eld-on-surface);text-align:left;cursor:pointer}
#eld-language-menu button:hover{background:var(--eld-surface-container-highest)}
#eld-language-menu button.selected{color:var(--eld-primary)}
#eld-language-menu .eld-language-check{opacity:0;font-size:15px}
#eld-language-menu button.selected .eld-language-check{opacity:1}
#eld-panel .eld-icon{width:36px;height:36px;border:0;border-radius:999px;background:transparent;color:var(--eld-on-surface-variant);font-size:18px;line-height:1;cursor:pointer;display:grid;place-items:center;transition:background .15s}
#eld-panel .eld-icon:hover{background:var(--eld-surface-container-highest)}
#eld-panel .eld-icon:focus-visible,#eld-version:focus-visible,#eld-panel input:focus-visible,#eld-panel button:focus-visible{outline:2px solid var(--eld-primary);outline-offset:2px}
#eld-body{padding:12px;max-height:calc(100vh - 96px);overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--eld-outline-variant) transparent}
#eld-body.collapsed{display:none}
#eld-panel .eld-section{padding:16px;margin:0 0 10px;background:var(--eld-surface-container);border-radius:20px}
#eld-panel .eld-section:last-of-type{margin-bottom:12px}
#eld-panel .eld-section-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px;font-size:14px;font-weight:650}
#eld-panel .eld-supporting{color:var(--eld-on-surface-variant);font-size:12px;font-weight:650}
#eld-panel .eld-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#eld-panel .eld-field{display:grid;gap:6px;color:var(--eld-on-surface-variant);font-size:12px}
#eld-panel input[type=number]{width:100%;height:42px;padding:8px 12px;color:var(--eld-on-surface);background:transparent;border:1px solid var(--eld-outline);border-radius:12px;transition:border-color .15s,background .15s}
#eld-panel input[type=number]:hover{background:color-mix(in srgb,var(--eld-on-surface) 4%,transparent)}
#eld-panel input[type=number]:focus{border-color:var(--eld-primary);box-shadow:inset 0 0 0 1px var(--eld-primary);outline:none}
#eld-panel input[readonly]{color:var(--eld-on-surface-variant);border-color:var(--eld-outline-variant);background:var(--eld-surface-container-high);cursor:not-allowed}
#eld-panel .eld-choices{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
#eld-panel .eld-choice{position:relative;text-align:center;min-width:0}
#eld-panel .eld-choice input{position:absolute;opacity:0;pointer-events:none}
#eld-panel .eld-choice span{display:block;min-height:38px;padding:9px 6px;border:1px solid var(--eld-outline);border-radius:999px;background:transparent;color:var(--eld-on-surface-variant);cursor:pointer;transition:background .15s,border-color .15s,color .15s}
#eld-panel .eld-choice span:hover{background:color-mix(in srgb,var(--eld-on-surface) 6%,transparent)}
#eld-panel .eld-choice input:checked+span{border-color:transparent;background:var(--eld-primary-container);color:var(--eld-on-primary-container);font-weight:650}
#eld-panel .eld-choice input:focus-visible+span{outline:2px solid var(--eld-primary);outline-offset:2px}
#eld-image-format-grid[aria-disabled=true]{opacity:.72;pointer-events:none}
#eld-panel .eld-control-group{padding-top:2px}
#eld-panel .eld-control-group+.eld-control-group{margin-top:12px}
#eld-panel .eld-label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0 6px;color:var(--eld-on-surface-variant)}
#eld-panel .eld-label:first-child{margin-top:0}
#eld-panel .eld-value{color:var(--eld-primary);font-variant-numeric:tabular-nums}
#eld-panel input[type=range]{width:100%;height:28px;margin:0;accent-color:var(--eld-primary);cursor:pointer}
#eld-panel input[type=range]:disabled{opacity:.45;cursor:not-allowed}
#eld-panel .eld-special-slider-shell{--eld-quality-stop:90.9091%;--eld-fill-stop:90.9091%;position:relative;width:100%;height:28px}
/* The visible track spans only the thumb-center travel range (10px inset at both ends).
   Therefore 100/110 lands exactly under the thumb center when the value is 100. */
#eld-panel .eld-special-slider-shell::before{content:"";position:absolute;z-index:0;left:10px;right:10px;top:11px;height:6px;border-radius:999px;pointer-events:none;background:linear-gradient(to right,var(--eld-primary) 0 var(--eld-fill-stop),var(--eld-outline-variant) var(--eld-fill-stop) 100%)}
#eld-panel .eld-special-slider-shell.lossless-available::before{background:linear-gradient(to right,var(--eld-primary) 0 var(--eld-fill-stop),var(--eld-outline-variant) var(--eld-fill-stop) var(--eld-quality-stop),color-mix(in srgb,var(--eld-lossless) 58%,var(--eld-outline-variant)) var(--eld-quality-stop) 100%)}
#eld-panel .eld-special-slider-shell.lossless-selected::before{background:linear-gradient(to right,var(--eld-primary) 0 var(--eld-quality-stop),var(--eld-lossless) var(--eld-quality-stop) 100%)}
#eld-panel .eld-special-slider-shell .eld-special-slider{appearance:none;-webkit-appearance:none;position:relative;z-index:1;display:block;height:28px;background:transparent;accent-color:auto}
#eld-panel .eld-special-slider::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:transparent}
#eld-panel .eld-special-slider::-moz-range-track{height:6px;border:0;border-radius:999px;background:transparent}
#eld-panel .eld-special-slider::-moz-range-progress{height:6px;background:transparent}
#eld-panel .eld-special-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;margin-top:-7px;border:3px solid var(--eld-on-surface);border-radius:50%;background:var(--eld-surface-container-highest);box-shadow:0 0 0 1px color-mix(in srgb,var(--eld-shadow) 38%,transparent)}
#eld-panel .eld-special-slider::-moz-range-thumb{width:20px;height:20px;border:3px solid var(--eld-on-surface);border-radius:50%;background:var(--eld-surface-container-highest);box-shadow:0 0 0 1px color-mix(in srgb,var(--eld-shadow) 38%,transparent)}
#eld-panel .eld-special-slider.lossless-selected::-webkit-slider-thumb{border-color:var(--eld-lossless)}
#eld-panel .eld-special-slider.lossless-selected::-moz-range-thumb{border-color:var(--eld-lossless)}
#eld-panel .eld-value.lossless-selected{color:var(--eld-lossless)}
#eld-panel .eld-checks{display:grid;gap:4px;margin-top:12px}
#eld-panel .eld-check-row{display:flex;align-items:center;gap:10px;min-height:38px;padding:6px 4px;border-radius:12px;color:var(--eld-on-surface);cursor:pointer}
#eld-panel .eld-check-row:hover{background:color-mix(in srgb,var(--eld-on-surface) 5%,transparent)}
#eld-panel .eld-check-row input[type=checkbox]{width:18px;height:18px;margin:0;accent-color:var(--eld-primary);flex:0 0 auto}
#eld-panel .eld-switch-row{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:44px;margin-top:10px}
#eld-panel .eld-row-title{font-weight:650}
#eld-panel .eld-inline-setting{margin-top:10px}
#eld-panel .eld-switch{position:relative;display:inline-flex;align-items:center;gap:7px;cursor:pointer;user-select:none}
#eld-panel .eld-switch-input{position:absolute;opacity:0;width:1px;height:1px}
#eld-panel .eld-switch-track{position:relative;width:52px;height:32px;border:2px solid var(--eld-outline);border-radius:999px;background:var(--eld-surface-container-highest);transition:background .18s,border-color .18s}
#eld-panel .eld-switch-track::after{content:"";position:absolute;top:50%;left:6px;width:16px;height:16px;border-radius:50%;background:var(--eld-outline);transform:translateY(-50%);transition:left .18s,width .18s,height .18s,background .18s}
#eld-panel .eld-switch-input:checked+.eld-switch-track{border-color:var(--eld-primary);background:var(--eld-primary)}
#eld-panel .eld-switch-input:checked+.eld-switch-track::after{left:24px;width:24px;height:24px;background:var(--eld-on-primary)}
#eld-panel .eld-switch-input:focus-visible+.eld-switch-track{outline:2px solid var(--eld-primary);outline-offset:2px}
#eld-panel .eld-switch-input:disabled+.eld-switch-track{opacity:.38;cursor:not-allowed}
#eld-panel .eld-switch-text{font-size:12px;color:var(--eld-on-surface-variant)}
#eld-status{min-height:44px;padding:12px 14px;margin:2px 0 10px;border-radius:16px;background:var(--eld-surface-container-high);color:var(--eld-on-surface-variant);overflow-wrap:anywhere}
#eld-progress-track{height:4px;background:var(--eld-surface-container-highest);border-radius:999px;overflow:hidden;margin:0 2px 12px}
#eld-progress{width:0;height:100%;background:var(--eld-primary);border-radius:999px;transition:width .15s ease}
#eld-start-download{width:100%;min-height:48px;border:0;border-radius:999px;padding:11px 18px;font-weight:650;letter-spacing:.01em;color:var(--eld-on-primary-container);background:var(--eld-primary-container);cursor:pointer;box-shadow:0 1px 2px #0006;transition:filter .15s,transform .08s,background .15s,color .15s}
#eld-start-download:hover{filter:brightness(1.05)}
#eld-start-download:active{transform:scale(.99)}
#eld-start-download.stopping{background:var(--eld-error);color:var(--eld-on-error)}
#eld-start-download:disabled{opacity:.5;cursor:wait;transform:none}
@media (max-width:440px){#eld-panel{top:12px;right:12px;width:calc(100vw - 24px)}#eld-panel .eld-title{font-size:13px}#eld-panel.eld-developer-enabled #eld-version{font-size:13px}}
`;
    document.documentElement.append(style);

    panel = document.createElement("section");
    panel.id = "eld-panel";
    panel.setAttribute("aria-label", __eldT("productName"));
    panel.innerHTML = `
<div class="eld-header">
  <div class="eld-brand">
    <span class="eld-title">EbookLosslessDownloader</span>
    <button id="eld-version" type="button" aria-pressed="false">${__ELD_VERSION__}</button>
  </div>
  <div class="eld-window-actions">
    <div id="eld-language-picker" class="eld-language-picker">
      <button id="eld-language-button" class="eld-icon" type="button" aria-haspopup="menu" aria-expanded="false">
        <span class="eld-translate-icon" aria-hidden="true"><span class="eld-translate-han">文</span><span class="eld-translate-a">A</span></span>
      </button>
      <div id="eld-language-menu" role="menu" hidden>
        <button type="button" role="menuitemradio" data-eld-language="zh-CN"><span data-eld-i18n="chinese">中文</span><span class="eld-language-check" aria-hidden="true">✓</span></button>
        <button type="button" role="menuitemradio" data-eld-language="en"><span data-eld-i18n="english">English</span><span class="eld-language-check" aria-hidden="true">✓</span></button>
        <button type="button" role="menuitemradio" data-eld-language="ja"><span data-eld-i18n="japanese">日本語</span><span class="eld-language-check" aria-hidden="true">✓</span></button>
      </div>
    </div>
    <button id="eld-minimize" class="eld-icon" type="button" data-eld-i18n-title="minimize">−</button>
    <button id="eld-close" class="eld-icon" type="button" data-eld-i18n-title="close">×</button>
  </div>
</div>
<div id="eld-body">
  <div class="eld-section">
    <div class="eld-section-title"><span data-eld-i18n="pageRange">页面范围</span><span id="eld-page-summary" class="eld-supporting" data-eld-i18n="waitingReader">等待阅读器…</span></div>
    <div class="eld-grid">
      <label class="eld-field"><span data-eld-i18n="startPage">起始页</span><input id="eld-start" type="number" min="1" inputmode="numeric"></label>
      <label class="eld-field"><span data-eld-i18n="endPage">结束页</span><input id="eld-end" type="number" min="1" inputmode="numeric"></label>
    </div>
  </div>

  <div class="eld-section">
    <div class="eld-section-title"><span data-eld-i18n="outputSize">输出尺寸</span><span id="eld-meta-size" class="eld-supporting" data-eld-i18n="detecting">检测中</span></div>
    <div class="eld-grid">
      <label class="eld-field"><span data-eld-i18n="width">宽</span><input id="eld-width" type="number" min="1" inputmode="numeric"></label>
      <label class="eld-field"><span data-eld-i18n="height">高</span><input id="eld-height" type="number" min="1" inputmode="numeric"></label>
    </div>
    <div class="eld-checks">
      <label class="eld-check-row"><input id="eld-match-meta" type="checkbox" checked><span data-eld-i18n="matchOriginalSize">匹配原图尺寸</span></label>
      <label class="eld-check-row"><input id="eld-aspect" type="checkbox" checked><span data-eld-i18n="keepAspectRatio">保持宽高比</span></label>
    </div>
  </div>

  <div class="eld-section">
    <div class="eld-section-title"><span data-eld-i18n="imageFormat">图片格式</span></div>
    <div id="eld-image-format-grid" class="eld-choices">
      <label class="eld-choice"><input type="radio" name="eld-image-format" value="jpg" checked><span>JPG</span></label>
      <label class="eld-choice"><input type="radio" name="eld-image-format" value="jxl"><span>JXL</span></label>
      <label class="eld-choice"><input type="radio" name="eld-image-format" value="png"><span>PNG</span></label>
      <label class="eld-choice"><input type="radio" name="eld-image-format" value="webp"><span>WEBP</span></label>
    </div>
    <div id="eld-jpg-options" class="eld-control-group">
      <div class="eld-label"><span data-eld-i18n="jpgQuality">JPG 质量</span><span id="eld-jpg-value" class="eld-value">DCT 无损</span></div>
      <div class="eld-special-slider-shell"><input id="eld-jpg-quality" class="eld-special-slider" type="range" min="0" max="110" value="110"></div>
    </div>
    <div id="eld-jxl-options" class="eld-control-group" hidden>
      <div class="eld-label"><span data-eld-i18n="jxlQuality">JXL 质量</span><span id="eld-jxl-value" class="eld-value">无损</span></div>
      <div class="eld-special-slider-shell"><input id="eld-jxl-quality" class="eld-special-slider" type="range" min="0" max="110" value="110"></div>
      <div class="eld-label"><span data-eld-i18n="compressionLevel">压缩等级</span><span id="eld-jxl-effort-value" class="eld-value">7</span></div>
      <input id="eld-jxl-effort" type="range" min="1" max="9" value="7">
    </div>
    <div id="eld-png-options" class="eld-control-group" hidden>
      <div class="eld-label"><span data-eld-i18n="pngCompression">PNG 压缩等级</span><span id="eld-png-value" class="eld-value">7</span></div>
      <input id="eld-png-compression" type="range" min="0" max="9" value="7">
    </div>
    <div id="eld-webp-options" class="eld-control-group" hidden>
      <div class="eld-label"><span data-eld-i18n="webpQuality">WEBP 质量</span><span id="eld-webp-quality-value" class="eld-value">无损</span></div>
      <div class="eld-special-slider-shell"><input id="eld-webp-quality" class="eld-special-slider" type="range" min="0" max="110" value="110"></div>
      <div class="eld-label"><span data-eld-i18n="compressionLevel">压缩等级</span><span id="eld-webp-method-value" class="eld-value">4</span></div>
      <input id="eld-webp-method" type="range" min="0" max="6" value="4">
    </div>
    <div class="eld-checks">
      <label class="eld-check-row"><input id="eld-detect-text" type="checkbox"><span data-eld-i18n="textPage4ColorPng">文本页自动转 4 色 PNG</span></label>
      <label class="eld-check-row"><input id="eld-ocr" type="checkbox"><span data-eld-i18n="imageToText">图片转文本</span></label>
    </div>
  </div>

  <div class="eld-section">
    <div class="eld-section-title"><span data-eld-i18n="packageFormat">打包格式</span></div>
    <div class="eld-choices">
      <label class="eld-choice"><input type="radio" name="eld-pack-format" value="zip" checked><span>ZIP</span></label>
      <label class="eld-choice"><input type="radio" name="eld-pack-format" value="cbz"><span>CBZ</span></label>
      <label class="eld-choice"><input type="radio" name="eld-pack-format" value="pdf"><span>PDF</span></label>
      <label class="eld-choice"><input type="radio" name="eld-pack-format" value="epub"><span>EPUB</span></label>
    </div>
    <div id="eld-split-row" class="eld-switch-row">
      <span class="eld-row-title" data-eld-i18n="splitVolumes">分卷</span>
      <label class="eld-switch" data-eld-i18n-title="splitVolumes">
        <input id="eld-split-volume" class="eld-switch-input" type="checkbox">
        <span class="eld-switch-track" aria-hidden="true"></span>
      </label>
    </div>
    <div id="eld-volume-pages-row" class="eld-inline-setting" hidden>
      <label class="eld-field"><span data-eld-i18n="pagesPerVolume">每卷页数</span><input id="eld-volume-pages" type="number" min="1" max="1000" value="100" inputmode="numeric"></label>
    </div>
  </div>

  <div id="eld-status" data-eld-i18n="waitingReader">等待阅读器…</div>
  <div id="eld-progress-track" role="progressbar" data-eld-i18n-title="downloadProgress"><div id="eld-progress"></div></div>
  <button id="eld-start-download" type="button" data-eld-i18n="startDownload">开始下载</button>
</div>`;
    document.documentElement.append(panel);
  }

  function boot() {
    createPanel();
    bindPanel();
    activePageSource.on("catalog-ready", updateUi);
    activePageSource.on("metadata-updated", updateUi);
    void activePageSource.ensureBookConfiguration().then(updateUi).catch((error) => {
      __eldDevDebug("[EbookLosslessDownloader 0.5.0] catalog warm-up deferred", error);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
