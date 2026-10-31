# 明智君OS v0.5.1

## 入力から問いへ着地する工程

追加したこと：

- 「この現在地で問いを作る」ボタン
- ボタンを押すと入力欄のキーボードを閉じる
- 最初の「設計に投げる」カードまで自動スクロール
- iPhoneキーボードの改行キーでも同じ動作
- 現在地の保存、履歴、タスク化はしない

## GitHubへ上げるファイル

- index.html
- script.js
- current-location.css

既存の style.css と visibility.css は残してください。

## 2026-11-01｜PWA接続・クリップボード安全修理

現行v0.5.1の4モード本文を変えない局所施工です。

- index.htmlのheadへmanifestを接続し、同一ディレクトリのicon-192.pngをiOSホーム画面用に指定しました。
- manifest.jsonのアイコン参照は、実ファイルの置き場所に合わせました。
- Service Worker登録を画面に接続。シェルのindex、JS、CSS、manifest、アイコンを初回起動時にキャッシュする設計へ変更しました。
- Service Workerはこのアプリのパス範囲だけを処理し、キャッシュ整理ではakechi-os専用キー以外を削除しません。
- クリップボードAPIの失敗やexecCommand=falseを成功扱いせず、画面の文章欄を手動コピーする案内を出します。

検収：コピーの模擬QA7/7、PWAの相対パス・構成QA10/10、Service Worker模擬イベント6/6 PASS。実iPhoneのホーム画面追加、実オフライン起動、Pages配信は未確認。Service Workerを登録するだけでオフライン動作が保証されるわけではありません。

