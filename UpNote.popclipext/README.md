# UpNote PopClip 擴充功能（修復與增強版 v2）

此擴充功能修復了原版 UpNote PopClip 外掛在自訂安裝時出現的 `Unsigned extension identifier` 簽署錯誤與按鍵執行失敗錯誤，並新增了「**新增到特定筆記中（直接空一行插入）**」以及「**新增到特定筆記本**」兩大功能。

## 功能特點

1. **建立新筆記 (New Note)**
   - 將選取的文字（支援 Markdown / 格式化文字與純文字）直接在 UpNote 中建立為新筆記。
   - 若文字來自瀏覽器，自動在末尾附上來源網頁連結。
2. **新增到特定筆記 (Append to Specific Note)**
   - 將選取內容追加至您指定的 UpNote 筆記最末端。
   - **自動直接空一行插入**，不需手動換行排版。
   - 支援可選加入時間戳記（如 `- 14:30`）。
3. **新增到特定筆記本 (New Note in Specific Notebook)**
   - 直接將選取的內容在指定的 UpNote 筆記本中建立新筆記。
   - 支援多層筆記本路徑（例如「工作」或「筆記本/子筆記本」）。

## 安裝方法

雙擊 `UpNote.popclipextz` 檔案，在 PopClip 跳出的確認視窗中點擊「安裝」即可完成。

## 設定指南

點擊 macOS 頂部選單列上的 **PopClip 圖示 -> 偏好設定（齒輪） -> 擴充功能 -> UpNote**：

1. **特定筆記連結或 ID**：
   - 打開 UpNote，對想收集文字的筆記按右鍵，選擇 **「複製筆記連結」 (Copy Link to Note)**。
   - 貼入此欄位（支援 `upnote://x-callback-url/openNote?noteId=...` 或純 ID）。
2. **特定筆記本名稱**：
   - 輸入您想存放筆記的筆記本名稱（例如 `工作` 或 `Inbox`）。
