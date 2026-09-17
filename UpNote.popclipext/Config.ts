// #popclip
// name: UpNote
// identifier: net.getupnote.popclip.extension
// description: Create a new note, append to a specific note, or create in a specific notebook in UpNote.
// app: { name: UpNote, link: https://getupnote.com/ }
// popclip version: 4586
// icon: upnote.svg
// captureHtml: true
// entitlements: [script]

export const options = [
  {
    identifier: "targetNote",
    label: "特定筆記連結或 ID",
    type: "string",
    description:
      "在 UpNote 對特定筆記點右鍵選擇「複製筆記連結」後貼在此處（例如 upnote://x-callback-url/openNote?noteId=... 或直接貼上筆記 ID）。",
  },
  {
    identifier: "targetNotebook",
    label: "特定筆記本名稱",
    type: "string",
    description:
      "輸入 UpNote 中的筆記本名稱（例如「工作」或「筆記本/子筆記本」；用於「新增到特定筆記本」動作）。",
  },
  {
    identifier: "sourceLink",
    label: "包含來源網址",
    type: "boolean",
    defaultValue: true,
    description: "若選取的文字來自瀏覽器，自動在內容末端附加來源網址。",
  },
  {
    identifier: "includeTimestamp",
    label: "包含時間戳記",
    type: "boolean",
    defaultValue: false,
    description: "在插入或新增的文字開頭加上時間（如 - 14:30）。",
  },
] as const;

type Options = InferOptions<typeof options>;

function extractNoteId(value: string): string {
  if (!value) return "";
  const match = value.match(/noteId=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return value.trim();
}

function formatContent(
  input: Input,
  options: Options,
  context: Context,
): string {
  let content = (input.markdown || input.text || "").trim();
  if (options.includeTimestamp) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    content = `- ${timeStr} ${content}`;
  }
  if (options.sourceLink && context?.browserUrl) {
    const title = context?.browserTitle || "source";
    content += `\n\n[${title}](${context.browserUrl})`;
  }
  return content;
}

function newNote(input: Input, options: Options, context: Context) {
  try {
    const content = formatContent(input, options, context);
    const url = new URL("upnote://x-callback-url/note/new");
    url.searchParams.set("text", content);
    url.searchParams.set("markdown", "true");
    popclip.openUrl(url.href, { app: "com.getupnote.desktop", activate: true });
    popclip.showSuccess();
  } catch (err: any) {
    popclip.showText("錯誤: " + (err?.message || String(err)));
  }
}

function newNoteInNotebook(
  input: Input,
  options: Options,
  context: Context,
) {
  try {
    const notebook = (options.targetNotebook || "").trim();
    if (!notebook) {
      popclip.showText("請在設定中填入「特定筆記本名稱」");
      return;
    }
    const content = formatContent(input, options, context);
    const url = new URL("upnote://x-callback-url/note/new");
    url.searchParams.set("notebook", notebook);
    url.searchParams.set("text", content);
    url.searchParams.set("markdown", "true");
    popclip.openUrl(url.href, { app: "com.getupnote.desktop", activate: true });
    popclip.showSuccess();
  } catch (err: any) {
    popclip.showText("錯誤: " + (err?.message || String(err)));
  }
}

async function appendToNote(
  input: Input,
  options: Options,
  context: Context,
) {
  try {
    const target = (options.targetNote || "").trim();
    if (!target) {
      popclip.showText("請在設定中填入「特定筆記連結或 ID」");
      return;
    }
    const noteId = extractNoteId(target);
    if (!noteId) {
      popclip.showText("筆記 ID 無效");
      return;
    }

    const content = formatContent(input, options, context);

    // 直接空一行插入：在剪貼簿內容加上單一換行字元（配合後續的 return 鍵實現空一行）
    pasteboard.text = "\n" + content;

    // 開啟 UpNote 目標筆記並啟用應用程式
    await popclip.openUrl(
      `upnote://x-callback-url/openNote?noteId=${encodeURIComponent(noteId)}`,
      { app: "com.getupnote.desktop", activate: true },
    );

    // 確保 UpNote 視窗切換至前景
    try {
      await popclip.runAppleScript('tell application "UpNote" to activate');
    } catch (_) {}

    // 等待 UpNote 視窗切換與筆記載入完成
    await util.sleep(700);

    // 移至筆記最末端
    await popclip.pressKey("command down");
    await util.sleep(120);

    // 空一行
    await popclip.pressKey("return");
    await util.sleep(120);

    // 貼上內容
    await popclip.pressKey("command v");
    await util.sleep(200);

    popclip.showSuccess();
  } catch (err: any) {
    popclip.showText("錯誤: " + (err?.message || String(err)));
  }
}

export const actions: Action<Options>[] = [
  {
    title: "UpNote 新筆記",
    icon: "upnote.svg",
    captureHtml: true,
    code(input, options, context) {
      newNote(input, options, context);
    },
  },
  {
    title: "UpNote 插入特定筆記",
    icon: "symbol:doc.badge.plus",
    captureHtml: true,
    async code(input, options, context) {
      await appendToNote(input, options, context);
    },
  },
  {
    title: "UpNote 新增到特定筆記本",
    icon: "symbol:folder.badge.plus",
    captureHtml: true,
    code(input, options, context) {
      newNoteInNotebook(input, options, context);
    },
  },
];
