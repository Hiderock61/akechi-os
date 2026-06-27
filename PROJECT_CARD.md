# PROJECT_CARD

## このアプリは何？
- 明智君OS（Akechi OS） v0.4 は「地上に降りたAIの4ボタンリモコン」です。起動 / 一手 / 退避 / 帰還 の4モードから1つを選び、各モードごとに用意された「外部AIへ投げる問い」をワンクリックでコピーして外部の会話AI（Gemini / Copilot / ゲストAI 等）に貼って使う、ビルド不要の静的ウェブアプリ。

## 現在の状態
- フロントエンドは完成度が高く、index.html / script.js / style.css で動作する実装がある。  
- 各モード（MODES オブジェクト）に対するプロンプト（gemini, copilot, guest）が定義され、コピー機能・トースト表示・lastMode の localStorage 保存が実装済み。  
- README に機能説明・方針・Pages の手順とバージョン（v0.4）が記載。akechi-os-v0.3-package.zip と PWA 用の manifest.json / service-worker.js / アイコンも同梱されている。

## 状態ラベル
- 本命（公開向けプロダクト候補）

## 主な機能
- 4ボタン（起動 / 一手 / 退避 / 帰還）によるモード選択 UI。  
- モードごとの「外部AIへ投げる問い」を表示（Gemini / Copilot / ゲストAI 向け）し、テキストをワンクリックでクリップボードにコピー。  
- コピー完了トーストの表示。  
- 最終使用モードと日時を localStorage に保存・表示。  
- 複数の HTML バリエーション（kachi-minimal.html / kachi-win-feel.html）およびパッケージ（ZIP）を含む配布材料。

## GitHub Pages公開
- そのまま公開可能：静的ファイル一式で動作するため、README にある手順どおり main ブランチのルートを Pages に指定すればデモURLが得られる。公開する HTML（index.html が標準候補）を決めれば即公開できる。

## PWA要素
- manifest.json とアイコン（icon-192.png / icon-512.png）が同梱されている。  
- service-worker.js が含まれており、PWA 対応（オフラインキャッシュ等）の土台がある。  
- README では v0.5 で PWA 対応予定とあるが、現状ですでに manifest と service-worker が入っているため Pages 上で動作確認すれば PWA 挙動を試せる。

## 足りないもの
- LICENSE ファイル（公開・再利用条件の明示がない）。  
- README にデモ（Pages）URL の明記や、どの HTML を公式デモにするかの指示。  
- スクリーンショット / GIF（UIを素早く把握できる資料）。  
- CONTRIBUTING / Issue テンプレ（外部貢献・不具合報告フロー）。  
- manifest/service-worker の動作説明（Pages 上での期待動作・既知の制限）。  
- CHANGELOG の明確な差分（v0.4 → v0.5 の予定との差分）。

## 触らないこと
- index.html / script.js / style.css / manifest.json / service-worker.js / README.md のコードや文言は変更しない。  
- 各モードのプロンプト本文やコピー文を勝手に編集しない。  
- サイトの見た目・リンク構造・アプリ挙動を変更しない。  
- README や LICENSE の作成・追加は、この指示では行わない。

## 次にやること
（コードを触らない整理作業）
1. どの HTML（index.html / kachi-minimal.html / kachi-win-feel.html）を公式デモにするか決定する。  
2. GitHub Pages を有効化してデモ URL を取得し README に追記する（公開HTMLを明記）。  
3. LICENSE を選定して追加（所有者の方針に従う）。  
4. README にスクリーンショットと PWA の簡易説明（manifest / service-worker の有無）を追記するドラフトを作成。  
5. akechi-os-v0.3-package.zip の用途（配布用か旧版か）を確認して README に明記。  
6. repository description と topics を整備（例: akechi-os, pwa, prompt-tool）。  
7. Issue を作成して残タスクを可視化（PWA polishing、スクリーンショット、アクセシビリティ、テスト等）。  
8. Pages 上で manifest/service-worker 挙動を簡易検証し、動作メモを残す。

## APP_MAP.mdに載せる一行説明
- 明智君OS — 地上に降りたAIのための4ボタンリモコン（起動・一手・退避・帰還）／v0.4（静的ウェブ、外部AIへ投げる問いをコピー）。

## メモ
- 根拠ファイル：README.md, index.html, script.js, style.css, manifest.json, service-worker.js, icon-192.png / icon-512.png, akechi-os-v0.3-package.zip（リポジトリの実在ファイルのみを根拠に作成）。  
- 設計上「外部AIに貼って使う」方式であり、アプリ内での会話や外部への自動送信は行わない点に注意。公開時は外部AIへ貼る前の注意（個人情報など）を README に明記すると安全性が高まる。  
- この下書きはファイル追加を行わないドラフトです。追加する場合は指示をください.
