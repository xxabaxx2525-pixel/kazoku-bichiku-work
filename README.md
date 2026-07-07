# kazoku-bichiku-work

動画「止まりにくい備蓄運用」に連動した、ステージ2-5｜ワーク①「家族で使える備蓄ワーク」です。

## 目的

備蓄をたくさん買うことだけでなく、家族が迷わず使える形に整えるための記録・確認・保存用ワークです。

## 主な機能

- ステージ番号、動画名、ワーク番号の表示
- 共通デザインCSSを使ったワークブック風UI
- 共通保存モジュールを使った端末内自動保存
- 回答まとめの表示
- 共通PDFモジュールによるPDF保存
- スマホ表示対応

## 公開用ファイル

- `index.html`
- `outputs/家族で使える備蓄ワーク_見本.html`
- `styles/rakukaji-design-system.css`
- `components/rakukaji-ui.js`
- `data/rakukaji-storage.js`
- `pdf/pdf-save-adapter.js`
- `assets/keroty.png`

`publish-github.ps1` は `outputs` 内のHTMLを GitHub Pages の `index.html` として公開し、共通デザイン・保存・PDF・アセット用ファイルも一緒に反映します。

## 共通化メモ

現在のPDF保存は共通PDFモジュールを使用しています。ただし、共通PDFモジュールは診断結果型の出力を前提としているため、このワークの自由記入欄は要約してPDFへ出力します。自由記入ワーク専用のPDFレイアウトは、共通PDFモジュール側の拡張候補です。
