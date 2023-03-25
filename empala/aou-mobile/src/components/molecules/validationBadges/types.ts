export class ChecklistItem {
  constructor(msg: string, pattern: RegExp, ok = false) {
    this.msg = msg;
    this.pattern = pattern;
    this.ok = ok;
  }

  msg: string;

  pattern: RegExp;

  ok: boolean;
}
