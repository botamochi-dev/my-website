// .agents/skills（Codex が読む）を .claude/skills（Claude Code が読む）へ丸ごとコピーする。
// core.symlinks が false の環境でも両方のエージェントが同じスキルを読めるように、リンクではなく実ファイルで揃える。
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '.agents', 'skills');
const target = join(root, '.claude', 'skills');

if (!existsSync(source)) {
  console.error(`${source} が見つかりません`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
console.log(`.agents/skills → .claude/skills にコピーしました`);
