# Blog

ポートフォリオサイト＆ブログ

## 🌟 概要

このサイトは、私のスキルやプロジェクトを紹介するためのポートフォリオサイト&ブログ投稿サイトです。

## 🚀 使用技術

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

## 🧹 Linter and Formatter

このプロジェクトでは、**ESLint**でコードのリンティング、**Prettier**でコードの整形を行っています。

### 自動実行の仕組み

これらは、**Git のコミット時に自動的に実行され、適用されます。**

- **husky** - Git hooksの管理
- **lint-staged** - ステージされたファイルのみを処理

### コミット時の動作

`git commit` を実行すると、以下が自動的に実行されます：

1. **JavaScriptファイル** (`.js`, `.jsx`, `.ts`, `.tsx`, `.astro`)
   - ESLintで自動修正
   - Prettierで整形

2. **その他のファイル** (`.json`, `.md`, `.mdx`, `.css`, `.yaml`, `.yml`)
   - Prettierで整形

### 手動実行

コミット前に手動でチェック・修正したい場合：

```bash
# チェックのみ
npm run check

# 自動修正
npm run fix
```

## 🔄 依存関係の自動更新

このプロジェクトでは、**Renovate**を使用して依存関係を自動的に更新しています。

### Renovateの設定

設定ファイル: [`.github/renovate.json`](.github/renovate.json)

**主な設定内容:**

- **実行スケジュール**: 毎週月曜日の午前4時前（Asia/Tokyo）
- **最小リリース期間**: 14日（安定性確保のため）
- **PR制限**: 1時間あたり10件、同時15件まで

### 自動マージのルール

#### ✅ 自動マージされるもの

1. **パッチ・マイナーバージョン**
   - リリースから14日経過後に自動マージ
   - 例: `1.2.3` → `1.2.4` (patch) または `1.3.0` (minor)

2. **開発依存関係 (devDependencies)**
   - リリースから7日経過後に自動マージ
   - より積極的に更新

3. **セキュリティアップデート**
   - 待機期間なしで即座に自動マージ
   - ラベル: `security`, `dependencies`

#### 🔍 手動レビューが必要なもの

- **メジャーバージョンアップ**
  - 破壊的変更の可能性があるため手動レビュー
  - リリースから21日経過後に通知
  - ラベル: `major`, `dependencies`, `renovate`
  - 例: `1.x.x` → `2.0.0`

### パッケージグループ

関連するパッケージは1つのPRにまとめられます：

- **Astro packages** - `astro`, `@astrojs/*`, `astro-*`
- **Linting and formatting** - `eslint`, `prettier`
- **TypeScript** - `typescript`, `@types/*`
- **Tailwind CSS** - `tailwind*`

### GitHub Actionsによる自動承認

[`.github/workflows/autofix.yml`](.github/workflows/autofix.yml)により、以下が自動化されています：

- Renovateが作成したPRを自動承認
- 自動マージの条件を満たしたPRを自動マージ（CI通過後）
- マージ方法: squash merge

### 手動での依存関係更新

必要に応じて手動で更新する場合：

```bash
# 依存関係の更新確認
npm outdated

# 特定のパッケージを更新
npm update <package-name>

# package.jsonのバージョン範囲内で依存関係を更新
npm update
```

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
