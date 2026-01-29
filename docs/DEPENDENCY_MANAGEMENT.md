# 依存関係管理

このドキュメントでは、本プロジェクトにおける依存関係の管理方法について説明します。

## 目次

- [Renovate自動更新](#renovate自動更新)
- [設定の詳細](#設定の詳細)
- [手動での依存関係管理](#手動での依存関係管理)
- [トラブルシューティング](#トラブルシューティング)

## Renovate自動更新

このプロジェクトでは、**Renovate**を使用して依存関係を自動的に更新しています。

### 基本設定

**設定ファイル**: [`.github/renovate.json`](../.github/renovate.json)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":dependencyDashboard",
    ":semanticCommits",
    ":automergeDigest",
    ":automergePatch",
    ":automergeMinor"
  ],
  "timezone": "Asia/Tokyo",
  "schedule": ["before 4am on Monday"],
  "labels": ["dependencies", "renovate"],
  "commitMessagePrefix": "chore(deps):",
  "prHourlyLimit": 10,
  "prConcurrentLimit": 15,
  "minimumReleaseAge": "14 days",
  "internalChecksFilter": "strict",
  "automerge": true,
  "automergeType": "pr",
  "automergeStrategy": "squash",
  "platformAutomerge": true,
  "ignoreTests": false
}
```

### 主な設定内容

| 設定項目                       | 値                   | 説明                           |
| ------------------------------ | -------------------- | ------------------------------ |
| **実行スケジュール**           | 毎週月曜日 午前4時前 | Asia/Tokyo タイムゾーン        |
| **最小リリース期間**           | 14日                 | 安定性確保のため               |
| **PR時間制限**                 | 10件/時間            | 過度な通知を防ぐ               |
| **PR同時制限**                 | 15件                 | リポジトリの整理               |
| **コミットプレフィックス**     | `chore(deps):`       | Conventional Commits準拠       |
| **自動マージ**                 | 有効                 | CI通過後に自動マージ           |
| **マージ戦略**                 | squash               | コミット履歴を整理             |
| **プラットフォーム自動マージ** | 有効                 | GitHub側の自動マージ機能を使用 |
| **内部チェックフィルター**     | strict               | 厳格なチェック                 |
| **テスト無視**                 | false                | テストを実行する               |

## 設定の詳細

### 自動マージのルール

#### ✅ 自動マージされる更新

1. **パッチバージョン** (`1.2.3` → `1.2.4`)
   - リリースから14日経過後に自動マージ
   - バグ修正や小さな改善

2. **マイナーバージョン** (`1.2.0` → `1.3.0`)
   - リリースから14日経過後に自動マージ
   - 新機能追加（後方互換性あり）

3. **開発依存関係** (devDependencies)
   - リリースから7日経過後に自動マージ
   - より積極的に更新
   - ビルドツール、テストツールなど

4. **セキュリティアップデート**
   - 待機期間なしで即座に自動マージ
   - 脆弱性修正を最優先
   - ラベル: `security`, `dependencies`

#### 🔍 手動レビューが必要な更新

- **メジャーバージョン** (`1.x.x` → `2.0.0`)
  - 破壊的変更 (Breaking Changes) の可能性
  - リリースから21日経過後に通知
  - 手動でのテストとレビューが必要
  - ラベル: `major`, `dependencies`, `renovate`

### パッケージグループ化

関連するパッケージは1つのPRにまとめられ、効率的にレビューできます。

#### Astro packages

```json
{
  "groupName": "Astro packages",
  "matchPackagePatterns": ["^astro$", "^@astrojs/", "^astro-"]
}
```

- `astro`
- `@astrojs/sitemap`, `@astrojs/mdx`, `@astrojs/tailwind` など
- `astro-icon`, `astro-embed` など

#### Linting and formatting

```json
{
  "groupName": "Linting and formatting",
  "matchPackagePatterns": ["eslint", "prettier"]
}
```

- `eslint`, `@eslint/js`
- `prettier`, `prettier-plugin-astro`
- `eslint-plugin-astro` など

#### TypeScript

```json
{
  "groupName": "TypeScript",
  "matchPackagePatterns": ["typescript", "^@types/"]
}
```

- `typescript`
- `@types/node`, `@types/lodash.merge` など

#### Tailwind CSS

```json
{
  "groupName": "Tailwind CSS",
  "matchPackagePatterns": ["tailwind"]
}
```

- `tailwindcss`
- `@tailwindcss/typography`
- `tailwind-merge`

### GitHub Actionsによる自動化

**ワークフローファイル**: [`.github/workflows/autofix.yml`](../.github/workflows/autofix.yml)

```yaml
name: Renovate auto-merge

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  check_suite:
    types: [completed]

permissions:
  contents: write
  pull-requests: write
  checks: read

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'renovate[bot]'
    steps:
      - name: Auto-approve Renovate PRs
        if: github.event_name == 'pull_request'
        uses: hmarr/auto-approve-action@v4
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Enable auto-merge
        if: github.event_name == 'pull_request' && !contains(github.event.pull_request.labels.*.name, 'major')
        run: gh pr merge --auto --squash "${{ github.event.pull_request.number }}"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**動作フロー:**

1. RenovateがPRを作成
2. **GitHub Actions CI**が実行（[`.github/workflows/actions.yaml`](../.github/workflows/actions.yaml)）
   - Node.js 18, 20, 22でのビルドテスト
   - Node.js 24でのコードチェック（ESLint、Prettier、Astro）
3. **pull_requestイベント時**: メジャーバージョンでない場合、自動承認
4. **CIが成功**したら自動マージ（squash merge）
5. ローカルの`main`ブランチを更新

**ポイント:**

- `github.actor == 'renovate[bot]'`の条件により、Renovateのみが対象
- `if: github.event_name == 'pull_request'`で承認はPR作成時のみ
- メジャーバージョンアップには`major`ラベルが付与され、自動マージされない

### CI/CDワークフロー

**ワークフローファイル**: [`.github/workflows/actions.yaml`](../.github/workflows/actions.yaml)

#### Build and Testジョブ

```yaml
jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version:
          - 18
          - 20
          - 22
    steps:
      - uses: actions/checkout@v6
      - name: Use Node.js v${{ matrix.node-version }}
        uses: actions/setup-node@v5
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run build
```

**目的:**

- 複数のNode.jsバージョン（18, 20, 22）で互換性を確認
- ビルドが正常に完了することを検証

#### Checkジョブ

```yaml
check:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6
    - name: Use Node.js 24
      uses: actions/setup-node@v5
      with:
        node-version: 24
        cache: npm
    - run: npm ci
    - run: npm run check
```

**目的:**

- ESLint、Prettier、Astroの型チェックを実行
- コード品質を保証

**注意:**

- Node.js 24を使用（最新バージョンでのチェック）
- `npm run check`は以下を実行:
  - `astro check` - Astro型チェック
  - `eslint .` - ESLintチェック
  - `prettier --check .` - Prettierフォーマットチェック

#### Concurrency設定

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

同じブランチで複数のCIジョブが実行されないよう制御し、リソースを節約します。

## 手動での依存関係管理

### 更新確認

```bash
# すべての依存関係の更新を確認
npm outdated

# 結果の例:
# Package         Current  Wanted  Latest  Location
# astro           5.12.9   5.12.9  5.13.0  node_modules/astro
# typescript      5.8.3    5.8.3   5.9.0   node_modules/typescript
```

### 特定のパッケージを更新

```bash
# パッチ・マイナーバージョンのみ更新
npm update <package-name>

# 最新バージョンに更新（メジャーも含む）
npm install <package-name>@latest

# 例:
npm update astro           # package.jsonの範囲内で更新
npm install astro@latest   # 最新版に更新
```

### すべての依存関係を更新

```bash
# package.jsonのバージョン範囲内で更新
npm update

# 注意: メジャーバージョンアップは含まれない
# 例: package.json に "astro": "^5.0.0" の場合
#     → 5.x.x の最新には更新されるが、6.0.0 には更新されない
```

### package.jsonの編集後

```bash
# 依存関係を再インストール
npm install

# または完全にクリーンインストール
rm -rf node_modules package-lock.json
npm install
```

### セキュリティ監査

```bash
# セキュリティ脆弱性をチェック
npm audit

# 自動修正可能な脆弱性を修正
npm audit fix

# メジャーバージョンアップも含めて修正
npm audit fix --force
```

## 依存関係のベストプラクティス

### 1. バージョン範囲の指定

**package.jsonでの指定方法:**

```json
{
  "dependencies": {
    "astro": "^5.12.9", // マイナー・パッチ更新を許可
    "limax": "4.2.2" // 固定バージョン
  },
  "devDependencies": {
    "typescript": "^5.8.3" // マイナー・パッチ更新を許可
  }
}
```

**記号の意味:**

- `^5.12.9` - `>=5.12.9 <6.0.0` (マイナー・パッチのみ)
- `~5.12.9` - `>=5.12.9 <5.13.0` (パッチのみ)
- `5.12.9` - 正確にこのバージョンのみ

### 2. package-lock.jsonの管理

```bash
# ✅ Good - package-lock.jsonをコミット
git add package-lock.json
git commit -m "chore(deps): update dependencies"

# ❌ Bad - package-lock.jsonを削除・無視しない
# 再現可能なビルドのために必須
```

### 3. 定期的なメンテナンス

- **週次**: Renovateが自動でPRを作成
- **月次**: メジャーバージョンアップのレビュー
- **随時**: セキュリティアラートへの対応

### 4. 更新前のチェックリスト

```bash
# 1. 現在の状態を確認
git status

# 2. 最新のmainブランチに更新
git checkout main
git pull origin main

# 3. 依存関係を更新
npm update

# 4. ビルドとテストを実行
npm run build
npm run check

# 5. 動作確認
npm run dev
# ブラウザで動作を確認

# 6. コミット
git add package.json package-lock.json
git commit -m "chore(deps): update dependencies"
```

## トラブルシューティング

### Renovateが動作しない

**症状**: PRが作成されない

**確認事項:**

1. GitHub Appの権限確認
2. `.github/renovate.json`の構文エラー
3. スケジュール設定（月曜日午前4時前のみ実行）

```bash
# 設定ファイルの検証
npx renovate-config-validator
```

### 自動マージが失敗する

**原因と対処:**

1. **CIが失敗**
   - ビルドエラーやリントエラーを修正
   - ローカルで`npm run check`を実行

2. **メジャーバージョンアップ**
   - 意図的に手動レビューが必要
   - PRの内容を確認してマージ

3. **コンフリクト**
   - mainブランチを更新してリベース
   ```bash
   git checkout main
   git pull origin main
   ```

### 依存関係の競合

**症状**: `npm install`が失敗する

```bash
# 1. キャッシュをクリア
npm cache clean --force

# 2. 完全に再インストール
rm -rf node_modules package-lock.json
npm install

# 3. それでも解決しない場合
# package.jsonのバージョン指定を確認
# 互換性のないバージョンの組み合わせをチェック
```

### 古いバージョンがインストールされる

```bash
# 1. package-lock.jsonを削除
rm package-lock.json

# 2. 依存関係を再解決
npm install

# 3. 特定のパッケージのみ更新
npm install <package-name>@latest
```

## 参考資料

### ドキュメント

- [Renovate Documentation](https://docs.renovatebot.com/)
- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/lang/ja/)
- [GitHub Actions Documentation](https://docs.github.com/ja/actions)

### 関連ファイル

- [`.github/renovate.json`](../.github/renovate.json) - Renovate設定
- [`.github/workflows/autofix.yml`](../.github/workflows/autofix.yml) - 自動マージワークフロー
- [`.github/workflows/actions.yaml`](../.github/workflows/actions.yaml) - CI/CDワークフロー
- [`package.json`](../package.json) - 依存関係定義、スクリプト、lint-staged設定

### 関連ドキュメント

- [Git / GitHub 運用フロー](./GIT_WORKFLOW.md)
- [コードフォーマット設定](./CODE_FORMAT.md)
- [README.md](../README.md)
