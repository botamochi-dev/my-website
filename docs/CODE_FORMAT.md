# コードフォーマット設定

このドキュメントでは、本プロジェクトで使用しているコードフォーマットツールの設定と使用方法について説明します。

## 目次

- [使用ツール](#使用ツール)
- [Prettier設定](#prettier設定)
- [ESLint設定](#eslint設定)
- [自動フォーマット](#自動フォーマット)
- [エディタ設定](#エディタ設定)

## 使用ツール

### Prettier

**役割**: コードの整形（フォーマット）

- JavaScript / TypeScript
- Astro
- JSON
- Markdown
- CSS / YAML

### ESLint

**役割**: コードのリンティング（静的解析）

- 潜在的なバグの検出
- コーディング規約の強制
- ベストプラクティスの適用

### Astro Check

**役割**: Astroコンポーネントの型チェック

- TypeScriptの型エラー検出
- Astro固有の問題の検出

## Prettier設定

### 設定ファイル

**ファイル**: `.prettierrc.cjs`

```javascript
/** @type {import('prettier').Config} */
module.exports = {
  // 印刷幅: 1行の最大文字数
  printWidth: 120,

  // セミコロン: 常に付ける
  semi: true,

  // シングルクォート: 使用する
  singleQuote: true,

  // タブ幅: 2スペース
  tabWidth: 2,

  // 末尾カンマ: ES5準拠（配列・オブジェクトの最後の要素）
  trailingComma: 'es5',

  // タブの使用: スペースを使用
  useTabs: false,

  // プラグイン: Astroファイルのサポート
  plugins: [require.resolve('prettier-plugin-astro')],

  // Astro固有の設定
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
```

### 除外設定

**ファイル**: `.prettierignore`

```
dist
node_modules
.github
.changeset
```

### 主な設定の理由

#### printWidth: 120

```typescript
// ✅ Good - 120文字以内
const user = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' };

// 自動整形される
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15',
};
```

#### singleQuote: true

```typescript
// ✅ Prettierによる整形後
const message = 'Hello, World!';
const greeting = `Hello, ${name}!`; // テンプレートリテラルはバッククォート

// 入力時にダブルクォートでも自動修正される
const message = 'Hello'; // → const message = 'Hello';
```

#### trailingComma: 'es5'

```typescript
// ✅ 末尾カンマあり
const colors = [
  'red',
  'green',
  'blue', // ← 末尾カンマ
];

const config = {
  name: 'app',
  version: '1.0.0', // ← 末尾カンマ
};

// メリット: 新しい行を追加する際のdiffが少なくなる
```

## ESLint設定

### 設定ファイル

**ファイル**: `eslint.config.js`

```javascript
import astroEslintParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    files: ['**/*.{js,jsx,astro}'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },
  {
    files: ['**/*.{ts,tsx}', '**/*.astro/*.js'],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro'],
  },
];
```

### 主なルール

#### TypeScript

- `@typescript-eslint/no-unused-vars` - 未使用変数の警告（`_`で始まる変数は除外）
  - `argsIgnorePattern: '^_'` - 引数名が`_`で始まる場合は無視
  - `destructuredArrayIgnorePattern: '^_'` - 分割代入で`_`で始まる場合は無視
- `@typescript-eslint/no-non-null-assertion` - non-null assertion(`!`)の使用を許可

#### 一般的なJavaScript

- `no-mixed-spaces-and-tabs` - スペースとタブの混在を禁止（smart-tabs使用）
- `no-unused-vars` - 基本ルールをオフ（TypeScript版を使用）
- `no-var` - var宣言を禁止（推奨設定に含まれる）

#### Astro固有

- Astroファイル用のパーサー設定
- `<script>`タグ内のTypeScriptサポート
- Astro推奨ルールセットを適用

#### 除外ファイル

以下のディレクトリ・ファイルはチェック対象外：

- `dist/` - ビルド成果物
- `node_modules/` - 依存関係
- `.github/` - GitHub設定
- `types.generated.d.ts` - 自動生成型定義
- `.astro/` - Astroキャッシュ

## 自動フォーマット

### コミット時の自動実行

**husky + lint-staged**による自動フォーマットが設定されています。

#### 設定ファイル

**package.json**内の`lint-staged`設定:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,astro}": ["eslint --fix", "prettier --write"],
    "*.{json,md,mdx,css,yaml,yml}": ["prettier --write"]
  }
}
```

#### 動作の流れ

```bash
# 1. ファイルをステージング
git add src/components/Header.astro

# 2. コミット実行
git commit -m "feat: ヘッダーコンポーネントを更新"

# 3. 自動実行される処理
# → lint-stagedがステージされたファイルを検出
# → ESLintで自動修正
# → Prettierで整形
# → 修正されたファイルを自動的にステージング
# → コミット完了

# 4. エラーがある場合
# → コミットが中断される
# → エラーメッセージが表示される
# → 手動で修正が必要
```

### 手動実行

#### チェックのみ

```bash
# すべてのチェックを実行
npm run check

# 個別実行
npm run check:astro      # Astro型チェック
npm run check:eslint     # ESLintチェック
npm run check:prettier   # Prettierフォーマットチェック
```

#### 自動修正

```bash
# ESLint + Prettierで自動修正
npm run fix

# 個別実行
npm run fix:eslint       # ESLintのみ
npm run fix:prettier     # Prettierのみ
```

### ファイルタイプ別の処理

| ファイル拡張子  | ESLint | Prettier | 備考                     |
| --------------- | ------ | -------- | ------------------------ |
| `.js`, `.ts`    | ✅     | ✅       | TypeScript型チェック含む |
| `.jsx`, `.tsx`  | ✅     | ✅       | React JSX対応            |
| `.astro`        | ✅     | ✅       | Astroプラグイン使用      |
| `.json`         | ❌     | ✅       | フォーマットのみ         |
| `.md`, `.mdx`   | ❌     | ✅       | マークダウン整形         |
| `.css`          | ❌     | ✅       | スタイル整形             |
| `.yaml`, `.yml` | ❌     | ✅       | YAML整形                 |

## エディタ設定

### Visual Studio Code

#### 推奨拡張機能

`.vscode/extensions.json` で以下の拡張機能を推奨:

```json
{
  "recommendations": ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint", "astro-build.astro-vscode"]
}
```

#### ワークスペース設定

`.vscode/settings.json`:

```json
{
  // 保存時に自動フォーマット
  "editor.formatOnSave": true,

  // デフォルトフォーマッターをPrettierに設定
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 保存時にESLintで自動修正
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // Astroファイル用の設定
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // TypeScriptファイル用の設定
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // JSONファイル用の設定
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## トラブルシューティング

### フォーマットが適用されない

```bash
# Prettierのキャッシュをクリア
npx prettier --write . --cache-location ./.prettier-cache

# または node_modules を再インストール
rm -rf node_modules package-lock.json
npm install
```

### ESLintエラーが解決しない

```bash
# ESLintのキャッシュをクリア
rm -rf .eslintcache

# 再度チェック
npm run check:eslint
```

### コミット時のフックが動作しない

```bash
# huskyを再インストール
rm -rf .husky
npm run prepare

# pre-commitフックの権限を確認（Mac/Linux）
chmod +x .husky/pre-commit
```

### 特定のファイルを除外したい

`.prettierignore` または `.eslintignore` にパターンを追加:

```
# 特定のファイルを除外
src/legacy/old-code.js

# 特定のディレクトリを除外
src/generated/**
```

### 2. エディタの自動フォーマットを活用

- 保存時の自動フォーマットを有効にする
- エラーは早期に修正する

### 3. CI/CDでチェック

GitHub Actionsで自動チェックが実行されます:

- プルリクエスト作成時
- mainブランチへのマージ時

### 4. チーム内で統一

- すべてのメンバーが同じ設定を使用
- エディタの設定ファイルをリポジトリに含める

## 参考資料

- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Astro Prettier Plugin](https://github.com/withastro/prettier-plugin-astro)
- [husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
