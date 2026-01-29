# Blog

ポートフォリオサイト＆ブログ

## 🌟 概要

このサイトは、私のスキルやプロジェクトを紹介するためのポートフォリオサイト&ブログ投稿サイトです。

## 📘 開発ドキュメント

開発・運用に関する詳細なドキュメントは [`docs/`](./docs) フォルダを参照してください。

- **[Git / GitHub 運用フロー](./docs/GIT_WORKFLOW.md)** - ブランチ戦略、コミットルール、PRフロー
- **[コーディング & コメント規約](./docs/CODING_STYLE.md)** - コーディングスタイル、命名規則
- **[コードフォーマット設定](./docs/CODE_FORMAT.md)** - Prettier、ESLintの設定と使い方
- **[依存関係管理](./docs/DEPENDENCY_MANAGEMENT.md)** - Renovateによる自動更新、手動更新方法

## ⚙️ 使用技術

### フレームワーク・ライブラリ

- **[Astro 5.0](https://astro.build/)** - 静的サイトジェネレーター
- **[Tailwind CSS](https://tailwindcss.com/)** - CSSフレームワーク
- **[MDX](https://mdxjs.com/)** - Markdown + JSX（ブログ記事用）

### 主要機能

- ✅ **高速パフォーマンス** - Astroによる静的サイト生成
- ✅ **レスポンシブデザイン** - モバイルファーストなUI
- ✅ **ダークモード対応** - テーマ切り替え機能
- ✅ **SEO最適化** - メタタグ、OGP、サイトマップ自動生成
- ✅ **ブログ機能** - カテゴリー・タグ対応、RSSフィード
- ✅ **画像最適化** - Astro Assets使用

### デプロイ

- **[Vercel](https://vercel.com/)** - ホスティング＆自動デプロイ

## 📁 プロジェクト構造

```
/
├── public/              # 静的ファイル
├── src/
│   ├── assets/         # 画像、スタイル
│   ├── components/     # Astroコンポーネント
│   │   ├── blog/      # ブログ関連
│   │   ├── widgets/   # 再利用可能なウィジェット
│   │   └── ui/        # UIコンポーネント
│   ├── content/       # コンテンツコレクション設定
│   ├── data/
│   │   └── post/      # ブログ記事（MDX）
│   ├── layouts/       # ページレイアウト
│   ├── pages/         # ページファイル
│   │   ├── index.astro      # ホーム
│   │   ├── about.astro      # 自己紹介
│   │   ├── portfolio.astro  # ポートフォリオ
│   │   ├── contact.astro    # お問い合わせ
│   │   └── [...blog]/       # ブログページ
│   └── utils/         # ユーティリティ関数
├── vendor/
│   └── integration/   # カスタムAstro統合
└── astro.config.ts    # Astro設定ファイル
```

## 🛠️ 開発環境のセットアップ

### 必要な環境

- Node.js 18.17.1以上、20.3.0以上、または21.0.0以上
- npm または pnpm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/botamochi-dev/blog.git
cd blog

# 依存関係をインストール
npm install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` を開く

### ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` に出力されます。

### プレビュー

```bash
npm run preview
```

ビルドしたサイトをローカルでプレビュー

### コード品質チェック

```bash
# 全チェック実行
npm run check

# Astro型チェック
npm run check:astro

# ESLint
npm run check:eslint

# Prettier
npm run check:prettier
```

### 自動修正

```bash
# ESLint + Prettierで自動修正
npm run fix
```

詳細については、[コードフォーマット設定](./docs/CODE_FORMAT.md)を参照してください。

## 📝 ブログ記事の追加方法

1. `src/data/post/` に新しい `.mdx` ファイルを作成
2. フロントマターを追加:

```mdx
---
publishDate: 2024-01-15T00:00:00Z
title: 記事タイトル
excerpt: 記事の概要
image: https://example.com/image.jpg
category: カテゴリー
tags:
  - タグ1
  - タグ2
---

ここに記事の本文を書く
```

## 🎨 カスタマイズ

### サイト設定

`src/config.yaml` でサイトの基本情報を変更:

```yaml
site:
  name: サイト名
  site: 'https://yourdomain.com'
  base: '/'

metadata:
  title:
    default: デフォルトタイトル
  description: 'サイトの説明'
```

### ナビゲーション

`src/navigation.ts` でヘッダー・フッターのリンクを編集

### スタイル

`src/assets/styles/tailwind.css` でTailwindのカスタム設定

## 🚀 デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 自動的にビルド・デプロイされる

**設定:**

- Framework Preset: `Astro`
- Build Command: `npm run build`
- Output Directory: `dist`

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

このサイトは [AstroWind](https://github.com/arthelokyo/astrowind) テンプレートをベースに作成されました。
