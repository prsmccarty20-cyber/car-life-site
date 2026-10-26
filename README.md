# car-life-site
車の維持費や乗り換えを考えるための情報サイト

## しくみ
- 記事は `src/articles/` に Markdown（文字だけのファイル）で置く。書き方は `記事テンプレート.md` を見る
- サイト名などは `src/_data/site.json` で変える
- GitHub に送ると、Cloudflare Pages が自動でサイトを作り直して公開する

## 手元で見る
```bash
npm install
npm start
```
ブラウザで http://localhost:8080 を開く。

## Cloudflare Pages の設定
- ビルドコマンド：`npm run build`
- 出力フォルダ：`_site`
