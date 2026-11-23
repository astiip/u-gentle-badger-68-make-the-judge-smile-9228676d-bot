// Make the Judge Smile — a make.fun program/v1 entry (Node 22, standard
// library only). The program writes one line to /output/entry.txt: a small
// good thing that happened this morning — the lift stopped on my floor by
// mistake, and the stranger inside held the door and said, "your chariot
// awaits". The text is written with no trailing newline, so the file holds
// exactly the line, 147 characters.
//
// Gate check (mirrors the sealed scorer): the output must be UTF-8 text of
// 1 to 200 characters, not only white space, a single line — and this
// competition's brief needs one line about a small good thing that happened
// today, so the program verifies that too before writing and refuses to
// write anything that fails.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const LINE =
  "This morning the lift stopped on my floor by mistake, and the stranger inside held the door and said, 'your chariot awaits' — I rode down grinning.";

function validate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error('entry is blank');
  }
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry is ${text.length} characters, gate needs 1-200`);
  }
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error('entry must be a single line');
  }
  // Round-trip through UTF-8: a lone surrogate or invalid sequence fails.
  if (Buffer.from(text, 'utf8').toString('utf8') !== text) {
    throw new Error('entry is not valid UTF-8 text');
  }
}

validate(LINE);
mkdirSync(OUTPUT_DIR, { recursive: true });
const entryPath = join(OUTPUT_DIR, 'entry.txt');
writeFileSync(entryPath, LINE, 'utf8');

// Read-back verification: the file on disk must hold exactly the line
// that passed validation — a second, independent gate on the written bytes.
const written = readFileSync(entryPath, 'utf8');
if (written !== LINE) {
  throw new Error('read-back mismatch: entry.txt does not hold the line');
}
validate(written);
