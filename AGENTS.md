# AGENTS.md

AIコーディングエージェント（Claude Code / Codex など）向けのプロジェクトガイドです。
人間向けの詳細は [README.md](./README.md) と [`docs/`](./docs) を参照してください。

## プロジェクト概要

- botamochi の個人サイト（ポートフォリオ + ブログ）。[AstroWind](https://github.com/arthelokyo/astrowind) テンプレートがベース
- **Astro 7**（`output: 'static'`）+ **Tailwind CSS 4** + **MDX**、TypeScript
- Tailwind の設定は `src/assets/styles/tailwind.css` の `@theme` などに書く（`tailwind.config.js` は無い）
- Vercel に自動デプロイ（`main` へのマージで本番反映）
- サイトの言語は日本語。UIテキスト・ドキュメント・コミットメッセージの本文も日本語で書く

## ドキュメントとコードが食い違うとき

このファイル・`docs/`・Skill などのドキュメントと既存のコードが食い違うときは、
**既存のコードの書き方に従う**。見つけた食い違いは、最後の返答ですべて挙げる。

## コマンド

```bash
npm install          # 依存関係のインストール（lockfile は package-lock.json）
npm run dev          # 開発サーバー http://localhost:4321
npm run build        # 本番ビルド（dist/ に出力）
npm run preview      # ビルド結果のプレビュー
npm run check        # astro check + eslint + prettier --check（CIと同じ）
npm run fix          # eslint --fix + prettier -w
```

- パッケージマネージャーは **npm** のみ。pnpm / yarn は使わない
- テストフレームワークは無い。変更後は最低限 `npm run check` と `npm run build` が通ることを確認する

## ディレクトリ構成

| パス                          | 内容                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- |
| `src/pages/`                  | ルーティング（`index`, `about`, `portfolio`, `contact`, `[...blog]/`） |
| `src/components/widgets/`     | ページを構成するセクション（Hero, Features, Footer など）              |
| `src/components/ui/`          | 汎用UIパーツ                                                           |
| `src/components/blog/`        | ブログ一覧・記事表示                                                   |
| `src/components/common/`      | メタデータ、テーマ切替、解析などの共通処理                             |
| `src/layouts/`                | ページレイアウト                                                       |
| `src/data/post/YYYY/MM/DD.md` | ブログ記事（Markdown / MDX）                                           |
| `src/content.config.ts`       | コンテンツコレクションのスキーマ（記事フロントマターの定義）           |
| `src/config.yaml`             | サイト全体の設定（サイト名、SEO、ブログ設定など）                      |
| `src/navigation.ts`           | ヘッダー・フッターのリンク定義                                         |
| `src/utils/`                  | パーマリンク、画像最適化、ブログ取得などのユーティリティ               |
| `vendor/integration/`         | `src/config.yaml` を読み込む AstroWind 独自の Astro インテグレーション |
| `docs/`                       | 開発ルールのドキュメント                                               |

- `src/` 配下は `~/` エイリアスで import する（例: `import Image from '~/components/common/Image.astro';`）
- `dist/`, `.astro/`, `node_modules/` は生成物なので編集しない

## コーディング規約

詳細は [docs/CODING_STYLE.md](./docs/CODING_STYLE.md) と [docs/CODE_FORMAT.md](./docs/CODE_FORMAT.md)。要点:

- Prettier: 2スペース、シングルクォート、セミコロンあり、`printWidth: 120`、`trailingComma: 'es5'`
- 改行コードは LF、UTF-8
- `var` と `any` は使わない。関数はアロー関数で書く（既存の `export async function` 2か所はそのままでよい）
- 未使用の引数・変数は `_` プレフィックスで明示する
- Astro コンポーネントは `interface Props` で型を定義し、frontmatter は「import → 型 → Props → ロジック」の順
- ファイル名: コンポーネントは PascalCase（`BlogCard.astro`）、ユーティリティは camelCase
- コメントは「何を」ではなく「なぜ」を書く
- スタイルは Tailwind のユーティリティクラスを基本とし、既存コンポーネントの書き方に合わせる
- 新しいコンポーネントを作る前に、`widgets/` や `ui/` に流用できるものがないか確認する

## ブログ記事

- 記事は `src/data/post/YYYY/MM/DD.md` に置く。フロントマターの例:

  ```md
  ---
  publishDate: 2026-02-21
  title: 記事タイトル
  excerpt: 概要（省略可）
  category: コラム
  tags:
    - プログラミング
  draft: false
  ---
  ```

- フロントマターのスキーマは `src/content.config.ts` が正。項目を追加するときはここも更新する
- **記事本文はオーナー本人が書くもの。** 明示的に頼まれない限り、記事の本文を新規執筆・書き換えしない（誤字修正やフォーマット修正も、依頼があった場合のみ）

## Git / PR

詳細は [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)。

- `main` へ直接プッシュしない。作業ブランチ `<type>/<description>`（例: `feat/add-blog-search`）を切り、PR 経由でマージする
- コミットメッセージは Conventional Commits の1行だけ: `<type>(<scope>): <やったこと>`（例: `fix(header): レスポンシブ表示の不具合を直した`）
  - scope は必ず付ける（例: `blog`, `header`, `deps`, `config`, `docs`）。やったことは日本語で「〜した」で終え、句点と本文は付けない
  - type: `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`
- コミット時に husky + lint-staged が ESLint / Prettier を自動実行する。フックをスキップ（`--no-verify`）しない
- CI（`.github/workflows/actions.yaml`）は `.node-version` の Node.js で `npm run build`（`Build and Test`）と `npm run check`（`check`）を実行する。ジョブ名を変えるときは、GitHub のルールセットの必須チェックも変える必要がある
- Node.js のバージョンは `.node-version` が正。`package.json` の `engines` もこれに合わせる
- コミット・プッシュ・PR作成はユーザーに頼まれたときだけ行う

## 依存関係

詳細は [docs/DEPENDENCY_MANAGEMENT.md](./docs/DEPENDENCY_MANAGEMENT.md)。

- 依存関係の更新は Renovate が自動で行う（パッチ・マイナーは自動マージ）。依頼がない限り、エージェントが勝手にバージョンを上げない
- パッケージを追加・更新したら `package.json` と `package-lock.json` を両方コミットする
- 新しい依存を追加する前に、既存の依存や標準機能で実現できないか検討する

## リポジトリのスキル

`.agents/skills/` にスキルを同梱している（Codex はここを読む）。Claude Code は `.claude/skills/` を読むので、同じ内容をコピーして置いている。配布元と取得コミットは各フォルダの `UPSTREAM.json` に記録する。

- スキルを追加・更新するときは `.agents/skills/` だけを編集し、`npm run skills:sync` で `.claude/skills/` に反映する。`.claude/skills/` を直接編集しない
- スキルの手順と、このリポジトリの既存の構成・配色・共通部品が食い違うときは、リポジトリ側を優先する。サイト全体の作り直しはしない
- スキルのフォルダは Prettier / ESLint の対象外。配布元の内容を書き換えない

同梱しているスキル:

- [astro-framework](.agents/skills/astro-framework/SKILL.md)（delineas/astro-framework-agents, MIT）— Astro のコンポーネント・ルーティング・コンテンツコレクション・画像。このサイトは `output: 'static'` で、コレクションは `src/content.config.ts` に定義している。SSR・セッション・Server Islands の項目は対象外
- [frontend-design](.agents/skills/frontend-design/SKILL.md)（anthropics/skills）— レイアウト・文字組み・視覚的な階層の設計
- [web-design-guidelines](.agents/skills/web-design-guidelines/SKILL.md)（vercel-labs/agent-skills）— UI/UX・アクセシビリティの点検
- [unslop](.agents/skills/unslop/SKILL.md)（heydamir/unslop, CC BY 4.0）— AI が作ったように見える UI の兆候（グラデーション・光る影・絵文字・字間を広げた大文字の見出しなど）の点検と手直し。CC BY 4.0 なので作者の表記を残す
- [playwright](.agents/skills/playwright/SKILL.md)（openai/skills）— ブラウザ操作と画面の確認。`npm run dev`（http://localhost:4321）を開いて確かめる
- emilkowalski/skills から、動きと仕上げのスキル（MIT）: [emil-design-eng](.agents/skills/emil-design-eng/SKILL.md)（仕上げの考え方と点検表）・[animate](.agents/skills/animate/SKILL.md)・[choreograph](.agents/skills/choreograph/SKILL.md)（複数要素の動きの順序）・[improve-animations](.agents/skills/improve-animations/SKILL.md)・[review-animations](.agents/skills/review-animations/SKILL.md)・[remove-animations](.agents/skills/remove-animations/SKILL.md)・[find-animation-opportunities](.agents/skills/find-animation-opportunities/SKILL.md)・[animation-performance](.agents/skills/animation-performance/SKILL.md)・[animation-vocabulary](.agents/skills/animation-vocabulary/SKILL.md)・[apple-design](.agents/skills/apple-design/SKILL.md)・[break-ui](.agents/skills/break-ui/SKILL.md)（極端なデータでの崩れの点検）・[pick-ui-library](.agents/skills/pick-ui-library/SKILL.md)・[prototype](.agents/skills/prototype/SKILL.md)。このサイトは React / Framer Motion を使っていないので、動きは CSS と素の JavaScript で実装する。React Native・Expo・Swift・Sonner 用のものは対象外なので入れていない
