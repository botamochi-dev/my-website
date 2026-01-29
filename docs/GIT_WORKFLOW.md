# Git / GitHub 運用フロー

このドキュメントでは、本プロジェクトにおけるGit/GitHubの運用フローとルールについて説明します。

## 目次

- [ブランチ戦略](#ブランチ戦略)
- [コミットフロー](#コミットフロー)
- [プルリクエスト](#プルリクエスト)
- [自動化](#自動化)

## ブランチ戦略

### メインブランチ

- **`main`** - 本番環境にデプロイされるブランチ
  - 常にデプロイ可能な状態を保つ
  - 直接プッシュは禁止
  - プルリクエスト経由でマージ

### 作業ブランチ

作業用のブランチは以下の命名規則に従って作成します：

```
<type>/<description>
```

**Type の種類:**

- `feat/` - 新機能の追加
- `fix/` - バグ修正
- `docs/` - ドキュメントの変更
- `style/` - コードスタイルの変更（フォーマット、セミコロンなど）
- `refactor/` - リファクタリング
- `test/` - テストの追加・修正
- `chore/` - ビルドプロセスやツールの変更

**例:**

```bash
feat/add-blog-search
fix/header-responsive-issue
docs/update-readme
```

## コミットフロー

### 1. ブランチの作成

```bash
# mainブランチから最新の状態を取得
git checkout main
git pull origin main

# 作業ブランチを作成
git checkout -b feat/your-feature-name
```

### 2. コミット

#### コミットメッセージ規約

本プロジェクトでは **Conventional Commits** に従います。

**フォーマット:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更（空白、フォーマットなど）
- `refactor`: バグ修正でも機能追加でもないコード変更
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更

**例:**

```bash
git commit -m "feat(blog): ブログ検索機能を追加"
git commit -m "fix(header): レスポンシブ表示の不具合を修正"
git commit -m "docs: READMEに環境構築手順を追加"
```

#### 自動フォーマット

コミット時には以下が自動的に実行されます：

- **ESLint** - コードのリンティングと自動修正
- **Prettier** - コードの整形

これは [husky](https://github.com/typicode/husky) と [lint-staged](https://github.com/okonet/lint-staged) によって管理されています。

### 3. プッシュ

```bash
# リモートリポジトリにプッシュ
git push origin feat/your-feature-name
```

## プルリクエスト

### プルリクエストの作成

1. GitHub上でプルリクエストを作成
2. 適切なタイトルと説明を記載
3. レビュアーを指定（チーム開発の場合）

### プルリクエストのテンプレート

```markdown
## 変更内容

<!-- 何を変更したか、なぜ変更したかを記載 -->

## 変更の種類

- [ ] 新機能
- [ ] バグ修正
- [ ] ドキュメント更新
- [ ] リファクタリング
- [ ] その他:

## チェックリスト

- [ ] コードが正しくビルドできる
- [ ] ESLint/Prettierのチェックが通る
- [ ] 動作確認を行った
- [ ] 必要に応じてドキュメントを更新した
```

### マージ

- **マージ方法**: Squash and merge を推奨
- **マージ後**: ローカルのmainブランチを更新

```bash
git checkout main
git pull origin main
git branch -d feat/your-feature-name
```

## 自動化

### GitHub Actions

#### CI/CD（`.github/workflows/actions.yaml`）

- **トリガー**: `main`ブランチへのプッシュ、プルリクエスト
- **実行内容**:
  - Node.js 18, 20, 22でのビルドテスト
  - ESLint、Prettier、Astroチェック

#### Renovate自動マージ（`.github/workflows/autofix.yml`）

- **トリガー**: Renovateによるプルリクエスト
- **実行内容**:
  - パッチ・マイナーバージョンアップの自動承認
  - CI通過後に自動マージ
  - メジャーバージョンアップは手動レビュー

### Renovate

依存関係の自動更新については、[依存関係管理](./DEPENDENCY_MANAGEMENT.md) を参照してください。

## よくある質問

### Q: コミットメッセージを間違えた場合は？

```bash
# 直前のコミットメッセージを修正
git commit --amend -m "正しいメッセージ"

# すでにプッシュ済みの場合（注意: 強制プッシュ）
git push --force-with-lease origin your-branch-name
```

### Q: コミットを取り消したい場合は？

```bash
# 直前のコミットを取り消し（変更は残る）
git reset --soft HEAD~1

# 直前のコミットを完全に取り消し（変更も削除）
git reset --hard HEAD~1
```

## 参考資料

- [Conventional Commits](https://www.conventionalcommits.org/ja/)
- [GitHub Flow](https://docs.github.com/ja/get-started/quickstart/github-flow)
- [Semantic Versioning](https://semver.org/lang/ja/)
