import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'works'>;

let warned = false;

/** 一覧での並び順（order が小さいほど上）で、下書きを除いた作品を返す */
export const fetchWorks = async (): Promise<Work[]> => {
  const works = (await getCollection('works'))
    .filter((w) => !w.data.draft)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));

  // テスト用のデータを消し忘れたまま公開しないように、本番のビルドで知らせる
  if (import.meta.env.PROD && !warned) {
    const tests = works.filter((w) => w.data.test).map((w) => w.id);
    if (tests.length) console.warn(`[works] テスト用の作品が残っています: ${tests.join(', ')}`);
    warned = true;
  }
  return works;
};

export const formatPeriod = ({ start, end }: Work['data']['period']): string =>
  end ? (end === start ? start : `${start} 〜 ${end}`) : `${start} 〜`;

export const formatTeam = (team: number): string => `${team} 人`;
