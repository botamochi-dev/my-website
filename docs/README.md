# プロジェクトドキュメント

このディレクトリには、プロジェクトの開発・運用に関する重要なドキュメントが含まれています。

## 📚 ドキュメント一覧

### [Git / GitHub 運用フロー](./GIT_WORKFLOW.md)

Gitのブランチ戦略、コミットルール、プルリクエストのフローについて説明しています。

**内容:**

- ブランチ戦略（mainブランチ、作業ブランチ）
- コミットメッセージ規約（Conventional Commits）
- プルリクエストの作成とマージ
- GitHub Actionsによる自動化
- よくある質問とトラブルシューティング

### [コーディング & コメント規約](./CODING_STYLE.md)

TypeScript、Astro、CSS/Tailwind CSSのコーディング規約とコメントの書き方について説明しています。

**内容:**

- 一般的な規約（ファイル構成、インデント）
- TypeScript/JavaScriptの規約
- Astroコンポーネントの書き方
- CSS/Tailwind CSSの規約
- コメント規約（JSDoc、インラインコメント）
- 命名規則

### [コードフォーマット設定](./CODE_FORMAT.md)

Prettier、ESLint、自動フォーマットの設定と使用方法について説明しています。

**内容:**

- Prettierの設定（`.prettierrc.cjs`）
- ESLintの設定（`eslint.config.js`）
- 自動フォーマット（husky + lint-staged）
- エディタ設定（VS Code）
- トラブルシューティング

### [依存関係管理](./DEPENDENCY_MANAGEMENT.md)

Renovateによる自動更新と手動での依存関係管理について説明しています。

**内容:**

- Renovate自動更新の仕組み
- 自動マージのルール
- パッケージグループ化
- GitHub Actionsによる自動化
- 手動での依存関係更新方法
- トラブルシューティング

### よくある質問

#### Q: コミット前に何をチェックすればいい？

自動でチェックされますが、手動で確認したい場合：

```bash
npm run check  # すべてのチェックを実行
npm run fix    # 自動修正
```

#### Q: ブランチ名はどうすればいい？

```bash
feat/feature-name    # 新機能
fix/bug-description  # バグ修正
docs/update-readme   # ドキュメント更新
```

詳細は [Git / GitHub 運用フロー](./GIT_WORKFLOW.md#ブランチ戦略) を参照。

#### Q: コードフォーマットはいつ実行される？

`git commit` 時に自動的に実行されます。詳細は [コードフォーマット設定](./CODE_FORMAT.md#自動フォーマット) を参照。

## 🔧 開発環境のセットアップ

### 必須ツール

- Node.js 18.17.1以上
- npm または pnpm
- Git

### VS Code拡張機能（推奨）

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)

### セットアップ手順

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd <project-directory>

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動
npm run dev

# 4. ブラウザで確認
# http://localhost:4321
```

## 📖 参考リンク

- [README.md](../README.md) - プロジェクト概要
- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
