// サイト全体で使うプロフィールとメニューの中身。[ ] で囲んだものは仮置きなので、決まったら差し替える

export const PROFILE = {
  name: 'botamochi',
  role: '[目指す職種：ゲームプログラマー（仮）]',
  tagline: '物理と動きの手ざわりを作るのが好きです。（テスト用の文章）',
  affiliation: '[大学・学年]',
  strengths: '[得意なこと]',
  favoriteGames: '[好きなゲームと、その理由]',
  // 公開用のアドレスが決まるまでは空にしておく。空のときは画面に [メールアドレス] と出す
  email: '',
  github: 'https://github.com/botamochi-dev',
  githubName: 'botamochi-dev',
  // 応募用の PDF ができたら public/ に置いてパスを書く
  pdf: '',
  history: [
    { date: '20XX.04', text: '[できごと。テスト用]' },
    { date: '20XX.10', text: '[できごと。テスト用]' },
    { date: '2026.01', text: 'このサイトを作り始める' },
  ],
};

export type WorkCategory = 'game' | 'gfx' | 'tool' | 'web';

export const WORK_CATEGORIES: { id: WorkCategory; label: string }[] = [
  { id: 'game', label: 'ゲーム' },
  { id: 'gfx', label: 'グラフィックス' },
  { id: 'tool', label: 'ツール' },
  { id: 'web', label: 'Web' },
];

export const categoryLabel = (id: string): string => WORK_CATEGORIES.find((c) => c.id === id)?.label ?? id;

// works の slug で、その技術を使った作品を指す
export const SKILLS: { name: string; experience: string; works: string[] }[] = [
  { name: 'C++', experience: '[経験年数]', works: ['test-physics'] },
  { name: 'C#', experience: '[経験年数]', works: ['test-team'] },
  { name: 'Unity', experience: '[経験年数]', works: ['test-team'] },
  { name: 'GLSL / WebGL', experience: '[経験年数]', works: ['test-shader'] },
  { name: 'Python', experience: '[経験年数]', works: ['test-motion'] },
  { name: 'TypeScript', experience: '[経験年数]', works: ['my-website', 'test-editor'] },
  { name: 'mcfunction', experience: '8 年ほど', works: [] },
  { name: 'Git / GitHub', experience: '[経験年数]', works: ['my-website'] },
];

export const TOP_MENU = [
  { id: 'works', label: 'WORKS', ja: '作品', path: 'works' },
  { id: 'about', label: 'ABOUT', ja: 'わたしについて', path: 'about' },
  { id: 'skills', label: 'SKILLS', ja: 'できること', path: 'skills' },
  { id: 'blog', label: 'BLOG', ja: 'ブログ', path: 'blog' },
  { id: 'contact', label: 'CONTACT', ja: '連絡先', path: 'contact' },
] as const;
