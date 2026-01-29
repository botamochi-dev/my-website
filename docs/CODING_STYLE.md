# コーディング & コメント規約

このドキュメントでは、本プロジェクトにおけるコーディング規約とコメントの書き方について説明します。

## 目次

- [一般的な規約](#一般的な規約)
- [TypeScript / JavaScript](#typescript--javascript)
- [Astro](#astro)
- [CSS / Tailwind CSS](#css--tailwind-css)
- [コメント規約](#コメント規約)
- [命名規則](#命名規則)

## 一般的な規約

### ファイル構成

- 1ファイル = 1コンポーネント/機能を原則とする
- 関連するファイルは同じディレクトリにまとめる
- 100行を超えるファイルは分割を検討する

### インデント・スペース

- **インデント**: 2スペース
- **行末のスペース**: 削除する（Prettierで自動削除）
- **最終行**: 必ず改行を入れる

### 文字コード

- **エンコーディング**: UTF-8
- **改行コード**: LF（`\n`）

## TypeScript / JavaScript

### 基本ルール

#### セミコロン

```typescript
// ✅ Good - セミコロンを使用
const message = 'Hello, World!';
console.log(message);

// ❌ Bad
const message = 'Hello, World!';
console.log(message);
```

#### クォート

```typescript
// ✅ Good - シングルクォートを使用
const name = 'John Doe';
const greeting = `Hello, ${name}!`; // テンプレートリテラルはバッククォート

// ❌ Bad
const name = 'John Doe';
```

#### 変数宣言

```typescript
// ✅ Good - const/letを使用
const API_URL = 'https://api.example.com';
let counter = 0;

// ❌ Bad - varは使わない
var message = 'Hello';
```

#### アロー関数

```typescript
// ✅ Good - アロー関数を優先
const add = (a: number, b: number): number => a + b;

const fetchData = async (): Promise<Data> => {
  const response = await fetch(API_URL);
  return response.json();
};

// ❌ Bad - 不要なfunctionキーワード（コールバック以外）
function add(a, b) {
  return a + b;
}
```

### 型定義

#### 型アノテーション

```typescript
// ✅ Good - 明示的な型定義
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = (id: number): User => {
  // ...
};

// ✅ Good - 推論可能な場合は省略可
const count = 10; // number型と推論される
const users: User[] = [];
```

#### any型の使用

```typescript
// ❌ Bad - any型は避ける
const data: any = fetchData();

// ✅ Good - 適切な型を定義
interface ApiResponse {
  status: number;
  data: unknown;
}

const response: ApiResponse = fetchData();
```

### 非同期処理

```typescript
// ✅ Good - async/awaitを使用
const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch('/api/posts');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// ❌ Bad - 過度なPromiseチェーン
const fetchPosts = (): Promise<Post[]> => {
  return fetch('/api/posts')
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
```

## Astro

### コンポーネント構造

```astro
---
// 1. インポート
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';

// 2. 型定義
interface Props {
  title: string;
  description?: string;
}

// 3. Props
const { title, description = 'Default description' } = Astro.props;

// 4. ロジック
const posts = await fetchPosts();
const filteredPosts = posts.filter((post) => post.published);
---

<!-- 5. テンプレート -->
<Layout title={title}>
  <Header />
  <main>
    <h1>{title}</h1>
    {description && <p>{description}</p>}
    <ul>
      {filteredPosts.map((post) => <li>{post.title}</li>)}
    </ul>
  </main>
</Layout>

<!-- 6. スタイル -->
<style>
  main {
    padding: 2rem;
  }
</style>
```

### Props定義

```typescript
// ✅ Good - インターフェースで型定義
interface Props {
  title: string;
  description?: string;
  published?: boolean;
}

const { title, description, published = true } = Astro.props;

// ❌ Bad - 型定義なし
const { title, description } = Astro.props;
```

## CSS / Tailwind CSS

### Tailwind クラスの順序

```astro
<!-- ✅ Good - 論理的な順序 -->
<div class="flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-2">
  <!-- コンテンツ -->
</div>

<!-- 推奨順序 -->
<!-- 1. レイアウト (flex, grid, block) -->
<!-- 2. 配置 (items-center, justify-between) -->
<!-- 3. サイズ (w-full, h-screen) -->
<!-- 4. スペーシング (p-4, m-2) -->
<!-- 5. タイポグラフィ (text-lg, font-bold) -->
<!-- 6. 色 (bg-blue-500, text-white) -->
<!-- 7. その他 (rounded, shadow) -->
```

### カスタムCSS

```css
/* ✅ Good - BEM記法に近い命名 */
.blog-post {
  @apply prose prose-lg;
}

.blog-post__header {
  @apply mb-4;
}

.blog-post__title {
  @apply text-3xl font-bold;
}

/* ❌ Bad - 曖昧な命名 */
.post {
  /* ... */
}
.title {
  /* ... */
}
```

## コメント規約

### JSDoc形式のコメント

```typescript
/**
 * ユーザー情報を取得する
 *
 * @param userId - ユーザーID
 * @returns ユーザー情報のPromise
 * @throws ユーザーが見つからない場合にエラー
 *
 * @example
 * const user = await getUser(123);
 * console.log(user.name);
 */
const getUser = async (userId: number): Promise<User> => {
  // 実装
};
```

### インラインコメント

```typescript
// ✅ Good - 「なぜ」を説明
// Safariでのバグ回避のため、一時的にタイムアウトを追加
await new Promise((resolve) => setTimeout(resolve, 100));

// ❌ Bad - 「何を」だけを説明（コードを見ればわかる）
// タイムアウトを100ms待つ
await new Promise((resolve) => setTimeout(resolve, 100));
```

### TODOコメント

```typescript
// TODO: キャッシュ機能を実装する
// FIXME: エッジケースでエラーが発生する可能性がある
// HACK: 一時的な回避策、後でリファクタリングが必要
// NOTE: この処理は非同期で実行される
```

### コンポーネントのドキュメント

```astro
---
/**
 * ブログ記事のカード表示コンポーネント
 *
 * 記事のサムネイル、タイトル、概要、公開日を表示します。
 *
 * @component
 * @example
 * <BlogCard
 *   title="記事タイトル"
 *   excerpt="記事の概要"
 *   image="/images/post.jpg"
 *   publishedDate={new Date()}
 * />
 */
interface Props {
  title: string;
  excerpt: string;
  image?: string;
  publishedDate: Date;
}

const { title, excerpt, image, publishedDate } = Astro.props;
---
```

## 命名規則

### ファイル名

```
✅ Good
BlogCard.astro          # コンポーネント - PascalCase
formatDate.ts           # ユーティリティ - camelCase
post.d.ts               # 型定義 - kebab-case
user-service.ts         # サービス - kebab-case

❌ Bad
blogcard.astro
FormatDate.ts
Post.d.ts
UserService.ts
```

### 変数・関数

```typescript
// ✅ Good
const userName = 'John';
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

const getUserName = (): string => {
  // ...
};

const isLoggedIn = (): boolean => {
  // ...
};

// ❌ Bad
const UserName = 'John';
const apibaseurl = 'https://api.example.com';
const max_retry_count = 3;

const GetUserName = () => {
  // ...
};
```

### 型・インターフェース

```typescript
// ✅ Good - PascalCase
interface User {
  id: number;
  name: string;
}

type PostStatus = 'draft' | 'published' | 'archived';

// ❌ Bad
interface user {
  id: number;
  name: string;
}

type postStatus = 'draft' | 'published';
```

### クラス

```typescript
// ✅ Good - PascalCase
class BlogPostManager {
  private posts: Post[] = [];

  public addPost(post: Post): void {
    this.posts.push(post);
  }
}

// ❌ Bad
class blogPostManager {
  // ...
}
```

### 定数

```typescript
// ✅ Good - UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const API_ENDPOINTS = {
  POSTS: '/api/posts',
  USERS: '/api/users',
};

// ❌ Bad
const maxFileSize = 1024 * 1024 * 5;
const apiEndpoints = {
  posts: '/api/posts',
};
```

## ベストプラクティス

### DRY原則（Don't Repeat Yourself）

```typescript
// ❌ Bad - 重複コード
const formatUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

const formatAuthorName = (author: Author): string => {
  return `${author.firstName} ${author.lastName}`;
};

// ✅ Good - 共通化
const formatFullName = (person: { firstName: string; lastName: string }): string => {
  return `${person.firstName} ${person.lastName}`;
};
```

### 早期リターン

```typescript
// ❌ Bad
const processUser = (user: User | null): void => {
  if (user !== null) {
    if (user.isActive) {
      if (user.email) {
        sendEmail(user.email);
      }
    }
  }
};

// ✅ Good
const processUser = (user: User | null): void => {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.email) return;

  sendEmail(user.email);
};
```

### 関数の単一責任

```typescript
// ❌ Bad - 複数の責任
const getUserAndSendEmail = async (userId: number): Promise<void> => {
  const user = await fetchUser(userId);
  const email = formatEmail(user);
  await sendEmail(email);
};

// ✅ Good - 責任を分離
const getUser = async (userId: number): Promise<User> => {
  return await fetchUser(userId);
};

const sendWelcomeEmail = async (user: User): Promise<void> => {
  const email = formatEmail(user);
  await sendEmail(email);
};
```

## 参考資料

- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Astro Documentation](https://docs.astro.build/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
