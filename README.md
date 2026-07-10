# coffee-recording-note

コーヒーの抽出記録アプリ「抽出ノート」。React（CDN 版）+ babel-standalone で動く、ビルド不要の静的サイトです。

## ファイル構成

```
index.html                 HTML の外枠と script の読み込み順
css/
  app.css                  ページ全体のスタイル
js/
  storage.js               localStorage を包む window.storage
  constants.js             デザイントークン・保存キー・フォーム初期値
  utils.js                 時間の整形/解析、豆と湯の比率計算
  styles.js                画面をまたいで使うインラインスタイル（input / label / chip）
  main.js                  ReactDOM によるマウント
  components/
    Bean.js                豆の形の評価アイコン
    EntryCard.js           1杯分の記録カード
    BeansView.js           豆の一覧画面
    BeanDetail.js          豆の詳細画面（記録一覧＋ソート）
    BrewForm.js            記録フォーム（タイマー・注湯記録を含む）
    CoffeeLog.js           アプリ本体（状態・保存処理・画面切り替え）
```

状態と保存処理はすべて `CoffeeLog.js` にあり、各画面コンポーネントは props で受け取った値を表示するだけです。

babel-standalone は `text/babel` の各ファイルを独立したスコープで実行するため、コンポーネントは各ファイル末尾の `window.X = X` で共有しています。新しいコンポーネントを足すときは、同じように window に公開して `index.html` の読み込み順に追加してください（依存するファイルより後に置く）。

## ローカルでの動かし方

babel-standalone が JS ファイルを XHR で読み込むため、`index.html` を直接開く（`file://`）のではなく HTTP サーバー経由で表示してください。

```sh
python3 -m http.server 8000
# http://localhost:8000 を開く
```
