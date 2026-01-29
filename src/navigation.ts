import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'ホーム',
      href: getPermalink('/'),
    },
    {
      text: '自己紹介',
      href: getPermalink('/about'),
    },
    {
      text: 'ポートフォリオ',
      href: getPermalink('/portfolio'),
    },
    {
      text: 'ブログ',
      href: getBlogPermalink(),
    },
    {
      text: 'お問い合わせ',
      href: getPermalink('/contact'),
    },
  ],
  actions: [
    { text: 'GitHubを見る', href: 'https://github.com/botamochi-dev', target: '_blank', icon: 'tabler:brand-github' },
  ],
};

export const footerData = {
  links: [
    {
      title: 'ナビゲーション',
      links: [
        { text: 'ホーム', href: getPermalink('/') },
        { text: '自己紹介', href: getPermalink('/about') },
        { text: 'ポートフォリオ', href: getPermalink('/portfolio') },
        { text: 'ブログ', href: getBlogPermalink() },
        { text: 'お問い合わせ', href: getPermalink('/contact') },
      ],
    },
    {
      title: '技術スタック',
      links: [
        { text: 'React', href: '#' },
        { text: 'Vue.js', href: '#' },
        { text: 'Astro', href: '#' },
        { text: 'Node.js', href: '#' },
        { text: 'Python', href: '#' },
      ],
    },
    {
      title: 'リソース',
      links: [
        { text: 'ドキュメント', href: '#' },
        { text: 'GitHub', href: 'https://github.com/botamochi-dev' },
        { text: 'ブログ記事', href: getBlogPermalink() },
      ],
    },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/botamochi-dev' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © 2026 botamochi-dev · All rights reserved.
  `,
};
