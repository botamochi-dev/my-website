# 依存関係管理

このドキュメントでは、本プロジェクトにおける依存関係の管理方法について説明します。

## 目次

- [Renovate自動更新](#renovate自動更新)
- [設定の詳細](#設定の詳細)
- [手動での依存関係管理](#手動での依存関係管理)
- [トラブルシューティング](#トラブルシューティング)

## Renovate自動更新

このプロジェクトでは、**Renovate**を使用して依存関係を自動的に更新しています。

**設定ファイル**: [`.github/renovate.json`](../.github/renovate.json)

設定の中身は設定ファイルを直接参照してください。ここでは、どの更新がどう扱われるかをまとめます。

### 主な設定内容

| 設定項目                       | 値                              | 説明                                   |
| ------------------------------ | ------------------------------- | -------------------------------------- |
| **実行スケジュール**           | 毎週月曜日 午前4時前            | Asia/Tokyo タイムゾーン                |
| **待機期間（既定）**           | リリースから14日                | 公開直後の不具合や乗っ取りを避けるため |
| **lockfile の更新**            | 毎月1日 午前4時前               | 間接的な依存もまとめて最新にする       |
| **コミットプレフィックス**     | `chore(deps):`                  | Conventional Commits準拠               |
| **マージ戦略**                 | squash                          | コミット履歴を整理                     |
| **プラットフォーム自動マージ** | 有効                            | GitHub側の自動マージ機能を使用         |
| **PR制限**                     | 1時間に10件まで、同時に15件まで | 過度な通知を防ぐ                       |

## 設定の詳細

### 更新の種類ごとの扱い

| 更新の種類                               | 待機期間 | 自動マージ |
| ---------------------------------------- | -------- | ---------- |
| dependencies のパッチ・マイナー          | 14日     | CI通過後   |
| devDependencies のパッチ・マイナー       | 7日      | CI通過後   |
| digest の更新（GitHub Actions など）     | 14日     | CI通過後   |
| lockfile の更新（月1回）                 | —        | CI通過後   |
| メジャーバージョンアップ（すべての依存） | 21日     | しない     |
| 脆弱性の修正（GitHub の脆弱性アラート）  | なし     | CI通過後   |

- メジャーバージョンアップには `major` ラベルが付き、手動でレビューしてマージする
- 「メジャーは自動マージしない」ルールは、ほかのルールに上書きされないよう `packageRules` の最後に置いている。ルールを追加するときは、このルールより前に置く
- 脆弱性の修正 PR には `security` ラベルが付く

### パッケージグループ化

関連するパッケージは1つのPRにまとめられます。パターンは `matchPackageNames` に正規表現（`/.../`）で書きます。

| グループ                 | 対象                                         |
| ------------------------ | -------------------------------------------- |
| `Astro packages`         | `astro`, `@astrojs/*`, `astro-*`             |
| `Linting and formatting` | 名前に `eslint` または `prettier` を含むもの |
| `TypeScript`             | 名前に `typescript` を含むもの, `@types/*`   |
| `Tailwind CSS`           | 名前に `tailwind` を含むもの                 |

### 自動マージの流れ

1. RenovateがPRを作成
2. **GitHub Actions CI**が実行（[`.github/workflows/actions.yaml`](../.github/workflows/actions.yaml)）
3. CIと Vercel のプレビューが成功したら、GitHub の自動マージ機能で squash merge される

自動マージは Renovate の `platformAutomerge` が行うので、専用のワークフローは置いていない。ブランチのルールセットは承認を必須にしていないため、自動承認も不要。

### CI/CDワークフロー

**ワークフローファイル**: [`.github/workflows/actions.yaml`](../.github/workflows/actions.yaml)

| ジョブ           | 内容                                               |
| ---------------- | -------------------------------------------------- |
| `Build and Test` | `npm ci` と `npm run build`                        |
| `check`          | `npm run check`（`astro check`・ESLint・Prettier） |

- 両方のジョブとも、Node.js のバージョンはリポジトリ直下の [`.node-version`](../.node-version) に従う。Vercel・手元の開発環境と同じ版でビルドするため
- `package.json` の `engines` は `.node-version` の版を含む範囲にしておく。Vercel は `engines` の範囲から Node.js のバージョンを選ぶ
- トークンの権限は `contents: read` に絞っている
- 同じブランチで新しい CI が始まると、古い CI は取り消される（`concurrency`）

#### 必須チェック

`main` のルールセットで、`Build and Test`・`check`・`Vercel` を必須チェックにしている。ジョブ名やジョブの数を変えたときは、GitHub の **Settings → Rules → Rulesets** で必須チェックも合わせて変える。変えないと、存在しないチェックを待ち続けて PR がマージできなくなる。

### Node.js のバージョンを上げるとき

1. `.node-version` の版を変える
2. `package.json` の `engines` に新しい版が含まれるようにする
3. `npm run build` と `npm run check` が通ることを確かめる

Renovate は `.node-version` の更新 PR も作る。メジャーバージョンなので自動マージはされない。

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
git commit -m "chore(deps): 依存関係を更新した"

# ❌ Bad - package-lock.jsonを削除・無視しない
# 再現可能なビルドのために必須
```

### 3. 定期的なメンテナンス

- **週次**: Renovateが自動でPRを作成し、CIが通ればマージされる
- **月次**: lockfile の更新PR（自動マージ）と、たまっているメジャーバージョンアップPRのレビュー
- **随時**: セキュリティアラートへの対応
- **随時**: [Dependency Dashboard](https://github.com/botamochi-dev/my-website/issues/5) で、止まっているPRがないか確認する

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
git commit -m "chore(deps): 依存関係を更新した"
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
npx --package renovate -- renovate-config-validator --strict .github/renovate.json
```

### 自動マージが失敗する

**原因と対処:**

1. **CIが失敗**
   - ビルドエラーやリントエラーを修正
   - ローカルで`npm run check`を実行
   - 新しい版が今の Node.js に対応していないことがある。PR のログで `engines` や `node:` から始まるモジュールのエラーを確認する

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
- [`.github/workflows/actions.yaml`](../.github/workflows/actions.yaml) - CI/CDワークフロー
- [`.node-version`](../.node-version) - CI・Vercel・手元で使う Node.js のバージョン
- [`package.json`](../package.json) - 依存関係定義、スクリプト、lint-staged設定

### 関連ドキュメント

- [Git / GitHub 運用フロー](./GIT_WORKFLOW.md)
- [コードフォーマット設定](./CODE_FORMAT.md)
- [README.md](../README.md)
