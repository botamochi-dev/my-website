import { getPermalink, getBlogPermalink } from './utils/permalinks';

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
      title: 'リソース',
      links: [
        { text: 'GitHub', href: 'https://github.com/botamochi-dev' },
        { text: 'ブログ記事', href: getBlogPermalink() },
      ],
    },
  ],
  socialLinks: [{ ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/botamochi-dev' }],
  footNote: `
    © 2026 botamochi-dev · All rights reserved.
  `,
};
