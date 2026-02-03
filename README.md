# botamochi-dev website

## 🌟 概要

[AstroWind](https://github.com/arthelokyo/astrowind) テンプレートをベースに作成したbotamochiのウェブサイト。

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
- ✅ **ブログ機能** - カテゴリー・タグ対応
- ✅ **シンプル運用** - Vercelによる自動デプロイ

### デプロイ

- **[Vercel](https://vercel.com/)** - ホスティング＆自動デプロイ

## 📁 プロジェクト構造

```text
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
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/botamochi-dev/blog.git
cd blog

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` を開きます。

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
# 全チェック実行（型チェック、ESLint、Prettier）
npm run check

# 自動修正（ESLint + Prettier）
npm run fix
```

## 📝 ブログ記事の追加方法

1. `src/data/post/` 内に新しい `.md` または `.mdx` ファイルを作成します（例: `src/data/post/my-first-post.md`）。
2. ファイルの先頭にフロントマター（メタデータ）を記述します:

```md
---
publishDate: 2026-02-03
title: 記事のタイトル
excerpt: 記事の短い概要（省略可）
image: ~/assets/images/post-image.jpg # アイキャッチ画像（省略可）
category: 技術 # カテゴリー（省略可）
tags:
  - Astro
  - Tailwind
draft: false # trueにすると下書き扱いとなり、ビルドに含まれません
---

ここに記事の本文をMarkdown形式で記述します。
```

## 🚀 デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 自動的にビルド・デプロイされる

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

このサイトは [AstroWind](https://github.com/arthelokyo/astrowind) テンプレートをベースに作成されました。
